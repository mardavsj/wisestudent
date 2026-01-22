import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  listSponsorships,
  createSponsorship,
  getSponsorship,
  updateSponsorship,
  cancelSponsorship,
  renewSponsorship,
} from "../controllers/csrSponsorshipController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", listSponsorships);
router.post("/", createSponsorship);
router.get("/:id", getSponsorship);
router.post("/:id/renew", renewSponsorship);
router.put("/:id", updateSponsorship);
router.delete("/:id", cancelSponsorship);

export default router;
