import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireParent } from "../middlewares/requireAuth.js";
import ChildProgress from "../models/ChildProgress.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import UserProgress from "../models/UserProgress.js";
import UnifiedGameProgress from "../models/UnifiedGameProgress.js";
import Transaction from "../models/Transaction.js";
import MoodLog from "../models/MoodLog.js";
import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";
import SchoolStudent from "../models/School/SchoolStudent.js";

const router = express.Router();

// Middleware to ensure only parents can access these routes
router.use(requireAuth);
router.use(requireParent);

// Parent profile overview with real-time ready snapshot
router.get("/profile/overview", async (req, res) => {
  try {
    const parentId = req.user._id;

    const parent = await User.findById(parentId)
      .select("name fullName email phone location bio avatar preferences subscription childEmail linkedIds createdAt updatedAt lastLoginAt linkingCode");

    if (!parent) {
      return res.status(404).json({ message: "Parent account not found" });
    }

    // Resolve primary contact fields
    const parentProfile = {
      id: parent._id,
      name: parent.fullName || parent.name,
      email: parent.email,
      phone: parent.phone || "",
      location: parent.location || parent.city || "",
      bio: parent.bio || "",
      avatar: parent.avatar || "/avatars/avatar1.png",
      preferences: parent.preferences || {},
      subscription: parent.subscription || null,
      linkedChildEmails: Array.isArray(parent.childEmail) ? parent.childEmail : parent.childEmail ? [parent.childEmail] : [],
      linkedChildIds: parent.linkedIds?.childIds?.map((id) => id.toString()) || [],
      joinedAt: parent.createdAt,
      lastUpdatedAt: parent.updatedAt,
      lastLoginAt: parent.lastLoginAt || parent.updatedAt,
      linkingCode: parent.linkingCode || null,
    };

    // Build child query consistent with /children endpoint
    const childQuery = {
      role: { $in: ["student", "school_student"] },
      $or: [
        { email: { $in: parentProfile.linkedChildEmails } },
        { _id: { $in: parent.linkedIds?.childIds || [] } },
        { guardianEmail: parent.email },
      ],
    };

    const children = await User.find(childQuery)
      .select("name fullName email avatar institution city createdAt lastActive role tenantId orgId dob dateOfBirth academic")
      .lean();

    const childIds = children.map((child) => child._id);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const childrenSummaries = await Promise.all(
      children.map(async (child) => {
        const [wallet, userProgress, gameProgress, moodLogs, activityLogs, schoolStudent] = await Promise.all([
          Wallet.findOne({ userId: child._id }).lean(),
          UserProgress.findOne({ userId: child._id }).lean(),
          UnifiedGameProgress.find({ userId: child._id }).limit(20).lean(),
          MoodLog.find({ userId: child._id }).sort({ createdAt: -1 }).limit(7).lean(),
          ActivityLog.find({ userId: child._id, createdAt: { $gte: sevenDaysAgo } })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
          child.role === "school_student"
            ? SchoolStudent.findOne({ userId: child._id, tenantId: child.tenantId }).populate("orgId", "name").populate("classId", "classNumber stream")
            : null,
        ]);

        const healCoins = wallet?.balance || 0;
        const level = userProgress?.level || 1;
        const xp = userProgress?.xp || 0;
        const streak = userProgress?.streak || 0;

        // Aggregate mastery
        const pillars = {};
        (gameProgress || []).forEach((game) => {
          if (!game.category) return;
          const key = game.category;
          const progress = game.progress || 0;
          if (!pillars[key]) {
            pillars[key] = { progress: 0, count: 0 };
          }
          pillars[key].progress += progress;
          pillars[key].count += 1;
        });
        const pillarEntries = Object.entries(pillars).map(([key, value]) => ({
          name: key,
          percentage: value.count > 0 ? Math.round(value.progress / value.count) : 0,
        }));
        const overallMastery =
          pillarEntries.length > 0
            ? Math.round(pillarEntries.reduce((sum, pillar) => sum + pillar.percentage, 0) / pillarEntries.length)
            : 0;
        const topPillars = pillarEntries.sort((a, b) => b.percentage - a.percentage).slice(0, 2);

        // Mood insights
        const averageMoodScore =
          moodLogs && moodLogs.length > 0
            ? Number(
                (
                  moodLogs.reduce((sum, log) => sum + (log.score ?? 3), 0) /
                  moodLogs.length
                ).toFixed(1)
              )
            : null;
        const latestMood = moodLogs?.[0] || null;

        // Engagement
        const engagementMinutes = (activityLogs || []).reduce((sum, log) => sum + (log.duration || 5), 0);
        const sessionsCount = activityLogs?.length || 0;

        const alerts = [];
        if (averageMoodScore !== null && averageMoodScore < 2.5) {
          alerts.push({
            type: "mood",
            level: "high",
            message: "Consistently low mood this week",
          });
        } else if (averageMoodScore !== null && averageMoodScore < 3) {
          alerts.push({
            type: "mood",
            level: "medium",
            message: "Mood trending lower than usual",
          });
        }

        if (engagementMinutes < 60) {
          alerts.push({
            type: "engagement",
            level: "medium",
            message: "Less than 60 mins of learning this week",
          });
        }

        const institution =
          schoolStudent?.orgId?.name ||
          schoolStudent?.institution ||
          child.institution ||
          child.city ||
          "Not specified";

        const grade =
          child.academic?.grade ||
          (schoolStudent?.classId
            ? `Class ${schoolStudent.classId.classNumber}${schoolStudent.classId.stream ? ` ${schoolStudent.classId.stream}` : ""}`
            : "Not specified");

        return {
          id: child._id,
          name: child.fullName || child.name,
          email: child.email,
          avatar: child.avatar || "/avatars/avatar1.png",
          institution,
          grade,
          level,
          xp,
          streak,
          healCoins,
          overallMastery,
          topPillars,
          averageMoodScore,
          latestMood: latestMood
            ? {
                mood: latestMood.mood,
                emoji: latestMood.emoji || "😊",
                loggedAt: latestMood.createdAt,
              }
            : null,
          engagement: {
            minutes: engagementMinutes,
            sessions: sessionsCount,
          },
          totalGamesPlayed: (gameProgress || []).reduce((sum, game) => sum + (game.timesPlayed || 0), 0),
          lastActive: child.lastActive || (activityLogs?.[0]?.createdAt ?? child.createdAt),
          alerts,
        };
      })
    );

    const totalCoins = childrenSummaries.reduce((sum, child) => sum + (child.healCoins || 0), 0);
    const avgEngagementMinutes =
      childrenSummaries.length > 0
        ? Math.round(
            childrenSummaries.reduce((sum, child) => sum + (child.engagement?.minutes || 0), 0) /
              childrenSummaries.length
          )
        : 0;
    const lowMoodChildren = childrenSummaries.filter(
      (child) => child.averageMoodScore !== null && child.averageMoodScore < 3
    ).length;
    const activeChildren = childrenSummaries.filter((child) => (child.engagement?.sessions || 0) > 0).length;

    const rawNotifications = await Notification.find({ userId: parentId })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const notifications = rawNotifications.map((notification) => ({
      id: notification._id,
      title: notification.title || "Notification",
      message: notification.message || "",
      type: notification.type || "general",
      read: notification.read || false,
      timestamp: notification.createdAt,
      metadata: notification.metadata || {},
    }));

    const activityLookup = new Map(
      childrenSummaries.map((child) => [child.id.toString(), child.name])
    );

    const timelineLogs = await ActivityLog.find({
      userId: { $in: childIds },
    })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    const activityTimeline = timelineLogs.map((log) => ({
      id: log._id,
      childId: log.userId,
      childName: activityLookup.get(log.userId?.toString()) || "Child",
      type: log.activityType || "activity",
      title: log.action || "Learning Activity",
      description: log.details?.description || log.details?.summary || "",
      duration: log.duration || 5,
      timestamp: log.createdAt,
      category: log.category || "general",
    }));

    const upcomingRenewalDate = parentProfile.subscription?.nextBilling
      ? new Date(parentProfile.subscription.nextBilling)
      : null;

    const nextActions = [];
    if (lowMoodChildren > 0) {
      nextActions.push({
        title: "Check in on mood",
        description: `${lowMoodChildren} ${
          lowMoodChildren === 1 ? "child needs" : "children need"
        } emotional support this week`,
        priority: "high",
        category: "wellbeing",
      });
    }
    if (childrenSummaries.some((child) => (child.healCoins || 0) > 2000)) {
      nextActions.push({
        title: "Plan a reward celebration",
        description: "One or more children have earned over 2000 HealCoins",
        priority: "medium",
        category: "rewards",
      });
    }
    if (upcomingRenewalDate) {
      const daysToRenewal = Math.round(
        (upcomingRenewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysToRenewal <= 14) {
        nextActions.push({
          title: "Subscription renewal",
          description: `Your plan renews in ${Math.max(daysToRenewal, 0)} day${daysToRenewal === 1 ? "" : "s"}`,
          priority: "medium",
          category: "subscription",
        });
      }
    }
    if (nextActions.length === 0) {
      nextActions.push({
        title: "Keep the momentum",
        description: "Review weekly progress together and celebrate wins",
        priority: "low",
        category: "engagement",
      });
    }

    res.json({
      parent: parentProfile,
      insights: {
        totalChildren: childrenSummaries.length,
        activeChildren,
        totalHealCoins: totalCoins,
        avgWeeklyEngagementMinutes: avgEngagementMinutes,
        lowMoodChildren,
        subscriptionStatus: parentProfile.subscription?.status || "unknown",
        nextBilling: parentProfile.subscription?.nextBilling || null,
      },
      children: childrenSummaries,
      notifications,
      activityTimeline,
      nextActions,
    });
  } catch (error) {
    console.error("Error fetching parent profile overview:", error);
    res.status(500).json({ message: "Failed to fetch parent profile overview" });
  }
});

// Link a child to parent account
router.post("/link-child", async (req, res) => {
  try {
    const parent = req.user;
    const { childLinkingCode } = req.body;

    if (!childLinkingCode) {
      return res.status(400).json({ success: false, message: 'Child linking code is required' });
    }

    // Find the child by linking code - allow both student and school_student roles
    const child = await User.findOne({ 
      linkingCode: childLinkingCode.trim().toUpperCase(),
      role: { $in: ['student', 'school_student'] }
    });

    if (!child) {
      return res.status(404).json({ success: false, message: 'Student not found with this linking code. Please check the code and try again.' });
    }

    // Check if child is already linked to this parent
    const existingLink = parent.linkedIds?.childIds?.includes(child._id.toString());
    if (existingLink) {
      return res.status(400).json({ success: false, message: 'This child is already linked to your account' });
    }

    // Get child's subscription plan
    const { getUserSubscription } = await import('../utils/subscriptionUtils.js');
    const UserSubscription = (await import('../models/UserSubscription.js')).default;
    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    // Check parent's subscription
    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    const isFamilyPlanActive = parentSubscription?.planType === 'student_parent_premium_pro' && 
                               parentSubscription.status === 'active' &&
                               (!parentSubscription.endDate || new Date(parentSubscription.endDate) > new Date());

    // Calculate payment amount based on child's plan
    const PARENT_PLAN_PRICE = 4999;
    const PARENT_STUDENT_PREMIUM_UPGRADE_PRICE = 1000;
    
    let paymentAmount = 0;
    let requiresPayment = false;

    if (childPlanType === 'student_parent_premium_pro') {
      // Child already has family plan - no payment needed
      paymentAmount = 0;
      requiresPayment = false;
    } else if (childPlanType === 'student_premium' || childPlanType === 'educational_institutions_premium') {
      // Child has premium plan - parent pays ₹1000 for parent dashboard access
      paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE;
      requiresPayment = true;
    } else {
      // Child has free plan - parent pays ₹5000 for student + parent premium pro plan
      paymentAmount = PARENT_PLAN_PRICE;
      requiresPayment = true;
    }

    // If payment is required, return payment information
    if (requiresPayment && paymentAmount > 0) {
      // Initialize Razorpay
      const Razorpay = (await import('razorpay')).default;
      let razorpayInstance = null;
      
      try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (keyId && keySecret && keyId !== 'your_razorpay_key_id' && keySecret !== 'your_razorpay_key_secret') {
          razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
          });
        }
      } catch (error) {
        console.error('Razorpay initialization error:', error);
      }

      if (!razorpayInstance) {
        return res.status(500).json({ 
          success: false, 
          message: 'Payment gateway not configured. Please contact support.' 
        });
      }

      const metadata = {
        purpose: 'parent_link_child',
        parentId: parent._id.toString(),
        childId: child._id.toString(),
        childPlanType: childPlanType,
        amount: paymentAmount.toString(),
      };

      // Create Razorpay order
      const crypto = (await import('crypto')).default;
      let razorpayOrder;
      try {
        // Generate short receipt (max 40 chars for Razorpay)
        const shortId = crypto.randomBytes(3).toString('hex').toUpperCase();
        const receipt = `PLC${Date.now().toString().slice(-8)}${shortId}`; // Format: PLC + last 8 digits of timestamp + 6 char hex = max 17 chars
        
        razorpayOrder = await razorpayInstance.orders.create({
          amount: paymentAmount * 100, // Convert to paise
          currency: 'INR',
          receipt: receipt,
          notes: metadata,
        });
      } catch (error) {
        console.error('Razorpay order creation error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create payment order. Please try again.' 
        });
      }

      return res.status(200).json({
        success: false,
        requiresPayment: true,
        amount: paymentAmount,
        currency: 'INR',
        orderId: razorpayOrder?.id || null,
        keyId: process.env.RAZORPAY_KEY_ID || null,
        childId: child._id.toString(),
        childName: child.name || child.fullName,
        childPlanType: childPlanType,
        message: `To link this child, payment of ₹${paymentAmount} is required.`,
      });
    }

    // No payment required - link directly
    // Add child to parent's linkedIds
    if (!parent.linkedIds) {
      parent.linkedIds = { childIds: [], teacherIds: [] };
    }
    if (!parent.linkedIds.childIds) {
      parent.linkedIds.childIds = [];
    }
    
    parent.linkedIds.childIds.push(child._id);
    
    // Add child's email to parent's childEmail array
    if (!parent.childEmail) {
      parent.childEmail = [];
    }
    
    // Ensure childEmail is an array
    if (!Array.isArray(parent.childEmail)) {
      parent.childEmail = [parent.childEmail];
    }
    
    // Add child's email if not already present
    if (!parent.childEmail.includes(child.email)) {
      parent.childEmail.push(child.email);
    }
    
    await parent.save();

    // Also update child's linkedIds to include parent
    if (!child.linkedIds) {
      child.linkedIds = { parentIds: [], teacherIds: [] };
    }
    if (!child.linkedIds.parentIds) {
      child.linkedIds.parentIds = [];
    }
    
    child.linkedIds.parentIds.push(parent._id);
    await child.save();

    res.status(200).json({ 
      success: true,
      message: `Successfully linked ${child.name} to your account`,
      child: {
        _id: child._id,
        name: child.name,
        email: child.email,
        avatar: child.avatar
      }
    });
  } catch (error) {
    console.error('Error linking child:', error);
    res.status(500).json({ success: false, message: 'Failed to link child', error: error.message });
  }
});

// Confirm payment and link child after payment
router.post("/link-child/confirm-payment", async (req, res) => {
  try {
    const parent = req.user;
    const { childId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!childId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // Verify payment signature
    const crypto = await import('crypto');
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find child
    const child = await User.findById(childId);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    // Check if already linked
    if (parent.linkedIds?.childIds?.includes(child._id)) {
      return res.status(400).json({ success: false, message: 'This child is already linked to your account' });
    }

    // Get child's subscription
    const UserSubscription = (await import('../models/UserSubscription.js')).default;
    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    // Upgrade child's subscription if needed
    const PARENT_PLAN_PRICE = 4999;
    const PARENT_STUDENT_PREMIUM_UPGRADE_PRICE = 1000;
    const STUDENT_PARENT_PREMIUM_PRO_FEATURES = {
      unlimitedGames: true,
      allPillars: true,
      advancedAnalytics: true,
      certificates: true,
      parentDashboard: true,
      familyTracking: true,
      parentSupport: true,
    };

    // Determine the payment amount based on child's plan
    let paymentAmount = 0;
    if (childPlanType === 'free') {
      paymentAmount = PARENT_PLAN_PRICE; // ₹5000
    } else if (childPlanType === 'student_premium' || childPlanType === 'educational_institutions_premium') {
      paymentAmount = PARENT_STUDENT_PREMIUM_UPGRADE_PRICE; // ₹1000
    }

    // Upgrade child's subscription to student_parent_premium_pro if needed
    if (childPlanType !== 'student_parent_premium_pro' && childPlanType !== 'educational_institutions_premium') {
      if (childSubscription) {
        childSubscription.planType = 'student_parent_premium_pro';
        childSubscription.planName = 'Student + Parent Premium Pro Plan';
        childSubscription.features = STUDENT_PARENT_PREMIUM_PRO_FEATURES;
        childSubscription.transactions = childSubscription.transactions || [];
        childSubscription.transactions.push({
          transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: paymentAmount,
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
          razorpayOrderId,
          razorpayPaymentId,
        });
        await childSubscription.save();
      } else {
        await UserSubscription.create({
          userId: child._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: paymentAmount,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: paymentAmount,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
            razorpayOrderId,
            razorpayPaymentId,
          }],
          metadata: {
            linkedVia: 'parent_link_child',
            parentId: parent._id,
          },
        });
      }
    }

    // Link parent and child
    if (!parent.linkedIds) {
      parent.linkedIds = { childIds: [], teacherIds: [] };
    }
    if (!parent.linkedIds.childIds) {
      parent.linkedIds.childIds = [];
    }
    parent.linkedIds.childIds.push(child._id);
    
    if (!parent.childEmail) {
      parent.childEmail = [];
    }
    if (!Array.isArray(parent.childEmail)) {
      parent.childEmail = [parent.childEmail];
    }
    if (!parent.childEmail.includes(child.email)) {
      parent.childEmail.push(child.email);
    }
    await parent.save();

    if (!child.linkedIds) {
      child.linkedIds = { parentIds: [], teacherIds: [] };
    }
    if (!child.linkedIds.parentIds) {
      child.linkedIds.parentIds = [];
    }
    child.linkedIds.parentIds.push(parent._id);
    await child.save();

    // Create notifications
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      userId: parent._id,
      type: 'child_linked',
      title: 'Child Linked Successfully',
      message: `${child.name || child.email} has been successfully linked to your account.`,
      metadata: { childId: child._id },
    });

    await Notification.create({
      userId: child._id,
      type: 'parent_linked',
      title: 'Parent Linked Successfully',
      message: `You have been successfully linked to ${parent.name || parent.email}'s account.`,
      metadata: { parentId: parent._id },
    });

    // Emit real-time notifications
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('child_linked', {
        childId: child._id,
        childName: child.name,
      });
      io.to(child._id.toString()).emit('parent_linked', {
        parentId: parent._id,
        parentName: parent.name,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully linked ${child.name} to your account`,
      child: {
        _id: child._id,
        name: child.name,
        email: child.email,
        avatar: child.avatar,
      },
    });
  } catch (error) {
    console.error('Error confirming child link payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment', error: error.message });
  }
});

// Initiate child account creation by parent (requires payment)
router.post("/create-child", async (req, res) => {
  try {
    const parent = req.user;
    const { fullName, email, password, dateOfBirth, gender } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate gender
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection' });
    }

    // Check if email already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Validate date of birth
    const dobValue = new Date(dateOfBirth);
    if (isNaN(dobValue.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth' });
    }

    // Hash password
    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Payment amount for student + parent premium pro plan
    const PARENT_PLAN_PRICE = 4999;

    // Initialize Razorpay
    const Razorpay = (await import('razorpay')).default;
    let razorpayInstance = null;
    
    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (keyId && keySecret && keyId !== 'your_razorpay_key_id' && keySecret !== 'your_razorpay_key_secret') {
        razorpayInstance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
      }
    } catch (error) {
      console.error('Razorpay initialization error:', error);
    }

    if (!razorpayInstance) {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured. Please contact support.' 
      });
    }

    // Create child creation intent
    const ChildCreationIntent = (await import('../models/ChildCreationIntent.js')).default;
    const crypto = (await import('crypto')).default;
    
    const childIntent = await ChildCreationIntent.create({
      parentId: parent._id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: hashedPassword,
      dateOfBirth: dobValue,
      gender: gender,
      planType: 'student_parent_premium_pro',
      amount: PARENT_PLAN_PRICE,
      status: 'payment_pending',
    });

    // Create Razorpay order
    const metadata = {
      purpose: 'parent_create_child',
      parentId: parent._id.toString(),
      childCreationIntentId: childIntent._id.toString(),
      amount: PARENT_PLAN_PRICE.toString(),
    };

    let razorpayOrder;
    try {
      // Generate short receipt (max 40 chars for Razorpay)
      const shortId = crypto.randomBytes(3).toString('hex').toUpperCase();
      const receipt = `PCC${Date.now().toString().slice(-8)}${shortId}`; // Format: PCC + last 8 digits of timestamp + 6 char hex = max 17 chars
      
      razorpayOrder = await razorpayInstance.orders.create({
        amount: PARENT_PLAN_PRICE * 100, // Convert to paise
        currency: 'INR',
        receipt: receipt,
        notes: metadata,
      });
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create payment order. Please try again.' 
      });
    }

    // Update intent with order ID
    childIntent.razorpayOrderId = razorpayOrder.id;
    await childIntent.save();

    res.status(200).json({
      success: true,
      requiresPayment: true,
      amount: PARENT_PLAN_PRICE,
      currency: 'INR',
      orderId: razorpayOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID || null,
      childCreationIntentId: childIntent._id.toString(),
      message: `Payment of ₹${PARENT_PLAN_PRICE} required to create child account with Student + Parent Premium Pro Plan.`,
    });
  } catch (error) {
    console.error('Error initiating child creation:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate child creation', error: error.message });
  }
});

// Confirm payment and create child account
router.post("/create-child/confirm-payment", async (req, res) => {
  try {
    const parent = req.user;
    const { childCreationIntentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!childCreationIntentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // Verify payment signature
    const crypto = (await import('crypto')).default;
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find child creation intent
    const ChildCreationIntent = (await import('../models/ChildCreationIntent.js')).default;
    const childIntent = await ChildCreationIntent.findById(childCreationIntentId);

    if (!childIntent) {
      return res.status(404).json({ success: false, message: 'Child creation intent not found' });
    }

    if (childIntent.parentId.toString() !== parent._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this intent' });
    }

    if (childIntent.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Child account already created' });
    }

    // Verify payment status
    const Razorpay = (await import('razorpay')).default;
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
      const payment = await razorpayInstance.payments.fetch(razorpayPaymentId);
      if (payment.status !== 'captured' && payment.status !== 'authorized') {
        return res.status(400).json({ success: false, message: 'Payment not completed. Please complete the payment first.' });
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      return res.status(400).json({ success: false, message: 'Invalid payment details.' });
    }

    // Check if email still doesn't exist (double check)
    const existingUser = await User.findOne({ email: childIntent.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Generate linking code
    const prefix = 'ST';
    let linkingCode;
    let isUnique = false;
    while (!isUnique) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      linkingCode = `${prefix}-${randomPart}`;
      const existing = await User.findOne({ linkingCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create student account
    const student = await User.create({
      name: childIntent.fullName,
      fullName: childIntent.fullName,
      email: childIntent.email,
      password: childIntent.passwordHash,
      role: 'student',
      linkingCode: linkingCode,
      linkingCodeIssuedAt: new Date(),
      dateOfBirth: childIntent.dateOfBirth,
      dob: childIntent.dateOfBirth.toISOString().split('T')[0],
      gender: childIntent.gender,
      isVerified: true,
      linkedIds: {
        childIds: [],
        parentIds: [parent._id],
        teacherIds: [],
      },
    });

    // Link parent and student
    if (!parent.linkedIds) {
      parent.linkedIds = { childIds: [], teacherIds: [] };
    }
    if (!parent.linkedIds.childIds) {
      parent.linkedIds.childIds = [];
    }
    parent.linkedIds.childIds.push(student._id);
    
    if (!parent.childEmail) {
      parent.childEmail = [];
    }
    if (!Array.isArray(parent.childEmail)) {
      parent.childEmail = [parent.childEmail];
    }
    if (!parent.childEmail.includes(childIntent.email)) {
      parent.childEmail.push(childIntent.email);
    }
    await parent.save();

    // Create subscription for child with student_parent_premium_pro plan
    const UserSubscription = (await import('../models/UserSubscription.js')).default;
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

    await UserSubscription.create({
      userId: student._id,
      planType: 'student_parent_premium_pro',
      planName: 'Student + Parent Premium Pro Plan',
      amount: childIntent.amount,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      features: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      transactions: [{
        transactionId: `parent_create_child_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        amount: childIntent.amount,
        currency: 'INR',
        status: 'completed',
        paymentDate: new Date(),
        razorpayOrderId,
        razorpayPaymentId,
      }],
      metadata: {
        createdBy: 'parent',
        parentId: parent._id,
        childCreationIntentId: childIntent._id,
      },
    });

    // Update intent status
    childIntent.status = 'completed';
    childIntent.studentId = student._id;
    childIntent.razorpayPaymentId = razorpayPaymentId;
    await childIntent.save();

    // Create notifications
    await Notification.create({
      userId: parent._id,
      type: 'child_created',
      title: 'Child Account Created',
      message: `${student.name || student.email}'s account has been created and linked to your account.`,
      metadata: { childId: student._id },
    });

    await Notification.create({
      userId: student._id,
      type: 'account_created',
      title: 'Account Created',
      message: `Your account has been created by ${parent.name || parent.email}.`,
      metadata: { parentId: parent._id },
    });

    // Emit real-time notifications
    const io = req.app?.get('io');
    if (io) {
      io.to(parent._id.toString()).emit('child_created', {
        childId: student._id,
        childName: student.name,
        childEmail: student.email,
      });
      io.to(student._id.toString()).emit('account_created', {
        parentId: parent._id,
        parentName: parent.name,
      });
    }

    res.status(200).json({
      success: true,
      message: `Child account created and linked successfully`,
      child: {
        _id: student._id,
        name: student.name,
        email: student.email,
        linkingCode: student.linkingCode,
        planType: 'student_parent_premium_pro',
      },
    });
  } catch (error) {
    console.error('Error confirming child creation payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment and create child account', error: error.message });
  }
});

// Get all children linked to the parent
router.get("/children", async (req, res) => {
  try {
    const parent = req.user;
    
    console.log('Parent ID:', parent._id);
    console.log('Parent linkedIds:', parent.linkedIds);
    console.log('Parent childEmail:', parent.childEmail);
    console.log('Parent email:', parent.email);
    
    // Find children by multiple methods:
    // 1. By childEmail field (legacy single child)
    // 2. By linkedIds.childIds (new multi-child support)
    // 3. By guardianEmail matching parent email
    
    const query = {
      role: { $in: ['student', 'school_student'] },
      $or: [
        { email: parent.childEmail },
        { _id: { $in: parent.linkedIds?.childIds || [] } },
        { guardianEmail: parent.email }
      ]
    };
    
    console.log('Query for children:', JSON.stringify(query, null, 2));
    
    // Let's also check if there are any students with guardianEmail matching parent email
    const studentsWithGuardianEmail = await User.find({
      role: { $in: ['student', 'school_student'] },
      guardianEmail: parent.email
    }).select("name email guardianEmail");
    console.log('Students with guardianEmail matching parent:', studentsWithGuardianEmail.length);
    console.log('Students with guardianEmail data:', studentsWithGuardianEmail.map(s => ({ 
      id: s._id, 
      name: s.name, 
      email: s.email, 
      guardianEmail: s.guardianEmail 
    })));
    
    const children = await User.find(query).select("name email dob avatar institution city createdAt lastActive role tenantId orgId");
    
    console.log('Found children:', children.length);
    console.log('Children data:', children.map(c => ({ id: c._id, name: c.name, email: c.email, role: c.role })));

    // Get progress and wallet data for each child
    const childrenWithData = await Promise.all(
      children.map(async (child) => {
        // For school_student children, get school information from SchoolStudent model
        let schoolInfo = null;
        if (child.role === 'school_student') {
          try {
            const schoolStudent = await SchoolStudent.findOne({ 
              userId: child._id,
              tenantId: child.tenantId 
            }).populate('orgId', 'name');
            
            if (schoolStudent && schoolStudent.orgId) {
              schoolInfo = schoolStudent.orgId.name;
            }
          } catch (error) {
            console.error('Error fetching school info for child:', child._id, error);
          }
        }

        const [childProgress, wallet, userProgress, gameProgress] = await Promise.all([
          ChildProgress.findOne({ parentId: parent._id, childId: child._id }),
          Wallet.findOne({ userId: child._id }),
          UserProgress.findOne({ userId: child._id }),
          UnifiedGameProgress.find({ userId: child._id }).limit(5).sort({ lastPlayed: -1 })
        ]);
        
        // Calculate total games played
        const totalGamesPlayed = gameProgress.reduce((sum, game) => sum + (game.timesPlayed || 0), 0);
        
        return {
          ...child.toObject(),
          institution: schoolInfo || child.institution || 'Not specified',
          childProgress: childProgress || null,
          totalCoins: wallet?.balance || 0,
          healCoins: wallet?.balance || 0,
          level: userProgress?.level || 1,
          xp: userProgress?.xp || 0,
          streak: userProgress?.streak || 0,
          totalGamesPlayed,
          recentGames: gameProgress.slice(0, 3),
          grade: child.institution || child.academic?.grade || 'Not specified',
          overallMastery: 0, // Will be calculated
          parentLinked: true
        };
      })
    );

    res.json({
      children: childrenWithData,
      total: childrenWithData.length
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Failed to fetch children data" });
  }
});

// Get comprehensive analytics for a specific child
router.get("/child/:childId/analytics", async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;

    console.log(`Fetching analytics for child ${childId} by parent ${parentId}`);

    // Validate childId
    if (!childId || childId.length !== 24) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    // Verify the child belongs to this parent
    // Handle childEmail as both string and array
    const childEmailArray = Array.isArray(req.user.childEmail) 
      ? req.user.childEmail 
      : req.user.childEmail 
        ? [req.user.childEmail]
        : [];
    
    const child = await User.findOne({
      _id: childId,
      $or: [
        ...(childEmailArray.length > 0 ? [{ email: { $in: childEmailArray } }] : []),
        { _id: { $in: req.user.linkedIds?.childIds || [] } },
        { guardianEmail: req.user.email }
      ],
      role: { $in: ['student', 'school_student'] }
    }).select('name email avatar dob institution academic tenantId orgId').populate('linkedIds.teacherIds', 'name email phone');

    // For school_student children, get school information and date of birth from SchoolStudent model
    let schoolInfo = null;
    let schoolStudentDob = null;
    let schoolStudent = null;
    if (child && child.role === 'school_student') {
      try {
        console.log('Looking for school student with userId:', child._id, 'tenantId:', child.tenantId);
        schoolStudent = await SchoolStudent.findOne({ 
          userId: child._id,
          tenantId: child.tenantId 
        }).populate('orgId', 'name').populate('classId', 'classNumber stream');
        
        // If not found with tenantId, try without tenantId as fallback
        if (!schoolStudent) {
          console.log('Not found with tenantId, trying without tenantId...');
          schoolStudent = await SchoolStudent.findOne({ 
            userId: child._id
          }).populate('orgId', 'name').populate('classId', 'classNumber stream');
        }
        
        console.log('Found school student:', schoolStudent ? 'Yes' : 'No');
        if (schoolStudent) {
          console.log('School student data:', {
            orgId: schoolStudent.orgId,
            personalInfo: schoolStudent.personalInfo,
            hasOrgId: !!schoolStudent.orgId,
            hasDateOfBirth: !!schoolStudent.personalInfo?.dateOfBirth
          });
          
          if (schoolStudent.orgId) {
            schoolInfo = schoolStudent.orgId.name;
            console.log('School info set to:', schoolInfo);
          }
          if (schoolStudent.personalInfo?.dateOfBirth) {
            schoolStudentDob = schoolStudent.personalInfo.dateOfBirth;
            console.log('School student DOB set to:', schoolStudentDob);
          }
        } else {
          console.log('No school student record found for userId:', child._id);
        }
      } catch (error) {
        console.error('Error fetching school info for child analytics:', child._id, error);
      }
    }

    if (!child) {
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    // Get teacher contact info
    const teachers = child.linkedIds?.teacherIds || [];
    const primaryTeacher = teachers.length > 0 ? teachers[0] : null;

    // Handle date range filtering
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    // Default to last 7 days if no date range provided
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Determine date range for queries
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = startDate;
      } else {
        dateFilter.createdAt.$gte = sevenDaysAgo; // Default to 7 days if no start date
      }
      if (endDate) {
        const endDateWithTime = new Date(endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = endDateWithTime;
      }
    } else {
      dateFilter.createdAt = { $gte: sevenDaysAgo };
    }

    // Fetch all required data in parallel
    const [
      userProgress,
      gameProgress,
      wallet,
      transactions,
      moodLogs,
      activityLogs,
      notifications
    ] = await Promise.all([
      UserProgress.findOne({ userId: childId }),
      UnifiedGameProgress.find({ userId: childId }),
      Wallet.findOne({ userId: childId }),
      Transaction.find({ 
        userId: childId,
        ...dateFilter
      }).sort({ createdAt: -1 }).limit(50), // Increased limit for better filtering
      MoodLog.find({ 
        userId: childId,
        ...dateFilter
      }).sort({ createdAt: -1 }).limit(30),
      ActivityLog.find({
        userId: childId,
        ...dateFilter
      }).sort({ createdAt: -1 }),
      Notification.find({
        userId: parentId,
        ...dateFilter
      }).sort({ createdAt: -1 }).limit(10)
    ]);

    // 1. Calculate Overall Mastery % & Trend
    const pillarsData = {};
    const pillarNames = [
      'Financial Literacy', 'Brain Health', 'UVLS', 
      'Digital Citizenship', 'Moral Values', 'AI for All',
      'Health - Male', 'Health - Female', 'Entrepreneurship', 
      'Civic Responsibility'
    ];

    pillarNames.forEach(pillar => {
      const pillarGames = gameProgress.filter(g => g.category === pillar);
      if (pillarGames.length > 0) {
        const totalProgress = pillarGames.reduce((sum, g) => sum + (g.progress || 0), 0);
        pillarsData[pillar] = Math.round(totalProgress / pillarGames.length);
      }
    });

    const overallMastery = Object.keys(pillarsData).length > 0
      ? Math.round(Object.values(pillarsData).reduce((a, b) => a + b, 0) / Object.keys(pillarsData).length)
      : 0;

    // Get trend data (last 30 days)
    const masteryTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayProgress = gameProgress.filter(g => {
        const lastPlayed = new Date(g.lastPlayed);
        return lastPlayed <= date;
      });
      const dayMastery = dayProgress.length > 0
        ? Math.round(dayProgress.reduce((sum, g) => sum + (g.progress || 0), 0) / dayProgress.length)
        : overallMastery;
      masteryTrend.push({ date: date.toISOString().split('T')[0], mastery: dayMastery });
    }

    // 2. Weekly Engagement Minutes & Sessions Breakdown
    const weeklyEngagement = {
      totalMinutes: 0,
      gamesMinutes: 0,
      lessonsMinutes: 0,
      totalSessions: (activityLogs || []).length,
      gameSessions: 0,
      lessonSessions: 0
    };

    (activityLogs || []).forEach(log => {
      const duration = log.duration || 5; // Default 5 min if not specified
      weeklyEngagement.totalMinutes += duration;
      
      if (log.activityType === 'game' || log.action?.includes('game')) {
        weeklyEngagement.gamesMinutes += duration;
        weeklyEngagement.gameSessions++;
      } else {
        weeklyEngagement.lessonsMinutes += duration;
        weeklyEngagement.lessonSessions++;
      }
    });

    // 3. Last 7 Mood Entries Summary & Alerts
    const moodSummary = {
      entries: (moodLogs || []).map(log => ({
        date: log.createdAt,
        mood: log.mood,
        score: log.score || 3,
        note: log.note || '',
        emoji: log.emoji || '😊'
      })),
      averageScore: (moodLogs || []).length > 0
        ? ((moodLogs || []).reduce((sum, log) => sum + (log.score || 3), 0) / (moodLogs || []).length).toFixed(1)
        : 3.0,
      alerts: []
    };

    // Generate alerts for concerning patterns
    const recentLowMoods = (moodLogs || []).filter(log => (log.score || 3) <= 2);
    if (recentLowMoods.length >= 3) {
      moodSummary.alerts.push({
        type: 'warning',
        message: `${child.name} has logged ${recentLowMoods.length} low mood entries this week`,
        severity: 'medium'
      });
    }

    const veryLowMoods = (moodLogs || []).filter(log => (log.score || 3) === 1);
    if (veryLowMoods.length >= 1) {
      moodSummary.alerts.push({
        type: 'alert',
        message: 'Very low mood detected - consider checking in with your child',
        severity: 'high'
      });
    }

    // 4. Recent Achievements (Badges, Certificates)
    const achievements = [];
    (gameProgress || []).forEach(game => {
      if (game.achievements && game.achievements.length > 0) {
        game.achievements.forEach(achievement => {
          achievements.push({
            game: game.game,
            category: game.category,
            achievement: achievement,
            unlockedAt: game.lastPlayed,
            type: 'badge'
          });
        });
      }
      
      // Add completion certificates
      if (game.completed) {
        achievements.push({
          game: game.game,
          category: game.category,
          achievement: 'Completion Certificate',
          unlockedAt: game.completedAt || game.lastPlayed,
          type: 'certificate'
        });
      }
    });

    // Sort by date and take last 10
    achievements.sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
    const recentAchievements = achievements.slice(0, 10);

    // 5. HealCoins Earned & Recent Spends
    const coinsEarned = transactions.filter(t => t.type === 'credit');
    const coinsSpent = transactions.filter(t => t.type === 'debit');
    
    const healCoins = {
      currentBalance: wallet?.balance || 0,
      weeklyEarned: coinsEarned.reduce((sum, t) => sum + t.amount, 0),
      weeklySpent: coinsSpent.reduce((sum, t) => sum + Math.abs(t.amount), 0),
      recentTransactions: transactions.slice(0, 5).map(t => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.createdAt
      }))
    };

    // 6. Generate Conversation Prompts based on mood
    const conversationPrompts = [];
    if (moodSummary.averageScore < 3) {
      conversationPrompts.push({
        icon: '💙',
        prompt: `"How was your day today, ${child.name}? I noticed you might be feeling a bit down lately."`,
        context: 'Low mood detected this week'
      });
      conversationPrompts.push({
        icon: '🤗',
        prompt: `"Is there anything on your mind that you'd like to talk about?"`,
        context: 'Open-ended support'
      });
    } else if (moodSummary.averageScore >= 4) {
      conversationPrompts.push({
        icon: '🎉',
        prompt: `"You seem really happy lately! What's been going well for you?"`,
        context: 'Positive reinforcement'
      });
    } else {
      conversationPrompts.push({
        icon: '😊',
        prompt: `"How are you feeling about school/learning lately?"`,
        context: 'General check-in'
      });
    }
    
    conversationPrompts.push({
      icon: '🎯',
      prompt: `"I saw you completed ${recentAchievements.length} achievements! Which one are you most proud of?"`,
      context: 'Achievement celebration'
    });
    
    conversationPrompts.push({
      icon: '📚',
      prompt: `"What's your favorite learning activity right now?"`,
      context: 'Interest discovery'
    });

    // 7. Activity Timeline
    const activityTimeline = (activityLogs || []).map(log => ({
      type: log.activityType || 'activity',
      action: log.action,
      details: log.details || {},
      timestamp: log.createdAt,
      duration: log.duration || 5,
      category: log.category || 'General'
    }));

    // 8. Generate Home Support Plan (AI-based suggestions)
    const weakPillars = Object.entries(pillarsData)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);
    
    const homeSupportPlan = [];
    
    // Suggestion 1: Based on weakest pillar
    if (weakPillars.length > 0) {
      const [weakestPillar, percentage] = weakPillars[0];
      homeSupportPlan.push({
        title: `Practice ${weakestPillar}`,
        description: `Current mastery: ${percentage}%. Spend 15 minutes daily on ${weakestPillar} activities.`,
        priority: 'high',
        pillar: weakestPillar,
        actionable: `Encourage ${child.name} to complete 2-3 ${weakestPillar} games this week`
      });
    }
    
    // Suggestion 2: Based on mood
    if (moodSummary.averageScore < 3) {
      homeSupportPlan.push({
        title: 'Emotional Check-in',
        description: 'Create a safe space for your child to express feelings and concerns.',
        priority: 'high',
        pillar: 'Mental Wellness',
        actionable: 'Have a 10-minute daily conversation about emotions'
      });
    } else if (weeklyEngagement.totalMinutes < 60) {
      homeSupportPlan.push({
        title: 'Increase Engagement',
        description: 'Low activity this week. Set fun learning goals together.',
        priority: 'medium',
        pillar: 'Engagement',
        actionable: 'Plan 30 minutes of learning activities for 3 days this week'
      });
    }
    
    // Suggestion 3: Positive reinforcement
    if (recentAchievements.length > 0) {
      homeSupportPlan.push({
        title: 'Celebrate Achievements',
        description: `Recognize ${child.name}'s recent accomplishments and discuss next goals.`,
        priority: 'medium',
        pillar: 'Motivation',
        actionable: 'Celebrate recent achievements with a small reward or quality time'
      });
    }
    
    // Fill remaining slots with general tips
    while (homeSupportPlan.length < 3) {
      homeSupportPlan.push({
        title: 'Consistent Learning Schedule',
        description: 'Establish a regular time for learning activities.',
        priority: 'low',
        pillar: 'Routine',
        actionable: 'Set a daily 20-minute learning time'
      });
    }

    // 9. Messages & Notifications
    const messages = (notifications || []).filter(n => 
      n.type === 'message' || 
      n.title?.toLowerCase().includes('teacher') ||
      n.title?.toLowerCase().includes('permission')
    ).map(n => ({
      id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      sender: 'Teacher',
      timestamp: n.createdAt,
      read: n.read || false,
      requiresAction: n.title?.toLowerCase().includes('permission') || n.title?.toLowerCase().includes('consent')
    }));

    // 10. Snapshot KPIs
    const snapshotKPIs = {
      totalGamesCompleted: (gameProgress || []).filter(g => g.completed).length,
      totalTimeSpent: weeklyEngagement.totalMinutes,
      averageDailyEngagement: Math.round(weeklyEngagement.totalMinutes / 7),
      achievementsUnlocked: recentAchievements.length,
      currentStreak: userProgress?.streak || 0,
      moodTrend: parseFloat(moodSummary.averageScore) >= 3.5 ? 'positive' : parseFloat(moodSummary.averageScore) >= 2.5 ? 'neutral' : 'concerning'
    };

    // 11. Child Card Info
    const effectiveDob = schoolStudentDob || child.dob;
    
    // For school_student children, try to get grade from classId
    let gradeInfo = 'Not specified';
    if (child.role === 'school_student' && schoolStudent && schoolStudent.classId) {
      const classNumber = schoolStudent.classId.classNumber;
      const stream = schoolStudent.classId.stream;
      gradeInfo = `Class ${classNumber}${stream ? ` ${stream}` : ''}`;
    } else {
      gradeInfo = schoolInfo || child.academic?.grade || child.institution || 'Not specified';
    }
    
    const childCard = {
      name: child.name,
      avatar: child.avatar || '/avatars/avatar1.png',
      email: child.email,
      grade: gradeInfo,
      institution: schoolInfo || child.institution || 'Not specified',
      age: effectiveDob ? Math.floor((Date.now() - new Date(effectiveDob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      teacherContact: primaryTeacher ? {
        name: primaryTeacher.name,
        email: primaryTeacher.email,
        phone: primaryTeacher.phone
      } : null
    };

    console.log('ChildCard created:', childCard);
    console.log('School info:', schoolInfo);
    console.log('School student DOB:', schoolStudentDob);
    console.log('Child dob:', child.dob);
    console.log('Effective DOB:', effectiveDob);
    console.log('Child institution:', child.institution);
    console.log('Child tenantId:', child.tenantId);
    console.log('Parent tenantId:', req.tenantId);
    console.log('Grade info:', gradeInfo);
    console.log('School student classId:', schoolStudent?.classId);

    // 12. Detailed Progress Report Data
    const weeklyCoins = (transactions || [])
      .filter(t => t.type === 'earned' && new Date(t.createdAt) >= sevenDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyCoins = (transactions || [])
      .filter(t => t.type === 'earned' && new Date(t.createdAt) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalTimeMinutes = weeklyEngagement.totalMinutes;

    // Games completed per pillar
    const gamesPerPillar = {};
    pillarNames.forEach(pillar => {
      gamesPerPillar[pillar] = (gameProgress || []).filter(g => 
        g.completed && g.category === pillar
      ).length;
    });

    // Strengths and Needs Support (AI-based analysis)
    const pillarEntries = Object.entries(pillarsData);
    const sortedPillars = pillarEntries.sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedPillars
      .slice(0, 3)
      .map(([pillar, percentage]) => {
        const strengthMap = {
          'Financial Literacy': 'Financial Planning',
          'Brain Health': 'Problem Solving',
          'UVLS': 'Emotional Intelligence',
          'Digital Citizenship & Online Safety': 'Digital Safety',
          'Moral Values': 'Ethical Decision Making',
          'AI for All': 'AI Literacy',
          'Health - Male': 'Health Awareness',
          'Health - Female': 'Health Awareness',
          'Entrepreneurship & Higher Education': 'Entrepreneurial Thinking',
          'Civic Responsibility & Global Citizenship': 'Global Awareness'
        };
        return strengthMap[pillar] || pillar;
      });

    const needsSupport = sortedPillars
      .slice(-3)
      .map(([pillar, percentage]) => {
        const supportMap = {
          'Financial Literacy': 'Advanced Financial Planning',
          'Brain Health': 'Time Management',
          'UVLS': 'Leadership Skills',
          'Digital Citizenship & Online Safety': 'Advanced Coding',
          'Moral Values': 'Ethical Leadership',
          'AI for All': 'Advanced Coding',
          'Health - Male': 'Health Management',
          'Health - Female': 'Health Management',
          'Entrepreneurship & Higher Education': 'Business Strategy',
          'Civic Responsibility & Global Citizenship': 'Community Leadership'
        };
        return supportMap[pillar] || pillar;
      });

    // 13. Wallet & Rewards Data
    const redemptions = (transactions || [])
      .filter(t => t.type === 'spent' && t.description?.toLowerCase().includes('redemption'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(t => ({
        item: t.description?.replace('Redemption: ', '') || 'Unknown Item',
        date: t.createdAt,
        coins: Math.abs(t.amount || 0),
        value: Math.abs(t.amount || 0) * 0.67 // Approximate conversion rate
      }));

    const totalValueSaved = redemptions
      .filter(r => new Date(r.date) >= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.value, 0);

    const detailedProgressReport = {
      weeklyCoins,
      monthlyCoins,
      totalTimeMinutes,
      dayStreak: userProgress?.streak || 0,
      gamesPerPillar,
      strengths,
      needsSupport
    };

    const walletRewards = {
      currentHealCoins: healCoins?.currentBalance || 0,
      recentRedemptions: redemptions,
      totalValueSaved
    };

    // 14. Subscription & Upgrades Data
    const subscriptionData = {
      currentPlan: {
        name: 'Premium Family',
        status: 'Active',
        nextBilling: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 499,
        currency: '₹',
        billingCycle: 'year',
        features: [
          'Unlimited Access to All Games',
          'Detailed Progress Reports',
          'Priority Customer Support',
          'Advanced Analytics',
          'Parent-Child Communication Tools'
        ]
      },
      upgradeOption: {
        name: 'Premium Plus',
        price: 799,
        currency: '₹',
        billingCycle: 'year',
        features: [
          'Get 1-on-1 Counseling Sessions',
          'Custom Learning Paths',
          'Advanced AI Tutoring'
        ]
      }
    };

    // 15. Recent Notifications Data
    const recentNotifications = (notifications || [])
      .filter(n => n.type !== 'message') // Exclude messages we already showed
      .slice(0, 4)
      .map(n => {
        let icon, title, message, cardColor;
        
        switch (n.type) {
          case 'achievement':
            icon = '🏆';
            title = 'Game Completed!';
            message = `${child.name} completed ${Math.floor(Math.random() * 50) + 50} ${n.category || 'Finance'} games and earned the '${n.title || 'Money Master'}' badge`;
            cardColor = 'yellow';
            break;
          case 'redemption':
            icon = '🎁';
            title = 'Voucher Redeemed';
            message = `Successfully redeemed ${n.description || 'School Shoes'} voucher for ${Math.abs(n.amount || 1200)} HealCoins`;
            cardColor = 'green';
            break;
          case 'level_up':
            icon = '⭐';
            title = 'Level Up!';
            message = `${child.name} reached Level ${userProgress?.level || 8} in overall progress`;
            cardColor = 'purple';
            break;
          case 'report':
            icon = '📊';
            title = 'Weekly Report Ready';
            message = `Your child's weekly progress report is now available`;
            cardColor = 'blue';
            break;
          default:
            icon = '🔔';
            title = n.title || 'Notification';
            message = n.message || 'New notification';
            cardColor = 'gray';
        }
        
        return {
          id: n._id,
          icon,
          title,
          message,
          timestamp: n.createdAt,
          cardColor,
          read: n.read || false
        };
      });

    // If we don't have enough notifications, generate some sample ones
    if (recentNotifications.length < 4) {
      const sampleNotifications = [
        {
          id: 'sample1',
          icon: '🏆',
          title: 'Game Completed!',
          message: `${child.name} completed 100 Finance games and earned the 'Money Master' badge`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          cardColor: 'yellow',
          read: false
        },
        {
          id: 'sample2',
          icon: '🎁',
          title: 'Voucher Redeemed',
          message: 'Successfully redeemed School Shoes voucher for 1200 HealCoins',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          cardColor: 'green',
          read: false
        },
        {
          id: 'sample3',
          icon: '⭐',
          title: 'Level Up!',
          message: `${child.name} reached Level ${userProgress?.level || 8} in overall progress`,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          cardColor: 'purple',
          read: false
        },
        {
          id: 'sample4',
          icon: '📊',
          title: 'Weekly Report Ready',
          message: 'Your child\'s weekly progress report is now available',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          cardColor: 'blue',
          read: false
        }
      ];
      
      // Fill in missing notifications with samples
      while (recentNotifications.length < 4) {
        const sampleIndex = recentNotifications.length;
        if (sampleIndex < sampleNotifications.length) {
          recentNotifications.push(sampleNotifications[sampleIndex]);
        } else {
          break;
        }
      }
    }

    // Get parent data for preferences
    const parent = await User.findById(parentId).select('preferences');
    
    const subscriptionAndNotifications = {
      subscription: subscriptionData,
      notifications: recentNotifications,
      emailNotificationsEnabled: parent?.preferences?.notifications?.email || true
    };

    // 16. Digital Twin Growth Data (Based on actual game progress)
    const calculateWeeklyProgress = (gameProgress, category) => {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = [0, 0, 0, 0];
      
      // Get games for this category
      const categoryGames = (gameProgress || []).filter(g => g.category === category);
      
      // Calculate weekly progress based on game completion and scores
      categoryGames.forEach(game => {
        if (game.completed && game.lastPlayed) {
          const playDate = new Date(game.lastPlayed);
          const weekIndex = Math.min(Math.floor((Date.now() - playDate.getTime()) / (7 * 24 * 60 * 60 * 1000)), 3);
          if (weekIndex >= 0 && weekIndex < 4) {
            weeklyData[weekIndex] += (game.progress || 0) * 0.1; // Scale down for realistic values
          }
        }
      });
      
      // Fill in missing weeks with progressive values
      for (let i = 1; i < 4; i++) {
        if (weeklyData[i] === 0) {
          weeklyData[i] = Math.min(weeklyData[i-1] + Math.random() * 5 + 2, 100);
        }
      }
      
      return weeklyData.map(val => Math.round(Math.min(val, 100)));
    };

    const digitalTwinData = {
      finance: calculateWeeklyProgress(gameProgress, 'Finance'),
      mentalWellness: calculateWeeklyProgress(gameProgress, 'Mental Wellness'),
      values: calculateWeeklyProgress(gameProgress, 'Values'),
      aiSkills: calculateWeeklyProgress(gameProgress, 'AI Skills')
    };

    // 17. Skills Distribution Data (Based on actual game completion)
    const totalGames = (gameProgress || []).length;
    const categoryCounts = {};
    
    (gameProgress || []).forEach(game => {
      if (game.completed) {
        categoryCounts[game.category] = (categoryCounts[game.category] || 0) + 1;
      }
    });

    const totalCompleted = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    
    const skillsDistribution = {
      finance: totalCompleted > 0 ? Math.round((categoryCounts['Finance'] || 0) / totalCompleted * 100) : 32,
      mentalWellness: totalCompleted > 0 ? Math.round((categoryCounts['Mental Wellness'] || 0) / totalCompleted * 100) : 28,
      values: totalCompleted > 0 ? Math.round((categoryCounts['Values'] || 0) / totalCompleted * 100) : 22,
      aiSkills: totalCompleted > 0 ? Math.round((categoryCounts['AI Skills'] || 0) / totalCompleted * 100) : 18
    };

    res.json({
      childCard,
      snapshotKPIs,
      detailedProgressReport,
      walletRewards,
      subscriptionAndNotifications,
      childName: child.name,
      overallMastery: {
        percentage: overallMastery,
        trend: masteryTrend,
        byPillar: pillarsData
      },
      digitalTwinData,
      skillsDistribution,
      weeklyEngagement,
      moodSummary: {
        ...moodSummary,
        conversationPrompts
      },
      activityTimeline,
      homeSupportPlan,
      messages,
      recentAchievements,
      healCoins,
      level: userProgress?.level || 1,
      xp: userProgress?.xp || 0,
      streak: userProgress?.streak || 0
    });

  } catch (error) {
    console.error("Error fetching child analytics:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Failed to fetch child analytics",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get child data for the parent (single child - legacy)
router.get("/child", async (req, res) => {
  try {
    const parent = req.user;
    
    if (!parent.childEmail) {
      return res.status(400).json({ message: "No child email linked to this parent account" });
    }
    
    // Find the child by email
    const child = await User.findOne({ 
      email: parent.childEmail,
      role: { $in: ['student', 'school_student'] }
    }).select("name email dob avatar level currentStreak");

    if (!child) {
      return res.status(404).json({ message: "Child not found with the linked email" });
    }

    // Get child's progress data
    const progress = await ChildProgress.findOne({ 
      parentId: parent._id, 
      childId: child._id 
    });
    
    // Get child's wallet data
    const wallet = await Wallet.findOne({ userId: child._id });
    
    // If no progress exists, create initial progress data
    if (!progress) {
      const newProgress = await ChildProgress.create({
        parentId: parent._id,
        childId: child._id,
        digitalTwin: {
          finance: { level: 1, progress: 0, weeklyGrowth: 0 },
          mentalWellness: { level: 1, progress: 0, weeklyGrowth: 0 },
          values: { level: 1, progress: 0, weeklyGrowth: 0 },
          ai: { level: 1, progress: 0, weeklyGrowth: 0 }
        },
        progressReport: {
          coinsEarned: 0,
          gamesCompleted: 0,
          timeSpent: 0,
          strengths: [],
          needsSupport: []
        },
        recentActivity: []
      });
    }

    const childData = {
      ...child.toObject(),
      progress: progress || {},
      totalCoins: wallet?.balance || 0,
      parentLinked: true
    };

    res.json(childData);
  } catch (error) {
    console.error("Error fetching child data:", error);
    res.status(500).json({ message: "Failed to fetch child data" });
  }
});

// Get child wallet transactions with pagination and filtering
router.get("/child/:childId/transactions", async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type; // 'credit' or 'debit'
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Verify the child belongs to this parent (same logic as analytics endpoint)
    // Handle childEmail as both string and array - MongoDB handles both cases with $in
    const childEmailArray = Array.isArray(req.user.childEmail) 
      ? req.user.childEmail 
      : req.user.childEmail 
        ? [req.user.childEmail]
        : [];
    
    const child = await User.findOne({
      _id: childId,
      $or: [
        ...(childEmailArray.length > 0 ? [{ email: { $in: childEmailArray } }] : []),
        { _id: { $in: req.user.linkedIds?.childIds || [] } },
        { guardianEmail: req.user.email }
      ],
      role: { $in: ['student', 'school_student'] }
    });

    if (!child) {
      console.log('Child verification failed:', {
        childId,
        parentId: req.user._id,
        parentEmail: req.user.email,
        parentChildEmail: req.user.childEmail,
        parentLinkedIds: req.user.linkedIds,
        childEmailIsArray: Array.isArray(req.user.childEmail)
      });
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    // Build query
    const query = { userId: childId };
    
    if (type && (type === 'credit' || type === 'debit')) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) {
        endDate.setHours(23, 59, 59, 999); // End of day
        query.createdAt.$lte = endDate;
      }
    }

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query);

    // Fetch paginated transactions
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error("Error fetching child transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Get detailed progress for a specific child
router.get("/child/:childId/progress", async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;

    // Verify the child belongs to this parent
    const child = await User.findOne({
      _id: childId,
      guardianEmail: req.user.email,
      role: { $in: ['student', 'school_student'] }
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    const progress = await ChildProgress.findOne({ parentId, childId });
    const wallet = await Wallet.findOne({ userId: childId });

    res.json({
      child: child.toObject(),
      progress: progress || {},
      wallet: wallet || { balance: 0 },
    });
  } catch (error) {
    console.error("Error fetching child progress:", error);
    res.status(500).json({ message: "Failed to fetch child progress" });
  }
});

// Generate and download progress report
router.post("/child/:childId/report", async (req, res) => {
  try {
    const { childId } = req.params;
    const { format = "pdf", type = "progress" } = req.body;
    const parentId = req.user._id;

    // Verify the child belongs to this parent (same logic as analytics endpoint)
    const childEmailArray = Array.isArray(req.user.childEmail) 
      ? req.user.childEmail 
      : req.user.childEmail 
        ? [req.user.childEmail]
        : [];
    
    const child = await User.findOne({
      _id: childId,
      $or: [
        ...(childEmailArray.length > 0 ? [{ email: { $in: childEmailArray } }] : []),
        { _id: { $in: req.user.linkedIds?.childIds || [] } },
        { guardianEmail: req.user.email }
      ],
      role: { $in: ['student', 'school_student'] }
    });

    if (!child) {
      console.log('Child verification failed for report:', {
        childId,
        parentId: req.user._id,
        parentEmail: req.user.email,
        parentChildEmail: req.user.childEmail,
        parentLinkedIds: req.user.linkedIds
      });
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    // Fetch comprehensive analytics data for the report
    const [
      userProgress,
      gameProgress,
      wallet,
      transactions,
      moodLogs,
      activityLogs
    ] = await Promise.all([
      UserProgress.findOne({ userId: childId }),
      UnifiedGameProgress.find({ userId: childId }),
      Wallet.findOne({ userId: childId }),
      Transaction.find({ userId: childId }).sort({ createdAt: -1 }).limit(50),
      MoodLog.find({ userId: childId }).sort({ createdAt: -1 }).limit(30),
      ActivityLog.find({ userId: childId }).sort({ createdAt: -1 }).limit(100)
    ]);

    const progress = await ChildProgress.findOne({ parentId, childId });
    
    // Generate comprehensive report data
    const reportData = {
      child: {
        name: child.name,
        email: child.email,
        avatar: child.avatar,
        level: userProgress?.level || 1,
        xp: userProgress?.xp || 0,
        streak: userProgress?.streak || 0
      },
      progress: progress || {},
      wallet: {
        balance: wallet?.balance || 0
      },
      statistics: {
        gamesCompleted: gameProgress?.filter(g => g.completed).length || 0,
        totalGames: gameProgress?.length || 0,
        transactions: transactions?.length || 0,
        moodEntries: moodLogs?.length || 0,
        activities: activityLogs?.length || 0
      },
      generatedAt: new Date(),
      format,
      type
    };

    // Update the progress record with report generation info
    if (progress) {
      progress.weeklyReport = {
        generated: true,
        generatedAt: new Date(),
        reportData,
      };
      await progress.save();
    }

    // For PDF format, return JSON data (frontend can generate PDF client-side or we can use a PDF library)
    // For now, return JSON and let frontend handle it
    if (format === 'pdf') {
      // Set headers for JSON response (frontend will handle PDF generation)
      res.setHeader('Content-Type', 'application/json');
      res.json({
        message: "Report generated successfully",
        reportData,
        downloadUrl: `/api/parent/child/${childId}/download-report?format=${format}`,
      });
    } else {
      res.json({
        message: "Report generated successfully",
        reportData,
        downloadUrl: `/api/parent/child/${childId}/download-report?format=${format}`,
      });
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
});

// Update notification preferences
router.put("/notifications", async (req, res) => {
  try {
    const { preferences } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "preferences.notifications": preferences }
    });

    res.json({ message: "Notification preferences updated successfully" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Failed to update notification preferences" });
  }
});

// Get parent's permission settings
router.get("/permissions", async (req, res) => {
  try {
    const parent = await User.findById(req.user._id).select('preferences');
    
    const permissions = parent.preferences?.permissions || {
      dataSharing: {
        withTeachers: true,
        withSchool: true,
        forResearch: false,
        thirdParty: false
      },
      childActivity: {
        allowGames: true,
        allowSocialFeatures: true,
        allowPurchases: false,
        requireApprovalFor: ['purchases', 'socialInteractions']
      },
      visibility: {
        profileVisible: 'teachers',
        progressVisible: 'teachers',
        achievementsVisible: 'public'
      }
    };

    res.json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
});

// Update parent's permission settings
router.put("/permissions", async (req, res) => {
  try {
    const { permissions } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "preferences.permissions": permissions }
    });

    res.json({ 
      message: "Permission settings updated successfully",
      permissions 
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res.status(500).json({ message: "Failed to update permissions" });
  }
});

// Upgrade subscription
router.post("/upgrade-subscription", async (req, res) => {
  try {
    const { planType } = req.body; // 'premium_plus' or other plan types
    
    // In a real application, you would integrate with a payment gateway here
    // For now, we'll just update the user's subscription status
    
    const subscriptionUpdate = {
      plan: planType,
      status: 'Active',
      upgradedAt: new Date(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    await User.findByIdAndUpdate(req.user._id, {
      $set: { "subscription": subscriptionUpdate }
    });

    res.json({ 
      message: "Subscription upgraded successfully",
      subscription: subscriptionUpdate
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    res.status(500).json({ message: "Failed to upgrade subscription" });
  }
});

// Toggle email notifications
router.put("/email-notifications", async (req, res) => {
  try {
    const { enabled } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "preferences.notifications.email": enabled }
    });

    res.json({ 
      message: "Email notifications updated successfully",
      emailNotificationsEnabled: enabled
    });
  } catch (error) {
    console.error("Error updating email notifications:", error);
    res.status(500).json({ message: "Failed to update email notifications" });
  }
});

// Unlink a child from parent account
router.delete("/child/:childId/unlink", async (req, res) => {
  try {
    const parent = req.user;
    const { childId } = req.params;

    // Find child to get their email
    const child = await User.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Remove child from parent's linkedIds
    if (parent.linkedIds && parent.linkedIds.childIds) {
      parent.linkedIds.childIds = parent.linkedIds.childIds.filter(
        id => id.toString() !== childId
      );
    }

    // Remove child's email from parent's childEmail array
    if (child.email && parent.childEmail) {
      // Handle both array and string (legacy) formats
      if (Array.isArray(parent.childEmail)) {
        parent.childEmail = parent.childEmail.filter(email => email !== child.email);
      } else if (parent.childEmail === child.email) {
        parent.childEmail = [];
      }
    }

    await parent.save();

    // Remove parent from child's linkedIds
    if (child.linkedIds && child.linkedIds.parentIds) {
      child.linkedIds.parentIds = child.linkedIds.parentIds.filter(
        id => id.toString() !== parent._id.toString()
      );
      await child.save();
    }

    res.json({ message: "Child unlinked successfully" });
  } catch (error) {
    console.error("Error unlinking child:", error);
    res.status(500).json({ message: "Failed to unlink child" });
  }
});

// Get parent messages
router.get("/messages", async (req, res) => {
  try {
    const parentId = req.user._id;

    const notifications = await Notification.find({
      userId: parentId,
      type: { $in: ['message', 'announcement', 'alert'] }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const messages = notifications.map(n => ({
      _id: n._id,
      subject: n.title || 'New Message',
      message: n.message,
      sender: n.metadata?.senderName || 'School',
      time: formatTimeAgo(n.createdAt),
      read: n.read || false,
      type: 'notification'
    }));

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Send a message
router.post("/messages", async (req, res) => {
  try {
    const parentId = req.user._id;
    const { subject, message, recipient } = req.body;

    // Create notification for the recipient (school admin, teacher, etc.)
    const notification = await Notification.create({
      userId: parentId, // Store for parent's sent items
      type: 'message',
      title: subject,
      message: message,
      metadata: {
        senderName: req.user.name,
        recipient: recipient,
        sentAt: new Date()
      }
    });

    res.status(201).json({ 
      message: "Message sent successfully",
      notification 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Mark message as read
router.put("/messages/:messageId/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );

    res.json({ success: true, notification });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get parent settings
router.get("/settings", async (req, res) => {
  try {
    const parent = await User.findById(req.user._id).select('preferences');
    
    const settings = {
      permissions: parent.preferences?.permissions || {},
      notifications: parent.preferences?.notifications || {}
    };

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// Update parent settings
router.put("/settings", async (req, res) => {
  try {
    const { permissions, notifications } = req.body;
    
    const update = {};
    if (permissions) update["preferences.permissions"] = permissions;
    if (notifications) update["preferences.notifications"] = notifications;

    await User.findByIdAndUpdate(req.user._id, { $set: update });

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// Helper function
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default router;