import GalleryItem from "../models/GalleryItem.js";
import { findOrCreateSponsor } from "../services/csrSponsorService.js";

export const listGalleryItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const filter = { sponsorId: sponsor._id };
    if (req.query.schoolId) {
      filter.schoolId = req.query.schoolId;
    }
    if (req.query.approved) {
      filter.approved = req.query.approved === "true";
    }

    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json({ message: "Gallery items fetched", data: items });
  } catch (error) {
    console.error("CSR gallery list error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch gallery items", error: error.message });
  }
};

export const uploadGalleryItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const { url, caption, mediaType = "photo", schoolId, tags = [], sdgTags = [] } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Media URL is required" });
    }

    const item = new GalleryItem({
      sponsorId: sponsor._id,
      uploadedBy: req.user._id,
      url,
      caption,
      mediaType,
      schoolId,
      tags,
      sdgTags,
      publishedAt: new Date(),
    });

    await item.save();
    res.status(201).json({ message: "Gallery item uploaded", data: item });
  } catch (error) {
    console.error("CSR gallery upload error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to upload item", error: error.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const item = await GalleryItem.findOneAndDelete({
      _id: req.params.id,
      sponsorId: sponsor._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted", data: item });
  } catch (error) {
    console.error("CSR gallery delete error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to delete item", error: error.message });
  }
};

export default {
  listGalleryItems,
  uploadGalleryItem,
  deleteGalleryItem,
};
