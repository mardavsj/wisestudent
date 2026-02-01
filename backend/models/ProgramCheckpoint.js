import mongoose from "mongoose";

const metricsSnapshotSchema = new mongoose.Schema(
  {
    studentsOnboarded: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    participationRate: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    schoolsImplemented: { type: Number, default: 0 },
    regionsCovered: { type: Number, default: 0 },
  },
  { _id: false }
);

const programCheckpointSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    checkpointNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    type: {
      type: String,
      enum: [
        "program_approval",
        "onboarding_confirmation",
        "mid_program_review",
        "completion_review",
        "extension_renewal",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ready", "acknowledged", "completed"],
      default: "pending",
    },
    // Trigger info (when checkpoint becomes ready)
    triggeredAt: {
      type: Date,
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Acknowledgment info (when CSR acknowledges)
    acknowledgedAt: {
      type: Date,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Completion info
    completedAt: {
      type: Date,
    },
    // Metrics snapshot captured when checkpoint is triggered
    metricsSnapshot: {
      type: metricsSnapshotSchema,
      default: () => ({}),
    },
    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Compound unique index - one checkpoint per number per program
programCheckpointSchema.index(
  { programId: 1, checkpointNumber: 1 },
  { unique: true }
);

// Additional indexes
programCheckpointSchema.index({ status: 1 });
programCheckpointSchema.index({ programId: 1, status: 1 });
programCheckpointSchema.index({ type: 1 });

// Static method to get checkpoint type based on number
programCheckpointSchema.statics.getCheckpointType = function (number) {
  const checkpointTypes = {
    1: "program_approval",
    2: "onboarding_confirmation",
    3: "mid_program_review",
    4: "completion_review",
    5: "extension_renewal",
  };
  return checkpointTypes[number] || null;
};

// Static method to get checkpoint label
programCheckpointSchema.statics.getCheckpointLabel = function (number) {
  const checkpointLabels = {
    1: "Program Approval",
    2: "Onboarding Confirmation",
    3: "Mid-Program Review",
    4: "Completion & Impact Review",
    5: "Extension/Renewal",
  };
  return checkpointLabels[number] || `Checkpoint ${number}`;
};

// Virtual for checking if checkpoint is pending CSR action
programCheckpointSchema.virtual("requiresCSRAction").get(function () {
  return this.status === "ready";
});

// Virtual for checking if checkpoint is complete
programCheckpointSchema.virtual("isComplete").get(function () {
  return this.status === "completed";
});

// Ensure virtuals are included in JSON output
programCheckpointSchema.set("toJSON", { virtuals: true });
programCheckpointSchema.set("toObject", { virtuals: true });

export default mongoose.model("ProgramCheckpoint", programCheckpointSchema);
