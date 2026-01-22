import mongoose from "mongoose";

const csrGoalSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRGoal", csrGoalSchema);
