import { getAuditTrail } from "../services/auditService.js";

export const listAuditTrail = async (req, res) => {
  try {
    const { resourceType, resourceId, limit } = req.query;
    const records = await getAuditTrail({
      resourceType,
      resourceId,
      limit: Number(limit) || 100,
    });
    res.json({ data: records });
  } catch (error) {
    console.error("Audit trail fetch failed:", error);
    res.status(500).json({ message: "Failed to fetch audit trail", error: error.message });
  }
};

export default {
  listAuditTrail,
};
