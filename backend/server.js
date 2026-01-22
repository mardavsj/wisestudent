import { scheduleSubscriptionReminders } from './cronJobs/subscriptionReminders.js';
import { scheduleSubscriptionExpirationNotifications } from './cronJobs/subscriptionExpirationNotifications.js';
import { scheduleExpiredSubscriptionSync } from './cronJobs/syncExpiredSubscriptions.js';
import { scheduleCSRAlertChecker } from './cronJobs/csrAlertChecker.js';
import { scheduleSponsoredStudentStatsUpdater } from './cronJobs/updateSponsoredStudentStats.js';
import { scheduleExpiringSponsorships } from './cronJobs/checkExpiringSponsorships.js';
import { scheduleLowBalanceAlerts } from './cronJobs/checkLowBalance.js';
import { scheduleMonthlySummary } from './cronJobs/sendMonthlySummary.js';
import { schedulePendingNotifications } from './cronJobs/sendPendingNotifications.js';
import { scheduleTestimonialRequests } from './cronJobs/requestTestimonials.js';
import { scheduleAgreementExpiryChecks } from './cronJobs/checkAgreementExpiry.js';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get current file details (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins for CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(origin => origin.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000",
    ];

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Ensure API routes always return JSON (prevent HTML responses)
app.use('/api', (req, res, next) => {
  // Set JSON content type for all API routes
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Add security headers to fix Cross-Origin-Opener-Policy issues
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      // Also allow requests from installed PWAs which might not send origin header
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // For PWA installations, also check if origin matches localhost patterns
      // This handles cases where PWA is installed and origin might differ slightly
      try {
        const originUrl = new URL(origin);
        const isLocalhost = originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1';
        
        if (isLocalhost && (originUrl.port === '3000' || originUrl.port === '5173' || originUrl.port === '4173' || !originUrl.port)) {
          return callback(null, true);
        }
      } catch (e) {
        // If URL parsing fails, continue to check against allowed origins
      }
      
      // Log rejected origin for debugging (in production, you might want to remove this)
      console.warn("CORS: Origin not allowed:", origin);
      return callback(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import goodieRoutes from "./routes/goodieRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import activityRoutes from './routes/activityRoutes.js';
import userProgressRoutes from './routes/userProgressRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import csrRoutes from "./routes/csrRoutes.js";
import csrSponsorRoutes from "./routes/csrSponsorRoutes.js";
import csrFundRoutes from "./routes/csrFundRoutes.js";
import csrSponsorshipRoutes from "./routes/csrSponsorshipRoutes.js";
import csrSchoolRoutes from "./routes/csrSchoolRoutes.js";
import csrImpactRoutes from "./routes/csrImpactRoutes.js";
import csrImpactReportRoutes from "./routes/csrImpactReportRoutes.js";
import csrGalleryRoutes from "./routes/csrGalleryRoutes.js";
import csrInvoiceRoutes from "./routes/csrInvoiceRoutes.js";
import csrAuditRoutes from "./routes/csrAuditRoutes.js";
import csrTestimonialRoutes from "./routes/csrTestimonialRoutes.js";
import csrOverviewRoutes from "./routes/csrOverviewRoutes.js";
import budgetTransactionRoutes from "./routes/budgetTransactionRoutes.js";
import impactReportRoutes from "./routes/impactReportRoutes.js";
import cobrandingLegalRoutes from "./routes/cobrandingLegalRoutes.js";
import campaignWizardRoutes from "./routes/campaignWizardRoutes.js";
import csrPaymentRoutes from "./routes/csrPaymentRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import csrReportRoutes from "./routes/csrReportRoutes.js";
import budgetTrackingRoutes from "./routes/budgetTrackingRoutes.js";
import avatarRoutes from "./routes/avatarRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import assignmentAttemptRoutes from "./routes/assignmentAttemptRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Multi-tenant routes
import companyRoutes from "./routes/companyRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import globalStatsRoutes from "./routes/globalStatsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminSchoolApprovalRoutes from "./routes/adminSchoolApprovalRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import adminPaymentTrackerRoutes from "./routes/adminPaymentTrackerRoutes.js";
import adminTrackingRoutes from "./routes/adminTrackingRoutes.js";
import adminManagementRoutes from "./routes/adminManagementRoutes.js";
import adminReportsRoutes from "./routes/adminReportsRoutes.js";
import behaviorAnalyticsRoutes from "./routes/behaviorAnalyticsRoutes.js";
import smartInsightsRoutes from "./routes/smartInsightsRoutes.js";
import financialConsoleRoutes from "./routes/financialConsoleRoutes.js";
import adminSchoolsRoutes from "./routes/adminSchoolsRoutes.js";
import supportDeskRoutes from "./routes/supportDeskRoutes.js";
import userLifecycleRoutes from "./routes/userLifecycleRoutes.js";
import contentGovernanceRoutes from "./routes/contentGovernanceRoutes.js";
import auditTimelineRoutes from "./routes/auditTimelineRoutes.js";
import configurationControlRoutes from "./routes/configurationControlRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import operationalToolsRoutes from "./routes/operationalToolsRoutes.js";
import predictiveModelsRoutes from "./routes/predictiveModelsRoutes.js";
import apiControlPlaneRoutes from "./routes/apiControlPlaneRoutes.js";
import adminPlatformRoutes from "./routes/adminPlatformRoutes.js";
import adminJobOpeningRoutes from "./routes/adminJobOpeningRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";
import userSubscriptionRoutes from "./routes/userSubscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import presentationRoutes from "./routes/presentationRoutes.js";
import slideElementRoutes from "./routes/slideElementRoutes.js";
import presentationTemplateRoutes from "./routes/presentationTemplateRoutes.js";
import adminCsrRoutes from "./routes/adminCsrRoutes.js";
import adminCsrDepositRoutes from "./routes/adminCsrDepositRoutes.js";
import adminCsrTestimonialRoutes from "./routes/adminCsrTestimonialRoutes.js";
import adminCsrRefundRoutes from "./routes/adminCsrRefundRoutes.js";
import csrRefundRoutes from "./routes/csrRefundRoutes.js";
import schoolTestimonialRoutes from "./routes/schoolTestimonialRoutes.js";
import schoolSponsorshipRoutes from "./routes/schoolSponsorshipRoutes.js";

// Import models and other logic
import User from "./models/User.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { scheduleWeeklyReports } from "./cronJobs/reportScheduler.js";
import { startNotificationTTL } from "./cronJobs/notificationTTL.js";

// Socket Handlers
import { setupWalletSocket } from "./socketHandlers/walletSocket.js";
import { setupFeedbackSocket } from "./socketHandlers/feedbackSocket.js";
import { setupGameSocket } from "./socketHandlers/gameSocket.js";
import { setupJournalSocket } from "./socketHandlers/journalSocket.js";
import { setupChatSocket } from "./socketHandlers/chatSocket.js";
import { setupPresentationSocket } from "./socketHandlers/presentationSocket.js";
import { setupCSROverviewSocket } from "./socketHandlers/csrOverviewSocket.js";

// Socket.IO Authentication and Events
io.on("connection", async (socket) => {

  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.emit("error", { message: "Authentication required" });
      return socket.disconnect();
    }

    if (typeof token !== "string" || !token.includes(".") || token.split(".").length !== 3) {
      socket.emit("error", { message: "Invalid token format" });
      return socket.disconnect();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      socket.emit("error", { message: "Invalid or expired token" });
      return socket.disconnect();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      socket.emit("error", { message: "User not found" });
      return socket.disconnect();
    }


    socket.join(user._id.toString());

    setupWalletSocket(io, socket, user);
    setupFeedbackSocket(io, socket, user);
    setupGameSocket(io, socket, user);
    setupJournalSocket(io, socket, user);
    setupChatSocket(io, socket, user);
    setupPresentationSocket(io, socket, user);
    
    // Setup achievement socket handler
    const { setupAchievementSocket } = await import('./socketHandlers/achievementSocket.js');
    setupAchievementSocket(io, socket, user);
    
    // Setup mood socket handler
    const { setupMoodSocket } = await import('./socketHandlers/moodSocket.js');
    setupMoodSocket(io, socket, user);
    
    // Setup CSR-specific sockets
    if (user.role === "csr") {
      setupCSROverviewSocket(io, socket, user);
    }
    
    // Setup School Admin Dashboard socket handler
    if (user.role === "school_admin") {
      const { setupSchoolAdminDashboardSocket } = await import('./socketHandlers/schoolAdminDashboardSocket.js');
      setupSchoolAdminDashboardSocket(io, socket, user);
    }

  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
    socket.emit("error", { message: "Authentication error" });
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    // Socket disconnected
  });
});

// Serve uploads statically
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

// Legacy Routes (maintain backward compatibility)
  app.use("/api/auth", authRoutes);
  app.use("/api/mood", moodRoutes);
  app.use("/api/game", gameRoutes);
  app.use("/api/rewards", rewardsRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/activity", activityRoutes);
  
  // Multi-tenant Routes
app.use("/api/company", companyRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/school/testimonials", schoolTestimonialRoutes);
app.use("/api/school/sponsorship", schoolSponsorshipRoutes);
app.use("/api/global", globalStatsRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", userSubscriptionRoutes);
app.use("/api", webhookRoutes); // Razorpay webhook at /api/webhook
  app.use("/api/presentations", presentationRoutes);
  app.use("/api/presentations", slideElementRoutes);
  app.use("/api/presentation-templates", presentationTemplateRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/csr/funds", csrFundRoutes);
  app.use("/api/csr/funds/refund", csrRefundRoutes);
  app.use("/api/csr/sponsorships", csrSponsorshipRoutes);
  app.use("/api/csr/schools", csrSchoolRoutes);
  app.use("/api/csr/impact", csrImpactRoutes);
  app.use("/api/csr/reports", csrImpactReportRoutes);
  app.use("/api/csr/gallery", csrGalleryRoutes);
  app.use("/api/csr/testimonials", csrTestimonialRoutes);
  app.use("/api/csr/invoices", csrInvoiceRoutes);
  app.use("/api/csr/audit-log", csrAuditRoutes);
  app.use("/api/csr", csrSponsorRoutes);
  app.use("/api/csr", csrRoutes);
  app.use("/api/csr", impactReportRoutes);
  app.use("/api/csr", cobrandingLegalRoutes);
  app.use("/api/csr-overview", csrOverviewRoutes);
  app.use('/api/budget', budgetTransactionRoutes);
  app.use('/api/campaign-wizard', campaignWizardRoutes);
app.use('/api/csr-financial', csrPaymentRoutes);
app.use('/api/csr-financial', invoiceRoutes);
app.use('/api/csr-reports', csrReportRoutes);
  app.use('/api/budget-tracking', budgetTrackingRoutes);
  app.use('/api/avatar', avatarRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignment-attempts', assignmentAttemptRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/school-approvals', adminSchoolApprovalRoutes);
app.use('/api/admin', adminManagementRoutes);
app.use('/api/admin/payment-tracker', adminPaymentTrackerRoutes);
app.use('/api/admin/job-openings', adminJobOpeningRoutes);
app.use('/api/admin/tracking', adminTrackingRoutes);
app.use('/api/admin/reports', adminReportsRoutes);
app.use('/api/admin/behavior-analytics', behaviorAnalyticsRoutes);
app.use('/api/admin/smart-insights', smartInsightsRoutes);
app.use('/api/admin/financial-console', financialConsoleRoutes);
  app.use('/api/admin/schools', adminSchoolsRoutes);
  app.use('/api/admin/support-desk', supportDeskRoutes);
  app.use('/api/admin/csr', adminCsrRoutes);
  app.use('/api/admin/csr/testimonials', adminCsrTestimonialRoutes);
  app.use('/api/admin/csr/deposits', adminCsrDepositRoutes);
  app.use('/api/admin/csr/refunds', adminCsrRefundRoutes);
app.use('/api/admin/lifecycle', userLifecycleRoutes);
app.use('/api/admin/content-governance', contentGovernanceRoutes);
app.use('/api/admin/audit-timeline', auditTimelineRoutes);
app.use('/api/admin/configuration', configurationControlRoutes);
app.use('/api/admin/communication', communicationRoutes);
app.use('/api/admin/operational', operationalToolsRoutes);
app.use('/api/admin/predictive', predictiveModelsRoutes);
app.use('/api/admin/api-control', apiControlPlaneRoutes);
app.use('/api/admin/platform', adminPlatformRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health Check
app.get("/", (_, res) => {
  res.send("🌱 FINMEN API is running...");
});

// Serve frontend in production
// IMPORTANT: This catch-all route must come AFTER all API routes
// to prevent API routes from being served as HTML
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../frontend/dist");
  
  // Only serve static files for non-API routes
  app.use((req, res, next) => {
    // Skip API routes - they should be handled by API routes above
    if (req.path.startsWith('/api')) {
      return next();
    }
    // For non-API routes, serve static files
    express.static(clientPath)(req, res, next);
  });
  
  // Catch-all route for frontend (only for non-API routes)
  app.get("*", (req, res, next) => {
    // Don't serve HTML for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.path
      });
    }
    // Serve frontend for all other routes
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Global error handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  scheduleWeeklyReports();
  scheduleSubscriptionReminders();
  
  // Schedule comprehensive subscription expiration notifications
  scheduleSubscriptionExpirationNotifications(io);
  
  // Schedule CSR alert checker
  scheduleCSRAlertChecker(io);
  
  // Schedule periodic sync of expired subscriptions (syncs students/teachers when school plan expires)
  scheduleExpiredSubscriptionSync(io);
  
  // CSR cron jobs
  scheduleSponsoredStudentStatsUpdater();
  scheduleExpiringSponsorships();
  scheduleLowBalanceAlerts();
  scheduleMonthlySummary();
  schedulePendingNotifications();
  scheduleTestimonialRequests();
  scheduleAgreementExpiryChecks();

  // Start real-time notification TTL cleanup (15 days)
  const ttlSeconds = parseInt(process.env.NOTIFICATION_TTL_SECONDS || "1296000", 10);
  startNotificationTTL(io, { ttlSeconds, intervalSeconds: 3600 });
});

export default app;
