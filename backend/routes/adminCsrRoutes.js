import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import {
  getPendingSponsors,
  verifySponsor,
  rejectSponsor,
} from "../controllers/adminCsrController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/pending", getPendingSponsors);
router.post("/:id/verify", verifySponsor);
router.post("/:id/reject", rejectSponsor);

export default router;
