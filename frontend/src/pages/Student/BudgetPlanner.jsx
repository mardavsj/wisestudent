import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; //eslint-disable-line
import {
  ArrowLeft, Plus, Trash2, Edit2, Save, PieChart, DollarSign,
  ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown,
  Target, AlertCircle, CheckCircle2, Info, Lightbulb, Wallet,
  CreditCard, Calendar, BarChart3, Sparkles, Zap, X, Check,
  Receipt, PiggyBank, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from '../../components/LanguageSelector';
import { fetchBudgetData, saveBudgetData } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const BudgetPlanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('tools');
  const tt = (key, defaultValue, options = {}) =>
    t(`financial-literacy.budget-planner.${key}`, { defaultValue, ...options });
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [budgetPeriod, setBudgetPeriod] = useState('monthly'); // 'weekly', 'monthly', 'yearly'

  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    notes: '',
  });

  const [newExpense, setNewExpense] = useState({
    category: '',
    name: '',
    amount: '',
    frequency: 'monthly',
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
        incomeSources: ['Allowance', 'Gift Money', 'Chores', 'Birthday Money', 'Other'],
        expenseCategories: ['Toys', 'Games', 'Snacks', 'Books', 'Activities', 'Savings', 'Other'],
        icons: ['🧸', '🎮', '🍕', '📚', '🎨', '🐷', '🎯'],
        colors: ['pink', 'purple', 'orange', 'blue', 'green', 'yellow', 'red'],
        frequencies: ['weekly', 'monthly'],
        minAmount: 0.01,
        maxAmount: 1000,
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
      };
    } else if (ageGroup === 'teens') {
      return {
        incomeSources: ['Allowance', 'Part-time Job', 'Gift Money', 'Odd Jobs', 'Other'],
        expenseCategories: ['Food', 'Entertainment', 'Clothing', 'Transportation', 'Education', 'Personal', 'Savings', 'Other'],
        icons: ['🍔', '🎬', '👕', '🚌', '📚', '💄', '💰', '🎯'],
        colors: ['red', 'purple', 'blue', 'green', 'yellow', 'pink', 'emerald', 'orange'],
        frequencies: ['weekly', 'bi-weekly', 'monthly'],
        minAmount: 0.01,
        maxAmount: 10000,
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
      };
    } else {
      return {
        incomeSources: ['Salary', 'Freelance', 'Investment', 'Rental', 'Business', 'Other'],
        expenseCategories: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Education', 'Shopping', 'Personal', 'Savings', 'Other'],
        icons: ['🍔', '🚗', '🎬', '💡', '🏠', '🏥', '📚', '🛍️', '💄', '💰', '🎯'],
        colors: ['red', 'blue', 'purple', 'yellow', 'green', 'pink', 'orange', 'cyan', 'indigo', 'emerald', 'gray'],
        frequencies: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
        minAmount: 0.01,
        maxAmount: 1000000,
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
      };
    }
  }, [ageGroup]);

  // Load budget data on mount
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const data = await fetchBudgetData();
        if (data) {
          if (data.incomes && Array.isArray(data.incomes)) {
            setIncomes(data.incomes);
          }
          if (data.expenses && Array.isArray(data.expenses)) {
            setExpenses(data.expenses);
          }
        } else {
          // Fallback to localStorage
          const savedBudget = localStorage.getItem('budgetData');
          if (savedBudget) {
            const parsed = JSON.parse(savedBudget);
            setIncomes(parsed.incomes || []);
            setExpenses(parsed.expenses || []);
          }
        }

        logActivity({
          activityType: 'page_view',
          description: 'Viewed budget planner',
          metadata: {
            page: '/student/finance/budget-planner',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading budget data:', error);
        // Fallback to localStorage
        const savedBudget = localStorage.getItem('budgetData');
        if (savedBudget) {
          const parsed = JSON.parse(savedBudget);
          setIncomes(parsed.incomes || []);
          setExpenses(parsed.expenses || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [ageGroup]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      const timer = setTimeout(async () => {
        try {
          await saveBudgetData({ incomes, expenses });
          localStorage.setItem('budgetData', JSON.stringify({ incomes, expenses }));
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
          // Fallback to localStorage
          localStorage.setItem('budgetData', JSON.stringify({ incomes, expenses }));
        }
      }, 2000);

      setAutoSaveTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [incomes, expenses, hasUnsavedChanges, autoSaveTimer]);

  const getFrequencyMultiplier = (frequency, period) => {
    const multipliers = {
      weekly: { weekly: 1, monthly: 4.33, yearly: 52 },
      'bi-weekly': { weekly: 0.5, monthly: 2.17, yearly: 26 },
      monthly: { weekly: 0.23, monthly: 1, yearly: 12 },
      quarterly: { weekly: 0.077, monthly: 0.33, yearly: 4 },
      yearly: { weekly: 0.019, monthly: 0.083, yearly: 1 },
    };
    return multipliers[frequency]?.[period] || 1;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = incomes.reduce((sum, inc) => {
      const amount = parseFloat(inc.amount) || 0;
      const multiplier = getFrequencyMultiplier(inc.frequency || 'monthly', budgetPeriod);
      return sum + (amount * multiplier);
    }, 0);

    const totalExpenses = expenses.reduce((sum, exp) => {
      const amount = parseFloat(exp.amount) || 0;
      const multiplier = getFrequencyMultiplier(exp.frequency || 'monthly', budgetPeriod);
      return sum + (amount * multiplier);
    }, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    const categoryTotals = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      const amount = parseFloat(exp.amount) || 0;
      const multiplier = getFrequencyMultiplier(exp.frequency || 'monthly', budgetPeriod);
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (amount * multiplier);
    });

    const topExpenseCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      expenseRatio,
      categoryTotals,
      topExpenseCategory,
    };
  }, [incomes, expenses, budgetPeriod]);

  // Handle income
  const handleSaveIncome = () => {
    if (!newIncome.name || !newIncome.amount) {
      toast.error(tt('toasts.requiredFields', 'Please fill in all required fields'));
      return;
    }

    const amount = parseFloat(newIncome.amount);
    if (isNaN(amount) || amount < config.minAmount || amount > config.maxAmount) {
      toast.error(tt('toasts.amountRange', 'Amount must be between ${{min}} and ${{max}}', { min: config.minAmount, max: config.maxAmount.toLocaleString() }));
      return;
    }

    try {
      let updatedIncomes;
      const incomeData = {
        ...newIncome,
        amount: amount,
        createdAt: editingIncomeId
          ? incomes.find(i => i._id === editingIncomeId)?.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingIncomeId) {
        updatedIncomes = incomes.map((inc) =>
          inc._id === editingIncomeId ? { ...inc, ...incomeData, _id: inc._id } : inc
        );
        toast.success('Income updated successfully!');
      } else {
        const newId = `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updatedIncomes = [...incomes, { ...incomeData, _id: newId }];
        toast.success('Income added successfully! 💰');
      }

      setIncomes(updatedIncomes);
      setHasUnsavedChanges(true);
      resetIncomeForm();
    } catch (error) {
      console.error('Error saving income:', error);
      toast.error(tt('toasts.saveIncomeFailed', 'Failed to save income'));
    }
  };

  const resetIncomeForm = () => {
    setNewIncome({
      name: '',
      amount: '',
      frequency: 'monthly',
      notes: '',
    });
    setEditingIncomeId(null);
    setShowIncomeForm(false);
  };

  const handleEditIncome = (income) => {
    setNewIncome({
      name: income.name || '',
      amount: income.amount || '',
      frequency: income.frequency || 'monthly',
      notes: income.notes || '',
    });
    setEditingIncomeId(income._id);
    setShowIncomeForm(true);
  };

  const handleDeleteIncome = (id) => {
    if (!window.confirm('Are you sure you want to delete this income source?')) return;
    setIncomes(incomes.filter((inc) => inc._id !== id));
    setHasUnsavedChanges(true);
    toast.success('Income deleted successfully');
  };

  // Handle expenses
  const handleSaveExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category) {
      toast.error(tt('toasts.requiredFields', 'Please fill in all required fields'));
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount < config.minAmount || amount > config.maxAmount) {
      toast.error(tt('toasts.amountRange', 'Amount must be between ${{min}} and ${{max}}', { min: config.minAmount, max: config.maxAmount.toLocaleString() }));
      return;
    }

    try {
      let updatedExpenses;
      const expenseData = {
        ...newExpense,
        amount: amount,
        createdAt: editingExpenseId
          ? expenses.find(e => e._id === editingExpenseId)?.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingExpenseId) {
        updatedExpenses = expenses.map((exp) =>
          exp._id === editingExpenseId ? { ...exp, ...expenseData, _id: exp._id } : exp
        );
        toast.success('Expense updated successfully!');
      } else {
        const newId = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updatedExpenses = [...expenses, { ...expenseData, _id: newId }];
        toast.success('Expense added successfully! 💸');
      }

      setExpenses(updatedExpenses);
      setHasUnsavedChanges(true);
      resetExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error(tt('toasts.saveExpenseFailed', 'Failed to save expense'));
    }
  };

  const resetExpenseForm = () => {
    setNewExpense({
      category: config.expenseCategories[0],
      name: '',
      amount: '',
      frequency: 'monthly',
      notes: '',
    });
    setEditingExpenseId(null);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (expense) => {
    setNewExpense({
      category: expense.category || config.expenseCategories[0],
      name: expense.name || '',
      amount: expense.amount || '',
      frequency: expense.frequency || 'monthly',
      notes: expense.notes || '',
    });
    setEditingExpenseId(expense._id);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setExpenses(expenses.filter((exp) => exp._id !== id));
    setHasUnsavedChanges(true);
    toast.success('Expense deleted successfully');
  };

  const handleSaveBudget = async () => {
    try {
      await saveBudgetData({ incomes, expenses });
      localStorage.setItem('budgetData', JSON.stringify({ incomes, expenses }));
      setHasUnsavedChanges(false);
      toast.success('Budget saved successfully! 💾');

      logActivity({
        activityType: 'financial_action',
        description: 'Saved budget plan',
        metadata: {
          action: 'save_budget',
          totalIncome: stats.totalIncome,
          totalExpenses: stats.totalExpenses,
          balance: stats.balance,
          incomeCount: incomes.length,
          expenseCount: expenses.length,
          ageGroup,
          timestamp: new Date().toISOString(),
        },
        pageUrl: window.location.pathname,
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      // Fallback to localStorage
      localStorage.setItem('budgetData', JSON.stringify({ incomes, expenses }));
      toast.success('Budget saved locally! 💾');
    }
  };

  const getCategoryIcon = (category) => {
    const index = config.expenseCategories.indexOf(category);
    return index >= 0 ? config.icons[index] : '🎯';
  };

  const getCategoryColor = (category) => {
    const index = config.expenseCategories.indexOf(category);
    const colorMap = {
      pink: 'bg-pink-100 text-pink-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      gray: 'bg-gray-100 text-gray-600',
      emerald: 'bg-emerald-100 text-emerald-600',
    };
    return colorMap[config.colors[index]] || 'bg-gray-100 text-gray-600';
  };

  const getMotivationalMessage = () => {
    if (stats.balance > 0) {
      if (ageGroup === 'kids') {
        return "Great job! You have money left to save! 🎉";
      } else if (ageGroup === 'teens') {
        return "Excellent! You're living within your means! 💪";
      } else {
        return "Well done! Your budget is balanced with surplus! 📈";
      }
    } else if (stats.balance < 0) {
      if (ageGroup === 'kids') {
        return "Oops! You're spending more than you have. Try to save more! 💡";
      } else if (ageGroup === 'teens') {
        return "You're over budget. Consider reducing expenses or increasing income.";
      } else {
        return "Budget deficit detected. Review expenses and optimize spending.";
      }
    } else {
      return "Perfect balance! Your income equals expenses.";
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
        ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
          'from-gray-50 via-white to-slate-50'
        } flex items-center justify-center`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 ${ageGroup === 'kids' ? 'border-pink-500' :
              ageGroup === 'teens' ? 'border-blue-500' :
                'border-green-500'
              } border-t-transparent rounded-full mx-auto mb-4`}
          />
          <p className="text-gray-600">{tt('loading', 'Loading your budget...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
      ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
        'from-gray-50 via-white to-slate-50'
      } p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate('/student/dashboard/financial-literacy')}
              className="flex items-center text-green-600 hover:text-green-800 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {tt('backButton', 'Back to Financial Literacy')}
            </button>
            <LanguageSelector />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${ageGroup === 'kids' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight' :
                ageGroup === 'teens' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight' :
                  'text-gray-900'
                }`}>
                {ageGroup === 'kids' && '💰 '}
                {tt('title', 'Budget Planner')}
                {ageGroup === 'kids' && ' 💰'}
              </h1>
              <p className={`text-lg ${ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                {ageGroup === 'kids' && tt('subtitle.kids', 'Plan your money! 🎯')}
                {ageGroup === 'teens' && tt('subtitle.teens', 'Create and manage your personal budget')}
                {ageGroup === 'adults' && tt('subtitle.adults', 'Plan your finances with precision and insight')}
              </p>
            </div>

            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Auto-saving...
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Budget Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="p-3 rounded-xl bg-green-100 mb-2">
              <ArrowDownCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{incomes.length} source{incomes.length !== 1 ? 's' : ''}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="p-3 rounded-xl bg-red-100 mb-2">
              <ArrowUpCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${stats.balance >= 0 ? 'border-green-500' : 'border-red-500'
              }`}
          >
            <div className={`p-3 rounded-xl mb-2 ${stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
              <DollarSign className={`w-6 h-6 ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Balance</p>
            <p className={`text-3xl font-black ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-1 ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              {stats.balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="p-3 rounded-xl bg-blue-100 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
            <p className={`text-3xl font-black ${stats.savingsRate >= 20 ? 'text-green-600' :
              stats.savingsRate >= 10 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
              {stats.savingsRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.savingsRate >= 20 ? 'Excellent! ⭐' :
                stats.savingsRate >= 10 ? 'Good! 👍' :
                  'Needs improvement'}
            </p>
          </motion.div>
        </motion.div>

        {/* Budget Period Selector */}
        {config.showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-bold text-gray-700">Budget Period:</span>
              <select
                value={budgetPeriod}
                onChange={(e) => setBudgetPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button
              onClick={handleSaveBudget}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Budget
            </button>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg mb-6"
        >
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-black text-sm transition-all ${activeTab === 'overview'
                ? ageGroup === 'kids'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-green-600 border-b-4 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-6 py-4 font-black text-sm transition-all ${activeTab === 'income'
                ? ageGroup === 'kids'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-green-600 border-b-4 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <ArrowDownCircle className="w-5 h-5 inline mr-2" />
              Income
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-6 py-4 font-black text-sm transition-all ${activeTab === 'expenses'
                ? ageGroup === 'kids'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-green-600 border-b-4 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <ArrowUpCircle className="w-5 h-5 inline mr-2" />
              Expenses
            </button>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Expense Breakdown */}
                  <div>
                    <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-indigo-600" />
                      Expense Breakdown
                    </h2>
                    {Object.keys(stats.categoryTotals).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(stats.categoryTotals)
                          .sort((a, b) => b[1] - a[1])
                          .map(([category, total]) => {
                            const percentage = stats.totalExpenses > 0
                              ? (total / stats.totalExpenses * 100).toFixed(1)
                              : 0;
                            const categoryIndex = config.expenseCategories.indexOf(category);
                            return (
                              <div key={category}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{config.icons[categoryIndex] || '🎯'}</span>
                                    <span className="font-bold text-gray-700">{category}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-black text-gray-800">
                                      ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full ${categoryIndex >= 0 && config.colors[categoryIndex] === 'red' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                      categoryIndex >= 0 && config.colors[categoryIndex] === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                                        categoryIndex >= 0 && config.colors[categoryIndex] === 'green' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                          categoryIndex >= 0 && config.colors[categoryIndex] === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
                                            categoryIndex >= 0 && config.colors[categoryIndex] === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                              categoryIndex >= 0 && config.colors[categoryIndex] === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                                categoryIndex >= 0 && config.colors[categoryIndex] === 'pink' ? 'bg-gradient-to-r from-pink-500 to-pink-400' :
                                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                                    'bg-gradient-to-r from-indigo-500 to-indigo-400'
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No expenses added yet</p>
                      </div>
                    )}
                  </div>

                  {/* Budget Insights */}
                  <div>
                    <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                      Budget Insights
                    </h2>
                    <div className={`rounded-2xl p-6 mb-6 ${stats.balance >= 0
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                      : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
                      }`}>
                      <div className="flex items-start gap-3 mb-4">
                        {stats.balance >= 0 ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <h3 className="font-black text-gray-800 mb-2">
                            {stats.balance >= 0 ? 'Budget Status: Healthy ✅' : 'Budget Status: Over Budget ⚠️'}
                          </h3>
                          <p className="text-gray-700 mb-4">{getMotivationalMessage()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-gray-600">Expense Ratio</span>
                          <span className={`font-black ${stats.expenseRatio <= 80 ? 'text-green-600' :
                            stats.expenseRatio <= 95 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                            {stats.expenseRatio.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${stats.expenseRatio <= 80 ? 'bg-green-500' :
                              stats.expenseRatio <= 95 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                            style={{ width: `${Math.min(100, stats.expenseRatio)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {stats.expenseRatio <= 80
                            ? 'Great! You\'re spending less than 80% of income'
                            : stats.expenseRatio <= 95
                              ? 'Good, but try to reduce expenses'
                              : 'Warning: Spending exceeds 95% of income'}
                        </p>
                      </div>

                      {stats.topExpenseCategory && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                          <p className="text-sm font-bold text-gray-600 mb-1">Top Spending Category</p>
                          <p className="text-lg font-black text-gray-800">
                            {stats.topExpenseCategory[0]} - ${stats.topExpenseCategory[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}

                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-bold text-gray-600 mb-2">Savings Recommendation</p>
                        <p className="text-sm text-gray-700">
                          {ageGroup === 'kids'
                            ? "Try to save at least 10% of your money! 🐷"
                            : ageGroup === 'teens'
                              ? "Aim to save 20% of your income for future goals."
                              : "Financial experts recommend saving 20-30% of income for long-term financial security."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'income' && (
              <motion.div
                key="income"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                    <ArrowDownCircle className="w-6 h-6 text-green-600" />
                    Income Sources
                  </h2>
                  <button
                    onClick={() => {
                      resetIncomeForm();
                      setShowIncomeForm(!showIncomeForm);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${showIncomeForm
                      ? 'bg-gray-200 text-gray-700'
                      : ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}
                  >
                    {showIncomeForm ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Income
                      </>
                    )}
                  </button>
                </div>

                {/* Add Income Form */}
                <AnimatePresence>
                  {showIncomeForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-green-200">
                        <h3 className="text-lg font-black mb-4">
                          {editingIncomeId ? 'Edit Income Source' : 'Add New Income Source'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Source Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={ageGroup === 'kids' ? "e.g., Allowance 🎁" : "e.g., Salary"}
                              value={newIncome.name}
                              onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="0.00"
                                value={newIncome.amount}
                                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                                min={config.minAmount}
                                max={config.maxAmount}
                                step="0.01"
                              />
                            </div>
                          </div>
                          {config.showAdvanced && (
                            <>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Frequency
                                </label>
                                <select
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  value={newIncome.frequency}
                                  onChange={(e) => setNewIncome({ ...newIncome, frequency: e.target.value })}
                                >
                                  {config.frequencies.map(freq => (
                                    <option key={freq} value={freq}>
                                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Notes (optional)
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="Additional details..."
                                  value={newIncome.notes}
                                  onChange={(e) => setNewIncome({ ...newIncome, notes: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={resetIncomeForm}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveIncome}
                            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${ageGroup === 'kids'
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                              : ageGroup === 'teens'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              }`}
                          >
                            <Check className="w-4 h-4" />
                            {editingIncomeId ? 'Update' : 'Add Income'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Income List */}
                {incomes.length > 0 ? (
                  <div className="space-y-3">
                    {incomes.map((income, index) => {
                      const amount = parseFloat(income.amount) || 0;
                      const multiplier = getFrequencyMultiplier(income.frequency || 'monthly', budgetPeriod);
                      const adjustedAmount = amount * multiplier;

                      return (
                        <motion.div
                          key={income._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <ArrowDownCircle className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-black text-gray-800">{income.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  {config.showAdvanced && (
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold">
                                      {income.frequency || 'monthly'}
                                    </span>
                                  )}
                                  <span className="text-green-600 font-bold">
                                    = ${adjustedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/{budgetPeriod}
                                  </span>
                                </div>
                                {income.notes && config.showAdvanced && (
                                  <p className="text-xs text-gray-400 mt-1">{income.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditIncome(income)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteIncome(income._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-black text-gray-800 mb-2">No Income Sources Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {ageGroup === 'kids'
                        ? "Add your allowance or gift money to start planning! 🎁"
                        : "Add your income sources to create a budget!"}
                    </p>
                    <button
                      onClick={() => {
                        resetIncomeForm();
                        setShowIncomeForm(true);
                      }}
                      className={`px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 ${ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        }`}
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Income
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                    <ArrowUpCircle className="w-6 h-6 text-red-600" />
                    Expenses
                  </h2>
                  <button
                    onClick={() => {
                      resetExpenseForm();
                      setShowExpenseForm(!showExpenseForm);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${showExpenseForm
                      ? 'bg-gray-200 text-gray-700'
                      : ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      }`}
                  >
                    {showExpenseForm ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Expense
                      </>
                    )}
                  </button>
                </div>

                {/* Add Expense Form */}
                <AnimatePresence>
                  {showExpenseForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-red-200">
                        <h3 className="text-lg font-black mb-4">
                          {editingExpenseId ? 'Edit Expense' : 'Add New Expense'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              value={newExpense.category}
                              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            >
                              <option value="">Select category</option>
                              {config.expenseCategories.map((category, index) => (
                                <option key={category} value={category}>
                                  {config.icons[index]} {category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Expense Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={ageGroup === 'kids' ? "e.g., New Toy 🧸" : "e.g., Groceries"}
                              value={newExpense.name}
                              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="number"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="0.00"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                min={config.minAmount}
                                max={config.maxAmount}
                                step="0.01"
                              />
                            </div>
                          </div>
                          {config.showAdvanced && (
                            <>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Frequency
                                </label>
                                <select
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  value={newExpense.frequency}
                                  onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value })}
                                >
                                  {config.frequencies.map(freq => (
                                    <option key={freq} value={freq}>
                                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Notes (optional)
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder="Additional details..."
                                  value={newExpense.notes}
                                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={resetExpenseForm}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveExpense}
                            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${ageGroup === 'kids'
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                              : ageGroup === 'teens'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                              }`}
                          >
                            <Check className="w-4 h-4" />
                            {editingExpenseId ? 'Update' : 'Add Expense'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expenses List */}
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.map((expense, index) => {
                      const amount = parseFloat(expense.amount) || 0;
                      const multiplier = getFrequencyMultiplier(expense.frequency || 'monthly', budgetPeriod);
                      const adjustedAmount = amount * multiplier;

                      return (
                        <motion.div
                          key={expense._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl ${getCategoryColor(expense.category)} flex items-center justify-center text-2xl`}>
                                {getCategoryIcon(expense.category)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-black text-gray-800">{expense.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(expense.category)}`}>
                                    {expense.category}
                                  </span>
                                  <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  {config.showAdvanced && (
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold">
                                      {expense.frequency || 'monthly'}
                                    </span>
                                  )}
                                  <span className="text-red-600 font-bold">
                                    = ${adjustedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/{budgetPeriod}
                                  </span>
                                </div>
                                {expense.notes && config.showAdvanced && (
                                  <p className="text-xs text-gray-400 mt-1">{expense.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditExpense(expense)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(expense._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-black text-gray-800 mb-2">No Expenses Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {ageGroup === 'kids'
                        ? "Add your expenses to see where your money goes! 💸"
                        : "Add your planned expenses to create a complete budget!"}
                    </p>
                    <button
                      onClick={() => {
                        resetExpenseForm();
                        setShowExpenseForm(true);
                      }}
                      className={`px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 ${ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : ageGroup === 'teens'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        }`}
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Save Button (if not in advanced mode) */}
        {!config.showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 flex justify-end"
          >
            <button
              onClick={handleSaveBudget}
              className={`px-8 py-4 rounded-xl font-black text-lg flex items-center gap-2 shadow-lg transition-all ${ageGroup === 'kids'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                : ageGroup === 'teens'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
            >
              <Save className="w-6 h-6" />
              Save Budget
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
