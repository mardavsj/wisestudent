// controllers/studentController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Budget from '../models/Budget.js';
import Investment from '../models/Investment.js';
import SavingsGoal from '../models/SavingsGoal.js';
import QuizResult from '../models/QuizResult.js';
import Expense from '../models/Expense.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';

// Get student features
export const getStudentFeatures = async (req, res) => {
  try {
    // In a real implementation, you might fetch features from a database
    // or customize them based on the student's progress/level
    
    // For now, we'll return a static list of financial education features
    const features = [
      {
        id: 1,
        title: "Financial Literacy",
        description: "Learn the basics of personal finance and money management",
        icon: "📚",
        path: "/learn/financial-literacy",
        color: "bg-blue-500",
        category: "education"
      },
      {
        id: 2,
        title: "Budget Planner",
        description: "Create and manage your personal budget",
        icon: "💰",
        path: "/tools/budget-planner",
        color: "bg-green-500",
        category: "tools"
      },
      {
        id: 3,
        title: "Investment Simulator",
        description: "Practice investing with virtual money",
        icon: "📈",
        path: "/games/investment-simulator",
        color: "bg-purple-500",
        category: "games"
      },
      {
        id: 4,
        title: "Savings Goals",
        description: "Set and track your savings goals",
        icon: "🎯",
        path: "/tools/savings-goals",
        color: "bg-yellow-500",
        category: "tools"
      },
      {
        id: 5,
        title: "Financial Quiz",
        description: "Test your financial knowledge",
        icon: "❓",
        path: "/learn/financial-quiz",
        color: "bg-red-500",
        category: "games"
      },
      {
        id: 6,
        title: "Expense Tracker",
        description: "Track your daily expenses",
        icon: "📝",
        path: "/tools/expense-tracker",
        color: "bg-indigo-500",
        category: "tools"
      }
    ];
    
    res.status(200).json(features);
  } catch (err) {
    console.error('Failed to fetch student features:', err);
    res.status(500).json({ error: 'Server error fetching features' });
  }
};

// Get student achievements
export const getStudentAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    const badgeProgress = await UnifiedGameProgress.find({
      userId,
      badgeAwarded: true
    }).sort({ updatedAt: -1 });

    const achievements = badgeProgress.map((game) => {
      const earnedAt = game.firstCompletedAt || game.updatedAt || new Date();
      return {
        id: game._id,
        title: game.badgeName || "Badge Earned",
        description: game.gameId ? `Earned in ${game.gameId}` : "Badge earned",
        icon: game.badgeImage || "badge",
        date: earnedAt ? new Date(earnedAt).toISOString() : null,
        unlocked: true
      };
    });

    res.status(200).json(achievements);
  } catch (err) {
    console.error('Failed to fetch student achievements:', err);
    res.status(500).json({ error: 'Server error fetching achievements' });
  }
};
// Save budget data
export const saveBudgetData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, incomes, expenses } = req.body;
    
    // Find existing budget or create a new one
    let budget = await Budget.findOne({ userId });
    
    if (budget) {
      // Update existing budget
      budget.name = name || budget.name;
      budget.incomes = incomes || budget.incomes;
      budget.expenses = expenses || budget.expenses;
    } else {
      // Create new budget
      budget = new Budget({
        userId,
        name: name || 'My Budget',
        incomes: incomes || [],
        expenses: expenses || []
      });
    }
    
    await budget.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Budget data saved successfully',
      data: budget
    });
  } catch (err) {
    console.error('Failed to save budget data:', err);
    res.status(500).json({ error: 'Server error saving budget data' });
  }
};

// Get budget data
export const getBudgetData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const budget = await Budget.findOne({ userId });
    
    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }
    
    res.status(200).json(budget);
  } catch (err) {
    console.error('Failed to fetch budget data:', err);
    res.status(500).json({ error: 'Server error fetching budget data' });
  }
};

// Save investment data
export const saveInvestmentData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cash, investments, history, currentDay } = req.body;
    
    // Find existing investment portfolio or create a new one
    let investment = await Investment.findOne({ userId });
    
    if (investment) {
      // Update existing investment
      if (cash !== undefined) investment.cash = cash;
      
      // Update stocks based on the new investments array
      if (investments && Array.isArray(investments)) {
        // Convert investments to stocks format for database
        const stocks = investments.map(inv => {
          const stock = {
            symbol: inv.symbol,
            name: inv.symbol, // Using symbol as name if not provided
            shares: inv.shares,
            purchasePrice: inv.purchasePrice || inv.averagePrice,
            currentPrice: inv.currentPrice || inv.purchasePrice || inv.averagePrice
          };
          return stock;
        });
        
        investment.stocks = stocks;
      }
      
      // Add transaction history if provided
      if (history && Array.isArray(history)) {
        investment.simulationHistory = history;
      }
      
      // Update current day if provided
      if (currentDay !== undefined) {
        investment.currentDay = currentDay;
      }
    } else {
      // Create new investment portfolio
      const stocks = investments && Array.isArray(investments) 
        ? investments.map(inv => ({
            symbol: inv.symbol,
            name: inv.symbol,
            shares: inv.shares,
            purchasePrice: inv.purchasePrice || inv.averagePrice,
            currentPrice: inv.currentPrice || inv.purchasePrice || inv.averagePrice
          }))
        : [];
        
      investment = new Investment({
        userId,
        cash: cash !== undefined ? cash : 10000,
        stocks,
        transactions: [],
        simulationHistory: history || [],
        currentDay: currentDay || 1
      });
    }
    
    await investment.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Investment data saved successfully',
      data: investment
    });
  } catch (err) {
    console.error('Failed to save investment data:', err);
    res.status(500).json({ error: 'Server error saving investment data' });
  }
};

// Get investment data
export const getInvestmentData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const investment = await Investment.findOne({ userId });
    
    if (!investment) {
      // Create a new investment portfolio with default values
      const newInvestment = new Investment({
        userId,
        cash: 10000,
        stocks: [],
        transactions: [],
        simulationHistory: [],
        currentDay: 1
      });
      
      await newInvestment.save();
      
      // Format the response for the frontend
      return res.status(200).json({
        cash: newInvestment.cash,
        investments: [],
        history: [],
        currentDay: 1
      });
    }
    
    // Format the response for the frontend
    const formattedResponse = {
      cash: investment.cash,
      investments: investment.stocks.map(stock => ({
        stockId: stock._id,
        symbol: stock.symbol,
        shares: stock.shares,
        purchasePrice: stock.purchasePrice,
        averagePrice: stock.purchasePrice,
        currentPrice: stock.currentPrice
      })),
      history: investment.simulationHistory || [],
      currentDay: investment.currentDay || 1
    };
    
    res.status(200).json(formattedResponse);
  } catch (err) {
    console.error('Failed to fetch investment data:', err);
    res.status(500).json({ error: 'Server error fetching investment data' });
  }
};

// Save savings goals
const parseTargetDateFromPayload = (payload) => {
  const rawDate = payload?.targetDate || payload?.deadline;
  if (!rawDate) return null;

  const dateCandidate = rawDate instanceof Date ? rawDate : new Date(rawDate);
  if (Number.isNaN(dateCandidate.getTime())) {
    return null;
  }

  return dateCandidate;
};

const formatGoalForResponse = (goalDoc) => {
  const goal = goalDoc.toObject({ versionKey: false });
  if (goal.targetDate) {
    goal.deadline = goal.targetDate instanceof Date
      ? goal.targetDate.toISOString()
      : new Date(goal.targetDate).toISOString();
  } else if (!goal.deadline) {
    goal.deadline = null;
  }
  return goal;
};

export const saveSavingsGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goals } = req.body;
    
    if (!goals || !Array.isArray(goals)) {
      return res.status(400).json({ error: 'Invalid goals data' });
    }
    
    // Process each goal
    const savedGoals = [];
    
    for (const goal of goals) {
      const targetDate = parseTargetDateFromPayload(goal);

      if (!targetDate) {
        return res.status(400).json({ error: 'Each goal must have a valid deadline/target date' });
      }

      const sanitizedGoal = { ...goal };
      sanitizedGoal.targetDate = targetDate;
      delete sanitizedGoal.deadline;
      delete sanitizedGoal._id;
      delete sanitizedGoal.userId;

      const hasValidObjectId = goal._id && mongoose.Types.ObjectId.isValid(goal._id);

      if (hasValidObjectId) {
        // Update existing goal
        const existingGoal = await SavingsGoal.findOne({ 
          _id: goal._id, 
          userId 
        });
        
        if (existingGoal) {
          Object.assign(existingGoal, sanitizedGoal);
          
          await existingGoal.save();
          savedGoals.push(formatGoalForResponse(existingGoal));
        }
      } else {
        // Create new goal
        const newGoal = new SavingsGoal({
          ...sanitizedGoal,
          userId
        });
        
        await newGoal.save();
        savedGoals.push(formatGoalForResponse(newGoal));
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Savings goals saved successfully',
      data: { goals: savedGoals }
    });
  } catch (err) {
    console.error('Failed to save savings goals:', err);
    res.status(500).json({ error: 'Server error saving savings goals' });
  }
};

// Get savings goals
export const getSavingsGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
    const mappedGoals = goals.map(formatGoalForResponse);
    
    res.status(200).json(mappedGoals);
  } catch (err) {
    console.error('Failed to fetch savings goals:', err);
    res.status(500).json({ error: 'Server error fetching savings goals' });
  }
};

// Add contribution to savings goal
export const addContribution = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalId } = req.params;
    const { amount, note } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid contribution amount' });
    }
    
    const goal = await SavingsGoal.findOne({ _id: goalId, userId });
    
    if (!goal) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    
    // Add contribution
    goal.contributions.push({
      amount,
      date: new Date(),
      note: note || ''
    });
    
    // Update current amount
    goal.currentAmount += amount;
    
    await goal.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Contribution added successfully',
      data: goal
    });
  } catch (err) {
    console.error('Failed to add contribution:', err);
    res.status(500).json({ error: 'Server error adding contribution' });
  }
};

// Delete savings goal
export const deleteSavingsGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalId } = req.params;
    
    const goal = await SavingsGoal.findOneAndDelete({ _id: goalId, userId });
    
    if (!goal) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Savings goal deleted successfully'
    });
  } catch (err) {
    console.error('Failed to delete savings goal:', err);
    res.status(500).json({ error: 'Server error deleting savings goal' });
  }
};

// Save quiz results
export const saveQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quizId, quizTitle, score, totalQuestions, timeTaken, answers } = req.body;
    
    if (!quizId || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required quiz data' });
    }
    
    // Create new quiz result
    const quizResult = new QuizResult({
      userId,
      quizId,
      quizTitle: quizTitle || 'Financial Quiz',
      score,
      totalQuestions,
      timeTaken: timeTaken || 0,
      answers: answers || []
    });
    
    await quizResult.save();
    
    // TODO: Award XP to the user based on quiz performance
    // This would involve updating the user's XP in the User model
    // and creating an XP log entry
    
    res.status(200).json({ 
      success: true, 
      message: 'Quiz results saved successfully',
      data: quizResult
    });
  } catch (err) {
    console.error('Failed to save quiz results:', err);
    res.status(500).json({ error: 'Server error saving quiz results' });
  }
};

// Get quiz results
export const getQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const results = await QuizResult.find({ userId }).sort({ completedAt: -1 });
    
    res.status(200).json(results);
  } catch (err) {
    console.error('Failed to fetch quiz results:', err);
    res.status(500).json({ error: 'Server error fetching quiz results' });
  }
};

// Save expense data
export const saveExpenseData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { expenses } = req.body;
    
    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: 'Invalid expenses data' });
    }
    
    const savedExpenses = [];
    
    for (const expense of expenses) {
      const newExpense = new Expense({
        ...expense,
        userId
      });
      
      await newExpense.save();
      savedExpenses.push(newExpense);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Expense data saved successfully',
      data: { expenses: savedExpenses }
    });
  } catch (err) {
    console.error('Failed to save expense data:', err);
    res.status(500).json({ error: 'Server error saving expense data' });
  }
};

// Get expense data
export const getExpenseData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, category } = req.query;
    
    // Build query
    const query = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (category) query.category = category;
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Failed to fetch expense data:', err);
    res.status(500).json({ error: 'Server error fetching expense data' });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const { expenseId } = req.params;
    
    const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Expense deleted successfully'
    });
  } catch (err) {
    console.error('Failed to delete expense:', err);
    res.status(500).json({ error: 'Server error deleting expense' });
  }
};


