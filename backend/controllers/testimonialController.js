import Testimonial from "../models/Testimonial.js";
import {
  submitTestimonial,
  approveTestimonial,
  rejectTestimonial,
} from "../services/testimonialService.js";
import { findOrCreateSponsor } from "../services/csrSponsorService.js";

export const listSponsorTestimonials = async (req, res) => {
  try {
    const sponsor = await findOrCreateSponsor(req.user);
    const testimonials = await Testimonial.find({
      sponsorId: sponsor._id,
      status: "approved",
    }).sort({ createdAt: -1 });
    res.json({ data: testimonials });
  } catch (error) {
    console.error("CSR testimonial list failed:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

export const listPendingSponsorTestimonials = async (req, res) => {
  try {
    const sponsor = await findOrCreateSponsor(req.user);
    const testimonials = await Testimonial.find({
      sponsorId: sponsor._id,
      status: "pending",
    }).sort({ createdAt: -1 });
    res.json({ data: testimonials });
  } catch (error) {
    console.error("CSR pending testimonials fetch failed:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch pending testimonials",
      error: error.message,
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const payload = {
      schoolId: req.body.schoolId,
      sponsorId: req.body.sponsorId,
      submittedBy: req.user._id,
      submittedByRole: req.user.role,
      title: req.body.title,
      message: req.body.message,
      rating: req.body.rating,
      impactTags: req.body.impactTags || [],
      sdgAlignment: req.body.sdgAlignment || [],
      media: req.body.media || {},
      metadata: req.body.metadata || {},
    };

    const testimonial = await submitTestimonial(payload);
    res.status(201).json({ message: "Testimonial submitted", data: testimonial });
  } catch (error) {
    console.error("Testimonial submission failed:", error);
    res.status(500).json({ message: "Failed to submit testimonial", error: error.message });
  }
};

export const listPendingTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ data: testimonials });
  } catch (error) {
    console.error("Admin testimonials fetch failed:", error);
    res.status(500).json({ message: "Failed to fetch pending testimonials", error: error.message });
  }
};

export const approveTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      reviewNotes: req.body.reviewNotes,
      isFeatured: req.body.isFeatured,
      metadata: req.body.metadata,
    };
    const updated = await approveTestimonial(id, req.user._id, payload);
    res.json({ message: "Testimonial approved", data: updated });
  } catch (error) {
    console.error("Testimonial approval failed:", error);
    res.status(500).json({ message: "Failed to approve testimonial", error: error.message });
  }
};

export const rejectTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await rejectTestimonial(id, req.user._id, req.body.reason);
    res.json({ message: "Testimonial rejected", data: updated });
  } catch (error) {
    console.error("Testimonial rejection failed:", error);
    res.status(500).json({ message: "Failed to reject testimonial", error: error.message });
  }
};

export default {
  listSponsorTestimonials,
  listPendingSponsorTestimonials,
  createTestimonial,
  listPendingTestimonials,
  approveTestimonialById,
  rejectTestimonialById,
};
