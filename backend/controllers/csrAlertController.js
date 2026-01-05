import CSRAlertRule from '../models/CSRAlertRule.js';
import CSRAlert from '../models/CSRAlert.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new alert rule
export const createAlertRule = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const {
      ruleName,
      description,
      alertType,
      sourceType,
      conditions,
      notificationSettings,
      messageTemplate
    } = req.body;

    // Validate required fields
    if (!ruleName || !alertType || !sourceType || !messageTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ruleName, alertType, sourceType, messageTemplate'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const rule = new CSRAlertRule({
      ruleName,
      description,
      alertType,
      sourceType,
      conditions: conditions || {},
      notificationSettings: {
        enabled: notificationSettings?.enabled !== false,
        channels: notificationSettings?.channels || ['in_app'],
        frequency: notificationSettings?.frequency || 'once',
        recipients: notificationSettings?.recipients || []
      },
      messageTemplate,
      organizationId: orgObjectId,
      createdBy: req.user._id,
      status: 'active'
    });

    // Add audit trail
    rule.auditTrail.push({
      action: 'rule_created',
      performedBy: req.user._id,
      details: `Alert rule "${ruleName}" created`
    });

    await rule.save();

    res.status(201).json({
      success: true,
      message: 'Alert rule created successfully',
      data: rule
    });
  } catch (error) {
    console.error('Error creating alert rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alert rule',
      error: error.message
    });
  }
};

// Get all alert rules
export const getAlertRules = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { status, alertType } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const query = { organizationId: orgObjectId };
    
    if (status) query.status = status;
    if (alertType) query.alertType = alertType;

    const rules = await CSRAlertRule.find(query)
      .populate('createdBy', 'name email')
      .populate('notificationSettings.recipients', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    console.error('Error fetching alert rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert rules',
      error: error.message
    });
  }
};

// Get all alerts
export const getAlerts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { status, severity, alertType, sourceType } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const userId = req.user._id;

    const query = {
      organizationId: orgObjectId,
      'recipients.userId': userId
    };
    
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (alertType) query.alertType = alertType;
    if (sourceType) query.sourceType = sourceType;

    const alerts = await CSRAlert.find(query)
      .populate('ruleId', 'ruleName alertType')
      .populate('sourceId')
      .sort({ triggeredAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
};

// Get unread alerts count
export const getUnreadAlertsCount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const userId = req.user._id;

    const count = await CSRAlert.countDocuments({
      organizationId: orgObjectId,
      'recipients.userId': userId,
      'recipients.acknowledged': false,
      status: { $in: ['pending', 'sent'] }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching unread alerts count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread alerts count',
      error: error.message
    });
  }
};

// Acknowledge an alert
export const acknowledgeAlert = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { alertId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const userId = req.user._id;

    const alert = await CSRAlert.findOne({
      _id: alertId,
      organizationId: orgObjectId,
      'recipients.userId': userId
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Update recipient acknowledgment
    const recipient = alert.recipients.find(r => r.userId.toString() === userId.toString());
    if (recipient) {
      recipient.acknowledged = true;
      recipient.acknowledgedAt = new Date();
    }

    // If all recipients acknowledged, update alert status
    const allAcknowledged = alert.recipients.every(r => r.acknowledged);
    if (allAcknowledged) {
      alert.status = 'acknowledged';
    }

    await alert.save();

    res.json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to acknowledge alert',
      error: error.message
    });
  }
};

// Resolve an alert
export const resolveAlert = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { alertId } = req.params;
    const { resolutionNotes } = req.body;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const userId = req.user._id;

    const alert = await CSRAlert.findOne({
      _id: alertId,
      organizationId: orgObjectId
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'resolved';
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = resolutionNotes || '';

    await alert.save();

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message
    });
  }
};

// Dismiss an alert
export const dismissAlert = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { alertId } = req.params;
    const { dismissalReason } = req.body;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const userId = req.user._id;

    const alert = await CSRAlert.findOne({
      _id: alertId,
      organizationId: orgObjectId,
      'recipients.userId': userId
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'dismissed';
    alert.dismissedBy = userId;
    alert.dismissedAt = new Date();
    alert.dismissalReason = dismissalReason || '';

    await alert.save();

    res.json({
      success: true,
      message: 'Alert dismissed successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss alert',
      error: error.message
    });
  }
};

// Update alert rule
export const updateAlertRule = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { ruleId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const rule = await CSRAlertRule.findOne({
      _id: ruleId,
      organizationId: orgObjectId
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Alert rule not found'
      });
    }

    const updates = req.body;
    
    // Update allowed fields
    if (updates.ruleName) rule.ruleName = updates.ruleName;
    if (updates.description !== undefined) rule.description = updates.description;
    if (updates.conditions) rule.conditions = { ...rule.conditions, ...updates.conditions };
    if (updates.notificationSettings) {
      rule.notificationSettings = { ...rule.notificationSettings, ...updates.notificationSettings };
    }
    if (updates.messageTemplate) rule.messageTemplate = { ...rule.messageTemplate, ...updates.messageTemplate };
    if (updates.status) rule.status = updates.status;

    // Add audit trail
    rule.auditTrail.push({
      action: 'rule_updated',
      performedBy: req.user._id,
      details: 'Alert rule updated'
    });

    await rule.save();

    res.json({
      success: true,
      message: 'Alert rule updated successfully',
      data: rule
    });
  } catch (error) {
    console.error('Error updating alert rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alert rule',
      error: error.message
    });
  }
};

// Delete alert rule
export const deleteAlertRule = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { ruleId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const rule = await CSRAlertRule.findOneAndDelete({
      _id: ruleId,
      organizationId: orgObjectId
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Alert rule not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert rule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting alert rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete alert rule',
      error: error.message
    });
  }
};

export default {
  createAlertRule,
  getAlertRules,
  getAlerts,
  getUnreadAlertsCount,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  updateAlertRule,
  deleteAlertRule
};

