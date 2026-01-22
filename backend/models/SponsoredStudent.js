import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    details: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    baselineScore: { type: Number, default: 0 },
    latestScore: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    lastUpdated: { type: Date },
  },
  { _id: false }
);

const sponsoredStudentSchema = new mongoose.Schema(
  {
    sponsorshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sponsorship",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    relationshipStatus: {
      type: String,
      enum: ["active", "paused", "graduated", "alumni"],
      default: "active",
    },
    activityLogs: [activityLogSchema],
    progress: progressSchema,
    joinedAt: { type: Date, default: Date.now },
    lastEngagementAt: { type: Date },
    tags: { type: [String], default: [] },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sponsoredStudentSchema.index({ sponsorshipId: 1, studentId: 1 }, { unique: true });
sponsoredStudentSchema.index({ lastEngagementAt: 1 });

export default mongoose.model("SponsoredStudent", sponsoredStudentSchema);
