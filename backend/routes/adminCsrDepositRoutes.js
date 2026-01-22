import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import {
  listPendingDeposits,
  confirmDeposit,
  rejectDeposit,
} from "../controllers/adminCsrDepositController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", listPendingDeposits);
router.post("/:id/confirm", confirmDeposit);
router.post("/:id/reject", rejectDeposit);

export default router;
