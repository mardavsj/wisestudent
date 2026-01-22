import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";
import { listAuditTrail } from "../controllers/csrAuditController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", auditMiddleware({ action: "view_audit", resourceType: "AuditTrail" }), listAuditTrail);

export default router;
