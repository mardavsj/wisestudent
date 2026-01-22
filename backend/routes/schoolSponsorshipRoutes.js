import express from "express";
import { requireAuth, requireSchoolRole } from "../middlewares/requireAuth.js";
import {
  fetchSponsorshipDetails,
  postThankYou,
  postGalleryItem,
} from "../controllers/schoolSponsorshipController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireSchoolRole);

router.get("/", fetchSponsorshipDetails);
router.post("/thank-you", postThankYou);
router.post("/gallery", postGalleryItem);

export default router;
