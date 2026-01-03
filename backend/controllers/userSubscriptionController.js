import UserSubscription from '../models/UserSubscription.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay lazily (when first needed) to ensure dotenv has loaded
let razorpay = null;
let razorpayInitialized = false;

const initializeRazorpay = () => {
  if (razorpayInitialized) {
    return razorpay;
  }

  razorpayInitialized = true;
  
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (keyId && keySecret) {
      // Check if values are not placeholders
      if (keyId !== 'your_razorpay_key_id' && keySecret !== 'your_razorpay_key_secret') {
        razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        console.log('✅ Razorpay initialized successfully for subscriptions');
      } else {
        console.warn('⚠️ Razorpay credentials appear to be placeholders. Please update with actual values.');
      }
    } else {
      console.warn('⚠️ Razorpay environment variables not found. RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing.');
    }
  } catch (error) {
    console.error('❌ Razorpay initialization error:', error.message);
  }
  
  return razorpay;
};

// Plan configurations
const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const RENEWAL_WINDOW_DAYS = 45;

const normalizeContext = (context, userRole) => {
  const allowed = ['student', 'parent', 'admin', 'system'];
  if (context && allowed.includes(context)) {
    return context;
  }
  if (userRole && allowed.includes(userRole)) {
    return userRole;
  }
  return 'student';
};

const buildInitiatorProfile = (user, contextOverride) => ({
  userId: user._id,
  role: user.role,
  name: user.name || user.fullName || 'Unknown',
  email: user.email,
  context: normalizeContext(contextOverride, user.role),
});

const finalizeSubscriptionPayment = async (subscription, payment) => {
  if (!subscription || !payment) {
    return { updated: false };
  }

  const paymentId = payment.id;
  const transaction = subscription.transactions?.find(
    (tx) => tx.razorpayPaymentId === paymentId
  );

  if (!transaction) {
    return { updated: false };
  }

  const now = new Date();

  transaction.status = 'completed';
  transaction.paymentDate = now;
  transaction.receiptUrl = payment.receipt || null;
  transaction.metadata = {
    ...(transaction.metadata || {}),
    paymentStatus: payment.status,
  };

  subscription.status = 'active';

  const baseDate = (() => {
    if (!subscription.endDate) {
      return now;
    }
    const existingEnd = new Date(subscription.endDate);
    return existingEnd > now ? existingEnd : now;
  })();

  subscription.endDate = new Date(baseDate.getTime() + YEAR_IN_MS);
  subscription.lastPaymentAt = now;

  if (transaction.mode === 'renewal') {
    subscription.renewalCount = (subscription.renewalCount || 0) + 1;
    subscription.lastRenewedBy = {
      ...(transaction.initiatedBy || {}),
      renewedAt: now,
    };
  } else if (!subscription.purchasedBy?.userId) {
    subscription.purchasedBy = {
      ...(transaction.initiatedBy || {}),
      purchasedAt: now,
    };
  }

  await subscription.save();

  return {
    updated: true,
    subscription,
    transaction,
  };
};

const PLAN_CONFIGS = {
  free: {
    name: 'Free Plan',
    amount: 0,
    features: {
      fullAccess: false,
      parentDashboard: false,
      advancedAnalytics: false,
      certificates: false,
      wiseClubAccess: false,
      inavoraAccess: false,
      gamesPerPillar: 5,
      totalGames: 50,
    },
  },
  student_premium: {
    name: 'Students Premium Plan',
    amount: 4499,
    features: {
      fullAccess: true,
      parentDashboard: false,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  student_parent_premium_pro: {
    name: 'Student + Parent Premium Pro Plan',
    amount: 4999,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  educational_institutions_premium: {
    name: 'Educational Institutions Premium Plan',
    amount: 0,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1,
      totalGames: 2200,
    },
  },
};

// Create payment intent for subscription
export const createSubscriptionPayment = async (req, res) => {
  try {
    const {
      planType,
      context: requestedContext,
      mode: requestedMode,
      amount: customAmount, // Optional custom amount for special plans like parent_dashboard
    } = req.body;

    const user = req.user;
    const userId = user.id;
    const context = normalizeContext(requestedContext, user.role);
    const mode = requestedMode === 'renew' ? 'renewal' : 'purchase';

    if (!planType || !PLAN_CONFIGS[planType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type',
      });
    }

    if (planType === 'educational_institutions_premium') {
      return res.status(403).json({
        success: false,
        message: 'Educational plans are provisioned directly by your institution.',
      });
    }

    if ((user.role === 'parent' || context === 'parent') && planType !== 'student_parent_premium_pro') {
      return res.status(400).json({
        success: false,
        message: 'Parents can only purchase the Student + Parent Premium Pro Plan',
      });
    }

    const planConfig = PLAN_CONFIGS[planType];

    // Determine initiator
    const initiator = buildInitiatorProfile(user, context);

    // Load current subscriptions
    const existingActiveSubscription = await UserSubscription.getActiveSubscription(userId);
    const latestPlanSubscription = await UserSubscription.findOne({ userId, planType })
      .sort({ createdAt: -1 });

    const hasCompletedPlanBefore = Boolean(
      latestPlanSubscription &&
      (latestPlanSubscription.status === 'active' ||
        latestPlanSubscription.transactions?.some(tx => tx.status === 'completed'))
    );

    const isRenewalFlow = mode === 'renewal' || hasCompletedPlanBefore;

    if (existingActiveSubscription && existingActiveSubscription.planType === planType) {
      if (!isRenewalFlow) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active subscription for this plan',
        });
      }
    }

    // Use custom amount if provided, otherwise use plan config amount (same price for all purchases)
    const amount = customAmount !== undefined ? customAmount : planConfig.amount;

    if (amount === 0) {
      // Free plan - activate immediately
      const subscription = await UserSubscription.create({
        userId,
        planType,
        planName: planConfig.name,
        amount: 0,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + YEAR_IN_MS),
        features: planConfig.features,
        purchasedBy: {
          ...initiator,
          purchasedAt: new Date(),
        },
        transactions: [{
          transactionId: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          mode: 'purchase',
          initiatedBy: initiator,
          paymentDate: new Date(),
        }],
      });

      const io = req.app.get('io');
      if (io) {
        const payload = subscription.toObject();
        io.to(userId.toString()).emit('subscription:activated', {
          subscription: payload,
        });
        io.emit('subscription:activated', {
          userId: userId.toString(),
          subscription: payload,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Free plan activated successfully',
        subscription,
      });
    }

    // Initialize Razorpay lazily
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway is not configured. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your .env file and restart the server. If you need help, please contact support.',
      });
    }

    const userDoc = await User.findById(userId);

    if (!userDoc?.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for payment',
      });
    }

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      notes: {
        userId: userId.toString(),
        planType,
        mode,
        context,
        initiatedByRole: user.role,
      description: `Subscription: ${planConfig.name}`,
      },
    });

    const transactionId = `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const transactionPayload = {
      transactionId,
      amount,
      currency: 'INR',
      status: 'pending',
      mode,
      initiatedBy: initiator,
      razorpayOrderId: order.id,
    };

    let subscription;

    if (existingActiveSubscription && existingActiveSubscription.planType === planType) {
      subscription = existingActiveSubscription;
      subscription.transactions = subscription.transactions || [];
      subscription.transactions.push(transactionPayload);
      subscription.lastRenewedBy = {
        ...initiator,
        renewedAt: null,
      };
      await subscription.save();
    } else {
      subscription = await UserSubscription.create({
        userId,
        planType,
        planName: planConfig.name,
        amount,
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(Date.now() + YEAR_IN_MS),
        features: planConfig.features,
        purchasedBy: { ...initiator, purchasedAt: new Date() },
        renewalCount: 0,
        transactions: [transactionPayload],
      });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID || null,
      subscriptionId: subscription._id,
      amount,
      currency: 'INR',
      mode,
    });
  } catch (error) {
    console.error('Create subscription payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

// Verify and activate subscription after payment
export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { subscriptionId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const userId = req.user.id;

    if (!subscriptionId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID and Razorpay payment details are required',
      });
    }

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
      userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Initialize Razorpay
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway is not configured. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your .env file and restart the server.',
      });
    }

    // Verify Razorpay payment signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error. RAZORPAY_KEY_SECRET is missing.',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Verify payment with Razorpay
    const payment = await razorpayInstance.payments.fetch(razorpayPaymentId);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        message: `Payment ${payment.status}`,
      });
    }

    // Locate matching transaction
    const transaction = subscription.transactions?.find(
      (tx) => tx.razorpayOrderId === razorpayOrderId
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Matching transaction not found for this payment',
      });
    }

    // Update transaction with payment details
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.status = 'completed';
    transaction.paymentDate = new Date();
    transaction.receiptUrl = payment.receipt || null;
    transaction.metadata = {
      ...(transaction.metadata || {}),
      paymentStatus: payment.status,
    };

    const { updated, subscription: updatedSubscription } = await finalizeSubscriptionPayment(
      subscription,
      payment,
    );

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Unable to finalize subscription payment',
      });
    }

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const subscriptionData = updatedSubscription.toObject
        ? updatedSubscription.toObject()
        : updatedSubscription;
      // Emit to user's room (all their connected clients)
      io.to(userId.toString()).emit('subscription:activated', {
        userId: userId.toString(),
        subscription: subscriptionData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Verify subscription payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

// Get user's current subscription
export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;

    // If user is linked to a school, prioritize school-linked subscriptions
    let subscription = null;
    if (user.orgId && user.tenantId) {
      // Check school subscription status first
      const Subscription = (await import('../models/Subscription.js')).default;
      const schoolSubscription = await Subscription.findOne({
        orgId: user.orgId,
        tenantId: user.tenantId
      });

      if (schoolSubscription) {
        const now = new Date();
        // Use getActualStatus() if available, otherwise check endDate manually
        let actualStatus = schoolSubscription.status;
        if (schoolSubscription.getActualStatus) {
          actualStatus = schoolSubscription.getActualStatus();
        } else if (schoolSubscription.endDate) {
          const endDate = new Date(schoolSubscription.endDate);
          if (endDate <= now) {
            actualStatus = 'expired';
          }
        }
        
        const isSchoolActive = actualStatus === 'active' && 
                              (!schoolSubscription.endDate || new Date(schoolSubscription.endDate) > now);

        // First, try to find a school-linked subscription (even if expired)
        subscription = await UserSubscription.findOne({
          userId,
          'metadata.orgId': user.orgId,
          'metadata.tenantId': user.tenantId
        }).sort({ createdAt: -1 });

        // If school is expired and no school-linked subscription found, return free plan
        if (!isSchoolActive && !subscription) {
          const freePlan = {
            planType: 'free',
            planName: 'Free Plan',
            status: 'expired',
            features: PLAN_CONFIGS.free.features,
            isFirstYear: true,
            amount: 0,
          };
          return res.status(200).json({
            success: true,
            subscription: freePlan,
          });
        }

        // If school is expired, make sure we don't return an active premium subscription
        // Deactivate any active premium subscriptions that might be returned
        if (!isSchoolActive) {
          // Find and deactivate any active premium subscriptions
          const activePremiumSubs = await UserSubscription.find({
            userId,
            status: 'active',
            planType: { $ne: 'free' },
            $or: [
              { endDate: { $exists: false } },
              { endDate: { $gt: now } }
            ]
          });

          for (const activeSub of activePremiumSubs) {
            // Don't deactivate if it's the school-linked subscription we found
            if (!subscription || activeSub._id.toString() !== subscription._id.toString()) {
              activeSub.status = 'expired';
              activeSub.endDate = now;
              await activeSub.save();
            }
          }

          // If we have a school-linked subscription, use it (even if expired)
          // Otherwise, return free plan
          if (!subscription) {
            console.log(`📋 School expired, returning free plan for user ${userId}`);
            const freePlan = {
              planType: 'free',
              planName: 'Free Plan',
              status: 'expired',
              features: PLAN_CONFIGS.free.features,
              isFirstYear: true,
              amount: 0,
            };
            return res.status(200).json({
              success: true,
              subscription: freePlan,
            });
          } else {
            console.log(`📋 Using school-linked subscription for user ${userId}: planType=${subscription.planType}, status=${subscription.status}, fullAccess=${subscription.features?.fullAccess}`);
          }
        } else {
          // School is active, use school-linked subscription if found
          if (subscription) {
            console.log(`📋 Using school-linked subscription for user ${userId}: planType=${subscription.planType}, status=${subscription.status}, fullAccess=${subscription.features?.fullAccess}`);
          }
        }
      }
    }

    // If no school-linked subscription, get active subscription
    if (!subscription) {
      subscription = await UserSubscription.getActiveSubscription(userId);
    }
    
    // Check for pending subscriptions - treat as cancelled
    if (!subscription) {
      const latestSubscription = await UserSubscription.getLatestSubscription(userId);
      if (latestSubscription && latestSubscription.status === 'pending') {
        // Treat pending as cancelled - return free plan
        const freePlan = {
          planType: 'free',
          planName: 'Free Plan',
          status: 'active',
          features: PLAN_CONFIGS.free.features,
          isFirstYear: true,
          amount: 0,
        };
        return res.status(200).json({
          success: true,
          subscription: freePlan,
        });
      }
      
      // Return free plan defaults
      const freePlan = {
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: PLAN_CONFIGS.free.features,
        isFirstYear: true,
        amount: 0,
      };
      return res.status(200).json({
        success: true,
        subscription: freePlan,
      });
    }

    // Add computed fields for frontend
    const subscriptionData = subscription.toObject ? subscription.toObject() : subscription;
    
    // If subscription status is pending, treat as cancelled - return free plan
    if (subscriptionData.status === 'pending') {
      const freePlan = {
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: PLAN_CONFIGS.free.features,
        isFirstYear: true,
        amount: 0,
      };
      return res.status(200).json({
        success: true,
        subscription: freePlan,
      });
    }
    subscriptionData.daysRemaining = subscription.daysRemaining ? subscription.daysRemaining() : null;
    subscriptionData.latestTransaction = subscriptionData.transactions?.length
      ? subscriptionData.transactions[subscriptionData.transactions.length - 1]
      : null;

    // Log what subscription is being returned
    console.log(`📋 Returning subscription for user ${userId}: planType=${subscriptionData.planType}, status=${subscriptionData.status}, fullAccess=${subscriptionData.features?.fullAccess}, gamesPerPillar=${subscriptionData.features?.gamesPerPillar}`);

    if (subscriptionData.endDate) {
      const endDate = new Date(subscriptionData.endDate);
      const now = new Date();
      const renewalWindowStart = new Date(endDate.getTime() - RENEWAL_WINDOW_DAYS * 24 * 60 * 60 * 1000);
      subscriptionData.isRenewalDue = endDate <= now;
      subscriptionData.isWithinRenewalWindow = now >= renewalWindowStart;
    } else {
      subscriptionData.isRenewalDue = false;
      subscriptionData.isWithinRenewalWindow = true;
    }

    res.status(200).json({
      success: true,
      subscription: subscriptionData,
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message,
    });
  }
};

// Get subscription history
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await UserSubscription.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // Use lean() for better performance

    // Format subscriptions for frontend
    const formattedSubscriptions = subscriptions.map(sub => ({
      ...sub,
      planName: sub.planName || PLAN_CONFIGS[sub.planType]?.name || 'Unknown Plan',
      amount: sub.amount || PLAN_CONFIGS[sub.planType]?.amount || 0,
    }));

    res.status(200).json({
      success: true,
      subscriptions: formattedSubscriptions,
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription history',
      error: error.message,
    });
  }
};

export const getSubscriptionTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await UserSubscription.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const activeSubscription = subscriptions.find((sub) => {
      if (sub.status !== 'active') return false;
      if (!sub.endDate) return true;
      return new Date(sub.endDate) > now;
    }) || null;

    const transactions = [];
    let totalSpend = 0;
    let totalRenewals = 0;
    let lastPaymentDate = null;

    subscriptions.forEach((sub) => {
      const planName = sub.planName || PLAN_CONFIGS[sub.planType]?.name || 'Unknown Plan';

      (sub.transactions || []).forEach((tx) => {
        const paymentDate = tx.paymentDate ? new Date(tx.paymentDate) : null;
        const createdAt = tx.createdAt ? new Date(tx.createdAt) : new Date(sub.createdAt);
        const mode = tx.mode || (sub.isFirstYear ? 'purchase' : 'renewal');
        const status = tx.status || 'pending';
        const amount = typeof tx.amount === 'number' ? tx.amount : (sub.amount || 0);

        if (status === 'completed') {
          totalSpend += amount;
          if (mode === 'renewal') {
            totalRenewals += 1;
          }
          if (paymentDate && (!lastPaymentDate || paymentDate > lastPaymentDate)) {
            lastPaymentDate = paymentDate;
          }
        }

        transactions.push({
          transactionId: tx.transactionId,
          subscriptionId: sub._id,
          planType: sub.planType,
          planName,
          amount,
          currency: tx.currency || 'INR',
          status,
          mode,
          paymentDate,
          createdAt,
          receiptUrl: tx.receiptUrl,
          initiatedBy: tx.initiatedBy || sub.purchasedBy || null,
          metadata: tx.metadata || {},
        });
      });
    });

    transactions.sort((a, b) => {
      const aDate = a.paymentDate || a.createdAt;
      const bDate = b.paymentDate || b.createdAt;
      return new Date(bDate) - new Date(aDate);
    });

    res.status(200).json({
      success: true,
      transactions,
      summary: {
        totalSpend,
        totalTransactions: transactions.length,
        totalRenewals,
        lastPaymentDate,
        nextRenewalDate: activeSubscription?.endDate || null,
        activePlan: activeSubscription
          ? {
              planName: activeSubscription.planName || PLAN_CONFIGS[activeSubscription.planType]?.name,
              planType: activeSubscription.planType,
              status: activeSubscription.status,
              endDate: activeSubscription.endDate,
              renewalCount: activeSubscription.renewalCount || 0,
              purchasedBy: activeSubscription.purchasedBy || null,
              lastRenewedBy: activeSubscription.lastRenewedBy || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Get subscription transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription transactions',
      error: error.message,
    });
  }
};

export const updateAutoRenewSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      enabled,
      method,
      paymentMethodId,
      paymentMethodLabel,
      lastFour,
      brand,
    } = req.body || {};

    if (typeof enabled !== 'boolean' && !method && !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update',
      });
    }

    const subscription = await UserSubscription.getActiveSubscription(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    const nextEnabled = typeof enabled === 'boolean'
      ? enabled
      : subscription.autoRenewSettings?.enabled ?? subscription.autoRenew ?? false;

    const nextMethod = method || subscription.autoRenewSettings?.method || 'card';

    subscription.autoRenew = nextEnabled;
    subscription.autoRenewSettings = {
      ...(subscription.autoRenewSettings?.toObject
        ? subscription.autoRenewSettings.toObject()
        : subscription.autoRenewSettings),
      enabled: nextEnabled,
      method: nextMethod,
      paymentMethodId: paymentMethodId || subscription.autoRenewSettings?.paymentMethodId || null,
      paymentMethodLabel: paymentMethodLabel || subscription.autoRenewSettings?.paymentMethodLabel || null,
      lastFour: lastFour || subscription.autoRenewSettings?.lastFour || null,
      brand: brand || subscription.autoRenewSettings?.brand || null,
      mandateStatus: subscription.autoRenewSettings?.mandateStatus || (nextEnabled ? 'pending' : 'not_required'),
      nextDebitDate: subscription.endDate || subscription.autoRenewSettings?.nextDebitDate || null,
      updatedAt: new Date(),
      updatedBy: {
        userId: req.user._id || req.user.id,
        role: req.user.role,
        name: req.user.name || req.user.fullName,
        email: req.user.email,
      },
    };

    // Note: Razorpay doesn't store payment methods like Stripe
    // Payment method info is stored in autoRenewSettings if needed

    await subscription.save();

    const io = req.app.get('io');
    if (io) {
      const payload = subscription.toObject ? subscription.toObject() : subscription;
      io.to(userId.toString()).emit('subscription:autoRenewUpdated', {
        userId: userId.toString(),
        subscription: payload,
      });
    }

    res.status(200).json({
      success: true,
      message: `Auto-renew ${nextEnabled ? 'enabled' : 'disabled'} successfully`,
      subscription,
    });
  } catch (error) {
    console.error('Update auto-renew settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update auto-renew settings',
      error: error.message,
    });
  }
};

// Cancel pending payment when user closes payment window
export const cancelPendingPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
      userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Update pending transactions to cancelled
    let hasPendingTransactions = false;
    let updatedTransactions = false;
    
    if (subscription.transactions && subscription.transactions.length > 0) {
      subscription.transactions.forEach((tx, index) => {
        if (tx.status === 'pending') {
          hasPendingTransactions = true;
          // Update transaction status
          subscription.transactions[index].status = 'cancelled';
          updatedTransactions = true;
        }
      });
      
      // Mark the transactions array as modified so Mongoose saves it
      if (updatedTransactions) {
        subscription.markModified('transactions');
      }
    }

    // Update subscription status if it's pending or if we cancelled transactions
    if (subscription.status === 'pending') {
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date();
    } else if (hasPendingTransactions && !subscription.cancelledAt) {
      // If subscription is not pending but has pending transactions, just mark cancelledAt
      subscription.cancelledAt = new Date();
    }

    await subscription.save();

    // Also cancel any other pending transactions in other subscriptions for this user
    // This handles cases where there might be multiple pending subscriptions
    const allSubscriptions = await UserSubscription.find({ userId });
    let totalCancelled = 0;
    
    for (const sub of allSubscriptions) {
      if (sub._id.toString() === subscriptionId.toString()) continue; // Already handled above
      
      let hasPending = false;
      if (sub.transactions && sub.transactions.length > 0) {
        sub.transactions.forEach((tx, index) => {
          if (tx.status === 'pending') {
            hasPending = true;
            sub.transactions[index].status = 'cancelled';
            totalCancelled++;
          }
        });
        
        if (hasPending) {
          sub.markModified('transactions');
          if (sub.status === 'pending') {
            sub.status = 'cancelled';
            sub.cancelledAt = new Date();
          }
          await sub.save();
        }
      }
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const subscriptionData = subscription.toObject ? subscription.toObject() : subscription;
      io.to(userId.toString()).emit('subscription:cancelled', {
        userId: userId.toString(),
        subscription: subscriptionData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment cancelled successfully',
      subscription,
    });
  } catch (error) {
    console.error('Cancel pending payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel pending payment',
      error: error.message,
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await UserSubscription.getActiveSubscription(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;

    // Note: Razorpay doesn't have recurring subscriptions like Stripe
    // Auto-renewal is handled manually via scheduled jobs

    await subscription.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const subscriptionData = subscription.toObject ? subscription.toObject() : subscription;
      subscriptionData.daysRemaining = subscription.daysRemaining ? subscription.daysRemaining() : null;
      io.to(userId.toString()).emit('subscription:cancelled', {
        userId: userId.toString(),
        subscription: subscriptionData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message,
    });
  }
};

// Handle Razorpay webhook
export const handleRazorpayWebhook = async (req, res) => {
  const razorpayInstance = initializeRazorpay();
  if (!razorpayInstance) {
    return res.status(500).json({ error: 'Razorpay not configured' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const signature = req.headers['x-razorpay-signature'];

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Webhook signature verification failed');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const event = req.body;

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;
        const userId = payment.notes?.userId;
        const purpose = payment.notes?.purpose;

        // Handle subscription payments
        if (userId && orderId && purpose !== 'parent_registration') {
          const subscription = await UserSubscription.findOne({
            userId,
            'transactions.razorpayOrderId': orderId,
          });

          if (subscription) {
            const { updated } = await finalizeSubscriptionPayment(subscription, payment);

            if (updated) {
              const io = req.app.get('io');
              if (io) {
                const payload = subscription.toObject ? subscription.toObject() : subscription;
                io.to(userId.toString()).emit('subscription:activated', {
                  userId: userId.toString(),
                  subscription: payload,
                });
              }
            }
          }
        }

        // Handle parent registration payments
        if (purpose === 'parent_registration' && orderId) {
          const ParentRegistrationIntent = (await import('../models/ParentRegistrationIntent.js')).default;
          const intent = await ParentRegistrationIntent.findOne({
            razorpayOrderId: orderId,
            status: 'payment_pending',
          });

          if (intent) {
            // Payment is completed, but account creation happens when user confirms via frontend
            // We can mark it as completed or keep it as payment_pending until user confirms
            // The frontend will handle the confirmation flow
            console.log(`Parent registration payment completed for intent: ${intent._id}`);

            // Emit notification if needed
            const io = req.app.get('io');
            if (io && intent.email) {
              // Could emit to a room based on email or intent ID
              io.emit('parent_registration:payment_completed', {
                intentId: intent._id,
                email: intent.email,
              });
            }
          }
        }

        // Handle additional child link payments
        if (purpose === 'additional_child_link' && orderId) {
          const parentId = payment.notes?.parentId;
          if (parentId) {
            // Payment completed for additional child link
            // The actual linking happens when parent confirms via the frontend
            const io = req.app.get('io');
            if (io) {
              io.to(parentId.toString()).emit('additional_child_link:payment_completed', {
                orderId,
                parentId,
              });
            }
          }
        }

        // Handle parent create child payments
        if (purpose === 'parent_create_child' && orderId) {
          const ChildCreationIntent = (await import('../models/ChildCreationIntent.js')).default;
          const intent = await ChildCreationIntent.findOne({
            razorpayOrderId: orderId,
            status: 'payment_pending',
          });

          if (intent) {
            intent.status = 'payment_completed';
            await intent.save();

            const io = req.app.get('io');
            if (io && intent.parentId) {
              io.to(intent.parentId.toString()).emit('child_creation:payment_completed', {
                intentId: intent._id,
                parentId: intent.parentId,
                childEmail: intent.email,
              });
            }
          }
        }

        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;
        const userId = payment.notes?.userId;

        if (userId && orderId) {
          const subscription = await UserSubscription.findOne({
            userId,
            'transactions.razorpayOrderId': orderId,
          });

          if (subscription) {
            const transaction = subscription.transactions.find(
              t => t.razorpayOrderId === orderId
            );
            if (transaction) {
              transaction.status = 'failed';
              transaction.metadata = {
                ...(transaction.metadata || {}),
                paymentStatus: payment.status,
                failureReason: payment.error_description || 'Payment failed',
              };
            }
            await subscription.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

