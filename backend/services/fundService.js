import CSRSponsor from "../models/CSRSponsor.js";
import FundTransaction from "../models/FundTransaction.js";
import Sponsorship from "../models/Sponsorship.js";
import invoiceService from "./invoiceService.js";
import { logAction } from "./auditService.js";
import { findOrCreateSponsor } from "./csrSponsorService.js";

export const requestDeposit = async (user, { amount, paymentMethod, referenceId, bankDetails }) => {
  if (!user) throw new Error("Authentication required");
  if (!amount || amount <= 0) throw new Error("Amount must be greater than zero");

  const sponsor = await findOrCreateSponsor(user);
  const transaction = new FundTransaction({
    sponsorId: sponsor._id,
    amount,
    type: "deposit",
    status: "pending",
    paymentMethod,
    referenceId,
    initiatedBy: user._id,
    metadata: {
      bankDetails,
    },
  });
  await transaction.save();
  await logAction({
    userId: user._id,
    action: "request_deposit",
    resourceType: "FundTransaction",
    resourceId: transaction._id,
    metadata: {
      amount,
      paymentMethod,
    },
  });
  return transaction.toObject();
};

export const confirmDeposit = async (transactionId, approverId) => {
  const transaction = await FundTransaction.findById(transactionId);
  if (!transaction) throw new Error("Transaction not found");
  if (transaction.type !== "deposit") throw new Error("Only deposits can be confirmed");
  if (transaction.status !== "pending") throw new Error("Transaction already processed");

  transaction.status = "confirmed";
  transaction.approvedBy = approverId;
  transaction.allocatedAt = new Date();
  await transaction.save();

  await logAction({
    userId: approverId,
    action: "confirm_deposit",
    resourceType: "FundTransaction",
    resourceId: transaction._id,
    metadata: {
      amount: transaction.amount,
    },
  });

  const sponsor = await CSRSponsor.findById(transaction.sponsorId);
  if (sponsor) {
    sponsor.availableBalance += transaction.amount;
    sponsor.committedAmount += transaction.amount;
    await sponsor.save();

    await invoiceService.generateTaxInvoice({
      paymentId: transaction._id,
      organizationId: sponsor._id,
      organizationDetails: {
        name: sponsor.companyName,
        email: sponsor.email,
        phone: sponsor.phone,
        address: sponsor.address,
      },
      amount: transaction.amount,
      generatedBy: approverId,
      metadata: {
        sponsorId: sponsor._id,
        depositReference: transaction.referenceId,
      },
    });
  }

  return transaction.toObject();
};

export const rejectDeposit = async (transactionId, approverId, reason) => {
  const transaction = await FundTransaction.findById(transactionId);
  if (!transaction) throw new Error("Transaction not found");
  if (transaction.type !== "deposit") throw new Error("Only deposits can be rejected");
  if (transaction.status !== "pending") throw new Error("Transaction already processed");

  transaction.status = "rejected";
  transaction.approvedBy = approverId;
  transaction.metadata = { ...(transaction.metadata || {}), rejectionReason: reason };
  transaction.updatedAt = new Date();
  await transaction.save();

  return transaction.toObject();
};

export const allocateFunds = async (sponsorId, sponsorshipId, amount, allocatedBy) => {
  if (!amount || amount <= 0) throw new Error("Allocation amount must be greater than zero");

  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) throw new Error("Sponsor not found");
  if (sponsor.availableBalance < amount) throw new Error("Insufficient balance");

  const sponsorship = await Sponsorship.findById(sponsorshipId);
  if (!sponsorship) throw new Error("Sponsorship not found");

  const transaction = new FundTransaction({
    sponsorId,
    sponsorshipId,
    amount,
    type: "allocation",
    status: "confirmed",
    initiatedBy: allocatedBy,
    allocatedAt: new Date(),
  });

  sponsor.availableBalance -= amount;
  sponsor.allocatedFunds = (sponsor.allocatedFunds || 0) + amount;
  sponsorship.allocatedFunds = (sponsorship.allocatedFunds || 0) + amount;
  sponsorship.committedFunds = (sponsorship.committedFunds || 0) + amount;

  const [savedSponsor, savedSponsorship, savedTransaction] = await Promise.all([
    sponsor.save(),
    sponsorship.save(),
    transaction.save(),
  ]);

  return { sponsor: savedSponsor, sponsorship: savedSponsorship, transaction: savedTransaction };
};

export const getTransactionHistory = async (user, filters = {}) => {
  const sponsor = await findOrCreateSponsor(user);
  const { status, type, page = 1, limit = 25 } = filters;
  const query = { sponsorId: sponsor._id };
  if (status) query.status = status;
  if (type) query.type = type;

  const transactions = await FundTransaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await FundTransaction.countDocuments(query);
  return { transactions, pagination: { page: Number(page), limit: Number(limit), total } };
};

export const calculateBalance = async (user) => {
  const sponsor = await findOrCreateSponsor(user);
  return {
    balance: sponsor.availableBalance,
    totalBudget: sponsor.totalBudget,
    committedAmount: sponsor.committedAmount,
  };
};

export default {
  requestDeposit,
  confirmDeposit,
  allocateFunds,
  getTransactionHistory,
  calculateBalance,
};
