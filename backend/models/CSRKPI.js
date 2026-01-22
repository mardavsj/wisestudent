import mongoose from "mongoose";

const csrKPISchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRKPI", csrKPISchema);
