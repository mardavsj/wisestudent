import adminCsrService from "../services/adminCsrService.js";

export const getPendingSponsors = async (req, res) => {
  try {
    const sponsors = await adminCsrService.listPendingSponsors();
    res.json({ message: "Pending sponsors loaded", data: sponsors });
  } catch (error) {
    console.error("Admin pending sponsors error:", error);
    res.status(500).json({ message: "Failed to load pending sponsors", error: error.message });
  }
};

export const verifySponsor = async (req, res) => {
  try {
    const sponsor = await adminCsrService.verifySponsor(req.params.id, req.user._id);
    res.json({ message: "Sponsor approved", data: sponsor });
  } catch (error) {
    console.error("Admin verify sponsor error:", error);
    res.status(500).json({ message: "Failed to approve sponsor", error: error.message });
  }
};

export const rejectSponsor = async (req, res) => {
  try {
    const { reason } = req.body;
    const sponsor = await adminCsrService.rejectSponsor(req.params.id, req.user._id, reason);
    res.json({ message: "Sponsor rejected", data: sponsor });
  } catch (error) {
    console.error("Admin reject sponsor error:", error);
    res.status(500).json({ message: "Failed to reject sponsor", error: error.message });
  }
};

export default {
  getPendingSponsors,
  verifySponsor,
  rejectSponsor,
};
