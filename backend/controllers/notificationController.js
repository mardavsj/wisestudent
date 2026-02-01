import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import DataRetentionPolicy from "../models/DataRetentionPolicy.js";
import Organization from "../models/Organization.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

// 📥 Create a new notification and emit real-time via Socket.IO
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      throw new ErrorResponse("Missing required fields", 400);
    }

    const notification = await Notification.create({
      userId,
      type,
      message,
    });

    // Real-time emit to user's private room
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("notification", notification);
    }

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    next(err);
  }
};

// 📤 Get all notifications for the logged-in user
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

// 🧹 Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// ✅ Mark a specific notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorResponse("Invalid notification ID", 400);
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new ErrorResponse("Notification not found", 404);
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    next(err);
  }
};

// ❌ Delete a specific notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorResponse("Invalid notification ID", 400);
    }

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      throw new ErrorResponse("Notification not found", 404);
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};

// 🔢 Get unread notification count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};

// ============= APPROVAL QUEUE NOTIFICATIONS =============

// Get pending approval notifications
export const getApprovalQueue = async (req, res, next) => {
  try {
    const { tenantId } = req;
    
    // Find all pending assignments
    const pendingAssignments = await Assignment.find({
      tenantId,
      status: 'pending_approval',
    })
      .populate('createdBy', 'name email profilePicture')
      .populate('classId', 'name grade section')
      .sort({ createdAt: -1 })
      .limit(50);

    // Transform to notification format
    const approvalNotifications = pendingAssignments.map(assignment => ({
      _id: assignment._id,
      type: 'assignment_approval_pending',
      title: 'Assignment Pending Approval',
      message: `New assignment "${assignment.title}" pending approval from ${assignment.createdBy?.name || 'Unknown Teacher'}`,
      metadata: {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        teacherId: assignment.createdBy?._id,
        teacherName: assignment.createdBy?.name,
        teacherEmail: assignment.createdBy?.email,
        teacherPhoto: assignment.createdBy?.profilePicture,
        className: assignment.classId?.name,
        grade: assignment.classId?.grade,
        section: assignment.classId?.section,
        dueDate: assignment.dueDate,
        subject: assignment.subject,
      },
      createdAt: assignment.createdAt,
      isRead: false,
      priority: 'high',
    }));

    res.status(200).json({
      success: true,
      count: approvalNotifications.length,
      notifications: approvalNotifications,
    });
  } catch (err) {
    next(err);
  }
};

// Create approval notification for school admin
export const createApprovalNotification = async (req, res, next) => {
  try {
    const { assignmentId, teacherId } = req.body;
    const { tenantId } = req;

    const assignment = await Assignment.findById(assignmentId).populate('classId', 'name');
    const teacher = await User.findById(teacherId);
    
    if (!assignment || !teacher) {
      throw new ErrorResponse('Assignment or Teacher not found', 404);
    }

    // Find all school admins in this tenant
    const admins = await User.find({
      tenantId,
      role: 'school_admin',
    });

    // Create notification for each admin
    const notifications = await Promise.all(
      admins.map(admin =>
        Notification.create({
          userId: admin._id,
          type: 'assignment_approval_pending',
          title: 'Assignment Pending Approval',
          message: `New assignment "${assignment.title}" pending approval from ${teacher.name}`,
          metadata: {
            assignmentId: assignment._id,
            assignmentTitle: assignment.title,
            teacherId: teacher._id,
            teacherName: teacher.name,
            className: assignment.classId?.name,
            subject: assignment.subject,
          },
          priority: 'high',
        })
      )
    );

    // Emit real-time notification via Socket.IO
    const io = req.app.get('io');
    if (io) {
      admins.forEach((admin, index) => {
        io.to(admin._id.toString()).emit('notification', notifications[index]);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Approval notifications sent to admins',
      count: notifications.length,
    });
  } catch (err) {
    next(err);
  }
};

// ============= POLICY CHANGE NOTIFICATIONS =============

// Notify about policy changes
export const notifyPolicyChange = async (req, res, next) => {
  try {
    const { policyId, changeDescription, notifyParents = true } = req.body;
    const { tenantId } = req;
    const orgId = req.user?.orgId;

    const policy = await DataRetentionPolicy.findById(policyId);
    if (!policy) {
      throw new ErrorResponse('Policy not found', 404);
    }

    const organization = await Organization.findById(orgId);
    
    const policyMessage = `Data retention policy updated: ${policy.name} - ${changeDescription || `Retention period set to ${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`}`;

    // Notify school admins
    const admins = await User.find({
      tenantId,
      role: 'school_admin',
    });

    const adminNotifications = await Promise.all(
      admins.map(admin =>
        Notification.create({
          userId: admin._id,
          type: 'policy_change',
          title: 'Policy Updated',
          message: policyMessage,
          metadata: {
            policyId: policy._id,
            policyName: policy.name,
            policyType: policy.dataType,
            retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
            changeDescription,
            requiresParentNotification: notifyParents,
          },
          priority: 'high',
        })
      )
    );

    // Notify parents if required
    let parentNotifications = [];
    if (notifyParents) {
      const parents = await User.find({
        tenantId,
        role: 'parent',
      });

      const parentMessage = `Important: ${organization?.name || 'School'} has updated its data retention policy. ${changeDescription || `Student data will now be retained for ${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}.`} Please review the updated privacy policy.`;

      parentNotifications = await Promise.all(
        parents.map(parent =>
          Notification.create({
            userId: parent._id,
            type: 'policy_change_parent',
            title: 'Data Policy Update',
            message: parentMessage,
            metadata: {
              policyId: policy._id,
              policyName: policy.name,
              retentionPeriod: `${policy.retentionPeriod.value} ${policy.retentionPeriod.unit}`,
              actionRequired: 'Please acknowledge',
              schoolName: organization?.name,
            },
            priority: 'high',
          })
        )
      );
    }

    // Emit real-time notifications
    const io = req.app.get('io');
    if (io) {
      admins.forEach((admin, index) => {
        io.to(admin._id.toString()).emit('notification', adminNotifications[index]);
      });
      
      if (notifyParents) {
        const parents = await User.find({ tenantId, role: 'parent' });
        parents.forEach((parent, index) => {
          io.to(parent._id.toString()).emit('notification', parentNotifications[index]);
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Policy change notifications sent',
      stats: {
        adminsNotified: adminNotifications.length,
        parentsNotified: parentNotifications.length,
        totalNotifications: adminNotifications.length + parentNotifications.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all policy change notifications
export const getPolicyChangeNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      type: { $in: ['policy_change', 'policy_change_parent'] },
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

// Acknowledge policy change (for parents)
export const acknowledgePolicyChange = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.user._id,
      type: 'policy_change_parent',
    });

    if (!notification) {
      throw new ErrorResponse('Notification not found', 404);
    }

    notification.isRead = true;
    notification.metadata.acknowledged = true;
    notification.metadata.acknowledgedAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Policy change acknowledged',
      notification,
    });
  } catch (err) {
    next(err);
  }
};
