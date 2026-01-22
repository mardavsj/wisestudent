import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("Campaign", campaignSchema);
