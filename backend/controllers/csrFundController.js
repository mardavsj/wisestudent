import FundTransaction from "../models/FundTransaction.js";
import TaxReceipt from "../models/TaxReceipt.js";
import { findOrCreateSponsor } from "../services/csrSponsorService.js";

export const getBalanceAndTransactions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sponsor = await findOrCreateSponsor(req.user);

    const transactions = await FundTransaction.find({ sponsorId: sponsor._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      message: "Balance and recent transactions fetched",
      data: {
        sponsorId: sponsor._id,
        balance: sponsor.availableBalance,
        totalBudget: sponsor.totalBudget,
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    console.error("CSR fund balance error:", error);
    res.status(500).json({ message: "Failed to fetch balance", error: error.message });
  }
};

export const requestDeposit = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sponsor = await findOrCreateSponsor(req.user);

    const { amount, paymentMethod, referenceId, bankDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Deposit amount must be greater than zero" });
    }

    const transaction = new FundTransaction({
      sponsorId: sponsor._id,
      amount,
      type: "deposit",
      paymentMethod,
      status: "pending",
      referenceId,
      metadata: {
        bankDetails,
      },
      initiatedBy: req.user._id,
    });

    await transaction.save();

    res.status(201).json({
      message: "Deposit request submitted",
      data: transaction,
    });
  } catch (error) {
    console.error("CSR deposit request error:", error);
    res.status(500).json({ message: "Failed to request deposit", error: error.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sponsor = await findOrCreateSponsor(req.user);

    const { type, status, page = 1, limit = 25 } = req.query;
    const filter = { sponsorId: sponsor._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await FundTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await FundTransaction.countDocuments(filter);

    res.json({
      message: "Transactions fetched",
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("CSR transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

export const listTaxReceipts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sponsor = await findOrCreateSponsor(req.user);

    const receipts = await TaxReceipt.find({ sponsorId: sponsor._id }).sort({ issuanceDate: -1 });
    res.json({
      message: "Tax receipts fetched",
      data: receipts,
    });
  } catch (error) {
    console.error("CSR tax receipts error:", error);
    res.status(500).json({ message: "Failed to fetch receipts", error: error.message });
  }
};

export const downloadTaxReceipt = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const sponsor = await findOrCreateSponsor(req.user);

    const receipt = await TaxReceipt.findOne({ _id: req.params.id, sponsorId: sponsor._id });
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    if (!receipt.pdfUrl) {
      return res.status(404).json({ message: "Receipt file not available yet" });
    }

    res.json({
      message: "Receipt download ready",
      data: {
        downloadUrl: receipt.pdfUrl,
      },
    });
  } catch (error) {
    console.error("CSR receipt download error:", error);
    res.status(500).json({ message: "Failed to fetch receipt", error: error.message });
  }
};

export default {
  getBalanceAndTransactions,
  requestDeposit,
  listTransactions,
  listTaxReceipts,
  downloadTaxReceipt,
};
