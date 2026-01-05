import CSRPayment from '../models/CSRPayment.js';
import Invoice from '../models/Invoice.js';
import SpendLedger from '../models/SpendLedger.js';
import Campaign from '../models/Campaign.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create new CSR payment
export const createPayment = async (req, res) => {
  try {
    const {
      paymentType,
      campaignId,
      amount,
      currency,
      healCoinsAmount,
      paymentMethod,
      budgetCategory,
      paymentSchedule,
      scheduledDate,
      description,
      supportingDocuments
    } = req.body;

    // Validate required fields
    if (!paymentType || !amount || !paymentMethod || !budgetCategory) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Validate user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Use orgId if available, otherwise use user's _id as fallback
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    
    // Get organization details (if orgId exists)
    let organization = null;
    if (req.user.orgId) {
      organization = await Organization.findById(req.user.orgId);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }
    }

    // Create payment record
    const payment = new CSRPayment({
      paymentType,
      organizationId: organizationId,
      organizationName: organization?.name || 'CSR User',
      csrContactId: req.user._id,
      campaignId: campaignId || null,
      amount,
      currency: currency || 'INR',
      healCoinsAmount: healCoinsAmount || 0,
      healCoinsExchangeRate: healCoinsAmount ? amount / healCoinsAmount : 1,
      paymentMethod,
      budgetCategory,
      paymentSchedule: paymentSchedule || 'immediate',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      supportingDocuments: supportingDocuments || [],
      approvalStatus: amount > 100000 ? 'pending_approval' : 'approved' // Auto-approve small amounts
    });

    await payment.save();

    // Add audit trail
    payment.addAuditEntry(
      'payment_created',
      req.user._id,
      'Payment record created',
      null,
      payment.toObject()
    );
    await payment.save(); // Save again to persist audit entry

    // Create spend ledger entry
    const ledgerEntry = new SpendLedger({
      transactionType: paymentType === 'healcoins_pool' ? 'healcoins_fund' : 'payment',
      organizationId: organizationId,
      campaignId: campaignId || null,
      amount,
      currency: currency || 'INR',
      healCoinsAmount: healCoinsAmount || 0,
      category: budgetCategory,
      description: description || `Payment for ${paymentType}`,
      direction: 'inbound',
      runningBalance: 0, // Will be updated
      healCoinsBalance: 0, // Will be updated
      relatedPaymentId: payment._id,
      createdBy: req.user._id
    });

    await ledgerEntry.updateBalances();
    await ledgerEntry.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:overview:update');
    }

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.message
    });
  }
};

// Get all payments for organization
export const getPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentType,
      startDate,
      endDate,
      campaignId
    } = req.query;

    const filter = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (status) filter.status = status;
    if (paymentType) filter.paymentType = paymentType;
    if (campaignId) filter.campaignId = campaignId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await CSRPayment.find(filter)
      .populate('campaignId', 'title description')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CSRPayment.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await CSRPayment.findById(paymentId)
      .populate('campaignId', 'title description')
      .populate('organizationId', 'name')
      .populate('csrContactId', 'name email')
      .populate('approvedBy', 'name email')
      .populate('financeTeam.assignedTo', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, notes, gatewayTransactionId } = req.body;

    const payment = await CSRPayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const oldStatus = payment.status;
    payment.status = status;
    
    if (notes) payment.approvalNotes = notes;
    if (gatewayTransactionId) payment.transactionId = gatewayTransactionId;

    // Update processing details
    if (status === 'processing') {
      payment.processingDetails.initiatedAt = new Date();
    } else if (status === 'completed') {
      payment.processingDetails.completedAt = new Date();
    }

    await payment.save();

    // Add audit trail
    payment.addAuditEntry(
      'status_updated',
      req.user._id,
      `Payment status changed from ${oldStatus} to ${status}`,
      oldStatus,
      status
    );
    await payment.save(); // Save again to persist audit entry

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && payment.organizationId) {
      io.to(payment.organizationId.toString()).emit('csr:overview:update');
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

// Approve/reject payment
export const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { action, notes } = req.body; // action: 'approve' or 'reject'

    const payment = await CSRPayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (action === 'approve') {
      payment.approvalStatus = 'approved';
      payment.approvedBy = req.user._id;
      payment.approvedAt = new Date();
      payment.status = 'processing';
    } else if (action === 'reject') {
      payment.approvalStatus = 'rejected';
      payment.status = 'cancelled';
    }

    if (notes) payment.approvalNotes = notes;

    await payment.save();

    // Add audit trail
    payment.addAuditEntry(
      'payment_approved',
      req.user._id,
      `Payment ${action}d`,
      'pending_approval',
      payment.approvalStatus
    );
    await payment.save(); // Save again to persist audit entry

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && payment.organizationId) {
      io.to(payment.organizationId.toString()).emit('csr:overview:update');
    }

    res.json({
      success: true,
      message: `Payment ${action}d successfully`,
      data: payment
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment',
      error: error.message
    });
  }
};

// Process payment (finance team)
export const processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { gatewayResponse, processingNotes } = req.body;

    const payment = await CSRPayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update finance team details
    payment.financeTeam.assignedTo = req.user._id;
    payment.financeTeam.processedAt = new Date();
    payment.financeTeam.processingNotes = processingNotes;

    // Update processing details
    payment.processingDetails.gatewayResponse = gatewayResponse;
    payment.processingDetails.processedAt = new Date();

    // Generate invoice if payment is completed
    if (gatewayResponse?.status === 'success') {
      payment.status = 'completed';
      payment.processingDetails.completedAt = new Date();
      
      // Create invoice
      const invoice = await createInvoiceForPayment(payment);
      payment.financeTeam.invoiceGenerated = true;
      payment.financeTeam.invoiceId = invoice._id;
    }

    await payment.save();

    // Emit socket event for real-time updates
    const io = req.app?.get('io');
    if (io && payment.organizationId) {
      io.to(payment.organizationId.toString()).emit('csr:overview:update');
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Get spend ledger
export const getSpendLedger = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      category,
      transactionType,
      startDate,
      endDate,
      campaignId
    } = req.query;

    const filter = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (category) filter.category = category;
    if (transactionType) filter.transactionType = transactionType;
    if (campaignId) filter.campaignId = campaignId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const transactions = await SpendLedger.find(filter)
      .populate('campaignId', 'title')
      .populate('relatedPaymentId', 'paymentId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SpendLedger.countDocuments(filter);

    // Get current balance
    const balance = await SpendLedger.getOrganizationBalance(req.user?.organizationId || '507f1f77bcf86cd799439011');

    res.json({
      success: true,
      data: transactions,
      balance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching spend ledger:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spend ledger',
      error: error.message
    });
  }
};

// Get financial summary
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const defaultStartDate = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const defaultEndDate = endDate ? new Date(endDate) : new Date();

    // Get spend summary
    const spendSummary = await SpendLedger.getSpendSummary(
      req.user?.organizationId || '507f1f77bcf86cd799439011',
      defaultStartDate,
      defaultEndDate
    );

    // Get current balance
    const balance = await SpendLedger.getOrganizationBalance(req.user?.organizationId || '507f1f77bcf86cd799439011');

    // Get payment statistics
    const paymentStats = await CSRPayment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user?.organizationId || '507f1f77bcf86cd799439011'),
          createdAt: { $gte: defaultStartDate, $lte: defaultEndDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get HealCoins summary
    const healCoinsSummary = await SpendLedger.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user?.organizationId || '507f1f77bcf86cd799439011'),
          createdAt: { $gte: defaultStartDate, $lte: defaultEndDate },
          healCoinsAmount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$direction',
          totalHealCoins: { $sum: '$healCoinsAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        balance,
        spendSummary,
        paymentStats,
        healCoinsSummary,
        period: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial summary',
      error: error.message
    });
  }
};

// Helper function to create invoice for payment
const createInvoiceForPayment = async (payment) => {
  try {
    const organization = await Organization.findById(payment.organizationId);
    
    const invoice = new Invoice({
      paymentId: payment._id,
      organizationId: payment.organizationId,
      organizationDetails: {
        name: organization.name,
        address: organization.address,
        contactPerson: organization.contactPerson,
        email: organization.email,
        phone: organization.phone,
        gstNumber: organization.gstNumber,
        panNumber: organization.panNumber
      },
      currency: payment.currency,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lineItems: [{
        description: `Payment for ${payment.paymentType} - ${payment.paymentId}`,
        quantity: 1,
        unitPrice: payment.amount,
        totalPrice: payment.amount,
        category: payment.budgetCategory
      }],
      subtotal: payment.amount,
      totalAmount: payment.amount,
      generatedBy: payment.financeTeam.assignedTo,
      status: 'sent'
    });

    await invoice.save();
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export default {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  approvePayment,
  processPayment,
  getSpendLedger,
  getFinancialSummary
};
