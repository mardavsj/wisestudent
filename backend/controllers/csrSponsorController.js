import { registerSponsor as registerSponsorService, getSponsorProfile as getSponsorProfileService, updateProfile as updateProfileService, getDashboardData as getDashboardDataService } from "../services/csrSponsorService.js";

const handleErrorResponse = (res, error, fallbackMessage) => {
  console.error(fallbackMessage, error);
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || fallbackMessage,
    error: error.message,
  });
};

export const registerSponsor = async (req, res) => {
  try {
    const sponsor = await registerSponsorService(req.user, req.body);
    res.status(201).json({ message: "Sponsor registered", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor registration error:");
  }
};

export const getSponsorProfile = async (req, res) => {
  try {
    const sponsor = await getSponsorProfileService(req.user);
    res.json({ message: "Sponsor profile fetched", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor profile fetch error:");
  }
};

export const updateSponsorProfile = async (req, res) => {
  try {
    const sponsor = await updateProfileService(req.user, req.body);
    res.json({ message: "Sponsor profile updated", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor update error:");
  }
};

export const getSponsorDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardDataService(req.user);
    res.json({ message: "Dashboard retrieved", data: dashboard });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor dashboard error:");
  }
};

export default {
  registerSponsor,
  getSponsorProfile,
  updateSponsorProfile,
  getSponsorDashboard,
};
