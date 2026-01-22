import Sponsorship from "../models/Sponsorship.js";
import Organization from "../models/Organization.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import SponsoredStudent from "../models/SponsoredStudent.js";
import { findOrCreateSponsor } from "./csrSponsorService.js";

export const createSponsorship = async (user, payload) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  const sponsor = await findOrCreateSponsor(user);
  const sponsorship = new Sponsorship({
    sponsorId: sponsor._id,
    ...payload,
    status: "draft",
    createdBy: user._id,
  });
  await sponsorship.save();
  return sponsorship.toObject();
};

export const activateStudents = async (sponsorshipId, studentIds, userId) => {
  if (!studentIds?.length) {
    throw new Error("Student list is required");
  }

  const sponsorship = await Sponsorship.findById(sponsorshipId);
  if (!sponsorship) {
    throw new Error("Sponsorship not found");
  }

  const newRecords = [];
  for (const studentId of studentIds) {
    const existing = await SponsoredStudent.findOne({
      sponsorshipId,
      studentId,
    });
    if (existing) continue;

    const sponsored = new SponsoredStudent({
      sponsorshipId,
      studentId,
      joinedAt: new Date(),
      notes: "Activated via service",
    });
    await sponsored.save();
    newRecords.push(sponsored);
  }

  sponsorship.status = "active";
  sponsorship.updatedBy = userId;
  sponsorship.updatedAt = new Date();
  await sponsorship.save();

  return newRecords;
};

export const getAvailableSchools = async (filters = {}) => {
  const { search, includeInactive } = filters;
  const query = { type: "school" };
  if (!includeInactive) query.isActive = true;
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { name: regex },
      { "settings.address.city": regex },
      { "settings.address.state": regex },
    ];
  }
  const schools = await Organization.find(query).lean();
  const schoolIds = schools.map((school) => school._id);
  const studentCounts = await SchoolStudent.aggregate([
    { $match: { orgId: { $in: schoolIds } } },
    { $group: { _id: "$orgId", count: { $sum: 1 } } },
  ]);
  const map = studentCounts.reduce((acc, row) => {
    acc[row._id.toString()] = row.count;
    return acc;
  }, {});

  return schools.map((school) => ({
    ...school,
    studentCount: map[school._id.toString()] || 0,
  }));
};

export const calculateCost = (sponsorship) => {
  if (!sponsorship?.costBreakdown?.length) return 0;
  return sponsorship.costBreakdown.reduce((sum, entry) => sum + (entry.amount || 0), 0);
};

export const cancelSponsorship = async (user, sponsorshipId) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  const sponsor = await findOrCreateSponsor(user);
  const sponsorship = await Sponsorship.findOne({
    _id: sponsorshipId,
    sponsorId: sponsor._id,
  });
  if (!sponsorship) {
    throw new Error("Sponsorship not found");
  }

  sponsorship.status = "cancelled";
  sponsorship.updatedBy = user._id;
  sponsorship.updatedAt = new Date();
  await sponsorship.save();
  return sponsorship.toObject();
};

export default {
  createSponsorship,
  activateStudents,
  getAvailableSchools,
  calculateCost,
  cancelSponsorship,
};
