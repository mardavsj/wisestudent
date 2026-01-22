import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import CSRImpactReport from "../models/CSRImpactReport.js";
import Sponsorship from "../models/Sponsorship.js";
import SponsoredStudent from "../models/SponsoredStudent.js";
import FundTransaction from "../models/FundTransaction.js";
import pdfReportGenerator from "./pdfReportGenerator.js";
import { findOrCreateSponsor } from "./csrSponsorService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateImpactReport = async (user, payload) => {
  const sponsor = await findOrCreateSponsor(user);
  const metrics = await getReportMetrics(sponsor._id, payload);
  const sdgMapping = mapToSDG(payload.sdgMapping || []);

  const report = new CSRImpactReport({
    sponsorId: sponsor._id,
    title: payload.title,
    description: payload.description,
    period: {
      startDate: payload.startDate,
      endDate: payload.endDate,
    },
    sponsorshipIds: payload.sponsorshipIds,
    sdgMapping,
    metrics,
    summary: metrics.summary,
    recommendations: payload.recommendations || [],
    status: "generating",
    generatedBy: user._id,
  });

  await report.save();
  await generatePDF(report);
  return report.toObject();
};

export const generatePDF = async (report) => {
  try {
    if (!report) {
      throw new Error("Report not provided");
    }

    const pdfBuffer = await pdfReportGenerator.generateCSRReport(
      {
        reportTitle: report.title,
        period: report.period,
        organizationName: report.organizationName || "CSR Organization",
        metrics: report.metrics,
        content: {
          executiveSummary: report.summary,
          keyHighlights: report.metrics?.highlights || [],
          recommendations: report.recommendations || [],
          nextSteps: report.nextSteps || [],
        },
        nepMapping: report.nepMapping,
      },
      { branding: report.branding }
    );

    const uploadsDir = path.join(__dirname, "../uploads/reports");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${report.reportId}.pdf`;
    fs.writeFileSync(path.join(uploadsDir, fileName), pdfBuffer);

    report.files = {
      pdfUrl: `/uploads/reports/${fileName}`,
      generatedAt: new Date(),
      pdfSize: pdfBuffer.length,
    };
    report.status = "completed";
    await report.save();
    return report.toObject();
  } catch (error) {
    console.error("Report PDF generation failed:", error);
    if (report) {
      report.status = "failed";
      await report.save();
    }
    throw error;
  }
};

export const getReportMetrics = async (sponsorId, payload = {}) => {
  const [studentCount, sponsorshipCount, fundsAllocated] = await Promise.all([
    SponsoredStudent.countDocuments({
      sponsorshipId: { $in: payload.sponsorshipIds || [] },
    }),
    Sponsorship.countDocuments({ sponsorId }),
    FundTransaction.aggregate([
      { $match: { sponsorId, status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    schoolsReached: {
      totalSchools: sponsorshipCount,
      schoolsByRegion: [],
    },
    studentsReached: {
      totalStudents: studentCount,
      activeStudents: studentCount,
    },
    completionRates: {
      overallCompletionRate: 0,
      completionByCampaign: [],
    },
    learningImprovements: {
      averageImprovement: 0,
      improvementsByPillar: [],
    },
    certificates: {
      totalIssued: 0,
    },
    financialMetrics: {
      totalSpend: fundsAllocated?.[0]?.total || 0,
      spendPerStudent: studentCount ? (fundsAllocated?.[0]?.total || 0) / studentCount : 0,
    },
    summary: payload.summary || "",
    highlights: payload.highlights || [],
  };
};

export const mapToSDG = (mapping = []) => {
  return mapping.map((entry) => ({
    sdgCode: entry.sdgCode,
    description: entry.description,
    contribution: entry.contribution || 0,
  }));
};

export default {
  generateImpactReport,
  generatePDF,
  getReportMetrics,
  mapToSDG,
};
