import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  registerSponsor,
  getSponsorProfile,
  updateSponsorProfile,
  getSponsorDashboard,
} from "../controllers/csrSponsorController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.post("/register", registerSponsor);
router.get("/profile", getSponsorProfile);
router.put("/profile", updateSponsorProfile);
router.get("/dashboard", getSponsorDashboard);

export default router;
