import refundService from "../services/refundService.js";

export const processRefund = async (req, res) => {
  try {
    const processed = await refundService.processRefund(req.params.id, req.user._id, {
      note: req.body.note,
    });
    res.json({ message: "Refund processed", data: processed });
  } catch (error) {
    console.error("Admin refund process error:", error);
    res.status(500).json({ message: "Failed to process refund", error: error.message });
  }
};

export const getPendingRefunds = async (req, res) => {
  try {
    const refunds = await refundService.listPendingRefunds();
    res.json({ message: "Pending refunds fetched", data: refunds });
  } catch (error) {
    console.error("Admin refunds fetch error:", error);
    res.status(500).json({ message: "Failed to fetch refunds", error: error.message });
  }
};

export default {
  processRefund,
  getPendingRefunds,
};
