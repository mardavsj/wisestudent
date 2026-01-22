import cron from 'node-cron';
import CSRSponsor from '../models/CSRSponsor.js';
import Sponsorship from '../models/Sponsorship.js';
import { dispatchCsrNotification } from './csrNotificationUtils.js';

const CRON_SCHEDULE = '0 9 * * *';
const EXPIRY_INTERVALS = [30, 15, 7, 1];

const getWindowRange = (referenceDate, daysAhead) => {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + daysAhead);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const notifyExpiringSponsorships = async () => {
  const now = new Date();
  for (const daysAhead of EXPIRY_INTERVALS) {
    const { start, end } = getWindowRange(now, daysAhead);
    const upcoming = await Sponsorship.find({
      status: { $in: ['active', 'paused'] },
      endDate: { $gte: start, $lte: end },
    }).lean();

    for (const sponsorship of upcoming) {
      const metadata = sponsorship.metadata || {};
      const notifiedDays = new Set(metadata.expiryNotifications || []);
      if (notifiedDays.has(daysAhead)) {
        continue;
      }

      const sponsor = await CSRSponsor.findById(sponsorship.sponsorId).lean();
      if (!sponsor) {
        continue;
      }

      const title =
        daysAhead === 0
          ? `Sponsorship ${sponsorship.title} expires today`
          : `Sponsorship ${sponsorship.title} expires in ${daysAhead} day(s)`;
      const message = `Your sponsorship for ${sponsorship.title} is set to close in ${daysAhead} day(s) on ${sponsorship.endDate?.toLocaleDateString()}. Consider renewing if you plan to continue support.`;

      await dispatchCsrNotification(sponsor, {
        type: 'reminder',
        severity: daysAhead <= 7 ? 'high' : 'medium',
        title,
        message,
        category: 'sponsorship',
        link: `/csr/sponsorships/${sponsorship._id}`,
        metadata: {
          sponsorshipId: sponsorship._id,
          daysUntilExpiry: daysAhead,
        },
      });

      notifiedDays.add(daysAhead);
      await Sponsorship.updateOne(
        { _id: sponsorship._id },
        {
          metadata: {
            ...metadata,
            expiryNotifications: Array.from(notifiedDays),
          },
        }
      );
    }
  }
};

const expireSponsorships = async () => {
  const now = new Date();
  const expired = await Sponsorship.find({
    status: { $in: ['active', 'paused'] },
    endDate: { $lt: now },
  }).lean();

  for (const sponsorship of expired) {
    const metadata = sponsorship.metadata || {};
    if (metadata.expiryHandled) {
      continue;
    }

    const sponsor = await CSRSponsor.findById(sponsorship.sponsorId).lean();
    if (sponsor) {
      await dispatchCsrNotification(sponsor, {
        type: 'alert',
        severity: 'critical',
        title: `Sponsorship ${sponsorship.title} has expired`,
        message: `The sponsorship for ${sponsorship.title} ended on ${sponsorship.endDate?.toLocaleDateString()}. Funds are no longer allocated until a renewal is processed.`,
        category: 'sponsorship',
        link: `/csr/sponsorships/${sponsorship._id}`,
        metadata: {
          sponsorshipId: sponsorship._id,
          expiredAt: sponsorship.endDate,
        },
      });
    }

    await Sponsorship.updateOne(
      { _id: sponsorship._id },
      {
        status: 'expired',
        metadata: {
          ...metadata,
          expiryHandled: true,
        },
      }
    );
  }
};

const runExpiryChecks = async () => {
  try {
    await notifyExpiringSponsorships();
    await expireSponsorships();
  } catch (error) {
    console.error('ƒ?O Error checking expiring sponsorships:', error);
  }
};

export const scheduleExpiringSponsorships = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runExpiryChecks();
  });

  setTimeout(() => {
    runExpiryChecks();
  }, 5000);
};

export default scheduleExpiringSponsorships;
