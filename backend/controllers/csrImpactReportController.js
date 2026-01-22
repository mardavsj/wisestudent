import CSRImpactReport from "../models/CSRImpactReport.js";
import { findOrCreateSponsor } from "../services/csrSponsorService.js";

export const listImpactReports = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const reports = await CSRImpactReport.find({ sponsorId: sponsor._id }).sort({ createdAt: -1 });
    res.json({ message: "Reports fetched", data: reports });
  } catch (error) {
    console.error("CSR report list error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch reports", error: error.message });
  }
};

export const generateImpactReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const { title, description, startDate, endDate, sponsorshipIds, sdgMapping } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, startDate and endDate are required" });
    }

    const report = new CSRImpactReport({
      sponsorId: sponsor._id,
      title,
      description,
      period: {
        startDate,
        endDate,
      },
      sponsorshipIds,
      sdgMapping,
      status: "generating",
      generatedBy: req.user._id,
    });

    await report.save();
    res.status(201).json({
      message: "Report generation started",
      data: {
        id: report._id,
        reportId: report.reportId,
        status: report.status,
      },
    });
  } catch (error) {
    console.error("CSR report generation error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to generate report", error: error.message });
  }
};

export const downloadImpactReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const sponsor = await findOrCreateSponsor(req.user);
    const report = await CSRImpactReport.findOne({ _id: req.params.id, sponsorId: sponsor._id });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!report.files?.pdfUrl) {
      return res.status(400).json({ message: "PDF not generated yet" });
    }

    res.json({
      message: "Report ready for download",
      data: { downloadUrl: report.files.pdfUrl },
    });
  } catch (error) {
    console.error("CSR report download error:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to download report", error: error.message });
  }
};

export default {
  listImpactReports,
  generateImpactReport,
  downloadImpactReport,
};
