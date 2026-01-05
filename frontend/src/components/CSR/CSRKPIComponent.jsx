import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, School, Target, TrendingUp, DollarSign, Award,
  FileText, RefreshCw, Download, BarChart3, PieChart,
  CheckCircle, Clock, Percent, ArrowUp, ArrowDown,
  BookOpen, Brain, Heart, Star, Activity, Calendar
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import csrKPIService from '../../services/csrKPIService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const CSRKPIComponent = ({ filters = {} }) => {
  const [kpiData, setKpiData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  // Load KPI data - memoized with useCallback
  const loadKPIData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await csrKPIService.getKPIs(filters);
      setKpiData(response.data);
    } catch (error) {
      console.error('Error loading KPI data:', error);
      toast.error('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load trends data - memoized with useCallback
  const loadTrendsData = useCallback(async () => {
    try {
      const response = await csrKPIService.getKPITrends(filters);
      setTrendsData(response.data);
    } catch (error) {
      console.error('Error loading trends data:', error);
    }
  }, [filters]);

  // Refresh KPIs
  const handleRefreshKPIs = async () => {
    setRefreshing(true);
    try {
      await csrKPIService.refreshKPIs(filters);
      await loadKPIData();
      toast.success('KPIs refreshed successfully');
    } catch (error) {
      console.error('Error refreshing KPIs:', error);
      toast.error('Failed to refresh KPIs');
    } finally {
      setRefreshing(false);
    }
  };

  // Export KPIs
  const handleExportKPIs = async (format) => {
    try {
      await csrKPIService.downloadKPIs(format, filters);
      toast.success(`KPIs exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting KPIs:', error);
      toast.error('Failed to export KPIs');
    }
  };

  // Use stringified filters for dependency comparison
  const filtersKey = JSON.stringify(filters);
  
  useEffect(() => {
    loadKPIData();
    loadTrendsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]); // Only trigger when filters actually change

  if (loading && !kpiData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No KPI data available</p>
      </div>
    );
  }

  // Chart data configurations
  const campaignCompletionChart = {
    labels: kpiData.campaigns?.map(c => c.campaignName) || [],
    datasets: [{
      data: kpiData.campaigns?.map(c => c.completionRate) || [],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const budgetBreakdownChart = {
    labels: kpiData.budgetMetrics?.budgetBreakdown?.map(b => b.category) || [],
    datasets: [{
      data: kpiData.budgetMetrics?.budgetBreakdown?.map(b => b.amount) || [],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
      borderWidth: 0
    }]
  };

  const nepCompetenciesChart = {
    labels: kpiData.nepCompetencies?.competenciesByModule?.map(c => c.module) || [],
    datasets: [{
      label: 'NEP Competencies Coverage (%)',
      data: kpiData.nepCompetencies?.competenciesByModule?.map(c => c.coveragePercentage) || [],
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 1)',
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
    }]
  };

  const monthlySpendingChart = {
    labels: kpiData.budgetMetrics?.monthlySpending?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Rewards',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.rewards) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Admin Fees',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.admin) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Operational',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.operational) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">CSR Key Performance Indicators</h2>
              <p className="text-xs text-gray-600">Comprehensive metrics for social impact measurement</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefreshKPIs}
              disabled={refreshing}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-700 hover:shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExportKPIs('csv')}
              className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm font-semibold text-blue-600 flex items-center gap-2 hover:bg-blue-50 hover:shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExportKPIs('json')}
              className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-semibold text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 hover:shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              JSON
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Students Impacted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-blue-50 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {kpiData.studentsReached?.growth ? `+${kpiData.studentsReached.growth.toFixed(1)}%` : '+0.0%'}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-3xl font-bold text-gray-900">
              {kpiData.studentsReached?.totalStudents?.toLocaleString() || '0'}
            </h3>
            <p className="text-xs font-semibold text-gray-700">Students Impacted</p>
          </div>
        </motion.div>

        {/* Schools Reached */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-green-50 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-500 rounded-lg shadow-sm">
              <School className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {kpiData.schoolsReached?.growth ? `+${kpiData.schoolsReached.growth.toFixed(1)}%` : '+0.0%'}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-3xl font-bold text-gray-900">
              {kpiData.schoolsReached?.totalSchools?.toLocaleString() || '0'}
            </h3>
            <p className="text-xs font-semibold text-gray-700">Schools Reached</p>
          </div>
        </motion.div>

        {/* Total Value Funded */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-purple-50 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {kpiData.budgetMetrics?.growth ? `+${kpiData.budgetMetrics.growth.toFixed(1)}%` : '+0.0%'}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-3xl font-bold text-gray-900">
              ₹{((kpiData.budgetMetrics?.totalBudget || 0) / 100000).toFixed(1)}L
            </h3>
            <p className="text-xs font-semibold text-gray-700">Total Value Funded</p>
          </div>
        </motion.div>

        {/* Items Distributed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-orange-50 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {kpiData.certificates?.growth ? `+${kpiData.certificates.growth.toFixed(1)}%` : '+0.0%'}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-3xl font-bold text-gray-900">
              {kpiData.certificates?.totalIssued?.toLocaleString() || '0'}
            </h3>
            <p className="text-xs font-semibold text-gray-700">Items Distributed</p>
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-cyan-50 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-cyan-500 rounded-lg shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {kpiData.campaigns?.length > 0 ? 
                `+${((kpiData.campaigns.reduce((sum, c) => sum + (c.completionRate || 0), 0) / kpiData.campaigns.length) - 50).toFixed(1)}%` : '+0.0%'}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-3xl font-bold text-gray-900">
              {kpiData.campaigns?.length > 0 ? 
                Math.round(kpiData.campaigns.reduce((sum, c) => sum + (c.completionRate || 0), 0) / kpiData.campaigns.length) : 0}%
            </h3>
            <p className="text-xs font-semibold text-gray-700">Avg Completion Rate</p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Campaign Completion Rates */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Campaign Completion Rates</h3>
            </div>
          </div>
          <div className="h-64">
            <Doughnut
              data={campaignCompletionChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Budget Breakdown</h3>
            </div>
          </div>
          <div className="h-64">
            <Doughnut
              data={budgetBreakdownChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Monthly Spending Trend</h3>
            </div>
          </div>
          <div className="h-64">
            <Bar
              data={monthlySpendingChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* NEP Competencies Coverage */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">NEP Competencies Coverage</h3>
            </div>
          </div>
          <div className="h-64">
            <Radar
              data={nepCompetenciesChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { display: false },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Campaign Details Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Campaign Performance Details</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Participants</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Completed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Completion Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kpiData.campaigns?.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{campaign.campaignName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{campaign.totalParticipants}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{campaign.completedParticipants}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${campaign.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{campaign.completionRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {campaign.startDate && new Date(campaign.startDate).toLocaleDateString()} - 
                    {campaign.endDate && new Date(campaign.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CSRKPIComponent;
