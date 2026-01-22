import express from "express";
import { requireAuth, requireSchoolRole } from "../middlewares/requireAuth.js";
import { createTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireSchoolRole);

router.post("/", createTestimonial);

export default router;
