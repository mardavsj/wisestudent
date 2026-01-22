import mongoose from "mongoose";

const csrAlertRuleSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRAlertRule", csrAlertRuleSchema);
