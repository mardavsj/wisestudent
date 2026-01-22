import mongoose from "mongoose";

const sdgMappingSchema = new mongoose.Schema(
  {
    sdgCode: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    contribution: { type: Number, default: 0 },
  },
  { _id: false }
);

const metricSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    value: { type: Number, default: 0 },
    unit: { type: String, trim: true },
    changePercentage: { type: Number, default: 0 },
  },
  { _id: false }
);

const csrImpactReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
      default: () => `IMPR-${Date.now()}`,
      index: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    sponsorshipIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsorship",
      },
    ],
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    period: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    sdgMapping: [sdgMappingSchema],
    metrics: [metricSchema],
    summary: { type: String, trim: true },
    recommendations: { type: [String] },
    status: {
      type: String,
      enum: ["draft", "generating", "completed", "failed"],
      default: "draft",
    },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    files: {
      pdfUrl: { type: String },
      excelUrl: { type: String },
      generatedAt: { type: Date },
    },
    metadata: {
      sdgHighlights: { type: [String] },
      createdFromTemplate: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

csrImpactReportSchema.index({ sponsorId: 1, status: 1 });
csrImpactReportSchema.index({ "period.startDate": 1, "period.endDate": 1 });

export default mongoose.model("CSRImpactReport", csrImpactReportSchema);
