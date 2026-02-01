import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Gift,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import csrProgramService from "../../services/csr/programService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const DEFAULT_HELPER_TEXT =
  "Recognition is provided based on participation and completion. Individual recipient details are not displayed for privacy.";

const CSRRecognition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async (showToast = false) => {
    if (!refreshing) setLoading(true);
    setRefreshing(true);
    setError("");
    try {
      const programsRes = await csrProgramService.getMyPrograms();
      const programs = programsRes?.data || [];

      if (programs.length === 0) {
        navigate("/csr/no-program", { replace: true });
        return;
      }

      const res = await csrProgramService.getRecognition(programs[0]._id);
      const payload = res?.data ?? res;

      if (payload) {
        setData(payload);
        if (showToast) toast.success("Recognition data refreshed");
      } else {
        setError("Failed to load recognition data");
      }
    } catch (err) {
      console.error("Failed to load recognition data:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load recognition data";
      setError(errorMessage);

      if (
        err?.response?.status === 404 ||
        errorMessage.toLowerCase().includes("no programs")
      ) {
        navigate("/csr/no-program", { replace: true });
        return;
      }

      if (showToast) toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => fetchData(true);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading recognition data...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">{error}</h2>
            <p className="text-sm text-amber-700 mb-4">
              Please try again or contact support if the issue persists.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={() => navigate("/csr/profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completionPct = Math.min(
    100,
    Math.max(0, Number(data?.completionBasedRecognition) || 0)
  );
  const helperText = data?.helperText || DEFAULT_HELPER_TEXT;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Recognition Metrics
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                Recognition
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Tangible outcomes and recognition delivered to students.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* METRIC CARDS */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Certificate Issued
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {formatNumber(data?.certificatesIssued)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Module certificates (all games in a pillar-module completed)
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Badges Issued
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {formatNumber(data?.badgesIssued)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Badges earned by students from pillar games
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Kits in progress
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {formatNumber(data?.recognitionKitsInProgress)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Physical recognition kits in progress
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Completion Recognition
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {completionPct}%
                </p>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* HELPER TEXT */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-600">{helperText}</p>
          </div>
        </section>

        {/* BADGES BY PILLAR */}
        {Array.isArray(data?.badgesByPillar) && data.badgesByPillar.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Badges Issued by Pillar
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Badges earned by students from games in each pillar
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.badgesByPillar.map((item) => (
                <div
                  key={item.pillarKey || item.pillarName}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <span className="text-sm font-medium text-slate-700 truncate pr-2">
                    {item.pillarName || item.pillarKey}
                  </span>
                  <span className="text-sm font-semibold text-amber-600 whitespace-nowrap">
                    {formatNumber(item.count)} badges
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECOGNITION SUMMARY */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recognition Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Certificate Issued
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {formatNumber(data?.certificatesIssued)} issued
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Badges Issued
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {formatNumber(data?.badgesIssued)} issued
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Kits in progress
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {formatNumber(data?.recognitionKitsInProgress)} in progress
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  Students Eligible for Recognition
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {completionPct}% of completers
              </span>
            </div>
          </div>
        </section>

        {refreshing && data && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="text-xs text-slate-600">Refreshing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRRecognition;
