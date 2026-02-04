import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  School,
  MapPin,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import csrProgramService from "../../services/csr/programService";

// Helper functions
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusColor = (status) => {
  const colors = {
    draft: "bg-slate-100 text-slate-700",
    approved: "bg-blue-100 text-blue-700",
    implementation_in_progress: "bg-amber-100 text-amber-700",
    mid_program_review_completed: "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
  };
  return colors[status] || "bg-slate-100 text-slate-700";
};

const CSRProgramOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [acknowledging, setAcknowledging] = useState(false);

  const fetchOverview = async (showToast = false) => {
    if (!refreshing) setLoading(true);
    setRefreshing(true);
    setError("");
    try {
      // First get the list of programs to get the active program ID
      const programsRes = await csrProgramService.getMyPrograms();
      const programs = programsRes?.data || [];

      if (programs.length === 0) {
        // Redirect to no-program page if no programs assigned
        navigate("/csr/no-program", { replace: true });
        return;
      }

      // Get the first (active) program
      const activeProgram = programs[0];
      const overviewRes = await csrProgramService.getProgramOverview(activeProgram._id);
      
      if (overviewRes?.data) {
        setData(overviewRes.data);
        if (showToast) {
          toast.success("Overview data refreshed");
        }
      } else {
        setError("Failed to load program overview data");
      }
    } catch (err) {
      console.error("Failed to load overview:", err);
      const errorMessage = err?.response?.data?.message || "Failed to load program overview";
      setError(errorMessage);
      
      // If it's a 404 or no programs error, redirect to no-program page
      if (err?.response?.status === 404 || errorMessage.includes("No programs")) {
        navigate("/csr/no-program", { replace: true });
        return;
      }
      
      if (showToast) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcknowledge = async () => {
    if (!data?.checkpoint?.current) return;

    setAcknowledging(true);
    try {
      const programsRes = await csrProgramService.getMyPrograms();
      const programs = programsRes?.data || [];
      if (programs.length === 0) {
        toast.error("No programs found");
        return;
      }

      await csrProgramService.acknowledgeCheckpoint(
        programs[0]._id,
        data.checkpoint.current.checkpointNumber
      );
      toast.success("Checkpoint acknowledged successfully");
      // Refresh overview data
      await fetchOverview();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to acknowledge checkpoint";
      toast.error(errorMessage);
      console.error("Failed to acknowledge checkpoint:", err);
    } finally {
      setAcknowledging(false);
    }
  };

  const handleRefresh = async () => {
    await fetchOverview(true);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading program overview...</span>
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
              Please contact support if you believe this is an error.
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

  const { program, csrPartner, checkpoint, metrics } = data || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CSR Dashboard</p>
              <h1 className="text-3xl font-bold text-slate-900">Program Overview</h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor your program's progress and impact at a glance.
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

        {/* PROGRAM INFO CARD */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CSR Partner</p>
              <h2 className="text-xl font-bold text-slate-900">
                {csrPartner?.companyName || "N/A"}
              </h2>
              <h3 className="text-lg font-semibold text-indigo-600">{program?.name || "N/A"}</h3>
              <p className="text-sm text-slate-600">
                {program?.description || "No description available."}
              </p>

              {/* Duration & Geography */}
              <div className="flex flex-wrap gap-4 pt-2">
                {program?.duration?.startDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    {formatDate(program.duration.startDate)} –{" "}
                    {formatDate(program.duration.endDate)}
                  </div>
                )}
                {program?.geography?.states && program.geography.states.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {program.geography.states.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* STATUS BADGE */}
            {program?.status && (
              <div className="flex-shrink-0">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                    program.status
                  )}`}
                >
                  {formatStatus(program.status)}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* CHECKPOINT STATUS CARD (if checkpoint is ready) */}
        {checkpoint?.canAcknowledge && checkpoint?.current && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Action Required</p>
                <h2 className="text-lg font-semibold text-indigo-900 mt-1">
                  Checkpoint Ready: {checkpoint.current.label || `Checkpoint ${checkpoint.current.checkpointNumber}`}
                </h2>
                <p className="text-sm text-indigo-700 mt-1">
                  Please review the current progress and acknowledge to proceed.
                </p>
              </div>
              <button
                onClick={handleAcknowledge}
                disabled={acknowledging}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acknowledging ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {acknowledging ? "Processing..." : "Acknowledge"}
              </button>
            </div>
          </motion.section>
        )}

        {/* SUMMARY METRICS - 3 CARDS */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Students Covered",
              value: metrics?.studentsOnboarded || 0,
              icon: Users,
              bgFrom: "from-indigo-50",
              bgTo: "to-indigo-100",
              iconColor: "text-indigo-600",
            },
            {
              label: "Schools Implemented",
              value: metrics?.schoolsImplemented || 0,
              icon: School,
              bgFrom: "from-purple-50",
              bgTo: "to-purple-100",
              iconColor: "text-purple-600",
            },
            {
              label: "Regions Covered",
              value: metrics?.regionsCovered || 0,
              icon: MapPin,
              bgFrom: "from-teal-50",
              bgTo: "to-teal-100",
              iconColor: "text-teal-600",
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{formatNumber(stat.value)}</p>
              </div>
            </article>
          ))}
        </section>

        {/* PROGRAM REACH CHART */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Program Reach at a Glance</h2>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Schools", value: metrics?.schoolsImplemented || 0, fill: "#8b5cf6" },
                  { name: "Regions", value: metrics?.regionsCovered || 0, fill: "#14b8a6" },
                ]}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 80, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  formatter={(value) => [formatNumber(value), ""]}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={48}>
                  {[
                    { name: "Schools", value: metrics?.schoolsImplemented || 0, fill: "#8b5cf6" },
                    { name: "Regions", value: metrics?.regionsCovered || 0, fill: "#14b8a6" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* REACH DISTRIBUTION DONUT */}
        {(metrics?.schoolsImplemented > 0 || metrics?.regionsCovered > 0) && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">Reach Distribution</h2>
            </div>
            <div className="h-64 sm:h-72 max-w-xs mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Schools", value: metrics?.schoolsImplemented || 0, fill: "#8b5cf6" },
                      { name: "Regions", value: metrics?.regionsCovered || 0, fill: "#14b8a6" },
                    ].filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {[
                      { name: "Schools", value: metrics?.schoolsImplemented || 0, fill: "#8b5cf6" },
                      { name: "Regions", value: metrics?.regionsCovered || 0, fill: "#14b8a6" },
                    ]
                      .filter((d) => d.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    formatter={(value) => [formatNumber(value), ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* CHECKPOINT TIMELINE & RADIAL PROGRESS */}
        {checkpoint && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Program Progress</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Radial progress */}
              <div className="w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[
                      {
                        name: "Completed",
                        value: Math.min(
                          100,
                          Math.round(((checkpoint.completed || 0) / (checkpoint.total || 5)) * 100)
                        ),
                        fill: "#6366f1",
                      },
                    ]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar background dataKey="value" cornerRadius={8} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-slate-900"
                    >
                      {checkpoint.completed || 0}/{checkpoint.total || 5}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="text-center text-xs text-slate-500 mt-1">Checkpoints done</p>
              </div>

              <div className="flex-1 min-w-0 w-full">
                {/* Progress bar with markers */}
                <div className="relative py-2 mb-3">
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-visible">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(((checkpoint.completed || 0) / (checkpoint.total || 5)) * 100, 100)}%`,
                      }}
                    />
                    {/* Checkpoint markers */}
                    {[1, 2, 3, 4, 5].map((num) => {
                      const position = ((num - 0.5) / 5) * 100;
                      const isCompleted = num <= (checkpoint.completed || 0);
                      return (
                        <div
                          key={num}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                          style={{ left: `${position}%` }}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 shadow-sm ${
                              isCompleted
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-white border-slate-300"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  <span className="font-semibold text-slate-900">{checkpoint.completed || 0}</span> of{" "}
                  <span className="font-semibold text-slate-900">{checkpoint.total || 5}</span> checkpoints
                  completed
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
                  <span className={1 <= (checkpoint.completed || 0) ? "text-indigo-600 font-medium" : "text-slate-500"}>
                    Program Approval
                  </span>
                  <span className={2 <= (checkpoint.completed || 0) ? "text-indigo-600 font-medium" : "text-slate-500"}>
                    Onboarding Confirmation
                  </span>
                  <span className={3 <= (checkpoint.completed || 0) ? "text-indigo-600 font-medium" : "text-slate-500"}>
                    Mid-Program Review
                  </span>
                  <span className={4 <= (checkpoint.completed || 0) ? "text-indigo-600 font-medium" : "text-slate-500"}>
                    Completion Review
                  </span>
                  <span className={5 <= (checkpoint.completed || 0) ? "text-indigo-600 font-medium" : "text-slate-500"}>
                    Extension/Renewal
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ACTION BUTTONS */}
        <section className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => navigate("/csr/reports")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            View Reports
          </button>
        </section>

        {/* REFRESHING INDICATOR */}
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

export default CSRProgramOverview;
