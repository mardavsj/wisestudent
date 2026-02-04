import CSRSponsor from "../models/CSRSponsor.js";
import CSRNotification from "../models/CSRNotification.js";
import FundTransaction from "../models/FundTransaction.js";
import Sponsorship from "../models/Sponsorship.js";
import TaxReceipt from "../models/TaxReceipt.js";
import SponsoredStudent from "../models/SponsoredStudent.js";

const buildFallbackSponsorPayload = (user) => {
  const companyName = user.organization || user.fullName || user.name || user.email;
  return {
    userId: user._id,
    companyName,
    contactName: user.name || user.fullName || user.email,
    email: user.email,
    phone: user.phone,
    organization: user.organization,
    status: "pending",
    autoCreated: true,
  };
};

export const findOrCreateSponsor = async (user) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  let sponsor = await CSRSponsor.findOne({ userId: user._id });
  if (!sponsor) {
    sponsor = new CSRSponsor(buildFallbackSponsorPayload(user));
    await sponsor.save();
  }
  return sponsor;
};

const getTotals = async (sponsorId) => {
  const [transactionTotals, activeSponsorships, pendingDeposits, issuedReceipts] = await Promise.all([
    FundTransaction.aggregate([
      { $match: { sponsorId, status: { $ne: "failed" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Sponsorship.countDocuments({ sponsorId, status: "active" }),
    FundTransaction.countDocuments({ sponsorId, status: "pending", type: "deposit" }),
    TaxReceipt.countDocuments({ sponsorId, status: "issued" }),
  ]);

  return {
    totalFundsRaised: transactionTotals?.[0]?.total || 0,
    activeSponsorships,
    pendingDeposits,
    taxReceipts: issuedReceipts,
  };
};

export const registerSponsor = async (user, payload) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  let sponsor = await CSRSponsor.findOne({ userId: user._id });
  if (sponsor && !sponsor.autoCreated) {
    const error = new Error("Sponsor already registered");
    error.status = 409;
    throw error;
  }

  const sponsorData = {
    userId: user._id,
    ...payload,
    status: "pending",
    autoCreated: false,
  };

  if (sponsor) {
    Object.assign(sponsor, sponsorData);
  } else {
    sponsor = new CSRSponsor(sponsorData);
  }

  await sponsor.save();
  
  // Notify admins about new CSR registration
  try {
    const { notifyAdminNewCSR } = await import('../cronJobs/csrNotificationUtils.js');
    await notifyAdminNewCSR(sponsor);
  } catch (error) {
    console.error('Failed to notify admins about new CSR registration:', error);
    // Don't fail registration if notification fails
  }
  
  return sponsor.toObject();
};

export const getSponsorProfile = async (user) => {
  const sponsor = await findOrCreateSponsor(user);
  return sponsor.toObject();
};

export const updateProfile = async (user, updates) => {
  const sponsor = await findOrCreateSponsor(user);
  
  // Handle nested address object properly
  if (updates.address) {
    sponsor.address = { ...(sponsor.address || {}), ...updates.address };
    sponsor.markModified('address');
  }
  
  // Handle other fields
  const { address, ...otherUpdates } = updates;
  Object.assign(sponsor, otherUpdates);
  
  sponsor.autoCreated = false;
  await sponsor.save();
  return sponsor.toObject();
};

export const getDashboardData = async (user) => {
  const sponsor = await findOrCreateSponsor(user);
  const totals = await getTotals(sponsor._id);

  return {
    sponsor: sponsor.toObject(),
    balance: sponsor.availableBalance,
    ...totals,
    lastUpdated: sponsor.updatedAt,
  };
};

export const calculateImpactMetrics = async (filters = {}) => {
  const { period = "month" } = filters;
  const now = new Date();
  let startDate;
  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "quarter":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const [students, sponsorships, funds] = await Promise.all([
    SponsoredStudent.countDocuments({ joinedAt: { $gte: startDate } }),
    Sponsorship.countDocuments({ updatedAt: { $gte: startDate } }),
    FundTransaction.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    studentsImpacted: students,
    sponsorshipsUpdated: sponsorships,
    fundsAllocated: funds?.[0]?.total || 0,
    period,
  };
};

/** Notifications older than this are excluded from list and deleted by cron (7 days) */
const CSR_NOTIFICATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * List CSR notifications for the current user (doc alignment: GET /api/csr/notifications)
 * Only returns notifications from the last 7 days; older ones are auto-deleted.
 */
export const listCsrNotifications = async (userId, options = {}) => {
  const sponsor = await CSRSponsor.findOne({ userId });
  if (!sponsor) return { notifications: [], unreadCount: 0 };

  const { limit = 50 } = options;
  const since = new Date(Date.now() - CSR_NOTIFICATION_TTL_MS);
  const notifications = await CSRNotification.find({
    sponsorId: sponsor._id,
    createdAt: { $gte: since },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const userIdStr = userId.toString();
  const mapped = notifications.map((n) => {
    const recipient = n.recipients?.find((r) => r.userId?.toString() === userIdStr);
    return {
      _id: n._id,
      notificationId: n.notificationId,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      category: n.category,
      severity: n.severity,
      createdAt: n.createdAt,
      read: recipient?.read ?? false,
      readAt: recipient?.readAt,
    };
  });

  const unreadCount = mapped.filter((n) => !n.read).length;
  return { notifications: mapped, unreadCount };
};

/**
 * Mark a CSR notification as read (doc alignment: PUT /api/csr/notifications/:id/read)
 */
export const markCsrNotificationRead = async (notificationId, userId) => {
  const sponsor = await CSRSponsor.findOne({ userId });
  if (!sponsor) {
    const error = new Error("CSR partner not found");
    error.status = 404;
    throw error;
  }

  const notification = await CSRNotification.findOne({
    _id: notificationId,
    sponsorId: sponsor._id,
  });
  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }

  const userIdStr = userId.toString();
  const recipients = notification.recipients || [];
  for (let i = 0; i < recipients.length; i++) {
    if (recipients[i].userId?.toString() === userIdStr) {
      recipients[i].read = true;
      recipients[i].readAt = new Date();
      break;
    }
  }
  await notification.save();

  return notification.toObject();
};

/**
 * Mark all CSR notifications as read for the current user
 */
export const markAllCsrNotificationsRead = async (userId) => {
  const sponsor = await CSRSponsor.findOne({ userId });
  if (!sponsor) return { updated: 0 };

  const notifications = await CSRNotification.find({
    sponsorId: sponsor._id,
    recipients: { $elemMatch: { userId, read: false } },
  });
  const userIdStr = userId.toString();
  let updated = 0;
  for (const notification of notifications) {
    for (let i = 0; i < (notification.recipients || []).length; i++) {
      if (notification.recipients[i].userId?.toString() === userIdStr) {
        notification.recipients[i].read = true;
        notification.recipients[i].readAt = new Date();
        updated++;
        break;
      }
    }
    await notification.save();
  }
  return { updated };
};

const csrSponsorService = {
  registerSponsor,
  getSponsorProfile,
  updateProfile,
  getDashboardData,
  calculateImpactMetrics,
  findOrCreateSponsor,
  listCsrNotifications,
  markCsrNotificationRead,
  markAllCsrNotificationsRead,
};

export default csrSponsorService;
