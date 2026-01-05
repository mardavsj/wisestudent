import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Share2, Star, Users, CheckCircle, TrendingUp,
  Award, BookOpen, DollarSign, Calendar, Eye, Edit, Plus
} from 'lucide-react';
import CSRReportGenerator from '../../components/CSR/CSRReportGenerator';
import csrReportService from '../../services/csrReportService';

const CSRReports = () => {
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [reportMetrics, setReportMetrics] = useState({
    schoolsReached: 0,
    studentsReached: 0,
    completionRate: 0,
    learningImprovement: 0,
    certificatesIssued: 0,
    spendPerStudent: 0,
    nepAlignment: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load report metrics and recent reports
  const loadReportData = async () => {
    setLoading(true);
    try {
      const [reports, kpiData] = await Promise.all([
        csrReportService.getReports({ limit: 4 }),
        // We can use the CSR KPI data for metrics
        fetch('/api/csr-kpis/kpis?period=month&region=all').then(res => res.json())
      ]);

      setRecentReports(reports.data || []);

      if (kpiData.success && kpiData.data) {
        const data = kpiData.data;
        setReportMetrics({
          schoolsReached: data.schoolsReached?.totalSchools || 0,
          studentsReached: data.studentsReached?.totalStudents || 0,
          completionRate: data.campaigns?.length > 0 
            ? Math.round(data.campaigns.reduce((sum, c) => sum + (c.completionRate || 0), 0) / data.campaigns.length)
            : 0,
          learningImprovement: data.engagementMetrics?.engagementLift || 0,
          certificatesIssued: data.certificates?.totalIssued || 0,
          spendPerStudent: data.budgetMetrics?.totalBudget && data.studentsReached?.totalStudents
            ? Math.round(data.budgetMetrics.totalBudget / data.studentsReached.totalStudents)
            : 0,
          nepAlignment: data.nepCompetencies?.alignmentScore || 0
        });
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    CSR Reports
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Generate comprehensive branded PDF reports with all CSR metrics and insights
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReportGenerator(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all font-semibold text-xs sm:text-sm flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Generate Report</span>
              <span className="sm:hidden">Generate</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Report Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          {[
            {
              title: 'Schools & Students Reached',
              description: 'Coverage metrics and demographics',
              icon: Users,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-50 to-cyan-50',
              borderColor: 'border-blue-200',
              value: loading ? '...' : `${reportMetrics.schoolsReached} schools`,
              students: loading ? '...' : `${(reportMetrics.studentsReached / 1000).toFixed(1)}K students`
            },
            {
              title: 'Completion Rates',
              description: 'Student completion statistics',
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-50 to-emerald-50',
              borderColor: 'border-green-200',
              value: loading ? '...' : `${reportMetrics.completionRate}% avg`,
              students: 'Across all modules'
            },
            {
              title: 'Learning Improvements',
              description: 'Academic progress and skill development',
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-50 to-pink-50',
              borderColor: 'border-purple-200',
              value: loading ? '...' : `${reportMetrics.learningImprovement}% avg`,
              students: 'Skill improvement'
            },
            {
              title: 'Certificates Issued',
              description: 'Achievement and completion certificates',
              icon: Award,
              color: 'from-yellow-500 to-orange-500',
              bgColor: 'from-yellow-50 to-orange-50',
              borderColor: 'border-yellow-200',
              value: loading ? '...' : `${(reportMetrics.certificatesIssued / 1000).toFixed(1)}K`,
              students: 'Certificates'
            },
            {
              title: 'Spend per Student',
              description: 'Financial efficiency metrics',
              icon: DollarSign,
              color: 'from-red-500 to-pink-500',
              bgColor: 'from-red-50 to-pink-50',
              borderColor: 'border-red-200',
              value: loading ? '...' : `₹${reportMetrics.spendPerStudent}`,
              students: 'Per student'
            },
            {
              title: 'NEP Mapping',
              description: 'National Education Policy alignment',
              icon: BookOpen,
              color: 'from-indigo-500 to-blue-500',
              bgColor: 'from-indigo-50 to-blue-50',
              borderColor: 'border-indigo-200',
              value: loading ? '...' : `${reportMetrics.nepAlignment}%`,
              students: 'NEP aligned'
            }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`p-4 bg-gradient-to-br ${metric.bgColor} border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} w-fit mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{metric.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{metric.description}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Value:</span>
                    <span className="text-xs font-semibold text-gray-800">{metric.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Scope:</span>
                    <span className="text-xs font-semibold text-gray-800">{metric.students}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Report Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Report Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Branded PDF with CSR logo and custom colors',
              'Executive summary with key highlights',
              'Comprehensive metrics and visualizations',
              'NEP competency mapping and alignment',
              'Financial analysis and cost efficiency',
              'Testimonials and success stories',
              'Recommendations and next steps',
              'Interactive charts and graphs'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-2 text-xs text-gray-700 font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Recent Reports
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-xs text-gray-500">Loading recent reports...</p>
              </div>
            ) : recentReports.length > 0 ? recentReports.map((report, index) => (
              <motion.div
                key={report._id || report.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{report.name || report.title}</h4>
                  <p className="text-xs text-gray-600">
                    {report.type || 'Report'} • 
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'} • 
                    {report.fileSize || 'Unknown size'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                    report.status === 'completed' || report.status === 'Generated'
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-green-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-purple-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-600 mb-1">No Recent Reports</h3>
                <p className="text-xs text-gray-500">Generate your first report to get started</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Report Generator Modal */}
        {showReportGenerator && (
          <CSRReportGenerator
            onClose={() => setShowReportGenerator(false)}
            onSuccess={() => {
              setShowReportGenerator(false);
              loadReportData(); // Refresh reports after generation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CSRReports;
