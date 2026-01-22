import Testimonial from "../models/Testimonial.js";

export const submitTestimonial = async (payload) => {
  const testimonial = new Testimonial({
    ...payload,
    status: "pending",
  });
  return testimonial.save();
};

export const approveTestimonial = async (testimonialId, approverId, options = {}) => {
  const testimonial = await Testimonial.findById(testimonialId);
  if (!testimonial) {
    throw new Error("Testimonial not found");
  }

  testimonial.status = "approved";
  testimonial.approvedBy = approverId;
  testimonial.approvedAt = new Date();
  testimonial.reviewNotes = options.reviewNotes || testimonial.reviewNotes;
  if (options.isFeatured) {
    testimonial.isFeatured = true;
    testimonial.featuredAt = new Date();
  }
  if (options.metadata) {
    testimonial.metadata = {
      ...(testimonial.metadata || {}),
      ...options.metadata,
    };
  }

  return testimonial.save();
};

export const rejectTestimonial = async (testimonialId, reviewerId, reason) => {
  const testimonial = await Testimonial.findById(testimonialId);
  if (!testimonial) {
    throw new Error("Testimonial not found");
  }

  testimonial.status = "rejected";
  testimonial.rejectedBy = reviewerId;
  testimonial.rejectedAt = new Date();
  testimonial.reviewNotes = reason || testimonial.reviewNotes;
  return testimonial.save();
};

export const getFeaturedTestimonials = async (limit = 6) => {
  return Testimonial.find({ status: "approved", isFeatured: true })
    .sort({ featuredAt: -1 })
    .limit(limit)
    .lean();
};

export default {
  submitTestimonial,
  approveTestimonial,
  rejectTestimonial,
  getFeaturedTestimonials,
};
