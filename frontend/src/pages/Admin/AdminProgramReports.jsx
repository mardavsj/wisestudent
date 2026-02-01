import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Download,
  RefreshCw,
  Info,
  Eye,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const AdminProgramReports = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [reports, setReports] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [publishingReport, setPublishingReport] = useState(null);
  const [previewingReport, setPreviewingReport] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programRes, reportsRes] = await Promise.all([
        programAdminService.getProgram(programId),
        programAdminService.listReports(programId),
      ]);
      setProgram(programRes?.data);
      const reportsList = reportsRes?.data?.reports ?? reportsRes?.reports;
      setReports(Array.isArray(reportsList) ? reportsList : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) fetchData();
  }, [programId]);

  const handleDownloadImpact = async () => {
    setDownloading("impact_summary");
    try {
      await programAdminService.downloadImpactSummary(programId);
      toast.success("Impact Summary downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadSchoolCoverage = async (format) => {
    setDownloading(`school_coverage_${format}`);
    try {
      await programAdminService.downloadSchoolCoverage(programId, format);
      toast.success(`School Coverage (${format}) downloaded`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadCompliance = async () => {
    setDownloading("compliance");
    try {
      await programAdminService.downloadComplianceSummary(programId);
      toast.success("Compliance Summary downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handlePreview = async (type, format = "pdf") => {
    setPreviewingReport(type);
    try {
      await programAdminService.previewReport(programId, type, format);
      toast.success("Opening preview in new tab");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Preview failed");
    } finally {
      setPreviewingReport(null);
    }
  };

  const handlePublish = async (reportType) => {
    setPublishingReport(reportType);
    try {
      await programAdminService.publishReport(programId, reportType);
      toast.success("Report published. CSR can now see it.");
      await fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Publish failed");
    } finally {
      setPublishingReport(null);
    }
  };

  const reportByType = (type) => reports.find((r) => r.type === type) || {};
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero — match other program pages */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Back to program"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-7 h-7" />
                Reports
              </h1>
              <p className="text-sm text-white/90 mt-0.5">{program?.name || "Program"}</p>
            </div>
          </div>
          <p className="text-sm text-white/80 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 flex items-start gap-3 text-slate-600 text-sm">
          <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p>
            Preview opens in a new tab. Download to save. Publish to make the report available to CSR.
          </p>
        </div>

        <div className="space-y-4">
          {/* Impact Summary */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">Impact Summary</h2>
                <p className="text-sm text-slate-500 mt-1">
                  2-4 page summary for CSR/ESG reports
                </p>
                {reportByType("impact_summary").publishedAt && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Published for CSR on {formatDate(reportByType("impact_summary").publishedAt)}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePreview("impact_summary")}
                    disabled={!!previewingReport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {previewingReport === "impact_summary" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    Preview
                  </button>
                  <button
                    onClick={handleDownloadImpact}
                    disabled={downloading === "impact_summary"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {downloading === "impact_summary" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                  </button>
                  <button
                    onClick={() => handlePublish("impact_summary")}
                    disabled={publishingReport === "impact_summary"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {publishingReport === "impact_summary" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Publish for CSR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* School Coverage */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-50">
                <FileSpreadsheet className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">School Coverage Report</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Detailed school-level coverage for audits
                </p>
                {reportByType("school_coverage").publishedAt && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Published for CSR on {formatDate(reportByType("school_coverage").publishedAt)}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePreview("school_coverage", "pdf")}
                    disabled={!!previewingReport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {previewingReport === "school_coverage" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    Preview PDF
                  </button>
                  <button
                    onClick={() => handleDownloadSchoolCoverage("pdf")}
                    disabled={downloading?.startsWith("school_coverage")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 text-sm font-semibold hover:bg-purple-50 disabled:opacity-50"
                  >
                    {downloading === "school_coverage_pdf" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    PDF
                  </button>
                  <button
                    onClick={() => handleDownloadSchoolCoverage("excel")}
                    disabled={downloading?.startsWith("school_coverage")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {downloading === "school_coverage_excel" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Excel
                  </button>
                  <button
                    onClick={() => handlePublish("school_coverage")}
                    disabled={publishingReport === "school_coverage"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {publishingReport === "school_coverage" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Publish for CSR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-50">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">Compliance Summary</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Compliance and governance documentation
                </p>
                {reportByType("compliance").publishedAt && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Published for CSR on {formatDate(reportByType("compliance").publishedAt)}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePreview("compliance")}
                    disabled={!!previewingReport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                  >
                    {previewingReport === "compliance" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    Preview
                  </button>
                  <button
                    onClick={handleDownloadCompliance}
                    disabled={downloading === "compliance"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50"
                  >
                    {downloading === "compliance" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                  </button>
                  <button
                    onClick={() => handlePublish("compliance")}
                    disabled={publishingReport === "compliance"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {publishingReport === "compliance" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Publish for CSR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProgramReports;
