import SponsoredStudent from "../models/SponsoredStudent.js";
import User from "../models/User.js";

export const checkIfSponsored = async (studentId) => {
  return SponsoredStudent.findOne({ studentId, isActive: true }).populate({
    path: "sponsorshipId",
    populate: { path: "sponsorId", select: "companyName metadata" },
  });
};

export const getSponsorBadge = async (studentId) => {
  const record = await SponsoredStudent.findOne({ studentId, isActive: true }).populate({
    path: "sponsorshipId",
    populate: { path: "sponsorId", select: "companyName metadata" },
  });

  if (!record?.sponsorshipId?.sponsorId) {
    return null;
  }

  const { sponsorshipId } = record;
  const sponsor = sponsorshipId.sponsorId;

  return {
    sponsorId: sponsor._id,
    sponsorName: sponsor.companyName,
    sponsorLogo: sponsor.metadata?.logoUrl || sponsor.metadata?.logo || "",
    message: `Sponsored through ${sponsorshipId.title}`,
    awardedAt: record.joinedAt,
  };
};

export const updateSponsorBadge = async (studentId) => {
  const badge = await getSponsorBadge(studentId);
  if (!badge) {
    await User.findByIdAndUpdate(studentId, { $unset: { sponsorBadge: "" } });
    return null;
  }

  const updated = await User.findByIdAndUpdate(
    studentId,
    { sponsorBadge: badge },
    { new: true }
  );

  return updated?.sponsorBadge || badge;
};

export default {
  checkIfSponsored,
  getSponsorBadge,
  updateSponsorBadge,
};
