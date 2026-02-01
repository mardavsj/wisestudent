import CSRSponsor from "../models/CSRSponsor.js";
import CSRNotification from "../models/CSRNotification.js";
import FundTransaction from "../models/FundTransaction.js";
import Program from "../models/Program.js";
import fundService from "./fundService.js";
import { sendEmailNotification } from "./notificationService.js";

/**
 * List all CSR partners with filters and pagination
 * @param {Object} filters - { status, search, page, limit }
 * @returns {Object} { partners, total, page, pages }
 */
export const listAllPartners = async (filters = {}) => {
  const { status, search, page = 1, limit = 10 } = filters;
  const query = {};
  const User = (await import("../models/User.js")).default;

  // Filter by status - handle both approval status and business status
  if (status) {
    const approvalStatuses = ["pending", "approved", "rejected"];
    const businessStatuses = ["active", "inactive", "revoked"];
    
    if (Array.isArray(status)) {
      const approvalFilters = status.filter(s => approvalStatuses.includes(s));
      const businessFilters = status.filter(s => businessStatuses.includes(s));
      
      if (approvalFilters.length > 0 && businessFilters.length > 0) {
        // Both approval and business filters - need to join
        const approvalUserIds = await User.find({ 
          role: "csr", 
          approvalStatus: { $in: approvalFilters } 
        }).select("_id").lean();
        query.userId = { $in: approvalUserIds.map(u => u._id) };
        query.status = { $in: businessFilters };
      } else if (approvalFilters.length > 0) {
        // Only approval filters
        const approvalUserIds = await User.find({ 
          role: "csr", 
          approvalStatus: { $in: approvalFilters } 
        }).select("_id").lean();
        query.userId = { $in: approvalUserIds.map(u => u._id) };
      } else {
        // Only business filters
        query.status = { $in: businessFilters };
      }
    } else {
      if (approvalStatuses.includes(status)) {
        // Approval status filter
        const approvalUserIds = await User.find({ 
          role: "csr", 
          approvalStatus: status 
        }).select("_id").lean();
        query.userId = { $in: approvalUserIds.map(u => u._id) };
      } else {
        // Business status filter
        query.status = status;
      }
    }
  }

  // Search by company name or email
  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { contactName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [partners, total] = await Promise.all([
    CSRSponsor.find(query)
      .populate("userId", "name email approvalStatus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CSRSponsor.countDocuments(query),
  ]);

  // Get program count for each partner and add approvalStatus
  const partnersWithPrograms = await Promise.all(
    partners.map(async (partner) => {
      const programCount = await Program.countDocuments({ csrPartnerId: partner._id });
      return { 
        ...partner, 
        programCount,
        approvalStatus: partner.userId?.approvalStatus || "pending"
      };
    })
  );

  return {
    partners: partnersWithPrograms,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    limit: Number(limit),
  };
};

/**
 * Get detailed info for a specific CSR partner
 * @param {ObjectId} partnerId - CSR Partner ID
 * @returns {Object} { partner, programs }
 */
export const getPartnerDetails = async (partnerId) => {
  const partner = await CSRSponsor.findById(partnerId)
    .populate("userId", "name email approvalStatus")
    .lean();

  if (!partner) {
    const error = new Error("CSR Partner not found");
    error.status = 404;
    throw error;
  }

  // Get all programs for this partner
  const programs = await Program.find({ csrPartnerId: partnerId })
    .select("programId name status duration scope metrics createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return { partner, programs };
};

export const listPendingSponsors = async () => {
  // Find CSR sponsors where User.approvalStatus is pending
  const User = (await import("../models/User.js")).default;
  const pendingUsers = await User.find({ 
    role: "csr", 
    approvalStatus: "pending" 
  }).select("_id");
  
  const userIds = pendingUsers.map(u => u._id);
  return CSRSponsor.find({ userId: { $in: userIds } })
    .populate("userId", "name email approvalStatus")
    .sort({ createdAt: -1 });
};

export const verifySponsor = async (sponsorId, adminId) => {
  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) {
    const error = new Error("Sponsor not found");
    error.status = 404;
    throw error;
  }

  // Update User.approvalStatus (source of truth for approval)
  const User = (await import("../models/User.js")).default;
  await User.findByIdAndUpdate(sponsor.userId, {
    approvalStatus: "approved",
    approvedBy: adminId,
    approvedAt: new Date(),
  });

  // Update CSRSponsor business status and metadata
  sponsor.status = "active"; // Business status
  sponsor.metadata = {
    ...sponsor.metadata,
    verifiedBy: adminId,
    verifiedAt: new Date(),
    approvedBy: adminId,
    approvedAt: new Date(),
  };
  await sponsor.save();

  // Send notification to CSR about approval
  try {
    const { notifyCSRApproved } = await import('../cronJobs/csrNotificationUtils.js');
    await notifyCSRApproved(sponsor);
  } catch (error) {
    console.error('Failed to notify CSR about approval:', error);
    // Don't fail approval if notification fails
  }

  return sponsor.toObject();
};

export const rejectSponsor = async (sponsorId, adminId, reason) => {
  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) {
    const error = new Error("Sponsor not found");
    error.status = 404;
    throw error;
  }

  // Update User.approvalStatus (source of truth for approval)
  const User = (await import("../models/User.js")).default;
  await User.findByIdAndUpdate(sponsor.userId, {
    approvalStatus: "rejected",
    rejectedAt: new Date(),
    rejectionReason: reason,
  });

  // Update CSRSponsor metadata (status remains active/inactive for business logic)
  sponsor.metadata = {
    ...sponsor.metadata,
    rejectedBy: adminId,
    rejectedAt: new Date(),
    rejectionReason: reason,
  };
  await sponsor.save();

  // Send notification to CSR about rejection
  try {
    const { notifyCSRRejected } = await import('../cronJobs/csrNotificationUtils.js');
    await notifyCSRRejected(sponsor, reason);
  } catch (error) {
    console.error('Failed to notify CSR about rejection:', error);
    // Don't fail rejection if notification fails
  }

  return sponsor.toObject();
};

/**
 * Deactivate a CSR partner
 * @param {ObjectId} partnerId - CSR Partner ID
 * @param {ObjectId} adminId - Admin performing action
 * @returns {Object} Updated partner
 */
export const deactivatePartner = async (partnerId, adminId) => {
  const partner = await CSRSponsor.findById(partnerId);
  if (!partner) {
    const error = new Error("CSR Partner not found");
    error.status = 404;
    throw error;
  }

  partner.status = "inactive";
  partner.isActive = false;
  partner.metadata = {
    ...partner.metadata,
    deactivatedBy: adminId,
    deactivatedAt: new Date(),
  };
  await partner.save();

  return partner.toObject();
};

/**
 * Reactivate a CSR partner
 * @param {ObjectId} partnerId - CSR Partner ID
 * @param {ObjectId} adminId - Admin performing action
 * @returns {Object} Updated partner
 */
export const reactivatePartner = async (partnerId, adminId) => {
  const partner = await CSRSponsor.findById(partnerId);
  if (!partner) {
    const error = new Error("CSR Partner not found");
    error.status = 404;
    throw error;
  }

  partner.status = "active";
  partner.isActive = true;
  partner.metadata = {
    ...partner.metadata,
    reactivatedBy: adminId,
    reactivatedAt: new Date(),
  };
  await partner.save();

  return partner.toObject();
};

/**
 * Update CSR partner details (company name, contact, email, phone)
 * @param {ObjectId} partnerId - CSR Partner ID
 * @param {Object} updates - { companyName?, contactName?, email?, phone?, website? }
 * @returns {Object} Updated partner
 */
export const updatePartner = async (partnerId, updates) => {
  const partner = await CSRSponsor.findById(partnerId);
  if (!partner) {
    const error = new Error("CSR Partner not found");
    error.status = 404;
    throw error;
  }

  const allowed = ["companyName", "contactName", "email", "phone", "website"];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      partner[key] = updates[key];
    }
  }
  await partner.save();

  const updated = await CSRSponsor.findById(partnerId).populate("userId", "name email").lean();
  return updated || partner.toObject();
};

/**
 * List CSR notifications (for admin "View sent notifications")
 * @param {Object} filters - { sponsorId, type, status, page, limit, fromDate, toDate }
 * @returns {Object} { notifications, total, page, pages, limit }
 */
export const listNotifications = async (filters = {}) => {
  const {
    sponsorId,
    type,
    status,
    page = 1,
    limit = 20,
    fromDate,
    toDate,
  } = filters;

  const query = {};
  if (sponsorId) query.sponsorId = sponsorId;
  if (type) query.type = type;
  if (status) query.status = status;
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }

  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    CSRNotification.find(query)
      .populate("sponsorId", "companyName email contactName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CSRNotification.countDocuments(query),
  ]);

  return {
    notifications,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit) || 1,
    limit: Number(limit),
  };
};

/**
 * Send a notification to one or more CSR partners (admin "Send notification")
 * @param {Object} payload - { sponsorIds or sponsorId, title, message, type?, link?, sendEmail? }
 * @returns {Object} { sent: number, notifications: [...] }
 */
export const sendNotification = async (payload) => {
  const { sponsorIds, sponsorId, title, message, type = "info", link, sendEmail = false } = payload;
  const ids = Array.isArray(sponsorIds) ? sponsorIds : sponsorId ? [sponsorId] : [];
  if (!ids.length || !title) {
    const error = new Error("sponsorIds (or sponsorId) and title are required");
    error.status = 400;
    throw error;
  }

  const sponsors = await CSRSponsor.find({ _id: { $in: ids } })
    .populate("userId", "email name")
    .lean();
  if (!sponsors.length) {
    const error = new Error("No valid CSR partners found");
    error.status = 404;
    throw error;
  }

  const channels = sendEmail ? ["in_app", "email"] : ["in_app"];
  const created = [];

  for (const sponsor of sponsors) {
    const recipients = [
      { userId: sponsor.userId?._id || sponsor.userId, email: sponsor.email || sponsor.userId?.email, read: false },
    ].filter((r) => r.userId || r.email);

    const notification = new CSRNotification({
      sponsorId: sponsor._id,
      type,
      title,
      message: message || "",
      category: "admin",
      severity: "medium",
      channels,
      link: link || "",
      recipients,
      status: "sent",
    });
    await notification.save();
    created.push(notification);

    try {
      const { emitCsrNotificationToRecipients } = await import("../utils/csrNotificationSocket.js");
      emitCsrNotificationToRecipients(notification);
    } catch (err) {
      console.error("CSR notification socket emit failed:", err);
    }

    if (sendEmail && recipients.length) {
      for (const r of recipients) {
        if (r.email) {
          try {
            await sendEmailNotification(
              r.email,
              title,
              `${message || ""}\n\n${link ? `View: ${link}` : ""}`.trim()
            );
          } catch (err) {
            console.error("Admin CSR notification email failed:", err);
          }
        }
      }
    }
  }

  return { sent: created.length, notifications: created };
};

export const listPendingDeposits = async () => {
  return FundTransaction.find({ type: "deposit", status: "pending" }).sort({ createdAt: -1 });
};

export const approveDeposit = async (transactionId, adminId) => {
  return fundService.confirmDeposit(transactionId, adminId);
};

export const declineDeposit = async (transactionId, adminId, reason) => {
  return fundService.rejectDeposit(transactionId, adminId, reason);
};

export default {
  listAllPartners,
  getPartnerDetails,
  listPendingSponsors,
  verifySponsor,
  rejectSponsor,
  deactivatePartner,
  reactivatePartner,
  updatePartner,
  listNotifications,
  sendNotification,
  listPendingDeposits,
  approveDeposit,
  declineDeposit,
};
