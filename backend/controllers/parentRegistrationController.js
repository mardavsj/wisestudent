import bcrypt from 'bcrypt';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import ParentRegistrationIntent from '../models/ParentRegistrationIntent.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Company from '../models/Company.js';
import UserSubscription from '../models/UserSubscription.js';
import SchoolClass from '../models/School/SchoolClass.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import Subscription from '../models/Subscription.js';
import { generateToken } from '../utils/generateToken.js';

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
        console.log('✅ Razorpay initialized successfully');
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
const PARENT_PLAN_PRICE = 4999;
const PARENT_STUDENT_PREMIUM_UPGRADE_PRICE = 1000;

const FREE_PLAN_FEATURES = {
  fullAccess: false,
  parentDashboard: false,
  advancedAnalytics: false,
  certificates: false,
  wiseClubAccess: false,
  inavoraAccess: false,
  gamesPerPillar: 5,
  totalGames: 50,
};
const STUDENT_PREMIUM_FEATURES = {
  fullAccess: true,
  parentDashboard: false,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const STUDENT_PARENT_PREMIUM_PRO_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const EDUCATIONAL_INSTITUTIONS_PREMIUM_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const calculateTargetPlan = (childPlanType) => {
  // Plan 1: student_parent_premium_pro - No payment needed, redirect to dashboard
  if (childPlanType === 'student_parent_premium_pro') {
    return { planType: 'student_parent_premium_pro', amount: 0, mode: 'existing_family_plan' };
  }
  
  // Plan 2: student_premium - Parent pays 1000 for parent dashboard access
  if (childPlanType === 'student_premium') {
    return { planType: 'student_parent_premium_pro', amount: PARENT_STUDENT_PREMIUM_UPGRADE_PRICE, mode: 'student_upgrade' };
  }
  
  // Plan 3: educational_institutions_premium - Parent pays 1000 for parent dashboard access
  if (childPlanType === 'educational_institutions_premium') {
    return { planType: 'student_parent_premium_pro', amount: PARENT_STUDENT_PREMIUM_UPGRADE_PRICE, mode: 'educational_institution_upgrade' };
  }
  
  // Plan 4: free - Parent pays 5000 for student + parent premium pro plan
  return { planType: 'student_parent_premium_pro', amount: PARENT_PLAN_PRICE, mode: 'family_upgrade' };
};

const createRazorpayOrder = async ({ amount, currency, metadata }) => {
  const razorpayInstance = initializeRazorpay();
  
  if (!razorpayInstance) {
    const fakeOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const metadataString = Object.entries(metadata || {})
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    return {
      id: fakeOrderId,
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
      metadata,
      __mocked: true,
      description: `Mocked payment for ${metadata.planType || 'plan'} [${metadataString}]`,
    };
  }

  const order = await razorpayInstance.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency.toUpperCase(),
    receipt: `receipt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    notes: metadata,
  });
  return order;
};

export const initiateParentRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      flow,
      childLinkingCode,
    } = req.body;

    if (!name || !email || !password || !flow) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    let childUser = null;
    let childPlanType = null;
    if (flow === 'child_existing') {
      if (!childLinkingCode) {
        return res.status(400).json({ success: false, message: 'Child linking code is required.' });
      }
      childUser = await User.findOne({ linkingCode: childLinkingCode.trim().toUpperCase() });
      if (!childUser || !['student', 'school_student'].includes(childUser.role)) {
        return res.status(404).json({ success: false, message: 'Child account not found for the provided code.' });
      }
      const childSubscription = await UserSubscription.getActiveSubscription(childUser._id);
      childPlanType = childSubscription?.planType || 'free';
    }

    const targetPlan = calculateTargetPlan(childPlanType);

    // Only check for Razorpay if payment is required
    if (targetPlan.amount > 0) {
      // Initialize Razorpay lazily
      const razorpayInstance = initializeRazorpay();
      if (!razorpayInstance) {
        console.error('❌ Razorpay not configured but payment required:', {
          amount: targetPlan.amount,
          hasKeyId: !!process.env.RAZORPAY_KEY_ID,
          hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
          keyIdPreview: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'missing',
        });
        return res.status(500).json({ 
          success: false, 
          message: 'Payment gateway not configured. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your .env file and restart the server.',
          debug: process.env.NODE_ENV === 'development' ? {
            hasKeyId: !!process.env.RAZORPAY_KEY_ID,
            hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
            keyIdPreview: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'missing',
          } : undefined
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const metadata = {
      purpose: 'parent_registration',
      parentEmail: normalizedEmail,
      flow,
      childUserId: childUser?._id?.toString() || '',
      childPlanType: childPlanType || 'free',
      planType: targetPlan.planType,
      amount: targetPlan.amount.toString(),
    };

    let razorpayOrder = null;
    if (targetPlan.amount > 0) {
      const razorpayInstance = initializeRazorpay();
      if (!razorpayInstance) {
        console.error('❌ Attempted to create Razorpay order but Razorpay is not initialized');
        return res.status(500).json({ 
          success: false, 
          message: 'Payment gateway not configured. Please contact support.' 
        });
      }
      razorpayOrder = await createRazorpayOrder({
        amount: targetPlan.amount,
        currency: 'INR',
        metadata,
      });
    }

    const intent = await ParentRegistrationIntent.create({
      email: normalizedEmail,
      name,
      passwordHash: hashedPassword,
      flow,
      childUserId: childUser?._id,
      childSubscriptionPlan: childPlanType || null,
      planType: targetPlan.planType,
      amount: targetPlan.amount,
      currency: 'INR',
      razorpayOrderId: razorpayOrder?.id || null,
      status: targetPlan.amount > 0 ? 'payment_pending' : 'completed',
      metadata: metadata,
      expiresAt: new Date(Date.now() + (targetPlan.amount > 0 ? 60 : 15) * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      intentId: intent._id,
      requiresPayment: targetPlan.amount > 0,
      orderId: razorpayOrder?.id || null,
      amount: targetPlan.amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || null,
      planType: targetPlan.planType,
      flow,
    });
  } catch (error) {
    console.error('initiateParentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate parent registration' });
  }
};

const createParentAccountFromIntent = async (intent, paymentIntentId = null) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const parentUser = await User.create([{
      name: intent.name,
      fullName: intent.name,
      email: intent.email,
      password: intent.passwordHash,
      role: 'parent',
      isVerified: true,
      approvalStatus: 'approved',
    }], { session });

    const parent = parentUser[0];

    if (intent.childUserId) {
      await User.updateOne(
        { _id: intent.childUserId },
        {
          $addToSet: { 'linkedIds.parentIds': parent._id },
        },
        { session },
      );
      await User.updateOne(
        { _id: parent._id },
        {
          $addToSet: { 'linkedIds.childIds': intent.childUserId },
        },
        { session },
      );
    }

    const childId = intent.childUserId || null;

    const parentPlanEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const subscriptionPayload = {
      planType: 'student_parent_premium_pro',
      planName: 'Student + Parent Premium Pro Plan',
      amount: intent.amount,
      status: 'active',
      startDate: new Date(),
      endDate: parentPlanEndDate,
      features: {
        ...STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      },
      transactions: paymentIntentId ? [{
        transactionId: `reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        amount: intent.amount,
        currency: 'INR',
        status: 'completed',
        paymentDate: new Date(),
          razorpayOrderId: intent.razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId,
      }] : [],
      metadata: {
        parentRegistrationIntentId: intent._id,
        childUserId: childId,
      },
    };

    if (childId) {
      const existingChildSub = await UserSubscription.getActiveSubscription(childId);
      const childPlanType = existingChildSub?.planType || 'free';
      
      // Only upgrade child if they don't already have student_parent_premium_pro or educational_institutions_premium
      if (!existingChildSub || (existingChildSub.planType !== 'student_parent_premium_pro' && existingChildSub.planType !== 'educational_institutions_premium')) {
        await UserSubscription.create([{
          userId: childId,
          ...subscriptionPayload,
        }], { session });
      } else {
        // Child already has a premium plan, just update transactions if payment was made
        existingChildSub.transactions = existingChildSub.transactions || [];
        if (paymentIntentId) {
          existingChildSub.transactions.push({
            transactionId: `reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: intent.amount,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          razorpayOrderId: intent.razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId,
          });
        }
        // Keep existing plan type (educational_institutions_premium or student_parent_premium_pro)
        existingChildSub.planName = subscriptionPayload.planName;
        existingChildSub.features = subscriptionPayload.features;
        existingChildSub.endDate = parentPlanEndDate;
        await existingChildSub.save({ session });
      }
    }

    await UserSubscription.create([{
      userId: parent._id,
      ...subscriptionPayload,
    }], { session });

    await ParentRegistrationIntent.deleteOne({ _id: intent._id }, { session });

    await session.commitTransaction();

    return parent;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const confirmParentRegistration = async (req, res) => {
  try {
    const { intentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!intentId) {
      return res.status(400).json({ success: false, message: 'Intent ID is required' });
    }

    const intent = await ParentRegistrationIntent.findById(intentId);
    if (!intent) {
      return res.status(404).json({ success: false, message: 'Registration intent not found' });
    }

    if (intent.status === 'completed') {
      const existingUser = await User.findOne({ email: intent.email });
      if (existingUser) {
        return res.status(200).json({ success: true, user: existingUser });
      }
    }

    if (intent.amount > 0 && intent.razorpayOrderId && !intent.metadata?.__mocked) {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Payment details are required' });
      }
      const razorpayInstance = initializeRazorpay();
      if (!razorpayInstance) {
        return res.status(500).json({ success: false, message: 'Payment gateway not configured.' });
      }
      
      // Verify Razorpay payment signature
      const crypto = (await import('crypto')).default;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');
      
      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
      }

      // Verify payment status from Razorpay
      try {
        const payment = await razorpayInstance.payments.fetch(razorpayPaymentId);
        if (payment.status !== 'captured' && payment.status !== 'authorized') {
          return res.status(400).json({ success: false, message: 'Payment not completed yet.' });
        }
      } catch (err) {
        console.error('Razorpay payment verification error:', err);
        return res.status(400).json({ success: false, message: 'Failed to verify payment.' });
      }
    }

    const parentUser = await createParentAccountFromIntent(intent, razorpayPaymentId);

    const token = generateToken(parentUser._id);

    res.cookie("finmen_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      user: {
        id: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        role: parentUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('confirmParentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to finalize parent registration' });
  }
};

export const linkStudentToParent = async (req, res) => {
  try {
    const { childEmail, parentLinkingCode } = req.body;

    if (!childEmail || !parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Child email and parent code required.' });
    }

    const child = await User.findOne({ 
      email: childEmail.toLowerCase(), 
      role: { $in: ['student', 'school_student'] } 
    });
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child account not found.' });
    }

    const parent = await User.findOne({ linkingCode: parentLinkingCode.toUpperCase(), role: 'parent' });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    // Check if already linked
    if (parent.linkedIds?.childIds?.includes(child._id)) {
      return res.status(400).json({ success: false, message: 'This child is already linked to your account.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    const isFamilyPlanActive = parentSubscription?.planType === 'student_parent_premium_pro';

    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    if (!isFamilyPlanActive) {
      return res.status(400).json({ success: false, message: 'Parent plan is not active. Ask parent to complete setup.' });
    }

    // Check if this is an additional child (parent already has at least one child linked)
    const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
    const isAdditionalChild = existingChildrenCount > 0;

    // Calculate payment amount for additional children
    let paymentAmount = 0;
    if (isAdditionalChild) {
      if (childPlanType === 'student_parent_premium_pro') {
        // No payment needed
        paymentAmount = 0;
      } else if (childPlanType === 'student_premium' || childPlanType === 'educational_institutions_premium') {
        // Parent pays 1000 for parent dashboard access
        paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE;
      } else {
        // Child has free plan - parent pays 5000 for student + parent premium pro
        paymentAmount = PARENT_PLAN_PRICE;
      }

      // If payment is required, return payment information
      if (paymentAmount > 0) {
        return res.status(402).json({
          success: false,
          requiresPayment: true,
          amount: paymentAmount,
          currency: 'INR',
          message: `To link this child, you need to pay ₹${paymentAmount}. Please use the payment endpoint to complete the transaction.`,
          childPlanType: childPlanType,
        });
      }
    }

    // Link the child (either first child or additional child with no payment needed)
    // Upgrade child's plan if needed
    if (childPlanType !== 'student_parent_premium_pro' && childPlanType !== 'educational_institutions_premium') {
      if (childSubscription) {
        childSubscription.transactions = childSubscription.transactions || [];
        childSubscription.transactions.push({
          transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
        });
        childSubscription.planType = 'student_parent_premium_pro';
        childSubscription.planName = 'Student + Parent Premium Pro Plan';
        childSubscription.features = parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES;
        childSubscription.endDate = parentSubscription.endDate;
        await childSubscription.save();
      } else {
        await UserSubscription.create({
          userId: child._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: parentSubscription?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: parentSubscription?.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            linkedVia: 'parent_linking_code',
            parentId: parent._id,
          },
        });
      }
    }

    await User.updateOne({ _id: child._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': child._id } });

    // Add child's email to parent's childEmail array if not already present
    await User.updateOne(
      { _id: parent._id },
      { $addToSet: { childEmail: child.email } }
    );

    // Create notifications for both parent and child
    const Notification = (await import('../models/Notification.js')).default;
    const parentNotification = await Notification.create({
      userId: parent._id,
      type: 'parent_linking',
      title: 'Child Linked Successfully',
      message: `${child.name || child.email} has been successfully linked to your account.`,
      metadata: {
        childId: child._id,
        childName: child.name,
        childEmail: child.email,
        linkedAt: new Date(),
      },
    });

    const childNotification = await Notification.create({
      userId: child._id,
      type: 'parent_linking',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
        linkedAt: new Date(),
      },
    });

    // Emit realtime notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('notification', parentNotification);
      io.to(child._id.toString()).emit('notification', childNotification);
      io.to(parent._id.toString()).emit('child_linked', {
        childId: child._id,
        childName: child.name,
        childEmail: child.email,
      });
      io.to(child._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Child linked to parent successfully.',
      childPlan: 'student_parent_premium_pro',
    });
  } catch (error) {
    console.error('linkStudentToParent error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link student to parent' });
  }
};

export const verifyParentLinkCode = async (req, res) => {
  try {
    const { parentLinkingCode } = req.body;
    if (!parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Parent linking code is required.' });
    }

    const parent = await User.findOne({ linkingCode: parentLinkingCode.trim().toUpperCase(), role: 'parent' });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);

    res.status(200).json({
      success: true,
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
        linkingCode: parent.linkingCode,
      },
      planType: parentSubscription?.planType || null,
    });
  } catch (error) {
    console.error('verifyParentLinkCode error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify parent code' });
  }
};

export const initiateStudentRegistration = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      flow,
      parentLinkingCode,
      gender,
      schoolLinkingCode,
    } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !flow || !gender) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const allowedFlows = ['parent_exists', 'parent_not_created', 'school_link'];
    if (!allowedFlows.includes(flow)) {
      return res.status(400).json({ success: false, message: 'Invalid registration flow selected.' });
    }

    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth format.' });
    }
    const now = new Date();
    if (parsedDob > now) {
      return res.status(400).json({ success: false, message: 'Date of birth cannot be in the future.' });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedGender = String(gender).trim();
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];

    if (!allowedGenders.includes(normalizedGender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    let parent = null;
    if (flow === 'parent_exists') {
      if (!parentLinkingCode) {
        return res.status(400).json({ success: false, message: 'Parent linking code required.' });
      }
      parent = await User.findOne({ linkingCode: parentLinkingCode.trim().toUpperCase(), role: 'parent' });
      if (!parent) {
        return res.status(404).json({ success: false, message: 'Parent not found for provided code.' });
      }
      
      // Check if parent already has linked children
      const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
      if (existingChildrenCount > 0) {
        // Parent already has linked children - return special response
        return res.status(200).json({
          success: true,
          requiresPlanSelection: true,
          message: 'Parent is already linked with another child. Please choose a plan to continue.',
          parentId: parent._id,
          parentName: parent.name || parent.fullName,
          existingChildrenCount,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let schoolContext = null;

    // For parent_not_created flow, require plan selection through standalone endpoint
    if (flow === 'parent_not_created') {
      return res.status(400).json({ 
        success: false, 
        message: 'Plan selection is required. Please use the standalone plan selection endpoint.',
        requiresPlanSelection: true,
      });
    }

    if (flow === 'school_link') {
      if (!schoolLinkingCode || !schoolLinkingCode.trim()) {
        return res.status(400).json({ success: false, message: 'School linking code required.' });
      }

      const normalizedSchoolCode = schoolLinkingCode.trim().toUpperCase();

      let teacher = await User.findOne({ 'metadata.registrationCodes.code': normalizedSchoolCode });
      if (!teacher) {
        teacher = await User.findOne({
          'metadata.registrationCodes.code': schoolLinkingCode.trim(),
        });
      }

      let registrationRecord = null;
      let schoolClass = null;
      let organization = null;

      if (teacher) {
        const registrationEntries = Array.isArray(teacher.metadata?.registrationCodes)
          ? teacher.metadata.registrationCodes
          : [];
        registrationRecord = registrationEntries.find(
          (entry) => String(entry?.code || '').toUpperCase() === normalizedSchoolCode,
        );
      }

      if (registrationRecord) {
        if (registrationRecord.expiresAt && new Date(registrationRecord.expiresAt) < new Date()) {
          return res.status(400).json({ success: false, message: 'This school code has expired.' });
        }

        if (!registrationRecord.classId) {
          return res.status(400).json({ success: false, message: 'This school code is missing class information.' });
        }

        schoolClass = await SchoolClass.findById(registrationRecord.classId).lean();
        if (!schoolClass) {
          return res.status(404).json({ success: false, message: 'Class not found for provided school code.' });
        }
      } else {
        organization = await Organization.findOne({
          linkingCode: normalizedSchoolCode,
        }).lean();

        if (!organization) {
          organization = await Organization.findOne({ linkingCode: schoolLinkingCode.trim() }).lean();
        }

        if (!organization) {
          return res.status(404).json({ success: false, message: 'No school found for the provided code.' });
        }
      }

      const targetOrgId = schoolClass?.orgId || organization?._id;
      const targetTenantId = schoolClass?.tenantId || organization?.tenantId;

      const subscription = await Subscription.findOne({
        tenantId: targetTenantId,
        orgId: targetOrgId,
      }).lean();

      const now = new Date();
      let isPlanActive = false;
      let planStatus = 'inactive';
      let planEndDate = null;

      let subscriptionPlanName = null;

      if (subscription) {
        subscriptionPlanName = subscription.plan?.name || subscription.plan?.planType || null;
        const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
        if (subscription.status === 'active' && (!endDate || endDate > now)) {
          isPlanActive = true;
          planStatus = 'active';
          planEndDate = endDate;
        } else {
          planStatus = subscription.status || 'inactive';
          planEndDate = endDate && endDate > now ? endDate : null;
        }
      }

      schoolContext = {
        teacherId: teacher?._id || null,
        tenantId: targetTenantId,
        orgId: targetOrgId,
        classId: schoolClass?._id || null,
        academicYear: schoolClass?.academicYear || organization?.settings?.academicYear?.current || null,
        classNumber: schoolClass?.classNumber || null,
        registrationCode: normalizedSchoolCode,
        className: registrationRecord?.className || organization?.name || null,
        section: registrationRecord?.section || null,
        plan: {
          isActive: isPlanActive,
          status: planStatus,
          planType: isPlanActive
            ? (subscriptionPlanName === 'student_parent_premium_pro' ? 'student_parent_premium_pro'
              : subscriptionPlanName === 'educational_institutions_premium' ? 'educational_institutions_premium'
              : 'student_premium')
            : 'free',
          endDate: planEndDate,
        },
      };
    }

    res.status(200).json({
      success: true,
      payload: {
        name: fullName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        dateOfBirth: parsedDob,
        flow,
        gender: normalizedGender,
        parentId: parent?._id || null,
        schoolContext,
      },
    });
  } catch (error) {
    console.error('initiateStudentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate student registration' });
  }
};

export const finalizeStudentRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      passwordHash,
      dateOfBirth,
      flow,
      parentId,
      parentPlanType,
      gender,
      schoolContext,
      selectedPlan,
    } = req.body;

    if (!name || !email || !passwordHash || !dateOfBirth || !flow || !gender) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!allowedGenders.includes(String(gender).trim())) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }

    const dobValue = new Date(dateOfBirth);
    if (Number.isNaN(dobValue.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth.' });
    }

    if (flow === 'school_link' && !schoolContext) {
      return res.status(400).json({ success: false, message: 'School context missing for school registration flow.' });
    }

    const targetRole = flow === 'school_link' ? 'school_student' : 'student';
    const userDoc = {
      name,
      fullName: name,
      email,
      password: passwordHash,
      role: targetRole,
      dateOfBirth: dobValue,
      dob: dobValue.toISOString(),
      gender,
      isVerified: false,
    };

    if (flow === 'school_link' && schoolContext) {
      if (!schoolContext.orgId) {
        return res.status(400).json({ success: false, message: 'School information missing for registration.' });
      }

      const company = await Company.findOne({ organizations: schoolContext.orgId }).lean();
      const studentLimit = Number(company?.academicInfo?.totalStudents) || 0;
      if (studentLimit > 0) {
        const currentStudents = await SchoolStudent.countDocuments({ orgId: schoolContext.orgId });
        if (currentStudents >= studentLimit) {
          return res.status(403).json({
            success: false,
            message: 'You can’t register because your school has reached its maximum number of student seats. Please contact your school.',
          });
        }
      }

      userDoc.tenantId = schoolContext.tenantId;
      userDoc.orgId = schoolContext.orgId;
      const planExpiryDate = schoolContext?.plan?.endDate ? new Date(schoolContext.plan.endDate) : null;
      userDoc.metadata = {
        schoolEnrollment: {
          registrationCode: schoolContext.registrationCode,
          classId: schoolContext.classId,
          classNumber: schoolContext.classNumber,
          className: schoolContext.className || null,
          academicYear: schoolContext.academicYear || null,
          linkedTeacherId: schoolContext.teacherId || null,
          planStatus: schoolContext.plan?.status || 'inactive',
          planExpiresAt: planExpiryDate,
          linkedAt: new Date(),
        },
      };
    }

    const studentDoc = await User.create(userDoc);

    let createdPlanType = 'free';
    if (flow === 'parent_exists' && parentId) {
      // Always link parent and student when parent_exists flow is used
      await User.updateOne({ _id: studentDoc._id }, { $addToSet: { 'linkedIds.parentIds': parentId } });
      await User.updateOne({ _id: parentId }, { $addToSet: { 'linkedIds.childIds': studentDoc._id } });
      
      // Add student's email to parent's childEmail array if not already present
      await User.updateOne(
        { _id: parentId },
        { $addToSet: { childEmail: email } }
      );

      // If selectedPlan is provided (from plan selection modal), use it
      if (selectedPlan && selectedPlan !== 'free') {
        const planFeatures = {
          student_premium: STUDENT_PREMIUM_FEATURES,
          student_parent_premium_pro: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
        };
        const planAmounts = {
          student_premium: 4499,
          student_parent_premium_pro: 4999,
        };
        const planNames = {
          student_premium: 'Students Premium Plan',
          student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
        };

        await UserSubscription.create({
          userId: studentDoc._id,
          planType: selectedPlan,
          planName: planNames[selectedPlan],
          amount: planAmounts[selectedPlan],
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: planFeatures[selectedPlan],
          transactions: [{
            transactionId: `student_reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: planAmounts[selectedPlan],
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            parentId,
            selectedPlan,
          },
        });
        createdPlanType = selectedPlan;
      } else if (selectedPlan === 'free') {
        // Free plan selected
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          features: {
            ...FREE_PLAN_FEATURES,
          },
          metadata: {
            studentRegistrationFlow: flow,
            parentId,
            selectedPlan: 'free',
          },
        });
        createdPlanType = 'free';
      } else {
        // Original logic: check parent's subscription
        const parentSubscription = await UserSubscription.getActiveSubscription(parentId);
        
        // Debug logging
        console.log('🔍 Student Registration - Parent Subscription Check:', {
          parentId: parentId.toString(),
          hasSubscription: !!parentSubscription,
          planType: parentSubscription?.planType,
          status: parentSubscription?.status,
          endDate: parentSubscription?.endDate,
          isActive: parentSubscription?.isActive?.() || (parentSubscription?.status === 'active' && (!parentSubscription?.endDate || new Date(parentSubscription.endDate) > new Date())),
        });

        // Check if parent has active family plan
        const parentHasActiveFamilyPlan = parentSubscription && 
                                          parentSubscription.planType === 'student_parent_premium_pro' &&
                                          parentSubscription.status === 'active' &&
                                          (!parentSubscription.endDate || new Date(parentSubscription.endDate) > new Date());

        console.log('🔍 Parent has active family plan:', parentHasActiveFamilyPlan);

        if (parentHasActiveFamilyPlan) {
          console.log('✅ Creating student_parent_premium_pro subscription for student');
          await UserSubscription.create({
            userId: studentDoc._id,
            planType: 'student_parent_premium_pro',
            planName: 'Student + Parent Premium Pro Plan',
            amount: 0,
            status: 'active',
            startDate: new Date(),
            endDate: parentSubscription.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            features: parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
            transactions: [{
              transactionId: `student_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
              amount: 0,
              currency: 'INR',
              status: 'completed',
              paymentDate: new Date(),
            }],
            metadata: {
              studentRegistrationFlow: flow,
              parentId,
            },
          });
          createdPlanType = 'student_parent_premium_pro';
          console.log('✅ Student subscription created with student_parent_premium_pro plan');
        } else {
          console.log('⚠️ Parent does not have active family plan, creating free plan for student');
          await UserSubscription.create({
            userId: studentDoc._id,
            planType: 'free',
            planName: 'Free Plan',
            amount: 0,
            status: 'active',
            startDate: new Date(),
            features: {
              ...FREE_PLAN_FEATURES,
            },
            metadata: {
              studentRegistrationFlow: flow,
              parentId,
            },
          });
          createdPlanType = 'free';
          console.log('⚠️ Student subscription created with free plan');
        }
      }
    } else if (flow === 'school_link' && schoolContext) {
      const planDetails = schoolContext.plan || {};
      if (planDetails.isActive && planDetails.planType === 'educational_institutions_premium') {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'educational_institutions_premium',
          planName: 'Educational Institutions Premium Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: planDetails.endDate ? new Date(planDetails.endDate) : undefined,
          features: {
            ...EDUCATIONAL_INSTITUTIONS_PREMIUM_FEATURES,
          },
          transactions: [{
            transactionId: `school_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
            linkedTeacherId: schoolContext.teacherId || null,
          },
        });
        createdPlanType = 'educational_institutions_premium';
      } else if (planDetails.planType === 'student_premium' && planDetails.isActive) {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'student_premium',
          planName: 'Students Premium Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: planDetails.endDate ? new Date(planDetails.endDate) : undefined,
          features: {
            ...STUDENT_PREMIUM_FEATURES,
          },
          transactions: [{
            transactionId: `school_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
            linkedTeacherId: schoolContext.teacherId || null,
          },
        });
        createdPlanType = 'student_premium';
      } else {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          features: {
            ...FREE_PLAN_FEATURES,
          },
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
          },
        });
        createdPlanType = 'free';
      }

      const admissionNumber = `ADM${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;
      const rollNumber = `ROLL${Date.now().toString().slice(-6)}`;
      const formattedGender = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other';

      const schoolStudentRecord = await SchoolStudent.create({
        tenantId: schoolContext.tenantId,
        orgId: schoolContext.orgId,
        userId: studentDoc._id,
        admissionNumber,
        rollNumber,
        classId: schoolContext.classId,
        section: schoolContext.section || null,
        academicYear: schoolContext.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        parentIds: [],
        personalInfo: {
          dateOfBirth: dobValue,
          gender: formattedGender,
        },
        academicInfo: {
          admissionDate: new Date(),
        },
        isActive: true,
      });

      if (schoolContext.teacherId) {
        await User.updateOne({ _id: studentDoc._id }, { $addToSet: { 'linkedIds.teacherIds': schoolContext.teacherId } });
      }

      const io = req.app && typeof req.app.get === "function" ? req.app.get("io") : null;
      if (io && schoolContext.orgId) {
        try {
          const adminRecipients = await User.find({
            role: 'school_admin',
            orgId: schoolContext.orgId,
          }).select('_id tenantId');

          adminRecipients.forEach((admin) => {
            io.to(admin._id.toString()).emit('school:students:updated', {
              type: 'created',
              studentId: schoolStudentRecord._id.toString(),
              tenantId: schoolContext.tenantId || null,
              orgId: schoolContext.orgId?.toString?.() ?? null,
            });
          });
        } catch (emitError) {
          console.error('Error emitting school student update:', emitError);
        }
      }
    } else if (flow === 'parent_not_created') {
      // Handle parent_not_created flow with selectedPlan
      if (selectedPlan && selectedPlan !== 'free') {
        const planFeatures = {
          student_premium: STUDENT_PREMIUM_FEATURES,
          student_parent_premium_pro: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
        };
        const planAmounts = {
          student_premium: 4499,
          student_parent_premium_pro: 4999,
        };
        const planNames = {
          student_premium: 'Students Premium Plan',
          student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
        };

        await UserSubscription.create({
          userId: studentDoc._id,
          planType: selectedPlan,
          planName: planNames[selectedPlan],
          amount: planAmounts[selectedPlan],
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: planFeatures[selectedPlan],
          transactions: [{
            transactionId: `student_reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: planAmounts[selectedPlan],
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            selectedPlan,
          },
        });
        createdPlanType = selectedPlan;
      } else {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          features: {
            ...FREE_PLAN_FEATURES,
          },
          metadata: {
            studentRegistrationFlow: flow,
            selectedPlan: selectedPlan || 'free',
          },
        });
        createdPlanType = 'free';
      }
    } else {
      await UserSubscription.create({
        userId: studentDoc._id,
        planType: 'free',
        planName: 'Free Plan',
        amount: 0,
        status: 'active',
        startDate: new Date(),
        features: {
          ...FREE_PLAN_FEATURES,
        },
        metadata: {
          studentRegistrationFlow: flow,
        },
      });
    }

    res.status(200).json({
      success: true,
      userId: studentDoc._id,
      linkingCode: studentDoc.linkingCode,
      planType: createdPlanType,
    });
  } catch (error) {
    console.error('finalizeStudentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to finalize student registration' });
  }
};

// Link regular student to parent using parent's linking code
export const linkStudentToParentSelf = async (req, res) => {
  try {
    const { parentLinkingCode } = req.body;
    const studentId = req.user._id;

    if (!parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Parent linking code is required.' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can use this endpoint.' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    const parent = await User.findOne({ 
      linkingCode: parentLinkingCode.trim().toUpperCase(), 
      role: { $in: ['parent', 'school_parent'] } 
    });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    // Check if already linked
    if (student.linkedIds?.parentIds?.includes(parent._id)) {
      return res.status(400).json({ success: false, message: 'You are already linked to this parent.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    const isFamilyPlanActive = parentSubscription?.planType === 'student_parent_premium_pro';

    const studentSubscription = await UserSubscription.getActiveSubscription(student._id);
    const studentPlanType = studentSubscription?.planType || 'free';

    // Check if this is an additional child (parent already has at least one child linked)
    const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
    const isAdditionalChild = existingChildrenCount > 0;

    // If parent already has linked children, return a specific response
    if (isAdditionalChild) {
      // Check if the current student is already one of the linked children
      const isCurrentStudentLinked = parent.linkedIds?.childIds?.some(
        childId => childId.toString() === student._id.toString()
      );
      
      if (!isCurrentStudentLinked) {
        // Parent is linked with another child (not the current student)
        return res.status(200).json({
          success: false,
          parentAlreadyLinked: true,
          message: 'This parent is already linked with another child.',
          parentName: parent.name || parent.fullName || parent.email,
          existingChildrenCount,
        });
      }
    }

    // Calculate payment amount for additional children
    let paymentAmount = 0;
    if (isAdditionalChild && isFamilyPlanActive) {
      if (studentPlanType === 'student_parent_premium_pro') {
        paymentAmount = 0; // No payment needed
      } else if (studentPlanType === 'student_premium' || studentPlanType === 'educational_institutions_premium') {
        paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE; // 1000
      } else {
        paymentAmount = PARENT_PLAN_PRICE; // 5000
      }

      // If payment is required, return payment information
      if (paymentAmount > 0) {
        const razorpayInstance = initializeRazorpay();
        if (!razorpayInstance) {
          return res.status(500).json({ 
            success: false, 
            message: 'Payment gateway not configured. Please contact support.' 
          });
        }

        const metadata = {
          purpose: 'additional_child_link',
          parentId: parent._id.toString(),
          childId: student._id.toString(),
          childPlanType: studentPlanType,
          amount: paymentAmount.toString(),
        };

        const razorpayOrder = await createRazorpayOrder({
          amount: paymentAmount,
          currency: 'INR',
          metadata,
        });

        return res.status(200).json({
          success: false,
          requiresPayment: true,
          amount: paymentAmount,
          currency: 'INR',
          orderId: razorpayOrder?.id || null,
          keyId: process.env.RAZORPAY_KEY_ID || null,
          message: `To link with this parent, payment of ₹${paymentAmount} is required.`,
          childPlanType: studentPlanType,
        });
      }
    }

    // If no payment required or first child, link directly
    if (!isFamilyPlanActive && !isAdditionalChild) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parent plan is not active. Ask parent to complete setup.' 
      });
    }

    // Upgrade student's plan if parent has family plan
    if (isFamilyPlanActive && studentPlanType !== 'student_parent_premium_pro' && studentPlanType !== 'educational_institutions_premium') {
      if (studentSubscription) {
        studentSubscription.transactions = studentSubscription.transactions || [];
        studentSubscription.transactions.push({
          transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
        });
        studentSubscription.planType = 'student_parent_premium_pro';
        studentSubscription.planName = 'Student + Parent Premium Pro Plan';
        studentSubscription.features = parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES;
        studentSubscription.endDate = parentSubscription.endDate;
        await studentSubscription.save();
      } else {
        await UserSubscription.create({
          userId: student._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: parentSubscription?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: parentSubscription?.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            linkedVia: 'student_self_link',
            parentId: parent._id,
          },
        });
      }
    }

    // Link parent and student
    await User.updateOne({ _id: student._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': student._id } });

    // Add student's email to parent's childEmail array if not already present
    await User.updateOne(
      { _id: parent._id },
      { $addToSet: { childEmail: student.email } }
    );

    // Create notifications for both parent and student
    const Notification = (await import('../models/Notification.js')).default;
    const parentNotification = await Notification.create({
      userId: parent._id,
      type: 'student_linked',
      title: 'Child Linked Successfully',
      message: `${student.name || student.email} has been successfully linked to your account.`,
      metadata: {
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        linkedAt: new Date(),
      },
    });

    const studentNotification = await Notification.create({
      userId: student._id,
      type: 'parent_linked',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
        linkedAt: new Date(),
      },
    });

    // Emit realtime notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('notification', parentNotification);
      io.to(student._id.toString()).emit('notification', studentNotification);
      io.to(parent._id.toString()).emit('child_linked', {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
      });
      io.to(student._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully linked to parent account.',
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
      },
    });
  } catch (error) {
    console.error('linkStudentToParentSelf error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link to parent' });
  }
};

// Link school_student to parent using parent's linking code
export const linkSchoolStudentToParent = async (req, res) => {
  try {
    const { parentLinkingCode } = req.body;
    const studentId = req.user._id;

    if (!parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Parent linking code is required.' });
    }

    if (req.user.role !== 'school_student') {
      return res.status(403).json({ success: false, message: 'Only school students can use this endpoint.' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    const parent = await User.findOne({ 
      linkingCode: parentLinkingCode.trim().toUpperCase(), 
      role: { $in: ['parent', 'school_parent'] } 
    });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    // Check if already linked
    if (student.linkedIds?.parentIds?.includes(parent._id)) {
      return res.status(400).json({ success: false, message: 'You are already linked to this parent.' });
    }

    // Check if parent already has linked children (for school_student)
    const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
    const isAdditionalChild = existingChildrenCount > 0;

    // If parent already has linked children, return a specific response
    if (isAdditionalChild) {
      // Check if the current student is already one of the linked children
      const isCurrentStudentLinked = parent.linkedIds?.childIds?.some(
        childId => childId.toString() === student._id.toString()
      );
      
      if (!isCurrentStudentLinked) {
        // Parent is linked with another child (not the current student)
        return res.status(200).json({
          success: false,
          parentAlreadyLinked: true,
          message: 'This parent is already linked with another child.',
          parentName: parent.name || parent.fullName || parent.email,
          existingChildrenCount,
        });
      }
    }

    // Link parent and student
    await User.updateOne({ _id: student._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': student._id } });

    // Add student's email to parent's childEmail array if not already present
    await User.updateOne(
      { _id: parent._id },
      { $addToSet: { childEmail: student.email } }
    );

    // Update SchoolStudent record if exists
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    await SchoolStudent.updateOne(
      { userId: student._id },
      { $addToSet: { parentIds: parent._id } }
    );

    // Create notifications for both parent and student
    const Notification = (await import('../models/Notification.js')).default;
    const parentNotification = await Notification.create({
      userId: parent._id,
      type: 'parent_linking',
      title: 'Child Linked Successfully',
      message: `${student.name || student.email} has been successfully linked to your account.`,
      metadata: {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
        linkedAt: new Date(),
      },
    });

    const studentNotification = await Notification.create({
      userId: student._id,
      type: 'parent_linking',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
        linkedAt: new Date(),
      },
    });

    // Emit realtime notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('notification', parentNotification);
      io.to(student._id.toString()).emit('notification', studentNotification);
      io.to(parent._id.toString()).emit('child_linked', {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
      });
      io.to(student._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully linked to parent account.',
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
      },
    });
  } catch (error) {
    console.error('linkSchoolStudentToParent error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link to parent' });
  }
};

// Link parent to school_student using student's linking code
export const linkParentToSchoolStudent = async (req, res) => {
  try {
    const { studentLinkingCode } = req.body;
    const parentId = req.user._id;

    if (!studentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Student linking code is required.' });
    }

    if (!['parent', 'school_parent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only parents can use this endpoint.' });
    }

    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found.' });
    }

    const student = await User.findOne({ 
      linkingCode: studentLinkingCode.trim().toUpperCase(), 
      role: 'school_student' 
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'School student account not found for this code.' });
    }

    // Check if already linked
    if (parent.linkedIds?.childIds?.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'This student is already linked to your account.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    const isFamilyPlanActive = parentSubscription?.planType === 'student_parent_premium_pro';

    const studentSubscription = await UserSubscription.getActiveSubscription(student._id);
    const studentPlanType = studentSubscription?.planType || 'free';

    // Check if this is an additional child (parent already has at least one child linked)
    const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
    const isAdditionalChild = existingChildrenCount > 0;

    // Calculate payment amount for additional children
    let paymentAmount = 0;
    if (isAdditionalChild && isFamilyPlanActive) {
      if (studentPlanType === 'student_parent_premium_pro') {
        paymentAmount = 0; // No payment needed
      } else if (studentPlanType === 'student_premium' || studentPlanType === 'educational_institutions_premium') {
        paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE; // 1000
      } else {
        paymentAmount = PARENT_PLAN_PRICE; // 5000
      }

      // If payment is required, return payment information
      if (paymentAmount > 0) {
        return res.status(402).json({
          success: false,
          requiresPayment: true,
          amount: paymentAmount,
          currency: 'INR',
          message: `To link this child, you need to pay ₹${paymentAmount}. Please use the payment endpoint to complete the transaction.`,
          studentPlanType: studentPlanType,
        });
      }
    }

    // Link parent and student
    await User.updateOne({ _id: student._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': student._id } });

    // Add student's email to parent's childEmail array if not already present
    await User.updateOne(
      { _id: parent._id },
      { $addToSet: { childEmail: student.email } }
    );

    // Update child's subscription if needed (only for first child or if no payment required)
    if (!isAdditionalChild || paymentAmount === 0) {
      if (studentPlanType !== 'student_parent_premium_pro' && studentPlanType !== 'educational_institutions_premium') {
        if (studentSubscription) {
          studentSubscription.transactions = studentSubscription.transactions || [];
          studentSubscription.transactions.push({
            transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          });
          studentSubscription.planType = 'student_parent_premium_pro';
          studentSubscription.planName = 'Student + Parent Premium Pro Plan';
          studentSubscription.features = parentSubscription?.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES;
          studentSubscription.endDate = parentSubscription?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          await studentSubscription.save();
        } else if (isFamilyPlanActive && parentSubscription) {
          await UserSubscription.create({
            userId: student._id,
            planType: 'student_parent_premium_pro',
            planName: 'Student + Parent Premium Pro Plan',
            amount: 0,
            status: 'active',
            startDate: new Date(),
            endDate: parentSubscription.endDate,
            features: parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
            transactions: [{
              transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
              amount: 0,
              currency: 'INR',
              status: 'completed',
              paymentDate: new Date(),
            }],
            metadata: {
              linkedVia: 'parent_linking_code',
              parentId: parent._id,
            },
          });
        }
      }
    }

    // Update SchoolStudent record if exists
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    await SchoolStudent.updateOne(
      { userId: student._id },
      { $addToSet: { parentIds: parent._id } }
    );

    // Create notifications for both parent and student
    const Notification = (await import('../models/Notification.js')).default;
    const parentNotification = await Notification.create({
      userId: parent._id,
      type: 'parent_linking',
      title: 'Child Linked Successfully',
      message: `${student.name || student.email} has been successfully linked to your account.`,
      metadata: {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
        linkedAt: new Date(),
      },
    });

    const studentNotification = await Notification.create({
      userId: student._id,
      type: 'parent_linking',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
        linkedAt: new Date(),
      },
    });

    // Emit realtime notifications via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('notification', parentNotification);
      io.to(student._id.toString()).emit('notification', studentNotification);
      io.to(parent._id.toString()).emit('child_linked', {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
      });
      io.to(student._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully linked to school student account.',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error('linkParentToSchoolStudent error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link to student' });
  }
};

// Initiate payment for linking additional child
export const initiateAdditionalChildLink = async (req, res) => {
  try {
    const { childEmail, childLinkingCode } = req.body;
    const parentId = req.user._id;

    if (!['parent', 'school_parent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only parents can use this endpoint.' });
    }

    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    if (!parentSubscription || parentSubscription.planType !== 'student_parent_premium_pro') {
      return res.status(400).json({ success: false, message: 'Parent must have an active family plan.' });
    }

    // Find child by email or linking code
    let child = null;
    if (childEmail) {
      child = await User.findOne({ 
        email: childEmail.toLowerCase(), 
        role: { $in: ['student', 'school_student'] } 
      });
    } else if (childLinkingCode) {
      child = await User.findOne({ 
        linkingCode: childLinkingCode.trim().toUpperCase(),
        role: { $in: ['student', 'school_student'] }
      });
    }

    if (!child) {
      return res.status(404).json({ success: false, message: 'Child account not found.' });
    }

    // Check if already linked
    if (parent.linkedIds?.childIds?.includes(child._id)) {
      return res.status(400).json({ success: false, message: 'This child is already linked to your account.' });
    }

    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    // Calculate payment amount
    let paymentAmount = 0;
    if (childPlanType === 'student_parent_premium_pro') {
      paymentAmount = 0; // No payment needed
    } else if (childPlanType === 'student_premium' || childPlanType === 'educational_institutions_premium') {
      paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE; // 1000
    } else {
      paymentAmount = PARENT_PLAN_PRICE; // 5000
    }

    if (paymentAmount === 0) {
      // No payment needed, link directly
      return res.status(200).json({
        success: true,
        requiresPayment: false,
        message: 'No payment required. Child can be linked directly.',
      });
    }

    // Check for Razorpay if payment is required
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    // Create payment intent
    const metadata = {
      purpose: 'additional_child_link',
      parentId: parent._id.toString(),
      childId: child._id.toString(),
      childPlanType: childPlanType,
      amount: paymentAmount.toString(),
    };

    const razorpayOrder = await createRazorpayOrder({
      amount: paymentAmount,
      currency: 'INR',
      metadata,
    });

    res.status(200).json({
      success: true,
      requiresPayment: true,
      amount: paymentAmount,
      currency: 'INR',
      orderId: razorpayOrder?.id || null,
      keyId: process.env.RAZORPAY_KEY_ID || null,
      childId: child._id,
      childEmail: child.email,
      childPlanType: childPlanType,
      message: `Payment of ₹${paymentAmount} required to link this child.`,
    });
  } catch (error) {
    console.error('initiateAdditionalChildLink error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate additional child link' });
  }
};

// Confirm payment and link additional child
export const confirmAdditionalChildLink = async (req, res) => {
  try {
    const { childId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const parentId = req.user._id;

    if (!['parent', 'school_parent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only parents can use this endpoint.' });
    }

    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found.' });
    }

    const child = await User.findById(childId);
    if (!child || !['student', 'school_student'].includes(child.role)) {
      return res.status(404).json({ success: false, message: 'Child account not found.' });
    }

    // Check if already linked
    if (parent.linkedIds?.childIds?.includes(child._id)) {
      return res.status(400).json({ success: false, message: 'This child is already linked to your account.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    if (!parentSubscription || parentSubscription.planType !== 'student_parent_premium_pro') {
      return res.status(400).json({ success: false, message: 'Parent must have an active family plan.' });
    }

    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    // Verify payment if razorpayPaymentId is provided
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      const razorpayInstance = initializeRazorpay();
      if (!razorpayInstance) {
        return res.status(500).json({ success: false, message: 'Payment gateway not configured.' });
      }
      
      try {
        // Verify signature
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(razorpayOrderId + '|' + razorpayPaymentId)
          .digest('hex');
        
        if (expectedSignature !== razorpaySignature) {
          return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
        }

        // Verify payment status
        const payment = await razorpayInstance.payments.fetch(razorpayPaymentId);
        if (payment.status !== 'captured' && payment.status !== 'authorized') {
          return res.status(400).json({ success: false, message: 'Payment not completed. Please complete the payment first.' });
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        return res.status(400).json({ success: false, message: 'Invalid payment details.' });
      }
    }

    // Link parent and child
    await User.updateOne({ _id: child._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': child._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { childEmail: child.email } });

    // Update child's subscription if needed
    if (childPlanType !== 'student_parent_premium_pro' && childPlanType !== 'educational_institutions_premium') {
      if (childSubscription) {
        childSubscription.transactions = childSubscription.transactions || [];
        childSubscription.transactions.push({
          transactionId: `additional_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
          razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
        });
        childSubscription.planType = 'student_parent_premium_pro';
        childSubscription.planName = 'Student + Parent Premium Pro Plan';
        childSubscription.features = parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES;
        childSubscription.endDate = parentSubscription.endDate;
        await childSubscription.save();
      } else {
        await UserSubscription.create({
          userId: child._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: parentSubscription.endDate,
          features: parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `additional_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
            razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
          }],
          metadata: {
            linkedVia: 'additional_child_link',
            parentId: parent._id,
          },
        });
      }
    }

    // Update parent subscription with transaction
    if (razorpayPaymentId) {
      parentSubscription.transactions = parentSubscription.transactions || [];
      const paymentAmount = childPlanType === 'student_premium' || childPlanType === 'educational_institutions_premium' 
        ? PARENT_STUDENT_PREMIUM_UPGRADE_PRICE 
        : PARENT_PLAN_PRICE;
      parentSubscription.transactions.push({
        transactionId: `additional_child_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        amount: paymentAmount,
        currency: 'INR',
        status: 'completed',
        paymentDate: new Date(),
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
      });
      await parentSubscription.save();
    }

    // Update SchoolStudent record if exists
    if (child.role === 'school_student') {
      const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
      await SchoolStudent.updateOne(
        { userId: child._id },
        { $addToSet: { parentIds: parent._id } }
      );
    }

    // Create notifications
    const Notification = (await import('../models/Notification.js')).default;
    const parentNotification = await Notification.create({
      userId: parent._id,
      type: 'parent_linking',
      title: 'Additional Child Linked',
      message: `${child.name || child.email} has been successfully linked to your account.`,
      metadata: {
        childId: child._id,
        childName: child.name,
        childEmail: child.email,
        linkedAt: new Date(),
      },
    });

    const childNotification = await Notification.create({
      userId: child._id,
      type: 'parent_linking',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
        linkedAt: new Date(),
      },
    });

    // Emit realtime notifications
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('notification', parentNotification);
      io.to(child._id.toString()).emit('notification', childNotification);
      io.to(parent._id.toString()).emit('child_linked', {
        childId: child._id,
        childName: child.name,
        childEmail: child.email,
      });
      io.to(child._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
        parentEmail: parent.email,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Child linked successfully.',
      child: {
        id: child._id,
        name: child.name,
        email: child.email,
      },
    });
  } catch (error) {
    console.error('confirmAdditionalChildLink error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link additional child' });
  }
};

// Verify school_student linking code
export const verifySchoolStudentLinkCode = async (req, res) => {
  try {
    const { studentLinkingCode } = req.body;
    if (!studentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Student linking code is required.' });
    }

    const student = await User.findOne({ 
      linkingCode: studentLinkingCode.trim().toUpperCase(), 
      role: 'school_student' 
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'School student account not found for this code.' });
    }

    // Get school information if available
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    const schoolStudent = await SchoolStudent.findOne({ userId: student._id })
      .populate('orgId', 'name')
      .populate('classId', 'classNumber section');

    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        linkingCode: student.linkingCode,
        school: schoolStudent?.orgId?.name || null,
        class: schoolStudent?.classId ? 
          `Class ${schoolStudent.classId.classNumber}${schoolStudent.classId.section ? ` ${schoolStudent.classId.section}` : ''}` : 
          null,
      },
    });
  } catch (error) {
    console.error('verifySchoolStudentLinkCode error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify student code' });
  }
};

// Student registration with standalone plan selection (for parent_not_created flow)
export const initiateStandaloneStudentRegistrationWithPlan = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      flow,
      gender,
      selectedPlan,
    } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !flow || !gender || !selectedPlan) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    if (flow !== 'parent_not_created') {
      return res.status(400).json({ success: false, message: 'This endpoint is only for parent_not_created flow.' });
    }

    const allowedPlans = ['free', 'student_premium', 'student_parent_premium_pro'];
    if (!allowedPlans.includes(selectedPlan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
    }

    // Check if email already exists
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth format.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedGender = String(gender).trim();
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!allowedGenders.includes(normalizedGender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }

    // If free plan, create account directly
    if (selectedPlan === 'free') {
      const payload = {
        name: fullName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        dateOfBirth: parsedDob,
        flow: 'parent_not_created',
        gender: normalizedGender,
        selectedPlan: 'free',
      };
      return res.status(200).json({ success: true, payload });
    }

    // For premium plans, create registration intent and payment order
    const planAmounts = {
      student_premium: 4499,
      student_parent_premium_pro: 4999,
    };

    const amount = planAmounts[selectedPlan] || 0;
    if (amount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid plan amount.' });
    }

    // Create registration intent
    const StudentRegistrationIntent = (await import('../models/StudentRegistrationIntent.js')).default;
    const registrationIntent = await StudentRegistrationIntent.create({
      email: normalizedEmail,
      fullName: fullName.trim(),
      passwordHash: hashedPassword,
      dateOfBirth: parsedDob,
      gender: normalizedGender,
      parentId: null, // No parent for standalone registration
      selectedPlan,
      status: 'payment_pending',
    });

    // Create Razorpay order
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.',
      });
    }

    const order = await createRazorpayOrder({
      amount,
      currency: 'INR',
      metadata: {
        purpose: 'student_registration_standalone',
        registrationIntentId: registrationIntent._id.toString(),
        planType: selectedPlan,
      },
    });

    registrationIntent.razorpayOrderId = order.id;
    await registrationIntent.save();

    res.status(200).json({
      success: true,
      requiresPayment: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      registrationIntentId: registrationIntent._id.toString(),
    });
  } catch (error) {
    console.error('initiateStandaloneStudentRegistrationWithPlan error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate standalone registration with plan' });
  }
};

// Student registration with plan selection (when parent already has linked children)
export const initiateStudentRegistrationWithPlan = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      flow,
      parentLinkingCode,
      gender,
      selectedPlan,
      parentId,
    } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !flow || !gender || !selectedPlan || !parentId) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const allowedPlans = ['free', 'student_premium', 'student_parent_premium_pro'];
    if (!allowedPlans.includes(selectedPlan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
    }

    // Verify parent exists and has linked children
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ success: false, message: 'Parent not found.' });
    }

    const existingChildrenCount = parent.linkedIds?.childIds?.length || 0;
    if (existingChildrenCount === 0) {
      return res.status(400).json({ success: false, message: 'Parent has no linked children. Use regular registration flow.' });
    }

    // Check if email already exists
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth format.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedGender = String(gender).trim();
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!allowedGenders.includes(normalizedGender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }

    // If free plan, create account directly
    if (selectedPlan === 'free') {
      const payload = {
        name: fullName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        dateOfBirth: parsedDob,
        flow: 'parent_exists',
        parentId: parent._id,
        gender: normalizedGender,
        selectedPlan: 'free',
      };
      return res.status(200).json({ success: true, payload });
    }

    // For premium plans, create registration intent and payment order
    const planAmounts = {
      student_premium: 4499,
      student_parent_premium_pro: 4999,
    };

    const amount = planAmounts[selectedPlan] || 0;
    if (amount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid plan amount.' });
    }

    // Create registration intent
    const StudentRegistrationIntent = (await import('../models/StudentRegistrationIntent.js')).default;
    const registrationIntent = await StudentRegistrationIntent.create({
      email: normalizedEmail,
      fullName: fullName.trim(),
      passwordHash: hashedPassword,
      dateOfBirth: parsedDob,
      gender: normalizedGender,
      parentId: parent._id,
      selectedPlan,
      status: 'payment_pending',
    });

    // Create Razorpay order
    const razorpayInstance = initializeRazorpay();
    if (!razorpayInstance) {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.',
      });
    }

    const order = await createRazorpayOrder({
      amount,
      currency: 'INR',
      metadata: {
        purpose: 'student_registration',
        registrationIntentId: registrationIntent._id.toString(),
        planType: selectedPlan,
        parentId: parent._id.toString(),
      },
    });

    registrationIntent.razorpayOrderId = order.id;
    await registrationIntent.save();

    res.status(200).json({
      success: true,
      requiresPayment: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      registrationIntentId: registrationIntent._id.toString(),
    });
  } catch (error) {
    console.error('initiateStudentRegistrationWithPlan error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate registration with plan' });
  }
};

// Finalize student registration after payment
export const finalizeStudentRegistrationWithPayment = async (req, res) => {
  try {
    const {
      registrationIntentId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!registrationIntentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details.' });
    }

    // Verify payment signature
    const razorpayInstance = initializeRazorpay();
    if (razorpayInstance) {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
      }
    }

    // Get registration intent
    const StudentRegistrationIntent = (await import('../models/StudentRegistrationIntent.js')).default;
    const registrationIntent = await StudentRegistrationIntent.findById(registrationIntentId);
    if (!registrationIntent) {
      return res.status(404).json({ success: false, message: 'Registration intent not found.' });
    }

    if (registrationIntent.status !== 'payment_pending') {
      return res.status(400).json({ success: false, message: 'Registration intent already processed.' });
    }

    // Create student account
    const studentDoc = await User.create({
      fullName: registrationIntent.fullName,
      name: registrationIntent.fullName,
      email: registrationIntent.email,
      password: registrationIntent.passwordHash,
      dateOfBirth: registrationIntent.dateOfBirth,
      gender: registrationIntent.gender,
      role: 'student',
      isVerified: true,
      linkingCode: await User.generateUniqueLinkingCode('ST'),
      linkingCodeIssuedAt: new Date(),
      linkedIds: {
        parentIds: registrationIntent.parentId ? [registrationIntent.parentId] : [],
      },
    });

    // Link parent and student if parent exists
    if (registrationIntent.parentId) {
      await User.updateOne({ _id: registrationIntent.parentId }, { 
        $addToSet: { 'linkedIds.childIds': studentDoc._id },
        $addToSet: { childEmail: registrationIntent.email },
      });
    }

    // Create subscription based on selected plan
    let createdPlanType = 'free';
    const planFeatures = {
      student_premium: STUDENT_PREMIUM_FEATURES,
      student_parent_premium_pro: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
    };

    const planAmounts = {
      student_premium: 4499,
      student_parent_premium_pro: 4999,
    };

    if (registrationIntent.selectedPlan !== 'free') {
      await UserSubscription.create({
        userId: studentDoc._id,
        planType: registrationIntent.selectedPlan,
        planName: registrationIntent.selectedPlan === 'student_premium' ? 'Students Premium Plan' : 'Student + Parent Premium Pro Plan',
        amount: planAmounts[registrationIntent.selectedPlan],
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        features: planFeatures[registrationIntent.selectedPlan],
        transactions: [{
          transactionId: `student_reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: planAmounts[registrationIntent.selectedPlan],
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
          razorpayOrderId,
          razorpayPaymentId,
        }],
        metadata: {
          studentRegistrationFlow: 'parent_exists',
          parentId: registrationIntent.parentId,
          registrationIntentId: registrationIntent._id.toString(),
        },
      });
      createdPlanType = registrationIntent.selectedPlan;
    } else {
      await UserSubscription.create({
        userId: studentDoc._id,
        planType: 'free',
        planName: 'Free Plan',
        amount: 0,
        status: 'active',
        startDate: new Date(),
        features: FREE_PLAN_FEATURES,
        metadata: {
          studentRegistrationFlow: 'parent_exists',
          parentId: registrationIntent.parentId,
        },
      });
    }

    // Update registration intent
    registrationIntent.status = 'completed';
    registrationIntent.studentId = studentDoc._id;
    registrationIntent.razorpayPaymentId = razorpayPaymentId;
    await registrationIntent.save();

    // Create notifications
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      userId: registrationIntent.parentId,
      type: 'student_linked',
      title: 'New Child Linked',
      message: `${studentDoc.fullName} has been linked to your account.`,
      metadata: { studentId: studentDoc._id },
    });

    await Notification.create({
      userId: studentDoc._id,
      type: 'parent_linked',
      title: 'Parent Linked',
      message: 'You have been successfully linked to your parent\'s account.',
      metadata: { parentId: registrationIntent.parentId },
    });

    // Emit real-time notifications
    const io = req.app.get('io');
    if (io) {
      io.to(registrationIntent.parentId.toString()).emit('student:linked', {
        parentId: registrationIntent.parentId.toString(),
        studentId: studentDoc._id.toString(),
        studentName: studentDoc.fullName,
      });

      io.to(studentDoc._id.toString()).emit('parent:linked', {
        studentId: studentDoc._id.toString(),
        parentId: registrationIntent.parentId.toString(),
      });
    }

    // Generate token
    const token = generateToken(studentDoc._id);

    res.status(200).json({
      success: true,
      payload: {
        name: studentDoc.fullName,
        email: studentDoc.email,
        passwordHash: registrationIntent.passwordHash,
        dateOfBirth: registrationIntent.dateOfBirth,
        flow: registrationIntent.parentId ? 'parent_exists' : 'parent_not_created',
        parentId: registrationIntent.parentId || null,
        gender: registrationIntent.gender,
        selectedPlan: registrationIntent.selectedPlan,
      },
      linkingCode: studentDoc.linkingCode,
      planType: createdPlanType,
      token,
    });
  } catch (error) {
    console.error('finalizeStudentRegistrationWithPayment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to finalize registration with payment' });
  }
};

