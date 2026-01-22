import cron from 'node-cron';
import CSRSponsor from '../models/CSRSponsor.js';
import Sponsorship from '../models/Sponsorship.js';
import { dispatchCsrNotification } from './csrNotificationUtils.js';

const CRON_SCHEDULE = '0 9 * * *';
const REMINDER_WINDOWS = [30, 14, 7, 1];

const getWindowRange = (reference, daysAhead) => {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + daysAhead);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const runAgreementExpiryChecks = async () => {
  try {
    const now = new Date();
    for (const daysAhead of REMINDER_WINDOWS) {
      const { start, end } = getWindowRange(now, daysAhead);
      const matches = await Sponsorship.find({
        status: { $in: ['active', 'paused'] },
        'metadata.agreementExpiry': { $gte: start, $lte: end },
      }).lean();

      for (const sponsorship of matches) {
        const metadata = sponsorship.metadata || {};
        const alreadyReminded = new Set(metadata.agreementReminderDays || []);
        if (alreadyReminded.has(daysAhead)) {
          continue;
        }

        const sponsor = await CSRSponsor.findById(sponsorship.sponsorId).lean();
        if (!sponsor) {
          continue;
        }

        const title =
          daysAhead === 0
            ? `Agreement for ${sponsorship.title} expires today`
            : `Agreement for ${sponsorship.title} expires in ${daysAhead} day(s)`;
        const message = `The agreement / MOU for ${sponsorship.title} expires on ${new Date(
          metadata.agreementExpiry
        ).toLocaleDateString()}. Please coordinate renewals or extensions to keep operations running.`;

        await dispatchCsrNotification(sponsor, {
          type: 'reminder',
          severity: daysAhead <= 7 ? 'high' : 'medium',
          title,
          message,
          category: 'sponsorship',
          link: `/csr/sponsorships/${sponsorship._id}`,
          metadata: {
            sponsorshipId: sponsorship._id,
            agreementExpiry: metadata.agreementExpiry,
            daysUntilExpiry: daysAhead,
          },
        });

        alreadyReminded.add(daysAhead);
        await Sponsorship.updateOne(
          { _id: sponsorship._id },
          {
            metadata: {
              ...metadata,
              agreementReminderDays: Array.from(alreadyReminded),
            },
          }
        );
      }
    }
  } catch (error) {
    console.error('ƒ?O Agreement expiry job failed:', error);
  }
};

export const scheduleAgreementExpiryChecks = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runAgreementExpiryChecks();
  });

  setTimeout(() => {
    runAgreementExpiryChecks();
  }, 5000);
};

export default scheduleAgreementExpiryChecks;
