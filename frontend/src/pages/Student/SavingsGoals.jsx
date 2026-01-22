import React, { useState, useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Target, Plus, Trash2, Edit2, Check, X, Coins, Calendar, 
  TrendingUp, TrendingDown, Award, Sparkles, Zap, Clock, DollarSign,
  BarChart3, PieChart, History, Lightbulb, Star, Trophy, Gift, PiggyBank,
  AlertCircle, CheckCircle2, Info, Play, Pause, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fetchSavingsGoals, saveSavingsGoals, deleteSavingsGoal } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const SavingsGoals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('priority'); // 'priority', 'progress', 'deadline', 'amount'
  const [filterCategory, setFilterCategory] = useState('all');
  const autoSaveTimer = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'Other',
    priority: 'Medium',
    notes: '',
    icon: '🎯',
    color: 'yellow',
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
        categories: ['Toys', 'Games', 'Books', 'Bike', 'Pet', 'Party', 'Other'],
        priorities: ['Low', 'Medium', 'High'],
        icons: ['🧸', '🎮', '📚', '🚲', '🐾', '🎉', '🎯'],
        colors: ['pink', 'purple', 'blue', 'green', 'yellow', 'orange', 'red'],
        minAmount: 1,
        maxAmount: 1000,
        defaultQuickAmounts: [5, 10, 25, 50],
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
      };
    } else if (ageGroup === 'teens') {
      return {
        categories: ['Electronics', 'Clothing', 'Entertainment', 'Education', 'Travel', 'Emergency', 'Other'],
        priorities: ['Low', 'Medium', 'High'],
        icons: ['📱', '👕', '🎬', '📚', '✈️', '🏥', '🎯'],
        colors: ['blue', 'purple', 'pink', 'green', 'orange', 'red', 'yellow'],
        minAmount: 10,
        maxAmount: 10000,
        defaultQuickAmounts: [10, 25, 50, 100],
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
      };
    } else {
      return {
        categories: ['Electronics', 'Travel', 'Education', 'Entertainment', 'Clothing', 'Emergency', 'Investment', 'Home', 'Vehicle', 'Other'],
        priorities: ['Low', 'Medium', 'High', 'Critical'],
        icons: ['💻', '✈️', '🎓', '🎬', '👔', '🏥', '📈', '🏠', '🚗', '🎯'],
        colors: ['blue', 'cyan', 'green', 'purple', 'pink', 'red', 'emerald', 'orange', 'indigo', 'yellow'],
        minAmount: 50,
        maxAmount: 1000000,
        defaultQuickAmounts: [50, 100, 250, 500],
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
      };
    }
  }, [ageGroup]);

  // Load goals on mount
  useEffect(() => {
    const loadSavingsGoals = async () => {
      try {
        setLoading(true);
        const data = await fetchSavingsGoals();
        if (data && Array.isArray(data)) {
          setGoals(data);
        } else {
          setGoals([]);
        }
        logActivity({
          activityType: 'page_view',
          description: 'Viewed savings goals',
          metadata: {
            page: '/student/finance/savings-goals',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading savings goals:', error);
        toast.error('Failed to load savings goals');
      } finally {
        setLoading(false);
      }
    };

    loadSavingsGoals();
  }, [ageGroup]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && goals.length > 0) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      autoSaveTimer.current = setTimeout(async () => {
        try {
          const savedResponse = await saveSavingsGoals(goals);
          if (savedResponse?.data?.goals) {
            setGoals(savedResponse.data.goals);
          }
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => {
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }
      };
    }
  }, [goals, hasUnsavedChanges]);

  // Helper functions
  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'from-green-500 to-emerald-400';
    if (progress >= 75) return 'from-blue-500 to-cyan-400';
    if (progress >= 50) return 'from-yellow-500 to-orange-400';
    if (progress >= 25) return 'from-orange-500 to-red-400';
    return 'from-red-500 to-pink-400';
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getMonthlyContribution = (goal) => {
    const daysLeft = getDaysLeft(goal.deadline);
    if (!daysLeft || daysLeft <= 0) return null;
    const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0);
    const monthsLeft = daysLeft / 30;
    return monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : null;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    const totalTarget = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    const activeGoals = goals.filter(goal => {
      const progress = calculateProgress(goal.currentAmount || 0, goal.targetAmount || 0);
      return progress < 100;
    }).length;
    const completedGoals = goals.length - activeGoals;
    const avgProgress = goals.length > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + calculateProgress(goal.currentAmount || 0, goal.targetAmount || 0), 0) / goals.length)
      : 0;
    
    return {
      totalSaved,
      totalTarget,
      overallProgress,
      activeGoals,
      completedGoals,
      avgProgress,
    };
  }, [goals]);

  // Filter and sort goals
  const filteredAndSortedGoals = useMemo(() => {
    let filtered = goals;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === filterCategory);
    }
    
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        case 'progress':
          return calculateProgress(b.currentAmount || 0, b.targetAmount || 0) - 
                 calculateProgress(a.currentAmount || 0, a.targetAmount || 0);
        case 'deadline':
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        case 'amount':
          return (b.targetAmount || 0) - (a.targetAmount || 0);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [goals, filterCategory, sortBy]);

  // Handle add/edit goal
  const handleSaveGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (isNaN(targetAmount) || targetAmount < config.minAmount || targetAmount > config.maxAmount) {
      toast.error(`Amount must be between $${config.minAmount} and $${config.maxAmount}`);
      return;
    }

    try {
      let updatedGoals;
      const goalData = {
        ...newGoal,
        targetAmount: targetAmount,
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        createdAt: editingGoalId ? goals.find(g => g._id === editingGoalId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contributions: editingGoalId ? goals.find(g => g._id === editingGoalId)?.contributions || [] : [],
      };

      if (editingGoalId) {
        updatedGoals = goals.map((goal) =>
          goal._id === editingGoalId ? { ...goal, ...goalData, _id: goal._id } : goal
        );
        toast.success('Goal updated successfully!');
        logActivity({
          activityType: 'financial_action',
          description: 'Updated savings goal',
          metadata: {
            action: 'update_savings_goal',
            goalName: newGoal.name,
            targetAmount: targetAmount,
            category: newGoal.category,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } else {
        const newId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updatedGoals = [...goals, { ...goalData, _id: newId }];
        toast.success('New goal created successfully! 🎉');
        logActivity({
          activityType: 'financial_action',
          description: 'Created new savings goal',
          metadata: {
            action: 'create_savings_goal',
            goalName: newGoal.name,
            targetAmount: targetAmount,
            category: newGoal.category,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }

      setGoals(updatedGoals);
      setHasUnsavedChanges(true);
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const resetForm = () => {
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: 0,
      deadline: '',
      category: config.categories[0],
      priority: 'Medium',
      notes: '',
      icon: config.icons[0],
      color: config.colors[0],
    });
    setEditingGoalId(null);
    setShowAddForm(false);
  };

  const handleEditGoal = (goal) => {
    setNewGoal({
      name: goal.name || '',
      targetAmount: goal.targetAmount || '',
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      category: goal.category || config.categories[0],
      priority: goal.priority || 'Medium',
      notes: goal.notes || '',
      icon: goal.icon || config.icons[0],
      color: goal.color || config.colors[0],
    });
    setEditingGoalId(goal._id);
    setShowAddForm(true);
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await deleteSavingsGoal(id);
      setGoals(goals.filter((goal) => goal._id !== id));
      setHasUnsavedChanges(true);
      toast.success('Goal deleted successfully');
      
      const deletedGoal = goals.find((goal) => goal._id === id);
      if (deletedGoal) {
        logActivity({
          activityType: 'financial_action',
          description: 'Deleted savings goal',
          metadata: {
            action: 'delete_savings_goal',
            goalName: deletedGoal.name,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleContribute = async () => {
    if (!selectedGoal || !contributionAmount) {
      toast.error('Please enter a contribution amount');
      return;
    }

    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const goalToUpdate = goals.find((goal) => goal._id === selectedGoal._id);
      if (!goalToUpdate) return;

      const newAmount = Math.min(
        goalToUpdate.targetAmount,
        (goalToUpdate.currentAmount || 0) + amount
      );
      
      const contribution = {
        amount,
        note: contributionNote,
        date: new Date().toISOString(),
      };

      const updatedGoals = goals.map((goal) => {
        if (goal._id === selectedGoal._id) {
          const contributions = [...(goal.contributions || []), contribution];
          const progress = calculateProgress(newAmount, goal.targetAmount);
          
          // Check for milestones
          if (progress >= 100 && (goal.currentAmount || 0) < goal.targetAmount) {
            toast.success(`🎉 Congratulations! You've reached your goal: ${goal.name}!`, {
              duration: 5000,
              icon: '🏆',
            });
          } else if (progress >= 75 && (goal.currentAmount || 0) < goal.targetAmount * 0.75) {
            toast.success(`🌟 Great progress! You're 75% there!`, {
              duration: 3000,
              icon: '⭐',
            });
          } else if (progress >= 50 && (goal.currentAmount || 0) < goal.targetAmount * 0.5) {
            toast.success(`💪 Halfway there! Keep it up!`, {
              duration: 3000,
              icon: '🎯',
            });
          }
          
          return {
            ...goal,
            currentAmount: newAmount,
            contributions,
            updatedAt: new Date().toISOString(),
          };
        }
        return goal;
      });

      setGoals(updatedGoals);
      setHasUnsavedChanges(true);
      setShowContributionModal(false);
      setContributionAmount('');
      setContributionNote('');
      setSelectedGoal(null);
      
      toast.success(`Added $${amount.toFixed(2)} to ${goalToUpdate.name}! 💰`);

      logActivity({
        activityType: 'financial_action',
        description: 'Added contribution to savings goal',
        metadata: {
          action: 'add_contribution',
          goalName: goalToUpdate.name,
          contributionAmount: amount,
          newTotal: newAmount,
          progress: calculateProgress(newAmount, goalToUpdate.targetAmount),
          ageGroup,
          timestamp: new Date().toISOString(),
        },
        pageUrl: window.location.pathname,
      });
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Failed to add contribution');
    }
  };

  const openContributionModal = (goal) => {
    setSelectedGoal(goal);
    setShowContributionModal(true);
  };

  // Age-appropriate messaging
  const getMotivationalMessage = () => {
    if (ageGroup === 'kids') {
      const messages = [
        "You're doing great! Keep saving! 🌟",
        "Every coin counts! 🪙",
        "You're a savings superstar! ⭐",
        "Keep going, you're amazing! 💪",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (ageGroup === 'teens') {
      const messages = [
        "You're building great financial habits! 💰",
        "Smart saving leads to smart spending! 🎯",
        "Your future self will thank you! 🚀",
        "Every dollar saved is a step toward your goals! 📈",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        "Financial discipline is the key to success! 💼",
        "Your savings goals are within reach! 🎯",
        "Consistent contributions lead to great outcomes! 📊",
        "You're building wealth, one goal at a time! 💎",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your savings goals...</p>
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
          <button
            onClick={() => navigate('/student/dashboard/financial-literacy')}
            className="flex items-center text-yellow-600 hover:text-yellow-800 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Financial Literacy
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
            ageGroup === 'kids' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight' :
                ageGroup === 'teens' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight' :
                'text-gray-900'
              }`}>
                {ageGroup === 'kids' && '🎯 '}
                Savings Goals
                {ageGroup === 'kids' && ' 🎯'}
              </h1>
              <p className={`text-lg ${
                ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {ageGroup === 'kids' && "Save up for things you want! 🎉"}
                {ageGroup === 'teens' && "Plan, save, and achieve your financial goals"}
                {ageGroup === 'adults' && "Set and track your savings goals with precision"}
              </p>
            </div>
            
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
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
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-xl bg-yellow-100">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              {stats.completedGoals > 0 && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stats.completedGoals} Done!
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">Active Goals</p>
            <p className="text-3xl font-black text-gray-800">{stats.activeGoals}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="p-3 rounded-xl bg-green-100 mb-2">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Saved</p>
            <p className="text-3xl font-black text-gray-800">
              ${stats.totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of ${stats.totalTarget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="p-3 rounded-xl bg-blue-100 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-black text-gray-800">{stats.overallProgress}%</p>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getProgressColor(stats.overallProgress)}`}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="p-3 rounded-xl bg-purple-100 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Average Progress</p>
            <p className="text-3xl font-black text-gray-800">{stats.avgProgress}%</p>
            <p className="text-xs text-gray-400 mt-1">{getMotivationalMessage()}</p>
          </motion.div>
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
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg'
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
                  {ageGroup === 'kids' ? 'New Goal 🎯' : 'Add New Goal'}
                </>
              )}
            </button>

            {config.showAdvanced && (
              <>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {config.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="deadline">Sort by Deadline</option>
                  <option value="amount">Sort by Amount</option>
                </select>

                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
                </button>
              </>
            )}
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
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  {editingGoalId ? (
                    <>
                      <Edit2 className="w-6 h-6 text-yellow-600" />
                      Edit Savings Goal
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-yellow-600" />
                      Create New Savings Goal
                    </>
                  )}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Goal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder={ageGroup === 'kids' ? "e.g., New Toy 🧸" : "e.g., New Laptop"}
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Target Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        placeholder={`Min: $${config.minAmount}, Max: $${config.maxAmount.toLocaleString()}`}
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                        min={config.minAmount}
                        max={config.maxAmount}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        placeholder="0"
                        value={newGoal.currentAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseFloat(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Target Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      value={newGoal.category}
                      onChange={(e) => {
                        const categoryIndex = config.categories.indexOf(e.target.value);
                        setNewGoal({
                          ...newGoal,
                          category: e.target.value,
                          icon: config.icons[categoryIndex] || config.icons[0],
                          color: config.colors[categoryIndex] || config.colors[0],
                        });
                      }}
                    >
                      {config.categories.map((category, index) => (
                        <option key={category} value={category}>
                          {config.icons[index]} {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                    <select
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    >
                      {config.priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  {ageGroup !== 'kids' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                      <textarea
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        placeholder="Additional details about your goal..."
                        rows="3"
                        value={newGoal.notes}
                        onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                      />
                    </div>
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
                    onClick={handleSaveGoal}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                      ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    {editingGoalId ? 'Update Goal' : 'Save Goal'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredAndSortedGoals.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredAndSortedGoals.map((goal, index) => {
                const progress = calculateProgress(goal.currentAmount || 0, goal.targetAmount || 0);
                const progressColor = getProgressColor(progress);
                const daysLeft = getDaysLeft(goal.deadline);
                const monthlyContribution = getMonthlyContribution(goal);
                const isCompleted = progress >= 100;

                return (
                  <motion.div
                    key={goal._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                      isCompleted ? 'border-green-500' : 'border-transparent'
                    } transition-all`}
                  >
                    {/* Progress Bar */}
                    <div className={`h-2 bg-gradient-to-r ${progressColor}`} style={{ width: `${progress}%` }} />

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`text-4xl ${isCompleted ? 'animate-bounce' : ''}`}>
                            {goal.icon || '🎯'}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-gray-800">{goal.name}</h3>
                            <p className="text-sm text-gray-500">{goal.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditGoal(goal)}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                            title="Edit goal"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete goal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className={`font-black ${
                            progress >= 100 ? 'text-green-600' :
                            progress >= 75 ? 'text-blue-600' :
                            progress >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${progressColor}`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${(goal.currentAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span>${(goal.targetAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={daysLeft !== null && daysLeft < 0 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {daysLeft !== null 
                              ? daysLeft > 0 
                                ? `${daysLeft} days left`
                                : 'Overdue!'
                              : 'No deadline'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            goal.priority === 'Critical' || goal.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : goal.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>

                      {/* Monthly Contribution Suggestion */}
                      {monthlyContribution && monthlyContribution > 0 && !isCompleted && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 font-bold">
                              Save ${monthlyContribution.toLocaleString()} per month to reach your goal!
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Completion Badge */}
                      {isCompleted && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-black">Goal Achieved! 🎉</span>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {goal.notes && ageGroup !== 'kids' && (
                        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                          {goal.notes}
                        </div>
                      )}

                      {/* Contribution History */}
                      {goal.contributions && goal.contributions.length > 0 && ageGroup !== 'kids' && (
                        <div className="mb-4">
                          <button
                            onClick={() => {
                              const history = goal.contributions.slice(-3).reverse().map(c => 
                                `$${c.amount} - ${new Date(c.date).toLocaleDateString()}`
                              ).join('\n');
                              toast.success(`Recent contributions:\n${history}`, { duration: 4000 });
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <History className="w-3 h-3" />
                            {goal.contributions.length} contribution{goal.contributions.length !== 1 ? 's' : ''}
                          </button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openContributionModal(goal)}
                          disabled={isCompleted}
                          className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            isCompleted
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : ageGroup === 'kids'
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                              : ageGroup === 'teens'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                          }`}
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Money
                        </button>
                        
                        {!isCompleted && config.defaultQuickAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => {
                              const contribution = {
                                amount,
                                note: `Quick add $${amount}`,
                                date: new Date().toISOString(),
                              };
                              const newAmount = Math.min(
                                goal.targetAmount,
                                (goal.currentAmount || 0) + amount
                              );
                              const updatedGoals = goals.map(g => 
                                g._id === goal._id 
                                  ? { ...g, currentAmount: newAmount, contributions: [...(g.contributions || []), contribution], updatedAt: new Date().toISOString() }
                                  : g
                              );
                              setGoals(updatedGoals);
                              setHasUnsavedChanges(true);
                              toast.success(`Added $${amount}! 💰`);
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
                          >
                            +${amount}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
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
                {ageGroup === 'kids' ? '🎯' : '💼'}
              </motion.div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                {ageGroup === 'kids' ? "No Goals Yet!" : "No Savings Goals Yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {ageGroup === 'kids' 
                  ? "Create your first savings goal and start saving for something awesome! 🎉"
                  : ageGroup === 'teens'
                  ? "Create your first savings goal to start tracking your progress!"
                  : "Create your first savings goal to start building your financial future!"}
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
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                }`}
              >
                <Plus className="w-6 h-6" />
                {ageGroup === 'kids' ? 'Create Your First Goal! 🎯' : 'Create Your First Goal'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Contribution Modal */}
      <AnimatePresence>
        {showContributionModal && selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowContributionModal(false);
              setSelectedGoal(null);
              setContributionAmount('');
              setContributionNote('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800">Add Contribution</h3>
                <button
                  onClick={() => {
                    setShowContributionModal(false);
                    setSelectedGoal(null);
                    setContributionAmount('');
                    setContributionNote('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{selectedGoal.icon}</div>
                  <p className="font-bold text-gray-800">{selectedGoal.name}</p>
                  <p className="text-sm text-gray-500">
                    Current: ${(selectedGoal.currentAmount || 0).toFixed(2)} / ${(selectedGoal.targetAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {config.defaultQuickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setContributionAmount(amount.toString())}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {ageGroup !== 'kids' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Note (optional)
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Birthday money, Allowance, etc."
                    rows="2"
                    value={contributionNote}
                    onChange={(e) => setContributionNote(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowContributionModal(false);
                    setSelectedGoal(null);
                    setContributionAmount('');
                    setContributionNote('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContribute}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                    ageGroup === 'kids'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                      : ageGroup === 'teens'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                  }`}
                >
                  Add Contribution
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingsGoals;
