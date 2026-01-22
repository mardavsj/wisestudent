import BudgetTransaction from '../models/BudgetTransaction.js';
import User from '../models/User.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Get budget summary and transactions
export const getBudgetSummary = async (req, res) => {
  try {
    const { 
      organizationId,
      startDate,
      endDate,
      campaignId,
      type
    } = req.query;

    const orgId = organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011';
    
    // Default to last 30 days if no dates provided
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const defaultEndDate = new Date();
    
    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : defaultEndDate;

    // Build match criteria
    const matchCriteria = {
      organizationId: new mongoose.Types.ObjectId(orgId),
      createdAt: { $gte: start, $lte: end },
      status: 'completed'
    };

    if (campaignId) matchCriteria.campaignId = new mongoose.Types.ObjectId(campaignId);
    if (type) matchCriteria.type = type;

    // Get budget summary by transaction type
    const budgetSummary = await BudgetTransaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          totalHealCoins: { $sum: '$healCoinsAmount' },
          transactionCount: { $sum: 1 },
          totalFees: { $sum: '$fees.totalFees' },
          averageAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get total HealCoins funded and spent
    const healCoinsSummary = await BudgetTransaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: null,
          totalFunded: {
            $sum: {
              $cond: [{ $eq: ['$type', 'healcoins_funded'] }, '$healCoinsAmount', 0]
            }
          },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$type', 'healcoins_spent'] }, '$healCoinsAmount', 0]
            }
          },
          totalRewards: {
            $sum: {
              $cond: [{ $eq: ['$type', 'reward_distribution'] }, '$amount', 0]
            }
          },
          totalAdminFees: {
            $sum: {
              $cond: [{ $eq: ['$type', 'admin_fee'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    // Get monthly spending trends
    const monthlyTrends = await BudgetTransaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSpent: { $sum: '$amount' },
          totalHealCoins: { $sum: '$healCoinsAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top spending categories
    const topCategories = await BudgetTransaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        budgetSummary,
        healCoinsSummary: healCoinsSummary[0] || {
          totalFunded: 0,
          totalSpent: 0,
          totalRewards: 0,
          totalAdminFees: 0
        },
        monthlyTrends,
        topCategories,
        period: { startDate: start, endDate: end }
      }
    });
  } catch (error) {
    console.error('Error fetching budget summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget summary',
      error: error.message
    });
  }
};

// Get detailed transactions
export const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      organizationId,
      campaignId,
      userId,
      type,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter criteria
    const filter = {};
    if (organizationId) filter.organizationId = organizationId;
    if (campaignId) filter.campaignId = campaignId;
    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort criteria
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await BudgetTransaction.find(filter)
      .populate('campaignId', 'title')
      .populate('userId', 'name email')
      .populate('studentId', 'name email')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BudgetTransaction.countDocuments(filter);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdBy: req.user._id,
      organizationId: req.user.organizationId
    };

    const transaction = new BudgetTransaction(transactionData);
    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Fund HealCoins
export const fundHealCoins = async (req, res) => {
  try {
    const { amount, campaignId, description, notes } = req.body;

    const transaction = new BudgetTransaction({
      type: 'healcoins_funded',
      amount: 0, // No currency amount for HealCoins funding
      healCoinsAmount: amount,
      campaignId: campaignId || null,
      description: description || 'HealCoins funding',
      notes: notes || '',
      status: 'completed',
      paymentMethod: 'admin_credit',
      createdBy: req.user._id,
      organizationId: req.user.organizationId
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'HealCoins funded successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error funding HealCoins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fund HealCoins',
      error: error.message
    });
  }
};

// Record HealCoins spend
export const recordHealCoinsSpend = async (req, res) => {
  try {
    const {
      healCoinsAmount,
      amount,
      studentId,
      campaignId,
      voucherId,
      productId,
      description,
      category
    } = req.body;

    const transaction = new BudgetTransaction({
      type: 'healcoins_spent',
      amount: amount || 0,
      healCoinsAmount,
      studentId,
      campaignId,
      voucherId,
      productId,
      description,
      category,
      status: 'completed',
      paymentMethod: 'healcoins',
      createdBy: req.user._id,
      organizationId: req.user.organizationId
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'HealCoins spend recorded successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error recording HealCoins spend:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record HealCoins spend',
      error: error.message
    });
  }
};

// Get HealCoins balance
export const getHealCoinsBalance = async (req, res) => {
  try {
    const { organizationId, campaignId } = req.query;
    const orgId = organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011';

    // Build match criteria
    const matchCriteria = { organizationId: new mongoose.Types.ObjectId(orgId) };
    if (campaignId) matchCriteria.campaignId = new mongoose.Types.ObjectId(campaignId);

    const balance = await BudgetTransaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: null,
          totalFunded: {
            $sum: {
              $cond: [{ $eq: ['$type', 'healcoins_funded'] }, '$healCoinsAmount', 0]
            }
          },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$type', 'healcoins_spent'] }, '$healCoinsAmount', 0]
            }
          }
        }
      }
    ]);

    const result = balance[0] || { totalFunded: 0, totalSpent: 0 };
    const availableBalance = result.totalFunded - result.totalSpent;

    res.json({
      success: true,
      data: {
        totalFunded: result.totalFunded,
        totalSpent: result.totalSpent,
        availableBalance,
        utilizationRate: result.totalFunded > 0 ? (result.totalSpent / result.totalFunded) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching HealCoins balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch HealCoins balance',
      error: error.message
    });
  }
};

// Update transaction status
export const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, notes } = req.body;

    const transaction = await BudgetTransaction.findOneAndUpdate(
      { transactionId },
      {
        status,
        notes: notes || transaction.notes,
        lastModifiedBy: req.user._id,
        ...(status === 'completed' && { completionDate: new Date() })
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
      error: error.message
    });
  }
};

// Export transactions
export const exportTransactions = async (req, res) => {
  try {
    const { format = 'csv', organizationId, startDate, endDate } = req.query;
    const orgId = organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011';

    const filter = { organizationId: new mongoose.Types.ObjectId(orgId) };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const transactions = await BudgetTransaction.find(filter)
      .populate('campaignId', 'title')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = convertTransactionsToCSV(transactions);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="budget-transactions-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
    } else {
      res.json({
        success: true,
        data: transactions,
        exportedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error exporting transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions',
      error: error.message
    });
  }
};

// Helper function to convert transactions to CSV
const convertTransactionsToCSV = (transactions) => {
  const headers = [
    'Transaction ID',
    'Type',
    'Amount',
    'HealCoins',
    'Description',
    'Status',
    'Campaign',
    'User',
    'Date'
  ];

  const rows = transactions.map(t => [
    t.transactionId,
    t.type,
    t.amount,
    t.healCoinsAmount,
    t.description,
    t.status,
    t.campaignId?.title || '',
    t.userId?.name || '',
    t.createdAt.toISOString()
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
