import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, trim: true, lowercase: true },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { _id: false }
);

const csrNotificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      unique: true,
      default: () => `CSRN-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      index: true,
    },
    type: {
      type: String,
      enum: ["info", "reminder", "renewal", "alert"],
      default: "info",
    },
    title: { type: String, trim: true, required: true },
    message: { type: String, trim: true },
    category: { type: String, trim: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    channels: { type: [String], default: ["in_app"] },
    link: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    recipients: { type: [recipientSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "sent", "read", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

csrNotificationSchema.index({ sponsorId: 1, status: 1 });
csrNotificationSchema.index({ "recipients.userId": 1, "recipients.read": 1 });

export default mongoose.model("CSRNotification", csrNotificationSchema);
