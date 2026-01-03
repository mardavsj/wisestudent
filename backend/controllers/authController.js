import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import UserSubscription from "../models/UserSubscription.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendMail.js";
import { generateAvatar } from "../utils/avatarGenerator.js";
import { verifyGoogleAccessToken } from "../utils/googleAuth.js";


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, type = "verify", sendEmailSync = false) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (user.role === "admin" || user.role === "parent" || user.role === "seller" || user.role === "csr")) {
      return { success: true, message: "No OTP required for admin/parent/seller/csr accounts" };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP first - this is critical and must succeed
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        otp,
        otpExpiresAt: expiresAt,
        otpType: type,
      }
    );

    const subject = type === "verify" ? "Verify Your Email - Wise Student" : "Reset Your Password - Wise Student";
    const isPasswordReset = type === "reset";
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Wise Student</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Digital Wellness & Financial Literacy Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">${isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}</h2>
                    <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      ${isPasswordReset 
                        ? 'We received a request to reset your password. Use the verification code below to proceed with resetting your password.' 
                        : 'Thank you for signing up! Please verify your email address by entering the verification code below.'}
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    
                    <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      <strong>⏱️ Valid for 10 minutes</strong><br>
                      This code will expire in 10 minutes for security reasons. If you didn't request this code, please ignore this email or contact our support team if you have concerns.
                    </p>
                  </td>
                </tr>
                
                <!-- Security Notice -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                      <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                        <strong>🔒 Security Tip:</strong> Never share this code with anyone. Wise Student staff will never ask for your verification code.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                      If you're having trouble, please contact our support team at 
                      <a href="mailto:support@wisestudent.org" style="color: #667eea; text-decoration: none;">support@wisestudent.org</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                      © ${new Date().getFullYear()} Wise Student. All rights reserved.<br>
                      This is an automated message, please do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Resend API is fast and reliable, so we can send synchronously
    // This provides real-time feedback to users
    try {
      console.log(`📧 Sending OTP email to ${email} for ${type} via Resend...`);
      const startTime = Date.now();
      
      // Resend API is typically very fast (1-3 seconds), use 10 second timeout
      const timeoutDuration = 10000; // 10 seconds for Resend API
      
      const emailPromise = sendEmail({ to: email, subject, html: message });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Email sending timeout after ${timeoutDuration/1000} seconds`)), timeoutDuration)
      );
      
      await Promise.race([emailPromise, timeoutPromise]);
      
      const duration = Date.now() - startTime;
      console.log(`✅ OTP email sent successfully to ${email} for ${type} (took ${duration}ms)`);
      
      return { success: true, message: "OTP sent successfully. Please check your email inbox." };
    } catch (emailErr) {
      const errorMessage = emailErr?.message || "Unknown email error";
      const isTimeout = errorMessage.includes("timeout");
      
      // Log the error
      console.error(`❌ Email send error for ${email}:`, errorMessage);
      
      // Check if it's a configuration error
      if (errorMessage.includes("not configured") || errorMessage.includes("RESEND_API_KEY")) {
        return { 
          success: false, 
          message: "Email service is not configured properly. Please contact support." 
        };
      }
      
      // For other errors, still return success since OTP is saved
      // User can request resend if email doesn't arrive
      console.warn(`⚠️ Email send failed for ${email}, but OTP is saved. User can request resend.`);
      return { 
        success: true, 
        message: "OTP generated successfully. If you don't receive the email, please try resending." 
      };
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    const errorMessage = error?.message || "Unknown error";
    // Non-fatal: return failure to caller instead of throwing
    return { success: false, message: `Failed to generate or store OTP: ${errorMessage}` };
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type = "verify" } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts don't require OTP verification" });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpType !== type) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    // For password reset, don't clear OTP yet (will be cleared after password reset)
    // For email verification, clear OTP and log user in
    if (type === "reset") {
      // Just verify the OTP is valid, but keep it for password reset
      return res.status(200).json({
        message: "OTP verified successfully. You can now reset your password.",
      });
    }

    // For email verification (registration)
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
      otpType: null,
    });

    const token = generateToken(user._id);

    res
      .cookie("finmen_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts don't require OTP verification" });
    }

    // Resend OTP for email verification (registration)
    const result = await sendOTP(user.email, "verify");

    if (result.success) {
      res.status(200).json({
        message: "OTP resent successfully",
        email: user.email,
      });
    } else {
      res.status(500).json({
        message: result.message || "Failed to resend OTP",
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        message: "If an account exists with this email, an OTP has been sent. Please check your inbox.",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot reset password via OTP. Please contact your administrator." });
    }

    // Send OTP synchronously - Resend API is fast and reliable
    const result = await sendOTP(user.email, "reset", true);

    if (result && result.success) {
      res.status(200).json({
        message: "If an account exists with this email, an OTP has been sent. Please check your inbox.",
        email: user.email,
      });
    } else {
      const errorMessage = result?.message || "Failed to generate reset OTP";
      console.error("Failed to generate OTP:", errorMessage);
      // Still return success to prevent email enumeration
      res.status(200).json({
        message: "If an account exists with this email, an OTP has been sent. Please check your inbox.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process password reset request. Please try again." });
  }
};

export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot reset password via OTP. Please contact your administrator." });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpType !== "reset") {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
      otpType: null,
    });

    console.log(`✅ Password reset successful for ${user.email}`);
    res.status(200).json({ message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};


export const registerByAdmin = async (req, res) => {
  try {
    const { email, password, name, role, position, subjects } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }

    // Allow school_admin, school_student, school_teacher, school_parent
    const allowedRoles = ["admin", "parent", "seller", "csr", "school_admin", "school_student", "school_teacher", "school_parent"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(", ")}` });
    }


    // For school_student, generate permanent random code
    let studentCode;
    if (role === "school_student") {
      studentCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    // For school_parent, require studentCode and link parent to student
    let linkedStudent = null;
    if (role === "school_parent") {
      const { studentCode: parentStudentCode } = req.body;
      if (!parentStudentCode) {
        return res.status(400).json({ message: "Student code is required to register parent account" });
      }
      linkedStudent = await User.findOne({ role: "school_student", studentCode: parentStudentCode });
      if (!linkedStudent) {
        return res.status(400).json({ message: "Invalid student code. No student found." });
      }
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar for the new user
    const avatarData = generateAvatar({
      name,
      email: normalizedEmail,
      role
    });

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true, // All roles created by admin are pre-verified
      approvalStatus: ["parent", "seller", "csr"].includes(role) ? "pending" : "approved",
      studentCode: role === "school_student" ? studentCode : undefined,
      linkedStudentId: role === "school_parent" && linkedStudent ? linkedStudent._id : undefined,
      avatar: avatarData.url, // Set legacy avatar field
      avatarData: {
        type: 'generated',
        ...avatarData
      }
    });

    res.status(201).json({
      message: ["parent", "seller", "csr"].includes(role)
        ? `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully. Account is pending approval.`
        : `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvalStatus: newUser.approvalStatus,
        position: newUser.position,
        subjects: newUser.subjects,
      },
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(200).json({
        needsVerification: false,
        isVerified: true,
        role: user.role,
        message: "Admin accounts don't require email verification"
      });
    }

    res.status(200).json({
      needsVerification: !user.isVerified,
      isVerified: user.isVerified,
      role: user.role,
      message: user.isVerified ? "Account already verified" : "Account needs verification"
    });
  } catch (error) {
    console.error("Check verification status error:", error);
    res.status(500).json({ message: "Failed to check verification status" });
  }
};

// Add this function to the existing login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Login attempt for:', normalizedEmail);
    
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    if (!user.password) {
      console.log('No password set for user:', user.email);
      return res.status(400).json({
        message: "No password set for this account. Please reset your password.",
      });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Email verification is no longer required for student login.
    // We allow login regardless of verification status.

    // Approval status checks for parent and seller only (CSR users don't need approval)
    if (["parent", "seller", "school_admin"].includes(user.role)) {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({
          message: `Your ${user.role === "school_admin" ? "school" : user.role} account is currently under review. You will be notified once approved.`,
          approvalStatus: "pending",
        });
      }

      if (user.approvalStatus === "rejected") {
        return res.status(403).json({
          message: `Your ${user.role === "school_admin" ? "school" : user.role} account has been rejected. Please contact administration.`,
          approvalStatus: "rejected",
        });
      }
    }

    const token = generateToken(user._id);

    // Check and sync student subscription if linked to a school
    if ((user.role === 'student' || user.role === 'school_student') && user.orgId && user.tenantId) {
      try {
        const { syncSchoolStudentSubscriptions } = await import('../services/schoolStudentSubscriptionSync.js');
        const Subscription = (await import('../models/Subscription.js')).default;
        
        // Find the school's subscription
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
          
          const isActive = actualStatus === 'active' && 
                          (!schoolSubscription.endDate || new Date(schoolSubscription.endDate) > now);
          
          console.log(`🔄 Syncing student ${user.email} subscription: school status=${actualStatus}, isActive=${isActive}`);
          
          // Sync student subscription with school subscription status
          const io = req.app.get('io');
          const syncResult = await syncSchoolStudentSubscriptions(
            user.orgId.toString(),
            user.tenantId,
            isActive,
            schoolSubscription.endDate,
            io
          );
          
          console.log(`✅ Student sync result: ${syncResult.studentsUpdated} students updated`);
        }
      } catch (syncError) {
        console.error('Error syncing student subscription on login:', syncError);
        // Don't fail login if sync fails
      }
    }

    // Check and sync teacher access if linked to a school
    if ((user.role === 'school_teacher' || user.role === 'teacher') && user.orgId && user.tenantId) {
      try {
        const { syncSchoolTeacherAccess } = await import('../services/schoolStudentSubscriptionSync.js');
        const Subscription = (await import('../models/Subscription.js')).default;
        
        // Find the school's subscription
        const schoolSubscription = await Subscription.findOne({
          orgId: user.orgId,
          tenantId: user.tenantId
        });

        if (schoolSubscription) {
          const now = new Date();
          const isActive = schoolSubscription.status === 'active' && 
                          (!schoolSubscription.endDate || new Date(schoolSubscription.endDate) > now);
          
          // Sync teacher access with school subscription status
          const io = req.app.get('io');
          await syncSchoolTeacherAccess(
            user.orgId.toString(),
            user.tenantId,
            isActive,
            schoolSubscription.endDate,
            io
          );
        }
      } catch (syncError) {
        console.error('Error syncing teacher access on login:', syncError);
        // Don't fail login if sync fails
      }
    }

    // Daily login reward for students
    if (user.role === "student" || user.role === "school_student") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      let lastActiveDay = null;
      if (lastActive) {
        lastActiveDay = new Date(lastActive);
        lastActiveDay.setHours(0, 0, 0, 0);
      }
      
      // Check if this is a new day login
      let loginReward = null;
      if (!lastActiveDay || today.getTime() > lastActiveDay.getTime()) {
        // Award 5 HealCoins for daily login
        const dailyReward = 5; // 5 HealCoins for daily login
        
        // Update user's last active timestamp
        user.lastActive = new Date();
        await user.save();
        
        // Add coins to wallet
        let wallet = await Wallet.findOne({ userId: user._id });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId: user._id,
            balance: dailyReward
          });
        } else {
          wallet.balance += dailyReward;
          await wallet.save();
        }
        
        // Create transaction record
        await Transaction.create({
          userId: user._id,
          type: "credit",
          amount: dailyReward,
          description: "Daily login reward"
        });
        
        loginReward = {
          received: true,
          amount: dailyReward
        };
        
        // Return login reward info with response
        res
          .cookie("finmen_token", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .json({
            message: "Login successful",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              approvalStatus: user.approvalStatus,
            },
            token, // Include token in response for frontend storage
            loginReward
          });
      } else {
        // Regular login without reward
        res
          .cookie("finmen_token", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .json({
            message: "Login successful",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              approvalStatus: user.approvalStatus,
            },
            token,
            loginReward: null
          });
      }
    } else {
      // Non-student login (no rewards)
      res
        .cookie("finmen_token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            approvalStatus: user.approvalStatus,
          },
          token // Include token in response for frontend storage
        });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    // Verify Google access token and get user info
    const googleUser = await verifyGoogleAccessToken(accessToken);

    if (!googleUser.email) {
      return res.status(400).json({ message: "Unable to retrieve email from Google account" });
    }

    const normalizedEmail = googleUser.email.toLowerCase();

    // Find existing user by email
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // User exists - update Google info if needed
      if (!user.fromGoogle) {
        user.fromGoogle = true;
        if (googleUser.avatar && !user.avatar) {
          user.avatar = googleUser.avatar;
        }
        await user.save();
      }

      // Check approval status for certain roles
      if (["parent", "seller", "school_admin"].includes(user.role)) {
        if (user.approvalStatus === "pending") {
          return res.status(403).json({
            message: `Your ${user.role === "school_admin" ? "school" : user.role} account is currently under review. You will be notified once approved.`,
            approvalStatus: "pending",
          });
        }

        if (user.approvalStatus === "rejected") {
          return res.status(403).json({
            message: `Your ${user.role === "school_admin" ? "school" : user.role} account has been rejected. Please contact administration.`,
            approvalStatus: "rejected",
          });
        }
      }
    } else {
      // New user - create account
      // Generate avatar for new user
      const avatarData = await generateAvatar(googleUser.name || googleUser.email);

      user = await User.create({
        name: googleUser.name || googleUser.email.split("@")[0],
        fullName: googleUser.name || googleUser.email.split("@")[0],
        email: normalizedEmail,
        avatar: googleUser.avatar || avatarData.url,
        avatarData: avatarData,
        role: "student", // Default role for Google sign-in
        isVerified: true, // Google accounts are pre-verified
        fromGoogle: true,
      });

      // Create freemium subscription for new student
      try {
        await UserSubscription.create({
          userId: user._id,
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
        console.log(`✅ Created freemium subscription for Google user: ${user._id}`);
      } catch (subError) {
        console.error('Error creating freemium subscription for Google user:', subError);
        // Don't fail login if subscription creation fails
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Daily login reward for students
    if (user.role === "student" || user.role === "school_student") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      let lastActiveDay = null;
      if (lastActive) {
        lastActiveDay = new Date(lastActive);
        lastActiveDay.setHours(0, 0, 0, 0);
      }
      
      // Check if this is a new day login
      let loginReward = null;
      if (!lastActiveDay || today.getTime() > lastActiveDay.getTime()) {
        // Award 5 HealCoins for daily login
        const dailyReward = 5;
        
        // Update user's last active timestamp
        user.lastActive = new Date();
        await user.save();
        
        // Add coins to wallet
        let wallet = await Wallet.findOne({ userId: user._id });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId: user._id,
            balance: dailyReward
          });
        } else {
          wallet.balance += dailyReward;
          await wallet.save();
        }
        
        // Create transaction record
        await Transaction.create({
          userId: user._id,
          type: "credit",
          amount: dailyReward,
          description: "Daily login reward"
        });
        
        loginReward = {
          received: true,
          amount: dailyReward
        };
      }

      // Return response with login reward
      return res
        .cookie("finmen_token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Google login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            approvalStatus: user.approvalStatus,
          },
          token,
          loginReward: loginReward || null
        });
    } else {
      // Non-student login (no rewards)
      return res
        .cookie("finmen_token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Google login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            approvalStatus: user.approvalStatus,
          },
          token
        });
    }
  } catch (err) {
    console.error("Google login error:", err);
    if (err.message === "Invalid Google access token") {
      return res.status(401).json({ message: "Invalid Google access token" });
    }
    res.status(500).json({ message: "Google login failed" });
  }
};