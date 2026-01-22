import refundService from "../services/refundService.js";

export const requestRefund = async (req, res) => {
  try {
    const data = await refundService.requestRefund(req.user, req.body);
    res.status(201).json({ message: "Refund request submitted", data });
  } catch (error) {
    console.error("CSR refund request error:", error);
    res.status(500).json({ message: "Failed to request refund", error: error.message });
  }
};

export const getRefundAmount = async (req, res) => {
  try {
    const data = await refundService.calculateRefundAmount(req.user);
    res.json({ message: "Refundable amount calculated", data });
  } catch (error) {
    console.error("CSR refund amount error:", error);
    res.status(500).json({ message: "Failed to calculate refund", error: error.message });
  }
};

export default {
  requestRefund,
  getRefundAmount,
};
