import cron from 'node-cron';
import CSRSponsor from '../models/CSRSponsor.js';
import { dispatchCsrNotification } from './csrNotificationUtils.js';

const CRON_SCHEDULE = '0 10 * * *';
const MIN_THRESHOLD = 100000;
const LOW_BALANCE_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return '₹0';
  }
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const runLowBalanceAlerts = async () => {
  try {
    const now = new Date();
    const sponsors = await CSRSponsor.find({ status: 'approved', isActive: true }).lean();

    for (const sponsor of sponsors) {
      const threshold = Math.max(MIN_THRESHOLD, (sponsor.totalBudget || 0) * 0.1);
      if (sponsor.availableBalance >= threshold) {
        continue;
      }

      const lastNotified = sponsor.metadata?.lastLowBalanceNotificationAt;
      if (lastNotified && now.getTime() - new Date(lastNotified).getTime() < LOW_BALANCE_DELAY_MS) {
        continue;
      }

      const title = 'Your CSR balance is running low';
      const message = `Your available CSR balance of ${formatCurrency(
        sponsor.availableBalance
      )} is below the recommended threshold of ${formatCurrency(threshold)}. Please add funds to keep your sponsorships active.`;

      await dispatchCsrNotification(sponsor, {
        type: 'alert',
        severity: 'high',
        title,
        message,
        category: 'funds',
        link: '/csr/funds',
        metadata: {
          availableBalance: sponsor.availableBalance,
          threshold,
        },
      });

      await CSRSponsor.updateOne(
        { _id: sponsor._id },
        {
          metadata: {
            ...(sponsor.metadata || {}),
            lastLowBalanceNotificationAt: now,
            lowBalanceThreshold: threshold,
          },
        }
      );
    }
  } catch (error) {
    console.error('ƒ?O Low balance alert job failed:', error);
  }
};

export const scheduleLowBalanceAlerts = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runLowBalanceAlerts();
  });

  setTimeout(() => {
    runLowBalanceAlerts();
  }, 5000);
};

export default scheduleLowBalanceAlerts;
