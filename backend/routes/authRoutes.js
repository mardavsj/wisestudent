import express from "express";
import {
  registerByAdmin,
  sendOTP,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPasswordWithOTP,
  checkVerificationStatus,
  login,
  googleLogin
} from "../controllers/authController.js";
import {
  initiateParentRegistration,
  confirmParentRegistration,
  linkStudentToParent,
  linkStudentToParentSelf,
  verifyParentLinkCode,
  initiateStudentRegistration,
  finalizeStudentRegistration,
  initiateStudentRegistrationWithPlan,
  initiateStandaloneStudentRegistrationWithPlan,
  finalizeStudentRegistrationWithPayment,
  linkSchoolStudentToParent,
  linkParentToSchoolStudent,
  verifySchoolStudentLinkCode,
  initiateAdditionalChildLink,
  confirmAdditionalChildLink,
} from '../controllers/parentRegistrationController.js';
import { requireAuth } from "../middlewares/requireAuth.js";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/User.js";
import UserSubscription from "../models/UserSubscription.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ Student Self-Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, dateOfBirth } = req.body;

    if (!email || !password || !fullName || !dateOfBirth) {
      return res.status(400).json({ message: "Email, password, full name, and date of birth are required" });
    }

    // Validate dateOfBirth
    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth format" });
    }
    const now = new Date();
    if (parsedDob > now) {
      return res.status(400).json({ message: "Date of birth cannot be in the future" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: fullName.trim(),
      fullName: fullName.trim(),
      dateOfBirth: parsedDob,
      dob: dateOfBirth,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      isVerified: false,
    });

    // Automatically create freemium subscription for new student
    try {
      await UserSubscription.create({
        userId: newUser._id,
        planType: 'free',
        planName: 'Free Plan',
        amount: 0,
        status: 'active',
        startDate: new Date(),
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
      });
      console.log(`✅ Created freemium subscription for student: ${newUser._id}`);
    } catch (subError) {
      console.error('Error creating freemium subscription:', subError);
      // Don't fail registration if subscription creation fails
    }

    const otpResult = await sendOTP(newUser.email, "verify");

    res.status(200).json({
      message: otpResult?.success
        ? "OTP sent to email for verification"
        : "Account created. OTP email failed; please use resend OTP.",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ Setup First Admin (one-time setup)
router.post("/setup-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists. Use /admin-register for additional admins.",
      });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name: name || normalizedEmail,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    const token = generateToken(newAdmin._id);

    res
      .cookie("finmen_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "First admin created successfully",
        user: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
  } catch (err) {
    console.error("Admin setup error:", err);
    res.status(500).json({ message: "Admin setup failed" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", verifyOTP);

// ✅ Resend OTP
router.post("/resend-otp", resendOTP);

// ✅ Check Verification Status
router.post("/check-verification", checkVerificationStatus);

// ✅ Login with role-based checks
router.post("/login", login);

// ✅ Google Login
router.post("/google", googleLogin);

// ✅ Forgot Password (sends OTP)
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password with OTP
router.post("/reset-password", resetPasswordWithOTP);

// ✅ Google Login (Student only)
// Google authentication endpoints removed

// ✅ Parent/Seller/CSR Self-Registration (no verification required)
router.post("/register-stakeholder", async (req, res) => {
  try {
    const { 
      email, password, name, role,
      // Parent fields
      childEmail,
      // Seller fields  
      businessName, shopType,
      // CSR fields
      organization,
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }

    if (!["parent", "seller", "csr"].includes(role)) {
      return res.status(400).json({ message: "Role must be one of: parent, seller, csr" });
    }

    // Role-specific validation
    if (role === "seller" && (!businessName || !shopType)) {
      return res.status(400).json({ message: "Business name and shop type are required for seller role" });
    }
    
    if (role === "csr" && !organization) {
      return res.status(400).json({ message: "Organization name is required for CSR role" });
    }
    

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true, // Auto-verified for stakeholders
      // Parents are auto-approved; others remain pending for admin review
      approvalStatus: role === "parent" ? "approved" : "pending",
    };

    // Add role-specific fields
    if (role === "seller") {
      userData.businessName = businessName;
      userData.shopType = shopType;
    } else if (role === "csr") {
      userData.organization = organization;
    }

    const newUser = await User.create(userData);

    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    const message = role === "parent"
      ? `${roleLabel} account created successfully. Your account is active.`
      : `${roleLabel} account created successfully. Your account is pending admin approval.`;

    res.status(201).json({
      message,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        approvalStatus: newUser.approvalStatus,
      },
    });
  } catch (err) {
    console.error("Stakeholder registration error:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post('/parent-registration/initiate', initiateParentRegistration);
router.post('/parent-registration/confirm', confirmParentRegistration);
router.post('/parent-registration/link-student', linkStudentToParent);
router.post('/parent-registration/verify-parent-code', verifyParentLinkCode);

// Student parent linking routes
router.post('/student/link-parent', requireAuth, linkStudentToParentSelf);
router.post('/school-student/link-parent', requireAuth, linkSchoolStudentToParent);
router.post('/parent/link-school-student', requireAuth, linkParentToSchoolStudent);
router.post('/school-student/verify-code', verifySchoolStudentLinkCode);

// Additional child linking routes (for parents who already have a family plan)
router.post('/parent/initiate-additional-child-link', requireAuth, initiateAdditionalChildLink);
router.post('/parent/confirm-additional-child-link', requireAuth, confirmAdditionalChildLink);

router.post('/student-registration/initiate', initiateStudentRegistration);
router.post('/student-registration/finalize', finalizeStudentRegistration);
router.post('/student-registration/initiate-with-plan', initiateStudentRegistrationWithPlan);
router.post('/student-registration/initiate-standalone-with-plan', initiateStandaloneStudentRegistrationWithPlan);
router.post('/student-registration/finalize-with-payment', finalizeStudentRegistrationWithPayment);

// ✅ Removed admin-only registration route

// ✅ Get Logged-in User
router.get("/me", requireAuth, async (req, res) => {
  try {
    // Ensure school_students have a linking code
    if (req.user.role === 'school_student' && !req.user.linkingCode) {
      const user = await User.findById(req.user._id);
      if (user && !user.linkingCode) {
        try {
          const prefix = 'SST';
          user.linkingCode = await User.generateUniqueLinkingCode(prefix);
          user.linkingCodeIssuedAt = new Date();
          await user.save();
          // Update req.user with the new linking code
          req.user.linkingCode = user.linkingCode;
          req.user.linkingCodeIssuedAt = user.linkingCodeIssuedAt;
        } catch (err) {
          console.error('Failed to generate linking code for school_student:', err);
        }
      } else if (user && user.linkingCode) {
        req.user.linkingCode = user.linkingCode;
        req.user.linkingCodeIssuedAt = user.linkingCodeIssuedAt;
      }
    }
    res.json(req.user);
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.clearCookie("finmen_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successful" });
});

export default router;