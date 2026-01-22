import Invoice from "../models/Invoice.js";
import CSRSponsor from "../models/CSRSponsor.js";

const DEFAULT_LINE_ITEM_CATEGORY = "campaign_funding";

const buildLineItems = ({ amount, description, taxRate = 0 }) => {
  const lineItem = {
    description: description || "CSR deposit",
    quantity: 1,
    unitPrice: amount,
    totalPrice: amount,
    taxRate,
    taxAmount: (amount * taxRate) / 100,
    category: DEFAULT_LINE_ITEM_CATEGORY,
  };
  return [lineItem];
};

const generateInvoiceNumber = () => {
  const now = new Date();
  const prefix = `CSR-INV-${now.getFullYear()}`;
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${suffix}`;
};

const createInvoice = async (payload) => {
  const invoice = new Invoice({
    invoiceNumber: payload.invoiceNumber || generateInvoiceNumber(),
    invoiceType: payload.invoiceType || "payment_invoice",
    paymentId: payload.paymentId,
    organizationId: payload.organizationId,
    organizationDetails: payload.organizationDetails,
    issueDate: payload.issueDate || new Date(),
    dueDate: payload.dueDate,
    currency: payload.currency || "INR",
    lineItems: payload.lineItems || buildLineItems(payload),
    subtotal: payload.subtotal || payload.amount,
    taxAmount: payload.taxAmount || 0,
    discountAmount: payload.discountAmount || 0,
    totalAmount: payload.totalAmount || payload.amount,
    taxBreakdown: payload.taxBreakdown || [],
    paymentTerms: payload.paymentTerms || "Net 30",
    paymentInstructions: payload.paymentInstructions,
    status: payload.status || "draft",
    generatedBy: payload.generatedBy,
    metadata: payload.metadata || {},
  });
  invoice.calculateTotals();
  if (payload.status === "sent") {
    invoice.sentAt = new Date();
  }
  await invoice.save();
  return invoice.toObject();
};

export const generateProformaInvoice = async (payload) => {
  return createInvoice({ ...payload, status: "draft" });
};

export const generateTaxInvoice = async (payload) => {
  return createInvoice({ ...payload, status: "sent" });
};

export const generateUtilizationCertificate = async (payload) => {
  const certificate = await createInvoice({
    ...payload,
    invoiceType: "credit_note",
    status: "sent",
    metadata: {
      ...payload.metadata,
      certificate: true,
    },
  });
  return certificate;
};

export const generateInvoicePDF = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId).lean();
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  // Placeholder: In production, integrate with PDF generator
  return {
    pdfUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/mock-invoices/${invoiceId}.pdf`,
    metadata: invoice.metadata,
  };
};

export default {
  generateProformaInvoice,
  generateTaxInvoice,
  generateUtilizationCertificate,
  generateInvoicePDF,
};
