import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, TrendingUp, TrendingDown, Building, RefreshCw,
  FileText, CreditCard, Receipt, AlertTriangle, CheckCircle,
  XCircle, Calendar, Filter, Download, Send, Eye, Play,
  Percent, Globe, Award, Gift, Zap, Clock, ArrowRight,
  BarChart3, PieChart, LineChart, Target, AlertCircle,
  ShoppingCart, Package, Tag, RotateCcw, Search
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const FinancialConsole = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    timeRange: 'month',
    startDate: '',
    endDate: '',
    schoolId: 'all',
    region: 'all'
  });

  // State for each section
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [schoolMetrics, setSchoolMetrics] = useState(null);
  const [retries, setRetries] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [taxCompliance, setTaxCompliance] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // Alerts state
  const [alerts, setAlerts] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const res = await api.get('/api/admin/financial-console', {
          params: {
            timeRange: filters.timeRange,
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        
        if (res.data.success && res.data.data) {
          setSummary(res.data.data.summary);
          setRevenue(res.data.data.revenue);
          setSchoolMetrics(res.data.data.schoolMetrics);
          setRetries(res.data.data.retries);
          setCoupons(res.data.data.coupons);
          setTaxCompliance(res.data.data.taxCompliance);
        }
      } else if (activeTab === 'revenue') {
        const res = await api.get('/api/admin/financial-console/revenue', {
          params: {
            timeRange: filters.timeRange,
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        setRevenue(res.data.data);
      } else if (activeTab === 'school-metrics') {
        const res = await api.get('/api/admin/financial-console/school-metrics', {
          params: {
            timeRange: filters.timeRange,
            schoolId: filters.schoolId !== 'all' ? filters.schoolId : undefined
          }
        });
        setSchoolMetrics(res.data.data);
      } else if (activeTab === 'retries') {
        const res = await api.get('/api/admin/financial-console/payment-retries', {
          params: {
            status: filters.status || 'all',
            daysThreshold: 7
          }
        });
        setRetries(res.data.data);
      } else if (activeTab === 'coupons') {
        const res = await api.get('/api/admin/financial-console/coupons');
        setCoupons(res.data.data);
      } else if (activeTab === 'tax') {
        const res = await api.get('/api/admin/financial-console/tax-compliance', {
          params: {
            timeRange: filters.timeRange,
            region: filters.region !== 'all' ? filters.region : undefined
          }
        });
        setTaxCompliance(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching financial console data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load financial data');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket?.socket) {
      const handleRevenueUpdate = (data) => {
        setRevenue(data);
      };

      const handleSchoolMetricsUpdate = (data) => {
        setSchoolMetrics(data);
      };

      const handleRetriesUpdate = (data) => {
        setRetries(data);
      };

      const handleRetryAlert = (data) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'retry',
          severity: 'high',
          message: data.message,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.error(data.message, {
          duration: 5000,
          icon: '⚠️'
        });
      };

      const handleSummaryUpdate = (data) => {
        setSummary(data);
      };

      const handleRefundProcessed = (data) => {
        toast.success(`Refund of ₹${data.amount} processed`, {
          duration: 3000
        });
        fetchAllData();
      };

      socket.socket.on('financial:revenue:update', handleRevenueUpdate);
      socket.socket.on('financial:school-metrics:update', handleSchoolMetricsUpdate);
      socket.socket.on('financial:retries:update', handleRetriesUpdate);
      socket.socket.on('financial:retry:alert', handleRetryAlert);
      socket.socket.on('financial:console:summary', handleSummaryUpdate);
      socket.socket.on('financial:refund:processed', handleRefundProcessed);
      
      return () => {
        socket.socket.off('financial:revenue:update', handleRevenueUpdate);
        socket.socket.off('financial:school-metrics:update', handleSchoolMetricsUpdate);
        socket.socket.off('financial:retries:update', handleRetriesUpdate);
        socket.socket.off('financial:retry:alert', handleRetryAlert);
        socket.socket.off('financial:console:summary', handleSummaryUpdate);
        socket.socket.off('financial:refund:processed', handleRefundProcessed);
      };
    }
  }, [socket, fetchAllData]);

  const handleGenerateInvoice = async (invoiceData) => {
    try {
      const res = await api.post('/api/admin/financial-console/invoice/generate', invoiceData);
      toast.success('Invoice generated successfully!');
      fetchAllData();
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    }
  };

  const handleProcessRefund = async (refundData) => {
    try {
      const res = await api.post('/api/admin/financial-console/refund', refundData);
      toast.success(`Refund of ₹${refundData.amount} processed successfully!`);
      fetchAllData();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(error.response?.data?.message || 'Failed to process refund');
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'from-indigo-500 to-purple-600', subtitle, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5 ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-bold flex items-center gap-1 ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue Dashboard', icon: DollarSign },
    { id: 'school-metrics', label: 'School Metrics', icon: Building },
    { id: 'retries', label: 'Payment Retries', icon: RefreshCw },
    { id: 'refunds', label: 'Refunds', icon: RotateCcw },
    { id: 'coupons', label: 'Coupons & Promotions', icon: Gift },
    { id: 'tax', label: 'Tax Compliance', icon: Receipt }
  ];

  if (loading && !summary && !revenue && !schoolMetrics) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <DollarSign className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Financial Console</h1>
                  <p className="text-lg text-white/90">Advanced billing & revenue operations dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-orange-900">Payment Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-sm text-orange-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none font-medium"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none"
              />
            </div>
            {(activeTab === 'school-metrics' || activeTab === 'tax') && (
              <select
                value={activeTab === 'school-metrics' ? filters.schoolId : filters.region}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  [activeTab === 'school-metrics' ? 'schoolId' : 'region']: e.target.value 
                })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none font-medium"
              >
                <option value="all">All {activeTab === 'school-metrics' ? 'Schools' : 'Regions'}</option>
              </select>
            )}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && summary && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(summary.totalRevenue || 0)}
                icon={DollarSign}
                color="from-green-500 to-emerald-600"
                trend={revenue?.revenueGrowth ? `${revenue.revenueGrowth > 0 ? '+' : ''}${revenue.revenueGrowth.toFixed(1)}%` : null}
                subtitle={revenue?.period ? `${new Date(revenue.period.start).toLocaleDateString()} - ${new Date(revenue.period.end).toLocaleDateString()}` : ''}
              />
              <StatCard
                title="Net Revenue"
                value={formatCurrency(summary.netRevenue || 0)}
                icon={TrendingUp}
                color="from-blue-500 to-cyan-600"
                subtitle="After fees & taxes"
              />
              <StatCard
                title="Monthly Recurring Revenue"
                value={formatCurrency(summary.totalMRR || 0)}
                icon={CreditCard}
                color="from-purple-500 to-pink-600"
                subtitle="MRR"
              />
              <StatCard
                title="Annual Recurring Revenue"
                value={formatCurrency(summary.totalARR || 0)}
                icon={Target}
                color="from-indigo-500 to-purple-600"
                subtitle="ARR"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Pending Retries"
                value={summary.pendingRetries || 0}
                icon={RefreshCw}
                color="from-orange-500 to-amber-600"
                subtitle={`${summary.escalatedRetries || 0} escalated`}
              />
              <StatCard
                title="Total Tax"
                value={formatCurrency(summary.totalTax || 0)}
                icon={Receipt}
                color="from-teal-500 to-cyan-600"
                subtitle={`${summary.complianceRate || 100}% compliant`}
              />
              <StatCard
                title="Successful Transactions"
                value={revenue?.successfulTransactions || 0}
                icon={CheckCircle}
                color="from-green-500 to-emerald-600"
                subtitle={`${revenue?.failedTransactions || 0} failed`}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-6 h-6 text-green-600" />
                  Top Revenue Schools
                </h3>
                <div className="space-y-3">
                  {schoolMetrics?.schools?.slice(0, 5).map((school, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border-2 border-green-200">
                      <div>
                        <p className="font-semibold text-gray-900">{school.schoolName}</p>
                        <p className="text-sm text-gray-600">ARPU: ₹{school.arpu}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-green-600">{formatCurrency(school.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">MRR: ₹{school.mrr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Revenue Trend
                </h3>
                <div className="space-y-2">
                  {revenue?.dailyRevenue?.slice(-7).map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                      <span className="text-sm font-medium text-gray-700">{new Date(day._id).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(day.revenue / (revenue.totalRevenue || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-blue-600 w-20 text-right">{formatCurrency(day.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Revenue Dashboard Tab */}
        {activeTab === 'revenue' && revenue && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(revenue.totalRevenue || 0)}
                icon={DollarSign}
                color="from-green-500 to-emerald-600"
                trend={revenue.revenueGrowth ? `${revenue.revenueGrowth > 0 ? '+' : ''}${revenue.revenueGrowth.toFixed(1)}%` : null}
              />
              <StatCard
                title="Net Revenue"
                value={formatCurrency(revenue.netRevenue || 0)}
                icon={TrendingUp}
                color="from-blue-500 to-cyan-600"
                subtitle="After fees"
              />
              <StatCard
                title="Refunded Amount"
                value={formatCurrency(revenue.refundedAmount || 0)}
                icon={RotateCcw}
                color="from-red-500 to-pink-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-green-600" />
                Revenue by Gateway
              </h2>
              <div className="space-y-3">
                {revenue.revenueByGateway?.map((gateway, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div>
                      <p className="font-semibold text-gray-900">{gateway._id || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{gateway.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-green-600">{formatCurrency(gateway.revenue)}</p>
                      <p className="text-xs text-gray-500">Net: {formatCurrency(gateway.netRevenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* School Metrics Tab */}
        {activeTab === 'school-metrics' && schoolMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Schools"
                value={schoolMetrics.summary?.totalSchools || 0}
                icon={Building}
                color="from-blue-500 to-cyan-600"
              />
              <StatCard
                title="Average ARPU"
                value={`₹${schoolMetrics.summary?.avgARPU || 0}`}
                icon={Percent}
                color="from-purple-500 to-pink-600"
                subtitle="Per student"
              />
              <StatCard
                title="Total MRR"
                value={formatCurrency(schoolMetrics.summary?.totalMRR || 0)}
                icon={CreditCard}
                color="from-green-500 to-emerald-600"
              />
              <StatCard
                title="Total ARR"
                value={formatCurrency(schoolMetrics.summary?.totalARR || 0)}
                icon={Target}
                color="from-indigo-500 to-purple-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Building className="w-7 h-7 text-blue-600" />
                School Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-bold text-gray-900">School</th>
                      <th className="text-right p-3 font-bold text-gray-900">Revenue</th>
                      <th className="text-right p-3 font-bold text-gray-900">ARPU</th>
                      <th className="text-right p-3 font-bold text-gray-900">MRR</th>
                      <th className="text-right p-3 font-bold text-gray-900">ARR</th>
                      <th className="text-right p-3 font-bold text-gray-900">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolMetrics.schools?.slice(0, 20).map((school, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <p className="font-semibold text-gray-900">{school.schoolName}</p>
                          <p className="text-xs text-gray-500">{school.students} students</p>
                        </td>
                        <td className="p-3 text-right font-bold text-green-600">{formatCurrency(school.totalRevenue)}</td>
                        <td className="p-3 text-right font-semibold text-purple-600">₹{school.arpu}</td>
                        <td className="p-3 text-right font-semibold text-blue-600">₹{school.mrr}</td>
                        <td className="p-3 text-right font-semibold text-indigo-600">₹{school.arr}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            school.retentionRate >= 70 ? 'bg-green-100 text-green-800' :
                            school.retentionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {school.retentionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Payment Retries Tab */}
        {activeTab === 'retries' && retries && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Retries"
                value={retries.summary?.total || 0}
                icon={RefreshCw}
                color="from-orange-500 to-amber-600"
              />
              <StatCard
                title="Can Retry"
                value={retries.summary?.canRetry || 0}
                icon={Play}
                color="from-blue-500 to-cyan-600"
                subtitle="Ready for retry"
              />
              <StatCard
                title="Escalated"
                value={retries.summary?.escalated || 0}
                icon={AlertTriangle}
                color="from-red-500 to-pink-600"
                subtitle="Manual intervention"
              />
              <StatCard
                title="Total Amount"
                value={formatCurrency(retries.summary?.totalAmount || 0)}
                icon={DollarSign}
                color="from-purple-500 to-indigo-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <RefreshCw className="w-7 h-7 text-orange-600" />
                Payment Retry Management
              </h2>
              <div className="space-y-3">
                {retries.retries?.slice(0, 20).map((retry, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      retry.dunningStage === 'escalated' ? 'border-red-300 bg-red-50' :
                      retry.dunningStage === 'final_reminder' ? 'border-orange-300 bg-orange-50' :
                      'border-yellow-300 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg font-bold text-white ${
                          retry.dunningStage === 'escalated' ? 'bg-red-600' :
                          retry.dunningStage === 'final_reminder' ? 'bg-orange-600' :
                          'bg-yellow-600'
                        }`}>
                          {retry.dunningStage.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Tenant: {retry.tenantId}</p>
                          <p className="text-sm text-gray-600">{retry.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Retries: {retry.retryCount}</span>
                            <span>Days since failure: {retry.daysSinceFailure}</span>
                            <span>Stage: {retry.dunningStage.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-black text-red-600">{formatCurrency(retry.amount)}</p>
                        {retry.canRetry && (
                          <button
                            onClick={() => toast.info('Retry payment functionality coming soon')}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all text-sm"
                          >
                            Retry Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <RotateCcw className="w-7 h-7 text-red-600" />
                Process Refund
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">Use the Payment Tracker to view and process refunds for specific transactions.</p>
                <button
                  onClick={() => navigate('/admin/payment-tracker')}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Payment Tracker
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Coupons & Promotions Tab */}
        {activeTab === 'coupons' && coupons && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Coupons"
                value={coupons.totalCoupons || 0}
                icon={Gift}
                color="from-pink-500 to-rose-600"
              />
              <StatCard
                title="Active Coupons"
                value={coupons.activeCoupons || 0}
                icon={CheckCircle}
                color="from-green-500 to-emerald-600"
              />
              <StatCard
                title="Total Usage"
                value={coupons.totalUsage || 0}
                icon={TrendingUp}
                color="from-blue-500 to-cyan-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Tag className="w-7 h-7 text-pink-600" />
                  Coupons
                </h2>
                <div className="space-y-3">
                  {coupons.coupons?.map((coupon, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-pink-50 border-2 border-pink-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">{coupon.code}</p>
                          <p className="text-sm text-gray-600">{coupon.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {coupon.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                        </span>
                        <span className="text-gray-500">
                          {coupon.usageCount}/{coupon.maxUsage} used
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Package className="w-7 h-7 text-purple-600" />
                  Bundles
                </h2>
                <div className="space-y-3">
                  {coupons.bundles?.map((bundle, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-900">{bundle.name}</p>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">
                          {bundle.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{bundle.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black text-purple-600">₹{bundle.price}</p>
                          <p className="text-xs text-green-600">Save ₹{bundle.savings}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>Includes:</p>
                          {bundle.includes.map((item, i) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Tax Compliance Tab */}
        {activeTab === 'tax' && taxCompliance && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Regions"
                value={taxCompliance.summary?.totalRegions || 0}
                icon={Globe}
                color="from-blue-500 to-cyan-600"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(taxCompliance.summary?.totalRevenue || 0)}
                icon={DollarSign}
                color="from-green-500 to-emerald-600"
              />
              <StatCard
                title="Total Tax"
                value={formatCurrency(taxCompliance.summary?.totalTax || 0)}
                icon={Receipt}
                color="from-purple-500 to-indigo-600"
              />
              <StatCard
                title="Compliance Rate"
                value={`${taxCompliance.summary?.complianceRate || 100}%`}
                icon={CheckCircle}
                color="from-teal-500 to-cyan-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Receipt className="w-7 h-7 text-teal-600" />
                Tax Compliance by Region
              </h2>
              <div className="space-y-4">
                {taxCompliance.byRegion?.map((region, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-teal-50 border-2 border-teal-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{region.region}</h3>
                        <p className="text-sm text-gray-600">{region.organizations.length} organizations</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-teal-600">{formatCurrency(region.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">Tax: {formatCurrency(region.totalTax)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">GST Rate</p>
                        <p className="font-bold text-gray-900">{region.taxRates.GST}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">SGST</p>
                        <p className="font-bold text-gray-900">{region.taxRates.SGST}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CGST</p>
                        <p className="font-bold text-gray-900">{region.taxRates.CGST}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialConsole;

