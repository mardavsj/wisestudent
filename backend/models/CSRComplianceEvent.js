import mongoose from "mongoose";

const csrComplianceSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRComplianceEvent", csrComplianceSchema);
