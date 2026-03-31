import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Trash2, Edit2, DollarSign, PieChart, BarChart3, 
  Calendar, Filter, Download, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, Info, Clock, Receipt, ShoppingCart, CreditCard,
  Wallet, Target, Lightbulb, Sparkles, Zap, History, X, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from '../../components/LanguageSelector';
import { fetchExpenses, saveExpenses, deleteExpense } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('tools');
  const tt = (key, defaultValue, options = {}) =>
    t(`financial-literacy.expense-tracker.${key}`, { defaultValue, ...options });
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [budget, setBudget] = useState(null);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
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
        categories: ['Toys', 'Games', 'Snacks', 'Books', 'Activities', 'Other'],
        icons: ['🧸', '🎮', '🍕', '📚', '🎨', '🎯'],
        colors: ['pink', 'purple', 'orange', 'blue', 'green', 'yellow'],
        paymentMethods: ['Cash', 'Piggy Bank'],
        minAmount: 0.01,
        maxAmount: 100,
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
        showBudget: false,
      };
    } else if (ageGroup === 'teens') {
      return {
        categories: ['Food', 'Entertainment', 'Clothing', 'Transportation', 'Education', 'Personal', 'Other'],
        icons: ['🍔', '🎬', '👕', '🚌', '📚', '💄', '🎯'],
        colors: ['red', 'purple', 'blue', 'green', 'yellow', 'pink', 'orange'],
        paymentMethods: ['Cash', 'Debit Card', 'Mobile Payment', 'Other'],
        minAmount: 0.01,
        maxAmount: 1000,
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
        showBudget: true,
      };
    } else {
      return {
        categories: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Education', 'Shopping', 'Personal', 'Other'],
        icons: ['🍔', '🚗', '🎬', '💡', '🏠', '🏥', '📚', '🛍️', '💄', '🎯'],
        colors: ['red', 'blue', 'purple', 'yellow', 'green', 'pink', 'orange', 'cyan', 'indigo', 'gray'],
        paymentMethods: ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment', 'Bank Transfer', 'Other'],
        minAmount: 0.01,
        maxAmount: 100000,
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
        showBudget: true,
      };
    }
  }, [ageGroup]);

  // Load expenses on mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        const data = await fetchExpenses();
        if (data && Array.isArray(data)) {
          setExpenses(data);
        } else {
          // Fallback to localStorage
          const savedExpenses = localStorage.getItem('expenses');
          if (savedExpenses) {
            setExpenses(JSON.parse(savedExpenses));
          } else {
            setExpenses([]);
          }
        }

        // Load budget
        const savedBudget = localStorage.getItem('expenseBudget');
        if (savedBudget) {
          setBudget(JSON.parse(savedBudget));
        }

        logActivity({
          activityType: 'page_view',
          description: 'Viewed expense tracker',
          metadata: {
            page: '/student/finance/expense-tracker',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading expenses:', error);
        // Fallback to localStorage
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [ageGroup]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && expenses.length >= 0) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(async () => {
        try {
          await saveExpenses(expenses);
          localStorage.setItem('expenses', JSON.stringify(expenses));
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
          // Fallback to localStorage
          localStorage.setItem('expenses', JSON.stringify(expenses));
        }
      }, 2000);
      
      setAutoSaveTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [expenses, hasUnsavedChanges]);

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const dateInRange = expenseDate >= startDate && expenseDate <= endDate;
      
      if (filter === 'all') return dateInRange;
      return expense.category === filter && dateInRange;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'date':
        default:
          return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });

    return sorted;
  }, [expenses, filter, dateRange, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpenses = filteredAndSortedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const avgExpense = filteredAndSortedExpenses.length > 0 
      ? totalExpenses / filteredAndSortedExpenses.length 
      : 0;
    
    const categoryTotals = {};
    filteredAndSortedExpenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (exp.amount || 0);
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    const today = new Date();
    const todayExpenses = filteredAndSortedExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.toDateString() === today.toDateString();
    });
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthExpenses = filteredAndSortedExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
    });
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const budgetRemaining = budget ? budget.amount - monthTotal : null;
    const budgetPercentage = budget && budget.amount > 0 
      ? Math.round((monthTotal / budget.amount) * 100) 
      : null;

    return {
      totalExpenses,
      avgExpense,
      categoryTotals,
      topCategory,
      todayTotal,
      monthTotal,
      budgetRemaining,
      budgetPercentage,
      expenseCount: filteredAndSortedExpenses.length,
    };
  }, [filteredAndSortedExpenses, budget]);

  // Handle add/edit expense
  const handleSaveExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
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
        logActivity({
          activityType: 'financial_action',
          description: 'Updated expense',
          metadata: {
            action: 'update_expense',
            description: newExpense.description,
            amount: amount,
            category: newExpense.category,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } else {
        const newId = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updatedExpenses = [...expenses, { ...expenseData, _id: newId }];
        toast.success('Expense added successfully! 💰');
        logActivity({
          activityType: 'financial_action',
          description: 'Added expense',
          metadata: {
            action: 'add_expense',
            description: newExpense.description,
            amount: amount,
            category: newExpense.category,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }

      setExpenses(updatedExpenses);
      setHasUnsavedChanges(true);
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error(tt('toasts.saveFailed', 'Failed to save expense'));
    }
  };

  const resetForm = () => {
    setNewExpense({
      description: '',
      amount: '',
      category: config.categories[0],
      date: new Date().toISOString().split('T')[0],
      paymentMethod: config.paymentMethods[0],
      notes: '',
    });
    setEditingExpenseId(null);
    setShowAddForm(false);
  };

  const handleEditExpense = (expense) => {
    setNewExpense({
      description: expense.description || '',
      amount: expense.amount || '',
      category: expense.category || config.categories[0],
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || config.paymentMethods[0],
      notes: expense.notes || '',
    });
    setEditingExpenseId(expense._id);
    setShowAddForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      setHasUnsavedChanges(true);
      toast.success('Expense deleted successfully');
      
      const deletedExpense = expenses.find((exp) => exp._id === id);
      if (deletedExpense) {
        logActivity({
          activityType: 'financial_action',
          description: 'Deleted expense',
          metadata: {
            action: 'delete_expense',
            description: deletedExpense.description,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      // Still remove from local state
      setExpenses(expenses.filter((exp) => exp._id !== id));
      localStorage.setItem('expenses', JSON.stringify(expenses.filter((exp) => exp._id !== id)));
      toast.success('Expense deleted successfully');
    }
  };

  const handleSetBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (!budgetAmount || isNaN(amount) || amount <= 0) {
      toast.error(tt('toasts.validAmount', 'Please enter a valid amount'));
      return;
    }

    const budgetData = {
      amount,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    };
    setBudget(budgetData);
    localStorage.setItem('expenseBudget', JSON.stringify(budgetData));
    setShowBudgetInput(false);
    setBudgetAmount('');
    toast.success('Budget set successfully!');
    setHasUnsavedChanges(true);
  };

  const handleEditBudget = () => {
    setBudgetAmount(budget ? budget.amount.toString() : '');
    setShowBudgetInput(true);
  };

  const handleCancelBudget = () => {
    setShowBudgetInput(false);
    setBudgetAmount('');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method'];
    const csvData = filteredAndSortedExpenses.map(expense => [
      expense.date,
      expense.description,
      expense.category,
      expense.amount,
      expense.paymentMethod || 'Cash'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Expense report exported successfully! 📊');
    
    logActivity({
      activityType: 'financial_action',
      description: 'Exported expense report',
      metadata: {
        action: 'export_expenses',
        fileName,
        expenseCount: filteredAndSortedExpenses.length,
        totalAmount: stats.totalExpenses,
        ageGroup,
        timestamp: new Date().toISOString(),
      },
      pageUrl: window.location.pathname,
    });
  };

  const getCategoryIcon = (category) => {
    const index = config.categories.indexOf(category);
    return index >= 0 ? config.icons[index] : '🎯';
  };

  const getCategoryColor = (category) => {
    const index = config.categories.indexOf(category);
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
    };
    return colorMap[config.colors[index]] || 'bg-gray-100 text-gray-600';
  };

  const getMotivationalMessage = () => {
    if (ageGroup === 'kids') {
      const messages = [
        "Great job tracking your spending! 🌟",
        "You're learning to be smart with money! 💰",
        "Keep tracking, you're doing awesome! ⭐",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (ageGroup === 'teens') {
      const messages = [
        "Tracking expenses helps you make better choices! 💡",
        "You're building great financial habits! 📊",
        "Knowledge of spending leads to smart saving! 🎯",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        "Financial awareness is the first step to wealth! 💼",
        "Track every expense to optimize your budget! 📈",
        "Detailed tracking leads to better financial decisions! 💎",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
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
              'border-indigo-500'
            } border-t-transparent rounded-full mx-auto mb-4`}
          />
          <p className="text-gray-600">{tt('loading', 'Loading your expenses...')}</p>
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
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group"
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
                {ageGroup === 'kids' && '💰 '}
                {tt('title', 'Expense Tracker')}
                {ageGroup === 'kids' && ' 💰'}
              </h1>
              <p className={`text-lg ${
                ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {ageGroup === 'kids' && tt('subtitle.kids', 'Track what you spend! 🎯')}
                {ageGroup === 'teens' && tt('subtitle.teens', 'Track and manage your daily expenses')}
                {ageGroup === 'adults' && tt('subtitle.adults', 'Track and analyze your spending patterns')}
              </p>
            </div>
            
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Auto-saving...
              </motion.div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="p-3 rounded-xl bg-red-100 mb-2">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stats.expenseCount} transactions</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="p-3 rounded-xl bg-blue-100 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Today's Spending</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.todayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">This month: ${stats.monthTotal.toFixed(2)}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="p-3 rounded-xl bg-purple-100 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Average Expense</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {stats.topCategory && (
              <p className="text-xs text-gray-400 mt-1">
                Top: {stats.topCategory[0]} (${stats.topCategory[1].toFixed(2)})
              </p>
            )}
          </motion.div>

          {config.showBudget && (
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                stats.budgetPercentage !== null && stats.budgetPercentage > 90
                  ? 'border-red-500'
                  : stats.budgetPercentage !== null && stats.budgetPercentage > 75
                  ? 'border-yellow-500'
                  : 'border-green-500'
              }`}
            >
              <div className={`p-3 rounded-xl mb-2 ${
                stats.budgetPercentage !== null && stats.budgetPercentage > 90
                  ? 'bg-red-100'
                  : stats.budgetPercentage !== null && stats.budgetPercentage > 75
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}>
                <Target className={`w-6 h-6 ${
                  stats.budgetPercentage !== null && stats.budgetPercentage > 90
                    ? 'text-red-600'
                    : stats.budgetPercentage !== null && stats.budgetPercentage > 75
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
              </div>
              <p className="text-sm text-gray-500 mb-1">Budget Status</p>
              {showBudgetInput ? (
                <div className="space-y-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="Enter budget amount"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSetBudget}
                      className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelBudget}
                      className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : budget ? (
                <>
                  <p className="text-3xl font-black text-gray-800">
                    {stats.budgetPercentage !== null ? `${stats.budgetPercentage}%` : '0%'}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">
                      {stats.budgetRemaining !== null && stats.budgetRemaining >= 0
                        ? `$${stats.budgetRemaining.toFixed(2)} left`
                        : stats.budgetRemaining !== null
                        ? `$${Math.abs(stats.budgetRemaining).toFixed(2)} over`
                        : 'No budget set'}
                    </p>
                    <button
                      onClick={handleEditBudget}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                      title="Edit budget"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-400 mb-2">Not Set</p>
                  <button
                    onClick={() => setShowBudgetInput(true)}
                    className="w-full px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-all"
                  >
                    Set Budget
                  </button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3">
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
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
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
                  {ageGroup === 'kids' ? 'Add Expense 💰' : 'Add Expense'}
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {config.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {config.showAdvanced && (
              <>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="category">Sort by Category</option>
                </select>

                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  {viewMode === 'list' ? '🔲 Grid' : '📋 List'}
                </button>
              </>
            )}

            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

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
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  {editingExpenseId ? (
                    <>
                      <Edit2 className="w-6 h-6 text-indigo-600" />
                      Edit Expense
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-indigo-600" />
                      Add New Expense
                    </>
                  )}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder={ageGroup === 'kids' ? "e.g., Bought a toy 🧸" : "e.g., Grocery shopping"}
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
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
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        min={config.minAmount}
                        max={config.maxAmount}
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      {config.categories.map((category, index) => (
                        <option key={category} value={category}>
                          {config.icons[index]} {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {config.showAdvanced && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          value={newExpense.paymentMethod}
                          onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                        >
                          {config.paymentMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Notes (optional)
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Additional details..."
                          value={newExpense.notes}
                          onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
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
                    onClick={handleSaveExpense}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                      ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    {editingExpenseId ? 'Update Expense' : 'Save Expense'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expenses List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-600" />
                  Expenses
                  <span className="text-sm font-normal text-gray-500">({filteredAndSortedExpenses.length})</span>
                </h2>
              </div>

              {filteredAndSortedExpenses.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredAndSortedExpenses.map((expense, index) => (
                    <motion.div
                      key={expense._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl ${getCategoryColor(expense.category)} flex items-center justify-center text-2xl`}>
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{expense.description}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(expense.category)}`}>
                                {expense.category}
                              </span>
                              <span>{new Date(expense.date).toLocaleDateString()}</span>
                              {expense.paymentMethod && config.showAdvanced && (
                                <span className="flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  {expense.paymentMethod}
                                </span>
                              )}
                            </div>
                            {expense.notes && config.showAdvanced && (
                              <p className="text-xs text-gray-400 mt-1">{expense.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-black text-red-600">
                              ${(expense.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Edit expense"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="text-6xl mb-4"
                  >
                    {ageGroup === 'kids' ? '💰' : '📊'}
                  </motion.div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">
                    {ageGroup === 'kids' ? "No Expenses Yet!" : "No Expenses Found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {ageGroup === 'kids' 
                      ? "Start tracking your spending! Add your first expense! 🎉"
                      : ageGroup === 'teens'
                      ? "No expenses found for the selected filters. Add your first expense to start tracking!"
                      : "No expenses found for the selected date range and filters."}
                  </p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(true);
                    }}
                    className={`px-8 py-4 rounded-xl font-black text-lg inline-flex items-center gap-2 transition-all shadow-lg ${
                      ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    }`}
                  >
                    <Plus className="w-6 h-6" />
                    {ageGroup === 'kids' ? 'Add Your First Expense! 💰' : 'Add Your First Expense'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Sidebar - Summary & Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  Spending by Category
                </h2>
              </div>
              <div className="p-6">
                {Object.keys(stats.categoryTotals).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(stats.categoryTotals)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, total]) => {
                        const percentage = stats.totalExpenses > 0 
                          ? (total / stats.totalExpenses * 100).toFixed(1) 
                          : 0;
                        const categoryIndex = config.categories.indexOf(category);
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{config.icons[categoryIndex] || '🎯'}</span>
                                <span className="text-sm font-bold text-gray-700">{category}</span>
                              </div>
                              <span className="text-sm font-black text-gray-800">
                                ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'red' ? 'from-red-500 to-red-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'blue' ? 'from-blue-500 to-blue-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'green' ? 'from-green-500 to-green-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'purple' ? 'from-purple-500 to-purple-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'yellow' ? 'from-yellow-500 to-yellow-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'orange' ? 'from-orange-500 to-orange-400' :
                                  categoryIndex >= 0 && config.colors[categoryIndex] === 'pink' ? 'from-pink-500 to-pink-400' :
                                  'from-indigo-500 to-indigo-400'
                                }`}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{percentage}% of total</p>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No expenses to display</p>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className={`rounded-2xl shadow-lg overflow-hidden ${
              ageGroup === 'kids' 
                ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200' :
                ageGroup === 'teens'
                ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200'
                : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200'
            }`}>
              <div className="p-6">
                <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Lightbulb className={`w-5 h-5 ${
                    ageGroup === 'kids' ? 'text-pink-600' :
                    ageGroup === 'teens' ? 'text-blue-600' :
                    'text-indigo-600'
                  }`} />
                  {ageGroup === 'kids' ? 'Smart Spending Tips! 🌟' : 'Spending Tips'}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {ageGroup === 'kids' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Track every coin you spend! 🪙</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Think before you buy! 🤔</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Save some money for later! 🐷</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Ask yourself: Do I really need this? ❓</span>
                      </li>
                    </>
                  ) : ageGroup === 'teens' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Track all expenses, even small ones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Categorize to identify spending patterns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Set a monthly budget for each category</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Review expenses weekly to stay on track</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Track every expense for accurate budgeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Analyze category spending to optimize</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Set realistic budgets and stick to them</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Review monthly trends for better planning</span>
                      </li>
                    </>
                  )}
                </ul>
                <p className="text-xs text-gray-600 mt-4 italic">
                  {getMotivationalMessage()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
