import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { processRefund, getPendingRefunds } from "../controllers/adminCsrRefundController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", getPendingRefunds);
router.post("/:id/process", processRefund);

export default router;
