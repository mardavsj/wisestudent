import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const notificationPreferenceSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    channels: {
      type: [String],
      enum: ["email", "sms", "in_app", "webhook"],
      default: ["email", "in_app"],
    },
    frequency: {
      type: String,
      enum: ["instant", "daily", "weekly", "monthly"],
      default: "daily",
    },
    recipients: [
      {
        name: { type: String, trim: true },
        email: { type: String, lowercase: true, trim: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { _id: false }
);

const csrsponsorSchema = new mongoose.Schema(
  {
    sponsorId: {
      type: String,
      unique: true,
      default: () => `CSRSP-${Date.now()}`,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true },
    contactName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    address: addressSchema,
    industry: { type: String, trim: true },
    totalBudget: { type: Number, default: 0 },
    committedAmount: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    lastReconciliationAt: { type: Date },
    sdgGoals: [
      {
        sdgCode: { type: String, trim: true },
        description: { type: String, trim: true },
        targetYear: { type: Number },
      },
    ],
    notificationPreferences: {
      type: notificationPreferenceSchema,
      default: () => ({}),
    },
    metadata: {
      headquarters: { type: String },
      ndaSigned: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "inactive", "revoked", "rejected"],
      default: "pending",
    },
    isActive: { type: Boolean, default: true },
    autoCreated: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

csrsponsorSchema.index({ companyName: "text", email: 1 });
csrsponsorSchema.index({ userId: 1, status: 1 });

export default mongoose.model("CSRSponsor", csrsponsorSchema);
