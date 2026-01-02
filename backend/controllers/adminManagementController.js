import User from '../models/User.js';
import Redemption from '../models/Redemption.js';
import Organization from '../models/Organization.js';
import ActivityLog from '../models/ActivityLog.js';
import UserSubscription from '../models/UserSubscription.js';
import bcrypt from 'bcrypt';
import { generateAvatar } from '../utils/avatarGenerator.js';

// Admin Panel Data
export const getAdminPanel = async (req, res) => {
  try {
    const [totalSchools, totalUsers, studentCount] = await Promise.all([
      Organization.countDocuments({ type: 'school', isActive: true }),
      User.countDocuments(),
      User.countDocuments({ role: { $in: ['student', 'school_student'] } })
    ]);

    const data = {
      dashboardStats: studentCount,
      totalStudents: studentCount, // Also include as totalStudents for consistency
      totalUsers,
      totalSchools
    };

    res.json({
      success: true,
      data
    });

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:stats:update', data);
    }
  } catch (error) {
    console.error('Error fetching admin panel:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin panel data' });
  }
};

// Admin Analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    const totalSchools = await Organization.countDocuments({ type: 'school' });
    const activeUsers = await User.countDocuments({ 
      lastActiveAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const activityRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    const growthRate = newUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;

    const totalSessions = await ActivityLog.countDocuments({ createdAt: { $gte: startDate } });
    const avgSessionTime = 15; // Placeholder - would calculate from activity logs

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSchools,
        activityRate,
        growthRate,
        totalSessions,
        avgSessionTime,
        engagementRate: activityRate
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics data' });
  }
};

// Get All Students
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    } else {
      query.role = { $in: ['student', 'school_student'] };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('name email phone role status createdAt schoolName')
      .populate('schoolId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        students: students.map(s => ({
          _id: s._id,
          name: s.name,
          email: s.email,
          phone: s.phone,
          role: s.role,
          status: s.status || 'inactive',
          createdAt: s.createdAt,
          schoolName: s.schoolId?.name || s.schoolName || 'Not assigned'
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
};

// Get Admin Redemptions
export const getAdminRedemptions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { rewardItem: { $regex: search, $options: 'i' } }
      ];
    }

    const redemptions = await Redemption.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Redemption.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        redemptions: redemptions.map(r => ({
          _id: r._id,
          rewardName: r.rewardItem,
          studentName: r.userId?.name || 'Unknown',
          studentEmail: r.userId?.email || '',
          points: r.cost,
          rewardValue: r.cost * 0.1, // Convert points to approximate value
          status: r.status,
          createdAt: r.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch redemptions' });
  }
};

// Get All Redemptions
export const getAllRedemptions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { rewardItem: { $regex: search, $options: 'i' } }
      ];
    }

    const redemptions = await Redemption.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Redemption.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        redemptions: redemptions.map(r => ({
          _id: r._id,
          rewardName: r.rewardItem,
          studentName: r.userId?.name || 'Unknown',
          studentEmail: r.userId?.email || '',
          points: r.cost,
          rewardValue: r.cost * 0.1,
          status: r.status,
          createdAt: r.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all redemptions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch redemptions' });
  }
};

// Get Redemptions Stats
export const getRedemptionsStats = async (req, res) => {
  try {
    const total = await Redemption.countDocuments();
    const pending = await Redemption.countDocuments({ status: 'pending' });
    const approved = await Redemption.countDocuments({ status: 'approved' });
    const rejected = await Redemption.countDocuments({ status: 'rejected' });

    const redemptions = await Redemption.find({ status: 'approved' });
    const totalValue = redemptions.reduce((sum, r) => sum + (r.cost * 0.1), 0);

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        totalValue: Math.round(totalValue)
      }
    });
  } catch (error) {
    console.error('Error fetching redemption stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch redemption stats' });
  }
};

// Update Redemption Status
export const updateRedemptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.path.includes('approve') ? 'approved' : 'rejected';

    const redemption = await Redemption.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!redemption) {
      return res.status(404).json({ success: false, error: 'Redemption not found' });
    }

    const io = req.app.get('io');
    if (io && redemption.userId) {
      io.to(redemption.userId._id.toString()).emit('redemption:status:update', {
        redemptionId: redemption._id,
        status: redemption.status
      });
    }

    res.json({
      success: true,
      data: {
        _id: redemption._id,
        rewardName: redemption.rewardItem,
        studentName: redemption.userId?.name || 'Unknown',
        studentEmail: redemption.userId?.email || '',
        points: redemption.cost,
        rewardValue: redemption.cost * 0.1,
        status: redemption.status,
        createdAt: redemption.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating redemption:', error);
    res.status(500).json({ success: false, error: 'Failed to update redemption' });
  }
};

// Update Redemption
export const updateRedemption = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cost, rewardItem } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (cost) updateData.cost = cost;
    if (rewardItem) updateData.rewardItem = rewardItem;

    const redemption = await Redemption.findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'name email');

    if (!redemption) {
      return res.status(404).json({ success: false, error: 'Redemption not found' });
    }

    res.json({
      success: true,
      data: {
        _id: redemption._id,
        rewardName: redemption.rewardItem,
        studentName: redemption.userId?.name || 'Unknown',
        studentEmail: redemption.userId?.email || '',
        points: redemption.cost,
        rewardValue: redemption.cost * 0.1,
        status: redemption.status,
        createdAt: redemption.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating redemption:', error);
    res.status(500).json({ success: false, error: 'Failed to update redemption' });
  }
};

// Admin Stats Panel
export const getAdminStatsPanel = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const totalUsers = await User.countDocuments();
    const totalSchools = await Organization.countDocuments({ type: 'school' });
    const totalActivities = await ActivityLog.countDocuments({ createdAt: { $gte: startDate } });
    const activeUsers = await User.countDocuments({ 
      lastActiveAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    const usersByRegion = await User.distinct('location');
    const regions = usersByRegion.filter(r => r).length || 1;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSchools,
        totalActivities,
        engagementRate,
        regions,
        successRate: 95,
        performance: 'A+'
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
};

// Get Admin Users Panel
export const getAdminUsersPanel = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('name email phone role status createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users: users.map(u => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status || 'inactive',
          createdAt: u.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

// Get Users Stats
export const getUsersStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ status: 'active' });
    const inactive = await User.countDocuments({ status: 'inactive' });
    const pending = await User.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        pending
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user stats' });
  }
};

// Toggle User Status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('name email phone role status');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(user._id.toString()).emit('user:status:update', {
        userId: user._id,
        status: user.status
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status' });
  }
};

// Get Admin Settings
export const getAdminSettings = async (req, res) => {
  try {
    // In a real app, this would fetch from a Settings collection
    const defaultSettings = {
      general: {
        platformName: 'Wise Student',
        supportEmail: 'support@wisestudent.org',
        supportPhone: '+91 9043411110',
        timezone: 'Asia/Kolkata',
        language: 'en'
      },
      security: {
        requireEmailVerification: true,
        requireTwoFactor: false,
        sessionTimeout: 30,
        passwordMinLength: 8,
        enableAuditLog: true
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        adminAlerts: true
      },
      system: {
        maintenanceMode: false,
        maxUploadSize: 10,
        enableAnalytics: true,
        enableCookies: true
      }
    };

    res.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

// Update Admin Settings
export const updateAdminSettings = async (req, res) => {
  try {
    const settings = req.body;

    // In a real app, this would save to a Settings collection
    // For now, we'll just validate and return success

    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

// Get Analytics Data (alias)
export const getAnalyticsData = getAdminAnalytics;

// Get Stats Data (alias)
export const getStatsData = getAdminStatsPanel;

// Plan features constants
const FREE_PLAN_FEATURES = {
  fullAccess: false,
  parentDashboard: false,
  advancedAnalytics: false,
  certificates: false,
  wiseClubAccess: false,
  inavoraAccess: false,
  gamesPerPillar: 5,
  totalGames: 50,
};

const STUDENT_PREMIUM_FEATURES = {
  fullAccess: true,
  parentDashboard: false,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const STUDENT_PARENT_PREMIUM_PRO_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

// Create user with subscription plan (bypassing payment) - For testing purposes
export const createUserWithPlan = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      gender,
      role = 'student',
      selectedPlan = 'free',
      parentId,
      organization,
      childLinkCode,
    } = req.body;

    // Validation - Common fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required',
      });
    }

    // Role-specific validation
    if (role === 'student') {
      if (!dateOfBirth || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Date of birth and gender are required for student role',
        });
      }
    }

    if (role === 'csr') {
      if (!organization) {
        return res.status(400).json({
          success: false,
          message: 'Organization is required for CSR role',
        });
      }
    }

    // Validate gender (only for students)
    let normalizedGender = 'male'; // Default
    if (role === 'student') {
      const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
      normalizedGender = String(gender).trim().toLowerCase();
      if (!allowedGenders.includes(normalizedGender)) {
        return res.status(400).json({
          success: false,
          message: `Invalid gender. Must be one of: ${allowedGenders.join(', ')}`,
        });
      }
    }

    // Validate plan (only for students)
    if (role === 'student') {
      const allowedPlans = ['free', 'student_premium', 'student_parent_premium_pro'];
      if (!allowedPlans.includes(selectedPlan)) {
        return res.status(400).json({
          success: false,
          message: `Invalid plan. Must be one of: ${allowedPlans.join(', ')}`,
        });
      }
    }

    // Validate role
    const allowedRoles = ['student', 'parent', 'csr'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}`,
      });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Validate date of birth (only for students)
    let parsedDob = null;
    if (role === 'student') {
      parsedDob = new Date(dateOfBirth);
      if (isNaN(parsedDob.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date of birth format',
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar
    const avatarData = generateAvatar({
      name: fullName,
      email: normalizedEmail,
      role,
    });

    // Create user
    const userData = {
      name: fullName.trim(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true, // Pre-verified for admin-created users
      approvalStatus: ['parent', 'csr'].includes(role) ? 'pending' : 'approved',
      avatar: avatarData.url,
      avatarData: {
        type: 'generated',
        ...avatarData,
      },
    };

    // Add role-specific fields
    if (role === 'student') {
      userData.dateOfBirth = parsedDob;
      userData.dob = parsedDob.toISOString();
      userData.gender = normalizedGender;
    }

    if (role === 'csr' && organization) {
      userData.organization = organization.trim();
    }

    // Add linking code for students
    if (role === 'student') {
      userData.linkingCode = await User.generateUniqueLinkingCode('ST');
      userData.linkingCodeIssuedAt = new Date();
    }

    // Link parent if provided
    if (parentId && role === 'student') {
      const parent = await User.findById(parentId);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: 'Parent not found',
        });
      }
      userData.linkedIds = {
        parentIds: [parentId],
      };
    }

    const newUser = await User.create(userData);

    // Link student to parent if parentId provided
    if (parentId && role === 'student') {
      await User.updateOne(
        { _id: parentId },
        {
          $addToSet: { 'linkedIds.childIds': newUser._id },
          $addToSet: { childEmail: normalizedEmail },
        }
      );
    }

    // Link parent/CSR to child if childLinkCode provided
    if (childLinkCode && (role === 'parent' || role === 'csr')) {
      const normalizedLinkCode = childLinkCode.trim().toUpperCase();
      const child = await User.findOne({ 
        linkingCode: normalizedLinkCode,
        role: { $in: ['student', 'school_student'] }
      });

      if (!child) {
        // Don't fail the user creation, just log a warning
        console.warn(`Child with linking code ${normalizedLinkCode} not found. User created but not linked.`);
      } else {
        // Link parent/CSR to child
        await User.updateOne(
          { _id: newUser._id },
          {
            $addToSet: { 'linkedIds.childIds': child._id },
            $addToSet: { childEmail: child.email },
          }
        );

        // Also update child to link back to parent/CSR
        if (role === 'parent') {
          await User.updateOne(
            { _id: child._id },
            {
              $addToSet: { 'linkedIds.parentIds': newUser._id },
            }
          );
        }
      }
    }

    // Create subscription (only for students)
    if (role === 'student') {
      const planFeatures = {
        free: FREE_PLAN_FEATURES,
        student_premium: STUDENT_PREMIUM_FEATURES,
        student_parent_premium_pro: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      };

      const planAmounts = {
        free: 0,
        student_premium: 4499,
        student_parent_premium_pro: 4999,
      };

      const planNames = {
        free: 'Free Plan',
        student_premium: 'Students Premium Plan',
        student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
      };

      await UserSubscription.create({
      userId: newUser._id,
      planType: selectedPlan,
      planName: planNames[selectedPlan],
      amount: planAmounts[selectedPlan],
      firstYearAmount: planAmounts[selectedPlan],
      renewalAmount: selectedPlan === 'student_premium' ? 999 : selectedPlan === 'student_parent_premium_pro' ? 1499 : 0,
      isFirstYear: true,
      status: 'active',
      startDate: new Date(),
      endDate: selectedPlan !== 'free' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined, // 1 year for paid plans
      features: planFeatures[selectedPlan],
      transactions: selectedPlan !== 'free' ? [
        {
          transactionId: `admin_test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          amount: planAmounts[selectedPlan],
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
          paymentMethod: 'admin_bypass',
          metadata: {
            createdBy: 'admin',
            bypassPayment: true,
            purpose: 'testing',
          },
        },
      ] : [],
        metadata: {
          createdBy: 'admin',
          bypassPayment: true,
          purpose: 'testing',
          adminCreated: true,
        },
      });
    }

    const responseData = {
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          approvalStatus: newUser.approvalStatus,
          linkingCode: newUser.linkingCode,
        },
      },
    };

    // Add subscription info only for students
    if (role === 'student') {
      const planNames = {
        free: 'Free Plan',
        student_premium: 'Students Premium Plan',
        student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
      };
      responseData.message = `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully with ${planNames[selectedPlan]}`;
      responseData.data.subscription = {
        planType: selectedPlan,
        planName: planNames[selectedPlan],
        status: 'active',
      };
    }

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating user with plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
};

