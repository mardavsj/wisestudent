import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building, DollarSign, Target, TrendingUp, TrendingDown,
  Award, BarChart3, Activity, AlertTriangle, CheckCircle, Clock,
  ArrowUp, ArrowDown, Eye, Download, Share2, Trophy, Zap, Filter,
  Calendar, ArrowRight, TrendingUp as TrendUp, Globe, Sparkles,
  Briefcase, PieChart, LineChart, Lightbulb, Shield, Star
} from 'lucide-react';
import { csrOverviewService } from '../../services/csrOverviewService';
import csrKPIService from '../../services/csrKPIService';
import { exportToCSV, exportToJSON, shareContent } from '../../utils/exportUtils';
import { toast } from 'react-hot-toast';

const CSRExecutiveDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [executiveData, setExecutiveData] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [timeRange, setTimeRange] = useState('quarter');
  const [error, setError] = useState(null);

  const loadExecutiveData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewResponse, kpiResponse] = await Promise.all([
        csrOverviewService.getOverviewData({ period: timeRange }),
        csrKPIService.getKPIs({ period: timeRange })
      ]);

      setExecutiveData(overviewResponse.data);
      setKpiData(kpiResponse.data);
    } catch (error) {
      console.error('Error loading executive data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load executive data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadExecutiveData();
  }, [loadExecutiveData]);

  const handleExportCSV = () => {
    try {
      const impactData = executiveData?.impactData || {};
      const campaigns = kpiData?.campaigns || [];
      const topCampaign = campaigns.length > 0
        ? campaigns.reduce((top, current) => 
            (current.completionRate || 0) > (top.completionRate || 0) ? current : top
          )
        : null;

      const exportData = [{
        'Time Period': timeRange,
        'Students Impacted': impactData.studentsImpacted || 0,
        'Schools Reached': impactData.schoolsReached || 0,
        'Total Value Funded': impactData.totalValueFunded || 0,
        'Items Distributed': impactData.itemsDistributed || 0,
        'Active Campaigns': campaigns.length,
        'Top Campaign': topCampaign?.campaignName || 'N/A',
        'Top Campaign Completion': topCampaign ? `${topCampaign.completionRate?.toFixed(1)}%` : 'N/A'
      }];
      exportToCSV(exportData, `executive-dashboard-${timeRange}`);
      toast.success('Data exported to CSV');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handleExportJSON = () => {
    try {
      const impactData = executiveData?.impactData || {};
      const campaigns = kpiData?.campaigns || [];
      const topCampaign = campaigns.length > 0
        ? campaigns.reduce((top, current) => 
            (current.completionRate || 0) > (top.completionRate || 0) ? current : top
          )
        : null;

      const exportData = {
        timePeriod: timeRange,
        generatedAt: new Date().toISOString(),
        impactData,
        kpiData,
        campaigns,
        topCampaign
      };
      exportToJSON(exportData, `executive-dashboard-${timeRange}`);
      toast.success('Data exported to JSON');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Failed to export JSON');
    }
  };

  const handleShareDashboard = async () => {
    try {
      const impactData = executiveData?.impactData || {};
      const campaigns = kpiData?.campaigns || [];
      
      const shareText = `CSR Executive Dashboard - ${timeRange}\n\n` +
        `Students Impacted: ${impactData.studentsImpacted || 0}\n` +
        `Schools Reached: ${impactData.schoolsReached || 0}\n` +
        `Total Value Funded: ₹${(impactData.totalValueFunded || 0).toLocaleString()}\n` +
        `Active Campaigns: ${campaigns.length}`;
      
      const result = await shareContent('CSR Executive Dashboard', shareText);
      if (result.success) {
        toast.success(result.method === 'native' ? 'Shared successfully' : 'Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing dashboard:', error);
      toast.error('Failed to share dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Executive Dashboard</h2>
          <p className="text-gray-600">Gathering strategic insights...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl p-8 shadow-xl border border-red-200"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadExecutiveData()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const impactData = executiveData?.impactData || {};
  const campaigns = kpiData?.campaigns || [];
  const budgetMetrics = kpiData?.budgetMetrics || {};

  // Calculate metrics
  const topCampaign = campaigns.length > 0
    ? campaigns.reduce((top, current) => 
        (current.completionRate || 0) > (top.completionRate || 0) ? current : top
      )
    : null;

  const avgCompletion = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.completionRate || 0), 0) / campaigns.length
    : 0;

  const budgetUtilized = budgetMetrics.totalBudget
    ? ((budgetMetrics.totalBudget - (budgetMetrics.remainingBudget || 0)) / budgetMetrics.totalBudget * 100)
    : 0;

  // Strategic KPIs
  const strategicKPIs = [
    {
      title: 'Total Impact',
      value: impactData.studentsImpacted?.toLocaleString() || '0',
      label: 'Students Impacted',
      change: impactData.studentsGrowth ? `+${impactData.studentsGrowth.toFixed(1)}%` : null,
      changeType: 'positive',
      icon: Users,
      gradient: 'from-blue-600 via-cyan-500 to-blue-600',
      bgGradient: 'from-blue-50 via-cyan-50 to-blue-50',
      iconBg: 'bg-blue-500',
      description: 'Cumulative beneficiaries across all initiatives'
    },
    {
      title: 'Geographic Reach',
      value: impactData.schoolsReached?.toString() || '0',
      label: 'Schools Reached',
      change: impactData.schoolsGrowth ? `+${impactData.schoolsGrowth.toFixed(1)}%` : null,
      changeType: 'positive',
      icon: Building,
      gradient: 'from-green-600 via-emerald-500 to-green-600',
      bgGradient: 'from-green-50 via-emerald-50 to-green-50',
      iconBg: 'bg-green-500',
      description: 'Educational institutions engaged'
    },
    {
      title: 'Investment Value',
      value: impactData.totalValueFunded ? `₹${(impactData.totalValueFunded / 100000).toFixed(1)}L` : '₹0L',
      label: 'Total Value Funded',
      change: impactData.valueFundedGrowth ? `+${impactData.valueFundedGrowth.toFixed(1)}%` : null,
      changeType: 'positive',
      icon: DollarSign,
      gradient: 'from-purple-600 via-pink-500 to-purple-600',
      bgGradient: 'from-purple-50 via-pink-50 to-purple-50',
      iconBg: 'bg-purple-500',
      description: 'Total financial commitment deployed'
    },
    {
      title: 'Program Engagement',
      value: campaigns.length?.toString() || '0',
      label: 'Active Campaigns',
      change: topCampaign ? `${topCampaign.completionRate?.toFixed(1)}% Top` : null,
      changeType: 'neutral',
      icon: Target,
      gradient: 'from-orange-600 via-amber-500 to-orange-600',
      bgGradient: 'from-orange-50 via-amber-50 to-orange-50',
      iconBg: 'bg-orange-500',
      description: 'Ongoing CSR initiatives'
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      label: 'Average Completion Rate',
      value: `${avgCompletion.toFixed(1)}%`,
      icon: Target,
      color: avgCompletion >= 70 ? 'text-green-600' : avgCompletion >= 50 ? 'text-blue-600' : 'text-orange-600',
      bgColor: avgCompletion >= 70 ? 'bg-green-50' : avgCompletion >= 50 ? 'bg-blue-50' : 'bg-orange-50'
    },
    {
      label: 'Budget Utilization',
      value: `${budgetUtilized.toFixed(1)}%`,
      icon: PieChart,
      color: budgetUtilized >= 80 ? 'text-purple-600' : budgetUtilized >= 60 ? 'text-blue-600' : 'text-orange-600',
      bgColor: budgetUtilized >= 80 ? 'bg-purple-50' : budgetUtilized >= 60 ? 'bg-blue-50' : 'bg-orange-50'
    },
    {
      label: 'Items Distributed',
      value: (impactData.itemsDistributed || 0).toLocaleString(),
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'Total Campaigns',
      value: campaigns.length.toString(),
      icon: Briefcase,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  // Risk indicators
  const risks = [];
  if (budgetMetrics.remainingBudget && budgetMetrics.totalBudget && budgetMetrics.remainingBudget < budgetMetrics.totalBudget * 0.1) {
    risks.push({ 
      type: 'budget', 
      message: 'Budget utilization at critical level', 
      severity: 'high', 
      icon: AlertTriangle,
      recommendation: 'Review remaining allocations and prioritize high-impact initiatives'
    });
  }
  if (avgCompletion < 50 && campaigns.length > 0) {
    risks.push({ 
      type: 'engagement', 
      message: 'Low average campaign completion rate', 
      severity: 'medium', 
      icon: Target,
      recommendation: 'Assess engagement strategies and consider program adjustments'
    });
  }

  // Strategic insights
  const insights = [];
  if (topCampaign && topCampaign.completionRate >= 80) {
    insights.push({
      type: 'success',
      title: 'Top Performer Identified',
      message: `${topCampaign.campaignName || 'Top campaign'} is exceeding expectations with ${topCampaign.completionRate?.toFixed(1)}% completion`,
      icon: Star
    });
  }
  if (impactData.studentsGrowth > 20) {
    insights.push({
      type: 'growth',
      title: 'Strong Growth Trajectory',
      message: `Student impact has increased by ${impactData.studentsGrowth?.toFixed(1)}% this period`,
      icon: TrendingUp
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Executive Dashboard
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Strategic insights and high-level performance metrics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-purple-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all cursor-pointer"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportCSV}
                  className="p-2 bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportJSON}
                  className="p-2 bg-white border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShareDashboard}
                  className="p-2 bg-white border border-green-200 rounded-lg text-green-600 hover:bg-green-50 transition-all shadow-sm"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Executive Summary - Key Strategic KPIs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {strategicKPIs.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`relative overflow-hidden bg-white rounded-xl shadow-md border border-gray-100 ${kpi.bgGradient ? `bg-gradient-to-br ${kpi.bgGradient}` : ''}`}
              >
                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 ${kpi.iconBg} rounded-lg shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {kpi.change && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                        kpi.changeType === 'positive' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {kpi.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                        <span>{kpi.change}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs font-semibold text-gray-700">{kpi.label}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.title}</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{kpi.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Performance Overview & Risk Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
                  <p className="text-xs text-gray-600">Key operational metrics</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className={`p-3 ${metric.bgColor} rounded-lg border border-gray-200`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{metric.label}</span>
                    </div>
                    <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Top Campaign Highlight */}
            {topCampaign && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Top Performing Campaign</p>
                      <p className="text-xs text-gray-600">{topCampaign.campaignName || 'N/A'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md text-xs font-bold">
                    {topCampaign.completionRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topCampaign.completionRate || 0}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Risk Assessment</h2>
                <p className="text-xs text-gray-600">Strategic alerts</p>
              </div>
            </div>

            {risks.length > 0 ? (
              <div className="space-y-3">
                {risks.map((risk, index) => {
                  const Icon = risk.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`p-3 rounded-lg border-2 ${
                        risk.severity === 'high' 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className={`w-4 h-4 mt-0.5 ${
                          risk.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                        }`} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-xs mb-1">{risk.message}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{risk.recommendation}</p>
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${
                        risk.severity === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {risk.severity.toUpperCase()}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-gray-900 mb-1">All Systems Operational</p>
                <p className="text-xs text-gray-600">No critical risks identified</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Strategic Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Lightbulb className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Strategic Insights</h2>
                <p className="text-xs text-gray-600">Key highlights and opportunities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + index * 0.1 }}
                    className={`p-3 rounded-lg border-2 ${
                      insight.type === 'success' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 mt-0.5 ${
                        insight.type === 'success' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-900 text-xs mb-1">{insight.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Campaign Performance */}
        {campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <LineChart className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Campaign Performance</h2>
                  <p className="text-xs text-gray-600">Detailed program analysis</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                {campaigns.length} Active
              </span>
            </div>
            
            <div className="space-y-2">
              {campaigns.slice(0, 5).map((campaign, index) => {
                const completion = campaign.completionRate || 0;
                const progressColor = completion >= 80 ? 'from-green-500 to-emerald-500' :
                                      completion >= 50 ? 'from-blue-500 to-cyan-500' :
                                      'from-orange-500 to-red-500';
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{campaign.campaignName || `Campaign ${index + 1}`}</h3>
                        <p className="text-xs text-gray-600">{campaign.targetAudience || 'General audience'}</p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-xl font-bold text-gray-900">{completion.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">Completion</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.05 }}
                        className={`h-full bg-gradient-to-r ${progressColor}`}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {campaign.completedParticipants || 0} / {campaign.totalParticipants || 0} participants
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status || 'Active'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Export & Share</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
            >
              <Download className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-900">Export CSV</p>
                <p className="text-xs text-gray-600">Download data</p>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportJSON}
              className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all"
            >
              <Download className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-900">Export JSON</p>
                <p className="text-xs text-gray-600">Full data export</p>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareDashboard}
              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all"
            >
              <Share2 className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-900">Share Dashboard</p>
                <p className="text-xs text-gray-600">Share insights</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CSRExecutiveDashboard;
