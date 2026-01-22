import mongoose from "mongoose";

const csrROISchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRROICalculation", csrROISchema);
