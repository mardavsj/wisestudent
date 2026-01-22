import adminCsrService from "../services/adminCsrService.js";

export const listPendingDeposits = async (req, res) => {
  try {
    const deposits = await adminCsrService.listPendingDeposits();
    res.json({ message: "Pending deposits fetched", data: deposits });
  } catch (error) {
    console.error("Admin pending deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits", error: error.message });
  }
};

export const confirmDeposit = async (req, res) => {
  try {
    const deposit = await adminCsrService.approveDeposit(req.params.id, req.user._id);
    res.json({ message: "Deposit confirmed", data: deposit });
  } catch (error) {
    console.error("Admin confirm deposit error:", error);
    res.status(500).json({ message: "Failed to confirm deposit", error: error.message });
  }
};

export const rejectDeposit = async (req, res) => {
  try {
    const { reason } = req.body;
    const deposit = await adminCsrService.declineDeposit(req.params.id, req.user._id, reason);
    res.json({ message: "Deposit rejected", data: deposit });
  } catch (error) {
    console.error("Admin reject deposit error:", error);
    res.status(500).json({ message: "Failed to reject deposit", error: error.message });
  }
};

export default {
  listPendingDeposits,
  confirmDeposit,
  rejectDeposit,
};
