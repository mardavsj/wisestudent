import Organization from "../models/Organization.js";
import Sponsorship from "../models/Sponsorship.js";
import SponsoredStudent from "../models/SponsoredStudent.js";
import GalleryItem from "../models/GalleryItem.js";

const findActiveSponsorship = async (schoolId) => {
  return Sponsorship.findOne({
    schoolId,
    status: { $in: ["active", "renewal"] },
  })
    .sort({ endDate: -1 })
    .populate("sponsorId", "companyName metadata")
    .lean();
};

export const getSponsorshipDetails = async (schoolId) => {
  const organization = await Organization.findById(schoolId);
  if (!organization) {
    throw new Error("School not found");
  }

  const sponsorship = await findActiveSponsorship(schoolId);
  if (!sponsorship) {
    return { message: "No active sponsorship found for this school" };
  }

  const studentCount = await SponsoredStudent.countDocuments({
    sponsorshipId: sponsorship._id,
    isActive: true,
  });

  if (organization.sponsorshipInfo?.sponsorshipId?.toString() !== sponsorship._id.toString()) {
    organization.sponsorshipInfo = {
      ...organization.sponsorshipInfo,
      sponsorId: sponsorship.sponsorId?._id,
      sponsorshipId: sponsorship._id,
      status: "active",
      studentsCovered: studentCount,
      committedAmount: sponsorship.committedFunds || 0,
      lastUpdated: new Date(),
      nextRenewalDate: sponsorship.renewal?.nextRenewalDate,
    };
    await organization.save();
  }

  return {
    sponsorship,
    studentCount,
    school: organization.toObject(),
  };
};

export const sendThankYou = async ({ schoolId, userId, message }) => {
  if (!message || !message.trim()) {
    throw new Error("Thank you message cannot be empty");
  }

  const organization = await Organization.findById(schoolId);
  if (!organization) {
    throw new Error("School not found");
  }

  if (!organization.sponsorshipInfo || !organization.sponsorshipInfo.sponsorId) {
    throw new Error("No sponsor linked to this school");
  }

  organization.sponsorshipInfo = {
    ...organization.sponsorshipInfo,
    lastThankYou: {
      message,
      createdBy: userId,
      createdAt: new Date(),
    },
    lastUpdated: new Date(),
  };

  await organization.save();

  return organization.sponsorshipInfo.lastThankYou;
};

export const uploadToGallery = async ({
  schoolId,
  userId,
  url,
  mediaType = "photo",
  caption,
  tags = [],
  sdgTags = [],
  thumbnailUrl,
}) => {
  if (!url) {
    throw new Error("Media URL is required");
  }

  const organization = await Organization.findById(schoolId);
  if (!organization) {
    throw new Error("School not found");
  }

  const galleryItem = new GalleryItem({
    schoolId,
    sponsorId: organization.sponsorshipInfo?.sponsorId,
    uploadedBy: userId,
    mediaType,
    url,
    thumbnailUrl,
    caption,
    tags,
    sdgTags,
    approved: false,
    publishedAt: new Date(),
  });

  await galleryItem.save();
  return galleryItem.toObject();
};

export default {
  getSponsorshipDetails,
  sendThankYou,
  uploadToGallery,
};
