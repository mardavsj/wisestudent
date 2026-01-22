import SponsoredStudent from "../models/SponsoredStudent.js";
import Sponsorship from "../models/Sponsorship.js";
import FundTransaction from "../models/FundTransaction.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import CSRImpactReport from "../models/CSRImpactReport.js";

const getDateFromPeriod = (period) => {
  const now = new Date();
  switch (period) {
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "quarter":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "year":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
};

export const getImpactMetrics = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const startDate = getDateFromPeriod(period);

    const [studentsImpacted, totalSponsorships, fundsAllocated, latestReports] = await Promise.all([
      SponsoredStudent.countDocuments({ joinedAt: { $gte: startDate } }),
      Sponsorship.countDocuments({ status: "active" }),
      FundTransaction.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      CSRImpactReport.find({ status: "completed" })
        .sort({ "period.startDate": -1 })
        .limit(5),
    ]);

    const reportHighlights = latestReports.map((report) => ({
      id: report._id,
      title: report.title,
      summary: report.summary,
      schools: report.sponsorshipIds?.length || 0,
      startDate: report.period?.startDate,
    }));

    res.json({
      message: "Impact metrics retrieved",
      data: {
        studentsImpacted,
        activeSponsorships: totalSponsorships,
        fundsAllocated: fundsAllocated?.[0]?.total || 0,
        reportHighlights,
        period,
      },
    });
  } catch (error) {
    console.error("CSR impact metrics error:", error);
    res.status(500).json({ message: "Failed to fetch impact metrics", error: error.message });
  }
};

export const getRegionalBreakdown = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const startDate = getDateFromPeriod(period);

    const schools = await Organization.aggregate([
      { $match: { type: "school" } },
      {
        $group: {
          _id: "$settings.address.city",
          total: { $sum: 1 },
          states: { $addToSet: "$settings.address.state" },
        },
      },
      {
        $project: {
          region: "$_id",
          total: 1,
          states: 1,
        },
      },
    ]);

    const studentData = await SponsoredStudent.aggregate([
      { $match: { joinedAt: { $gte: startDate } } },
      {
        $lookup: {
          from: "organizations",
          localField: "schoolId",
          foreignField: "_id",
          as: "school",
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ["$school.settings.address.city", 0] },
          students: { $sum: 1 },
        },
      },
    ]);

    res.json({
      message: "Regional breakdown fetched",
      data: { period, schools, studentData },
    });
  } catch (error) {
    console.error("CSR regional breakdown error:", error);
    res.status(500).json({ message: "Failed to fetch regional data", error: error.message });
  }
};

export default {
  getImpactMetrics,
  getRegionalBreakdown,
};
