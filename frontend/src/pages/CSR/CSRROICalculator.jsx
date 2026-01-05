import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Plus, TrendingUp, TrendingDown, DollarSign, X,
  Save, Eye, Trash2, BarChart3, Target, Award, RefreshCw, Download,
  ArrowRight, Percent, TrendingUp as TrendUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrROIService from '../../services/csrROIService';
import { exportToCSV } from '../../utils/exportUtils';

const CSRROICalculator = () => {
  const [calculations, setCalculations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [activeTab, setActiveTab] = useState('inputs'); // inputs, benefits, results

  const [formData, setFormData] = useState({
    calculationName: '',
    description: '',
    inputs: {
      totalInvestment: '',
      operationalCosts: '',
      marketingCosts: '',
      administrativeCosts: '',
      otherCosts: ''
    },
    benefits: {
      costSavings: '',
      revenueGenerated: '',
      taxBenefits: '',
      brandValueIncrease: '',
      employeeEngagementValue: '',
      communityGoodwillValue: '',
      socialImpactValue: '',
      environmentalImpactValue: ''
    },
    impactMetrics: {
      studentsReached: '',
      schoolsReached: '',
      certificatesIssued: '',
      jobsCreated: '',
      communitiesImpacted: ''
    },
    startDate: '',
    endDate: ''
  });

  const [calculatedROI, setCalculatedROI] = useState(null);

  useEffect(() => {
    loadCalculations();
    loadSummary();
  }, []);

  const loadCalculations = async () => {
    setLoading(true);
    try {
      const response = await csrROIService.getCalculations();
      setCalculations(response.data || []);
    } catch (error) {
      console.error('Error loading calculations:', error);
      toast.error('Failed to load ROI calculations');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await csrROIService.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const calculateROI = () => {
    const inputs = formData.inputs;
    const benefits = formData.benefits;

    // Calculate totals
    const totalCost = 
      (parseFloat(inputs.totalInvestment) || 0) +
      (parseFloat(inputs.operationalCosts) || 0) +
      (parseFloat(inputs.marketingCosts) || 0) +
      (parseFloat(inputs.administrativeCosts) || 0) +
      (parseFloat(inputs.otherCosts) || 0);

    const totalBenefit = 
      (parseFloat(benefits.costSavings) || 0) +
      (parseFloat(benefits.revenueGenerated) || 0) +
      (parseFloat(benefits.taxBenefits) || 0) +
      (parseFloat(benefits.brandValueIncrease) || 0) +
      (parseFloat(benefits.employeeEngagementValue) || 0) +
      (parseFloat(benefits.communityGoodwillValue) || 0) +
      (parseFloat(benefits.socialImpactValue) || 0) +
      (parseFloat(benefits.environmentalImpactValue) || 0);

    const netBenefit = totalBenefit - totalCost;
    const roiPercentage = totalCost > 0 ? (netBenefit / totalCost) * 100 : 0;
    const benefitCostRatio = totalCost > 0 ? totalBenefit / totalCost : 0;

    setCalculatedROI({
      totalCost,
      totalBenefit,
      netBenefit,
      roiPercentage,
      benefitCostRatio,
      paybackPeriod: 0 // Simplified
    });
  };

  useEffect(() => {
    calculateROI();
  }, [formData]);

  const handleCreateCalculation = async () => {
    try {
      if (!formData.calculationName || !formData.inputs.totalInvestment) {
        toast.error('Please fill in all required fields');
        return;
      }

      const calculationData = {
        ...formData,
        inputs: {
          totalInvestment: parseFloat(formData.inputs.totalInvestment) || 0,
          operationalCosts: parseFloat(formData.inputs.operationalCosts) || 0,
          marketingCosts: parseFloat(formData.inputs.marketingCosts) || 0,
          administrativeCosts: parseFloat(formData.inputs.administrativeCosts) || 0,
          otherCosts: parseFloat(formData.inputs.otherCosts) || 0
        },
        benefits: {
          costSavings: parseFloat(formData.benefits.costSavings) || 0,
          revenueGenerated: parseFloat(formData.benefits.revenueGenerated) || 0,
          taxBenefits: parseFloat(formData.benefits.taxBenefits) || 0,
          brandValueIncrease: parseFloat(formData.benefits.brandValueIncrease) || 0,
          employeeEngagementValue: parseFloat(formData.benefits.employeeEngagementValue) || 0,
          communityGoodwillValue: parseFloat(formData.benefits.communityGoodwillValue) || 0,
          socialImpactValue: parseFloat(formData.benefits.socialImpactValue) || 0,
          environmentalImpactValue: parseFloat(formData.benefits.environmentalImpactValue) || 0
        },
        impactMetrics: {
          studentsReached: parseFloat(formData.impactMetrics.studentsReached) || 0,
          schoolsReached: parseFloat(formData.impactMetrics.schoolsReached) || 0,
          certificatesIssued: parseFloat(formData.impactMetrics.certificatesIssued) || 0,
          jobsCreated: parseFloat(formData.impactMetrics.jobsCreated) || 0,
          communitiesImpacted: parseFloat(formData.impactMetrics.communitiesImpacted) || 0
        }
      };

      await csrROIService.createCalculation(calculationData);
      toast.success('ROI calculation created successfully');
      setShowCreateModal(false);
      resetForm();
      loadCalculations();
      loadSummary();
    } catch (error) {
      console.error('Error creating calculation:', error);
      toast.error(error.response?.data?.message || 'Failed to create calculation');
    }
  };

  const handleDeleteCalculation = async (calculationId) => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      await csrROIService.deleteCalculation(calculationId);
      toast.success('Calculation deleted successfully');
      loadCalculations();
      loadSummary();
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast.error('Failed to delete calculation');
    }
  };

  const resetForm = () => {
    setFormData({
      calculationName: '',
      description: '',
      inputs: {
        totalInvestment: '',
        operationalCosts: '',
        marketingCosts: '',
        administrativeCosts: '',
        otherCosts: ''
      },
      benefits: {
        costSavings: '',
        revenueGenerated: '',
        taxBenefits: '',
        brandValueIncrease: '',
        employeeEngagementValue: '',
        communityGoodwillValue: '',
        socialImpactValue: '',
        environmentalImpactValue: ''
      },
      impactMetrics: {
        studentsReached: '',
        schoolsReached: '',
        certificatesIssued: '',
        jobsCreated: '',
        communitiesImpacted: ''
      },
      startDate: '',
      endDate: ''
    });
    setCalculatedROI(null);
    setActiveTab('inputs');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const handleExportCalculations = () => {
    try {
      if (calculations.length === 0) {
        toast.error('No calculations to export');
        return;
      }

      const exportData = calculations.map(calc => {
        const roi = calc.roiMetrics || {};
        return {
          'Calculation ID': calc.calculationId || '',
          'Calculation Name': calc.calculationName || '',
          'Total Cost': roi.totalCost || 0,
          'Total Benefit': roi.totalBenefit || 0,
          'Net Benefit': roi.netBenefit || 0,
          'ROI %': roi.roiPercentage?.toFixed(1) || 0,
          'Benefit/Cost Ratio': roi.benefitCostRatio?.toFixed(2) || 0,
          'Payback Period (months)': roi.paybackPeriod?.toFixed(1) || 0,
          'Status': calc.status || '',
          'Start Date': calc.startDate ? new Date(calc.startDate).toLocaleDateString() : '',
          'End Date': calc.endDate ? new Date(calc.endDate).toLocaleDateString() : '',
          'Students Reached': calc.impactMetrics?.studentsReached || 0,
          'Schools Reached': calc.impactMetrics?.schoolsReached || 0
        };
      });

      exportToCSV(exportData, 'roi-calculations');
      toast.success('ROI calculations exported successfully');
    } catch (error) {
      console.error('Error exporting calculations:', error);
      toast.error('Failed to export calculations');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading ROI Calculator</h2>
          <p className="text-xs text-gray-600">Fetching calculation data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    ROI Calculator
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Calculate return on investment and measure impact value of CSR initiatives
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCalculations}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                title="Export Calculations"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Calculation
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-0.5">Total Investment</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalInvestment)}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-0.5">Total Benefits</div>
                  <div className="text-xl font-bold text-green-600">{formatCurrency(summary.totalBenefits)}</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-0.5">Net Benefit</div>
                  <div className="text-xl font-bold text-blue-600">{formatCurrency(summary.totalNetBenefit)}</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Percent className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-0.5">Average ROI</div>
                  <div className="text-xl font-bold text-purple-600">{summary.averageROI?.toFixed(1) || 0}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Calculations Grid */}
        {calculations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
          >
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">No Calculations Found</h3>
            <p className="text-xs text-gray-600 mb-4">Create your first ROI calculation to get started</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Create Calculation
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculations.map((calc, index) => {
              const roi = calc.roiMetrics || {};
              const isPositive = roi.roiPercentage >= 0;

              return (
                <motion.div
                  key={calc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{calc.calculationName}</h3>
                      {calc.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteCalculation(calc._id)}
                      className="p-1.5 hover:bg-red-50 rounded-md text-red-600 transition-colors ml-2"
                      title="Delete Calculation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                  {/* ROI Highlight */}
                  <div className={`p-3 rounded-lg mb-3 border ${
                    isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-0.5">Return on Investment</div>
                        <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {roi.roiPercentage?.toFixed(1) || 0}%
                        </div>
                      </div>
                      {isPositive ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600">Total Cost</span>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(roi.totalCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600">Total Benefit</span>
                      <span className="text-xs font-bold text-green-600">
                        {formatCurrency(roi.totalBenefit)}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded-lg ${
                      isPositive ? 'bg-blue-50' : 'bg-red-50'
                    }`}>
                      <span className="text-xs font-semibold text-gray-600">Net Benefit</span>
                      <span className={`text-xs font-bold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(roi.netBenefit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600">Benefit/Cost Ratio</span>
                      <span className="text-xs font-bold text-purple-600">
                        {roi.benefitCostRatio?.toFixed(2) || 0}x
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCalculation(calc)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Calculation Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">New ROI Calculation</h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
                  {['inputs', 'benefits', 'results'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-semibold capitalize transition-colors relative ${
                        activeTab === tab
                          ? 'text-indigo-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {activeTab === 'inputs' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Calculation Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.calculationName}
                          onChange={(e) => setFormData({ ...formData, calculationName: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                          placeholder="e.g., Q1 2024 Education Initiative"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                          rows={3}
                          placeholder="Describe the CSR initiative"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Start Date</label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">End Date</label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold text-xs text-gray-900 mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          Investment & Costs
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Total Investment <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={formData.inputs.totalInvestment}
                              onChange={(e) => setFormData({
                                ...formData,
                                inputs: { ...formData.inputs, totalInvestment: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">Operational Costs</label>
                              <input
                                type="number"
                                value={formData.inputs.operationalCosts}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  inputs: { ...formData.inputs, operationalCosts: e.target.value }
                                })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">Marketing Costs</label>
                              <input
                                type="number"
                                value={formData.inputs.marketingCosts}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  inputs: { ...formData.inputs, marketingCosts: e.target.value }
                                })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">Administrative Costs</label>
                              <input
                                type="number"
                                value={formData.inputs.administrativeCosts}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  inputs: { ...formData.inputs, administrativeCosts: e.target.value }
                                })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">Other Costs</label>
                              <input
                                type="number"
                                value={formData.inputs.otherCosts}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  inputs: { ...formData.inputs, otherCosts: e.target.value }
                                })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h3 className="font-semibold text-xs text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Direct Benefits
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Cost Savings</label>
                            <input
                              type="number"
                              value={formData.benefits.costSavings}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, costSavings: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Revenue Generated</label>
                            <input
                              type="number"
                              value={formData.benefits.revenueGenerated}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, revenueGenerated: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tax Benefits</label>
                            <input
                              type="number"
                              value={formData.benefits.taxBenefits}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, taxBenefits: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-xs text-gray-900 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          Indirect Benefits (Quantified)
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand Value Increase</label>
                            <input
                              type="number"
                              value={formData.benefits.brandValueIncrease}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, brandValueIncrease: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Employee Engagement Value</label>
                            <input
                              type="number"
                              value={formData.benefits.employeeEngagementValue}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, employeeEngagementValue: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Community Goodwill Value</label>
                            <input
                              type="number"
                              value={formData.benefits.communityGoodwillValue}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, communityGoodwillValue: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="font-semibold text-xs text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          Social Impact (Monetized)
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Social Impact Value</label>
                            <input
                              type="number"
                              value={formData.benefits.socialImpactValue}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, socialImpactValue: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Environmental Impact Value</label>
                            <input
                              type="number"
                              value={formData.benefits.environmentalImpactValue}
                              onChange={(e) => setFormData({
                                ...formData,
                                benefits: { ...formData.benefits, environmentalImpactValue: e.target.value }
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'results' && calculatedROI && (
                    <div className="space-y-4">
                      {/* ROI Highlight */}
                      <div className={`p-5 rounded-xl bg-gradient-to-br ${
                        calculatedROI.roiPercentage >= 0 
                          ? 'from-green-500 to-emerald-500' 
                          : 'from-red-500 to-pink-500'
                      } text-white shadow-lg`}>
                        <div className="text-center">
                          <div className="text-xs font-semibold text-white/90 mb-1.5">Return on Investment</div>
                          <div className="text-3xl font-bold mb-1.5">
                            {calculatedROI.roiPercentage.toFixed(1)}%
                          </div>
                          <div className="text-xs font-semibold text-white/80">
                            Benefit/Cost Ratio: {calculatedROI.benefitCostRatio.toFixed(2)}x
                          </div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="text-xs text-gray-600 mb-0.5">Total Cost</div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(calculatedROI.totalCost)}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200 shadow-sm">
                          <div className="text-xs text-gray-600 mb-0.5">Total Benefit</div>
                          <div className="text-sm font-bold text-green-600">
                            {formatCurrency(calculatedROI.totalBenefit)}
                          </div>
                        </div>
                        <div className={`col-span-2 rounded-lg p-3 border shadow-sm ${
                          calculatedROI.netBenefit >= 0 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="text-xs text-gray-600 mb-0.5">Net Benefit</div>
                          <div className={`text-lg font-bold ${
                            calculatedROI.netBenefit >= 0 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(calculatedROI.netBenefit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                  {activeTab === 'results' ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('inputs')}
                        className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateCalculation}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                      >
                        Save Calculation
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowCreateModal(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (activeTab === 'inputs') setActiveTab('benefits');
                          else if (activeTab === 'benefits') setActiveTab('results');
                        }}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        Continue
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calculation Detail Modal */}
        <AnimatePresence>
          {selectedCalculation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCalculation(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{selectedCalculation.calculationName}</h2>
                  <button
                    onClick={() => setSelectedCalculation(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCalculation.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1.5">Description</h3>
                      <p className="text-xs text-gray-700">{selectedCalculation.description}</p>
                    </div>
                  )}

                  {/* ROI Metrics */}
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${
                    (selectedCalculation.roiMetrics?.roiPercentage || 0) >= 0 
                      ? 'from-green-500 to-emerald-500' 
                      : 'from-red-500 to-pink-500'
                  } text-white shadow-lg`}>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-white/90 mb-1.5">Return on Investment</div>
                      <div className="text-3xl font-bold mb-1.5">
                        {selectedCalculation.roiMetrics?.roiPercentage?.toFixed(1) || 0}%
                      </div>
                      <div className="text-xs font-semibold text-white/80">
                        Benefit/Cost Ratio: {selectedCalculation.roiMetrics?.benefitCostRatio?.toFixed(2) || 0}x
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-0.5">Total Cost</div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(selectedCalculation.roiMetrics?.totalCost)}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-gray-600 mb-0.5">Total Benefit</div>
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(selectedCalculation.roiMetrics?.totalBenefit)}
                      </div>
                    </div>
                    <div className={`col-span-2 rounded-lg p-3 border ${
                      (selectedCalculation.roiMetrics?.netBenefit || 0) >= 0 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="text-xs text-gray-600 mb-0.5">Net Benefit</div>
                      <div className={`text-lg font-bold ${
                        (selectedCalculation.roiMetrics?.netBenefit || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(selectedCalculation.roiMetrics?.netBenefit)}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Start Date</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {selectedCalculation.startDate ? new Date(selectedCalculation.startDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">End Date</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {selectedCalculation.endDate ? new Date(selectedCalculation.endDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CSRROICalculator;
