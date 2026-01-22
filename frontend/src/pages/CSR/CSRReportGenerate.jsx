import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";

const reportTypes = [
  { label: "Impact Summary", value: "impact", description: "Quick impact snapshot" },
  { label: "Financial Overview", value: "financial", description: "Budget, spend, and receipts" },
  { label: "School Engagement", value: "engagement", description: "Highlights per school" },
];

const formats = ["pdf", "excel"];

const CSRReportGenerate = () => {
  const [type, setType] = useState(reportTypes[0].value);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [format, setFormat] = useState("pdf");
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPreview = async () => {
    try {
      const previewResponse = await csrService.impact.metrics({ period: "month" });
      setPreview(previewResponse?.data || null);
    } catch (err) {
      console.error("Preview load failed", err);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, []);

  const handleGenerate = async () => {
    setSubmitting(true);
    try {
      await csrService.reports.generate({
        reportType: type,
        reportName: `${type} ${new Date().toLocaleDateString()}`,
        startDate,
        endDate,
        format,
        includeTestimonials: true,
      });
      toast.success("Report generation started");
    } catch (err) {
      toast.error(err?.message || "Unable to start generation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Generate Report</p>
          <h1 className="text-3xl font-bold text-slate-900">Create a new CSR report</h1>
        </header>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Report type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              >
                {reportTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Format</label>
            <div className="mt-2 flex gap-2">
              {formats.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormat(item)}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    format === item
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Preview metrics</p>
            <p className="text-sm text-slate-700">
              Students impacted: {preview?.studentsImpacted ?? "—"} · Funds allocated: ₹
              {(preview?.fundsAllocated || 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">
              Based on {preview?.period || "the last 30 days"} of data.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleGenerate}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg disabled:opacity-60"
            >
              {submitting ? "Generating..." : "Generate report"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={fetchPreview}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600"
            >
              Refresh preview
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSRReportGenerate;
