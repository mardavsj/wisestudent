import mongoose from "mongoose";

const timelineEntrySchema = new mongoose.Schema(
  {
    period: { type: String, trim: true },
    count: { type: Number, default: 0 },
    date: { type: Date },
  },
  { _id: false }
);

const weeklyTrendSchema = new mongoose.Schema(
  {
    week: { type: String, trim: true },
    sessions: { type: Number, default: 0 },
    participation: { type: Number, default: 0 },
  },
  { _id: false }
);

const studentReachSchema = new mongoose.Schema(
  {
    totalOnboarded: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    activePercentage: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    dropoffRate: { type: Number, default: 0 },
    onboardingTimeline: [timelineEntrySchema],
  },
  { _id: false }
);

const engagementSchema = new mongoose.Schema(
  {
    averageSessionsPerStudent: { type: Number, default: 0 },
    participationRate: { type: Number, default: 0 },
    engagementTrend: {
      type: String,
      enum: ["increasing", "stable", "declining"],
      default: "stable",
    },
    autoInsight: { type: String, trim: true },
    weeklyTrend: [weeklyTrendSchema],
  },
  { _id: false }
);

const exposureLevelEnum = ["low", "medium", "high"];

const readinessExposureSchema = new mongoose.Schema(
  {
    financialAwareness: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    decisionAwareness: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    pressureHandling: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    emotionalRegulation: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    goalSetting: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    timeManagement: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    socialAwareness: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    criticalThinking: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    selfAwareness: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
    adaptability: {
      level: { type: String, enum: exposureLevelEnum, default: "low" },
      trend: { type: String, enum: ["increasing", "stable", "declining"], default: "stable" },
    },
  },
  { _id: false }
);

const recognitionSchema = new mongoose.Schema(
  {
    certificatesIssued: { type: Number, default: 0 },
    recognitionKitsDispatched: { type: Number, default: 0 },
    recognitionKitsInProgress: { type: Number, default: 0 },
    completionBasedRecognition: { type: Number, default: 0 },
  },
  { _id: false }
);

const programMetricsSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      unique: true,
      index: true,
    },
    studentReach: {
      type: studentReachSchema,
      default: () => ({}),
    },
    engagement: {
      type: engagementSchema,
      default: () => ({}),
    },
    readinessExposure: {
      type: readinessExposureSchema,
      default: () => ({}),
    },
    recognition: {
      type: recognitionSchema,
      default: () => ({}),
    },
    // Computation tracking
    lastComputedAt: {
      type: Date,
    },
    computedBy: {
      type: String,
      enum: ["system", "manual"],
      default: "system",
    },
  },
  { timestamps: true }
);

// Static method to get all pillar names
programMetricsSchema.statics.getPillarNames = function () {
  return [
    "financialAwareness",
    "decisionAwareness",
    "pressureHandling",
    "emotionalRegulation",
    "goalSetting",
    "timeManagement",
    "socialAwareness",
    "criticalThinking",
    "selfAwareness",
    "adaptability",
  ];
};

// Static method to get pillar display labels
programMetricsSchema.statics.getPillarLabels = function () {
  return {
    financialAwareness: "Financial Awareness Exposure",
    decisionAwareness: "Decision Awareness Exposure",
    pressureHandling: "Pressure Handling Exposure",
    emotionalRegulation: "Emotional Regulation Exposure",
    goalSetting: "Goal Setting Exposure",
    timeManagement: "Time Management Exposure",
    socialAwareness: "Social Awareness Exposure",
    criticalThinking: "Critical Thinking Exposure",
    selfAwareness: "Self Awareness Exposure",
    adaptability: "Adaptability Exposure",
  };
};

export default mongoose.model("ProgramMetrics", programMetricsSchema);
