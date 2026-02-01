import Incident from '../models/Incident.js';
import User from '../models/User.js';
import { createNotification } from './notificationService.js';
import { getIoInstance } from '../utils/socketServer.js';

// SLA Thresholds
const SLA_THRESHOLDS = {
  LATENCY_MS: 1000, // 1 second
  ERROR_RATE_PERCENT: 5, // 5%
  BREACH_DURATION_SECONDS: 60 // Alert after 60 seconds of breach
};

// Track ongoing breaches
const activeBreaches = new Map();

/**
 * Check platform SLA metrics and create incidents if thresholds are breached
 */
export const checkSLABreaches = async (metrics) => {
  const { latency, errorRate, endpoint } = metrics;
  
  const breaches = [];

  // Check latency breach
  if (latency > SLA_THRESHOLDS.LATENCY_MS) {
    const breachKey = `latency-${endpoint || 'global'}`;
    const existingBreach = activeBreaches.get(breachKey);

    if (existingBreach) {
      // Update existing breach duration
      const duration = (Date.now() - existingBreach.startTime) / 1000;
      existingBreach.duration = duration;

      // Create incident if threshold duration reached
      if (duration >= SLA_THRESHOLDS.BREACH_DURATION_SECONDS && !existingBreach.incidentCreated) {
        breaches.push(await createLatencyIncident(metrics, duration));
        existingBreach.incidentCreated = true;
      }
    } else {
      // Start tracking new breach
      activeBreaches.set(breachKey, {
        startTime: Date.now(),
        duration: 0,
        incidentCreated: false
      });
    }
  } else {
    // Clear breach if resolved
    activeBreaches.delete(`latency-${endpoint || 'global'}`);
  }

  // Check error rate breach
  if (errorRate > SLA_THRESHOLDS.ERROR_RATE_PERCENT) {
    const breachKey = `error-${endpoint || 'global'}`;
    const existingBreach = activeBreaches.get(breachKey);

    if (existingBreach) {
      const duration = (Date.now() - existingBreach.startTime) / 1000;
      existingBreach.duration = duration;

      if (duration >= SLA_THRESHOLDS.BREACH_DURATION_SECONDS && !existingBreach.incidentCreated) {
        breaches.push(await createErrorRateIncident(metrics, duration));
        existingBreach.incidentCreated = true;
      }
    } else {
      activeBreaches.set(breachKey, {
        startTime: Date.now(),
        duration: 0,
        incidentCreated: false
      });
    }
  } else {
    activeBreaches.delete(`error-${endpoint || 'global'}`);
  }

  return breaches;
};

/**
 * Create a latency breach incident
 */
const createLatencyIncident = async (metrics, duration) => {
  const { latency, errorRate, endpoint } = metrics;

  const incident = await Incident.create({
    incidentType: 'sla_breach',
    severity: determineSeverity(latency, SLA_THRESHOLDS.LATENCY_MS),
    status: 'open',
    title: `SLA Breach: Latency Exceeded (${Math.round(latency)}ms)`,
    description: `Platform latency has exceeded threshold of ${SLA_THRESHOLDS.LATENCY_MS}ms for ${Math.round(duration)} seconds. Endpoint: ${endpoint || 'Global'}`,
    slaMetrics: {
      latency,
      errorRate,
      thresholdLatency: SLA_THRESHOLDS.LATENCY_MS,
      thresholdErrorRate: SLA_THRESHOLDS.ERROR_RATE_PERCENT,
      breachDuration: Math.round(duration),
      apiEndpoint: endpoint
    },
    auditTrail: [{
      action: 'created',
      performedBy: null, // System-generated
      metadata: { source: 'sla_monitor' }
    }]
  });

  await notifyOnCallTeam(incident);

  // Emit real-time update for admin dashboard
  const io = getIoInstance();
  if (io) {
    io.emit('admin:incident:new', incident.toObject ? incident.toObject() : incident);
  }

  return incident;
};

/**
 * Create an error rate breach incident
 */
const createErrorRateIncident = async (metrics, duration) => {
  const { latency, errorRate, endpoint } = metrics;

  const incident = await Incident.create({
    incidentType: 'sla_breach',
    severity: determineSeverity(errorRate, SLA_THRESHOLDS.ERROR_RATE_PERCENT),
    status: 'open',
    title: `SLA Breach: Error Rate Spiked (${errorRate.toFixed(2)}%)`,
    description: `Platform error rate has exceeded threshold of ${SLA_THRESHOLDS.ERROR_RATE_PERCENT}% for ${Math.round(duration)} seconds. Endpoint: ${endpoint || 'Global'}`,
    slaMetrics: {
      latency,
      errorRate,
      thresholdLatency: SLA_THRESHOLDS.LATENCY_MS,
      thresholdErrorRate: SLA_THRESHOLDS.ERROR_RATE_PERCENT,
      breachDuration: Math.round(duration),
      apiEndpoint: endpoint
    },
    auditTrail: [{
      action: 'created',
      performedBy: null,
      metadata: { source: 'sla_monitor' }
    }]
  });

  await notifyOnCallTeam(incident);

  // Emit real-time update for admin dashboard
  const io = getIoInstance();
  if (io) {
    io.emit('admin:incident:new', incident.toObject ? incident.toObject() : incident);
  }

  return incident;
};

/**
 * Determine incident severity based on breach magnitude
 */
const determineSeverity = (actual, threshold) => {
  const ratio = actual / threshold;
  if (ratio >= 3) return 'critical';
  if (ratio >= 2) return 'high';
  if (ratio >= 1.5) return 'medium';
  return 'low';
};

/**
 * Notify on-call team about incident
 */
const notifyOnCallTeam = async (incident) => {
  try {
    // Get all admin users
    const admins = await User.find({ role: 'admin' }).select('_id name email');

    // Create notifications for each admin
    for (const admin of admins) {
      // In production, integrate with actual notification service (email, SMS, PagerDuty, etc.)
      await createNotification({
        userId: admin._id,
        type: 'incident_alert',
        title: `Incident: ${incident.title}`,
        message: incident.description,
        metadata: {
          incidentId: incident._id,
          ticketNumber: incident.ticketNumber,
          severity: incident.severity
        }
      });
    }

    console.log(`✅ On-call team notified about incident ${incident.ticketNumber}`);
  } catch (error) {
    console.error('Error notifying on-call team:', error);
  }
};

/**
 * Get incident management URL
 */
export const getIncidentManagementURL = (ticketNumber) => {
  // In production, this would point to your actual incident management system
  return `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/incidents/${ticketNumber}`;
};

