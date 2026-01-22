import React, { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";

const CSRReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await csrService.reports.list({ limit: 20 });
      setReports(res?.data || []);
    } catch (err) {
      toast.error(err?.message || "Unable to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Reports</p>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Generated Reports</h1>
            <Link
              to="/csr/reports/generate"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md"
            >
              <Plus className="w-4 h-4" />
              Generate New
            </Link>
          </div>
        </header>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Report</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No reports generated yet.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.reportId} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-semibold text-slate-900">{report.reportName}</td>
                    <td className="px-4 py-4 text-slate-600">{report.reportType}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {new Date(report.period?.startDate).toLocaleDateString()} –{" "}
                      {new Date(report.period?.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{report.status}</td>
                    <td className="px-4 py-4">
                      <a
                        href={csrService.reports.download(report.reportId)}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default CSRReports;
