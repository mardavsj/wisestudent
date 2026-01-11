import RolePermission from '../models/RolePermission.js';
import User from '../models/User.js';

/**
 * Professional Permission Checking Utilities
 * Industry-level permission enforcement system
 */

/**
 * Get user's role permissions from database
 * @param {String} userId - User ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object|null} RolePermission document or null
 */
export const getUserRolePermissions = async (userId, tenantId) => {
  try {
    const user = await User.findById(userId).select('role tenantId orgId campusId').lean();
    if (!user || !user.role) {
      return null;
    }

    // Map user role to roleType
    const roleTypeMap = {
      'school_admin': 'school_admin',
      'campus_admin': 'campus_admin',
      'counselor': 'counselor',
      'school_teacher': 'school_teacher',
    };

    const roleType = roleTypeMap[user.role];
    if (!roleType) {
      return null;
    }

    const rolePermission = await RolePermission.findOne({
      tenantId: tenantId || user.tenantId,
      roleType,
      isActive: true
    }).lean();

    return rolePermission;
  } catch (error) {
    console.error('Error fetching user role permissions:', error);
    return null;
  }
};

/**
 * Check if user has a specific permission
 * @param {Object} rolePermission - RolePermission document
 * @param {String} permission - Permission name (e.g., 'createStudent')
 * @returns {Boolean}
 */
export const hasPermission = (rolePermission, permission) => {
  if (!rolePermission || !rolePermission.permissions) {
    return false;
  }

  // For school_admin, grant all permissions by default (super admin)
  if (rolePermission.roleType === 'school_admin') {
    return true;
  }

  return rolePermission.permissions[permission] === true;
};

/**
 * Check if user can access a specific campus
 * @param {Object} rolePermission - RolePermission document
 * @param {String} userCampusId - User's campus ID
 * @param {String} targetCampusId - Campus ID to check access for
 * @returns {Boolean}
 */
export const canAccessCampus = (rolePermission, userCampusId, targetCampusId) => {
  if (!rolePermission) {
    return false;
  }

  // School admin can access all campuses
  if (rolePermission.roleType === 'school_admin') {
    return true;
  }

  // If no campus restrictions, allow access
  if (!rolePermission.campusRestrictions || rolePermission.campusRestrictions.length === 0) {
    // For campus_admin, check if it's their own campus
    if (rolePermission.roleType === 'campus_admin') {
      return userCampusId === targetCampusId;
    }
    return true;
  }

  // Check campus restrictions
  const restriction = rolePermission.campusRestrictions.find(
    r => r.campusId === targetCampusId
  );

  if (restriction) {
    return restriction.canAccess === true;
  }

  // Default: campus_admin can only access their own campus
  if (rolePermission.roleType === 'campus_admin') {
    return userCampusId === targetCampusId;
  }

  return true;
};

/**
 * Check multiple permissions at once
 * @param {Object} rolePermission - RolePermission document
 * @param {Array<String>} permissions - Array of permission names
 * @param {String} mode - 'all' (AND) or 'any' (OR), default: 'all'
 * @returns {Boolean}
 */
export const hasPermissions = (rolePermission, permissions, mode = 'all') => {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  if (mode === 'any') {
    return permissions.some(permission => hasPermission(rolePermission, permission));
  }

  return permissions.every(permission => hasPermission(rolePermission, permission));
};

/**
 * Get all permissions for a role
 * @param {Object} rolePermission - RolePermission document
 * @returns {Array<String>} Array of permission names that are true
 */
export const getAllPermissions = (rolePermission) => {
  if (!rolePermission || !rolePermission.permissions) {
    return [];
  }

  return Object.entries(rolePermission.permissions)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
};

/**
 * Middleware factory to check permissions
 * @param {String|Array<String>} requiredPermissions - Permission(s) required
 * @param {Object} options - Options { mode: 'all'|'any', requireCampus: boolean }
 * @returns {Function} Express middleware
 */
export const requirePermission = (requiredPermissions, options = {}) => {
  const { mode = 'all', requireCampus = false } = options;
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }

      const tenantId = req.tenantId || req.user.tenantId;
      let rolePermission = await getUserRolePermissions(req.user._id, tenantId);

      // Allow school admins even if role permissions are not configured yet.
      if (!rolePermission && req.user?.role === 'school_admin') {
        rolePermission = { roleType: 'school_admin', permissions: {} };
      }

      if (!rolePermission) {
        return res.status(403).json({
          success: false,
          message: 'No role permissions found. Please contact administrator.'
        });
      }

      // Check permissions
      const hasRequiredPermissions = hasPermissions(rolePermission, permissions, mode);
      if (!hasRequiredPermissions) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission(s): ${permissions.join(', ')}`,
          requiredPermissions: permissions,
          userRole: rolePermission.roleType
        });
      }

      // Check campus access if required
      if (requireCampus && req.params.campusId) {
        const canAccess = canAccessCampus(
          rolePermission,
          req.user.campusId,
          req.params.campusId
        );

        if (!canAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You do not have permission to access this campus.'
          });
        }
      }

      // Attach role permission to request for use in controllers
      req.rolePermission = rolePermission;
      req.userPermissions = getAllPermissions(rolePermission);

      next();
    } catch (error) {
      console.error('Error in permission middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Check if user can perform action on resource
 * @param {Object} req - Express request object
 * @param {String|Array<String>} permissions - Required permissions
 * @param {String} campusId - Optional campus ID to check
 * @returns {Object} { allowed: boolean, reason?: string }
 */
export const checkResourceAccess = async (req, permissions, campusId = null) => {
  try {
    if (!req.user) {
      return { allowed: false, reason: 'Authentication required' };
    }

    const tenantId = req.tenantId || req.user.tenantId;
    const rolePermission = await getUserRolePermissions(req.user._id, tenantId);

    if (!rolePermission) {
      return { allowed: false, reason: 'No role permissions found' };
    }

    const perms = Array.isArray(permissions) ? permissions : [permissions];
    const hasRequiredPermissions = hasPermissions(rolePermission, perms, 'all');

    if (!hasRequiredPermissions) {
      return { 
        allowed: false, 
        reason: `Missing required permissions: ${perms.join(', ')}` 
      };
    }

    // Check campus access if campusId provided
    if (campusId) {
      const canAccess = canAccessCampus(
        rolePermission,
        req.user.campusId,
        campusId
      );

      if (!canAccess) {
        return { allowed: false, reason: 'Campus access denied' };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking resource access:', error);
    return { allowed: false, reason: 'Error checking permissions' };
  }
};

