import cron from 'node-cron';
import SponsoredStudent from '../models/SponsoredStudent.js';

const STUDENT_STATS_CRON = '0 0 * * *';

const computeLatestActivity = (activityLogs, previousLastEngagement) => {
  let latest = previousLastEngagement ? new Date(previousLastEngagement) : null;
  for (const entry of activityLogs || []) {
    if (entry?.createdAt) {
      const entryDate = new Date(entry.createdAt);
      if (!latest || entryDate > latest) {
        latest = entryDate;
      }
    }
  }
  return latest;
};

const calculateScoreBump = (activityLogs) => {
  const activityCount = (activityLogs || []).length;
  const streakBonus = Math.min(20, activityCount * 1.5);
  return streakBonus;
};

export const refreshSponsoredStudentStats = async () => {
  try {
    const now = new Date();
    const students = await SponsoredStudent.find({ isActive: true }).lean();
    if (!students.length) {
      return;
    }

    for (const student of students) {
      const logs = student.activityLogs || [];
      const baseline = student.progress?.baselineScore ?? 0;
      const previousLatest = student.progress?.latestScore ?? baseline;
      const scoreBump = calculateScoreBump(logs);
      const latestScore = Math.min(100, previousLatest + scoreBump);
      const completionPercentage =
        baseline > 0
          ? Math.min(100, (latestScore / Math.max(baseline, 1)) * 100)
          : Math.min(100, latestScore);
      const lastEngagementAt = computeLatestActivity(logs, student.lastEngagementAt);
      const updatedMetadata = {
        ...(student.metadata || {}),
        activitySnapshot: {
          totalActivities: logs.length,
          lastCalculatedAt: now,
        },
      };

      await SponsoredStudent.updateOne(
        { _id: student._id },
        {
          $set: {
            'progress.latestScore': latestScore,
            'progress.completionPercentage': completionPercentage,
            'progress.lastUpdated': now,
            lastEngagementAt,
            metadata: updatedMetadata,
          },
        }
      );
    }
  } catch (error) {
    console.error('ƒ?O Error while refreshing sponsored student stats:', error);
  }
};

export const scheduleSponsoredStudentStatsUpdater = () => {
  cron.schedule(STUDENT_STATS_CRON, async () => {
    await refreshSponsoredStudentStats();
  });

  // Run immediately after server boots to warm cache
  setTimeout(() => {
    refreshSponsoredStudentStats();
  }, 5000);
};

export default scheduleSponsoredStudentStatsUpdater;
