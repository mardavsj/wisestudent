import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  listPendingTestimonials,
  approveTestimonialById,
  rejectTestimonialById,
} from "../controllers/testimonialController.js";

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

router.use(requireAuth);
router.use(requireAdmin);

router.get("/pending", listPendingTestimonials);
router.post("/:id/approve", approveTestimonialById);
router.post("/:id/reject", rejectTestimonialById);

export default router;
