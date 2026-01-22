import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  getBalanceAndTransactions,
  requestDeposit,
  listTransactions,
  listTaxReceipts,
  downloadTaxReceipt,
} from "../controllers/csrFundController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", getBalanceAndTransactions);
router.post("/deposit", requestDeposit);
router.get("/transactions", listTransactions);
router.get("/receipts", listTaxReceipts);
router.get("/receipts/:id", downloadTaxReceipt);

export default router;
