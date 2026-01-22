import mongoose from "mongoose";

const campaignApprovalSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CampaignApproval", campaignApprovalSchema);
