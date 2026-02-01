import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Users, User, BarChart3, TrendingUp,
  RefreshCw, UserPlus, Building, Clock, ArrowRight,
  DollarSign, Award, ArrowLeft, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const AdminTrackingDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [activityPage, setActivityPage] = useState(1);
  const [activityLimit, setActivityLimit] = useState(20);
  const [activityTotalPages, setActivityTotalPages] = useState(0);
  const [activityFilters, setActivityFilters] = useState({
    activityType: 'all',
    sourceDashboard: 'all',
    startDate: '',
    endDate: ''
  });
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [realtimeActivity, setRealtimeActivity] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    activityType: 'all',
    sourceDashboard: 'all'
  });
  const socket = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const res = await api.get('/api/admin/tracking/overview').catch(() => ({ data: { data: null } }));
        setOverview(res.data.data || null);
      } else if (activeTab === 'activities') {
        const params = {
          page: activityPage,
          limit: activityLimit,
          activityType: activityFilters.activityType !== 'all' ? activityFilters.activityType : undefined,
          sourceDashboard: activityFilters.sourceDashboard !== 'all' ? activityFilters.sourceDashboard : undefined,
          startDate: activityFilters.startDate || undefined,
          endDate: activityFilters.endDate || undefined
        };
        const res = await api.get('/api/admin/tracking/activity-feed', { params }).catch(() => ({ data: { data: [] } }));
        setRealtimeActivity(res.data.data?.activities || res.data.data || []);
        if (res.data.data?.pagination) {
          setActivityTotalPages(res.data.data.pagination.pages || 0);
        }
      } else if (activeTab === 'users') {
        const res = await api.get('/api/admin/tracking/student-distribution').catch(() => ({ data: { data: [] } }));
        setUsers(res.data.data || []);
      } else if (activeTab === 'analytics') {
        const res = await api.get('/api/admin/tracking/analytics').catch(() => ({ data: { data: null } }));
        setAnalytics(res.data.data || null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [activeTab, activityPage, activityLimit, activityFilters]);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (socket?.socket) {
      const handleActivityUpdate = (data) => {
        if (activeTab === 'activities') {
          setRealtimeActivity(prev => [data, ...prev].slice(0, 100)); // Keep last 100
          fetchData(); // Refresh full list
        }
      };

      socket.socket.on('admin:activity:new', handleActivityUpdate);
      return () => {
        socket.socket.off('admin:activity:new', handleActivityUpdate);
      };
    }
  }, [socket, activeTab]);

  const fetchUsersByRole = async (role) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/tracking/users/${role}`);
      setStudentsList(res.data.data || []);
      setSelectedRole(role);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/tracking/user/${userId}`);
      setSelectedStudent(res.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, iconBg }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>}
    </motion.div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'activities', label: 'Activity Feed', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  if (loading && !overview && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Platform tracking</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 shrink-0" />
                Tracking Dashboard
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Overview, user distribution, activity feed, and analytics. Auto-refreshes every 30s.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0 md:pl-4">
            <p className="text-xs text-white/70">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin/payment-tracker')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition border border-white/20"
            >
              <DollarSign className="w-5 h-5" />
              Payment Tracker
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <nav className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Tracking sections">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && overview && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold text-slate-900">Platform Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                  title="Total Users"
                  value={overview.totalUsers || 0}
                  subtitle={`Active: ${overview.activeUsers || 0}`}
                  icon={Users}
                  iconBg="bg-indigo-100 text-indigo-600"
                />
                <StatCard
                  title="Total Students"
                  value={overview.totalStudents || 0}
                  subtitle={`Individual: ${overview.individualStudents || 0}, School: ${overview.schoolStudents || 0}`}
                  icon={UserPlus}
                  iconBg="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                  title="Schools"
                  value={overview.schools?.totalSchools || 0}
                  subtitle={`Active: ${overview.schools?.activeSchools || 0}`}
                  icon={Building}
                  iconBg="bg-amber-100 text-amber-600"
                />
              </div>

              <section className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Parent Linkage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-700">{overview.studentsWithParents || 0}</div>
                    <div className="text-sm text-slate-600">With parents</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-2xl font-bold text-amber-700">{overview.studentsWithoutParents || 0}</div>
                    <div className="text-sm text-slate-600">Without parents</div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity (24h)</h3>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-indigo-600">{overview.recentActivity || 0}</div>
                  <div className="text-sm text-slate-600">Activities in the last 24 hours</div>
                </div>
              </section>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              {!selectedRole && !selectedStudent && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
                    <button
                      type="button"
                      onClick={fetchData}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
                      aria-label="Refresh"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {users.map((roleData, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => fetchUsersByRole(roleData._id)}
                        className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{roleData._id || 'Unknown'}</span>
                          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            {(roleData._id === 'student' || roleData._id === 'school_student') ? <UserPlus className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{roleData.total || 0}</p>
                        <p className="text-xs text-slate-500 mt-1">With parents: {roleData.withParents || 0}</p>
                        <div className="mt-3 flex items-center text-indigo-600 text-sm font-medium">
                          View list <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {selectedRole && !selectedStudent && (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setSelectedRole(null); setStudentsList([]); }}
                        className="px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                      >
                        ← Back
                      </button>
                      <h2 className="text-lg font-semibold text-slate-900 capitalize">{selectedRole}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchUsersByRole(selectedRole)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full mx-auto animate-spin" />
                        <p className="text-sm text-slate-500 mt-4">Loading users…</p>
                      </div>
                    ) : studentsList.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">No users found</p>
                        <p className="text-xs text-slate-500 mt-1">Try another role or refresh.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {studentsList.map((student, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            onClick={() => fetchUserDetails(student._id)}
                            className="p-4 hover:bg-slate-50/80 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                                {student.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-900">{student.name || 'Unknown'}</div>
                                <div className="text-sm text-slate-600 truncate">{student.email}</div>
                                {student.phone && <div className="text-xs text-slate-500">{student.phone}</div>}
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs text-slate-500">{new Date(student.createdAt).toLocaleDateString()}</div>
                                <div className="flex items-center text-indigo-600 text-sm font-medium mt-1">
                                  View <ArrowRight className="w-4 h-4 ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedStudent && (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(null)}
                      className="px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                    >
                      ← Back
                    </button>
                    <h2 className="text-lg font-semibold text-slate-900">User details</h2>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-600" />
                          Personal information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm">
                            <span className="text-slate-500">Name</span>
                            <span className="font-medium text-slate-900">{selectedStudent.name}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-900">{selectedStudent.email}</span>
                          </div>
                          {selectedStudent.phone && (
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm">
                              <span className="text-slate-500">Phone</span>
                              <span className="font-medium text-slate-900">{selectedStudent.phone}</span>
                            </div>
                          )}
                          <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm">
                            <span className="text-slate-500">Role</span>
                            <span className="font-medium text-slate-900 capitalize">{selectedStudent.role}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm">
                            <span className="text-slate-500">Joined</span>
                            <span className="font-medium text-slate-900">{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          Parent connections
                        </h3>
                        {selectedStudent.linkedIds?.parentIds && selectedStudent.linkedIds.parentIds.length > 0 ? (
                          <div className="space-y-2">
                            {selectedStudent.linkedIds.parentIds.map((parent, idx) => (
                              <div key={idx} className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-sm">
                                <div className="font-medium text-slate-900">{parent.name}</div>
                                <div className="text-slate-600">{parent.email}</div>
                                {parent.phone && <div className="text-xs text-slate-500">{parent.phone}</div>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">No parents linked</p>
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">Activity feed</h2>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Type</span>
                    <select
                      value={activityFilters.activityType}
                      onChange={(e) => { setActivityFilters({ ...activityFilters, activityType: e.target.value }); setActivityPage(1); fetchData(); }}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      aria-label="Activity type"
                    >
                      <option value="all">All types</option>
                      <option value="communication">Communication</option>
                      <option value="transaction">Transaction</option>
                      <option value="engagement">Engagement</option>
                      <option value="login">Login</option>
                      <option value="administrative">Administrative</option>
                      <option value="system">System</option>
                      <option value="analytics_view">Analytics View</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Dashboard</span>
                    <select
                      value={activityFilters.sourceDashboard}
                      onChange={(e) => { setActivityFilters({ ...activityFilters, sourceDashboard: e.target.value }); setActivityPage(1); fetchData(); }}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      aria-label="Source dashboard"
                    >
                      <option value="all">All dashboards</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher</option>
                      <option value="school_admin">School Admin</option>
                      <option value="csr">CSR</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">From</span>
                    <input
                      type="date"
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      value={activityFilters.startDate}
                      onChange={(e) => { setActivityFilters({ ...activityFilters, startDate: e.target.value }); setActivityPage(1); }}
                      aria-label="Start date"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">To</span>
                    <input
                      type="date"
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      value={activityFilters.endDate}
                      onChange={(e) => { setActivityFilters({ ...activityFilters, endDate: e.target.value }); setActivityPage(1); }}
                      aria-label="End date"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
                    aria-label="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                {realtimeActivity.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Activity className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">No activities found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting filters or wait for new activity.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {realtimeActivity.map((activity, idx) => (
                      <div key={idx} className="p-4 hover:bg-slate-50/80 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold shrink-0">
                            {activity.userId?.name?.[0]?.toUpperCase() || activity.userRole?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900">{activity.userId?.name || activity.userName || 'Unknown'}</div>
                            <div className="text-sm text-slate-600 capitalize">{activity.sourceDashboard} → {activity.activityType}</div>
                          </div>
                          <div className="text-sm text-slate-500 shrink-0">{new Date(activity.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {activityTotalPages > 1 && (
                <div className="flex items-center justify-between py-4 px-2 text-sm">
                  <button
                    type="button"
                    onClick={() => { if (activityPage > 1) { setActivityPage(activityPage - 1); fetchData(); } }}
                    disabled={activityPage === 1}
                    className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <span className="text-slate-600 font-medium">Page {activityPage} of {activityTotalPages}</span>
                  <button
                    type="button"
                    onClick={() => { if (activityPage < activityTotalPages) { setActivityPage(activityPage + 1); fetchData(); } }}
                    disabled={activityPage === activityTotalPages}
                    className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
                <button
                  type="button"
                  onClick={fetchData}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
                  aria-label="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              {analytics ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total activities</div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.byDashboard?.reduce((sum, d) => sum + (d.count || 0), 0) || 0}</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Top users</div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.topUsers?.length || 0}</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Days tracked</div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.dailyTrend?.length || 0}</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Recent events</div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.recentActivities?.length || 0}</div>
                    </div>
                  </div>

                  {/* Daily Trend */}
                  {analytics.dailyTrend && analytics.dailyTrend.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        7-day activity trend
                      </h3>
                      <div className="flex items-end gap-2 h-48">
                        {analytics.dailyTrend.map((day, idx) => {
                          const maxCount = Math.max(...analytics.dailyTrend.map(d => d.count), 1);
                          const heightPercent = (day.count / maxCount) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg mb-2 transition-all hover:opacity-80"
                                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                              />
                              <div className="text-xs font-bold text-gray-700">{day.count}</div>
                              <div className="text-xs text-gray-500">{day._id.split('-')[2]}</div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Top Active Users */}
                  {analytics.topUsers && analytics.topUsers.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-600" />
                        Top active users
                      </h3>
                      <div className="space-y-2">
                        {analytics.topUsers.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900">{user.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-orange-600">{user.activityCount || 0}</div>
                              <div className="text-xs text-gray-500">activities</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* By Dashboard */}
                  <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Activity by dashboard
                    </h3>
                    <div className="space-y-2">
                      {analytics.byDashboard && analytics.byDashboard.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900 capitalize">{item.dashboard || item._id}</div>
                            <div className="text-xs text-slate-500">{item.uniqueUsers || 0} unique users</div>
                          </div>
                          <div className="text-xl font-bold text-indigo-600">{item.count || 0}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Communication Patterns */}
                  {analytics.communicationPatterns && analytics.communicationPatterns.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-pink-600" />
                        Communication flow
                      </h3>
                      <div className="space-y-2">
                        {analytics.communicationPatterns.map((pattern, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900 capitalize">{pattern.source || 'unknown'}</span>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-700 capitalize">{pattern.target || 'unknown'}</span>
                              </div>
                              <div className="text-lg font-bold text-indigo-600">{pattern.count}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* By Activity Type */}
                  <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-600" />
                      Activity by type
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {analytics.byType && analytics.byType.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="font-medium text-slate-900 capitalize">{item._id}</span>
                          <span className="font-bold text-emerald-600">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Hourly Activity */}
                  {analytics.hourlyActivity && analytics.hourlyActivity.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Activity by hour
                      </h3>
                      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                        {analytics.hourlyActivity.map((item, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <div className="text-xs font-bold text-gray-600 mb-1">{item._id}h</div>
                            <div className="text-sm font-bold text-indigo-600">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent Activities */}
                  {analytics.recentActivities && analytics.recentActivities.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Recent activities
                      </h3>
                      <div className="divide-y divide-slate-100">
                        {analytics.recentActivities.map((activity, idx) => (
                          <div key={idx} className="p-3 hover:bg-slate-50/80 transition">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                                {activity.userId?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900">{activity.userId?.name || 'Unknown'}</div>
                                <div className="text-xs text-slate-600 capitalize">{activity.sourceDashboard} → {activity.activityType}</div>
                              </div>
                              <div className="text-xs text-slate-500 shrink-0">{new Date(activity.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No analytics data available</p>
                  <p className="text-xs text-slate-500 mt-1">Data will appear as activity is tracked.</p>
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default AdminTrackingDashboard;
