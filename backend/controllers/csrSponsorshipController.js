import Sponsorship from "../models/Sponsorship.js";
import { calculateRenewalCost, createRenewalSponsorship, linkOldToNew, transferStudents } from "../services/renewSponsorshipService.js";
import { findOrCreateSponsor } from "../services/csrSponsorService.js";

export const listSponsorships = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const { status, schoolId, page = 1, limit = 25 } = req.query;
    const filter = { sponsorId: sponsor._id };
    if (status) filter.status = status;
    if (schoolId) filter.schoolId = schoolId;

    const sponsorships = await Sponsorship.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Sponsorship.countDocuments(filter);

    res.json({
      message: "Sponsorships fetched",
      data: sponsorships,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("CSR sponsorship list error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch sponsorships",
      error: error.message,
    });
  }
};

export const createSponsorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const payload = {
      sponsorId: sponsor._id,
      ...req.body,
      status: "draft",
      createdBy: req.user._id,
    };
    const sponsorship = new Sponsorship(payload);
    await sponsorship.save();

    res.status(201).json({ message: "Sponsorship created", data: sponsorship });
  } catch (error) {
    console.error("CSR sponsorship create error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to create", error: error.message });
  }
};

export const getSponsorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const sponsorship = await Sponsorship.findOne({
      _id: req.params.id,
      sponsorId: sponsor._id,
    });

    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.json({ message: "Sponsorship fetched", data: sponsorship });
  } catch (error) {
    console.error("CSR sponsorship detail error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch", error: error.message });
  }
};

export const updateSponsorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const updates = { ...req.body, updatedBy: req.user._id, updatedAt: new Date() };
    const sponsorship = await Sponsorship.findOneAndUpdate(
      { _id: req.params.id, sponsorId: sponsor._id },
      { $set: updates },
      { new: true }
    );

    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.json({ message: "Sponsorship updated", data: sponsorship });
  } catch (error) {
    console.error("CSR sponsorship update error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to update", error: error.message });
  }
};

export const cancelSponsorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const sponsorship = await Sponsorship.findOneAndUpdate(
      { _id: req.params.id, sponsorId: sponsor._id },
      { status: "cancelled", updatedBy: req.user._id, updatedAt: new Date() },
      { new: true }
    );

    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.json({ message: "Sponsorship cancelled", data: sponsorship });
  } catch (error) {
    console.error("CSR sponsorship cancel error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to cancel", error: error.message });
  }
};

export const renewSponsorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const existing = await Sponsorship.findOne({
      _id: req.params.id,
      sponsorId: sponsor._id,
    });

    if (!existing) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    const renewalCost = calculateRenewalCost(existing, req.body);
    const renewal = await createRenewalSponsorship(existing, req.body, req.user._id);
    await linkOldToNew(existing._id, renewal._id, renewal.startDate);
    await transferStudents(existing._id, renewal._id);

    res.status(201).json({
      message: "Renewal created",
      data: {
        renewal,
        renewalCost,
      },
    });
  } catch (error) {
    console.error("CSR sponsorship renewal error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to renew sponsorship",
      error: error.message,
    });
  }
};

export default {
  listSponsorships,
  createSponsorship,
  getSponsorship,
  updateSponsorship,
  cancelSponsorship,
  renewSponsorship,
};
