import cron from 'node-cron';
import CSRNotification from '../models/CSRNotification.js';
import { sendEmailNotification } from '../services/notificationService.js';

const CRON_SCHEDULE = '*/5 * * * *';

const sendEmails = async (notification) => {
  if (!notification?.recipients?.length || !notification.channels?.includes('email')) {
    return;
  }

  const linkText = notification.link ? `\n\nView details: ${notification.link}` : '';
  const payload = `${notification.message}${linkText}`.trim();

  for (const recipient of notification.recipients) {
    if (!recipient?.email) {
      continue;
    }
    try {
      await sendEmailNotification(recipient.email, notification.title, payload);
    } catch (error) {
      console.error('ƒ?O Failed to send pending notification email:', error);
    }
  }
};

const dispatchPendingNotifications = async () => {
  const pendingNotifications = await CSRNotification.find({ status: 'pending' }).limit(25);
  if (!pendingNotifications.length) {
    return;
  }

  for (const notification of pendingNotifications) {
    try {
      await CSRNotification.updateOne(
        { _id: notification._id },
        { status: 'sending', 'metadata.sendingAt': new Date() }
      );

      await sendEmails(notification);

      await CSRNotification.updateOne(
        { _id: notification._id },
        { status: 'sent', 'metadata.sentAt': new Date() }
      );
    } catch (error) {
      console.error('ƒ?O Pending notification processing failed:', error);
      await CSRNotification.updateOne(
        { _id: notification._id },
        {
          status: 'failed',
          'metadata.lastError': error.message,
          'metadata.failedAt': new Date(),
        }
      );
    }
  }
};

export const schedulePendingNotifications = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await dispatchPendingNotifications();
  });

  setTimeout(() => {
    dispatchPendingNotifications();
  }, 5000);
};

export default schedulePendingNotifications;
