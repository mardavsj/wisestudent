import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import {
  Shield, ShieldCheck, TrendingUp, Users, Building, Activity,
  AlertTriangle, CheckCircle, Globe,
  FileText, Settings, Award, Store,
  MapPin, Lock, Download, Plus, Bell,
  ArrowRight, Trophy, Target, Flame, Sparkles, Star, TrendingDown,
  Brain, DollarSign, Headphones, History, MessageSquare,
  Briefcase, Handshake, Receipt
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [csrStats, setCsrStats] = useState({
    pendingPartners: 0,
    totalPartners: 0,
    totalPrograms: 0,
    activePrograms: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Phase 8: Real-time admin CSR & incident notifications (Socket.IO)
  useEffect(() => {
    const s = socket;
    if (!s) return;
    const onNewRegistration = () => {
      fetchDashboardData();
      toast.success('New CSR registration pending approval', { icon: '🔔' });
    };
    const onCheckpointAcknowledged = (data) => {
      if (data?.csrPartnerName) {
        toast.success(`${data.csrPartnerName} acknowledged a checkpoint`, { icon: '✓' });
      }
    };
    const onNewIncident = (data) => {
      fetchDashboardData();
      toast.success(`New platform incident: ${data.ticketNumber || data._id || 'created'}`, { icon: '🚨' });
    };
    const onIncidentUpdate = () => {
      fetchDashboardData();
    };
    s.on('admin:csr:new_registration', onNewRegistration);
    s.on('admin:csr:checkpoint_acknowledged', onCheckpointAcknowledged);
    s.on('admin:incident:new', onNewIncident);
    s.on('admin:incident:update', onIncidentUpdate);
    return () => {
      s.off('admin:csr:new_registration', onNewRegistration);
      s.off('admin:csr:checkpoint_acknowledged', onCheckpointAcknowledged);
      s.off('admin:incident:new', onNewIncident);
      s.off('admin:incident:update', onIncidentUpdate);
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [dashboardRes, incidentsRes, csrPartnersRes] = await Promise.all([
        api.get('/api/admin/dashboard').catch(() => ({ data: { data: null } })),
        api.get('/api/incidents?status=open').catch(() => ({ data: { data: [] } })),
        api.get('/api/admin/csr?status=pending').catch(() => ({ data: { data: [] } }))
      ]);

      const dashboardData = dashboardRes.data?.data || {};
      setStats(dashboardData);
      setActiveIncidents(incidentsRes.data.data || []);
      
      // Update CSR stats from dashboard API and pending partners from separate call
      const pendingPartners = csrPartnersRes?.data?.data?.length || 0;
      const totalPartners = dashboardData.csrPartners?.total ?? 0;
      const totalPrograms = dashboardData.csrPrograms?.total ?? 0;
      const activePrograms = dashboardData.csrPrograms?.active ?? 0;
      
      setCsrStats({
        pendingPartners,
        totalPartners,
        totalPrograms,
        activePrograms,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: IconComponent, color, trend, onClick, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer transition-all ${
        onClick ? 'hover:shadow-xl hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-bold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const QuickActionButton = ({ label, icon: IconComponent, color, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r ${color} text-white font-bold shadow-lg hover:shadow-xl transition-all`}
    >
      <IconComponent className="w-6 h-6" />
      {label}
    </motion.button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-lg text-white/90">
                Platform-wide analytics, compliance, and governance
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Today's Date</p>
              <p className="text-xl font-bold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mb-8"
        >
          <QuickActionButton
            label="Behavior Analytics"
            icon={Activity}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/behavior-analytics')}
          />
          <QuickActionButton
            label="Smart Insights"
            icon={Brain}
            color="from-pink-500 to-rose-600"
            onClick={() => navigate('/admin/smart-insights')}
          />
          <QuickActionButton
            label="School Approvals"
            icon={ShieldCheck}
            color="from-purple-500 to-indigo-600"
            onClick={() => navigate('/admin/approvals')}
          />
          <QuickActionButton
            label="CSR Partners"
            icon={Handshake}
            color="from-blue-500 to-indigo-600"
            onClick={() => navigate('/admin/csr/partners')}
          />
          <QuickActionButton
            label="CSR Programs"
            icon={Briefcase}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/programs')}
          />
          <QuickActionButton
            label="Financial Console"
            icon={DollarSign}
            color="from-green-500 to-emerald-600"
            onClick={() => navigate('/admin/financial-console')}
          />
          <QuickActionButton
            label="Support Desk"
            icon={Headphones}
            color="from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/support-desk')}
          />
          <QuickActionButton
            label="Lifecycle"
            icon={Users}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/lifecycle')}
          />
          <QuickActionButton
            label="Content Governance"
            icon={Shield}
            color="from-purple-500 to-pink-600"
            onClick={() => navigate('/admin/content-governance')}
          />
          <QuickActionButton
            label="Audit Timeline"
            icon={History}
            color="from-gray-500 to-slate-600"
            onClick={() => navigate('/admin/audit-timeline')}
          />
          <QuickActionButton
            label="Configuration"
            icon={Settings}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/configuration')}
          />
          <QuickActionButton
            label="Communication"
            icon={MessageSquare}
            color="from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/communication')}
          />
          <QuickActionButton
            label="Platform"
            icon={Globe}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/platform')}
          />
          <QuickActionButton
            label="Admin Panel"
            icon={Target}
            color="from-rose-500 to-pink-600"
            onClick={() => navigate('/admin/panel')}
          />
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Schools"
            value={stats?.schoolsByRegion?.reduce((sum, r) => sum + (r.totalSchools || 0), 0) || 0}
            icon={Building}
            color="from-blue-500 to-cyan-600"
            subtitle="Active schools"
            onClick={() => navigate('/admin/dashboard')}
          />
          <StatCard
            title="Total Students"
            value={stats?.studentActiveRate?.totalStudents || 0}
            icon={Users}
            color="from-green-500 to-emerald-600"
            subtitle="Across platform"
            onClick={() => navigate('/admin/dashboard')}
          />
          <StatCard
            title="CSR Partners"
            value={csrStats.totalPartners ?? '—'}
            icon={Handshake}
            color="from-indigo-500 to-purple-600"
            trend={csrStats.pendingPartners > 0 ? `${csrStats.pendingPartners} pending` : ''}
            subtitle={csrStats.pendingPartners > 0 ? 'Action required' : 'All approved'}
            onClick={() => navigate('/admin/csr/partners')}
          />
          <StatCard
            title="CSR Programs"
            value={csrStats.totalPrograms ?? '—'}
            icon={Briefcase}
            color="from-purple-500 to-pink-600"
            trend={csrStats.activePrograms > 0 ? `${csrStats.activePrograms} active` : ''}
            subtitle="Total programs"
            onClick={() => navigate('/admin/programs')}
          />
          <StatCard
            title="Active Incidents"
            value={activeIncidents.length}
            icon={AlertTriangle}
            color="from-red-500 to-pink-600"
            trend={activeIncidents.length > 0 ? 'Active' : 'Clear'}
            subtitle="SLA & privacy"
            onClick={() => navigate('/admin/incidents')}
          />
        </div>

        <div className="space-y-6">
            {/* Schools by Region */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-purple-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                    Schools by Region
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Schools grouped by state/region</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/schools')}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50/80 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shrink-0"
                >
                  See all schools by state/region
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 bg-slate-50/30">
                {stats?.schoolsByRegion?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.schoolsByRegion.slice(0, 8).map((region, idx) => {
                      const colors = [
                        'border-indigo-200 bg-indigo-50/70 hover:border-indigo-300 hover:bg-indigo-100/50',
                        'border-blue-200 bg-blue-50/60 hover:border-blue-300 hover:bg-blue-100/40',
                        'border-purple-200 bg-purple-50/60 hover:border-purple-300 hover:bg-purple-100/40',
                        'border-teal-200 bg-teal-50/60 hover:border-teal-300 hover:bg-teal-100/40',
                      ];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border-2 ${colorClass} transition-colors`}
                        >
                          <p className="text-2xl font-black text-slate-900 tabular-nums">
                            {region.activeSchools ?? region.totalSchools ?? 0}
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {region.region || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {(region.totalSchools ?? 0)} total schools
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    <Building className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">No schools data available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Privacy & Compliance — left: GDPR + Privacy Incidents; right: Active Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  Privacy & Compliance
                </h2>
                <p className="text-sm text-slate-500 mt-1">GDPR and privacy metrics</p>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: GDPR + Privacy Incidents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border-2 border-emerald-100 bg-emerald-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-700">GDPR Compliance</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 tabular-nums">
                      {stats?.privacyCompliance?.complianceRate ?? 100}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(stats?.privacyCompliance?.totalStudents ?? 0)} students in scope
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border-2 border-amber-100 bg-amber-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-semibold text-slate-700">Privacy Incidents</span>
                    </div>
                    <p className="text-3xl font-black text-amber-600 tabular-nums">
                      {stats?.privacyCompliance?.privacyIncidents ?? 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Active flags</p>
                  </div>
                </div>
                {/* Right: Active Incidents */}
                <div className="border-l-0 lg:border-l lg:border-slate-200 lg:pl-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Active Incidents
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">Open platform incidents</p>
                  {activeIncidents.length > 0 ? (
                    <div className="space-y-2">
                      {activeIncidents.slice(0, 5).map((incident, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => navigate(`/admin/incidents/${incident.ticketNumber}`)}
                          className="w-full text-left p-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900 truncate text-sm">
                              {incident.title || 'Incident'}
                            </span>
                            <span
                              className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                                incident.severity === 'critical'
                                  ? 'bg-red-600 text-white'
                                  : incident.severity === 'high'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-amber-500 text-white'
                              }`}
                            >
                              {incident.severity?.toUpperCase() || '—'}
                            </span>
                          </div>
                          {incident.ticketNumber && (
                            <p className="text-xs text-slate-500 mt-0.5">{incident.ticketNumber}</p>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => navigate('/admin/incidents')}
                        className="w-full mt-2 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                      >
                        View All Incidents
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="w-10 h-10 mx-auto text-emerald-400 mb-1" />
                      <p className="text-sm font-medium text-slate-600">No active incidents</p>
                      <p className="text-xs text-slate-500">All clear</p>
                      <button
                        type="button"
                        onClick={() => navigate('/admin/incidents')}
                        className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View incidents →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
        </div>

        {/* CSR Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <Handshake className="w-6 h-6 text-indigo-600" />
                </div>
                CSR Management
              </h2>
              <p className="text-sm text-slate-500 mt-1">Partners and programs</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/admin/csr/partners')}
                className="flex items-start gap-4 p-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-colors relative"
              >
                {csrStats.pendingPartners > 0 && (
                  <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {csrStats.pendingPartners} pending
                  </span>
                )}
                <div className="p-3 rounded-xl bg-indigo-100 shrink-0">
                  <Handshake className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Partners</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Approve and manage CSR partners</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-indigo-600">
                    View Partners
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/admin/programs')}
                className="flex items-start gap-4 p-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 hover:border-purple-200 hover:bg-purple-50/30 text-left transition-colors"
              >
                <div className="p-3 rounded-xl bg-purple-100 shrink-0">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Programs</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Create and manage CSR programs</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-purple-600">
                    Manage Programs
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
