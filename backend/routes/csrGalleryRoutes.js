import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  listGalleryItems,
  uploadGalleryItem,
  deleteGalleryItem,
} from "../controllers/csrGalleryController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.get("/", listGalleryItems);
router.post("/", uploadGalleryItem);
router.delete("/:id", deleteGalleryItem);

export default router;
