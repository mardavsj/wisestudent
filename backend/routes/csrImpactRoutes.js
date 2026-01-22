import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import { getImpactMetrics, getRegionalBreakdown } from "../controllers/csrImpactController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", getImpactMetrics);
router.get("/regional", getRegionalBreakdown);

export default router;
