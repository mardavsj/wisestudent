import CSRAuditLog from "../models/CSRAuditLog.js";

export const logAction = async ({ userId, role, action, resourceType, resourceId, metadata = {} }) => {
  if (!userId || !action) {
    throw new Error("Missing audit log context");
  }
  const record = new CSRAuditLog({
    userId,
    role,
    action,
    resourceType,
    resourceId,
    metadata,
  });
  await record.save();
  return record.toObject();
};

export const getAuditTrail = async ({ resourceType, resourceId, limit = 100 }) => {
  const filter = {};
  if (resourceType) filter.resourceType = resourceType;
  if (resourceId) filter.resourceId = resourceId;
  return CSRAuditLog.find(filter).sort({ createdAt: -1 }).limit(limit);
};

export default {
  logAction,
  getAuditTrail,
};
