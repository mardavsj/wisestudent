import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  listSponsorTestimonials,
  listPendingSponsorTestimonials,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", listSponsorTestimonials);
router.get("/pending", listPendingSponsorTestimonials);

export default router;
