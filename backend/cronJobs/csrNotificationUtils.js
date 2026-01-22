import CSRNotification from '../models/CSRNotification.js';
import { sendEmailNotification } from '../services/notificationService.js';

const DEFAULT_CHANNELS = ['in_app'];

const normalizeRecipients = (sponsor) => {
  const explicit = sponsor?.notificationPreferences?.recipients || [];
  const fallback = [{ userId: sponsor?.userId, email: sponsor?.email }];
  const combined = [...explicit, ...fallback].filter(
    (recipient) => recipient && (recipient.email || recipient.userId)
  );

  const seen = new Set();
  return combined.filter((recipient) => {
    const key = `${recipient.userId || ''}-${recipient.email || ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const getNotificationChannels = (sponsor) => {
  if (sponsor?.notificationPreferences?.channels?.length) {
    return sponsor.notificationPreferences.channels;
  }
  return DEFAULT_CHANNELS;
};

const sendEmails = async (recipients, title, message, link) => {
  const payload = `${message}\n\n${link ? `View details: ${link}` : ''}`.trim();
  for (const recipient of recipients || []) {
    if (!recipient?.email) {
      continue;
    }
    try {
      await sendEmailNotification(recipient.email, title, payload);
    } catch (error) {
      console.error('ƒ?O CSR notification email failed:', error);
    }
  }
};

export const dispatchCsrNotification = async (sponsor, payload) => {
  if (!sponsor || !payload) {
    return;
  }

  const recipients = normalizeRecipients(sponsor);
  const channels = getNotificationChannels(sponsor);
  const notification = new CSRNotification({
    sponsorId: sponsor._id,
    recipients,
    channels,
    status: 'pending',
    ...payload,
  });

  await notification.save();

  if (channels.includes('email')) {
    await sendEmails(recipients, payload.title, payload.message, payload.link);
  }
};

