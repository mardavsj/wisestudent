import CSRSponsor from "../models/CSRSponsor.js";
import FundTransaction from "../models/FundTransaction.js";
import { logAction } from "./auditService.js";
import { findOrCreateSponsor } from "./csrSponsorService.js";

export const calculateRefundAmount = async (user) => {
  const sponsor = await findOrCreateSponsor(user);
  const refundable = Math.max(0, sponsor.availableBalance);
  return {
    availableBalance: sponsor.availableBalance,
    committedAmount: sponsor.committedAmount,
    refundable,
  };
};

export const requestRefund = async (user, { amount, reason, proofUrl }) => {
  if (!amount || amount <= 0) {
    throw new Error("Refund amount must be greater than zero");
  }

  const sponsor = await findOrCreateSponsor(user);
  if (amount > sponsor.availableBalance) {
    throw new Error("Refund amount exceeds available balance");
  }

  const transaction = new FundTransaction({
    sponsorId: sponsor._id,
    amount,
    type: "refund",
    status: "pending",
    initiatedBy: user._id,
    proofUrl,
    metadata: {
      reason,
    },
  });

  await transaction.save();

  await logAction({
    userId: user._id,
    action: "request_refund",
    resourceType: "FundTransaction",
    resourceId: transaction._id,
    metadata: {
      amount,
      reason,
    },
  });

  return transaction.toObject();
};

export const processRefund = async (transactionId, adminId, { note }) => {
  const transaction = await FundTransaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Refund request not found");
  }

  if (transaction.type !== "refund") {
    throw new Error("Only refund transactions can be processed here");
  }

  if (transaction.status !== "pending") {
    throw new Error("Refund request already processed");
  }

  const sponsor = await CSRSponsor.findById(transaction.sponsorId);
  if (!sponsor) {
    throw new Error("Sponsor data missing");
  }

  if (sponsor.availableBalance < transaction.amount) {
    throw new Error("Sponsor has insufficient balance to process this refund");
  }

  transaction.status = "confirmed";
  transaction.approvedBy = adminId;
  transaction.allocatedAt = new Date();
  transaction.metadata = {
    ...transaction.metadata,
    processedNote: note,
  };
  await transaction.save();

  sponsor.availableBalance -= transaction.amount;
  await sponsor.save();

  await logAction({
    userId: adminId,
    action: "process_refund",
    resourceType: "FundTransaction",
    resourceId: transaction._id,
    metadata: {
      amount: transaction.amount,
      note,
    },
  });

  return { transaction: transaction.toObject(), sponsor: sponsor.toObject() };
};

export const listPendingRefunds = async () => {
  return FundTransaction.find({ type: "refund", status: "pending" })
    .sort({ createdAt: -1 })
    .populate("sponsorId", "companyName")
    .lean();
};

export default {
  calculateRefundAmount,
  requestRefund,
  processRefund,
  listPendingRefunds,
};
