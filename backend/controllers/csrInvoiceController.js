import Invoice from "../models/Invoice.js";
import invoiceService from "../services/invoiceService.js";

export const listInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ organizationId: req.query.organizationId }).sort({ issueDate: -1 });
    res.json({ data: invoices });
  } catch (error) {
    console.error("Invoice list failed:", error);
    res.status(500).json({ message: "Failed to fetch invoices", error: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const pdfData = await invoiceService.generateInvoicePDF(id);
    res.json({ data: pdfData });
  } catch (error) {
    console.error("Invoice download failed:", error);
    res.status(500).json({ message: "Failed to download invoice", error: error.message });
  }
};

export default {
  listInvoices,
  downloadInvoice,
};
