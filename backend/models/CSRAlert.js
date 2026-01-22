import mongoose from "mongoose";

const csrAlertSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

export default mongoose.model("CSRAlert", csrAlertSchema);
