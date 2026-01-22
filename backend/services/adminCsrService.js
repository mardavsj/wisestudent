import CSRSponsor from "../models/CSRSponsor.js";
import FundTransaction from "../models/FundTransaction.js";
import fundService from "./fundService.js";

export const listPendingSponsors = async () => {
  return CSRSponsor.find({ status: "pending" }).sort({ createdAt: -1 });
};

export const verifySponsor = async (sponsorId, adminId) => {
  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error("Sponsor not found");
  }

  sponsor.status = "approved";
  sponsor.metadata = { ...sponsor.metadata, verifiedBy: adminId, verifiedAt: new Date() };
  await sponsor.save();
  return sponsor.toObject();
};

export const rejectSponsor = async (sponsorId, adminId, reason) => {
  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error("Sponsor not found");
  }

  sponsor.status = "rejected";
  sponsor.metadata = {
    ...sponsor.metadata,
    rejectedBy: adminId,
    rejectedAt: new Date(),
    rejectionReason: reason,
  };
  await sponsor.save();
  return sponsor.toObject();
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
  listPendingSponsors,
  verifySponsor,
  rejectSponsor,
  listPendingDeposits,
  approveDeposit,
  declineDeposit,
};
