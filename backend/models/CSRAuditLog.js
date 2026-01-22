import mongoose from "mongoose";

const csrAuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, trim: true },
    resourceType: { type: String, trim: true },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

csrAuditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
csrAuditLogSchema.index({ userId: 1, action: 1 });

const CSRAuditLog = mongoose.model("CSRAuditLog", csrAuditLogSchema);
export default CSRAuditLog;
