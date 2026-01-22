import mongoose from "mongoose";

const fundTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      default: () => `FTX-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      required: true,
      index: true,
    },
    sponsorshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sponsorship",
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    type: {
      type: String,
      enum: ["deposit", "allocation", "refund", "reversal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "reversed"],
      default: "pending",
    },
    paymentMethod: { type: String, trim: true },
    referenceId: { type: String, trim: true },
    description: { type: String, trim: true },
    proofUrl: { type: String, trim: true },
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    allocatedAt: { type: Date },
    metadata: {
      bankDetails: { type: Object },
      receiptNumber: { type: String, trim: true },
      reconciliationNotes: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

fundTransactionSchema.index({ sponsorId: 1, status: 1 });
fundTransactionSchema.index({ sponsorshipId: 1, type: 1 });

export default mongoose.model("FundTransaction", fundTransactionSchema);
