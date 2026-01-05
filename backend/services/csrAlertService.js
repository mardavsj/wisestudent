import CSRAlertRule from '../models/CSRAlertRule.js';
import CSRAlert from '../models/CSRAlert.js';
import CSRGoal from '../models/CSRGoal.js';
import CSRComplianceEvent from '../models/CSRComplianceEvent.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Check all active alert rules and trigger alerts if conditions are met
 */
export const checkAndTriggerAlerts = async (io = null) => {
  try {
    const now = new Date();
    
    // Find all active rules that need checking
    const rulesToCheck = await CSRAlertRule.find({
      status: 'active',
      $or: [
        { nextCheck: { $lte: now } },
        { nextCheck: { $exists: false } }
      ]
    }).populate('notificationSettings.recipients');

    console.log(`🔔 Checking ${rulesToCheck.length} alert rules...`);

    const results = {
      checked: 0,
      triggered: 0,
      errors: 0
    };

    for (const rule of rulesToCheck) {
      try {
        results.checked++;
        
        // Check if rule conditions are met
        const shouldTrigger = await evaluateAlertRule(rule);
        
        if (shouldTrigger.shouldTrigger) {
          // Atomically check and create alert to prevent race conditions
          // Use findOneAndUpdate with upsert to ensure only one alert is created per rule+source
          const alertData = await prepareAlertData(rule, shouldTrigger);
          
          // Store creation time to detect if alert was newly created
          const beforeUpdate = new Date();
          
          // Use a marker field to reliably detect new document creation
          // We'll set a temporary marker that only exists on newly created documents
          const creationMarker = `__new_${beforeUpdate.getTime()}_${Math.random()}`;
          
          const alert = await CSRAlert.findOneAndUpdate(
            {
              ruleId: rule._id,
              sourceId: shouldTrigger.sourceId,
              status: { $in: ['pending', 'sent'] }
            },
            {
              $setOnInsert: {
                ...alertData,
                triggeredAt: beforeUpdate,
                _creationMarker: creationMarker // Temporary marker for new documents
              }
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );

          // Reliably detect if this was a newly created alert by checking the creation marker
          // The marker will only exist if the document was just created via $setOnInsert
          const isNewAlert = alert._creationMarker === creationMarker;

          if (isNewAlert) {
            // Remove the temporary marker field
            await CSRAlert.findByIdAndUpdate(alert._id, {
              $unset: { _creationMarker: 1 }
            });
            
            // Only create notifications for newly created alerts
            await createNotificationsForAlert(alert, rule, io);
            results.triggered++;
            
            // Update rule
            rule.lastTriggered = now;
            rule.triggerCount = (rule.triggerCount || 0) + 1;
          }
        }
        
        // Update last checked and next check
        rule.lastChecked = now;
        const intervalMs = (rule.checkInterval || 60) * 60 * 1000;
        rule.nextCheck = new Date(now.getTime() + intervalMs);
        await rule.save();
        
      } catch (error) {
        console.error(`Error checking alert rule ${rule.ruleId}:`, error);
        results.errors++;
      }
    }

    console.log(`✅ Alert check completed: ${results.checked} checked, ${results.triggered} triggered, ${results.errors} errors`);
    return results;
  } catch (error) {
    console.error('Error in checkAndTriggerAlerts:', error);
    throw error;
  }
};

/**
 * Evaluate if an alert rule should trigger
 */
const evaluateAlertRule = async (rule) => {
  const organizationId = rule.organizationId;
  const orgObjectId = new mongoose.Types.ObjectId(organizationId);
  
  switch (rule.alertType) {
    case 'goal_at_risk': {
      const goals = await CSRGoal.find({
        organizationId: orgObjectId,
        status: { $in: rule.conditions.goalStatus || ['at_risk'] }
      });
      
      if (goals.length > 0) {
        return {
          shouldTrigger: true,
          sourceId: goals[0]._id,
          sourceType: 'goal',
          context: {
            goalId: goals[0]._id,
            goalName: goals[0].goalName,
            status: goals[0].status,
            progress: goals[0].progress?.percentage || 0
          }
        };
      }
      break;
    }
    case 'goal_behind': {
      const goals = await CSRGoal.find({
        organizationId: orgObjectId,
        status: { $in: rule.conditions.goalStatus || ['behind'] }
      });
      
      if (goals.length > 0) {
        return {
          shouldTrigger: true,
          sourceId: goals[0]._id,
          sourceType: 'goal',
          context: {
            goalId: goals[0]._id,
            goalName: goals[0].goalName,
            status: goals[0].status,
            progress: goals[0].progress?.percentage || 0
          }
        };
      }
      break;
    }
    case 'goal_overdue': {
      // Check for goals where endDate has passed and status is not completed/cancelled
      const now = new Date();
      const goals = await CSRGoal.find({
        organizationId: orgObjectId,
        endDate: { $lt: now },
        status: { $nin: ['completed', 'cancelled'] }
      });
      
      if (goals.length > 0) {
        return {
          shouldTrigger: true,
          sourceId: goals[0]._id,
          sourceType: 'goal',
          context: {
            goalId: goals[0]._id,
            goalName: goals[0].goalName,
            status: goals[0].status,
            progress: goals[0].progress?.percentage || 0,
            endDate: goals[0].endDate
          }
        };
      }
      break;
    }
    
    case 'goal_progress': {
      const threshold = rule.conditions.goalProgressThreshold;
      if (threshold !== undefined) {
        const goals = await CSRGoal.find({
          organizationId: orgObjectId,
          status: { $in: ['active', 'on_track', 'at_risk', 'behind'] }
        });
        
        for (const goal of goals) {
          const progress = goal.progress?.percentage || 0;
          if (progress >= threshold) {
            return {
              shouldTrigger: true,
              sourceId: goal._id,
              sourceType: 'goal',
              context: {
                goalId: goal._id,
                goalName: goal.goalName,
                progress,
                threshold
              }
            };
          }
        }
      }
      break;
    }
    
    case 'compliance_due_soon': {
      const daysBefore = rule.conditions.complianceDaysBeforeDue || 7;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysBefore);
      
      const events = await CSRComplianceEvent.find({
        organizationId: orgObjectId,
        dueDate: { $lte: targetDate, $gte: new Date() },
        status: { $in: ['pending', 'in_progress'] }
      });
      
      if (events.length > 0) {
        return {
          shouldTrigger: true,
          sourceId: events[0]._id,
          sourceType: 'compliance_event',
          context: {
            eventId: events[0]._id,
            eventTitle: events[0].title,
            dueDate: events[0].dueDate,
            daysUntilDue: Math.ceil((events[0].dueDate - new Date()) / (1000 * 60 * 60 * 24))
          }
        };
      }
      break;
    }
    
    case 'compliance_overdue': {
      const events = await CSRComplianceEvent.find({
        organizationId: orgObjectId,
        dueDate: { $lt: new Date() },
        status: { $in: ['pending', 'in_progress'] }
      });
      
      if (events.length > 0) {
        return {
          shouldTrigger: true,
          sourceId: events[0]._id,
          sourceType: 'compliance_event',
          context: {
            eventId: events[0]._id,
            eventTitle: events[0].title,
            dueDate: events[0].dueDate,
            daysOverdue: Math.ceil((new Date() - events[0].dueDate) / (1000 * 60 * 60 * 24))
          }
        };
      }
      break;
    }
    
    // Add more alert types as needed
    default:
      return { shouldTrigger: false };
  }
  
  return { shouldTrigger: false };
};

/**
 * Prepare alert data for creation (without actually creating it)
 */
const prepareAlertData = async (rule, triggerData) => {
  // Get recipients
  let recipients = [];
  if (rule.notificationSettings.recipients && rule.notificationSettings.recipients.length > 0) {
    recipients = rule.notificationSettings.recipients;
  } else {
    // Get all CSR users in the organization (User model uses orgId, not organizationId)
    const orgObjectId = new mongoose.Types.ObjectId(rule.organizationId);
    const csrUsers = await User.find({
      orgId: orgObjectId,
      role: 'csr'
    }).select('_id');
    recipients = csrUsers;
  }

  return {
    organizationId: rule.organizationId,
    ruleId: rule._id,
    sourceType: triggerData.sourceType,
    sourceId: triggerData.sourceId,
    alertType: rule.alertType,
    severity: determineSeverity(rule.alertType, triggerData.context),
    title: formatMessage(rule.messageTemplate.title, triggerData.context),
    message: formatMessage(rule.messageTemplate.message, triggerData.context),
    context: triggerData.context,
    actionUrl: rule.messageTemplate.actionUrl,
    recipients: recipients.map(userId => ({
      userId: userId._id || userId
    })),
    status: 'pending'
  };
};

/**
 * Create notifications for an alert
 */
const createNotificationsForAlert = async (alert, rule, io = null) => {
  // Send notifications to recipients
  for (const recipient of alert.recipients) {
    try {
      const notification = await Notification.create({
        userId: recipient.userId,
        type: getNotificationType(alert.severity),
        title: alert.title,
        message: alert.message,
        metadata: {
          alertId: alert._id.toString(),
          alertType: alert.alertType,
          sourceType: alert.sourceType,
          sourceId: alert.sourceId.toString(),
          actionUrl: alert.actionUrl
        }
      });

      // Update recipient with notification ID
      recipient.notificationId = notification._id;
      recipient.sentAt = new Date();
      
      // Emit socket event
      if (io) {
        io.to(recipient.userId.toString()).emit('csr:alert', {
          alertId: alert._id.toString(),
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          alertType: alert.alertType,
          actionUrl: alert.actionUrl
        });
      }
    } catch (error) {
      console.error(`Error sending notification to user ${recipient.userId}:`, error);
    }
  }

  // Update alert status to 'sent' after notifications are created
  alert.status = 'sent';
  await alert.save();
};

/**
 * Create an alert from a triggered rule
 */
const createAlertFromRule = async (rule, triggerData, io = null) => {
  try {
    // Get recipients
    let recipients = [];
    if (rule.notificationSettings.recipients && rule.notificationSettings.recipients.length > 0) {
      recipients = rule.notificationSettings.recipients;
    } else {
      // Get all CSR users in the organization (User model uses orgId, not organizationId)
      const orgObjectId = new mongoose.Types.ObjectId(rule.organizationId);
      const csrUsers = await User.find({
        orgId: orgObjectId,
        role: 'csr'
      }).select('_id');
      recipients = csrUsers;
    }

    // Create alert
    const alert = new CSRAlert({
      organizationId: rule.organizationId,
      ruleId: rule._id,
      sourceType: triggerData.sourceType,
      sourceId: triggerData.sourceId,
      alertType: rule.alertType,
      severity: determineSeverity(rule.alertType, triggerData.context),
      title: formatMessage(rule.messageTemplate.title, triggerData.context),
      message: formatMessage(rule.messageTemplate.message, triggerData.context),
      context: triggerData.context,
      actionUrl: rule.messageTemplate.actionUrl,
      recipients: recipients.map(userId => ({
        userId: userId._id || userId
      })),
      status: 'pending'
    });

    await alert.save();

    // Send notifications to recipients
    for (const recipient of alert.recipients) {
      try {
        const notification = await Notification.create({
          userId: recipient.userId,
          type: getNotificationType(alert.severity),
          title: alert.title,
          message: alert.message,
          metadata: {
            alertId: alert._id.toString(),
            alertType: alert.alertType,
            sourceType: alert.sourceType,
            sourceId: alert.sourceId.toString(),
            actionUrl: alert.actionUrl
          }
        });

        // Update recipient with notification ID
        recipient.notificationId = notification._id;
        recipient.sentAt = new Date();
        
        // Emit socket event
        if (io) {
          io.to(recipient.userId.toString()).emit('csr:alert', {
            alertId: alert._id.toString(),
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            alertType: alert.alertType,
            actionUrl: alert.actionUrl
          });
        }
      } catch (error) {
        console.error(`Error sending notification to user ${recipient.userId}:`, error);
      }
    }

    alert.status = 'sent';
    await alert.save();

    return alert;
  } catch (error) {
    console.error('Error creating alert from rule:', error);
    throw error;
  }
};

/**
 * Determine alert severity based on type and context
 */
const determineSeverity = (alertType, context) => {
  if (alertType.includes('overdue')) return 'critical';
  if (alertType.includes('at_risk')) return 'high';
  if (alertType.includes('due_soon')) return 'medium';
  if (alertType.includes('threshold')) return 'medium';
  return 'low';
};

/**
 * Format message with context variables
 */
const formatMessage = (template, context) => {
  let message = template;
  if (context) {
    Object.keys(context).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      message = message.replace(regex, context[key]);
    });
  }
  return message;
};

/**
 * Get notification type based on severity
 */
const getNotificationType = (severity) => {
  switch (severity) {
    case 'critical': return 'alert';
    case 'high': return 'alert';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'info';
  }
};

export default {
  checkAndTriggerAlerts,
  evaluateAlertRule,
  createAlertFromRule
};

