import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityType: {
      type: String,
      enum: [
        "login",
        "logout",
        "page_view",
        "budget_created",
        "budget_updated",
        "investment_made",
        "savings_goal_created",
        "savings_goal_updated",
        "contribution_added",
        "financial_action",
        "quiz_completed",
        "expense_added",
        "expense_deleted",
        "mood_logged",
        "journal_entry",
        "challenge_started",
        "challenge_completed",
        "reward_redeemed",
        "xp_earned",
        "level_up",
        "feature_used",
        "analytics_view",
        "student_interaction",
        "feedback_provided",
        "assignment_created",
        "assignment_graded",
        // Admin actions
        "admin_action",
        // New activity types from StudentDashboard
        "data_fetch",
        "navigation",
        "ui_interaction",
        "error",
      ],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    pageUrl: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ activityType: 1, timestamp: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
