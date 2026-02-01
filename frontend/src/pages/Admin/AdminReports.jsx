import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Filter, Calendar, RefreshCw,
  Users, Building, TrendingUp, Activity, CheckCircle,
  AlertTriangle, BarChart3, Award, ArrowLeft
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminReports = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: 'month',
    startDate: '',
    endDate: '',
    reportType: 'comprehensive'
  });

  useEffect(() => {
    fetchReportData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchReportData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeReport, filters.timeRange]);

  useEffect(() => {
    if (socket?.socket) {
      const handleStatsUpdate = (data) => {
        // Refresh reports when stats update
        fetchReportData();
      };
      
      socket.socket.on('admin:stats:update', handleStatsUpdate);
      
      return () => {
        socket.socket.off('admin:stats:update', handleStatsUpdate);
      };
    }
  }, [socket]);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        reportType: activeReport,
        timeRange: filters.timeRange,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await api.get(`/api/admin/reports?${params}`);
      setReportData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load report data');
      }
    } finally {
      setLoading(false);
    }
  }, [activeReport, filters]);

  const handleExport = async (format = 'pdf') => {
    try {
      setGenerating(true);
      const params = new URLSearchParams({
        reportType: activeReport,
        timeRange: filters.timeRange,
        format,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await api.get(`/api/admin/reports/export?${params}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin-report-${activeReport}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
    { id: 'users', label: 'User Analytics', icon: Users, color: 'from-green-500 to-emerald-600' },
    { id: 'schools', label: 'School Reports', icon: Building, color: 'from-purple-500 to-pink-600' },
    { id: 'activity', label: 'Activity Reports', icon: Activity, color: 'from-orange-500 to-amber-600' },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle, color: 'from-indigo-500 to-purple-600' },
    { id: 'financial', label: 'Financial Summary', icon: Award, color: 'from-teal-500 to-cyan-600' }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, subtitle, iconBg = 'bg-indigo-100 text-indigo-600' }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend}
            </span>
          )}
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>}
    </motion.div>
  );

  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const data = reportData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      <header className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border border-purple-500/30 px-4 py-12 md:py-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0 mt-0.5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Platform reports</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <FileText className="w-8 h-8 shrink-0" />
                Admin Reports
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Comprehensive platform analytics and insights. Export as PDF, CSV, or JSON.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0 md:pl-4">
            <p className="text-xs text-white/70">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <button
              type="button"
              onClick={() => fetchReportData()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition border border-white/20 disabled:opacity-60"
              aria-label="Refresh report"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Report Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Report type">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="tab"
                  aria-selected={activeReport === type.id}
                  onClick={() => setActiveReport(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeReport === type.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="text-sm font-semibold">Filters</span>
            </div>
            <div className="flex flex-wrap items-end gap-4 flex-1">
              <label className="block">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Time range</span>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  aria-label="Time range"
                >
                  <option value="week">Last week</option>
                  <option value="month">Last month</option>
                  <option value="quarter">Last quarter</option>
                  <option value="year">Last year</option>
                  <option value="all">All time</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">From</span>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  aria-label="Start date"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">To</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  aria-label="End date"
                />
              </label>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleExport('pdf')}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-60"
                aria-label="Export PDF"
              >
                <Download className="w-4 h-4" />
                {generating ? 'Generating…' : 'PDF'}
              </button>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition disabled:opacity-60"
                aria-label="Export CSV"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                type="button"
                onClick={() => handleExport('json')}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition disabled:opacity-60"
                aria-label="Export JSON"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>
        </motion.div>

        {/* Report Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Users"
            value={data.totalUsers || data.overview?.totalUsers || 0}
            icon={Users}
            iconBg="bg-indigo-100 text-indigo-600"
            trend={data.userGrowth ? `+${data.userGrowth}%` : null}
            subtitle="Platform users"
          />
          <StatCard
            title="Total Schools"
            value={data.totalSchools || data.overview?.totalSchools || 0}
            icon={Building}
            iconBg="bg-purple-100 text-purple-600"
            trend={data.schoolGrowth ? `+${data.schoolGrowth}%` : null}
            subtitle="Active institutions"
          />
          <StatCard
            title="Total Students"
            value={data.totalStudents || data.overview?.totalStudents || 0}
            icon={Users}
            iconBg="bg-emerald-100 text-emerald-600"
            trend={data.studentGrowth ? `+${data.studentGrowth}%` : null}
            subtitle="Active students"
          />
          <StatCard
            title="Activity Rate"
            value={data.activityRate ?? data.overview?.activityRate ?? 0}
            icon={Activity}
            iconBg="bg-amber-100 text-amber-600"
            trend={data.activityTrend || null}
            subtitle="Last 30 days"
          />
        </div>

        {/* Detailed Report Sections */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            {reportTypes.find(r => r.id === activeReport)?.label || 'Report details'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Report */}
              {activeReport === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Platform growth
                    </h3>
                    <p className="text-2xl font-bold text-indigo-600">{data.growthRate || 0}%</p>
                    <p className="text-xs text-slate-500 mt-1">Growth in selected period</p>
                  </section>
                  <section className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Engagement rate
                    </h3>
                    <p className="text-2xl font-bold text-emerald-600">{data.engagementRate || 0}%</p>
                    <p className="text-xs text-slate-500 mt-1">Active user engagement</p>
                  </section>
                </div>
              )}

              {/* Users Report */}
              {activeReport === 'users' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">New users</p>
                    <p className="text-xl font-bold text-indigo-600">{data.newUsers || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Active users</p>
                    <p className="text-xl font-bold text-emerald-600">{data.activeUsers || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total sessions</p>
                    <p className="text-xl font-bold text-indigo-600">{data.totalSessions || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Avg session</p>
                    <p className="text-xl font-bold text-purple-600">{data.avgSessionTime || 0}m</p>
                  </div>
                </div>
              )}

              {/* Schools Report */}
              {activeReport === 'schools' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Active schools</p>
                      <p className="text-xl font-bold text-purple-600">{data.activeSchools || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">New schools</p>
                      <p className="text-xl font-bold text-pink-600">{data.newSchools || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Regions</p>
                      <p className="text-xl font-bold text-indigo-600">{data.totalRegions || 0}</p>
                    </div>
                  </div>
                  {data.schoolsByRegion && data.schoolsByRegion.length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Schools by region</h3>
                      <div className="space-y-2">
                        {data.schoolsByRegion.slice(0, 10).map((region, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="font-medium text-slate-700">{region.region || 'Unknown'}</span>
                            <span className="font-bold text-indigo-600">{region.totalSchools || 0}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* Activity Report */}
              {activeReport === 'activity' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total activities</p>
                    <p className="text-xl font-bold text-amber-600">{data.totalActivities || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Today</p>
                    <p className="text-xl font-bold text-amber-600">{data.todayActivities || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Top activity</p>
                    <p className="text-lg font-bold text-slate-900">{data.topActivity || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Peak hour</p>
                    <p className="text-lg font-bold text-slate-900">{data.peakHour || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Compliance Report */}
              {activeReport === 'compliance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Compliance rate
                    </h3>
                    <p className="text-2xl font-bold text-emerald-600">{data.complianceRate ?? 99}%</p>
                    <p className="text-xs text-slate-500 mt-1">GDPR & privacy compliance</p>
                  </section>
                  <section className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Privacy incidents
                    </h3>
                    <p className="text-2xl font-bold text-rose-600">{data.privacyIncidents || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Active privacy flags</p>
                  </section>
                </div>
              )}

              {/* Financial Report */}
              {activeReport === 'financial' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total revenue</p>
                    <p className="text-xl font-bold text-teal-600">₹{data.totalRevenue ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Transactions</p>
                    <p className="text-xl font-bold text-cyan-600">{data.totalTransactions || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Avg transaction</p>
                    <p className="text-xl font-bold text-indigo-600">₹{data.avgTransaction ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Refunds</p>
                    <p className="text-xl font-bold text-indigo-600">₹{data.totalRefunds ?? 0}</p>
                  </div>
                </div>
              )}

              {/* Default message if no data */}
              {!data || Object.keys(data).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No data available for this report</p>
                  <p className="text-xs text-slate-500 mt-1">Try another report type or time range.</p>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
