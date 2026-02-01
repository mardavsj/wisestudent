import Incident from '../models/Incident.js';
import User from '../models/User.js';
import { createNotification } from './notificationService.js';
import { getIoInstance } from '../utils/socketServer.js';

/**
 * Create and triage privacy incident
 */
export const createPrivacyIncident = async (incidentData) => {
  const {
    title,
    description,
    affectedUsers,
    dataTypes,
    potentialExposure,
    affectedRegion,
    regulatoryImpact
  } = incidentData;

  // Determine severity based on incident details
  const severity = assessPrivacySeverity({
    affectedUsers,
    dataTypes,
    potentialExposure,
    regulatoryImpact
  });

  // Generate incident ticket
  const incident = await Incident.create({
    incidentType: 'privacy_incident',
    severity,
    status: 'open',
    title,
    description,
    privacyDetails: {
      affectedUsers,
      dataTypes,
      potentialExposure,
      affectedRegion,
      regulatoryImpact,
      containmentStatus: 'not_contained'
    },
    auditTrail: [{
      action: 'created',
      performedBy: null,
      metadata: { source: 'privacy_triage' }
    }]
  });

  // Notify compliance team
  await notifyComplianceTeam(incident);

  // Emit real-time update for admin dashboard
  const io = getIoInstance();
  if (io) {
    io.emit('admin:incident:new', incident.toObject ? incident.toObject() : incident);
  }

  return incident;
};

/**
 * Assess privacy incident severity
 */
const assessPrivacySeverity = (details) => {
  const { affectedUsers, dataTypes, potentialExposure, regulatoryImpact } = details;
  
  let severityScore = 0;

  // Factor 1: Number of affected users
  if (affectedUsers >= 10000) severityScore += 3;
  else if (affectedUsers >= 1000) severityScore += 2;
  else if (affectedUsers >= 100) severityScore += 1;

  // Factor 2: Sensitive data types
  const sensitiveDataTypes = ['PII', 'financial', 'health', 'biometric', 'location'];
  const hasSensitiveData = dataTypes.some(type => sensitiveDataTypes.includes(type.toLowerCase()));
  if (hasSensitiveData) severityScore += 2;

  // Factor 3: Potential exposure level
  if (potentialExposure?.toLowerCase().includes('full') || 
      potentialExposure?.toLowerCase().includes('public')) {
    severityScore += 2;
  } else if (potentialExposure?.toLowerCase().includes('limited')) {
    severityScore += 1;
  }

  // Factor 4: Regulatory impact
  if (regulatoryImpact?.includes('GDPR')) severityScore += 2;
  if (regulatoryImpact?.includes('CCPA') || regulatoryImpact?.includes('PIPEDA')) {
    severityScore += 1;
  }

  // Determine severity
  if (severityScore >= 7) return 'critical';
  if (severityScore >= 5) return 'high';
  if (severityScore >= 3) return 'medium';
  return 'low';
};

/**
 * Notify compliance team about privacy incident
 */
const notifyComplianceTeam = async (incident) => {
  try {
    // Get compliance team members (admins with compliance role)
    const complianceTeam = await User.find({ 
      role: 'admin',
      // In production, add a specific compliance flag
    }).select('_id name email');

    if (complianceTeam.length === 0) {
      console.warn('⚠️ No compliance team members found');
      return;
    }

    // Create urgent notification for each team member
    for (const member of complianceTeam) {
      await createNotification({
        userId: member._id,
        type: 'privacy_incident',
        title: `Privacy Incident: ${incident.title}`,
        message: `Urgent: ${incident.description}. Severity: ${incident.severity.toUpperCase()}`,
        metadata: {
          incidentId: incident._id,
          ticketNumber: incident.ticketNumber,
          severity: incident.severity,
          affectedUsers: incident.privacyDetails.affectedUsers
        },
        priority: 'high'
      });

      // Log notification
      incident.notifications.push({
        sentTo: member._id,
        sentAt: new Date(),
        notificationType: 'privacy_incident',
        delivered: true
      });
    }

    await incident.save();

    console.log(`✅ Compliance team notified about privacy incident ${incident.ticketNumber}`);
  } catch (error) {
    console.error('Error notifying compliance team:', error);
  }
};

/**
 * Auto-generate privacy incident from detected privacy issues
 */
export const autoGeneratePrivacyIncident = async (detectedIssues) => {
  for (const issue of detectedIssues) {
    const incident = await createPrivacyIncident({
      title: issue.title || `Auto-detected Privacy Issue: ${issue.type}`,
      description: issue.description || 'Privacy issue automatically detected by monitoring system',
      affectedUsers: issue.affectedUsers || 0,
      dataTypes: issue.dataTypes || [],
      potentialExposure: issue.potentialExposure || 'Unknown',
      affectedRegion: issue.affectedRegion || 'Global',
      regulatoryImpact: issue.regulatoryImpact || []
    });

    console.log(`🔍 Auto-generated privacy incident: ${incident.ticketNumber}`);
  }
};

