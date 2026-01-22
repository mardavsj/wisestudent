import cron from 'node-cron';
import CSRSponsor from '../models/CSRSponsor.js';
import Organization from '../models/Organization.js';
import Sponsorship from '../models/Sponsorship.js';
import { dispatchCsrNotification } from './csrNotificationUtils.js';

const CRON_SCHEDULE = '0 11 * * *';
const MIN_DAYS = 30;

const runTestimonialRequests = async () => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - MIN_DAYS);
    const sponsorships = await Sponsorship.find({
      status: 'active',
      startDate: { $lte: cutoff },
      'metadata.testimonialRequestedAt': { $exists: false },
    }).lean();

    for (const sponsorship of sponsorships) {
      const sponsor = await CSRSponsor.findById(sponsorship.sponsorId).lean();
      if (!sponsor) {
        continue;
      }

      const school = await Organization.findById(sponsorship.schoolId).select('name').lean();
      const schoolName = school?.name || 'the partner school';
      const daysActive = Math.ceil((Date.now() - new Date(sponsorship.startDate).getTime()) / (1000 * 60 * 60 * 24));

      const title = 'Testimonial request pending';
      const message = `Your sponsorship with ${schoolName} has been active for ${daysActive} day(s). Kindly request a testimonial or success story to showcase the impact on the school community.`;

      await dispatchCsrNotification(sponsor, {
        type: 'reminder',
        severity: 'medium',
        title,
        message,
        category: 'testimonials',
        link: `/csr/sponsorships/${sponsorship._id}`,
        metadata: {
          sponsorshipId: sponsorship._id,
          daysActive,
        },
      });

      await Sponsorship.updateOne(
        { _id: sponsorship._id },
        {
          metadata: {
            ...(sponsorship.metadata || {}),
            testimonialRequestedAt: new Date(),
          },
        }
      );
    }
  } catch (error) {
    console.error('ƒ?O Testimonial request job failed:', error);
  }
};

export const scheduleTestimonialRequests = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runTestimonialRequests();
  });

  setTimeout(() => {
    runTestimonialRequests();
  }, 5000);
};

export default scheduleTestimonialRequests;
