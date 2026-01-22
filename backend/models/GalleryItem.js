import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    galleryId: {
      type: String,
      unique: true,
      default: () => `GAL-${Date.now()}`,
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
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mediaType: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String, trim: true },
    tags: { type: [String], default: [] },
    sdgTags: { type: [String], default: [] },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    metadata: {
      schoolEvent: { type: String },
      associatedCampaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

galleryItemSchema.index({ sponsorId: 1, approved: 1 });
galleryItemSchema.index({ schoolId: 1, featured: 1 });

export default mongoose.model("GalleryItem", galleryItemSchema);
