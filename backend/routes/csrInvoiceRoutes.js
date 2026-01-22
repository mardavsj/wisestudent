import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import { listInvoices, downloadInvoice } from "../controllers/csrInvoiceController.js";
import { auditMiddleware } from "../middlewares/auditMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", auditMiddleware({ action: "list_invoices", resourceType: "Invoice" }), listInvoices);
router.get("/:id/download", auditMiddleware({ action: "download_invoice", resourceType: "Invoice" }), downloadInvoice);

export default router;
