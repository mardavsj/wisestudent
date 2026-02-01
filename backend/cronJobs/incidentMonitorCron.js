import cron from 'node-cron';
import mongoose from 'mongoose';
import ActivityLog from '../models/ActivityLog.js';
import Incident from '../models/Incident.js';
import { checkSLABreaches } from '../services/slaMonitorService.js';
import { autoGeneratePrivacyIncident } from '../services/privacyIncidentService.js';
import {
  getAverageLatency,
  getRecentErrorCount,
  getRecentRequestCount,
} from '../utils/apiMetricsStore.js';

let isRunning = false;

/**
 * Collect platform metrics for incident monitoring
 */
async function collectPlatformMetrics() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // ActivityLog metrics
  const [activityErrors, totalActivity] = await Promise.all([
    ActivityLog.countDocuments({
      activityType: 'error',
      timestamp: { $gte: oneHourAgo },
    }),
    ActivityLog.countDocuments({
      timestamp: { $gte: oneHourAgo },
    }),
  ]);

  // In-memory API metrics
  const apiErrors = getRecentErrorCount(60);
  const apiRequests = getRecentRequestCount(60);
  const latency = getAverageLatency();

  // Combined error rate: (ActivityLog errors + API errors) / (ActivityLog activity + API requests)
  const totalErrors = activityErrors + apiErrors;
  const totalRequests = totalActivity + apiRequests;
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  return {
    latency: latency || 0,
    errorRate,
    totalErrors,
    totalRequests,
    activityErrors,
    apiErrors,
  };
}

/**
 * Check for privacy-related wellbeing flags and create incidents if needed
 * Uses raw MongoDB to bypass SchoolStudent tenantId requirement
 */
async function checkPrivacyFlags() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const db = mongoose.connection.db;
  if (!db) return;

  const studentsWithPrivacyFlags = await db.collection('schoolstudents').find({
    isActive: true,
    wellbeingFlags: {
      $elemMatch: {
        type: 'other',
        status: 'open',
        flaggedAt: { $gte: oneHourAgo },
        description: { $regex: /privacy|data|consent|gdpr|pii|personal/i },
      },
    },
  }).limit(5).toArray();

  if (studentsWithPrivacyFlags.length === 0) return;

  // Check if we already created incidents for these recently (avoid duplicates)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentPrivacyIncidents = await Incident.countDocuments({
    incidentType: 'privacy_incident',
    createdAt: { $gte: oneDayAgo },
    'privacyDetails.affectedUsers': { $lte: studentsWithPrivacyFlags.length },
  });

  if (recentPrivacyIncidents > 0) return; // Already created recently

  const issues = studentsWithPrivacyFlags.map((s) => {
    const flag = s.wellbeingFlags?.find(
      (f) => f.type === 'other' && f.status === 'open'
    );
    return {
      type: 'wellbeing_flag',
      title: `Privacy flag: Student ${s.admissionNumber || s._id}`,
      description: flag?.description || 'Privacy-related wellbeing flag detected',
      affectedUsers: 1,
      dataTypes: ['student_info'],
      potentialExposure: 'Internal - flagged for review',
      affectedRegion: 'Platform',
      regulatoryImpact: ['GDPR'],
    };
  });

  await autoGeneratePrivacyIncident(issues);
}

/**
 * Main incident monitoring job
 */
async function runIncidentMonitor() {
  if (isRunning) return;
  isRunning = true;

  try {
    const metrics = await collectPlatformMetrics();

    // Only run SLA check if we have meaningful data
    if (metrics.totalRequests >= 5 || metrics.latency > 0) {
      const breaches = await checkSLABreaches({
        latency: metrics.latency,
        errorRate: metrics.errorRate,
        endpoint: 'global',
      });

      if (breaches?.length > 0) {
        console.log(
          `📋 Incident monitor: Created ${breaches.length} SLA breach incident(s)`
        );
      }
    }

    // Check for privacy flags
    await checkPrivacyFlags();
  } catch (error) {
    console.error('❌ Incident monitor error:', error.message);
  } finally {
    isRunning = false;
  }
}

/**
 * Schedule incident monitoring cron
 * Runs every 5 minutes
 */
export const scheduleIncidentMonitor = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    if (mongoose.connection.readyState !== 1) return;
    await runIncidentMonitor();
  });

  // Run once on startup (after a short delay to let server stabilize)
  setTimeout(runIncidentMonitor, 30000);

  console.log('✅ Incident monitor scheduled (every 5 minutes)');
};
