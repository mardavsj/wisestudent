import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  listImpactReports,
  generateImpactReport,
  downloadImpactReport,
} from "../controllers/csrImpactReportController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", listImpactReports);
router.post("/generate", generateImpactReport);
router.get("/:id/download", downloadImpactReport);

export default router;
