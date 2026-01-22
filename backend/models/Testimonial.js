import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    photos: { type: [String], default: [] },
    videoUrl: { type: String, trim: true },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    testimonialId: {
      type: String,
      unique: true,
      default: () => `TST-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedByRole: {
      type: String,
      enum: ["csr", "school_admin", "school_teacher", "school_parent", "student"],
    },
    title: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    impactTags: { type: [String], default: [] },
    sdgAlignment: { type: [String], default: [] },
    media: {
      type: mediaSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isFeatured: { type: Boolean, default: false },
    reviewNotes: { type: String, trim: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    featuredAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

testimonialSchema.index({ sponsorId: 1, schoolId: 1, status: 1 });
testimonialSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.model("Testimonial", testimonialSchema);
