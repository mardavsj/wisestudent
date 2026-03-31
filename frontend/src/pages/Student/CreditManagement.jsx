import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Trash2, Edit2, DollarSign, CreditCard, 
  Calendar, Filter, Download, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, Info, Clock, Wallet, Target, Lightbulb, 
  History, X, Check, BarChart3, PieChart, Shield, Award, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from '../../components/LanguageSelector';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const CreditManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('tools');
  const tt = (key, defaultValue, options = {}) =>
    t(`financial-literacy.credit-management.${key}`, { defaultValue, ...options });
  const { user } = useAuth();
  const [creditAccounts, setCreditAccounts] = useState([]);
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'accounts', 'payments', 'tips'
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Credit Card',
    creditLimit: '',
    currentBalance: '',
    interestRate: '',
    dueDate: '',
    minimumPayment: '',
    notes: '',
  });

  // Calculate user age
  const userAge = useMemo(() => {
    if (!user) return null;
    const dob = user.dateOfBirth || user.dob;
    if (!dob) return null;
    
    const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
    if (isNaN(dobDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    return age;
  }, [user]);

  // Determine age group
  const ageGroup = useMemo(() => {
    if (userAge === null) return 'adults';
    if (userAge < 13) return 'kids';
    if (userAge < 18) return 'teens';
    return 'adults';
  }, [userAge]);

  // Age-appropriate configuration
  const config = useMemo(() => {
    if (ageGroup === 'kids') {
      return {
        accountTypes: ['Savings Card', 'Allowance Card'],
        minCreditLimit: 0,
        maxCreditLimit: 100,
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
      };
    } else if (ageGroup === 'teens') {
      return {
        accountTypes: ['Credit Card', 'Student Card', 'Debit Card'],
        minCreditLimit: 0,
        maxCreditLimit: 5000,
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
      };
    } else {
      return {
        accountTypes: ['Credit Card', 'Personal Loan', 'Auto Loan', 'Mortgage', 'Line of Credit', 'Other'],
        minCreditLimit: 0,
        maxCreditLimit: 100000,
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
      };
    }
  }, [ageGroup]);

  // Load data on mount
  useEffect(() => {
    const loadCreditData = async () => {
      try {
        setLoading(true);
        // Load from localStorage as fallback
        const savedAccounts = localStorage.getItem('creditAccounts');
        const savedScore = localStorage.getItem('creditScore');
        
        if (savedAccounts) {
          setCreditAccounts(JSON.parse(savedAccounts));
        }
        if (savedScore) {
          setCreditScore(JSON.parse(savedScore));
        } else {
          // Initialize default credit score based on age group
          const defaultScore = ageGroup === 'kids' ? null : ageGroup === 'teens' ? 650 : 700;
          if (defaultScore) {
            setCreditScore({
              score: defaultScore,
              lastUpdated: new Date().toISOString(),
              factors: {
                paymentHistory: 35,
                creditUtilization: 30,
                creditAge: 15,
                creditMix: 10,
                newCredit: 10,
              }
            });
          }
        }

        logActivity({
          activityType: 'page_view',
          description: 'Viewed credit management',
          metadata: {
            page: '/student/finance/credit-management',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading credit data:', error);
        toast.error(tt('toasts.loadFailed', 'Failed to load credit data'));
      } finally {
        setLoading(false);
      }
    };

    loadCreditData();
  }, [ageGroup]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      const timer = setTimeout(() => {
        localStorage.setItem('creditAccounts', JSON.stringify(creditAccounts));
        if (creditScore) {
          localStorage.setItem('creditScore', JSON.stringify(creditScore));
        }
        setHasUnsavedChanges(false);
        toast.success('Credit data saved! 💾', { duration: 2000, position: 'bottom-center' });
      }, 2000);

      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [creditAccounts, creditScore, hasUnsavedChanges, autoSaveTimer]);

  // Calculate credit statistics
  const creditStats = useMemo(() => {
    const totalCreditLimit = creditAccounts.reduce((sum, acc) => sum + (parseFloat(acc.creditLimit) || 0), 0);
    const totalBalance = creditAccounts.reduce((sum, acc) => sum + (parseFloat(acc.currentBalance) || 0), 0);
    const utilization = totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0;
    const totalMinimumPayments = creditAccounts.reduce((sum, acc) => sum + (parseFloat(acc.minimumPayment) || 0), 0);
    const accountsCount = creditAccounts.length;

    return {
      totalCreditLimit,
      totalBalance,
      utilization,
      totalMinimumPayments,
      accountsCount,
      availableCredit: totalCreditLimit - totalBalance,
    };
  }, [creditAccounts]);

  // Calculate credit score based on factors
  const calculateCreditScore = () => {
    if (creditAccounts.length === 0) return null;

    let score = ageGroup === 'teens' ? 650 : 700;
    
    // Payment history (35%)
    const onTimePayments = creditAccounts.filter(acc => {
      // Simulate payment history
      return true; // For demo purposes
    }).length;
    const paymentScore = (onTimePayments / creditAccounts.length) * 35;
    
    // Credit utilization (30%)
    const utilizationScore = creditStats.utilization < 30 ? 30 : 
                            creditStats.utilization < 50 ? 20 : 
                            creditStats.utilization < 70 ? 10 : 0;
    
    // Credit age (15%)
    const creditAgeScore = creditAccounts.length > 2 ? 15 : creditAccounts.length > 1 ? 10 : 5;
    
    // Credit mix (10%)
    const creditMixScore = creditAccounts.length > 1 ? 10 : 5;
    
    // New credit (10%)
    const newCreditScore = 10;

    score = Math.round(300 + paymentScore + utilizationScore + creditAgeScore + creditMixScore + newCreditScore);
    score = Math.min(850, Math.max(300, score));

    return score;
  };

  // Update credit score when accounts change
  useEffect(() => {
    if (creditAccounts.length > 0) {
      const newScore = calculateCreditScore();
      if (newScore && (!creditScore || creditScore.score !== newScore)) {
        setCreditScore({
          score: newScore,
          lastUpdated: new Date().toISOString(),
          factors: {
            paymentHistory: 35,
            creditUtilization: creditStats.utilization < 30 ? 30 : creditStats.utilization < 50 ? 20 : 10,
            creditAge: creditAccounts.length > 2 ? 15 : 10,
            creditMix: creditAccounts.length > 1 ? 10 : 5,
            newCredit: 10,
          }
        });
        setHasUnsavedChanges(true);
      }
    }
  }, [creditAccounts, creditStats.utilization]);

  // Handle add/edit account
  const handleSaveAccount = () => {
    if (!newAccount.name || !newAccount.creditLimit) {
      toast.error(tt('toasts.requiredFields', 'Please fill in all required fields'));
      return;
    }

    const accountData = {
      _id: editingAccountId || `acc_${Date.now()}`,
      ...newAccount,
      creditLimit: parseFloat(newAccount.creditLimit),
      currentBalance: parseFloat(newAccount.currentBalance) || 0,
      interestRate: parseFloat(newAccount.interestRate) || 0,
      minimumPayment: parseFloat(newAccount.minimumPayment) || 0,
      createdAt: editingAccountId ? creditAccounts.find(a => a._id === editingAccountId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingAccountId) {
      setCreditAccounts(creditAccounts.map(acc => acc._id === editingAccountId ? accountData : acc));
      toast.success('Account updated successfully!');
    } else {
      setCreditAccounts([...creditAccounts, accountData]);
      toast.success('Account added successfully!');
    }

    resetForm();
    setHasUnsavedChanges(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccountId(account._id);
    setNewAccount({
      name: account.name,
      type: account.type,
      creditLimit: account.creditLimit.toString(),
      currentBalance: account.currentBalance.toString(),
      interestRate: account.interestRate?.toString() || '',
      dueDate: account.dueDate || '',
      minimumPayment: account.minimumPayment?.toString() || '',
      notes: account.notes || '',
    });
    setShowAddForm(true);
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setCreditAccounts(creditAccounts.filter(acc => acc._id !== id));
      toast.success('Account deleted successfully');
      setHasUnsavedChanges(true);
    }
  };

  const resetForm = () => {
    setNewAccount({
      name: '',
      type: 'Credit Card',
      creditLimit: '',
      currentBalance: '',
      interestRate: '',
      dueDate: '',
      minimumPayment: '',
      notes: '',
    });
    setEditingAccountId(null);
    setShowAddForm(false);
  };

  const getCreditScoreColor = (score) => {
    if (!score) return 'text-gray-500';
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score) => {
    if (!score) return 'No Score';
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const getUtilizationColor = (utilization) => {
    if (utilization < 30) return 'text-green-600';
    if (utilization < 50) return 'text-yellow-600';
    if (utilization < 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${
        ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
        ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
        'from-gray-50 via-white to-slate-50'
      } flex items-center justify-center`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 ${
              ageGroup === 'kids' ? 'border-pink-500' :
              ageGroup === 'teens' ? 'border-blue-500' :
              'border-emerald-500'
            } border-t-transparent rounded-full mx-auto mb-4`}
          />
          <p className="text-gray-600">{tt('loading', 'Loading your credit information...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
      ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
      'from-gray-50 via-white to-slate-50'
    } p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate('/student/dashboard/financial-literacy')}
              className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {tt('backButton', 'Back to Financial Literacy')}
            </button>
            <LanguageSelector />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
                ageGroup === 'kids' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight' :
                ageGroup === 'teens' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight' :
                'text-gray-900'
              }`}>
                {ageGroup === 'kids' && '💳 '}
                {tt('title', 'Credit Management')}
                {ageGroup === 'kids' && ' 💳'}
              </h1>
              <p className={`text-lg ${
                ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {ageGroup === 'kids' && tt('subtitle.kids', 'Learn about credit in a fun way! 🎯')}
                {ageGroup === 'teens' && tt('subtitle.teens', 'Manage your credit and build a strong credit history')}
                {ageGroup === 'adults' && tt('subtitle.adults', 'Track and improve your credit score and manage credit accounts')}
              </p>
            </div>
            
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Auto-saving...
              </motion.div>
            )}
          </div>
        </div>

        {/* Credit Score Card */}
        {creditScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-emerald-500"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl ${
                  creditScore.score >= 750 ? 'bg-green-100' :
                  creditScore.score >= 700 ? 'bg-blue-100' :
                  creditScore.score >= 650 ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <Award className={`w-8 h-8 ${
                    creditScore.score >= 750 ? 'text-green-600' :
                    creditScore.score >= 700 ? 'text-blue-600' :
                    creditScore.score >= 650 ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Credit Score</p>
                  <p className={`text-4xl font-black ${getCreditScoreColor(creditScore.score)}`}>
                    {creditScore.score}
                  </p>
                  <p className={`text-sm font-bold ${getCreditScoreColor(creditScore.score)}`}>
                    {getCreditScoreLabel(creditScore.score)}
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Payment History</span>
                    <span className="font-bold">{creditScore.factors.paymentHistory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${creditScore.factors.paymentHistory}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Credit Utilization</span>
                    <span className="font-bold">{creditScore.factors.creditUtilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${creditScore.factors.creditUtilization}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="p-3 rounded-xl bg-blue-100 mb-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Credit Limit</p>
            <p className="text-3xl font-black text-gray-800">
              ${creditStats.totalCreditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{creditStats.accountsCount} account{creditStats.accountsCount !== 1 ? 's' : ''}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="p-3 rounded-xl bg-red-100 mb-2">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Current Balance</p>
            <p className="text-3xl font-black text-gray-800">
              ${creditStats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ${creditStats.availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <div className="p-3 rounded-xl bg-yellow-100 mb-2">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Credit Utilization</p>
            <p className={`text-3xl font-black ${getUtilizationColor(creditStats.utilization)}`}>
              {creditStats.utilization.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {creditStats.utilization < 30 ? 'Excellent' : creditStats.utilization < 50 ? 'Good' : 'Needs improvement'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="p-3 rounded-xl bg-purple-100 mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Monthly Payments</p>
            <p className="text-3xl font-black text-gray-800">
              ${creditStats.totalMinimumPayments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">Minimum payments due</p>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg mb-6"
        >
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'overview'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-emerald-600 border-b-4 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'accounts'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-emerald-600 border-b-4 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5 inline mr-2" />
              Accounts
            </button>
            {config.showAdvanced && (
              <button
                onClick={() => setActiveTab('tips')}
                className={`px-6 py-4 font-black text-sm transition-all ${
                  activeTab === 'tips'
                    ? ageGroup === 'kids'
                      ? 'text-pink-600 border-b-4 border-pink-600'
                      : ageGroup === 'teens'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-emerald-600 border-b-4 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Lightbulb className="w-5 h-5 inline mr-2" />
                Tips
              </button>
            )}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Credit Utilization Chart */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
                    <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-emerald-600" />
                      Credit Utilization
                    </h3>
                    <div className="relative">
                      <div className="w-full h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-6xl font-black mb-2 ${getUtilizationColor(creditStats.utilization)}`}>
                            {creditStats.utilization.toFixed(1)}%
                          </div>
                          <p className="text-gray-600 text-sm">
                            {creditStats.utilization < 30 
                              ? 'Excellent utilization! Keep it up! 🎉' 
                              : creditStats.utilization < 50 
                              ? 'Good utilization' 
                              : 'Consider paying down balances'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Used</span>
                          <span className="font-bold">${creditStats.totalBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available</span>
                          <span className="font-bold text-green-600">${creditStats.availableCredit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Score Factors */}
                  {creditScore && (
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-600" />
                        Credit Score Factors
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(creditScore.factors).map(([factor, value]) => (
                          <div key={factor}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-bold text-gray-700 capitalize">
                                {factor.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-black text-gray-800">{value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'accounts' && (
              <motion.div
                key="accounts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {/* Add Account Button */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(!showAddForm);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      showAddForm
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-lg'
                    }`}
                  >
                    {showAddForm ? (
                      <>
                        <X className="w-5 h-5" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {ageGroup === 'kids' ? 'Add Account 💳' : 'Add Credit Account'}
                      </>
                    )}
                  </button>
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          {editingAccountId ? (
                            <>
                              <Edit2 className="w-6 h-6 text-emerald-600" />
                              Edit Credit Account
                            </>
                          ) : (
                            <>
                              <Plus className="w-6 h-6 text-emerald-600" />
                              Add New Credit Account
                            </>
                          )}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Account Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                              placeholder={ageGroup === 'kids' ? "e.g., My Savings Card 🎯" : "e.g., Chase Freedom"}
                              value={newAccount.name}
                              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Account Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                              value={newAccount.type}
                              onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                            >
                              {config.accountTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Credit Limit <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="0.00"
                                value={newAccount.creditLimit}
                                onChange={(e) => setNewAccount({ ...newAccount, creditLimit: e.target.value })}
                                min={config.minCreditLimit}
                                max={config.maxCreditLimit}
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Current Balance
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="0.00"
                                value={newAccount.currentBalance}
                                onChange={(e) => setNewAccount({ ...newAccount, currentBalance: e.target.value })}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          {config.showAdvanced && (
                            <>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Interest Rate (%)
                                </label>
                                <input
                                  type="number"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                  placeholder="0.00"
                                  value={newAccount.interestRate}
                                  onChange={(e) => setNewAccount({ ...newAccount, interestRate: e.target.value })}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Payment Due Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                  value={newAccount.dueDate}
                                  onChange={(e) => setNewAccount({ ...newAccount, dueDate: e.target.value })}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Minimum Payment
                                </label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input
                                    type="number"
                                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    value={newAccount.minimumPayment}
                                    onChange={(e) => setNewAccount({ ...newAccount, minimumPayment: e.target.value })}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Notes (optional)
                                </label>
                                <textarea
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                  placeholder="Additional details..."
                                  rows="3"
                                  value={newAccount.notes}
                                  onChange={(e) => setNewAccount({ ...newAccount, notes: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            onClick={resetForm}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveAccount}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                              ageGroup === 'kids'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                                : ageGroup === 'teens'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                                : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600'
                            }`}
                          >
                            <Check className="w-5 h-5" />
                            {editingAccountId ? 'Update Account' : 'Save Account'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Accounts List */}
                {creditAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {creditAccounts.map((account, index) => {
                      const utilization = account.creditLimit > 0 
                        ? (account.currentBalance / account.creditLimit) * 100 
                        : 0;
                      return (
                        <motion.div
                          key={account._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-gray-800">{account.name}</h3>
                              <p className="text-gray-600">{account.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditAccount(account)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Edit account"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAccount(account._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                              <p className="font-black text-gray-800">
                                ${account.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                              <p className="font-black text-red-600">
                                ${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Available</p>
                              <p className="font-black text-green-600">
                                ${(account.creditLimit - account.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Utilization</p>
                              <p className={`font-black ${getUtilizationColor(utilization)}`}>
                                {utilization.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div
                              className={`h-3 rounded-full ${
                                utilization < 30 ? 'bg-green-500' :
                                utilization < 50 ? 'bg-yellow-500' :
                                utilization < 70 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, utilization)}%` }}
                            />
                          </div>

                          {config.showAdvanced && account.minimumPayment > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Minimum Payment Due</span>
                              <span className="font-black text-gray-800">
                                ${account.minimumPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No Credit Accounts Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {ageGroup === 'kids' 
                        ? "Add your first account to start learning about credit! 🚀"
                        : "Add your first credit account to start tracking!"}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className={`px-8 py-4 rounded-xl font-black text-lg inline-flex items-center gap-2 ${
                        ageGroup === 'kids'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                      Add Account
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tips' && config.showAdvanced && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className={`rounded-2xl shadow-lg overflow-hidden ${
                  ageGroup === 'kids' 
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200' :
                    ageGroup === 'teens'
                    ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200'
                    : 'bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-200'
                }`}>
                  <div className="p-6">
                    <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-xl">
                      <Lightbulb className={`w-6 h-6 ${
                        ageGroup === 'kids' ? 'text-pink-600' :
                        ageGroup === 'teens' ? 'text-blue-600' :
                        'text-emerald-600'
                      }`} />
                      Credit Improvement Tips
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      {ageGroup === 'teens' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Pay on time:</strong> Always pay at least the minimum payment by the due date</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Keep balances low:</strong> Try to use less than 30% of your available credit</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Don't close old accounts:</strong> Longer credit history helps your score</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Limit new applications:</strong> Too many credit inquiries can lower your score</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Payment History (35%):</strong> Make all payments on time. Set up automatic payments to avoid missing due dates.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Credit Utilization (30%):</strong> Keep your credit card balances below 30% of your credit limits. Lower is better.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Credit Age (15%):</strong> Keep older accounts open. The longer your credit history, the better.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Credit Mix (10%):</strong> Having different types of credit (cards, loans) can help, but don't open accounts just for this.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>New Credit (10%):</strong> Limit hard inquiries. Only apply for credit when you really need it.</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditManagement;

