import TaxReceipt from "../models/TaxReceipt.js";
import CSRSponsor from "../models/CSRSponsor.js";
import FundTransaction from "../models/FundTransaction.js";

export const getFinancialYear = (date = new Date()) => {
  const year = date.getFullYear();
  return date.getMonth() >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const generate80GReceipt = async ({ sponsorId, transactionId, amount, financialYear, pdfUrl, metadata = {} }) => {
  const sponsor = await CSRSponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error("Sponsor not found");
  }

  const transaction = transactionId ? await FundTransaction.findById(transactionId) : null;

  const receipt = new TaxReceipt({
    sponsorId,
    transactionId,
    amount,
    financialYear: financialYear || getFinancialYear(),
    pdfUrl,
    status: "issued",
    metadata,
  });

  await receipt.save();

  if (transaction) {
    transaction.metadata = transaction.metadata || {};
    transaction.metadata.taxReceiptId = receipt._id;
    await transaction.save();
  }

  return receipt.toObject();
};

export default {
  generate80GReceipt,
  getFinancialYear,
};
