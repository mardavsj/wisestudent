import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, Receipt, TrendingUp, TrendingDown,
  Download, Plus, Eye, Filter, Calendar, RefreshCw, AlertTriangle,
  CheckCircle, Clock, XCircle, BarChart3, PieChart, FileText
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
import csrFinancialService from '../../services/csrFinancialService';

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

const CSRFinancialDashboard = ({ onShowPaymentModal, onShowInvoiceModal }) => {
  const [financialData, setFinancialData] = useState(null);
  const [spendLedger, setSpendLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadFinancialData();
    loadSpendLedger();
  }, [timeRange, selectedCategory]);

  const loadFinancialData = async () => {
    try {
      const response = await csrFinancialService.getFinancialSummary({ timeRange });
      setFinancialData(response.data);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const loadSpendLedger = async () => {
    try {
      const response = await csrFinancialService.getSpendLedger({ 
        timeRange,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      setSpendLedger(response.data);
    } catch (error) {
      console.error('Error loading spend ledger:', error);
    }
  };

  const refreshData = () => {
    setLoading(true);
    loadFinancialData();
    loadSpendLedger();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const { balance, spendSummary, paymentStats, healCoinsSummary } = financialData || {};

  // Chart data configurations
  const spendChartData = {
    labels: spendSummary?.map(item => item._id.replace('_', ' ').toUpperCase()) || [],
    datasets: [
      {
        label: 'Amount (₹)',
        data: spendSummary?.map(item => item.totalAmount) || [],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  const paymentStatusData = {
    labels: paymentStats?.map(item => item._id.toUpperCase()) || [],
    datasets: [
      {
        label: 'Count',
        data: paymentStats?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
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
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Financial Dashboard</h2>
          <p className="text-xs text-gray-600">Manage payments, track spending, and generate invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={refreshData}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onShowPaymentModal}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            New Payment
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-green-600">₹{balance?.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
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
              <p className="text-xs font-semibold text-gray-600">HealCoins Balance</p>
              <p className="text-xl font-bold text-purple-600">{balance?.healCoinsBalance?.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
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
              <p className="text-xs font-semibold text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-red-600">
                ₹{spendSummary?.reduce((sum, item) => sum + item.totalAmount, 0)?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
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
              <p className="text-xs font-semibold text-gray-600">Active Payments</p>
              <p className="text-xl font-bold text-blue-600">
                {paymentStats?.find(p => p._id === 'processing')?.count || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spend by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Spending by Category</h3>
          <div className="h-48">
            <Doughnut data={spendChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Status</h3>
          <div className="h-48">
            <Bar data={paymentStatusData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Spend Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md border border-gray-100"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Spend Ledger</h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400"
              >
                <option value="all">All Categories</option>
                <option value="campaign_funding">Campaign Funding</option>
                <option value="healcoins_pool">HealCoins Pool</option>
                <option value="student_rewards">Student Rewards</option>
                <option value="platform_fees">Platform Fees</option>
                <option value="admin_costs">Admin Costs</option>
              </select>
              <button
                onClick={onShowInvoiceModal}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                <Receipt className="w-4 h-4" />
                View Invoices
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HealCoins
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spendLedger.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {transaction.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    <span className={transaction.direction === 'inbound' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.direction === 'inbound' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {transaction.healCoinsAmount > 0 && (
                      <span className={transaction.direction === 'inbound' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.direction === 'inbound' ? '+' : '-'}{transaction.healCoinsAmount}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-gray-500 hover:bg-gray-50 rounded">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CSRFinancialDashboard;
