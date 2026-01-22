import mongoose from "mongoose";

const renewalSchema = new mongoose.Schema(
  {
    nextRenewalDate: { type: Date },
    renewalCount: { type: Number, default: 0 },
    autoRenew: { type: Boolean, default: false },
    lastRenewedAt: { type: Date },
    renewalNotes: { type: String },
  },
  { _id: false }
);

const costBreakdownSchema = new mongoose.Schema(
  {
    category: { type: String, trim: true },
    amount: { type: Number, default: 0 },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const sponsorshipSchema = new mongoose.Schema(
  {
    sponsorshipId: {
      type: String,
      unique: true,
      default: () => `SPONS-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      required: true,
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["full", "partial", "urgent"],
      default: "full",
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "expired", "cancelled"],
      default: "draft",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    durationMonths: { type: Number },
    totalBudget: { type: Number, default: 0 },
    committedFunds: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    allocatedFunds: { type: Number, default: 0 },
    impactTargets: [
      {
        metric: { type: String, trim: true },
        targetValue: { type: Number },
      },
    ],
    costBreakdown: [costBreakdownSchema],
    sdgMapping: [
      {
        sdgCode: { type: String, trim: true },
        contribution: { type: Number, default: 0 },
      },
    ],
    renewal: renewalSchema,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: {
      engagementLevel: { type: String },
      focusAreas: { type: [String] },
    },
  },
  { timestamps: true }
);

sponsorshipSchema.index({ sponsorId: 1, schoolId: 1, status: 1 });
sponsorshipSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("Sponsorship", sponsorshipSchema);
