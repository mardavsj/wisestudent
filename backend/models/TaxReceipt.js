import mongoose from "mongoose";

const taxReceiptSchema = new mongoose.Schema(
  {
    receiptId: {
      type: String,
      unique: true,
      default: () => `80G-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      required: true,
      index: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundTransaction",
    },
    amount: { type: Number, required: true },
    financialYear: { type: String, trim: true },
    issuanceDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["issued", "pending", "revoked"],
      default: "pending",
    },
    validUntil: { type: Date },
    pdfUrl: { type: String, trim: true },
    notes: { type: String, trim: true },
    metadata: {
      taxOfficer: { type: String, trim: true },
      approvalReference: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

taxReceiptSchema.index({ sponsorId: 1, financialYear: 1 });
taxReceiptSchema.index({ issuanceDate: -1 });

export default mongoose.model("TaxReceipt", taxReceiptSchema);
