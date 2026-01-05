import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp,
  TrendingDown, Eye, Bell, Download, RefreshCw, Filter,
  Target, Users, Calendar, BarChart3, PieChart
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { toast } from 'react-hot-toast';
import budgetTrackingService from '../../services/budgetTrackingService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LiveBudgetTracking = ({ onShowBudgetAlert }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  useEffect(() => {
    loadBudgetData();
    loadAlerts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadBudgetData();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedCampaign]);

  const loadBudgetData = async () => {
    try {
      const response = await budgetTrackingService.getLiveBudgetTracking({
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      });
      setBudgetData(response.data);
    } catch (error) {
      console.error('Error loading budget data:', error);
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await budgetTrackingService.getBudgetAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBudgetData();
    await loadAlerts();
    setRefreshing(false);
    toast.success('Budget data refreshed');
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await budgetTrackingService.acknowledgeAlert(alertId, {
        notes: 'Alert acknowledged',
        action: 'Monitoring budget closely'
      });
      toast.success('Alert acknowledged');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const getBudgetStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      case 'exceeded': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getBudgetStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'moderate': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'exceeded': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const { campaigns = [], totalBudget, totalSpent, totalRemaining, overallSpendPercentage } = budgetData || {};

  // Chart data for spending trends
  const spendingChartData = {
    labels: campaigns.map(c => c.campaignName),
    datasets: [
      {
        label: 'Spent',
        data: campaigns.map(c => c.budget.spent),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Remaining',
        data: campaigns.map(c => c.budget.remaining),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 11
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Live Budget Tracking</h2>
          <p className="text-xs text-gray-600">Real-time budget monitoring with threshold warnings</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.campaignId} value={campaign.campaignId}>
                {campaign.campaignName}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Total Budget</p>
              <p className="text-xl font-bold text-gray-900">₹{totalBudget?.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-red-600">₹{totalSpent?.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Remaining</p>
              <p className="text-xl font-bold text-green-600">₹{totalRemaining?.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Spend %</p>
              <p className={`text-xl font-bold ${getBudgetStatusColor(
                overallSpendPercentage >= 100 ? 'exceeded' :
                overallSpendPercentage >= 95 ? 'critical' :
                overallSpendPercentage >= 80 ? 'warning' :
                overallSpendPercentage >= 60 ? 'moderate' : 'healthy'
              )}`}>
                {Math.round(overallSpendPercentage || 0)}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Budget Alerts</h3>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-xs font-semibold">
                {alerts.length} Active
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">{alert.alertDetails.title}</h4>
                    <p className="text-xs text-gray-600">{alert.alertDetails.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getAlertSeverityColor(alert.alertDetails.severity)}`}>
                    {alert.alertDetails.severity.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleAcknowledgeAlert(alert._id)}
                    className="px-2.5 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Campaign Budget Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Campaign List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Campaign Budgets</h3>
          </div>
          <div className="p-4 space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.campaignId} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-xs text-gray-900">{campaign.campaignName}</h4>
                  <div className="flex items-center gap-1.5">
                    {getBudgetStatusIcon(campaign.status)}
                    <span className={`text-xs font-medium ${getBudgetStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold">₹{campaign.budget.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-semibold text-red-600">₹{campaign.budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold text-green-600">₹{campaign.budget.remaining.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Spend Progress</span>
                      <span>{campaign.budget.spendPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          campaign.budget.spendPercentage >= 100 ? 'bg-red-600' :
                          campaign.budget.spendPercentage >= 95 ? 'bg-red-500' :
                          campaign.budget.spendPercentage >= 80 ? 'bg-orange-500' :
                          campaign.budget.spendPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(campaign.budget.spendPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Spending Overview</h3>
          </div>
          <div className="p-4">
            <div className="h-48">
              <Bar data={spendingChartData} options={{...chartOptions, maintainAspectRatio: false}} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md border border-gray-100"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.flatMap(campaign => 
                campaign.recentTransactions?.map((transaction, index) => (
                  <tr key={`${campaign.campaignId}-${index}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                      {campaign.campaignName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-red-600">
                      -₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) || []
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveBudgetTracking;
