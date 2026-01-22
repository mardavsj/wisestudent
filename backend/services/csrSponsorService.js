import CSRSponsor from "../models/CSRSponsor.js";
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
  return sponsor.toObject();
};

export const getSponsorProfile = async (user) => {
  const sponsor = await findOrCreateSponsor(user);
  return sponsor.toObject();
};

export const updateProfile = async (user, updates) => {
  const sponsor = await findOrCreateSponsor(user);
  Object.assign(sponsor, updates);
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

const csrSponsorService = {
  registerSponsor,
  getSponsorProfile,
  updateProfile,
  getDashboardData,
  calculateImpactMetrics,
  findOrCreateSponsor,
};

export default csrSponsorService;
