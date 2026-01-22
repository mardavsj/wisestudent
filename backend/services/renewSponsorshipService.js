import mongoose from "mongoose";
import Sponsorship from "../models/Sponsorship.js";
import SponsoredStudent from "../models/SponsoredStudent.js";

const calculateDurationEndDate = (startDate, durationMonths) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + durationMonths);
  return end;
};

export const calculateRenewalCost = (existing, overrides = {}) => {
  const costBreakdown = overrides.costBreakdown || existing.costBreakdown || [];
  return costBreakdown.reduce((sum, entry) => sum + (entry?.amount || 0), 0);
};

export const createRenewalSponsorship = async (existing, overrides = {}, userId) => {
  const durationMonths = overrides.durationMonths || existing.durationMonths || 12;
  const startDate = overrides.startDate
    ? new Date(overrides.startDate)
    : new Date(existing.endDate || Date.now());
  const endDate = overrides.endDate
    ? new Date(overrides.endDate)
    : calculateDurationEndDate(startDate, durationMonths);

  const sponsorshipPayload = {
    sponsorId: existing.sponsorId,
    schoolId: existing.schoolId,
    title: overrides.title || existing.title,
    description: overrides.description || existing.description,
    type: overrides.type || existing.type,
    status: "draft",
    startDate,
    endDate,
    durationMonths,
    totalBudget: overrides.totalBudget ?? existing.totalBudget,
    committedFunds: 0,
    remainingBudget: overrides.totalBudget ?? existing.totalBudget,
    allocatedFunds: 0,
    costBreakdown: overrides.costBreakdown || existing.costBreakdown || [],
    sdgMapping: overrides.sdgMapping || existing.sdgMapping || [],
    renewal: {
      ...existing.renewal,
      renewalNotes: overrides.renewalNotes || `Renewal for ${existing.title}`,
    },
    createdBy: userId,
    metadata: {
      ...(existing.metadata || {}),
      renewalSource: existing._id,
      renewalMode: overrides.method || "manual",
    },
  };

  const renewal = new Sponsorship(sponsorshipPayload);
  await renewal.save();
  return renewal.toObject();
};

export const linkOldToNew = async (existingId, renewalId, startDate) => {
  const update = {
    $set: {
      "renewal.nextRenewalDate": startDate,
      "renewal.lastRenewedAt": new Date(),
    },
    $inc: {
      "renewal.renewalCount": 1,
    },
    $push: {
      "metadata.renewalHistory": renewalId,
    },
  };

  await Sponsorship.updateOne({ _id: existingId }, update);
};

export const transferStudents = async (existingId, renewalId) => {
  const students = await SponsoredStudent.find({ sponsorshipId: existingId }).lean();
  if (!students.length) {
    return [];
  }

  const newStudents = students.map((student) => ({
    _id: new mongoose.Types.ObjectId(),
    sponsorshipId: renewalId,
    studentId: student.studentId,
    relationshipStatus: student.relationshipStatus || "active",
    activityLogs: student.activityLogs || [],
    progress: student.progress || {},
    joinedAt: new Date(),
    lastEngagementAt: student.lastEngagementAt,
    tags: student.tags || [],
    notes: `Transferred from ${existingId}`,
    isActive: true,
    metadata: {
      ...(student.metadata || {}),
      renewedFrom: existingId,
    },
  }));

  await SponsoredStudent.insertMany(newStudents);
  return newStudents;
};

export default {
  calculateRenewalCost,
  createRenewalSponsorship,
  linkOldToNew,
  transferStudents,
};
