import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  requestRefund,
  getRefundAmount,
} from "../controllers/csrRefundController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.post("/", requestRefund);
router.get("/amount", getRefundAmount);

export default router;
