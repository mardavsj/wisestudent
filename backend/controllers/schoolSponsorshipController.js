import {
  getSponsorshipDetails,
  sendThankYou,
  uploadToGallery,
} from "../services/schoolSponsorshipService.js";

const resolveSchoolId = (req) => req.user?.orgId || req.body.schoolId || req.query.schoolId;

export const fetchSponsorshipDetails = async (req, res) => {
  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ message: "School context missing" });
    }

    const data = await getSponsorshipDetails(schoolId);
    res.json({ message: "Sponsorship details fetched", data });
  } catch (error) {
    console.error("School sponsorship details error:", error);
    res.status(500).json({ message: "Failed to fetch sponsorship details", error: error.message });
  }
};

export const postThankYou = async (req, res) => {
  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ message: "School context missing" });
    }

    const thankYou = await sendThankYou({
      schoolId,
      userId: req.user._id,
      message: req.body.message,
    });

    res.status(201).json({ message: "Thank you sent", data: thankYou });
  } catch (error) {
    console.error("School thank you error:", error);
    res.status(500).json({ message: "Failed to send thank you", error: error.message });
  }
};

export const postGalleryItem = async (req, res) => {
  try {
    const schoolId = resolveSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ message: "School context missing" });
    }

    const galleryItem = await uploadToGallery({
      schoolId,
      userId: req.user._id,
      url: req.body.url,
      mediaType: req.body.mediaType,
      caption: req.body.caption,
      tags: req.body.tags,
      sdgTags: req.body.sdgTags,
      thumbnailUrl: req.body.thumbnailUrl,
    });

    res.status(201).json({ message: "Gallery item uploaded", data: galleryItem });
  } catch (error) {
    console.error("School gallery upload error:", error);
    res.status(500).json({ message: "Failed to upload gallery item", error: error.message });
  }
};

export default {
  fetchSponsorshipDetails,
  postThankYou,
  postGalleryItem,
};
