import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import { getAvailableSchools, getSchoolDetails } from "../controllers/csrSchoolController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/available", getAvailableSchools);
router.get("/:id", getSchoolDetails);

export default router;
