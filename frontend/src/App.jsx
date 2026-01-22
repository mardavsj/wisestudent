import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherProtectedRoute from "./components/TeacherProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Global UI
import Navbar from "./components/Navbar";
// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import StakeholderRegister from "./pages/Auth/StakeholderRegister";
import PendingApprovalPage from "./pages/Auth/PendingApproval";
import ParentRegister from "./pages/Auth/ParentRegister";
import SellerRegister from "./pages/Auth/SellerRegister";
import TeacherRegister from "./pages/Auth/TeacherRegister";
import AccountTypeSelection from "./pages/Auth/AccountTypeSelection";

// Student Pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentActivity from "./pages/Student/StudentActivity";
import AssignmentAttempt from "./pages/Student/AssignmentAttempt";
import CategoryView from "./pages/Student/CategoryView";
import QuickQuiz from "./pages/Student/QuickQuiz";
import MoodTracker from "./pages/Student/MoodTracker";
import MindfulnessBreak from "./pages/Student/MindfulnessBreak";

import RewardsPage from "./pages/Student/RewardsPage";
import RedeemPage from "./pages/Student/RedeemPage";
import WalletPage from "./pages/Student/WalletPage";
import Leaderboard from "./pages/Student/Leaderboard";
import StudentGame from "./pages/Student/StudentGame";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import TeacherProfile from "./pages/School/TeacherProfile";
import Setting from "./components/Settings";
import BreathingExercise from "./pages/Student/BreathingExercise";
import FinancialLiteracy from "./pages/Student/FinancialLiteracy";
import PaymentPage from "./pages/Student/PaymentPage";
import SubscriptionCheckout from "./pages/Student/SubscriptionCheckout";
import PresentationPage from "./pages/Student/PresentationPage";
import BudgetPlanner from "./pages/Student/BudgetPlanner";
import InvestmentSimulator from "./pages/Student/InvestmentSimulator";
import SavingsGoals from "./pages/Student/SavingsGoals";
import FinancialQuiz from "./pages/Student/FinancialQuiz";
import ExpenseTracker from "./pages/Student/ExpenseTracker";
import CreditManagement from "./pages/Student/CreditManagement";
import DebtTracker from "./pages/Student/DebtTracker";
import BrainHealthQuiz from "./pages/Student/BrainHealthQuiz";
import StressManagement from "./pages/Student/StressManagement";
import GameCategoryPage from "./pages/Games/GameCategoryPage";
import DCOSGames from "./pages/Games/DCOSGames";
import BrainTeaserGames from "./pages/Games/BrainTeaserGames";
import BrainTeaserPlay from "./pages/Games/BrainTeaserPlay";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AllStudents from "./pages/Admin/AllStudents";
import AdminRedemptions from "./pages/Admin/AdminRedemptions";
import FeedbackHistoryModal from "./pages/Admin/FeedbackHistoryModal";
import AllRedemptions from "./pages/Admin/AllRedemptions";
import AdminStatsPanel from "./pages/Admin/AdminStatsPanel";
import AdminUsersPanel from "./pages/Admin/AdminUsersPanel";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminSettingsCommunications from "./pages/Admin/AdminSettingsCommunications";
import AdminSchoolApprovals from "./pages/Admin/AdminSchoolApprovals";
import IncidentManagement from "./pages/Admin/IncidentManagement";
import AdminTrackingDashboard from "./pages/Admin/AdminTrackingDashboard";
import AdminPaymentTracker from "./pages/Admin/AdminPaymentTracker";
import AdminMarketplace from "./pages/Admin/AdminMarketplace";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminReports from "./pages/Admin/AdminReports";
import BehaviorAnalytics from "./pages/Admin/BehaviorAnalytics";
import SmartInsights from "./pages/Admin/SmartInsights";
import FinancialConsole from "./pages/Admin/FinancialConsole";
import SupportDesk from "./pages/Admin/SupportDesk";
import LifecycleManagement from "./pages/Admin/LifecycleManagement";
import ContentGovernance from "./pages/Admin/ContentGovernance";
import AuditTimeline from "./pages/Admin/AuditTimeline";
import ConfigurationControlCenter from "./pages/Admin/ConfigurationControlCenter";
import CommunicationSuite from "./pages/Admin/CommunicationSuite";
import OperationalTools from "./pages/Admin/OperationalTools";
import PredictiveModels from "./pages/Admin/PredictiveModels";
import APIControlPlane from "./pages/Admin/APIControlPlane";
import AdminPlatform from "./pages/Admin/AdminPlatform";
import GoodieOrders from "./pages/Admin/GoodieOrders";
import AdminCSRTestimonials from "./pages/Admin/AdminCSRTestimonials";
import AdminCSRRefunds from "./pages/Admin/AdminCSRRefunds";

// Parent Pages
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ParentOverview from "./pages/Parent/ParentOverview";
import ParentChildren from "./pages/Parent/ParentChildren";
import ParentChildAnalytics from "./pages/Parent/ParentChildAnalytics";
import ChildProgress from "./pages/Parent/ChildProgress";
import ChildMoodWellbeing from "./pages/Parent/ChildMoodWellbeing";
import ChildWalletRewards from "./pages/Parent/ChildWalletRewards";
import ParentSettings from "./pages/Parent/ParentSettings";
import ParentUpgrade from "./pages/Parent/ParentUpgrade";
import ParentProfile from "./pages/Parent/ParentProfile";
import ParentGameCategoryPage from "./pages/Parent/Games/ParentGameCategoryPage";
import UniversalParentGameRenderer from "./pages/Parent/Games/UniversalParentGameRenderer";
import ParentGamesHub from "./pages/Parent/Games/ParentGamesHub";
import TeacherGamesHub from "./pages/Teacher/Games/TeacherGamesHub";
import TeacherGameCategoryPage from "./pages/Teacher/Games/TeacherGameCategoryPage";
import UniversalTeacherGameRenderer from "./pages/Teacher/Games/UniversalTeacherGameRenderer";

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";

// CSR Pages
import CSRDashboard from "./pages/CSR/CSRDashboard";
import CSRApprovals from "./pages/CSR/CSRApprovals";
import CSRProfile from "./pages/CSR/CSRProfile";
import CSRSettings from "./pages/CSR/CSRSettings";
import CSRSchools from "./pages/CSR/CSRSchools";
import CSRFunds from "./pages/CSR/CSRFunds";
import CSRFundsAdd from "./pages/CSR/CSRFundsAdd";
import CSRFundsRefund from "./pages/CSR/CSRFundsRefund";
import CSRFinancial from "./pages/CSR/CSRFinancial";
import CSRReports from "./pages/CSR/CSRReports";
import CSRReportGenerate from "./pages/CSR/CSRReportGenerate";
import CSRGallery from "./pages/CSR/CSRGallery";
import CSRTestimonials from "./pages/CSR/CSRTestimonials";
import CSRSponsorships from "./pages/CSR/CSRSponsorships";
import CSRSponsorshipNew from "./pages/CSR/CSRSponsorshipNew";
import CSRSponsorshipDetails from "./pages/CSR/CSRSponsorshipDetails";
import CSRNotifications from "./pages/CSR/CSRNotifications";
import CSRSponsorshipRenew from "./pages/CSR/CSRSponsorshipRenew";
import CSRLayout from "./layouts/CSRLayout";

// Multi-Tenant Pages
import CompanySignup from "./pages/MultiTenant/CompanySignup";
import CreateOrganization from "./pages/MultiTenant/CreateOrganization";
import SchoolAdminDashboard from "./pages/School/SchoolAdminDashboard";
import AnnouncementManagement from "./pages/School/AnnouncementManagement";
import Announcements from "./pages/School/Announcements";
import SchoolAdminAnalytics from "./pages/School/SchoolAdminAnalytics";
import SchoolAdminStudents from "./pages/School/SchoolAdminStudents";
import SchoolAdminTopPerformers from "./pages/School/SchoolAdminTopPerformers";
import SchoolAdminTeachers from "./pages/School/SchoolAdminTeachers";
import SchoolAdminClasses from "./pages/School/SchoolAdminClasses";
import SchoolAdminStaff from "./pages/School/SchoolAdminStaff";
import SchoolAdminApprovals from "./pages/School/SchoolAdminApprovals";
import SchoolAdminTemplates from "./pages/School/SchoolAdminTemplates";
import SchoolAdminNEPTracking from "./pages/School/SchoolAdminNEPTracking";
import SchoolAdminCompliance from "./pages/School/SchoolAdminCompliance";
import SchoolAdminBilling from "./pages/School/SchoolAdminBilling";
import SchoolAdminPaymentTracker from "./pages/School/SchoolAdminPaymentTracker";
import AdminSchools from "./pages/Admin/AdminSchools";
import AdminSchoolDetail from "./pages/Admin/AdminSchoolDetail";
import SchoolAdminEmergency from "./pages/School/SchoolAdminEmergency";
import SchoolAdminEvents from "./pages/School/SchoolAdminEvents";
import SchoolAdminSettings from "./pages/School/SchoolAdminSettings";
import SchoolAdminProfile from "./pages/School/SchoolAdminProfile";
import SchoolAdminSettingsPersonal from "./pages/School/SchoolAdminSettingsPersonal";
import SchoolTeacherDashboard from "./pages/School/SchoolTeacherDashboard";
import SchoolStudentDashboard from "./pages/School/SchoolStudentDashboard";
import SchoolParentDashboard from "./pages/School/SchoolParentDashboard";
import TeacherOverview from "./pages/School/TeacherOverview";
import SchoolTestimonialSubmit from "./pages/School/SchoolTestimonialSubmit";
import SchoolSponsorship from "./pages/School/SchoolSponsorship";
import SchoolSponsorshipGallery from "./pages/School/SchoolSponsorshipGallery";
import SchoolSponsorshipThankYou from "./pages/School/SchoolSponsorshipThankYou";
import TeacherStudents from "./pages/School/TeacherStudents";
import TeacherAnalytics from "./pages/School/TeacherAnalytics";
import TeacherTasks from "./pages/School/TeacherTasks";
import TeacherChatContacts from "./pages/School/TeacherChatContacts";
import TeacherSettings from "./pages/School/TeacherSettings";
import TeacherStudentProgress from "./pages/School/TeacherStudentProgress";
import TeacherStudentWalletRewards from "./pages/School/TeacherStudentWalletRewards";
import TeacherParentChat from "./pages/School/TeacherParentChat";
import TeacherStudentChat from "./pages/School/TeacherStudentChat";
import SchoolStudentChat from "./pages/School/SchoolStudentChat";
import ParentChat from "./pages/Parent/ParentChat";
import AssignmentTracking from "./pages/School/AssignmentTracking";
import LandingPage from "./pages/LandingPage";
import PlatformDetails from "./pages/PlatformDetails";
import IndividualAccountSelection from "./pages/IndividualAccountSelection";
// Multi-tenant registration pages
import InstitutionTypeSelection from "./pages/MultiTenant/InstitutionTypeSelection";
import SchoolRegistration from "./pages/MultiTenant/SchoolRegistration";
// 404 Page
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
// Toast notification provider
import { Toaster } from "react-hot-toast";

// Additional Pages
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CareerApply from "./pages/CareerApply";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import UniversalGameRenderer from "./components/UniversalGameRenderer";

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Update document title based on current route
  useEffect(() => {
    const getPageTitle = (pathname) => {
      // Auth pages
      if (pathname === "/login") return "Login";
      if (pathname === "/register") return "Register";
      if (pathname === "/forgot-password") return "Forgot Password";
      if (pathname === "/reset-password") return "Reset Password";
      if (pathname === "/verify-otp") return "Verify OTP";
      if (pathname === "/pending-approval") return "Pending Approval";
      if (pathname === "/choose-account-type") return "Choose Account Type";
      if (pathname === "/register-parent") return "Register Parent";
      if (pathname === "/register-seller") return "Register Seller";
      if (pathname === "/register-teacher") return "Register Teacher";
      if (pathname === "/register-stakeholder") return "Register Stakeholder";
      
      // Landing and public pages
      if (pathname === "/") return "Wise Student";
      if (pathname === "/about") return "About Us";
      if (pathname === "/blog") return "Blog";
      if (pathname === "/careers") return "Careers";
      if (pathname.startsWith("/careers/apply")) return "Apply for Job";
      if (pathname === "/contact") return "Contact Us";
      if (pathname === "/terms") return "Terms of Service";
      if (pathname === "/privacy") return "Privacy Policy";
      if (pathname === "/cookies") return "Cookie Policy";
      
      // Account selection
      if (pathname === "/individual-account") return "Individual Account";
      if (pathname === "/institution-type") return "Institution Type";
      if (pathname === "/school-registration") return "School Registration";
      if (pathname === "/company-signup") return "Company Signup";
      if (pathname === "/create-organization") return "Create Organization";
      
      // Student routes
      if (pathname === "/student/dashboard") return "Student Dashboard";
      if (pathname === "/student/activity") return "Student Activity";
      if (pathname.startsWith("/student/assignment/")) return "Assignment";
      if (pathname === "/student/announcements") return "Announcements";
      if (pathname === "/student/dashboard/quick-quiz") return "Quick Quiz";
      if (pathname.startsWith("/student/dashboard/")) return "Category";
      if (pathname === "/student/mindfull-break") return "Mindfulness Break";
      if (pathname === "/student/mood-tracker") return "Mood Tracker";
      if (pathname === "/student/rewards") return "Rewards";
      if (pathname === "/student/redeem") return "Redeem";
      if (pathname === "/student/wallet") return "Wallet";
      if (pathname === "/student/leaderboard") return "Leaderboard";
      if (pathname === "/student/game") return "Games";
      if (pathname === "/student/notifications") return "Notifications";
      if (pathname === "/student/profile") return "Profile";
      if (pathname === "/student/settings") return "Settings";
      if (pathname === "/student/payment") return "Payment";
      if (pathname.startsWith("/student/presentation")) return "Presentation";
      if (pathname === "/student/breathing") return "Breathing Exercise";
      if (pathname === "/learn/brain-health-quiz") return "Brain Health Quiz";
      if (pathname === "/tools/stress-management") return "Stress Management";
      if (pathname === "/tools/cognitive-training") return "Cognitive Training";
      if (pathname === "/student/ai-for-all/ai-basics") return "AI Basics & Fundamentals";
      if (pathname === "/student/ai-for-all/machine-learning") return "Machine Learning 101";
      if (pathname === "/student/ai-for-all/ai-applications") return "AI Applications";
      if (pathname === "/student/ai-for-all/data-ethics") return "Data Ethics & Privacy";
      if (pathname === "/student/ai-for-all/automation") return "Automation & Robotics";
      if (pathname === "/student/health-female/menstrual-health") return "Menstrual Health";
      if (pathname === "/student/health-female/nutrition") return "Nutrition & Diet";
      if (pathname === "/student/health-female/fitness") return "Fitness & Exercise";
      if (pathname === "/student/health-female/body-positivity") return "Body Positivity";
      if (pathname === "/student/health-female/reproductive-health") return "Reproductive Health";
      
      // Student financial literacy routes
      if (pathname === "/learn/financial-literacy") return "Financial Literacy";
      if (pathname === "/student/finance/budget-planner" || pathname === "/tools/budget-planner") return "Budget Planner";
      if (pathname === "/student/finance/investment-simulator" || pathname === "/games/investment-simulator") return "Investment Simulator";
      if (pathname === "/student/finance/savings-goals" || pathname === "/tools/savings-goals") return "Savings Goals";
      if (pathname === "/student/finance/financial-quiz" || pathname === "/learn/financial-quiz") return "Financial Quiz";
      if (pathname === "/student/finance/expense-tracker" || pathname === "/tools/expense-tracker") return "Expense Tracker";
      if (pathname === "/student/finance/credit-management" || pathname === "/tools/credit-management") return "Credit Management";
      if (pathname === "/student/finance/debt-tracker" || pathname === "/tools/debt-tracker") return "Debt Tracker";
      
      // Student game routes
      if (pathname.startsWith("/student/") && pathname.includes("/games/")) return "Games";
      if (pathname.startsWith("/games/")) return "Games";
      
      // School Admin routes
      if (pathname === "/school/admin/dashboard") return "School Admin Dashboard";
      if (pathname === "/school/admin/analytics") return "School Analytics";
      if (pathname === "/school/admin/students") return "Students";
      if (pathname === "/school/admin/teachers") return "Teachers";
      if (pathname === "/school/admin/classes") return "Classes";
      if (pathname === "/school/admin/staff") return "Staff";
      if (pathname === "/school/admin/announcements") return "Announcements";
      if (pathname === "/school/admin/approvals") return "Approvals";
      if (pathname === "/school/admin/templates") return "Templates";
      if (pathname === "/school/admin/nep-tracking") return "NEP Tracking";
      if (pathname === "/school/admin/compliance") return "Compliance";
      if (pathname === "/school/admin/billing") return "Billing";
      if (pathname === "/school/admin/emergency") return "Emergency";
      if (pathname === "/school/admin/events") return "Events";
      if (pathname === "/school/admin/settings") return "School Settings";
      if (pathname === "/school/admin/payment-tracker") return "Payment Tracker";
      if (pathname === "/school_admin/profile") return "School Admin Profile";
      if (pathname === "/school_admin/settings") return "School Admin Settings";
      
      // School Teacher routes
      if (pathname === "/school-teacher/overview") return "Teacher Overview";
      if (pathname === "/school-teacher/dashboard") return "Teacher Dashboard";
      if (pathname === "/school-teacher/students") return "My Students";
      if (pathname === "/school-teacher/analytics") return "Teacher Analytics";
      if (pathname === "/school-teacher/chat-contacts") return "Chat Contacts";
      if (pathname === "/school-teacher/announcements") return "Announcements";
      if (pathname === "/school-teacher/tasks") return "Tasks";
      if (pathname === "/school-teacher/tracking") return "Assignment Tracking";
      if (pathname === "/school-teacher/settings") return "Teacher Settings";
      if (pathname === "/school_teacher/settings") return "Teacher Settings";
      if (pathname.startsWith("/school-teacher/student/") && pathname.includes("/wallet")) return "Student Wallet";
      if (pathname.startsWith("/school-teacher/student/")) return "Student Progress";
      if (pathname.startsWith("/school-teacher/student-chat/")) return "Student Chat";
      if (pathname.startsWith("/school-teacher/student/") && pathname.includes("/parent-chat")) return "Parent Chat";
      if (pathname === "/school-teacher/profile") return "Teacher Profile";
      if (pathname === "/school_teacher/profile") return "Teacher Profile";
      
      // School Student routes
      if (pathname === "/school-student/dashboard") return "Student Dashboard";
      if (pathname === "/school-student/announcements") return "Announcements";
      if (pathname === "/school-student/chat") return "Chat";
      
      // School Parent routes
      if (pathname === "/school-parent/dashboard") return "Parent Dashboard";
      if (pathname === "/school-parent/announcements") return "Announcements";
      if (pathname.startsWith("/school-parent/student/") && pathname.includes("/chat")) return "Chat";
      
      // Admin routes
      if (pathname === "/admin/panel") return "Admin Panel";
      if (pathname === "/admin/dashboard") return "Admin Dashboard";
      if (pathname === "/admin/analytics") return "Admin Analytics";
      if (pathname === "/admin/students") return "All Students";
      if (pathname === "/admin/redemptions") return "Redemptions";
      if (pathname === "/admin/feedback") return "Feedback";
      if (pathname === "/admin/all-redemptions") return "All Redemptions";
      if (pathname === "/admin/stats") return "Statistics";
      if (pathname === "/admin/users") return "Users";
      if (pathname === "/admin/profile") return "Admin Profile";
      if (pathname === "/admin/settings") return "Admin Settings";
      if (pathname === "/admin/settings/communications") return "Communication Settings";
      if (pathname === "/admin/notifications") return "Notifications";
      if (pathname === "/admin/approvals") return "Approvals";
      if (pathname === "/admin/schools") return "Schools";
      if (pathname.startsWith("/admin/schools/")) return "School Details";
      if (pathname === "/admin/incidents") return "Incident Management";
      if (pathname === "/admin/tracking") return "Tracking Dashboard";
      if (pathname === "/admin/payment-tracker") return "Payment Tracker";
      if (pathname === "/admin/marketplace") return "Marketplace";
      if (pathname === "/admin/reports") return "Reports";
      if (pathname === "/admin/behavior-analytics") return "Behavior Analytics";
      if (pathname === "/admin/smart-insights") return "Smart Insights";
      if (pathname === "/admin/financial-console") return "Financial Console";
      if (pathname === "/admin/support-desk") return "Support Desk";
      if (pathname === "/admin/lifecycle") return "Lifecycle Management";
      if (pathname === "/admin/content-governance") return "Content Governance";
      if (pathname === "/admin/audit-timeline") return "Audit Timeline";
      if (pathname === "/admin/configuration") return "Configuration";
      if (pathname === "/admin/communication") return "Communication Suite";
      if (pathname === "/admin/operational") return "Operational Tools";
      if (pathname === "/admin/predictive") return "Predictive Models";
      if (pathname === "/admin/api-control") return "API Control Plane";
      if (pathname === "/admin/platform") return "Admin Platform";
      
      // Parent routes
      if (pathname === "/parent/overview") return "Parent Overview";
      if (pathname === "/parent/dashboard") return "Parent Dashboard";
      if (pathname === "/parent/announcements") return "Announcements";
      if (pathname === "/parent/children") return "My Children";
      if (pathname === "/parent/settings") return "Parent Settings";
      if (pathname === "/parent/upgrade") return "Upgrade";
      if (pathname.startsWith("/parent/child/")) {
        if (pathname.includes("/analytics")) return "Child Analytics";
        if (pathname.includes("/progress")) return "Child Progress";
        if (pathname.includes("/wellbeing")) return "Child Wellbeing";
        if (pathname.includes("/wallet")) return "Child Wallet";
        if (pathname.includes("/chat")) return "Chat";
        return "Child Details";
      }
      if (pathname === "/parent/profile") return "Parent Profile";
      if (pathname === "/parent/notifications") return "Notifications";
      if (pathname === "/parent/parent-progress" || pathname === "/parent/progress") return "Progress";
      
      // Seller routes
      if (pathname === "/seller/dashboard") return "Seller Dashboard";
      
      // CSR routes
      if (pathname === "/csr" || pathname === "/csr/overview") return "CSR Overview";
      if (pathname === "/csr/schools") return "CSR Schools";
      if (pathname === "/csr/dashboard") return "CSR Dashboard";
      if (pathname === "/csr/campaigns") return "CSR Campaigns";
      if (pathname === "/csr/campaign-wizard") return "Campaign Wizard";
      if (pathname === "/csr/funds") return "CSR Funds";
      if (pathname === "/csr/funds/add") return "Add Funds";
      if (pathname === "/csr/reports") return "CSR Reports";
      if (pathname === "/csr/reports/generate") return "Generate Report";
      if (pathname === "/csr/gallery") return "CSR Gallery";
      if (pathname === "/csr/approvals") return "CSR Approvals";
      if (pathname === "/csr/budget-tracking") return "Budget Tracking";
      if (pathname === "/csr/budget") return "Budget";
      if (pathname === "/csr/cobranding") return "Co-branding";
      
      // Chat routes
      if (pathname.includes("/student-chat/") || pathname.includes("/parent-chat")) return "Chat";
      
      // Default fallback - format pathname nicely
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length === 0) return "Wise Student";
      
      // Capitalize and format the last path segment
      const lastPart = pathParts[pathParts.length - 1];
      const formatted = lastPart
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      return formatted || "Wise Student";
    };

    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].includes(location.pathname);

  const RootRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;

    // Legacy roles
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "parent")
      return <Navigate to="/parent/overview" replace />;
    if (user.role === "seller")
      return <Navigate to="/seller/dashboard" replace />;
    if (user.role === "csr") return <Navigate to="/csr/dashboard" replace />;

    // School roles
    if (user.role === "school_admin")
      return <Navigate to="/school/admin/dashboard" replace />;
    if (user.role === "school_teacher")
      return <Navigate to="/school-teacher/overview" replace />;
    if (user.role === "school_student")
      return <Navigate to="/student/dashboard" replace />;
    if (user.role === "school_parent")
      return <Navigate to="/school-parent/dashboard" replace />;

    // Default fallback
    return <Navigate to="/student/dashboard" replace />;
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4" />
        <div className="text-gray-600">Loading your experience...</div>
      </div>
    );
  }

  // Hide navbar on full-screen game routes and standalone pages with back buttons
  const isFullScreenGame =
    location.pathname.startsWith("/student/games/") ||
    location.pathname.startsWith("/student/finance/kids/") ||
    location.pathname.startsWith("/student/finance/teen/") ||
    location.pathname.startsWith("/student/brain/kids/") ||
    location.pathname.startsWith("/student/brain/teen/") ||
    location.pathname.startsWith("/student/uvls/kids/") ||
    location.pathname.startsWith("/student/uvls/teen/") ||
    location.pathname.startsWith("/student/health-male/kids/") ||
    location.pathname.startsWith("/student/health-male/teen") ||
    location.pathname.startsWith("/student/health-female/kids/") ||
    location.pathname.startsWith("/student/health-female/teen") ||
    location.pathname.startsWith("/student/dcos/kids/") ||
    location.pathname.startsWith("/student/dcos/teen/") ||
    location.pathname.startsWith("/student/dcos/teens/") ||
    location.pathname.startsWith("/student/moral-values/kids/") ||
    location.pathname.startsWith("/student/moral-values/teen/") ||
    location.pathname.startsWith("/student/ai-for-all/kids/") ||
    location.pathname.startsWith("/student/ai-for-all/teen/") ||
    location.pathname.startsWith("/student/ehe/kids/") ||
    location.pathname.startsWith("/student/ehe/teen/") ||
    location.pathname.startsWith("/student/ehe/teens/") ||
    location.pathname.startsWith("/student/civic-responsibility/kids/") ||
    location.pathname.startsWith("/student/civic-responsibility/teen/") ||
    location.pathname.startsWith("/student/civic-responsibility/teens/") ||
    location.pathname.startsWith("/student/sustainability/kids/") ||
    location.pathname.startsWith("/student/sustainability/teens/") ||
    location.pathname.startsWith("/games/") ||
    location.pathname.startsWith("/tools/") ||
    location.pathname.startsWith("/learn/") ||
    location.pathname.startsWith("/parent/games/") || // Hide navbar on parent game pages
    location.pathname === "/student/breathing";

  // Hide navbar on chat pages
  const isChatPage = location.pathname.includes("/chat");

  // Hide navbar on public pages
  const isPublicPage =
    [
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    ].includes(location.pathname) || location.pathname.startsWith("/careers/apply");

  // Hide navbar on presentation pages (when editing or presenting a specific presentation)
  // Show navbar on /student/presentation (list page), hide on /student/presentation/:id or /student/presentation/share/:shareCode
  const isPresentationPage = location.pathname.startsWith("/student/presentation") && 
    location.pathname !== "/student/presentation" &&
    (location.pathname.match(/\/student\/presentation\/[^/]+$/) || location.pathname.includes("/student/presentation/share/"));

  // Hide navbar on CSR pages (they use sidebar instead)
  const isCSRPage = location.pathname.startsWith("/csr");
  const isPlatformDetailsPage = location.pathname === "/platform-details";

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage &&
        !isFullScreenGame &&
        !isChatPage &&
        !isPublicPage &&
        !isPresentationPage &&
        !isCSRPage &&
        !isPlatformDetailsPage &&
        location.pathname !== "/" &&
        location.pathname !== "/school-registration" &&
        location.pathname !== "/institution-type" &&
        location.pathname !== "/individual-account" &&
        location.pathname !== "/choose-account-type" &&
        location.pathname !== "/register-parent" &&
        location.pathname !== "/register-seller" &&
        location.pathname !== "/register-teacher" &&
        location.pathname !== "/register-stakeholder" &&
        location.pathname !== "/pending-approval" &&
        !location.pathname.includes("/student-chat/") &&
        !location.pathname.includes("/parent-chat") && <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={user ? <RootRedirect /> : <LandingPage />} />
          <Route path="/platform-details" element={<PlatformDetails />} />
          <Route
            path="/individual-account"
            element={<IndividualAccountSelection />}
          />

          {/* Auth Routes */}
          {/* If authenticated, redirect away from login to role dashboard */}
          <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
          <Route path="/register" element={<Register />} />
          {/* Google login route removed */}
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/register-stakeholder"
            element={<StakeholderRegister />}
          />
          <Route path="/register-parent" element={<ParentRegister />} />
          <Route path="/register-seller" element={<SellerRegister />} />
          <Route path="/register-teacher" element={<TeacherRegister />} />
          <Route
            path="/choose-account-type"
            element={<AccountTypeSelection />}
          />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />

          {/* Multi-Tenant Routes */}
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/create-organization" element={<CreateOrganization />} />

          {/* Institution Registration Routes */}
          <Route
            path="/institution-type"
            element={<InstitutionTypeSelection />}
          />
          <Route path="/school-registration" element={<SchoolRegistration />} />

          {/* School Admin Routes */}
          <Route
            path="/school/admin/dashboard"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/analytics"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminAnalytics />
              </ProtectedRoute>
            }
          />
          {/* Student progress route - must be before /students to match correctly */}
          <Route
            path="/school/admin/student/:studentId/progress"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <TeacherStudentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/students"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/top-performers"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTopPerformers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/teachers"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/classes"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/staff"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/announcements"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <AnnouncementManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/testimonial/submit"
            element={
              <ProtectedRoute roles={["school_admin","school_teacher","school_parent","school_student"]}>
                <SchoolTestimonialSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/approvals"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/templates"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/nep-tracking"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminNEPTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/compliance"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/billing"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/emergency"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEmergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/events"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminPaymentTracker />
              </ProtectedRoute>
            }
          />

          {/* School Admin Profile & Settings Routes */}
          <Route
            path="/school_admin/profile"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school_admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettingsPersonal />
              </ProtectedRoute>
            }
          />

          {/* School Teacher Routes */}
          <Route
            path="/school-teacher/overview"
            element={
              <TeacherProtectedRoute>
                <TeacherOverview />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/dashboard"
            element={
              <TeacherProtectedRoute>
                <SchoolTeacherDashboard />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/students"
            element={
              <TeacherProtectedRoute>
                <TeacherStudents />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/analytics"
            element={
              <TeacherProtectedRoute>
                <TeacherAnalytics />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/chat-contacts"
            element={
              <TeacherProtectedRoute>
                <TeacherChatContacts />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/announcements"
            element={
              <TeacherProtectedRoute>
                <Announcements />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tasks"
            element={
              <TeacherProtectedRoute>
                <TeacherTasks />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tracking"
            element={
              <TeacherProtectedRoute>
                <AssignmentTracking />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/settings"
            element={
              <TeacherProtectedRoute>
                <TeacherSettings />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/settings"
            element={
              <TeacherProtectedRoute>
                <TeacherSettings />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/progress"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentProgress />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/wallet"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentWalletRewards />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student-chat/:studentId"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentChat />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/parent-chat"
            element={
              <TeacherProtectedRoute>
                <TeacherParentChat />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/profile"
            element={
              <TeacherProtectedRoute>
                <TeacherProfile />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/profile"
            element={
              <TeacherProtectedRoute>
                <TeacherProfile />
              </TeacherProtectedRoute>
            }
          />

          <Route
            path="/school-student/dashboard"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/announcements"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/chat"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/dashboard"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <SchoolParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/announcements"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/student/:studentId/chat"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/school/sponsorship"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/sponsorship/gallery"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorshipGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/sponsorship/thank-you"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorshipThankYou />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/activity"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignment/:assignmentId/attempt"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AssignmentAttempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/announcements"
            element={
              <ProtectedRoute roles={["student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/quick-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuickQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/:categorySlug"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CategoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mindfull-break"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mood-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MoodTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/rewards"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/redeem"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RedeemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/wallet"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leaderboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute roles={["student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payment"
            element={
              <ProtectedRoute roles={["student"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/:id?"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/share/:shareCode"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/breathing"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-literacy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialLiteracy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/brain-health-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BrainHealthQuiz />
              </ProtectedRoute>
            }
          />
          {/* Financial Literacy Routes - New structure */}
          <Route
            path="/student/finance/budget-planner"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/investment-simulator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <InvestmentSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/savings-goals"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/financial-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/expense-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/credit-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CreditManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/debt-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebtTracker />
              </ProtectedRoute>
            }
          />

          {/* Legacy routes for backward compatibility */}
          <Route
            path="/tools/budget-planner"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/investment-simulator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <InvestmentSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/savings-goals"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/expense-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/credit-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CreditManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/debt-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebtTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/stress-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StressManagement />
              </ProtectedRoute>
            }
          />


        {/* Universal Game Routes - Can render any game within single component*/}
        <Route path="/student/:category/:age/:game" element={<ProtectedRoute roles={['student', 'school_student']}><UniversalGameRenderer /></ProtectedRoute>} />

        {/* Legacy Game Category Pages - Keep for backward compatibility */}
        <Route path="/games/dcos" element={<ProtectedRoute roles={['student', 'school_student']}><DCOSGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser/:gameId" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserPlay /></ProtectedRoute>} />
        <Route path="/games/:category/:ageGroup" element={<ProtectedRoute roles={['student', 'school_student']}><GameCategoryPage /></ProtectedRoute>} />


          {/* Admin Routes */}
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/goodie-orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <GoodieOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FeedbackHistoryModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/all-redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminStatsPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsersPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/communications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettingsCommunications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools/:schoolId"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <ProtectedRoute roles={["admin"]}>
                <IncidentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tracking"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminTrackingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPaymentTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/marketplace"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/behavior-analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <BehaviorAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/smart-insights"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SmartInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/financial-console"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FinancialConsole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support-desk"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SupportDesk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/csr/testimonials"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCSRTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/csr/refunds"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCSRRefunds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lifecycle"
            element={
              <ProtectedRoute roles={["admin"]}>
                <LifecycleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content-governance"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ContentGovernance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-timeline"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AuditTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuration"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ConfigurationControlCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communication"
            element={
              <ProtectedRoute roles={["admin"]}>
                <CommunicationSuite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operational"
            element={
              <ProtectedRoute roles={["admin"]}>
                <OperationalTools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/predictive"
            element={
              <ProtectedRoute roles={["admin"]}>
                <PredictiveModels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/api-control"
            element={
              <ProtectedRoute roles={["admin"]}>
                <APIControlPlane />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/platform"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPlatform />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/overview"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/announcements"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/children"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildren />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/settings"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/upgrade"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentUpgrade />
              </ProtectedRoute>
            }
          />

          {/* Child Analytics Routes */}
          <Route
            path="/parent/child/:childId"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/analytics"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wellbeing"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildMoodWellbeing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wallet"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildWalletRewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/chat"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute roles={["parent"]}>
                <ParentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/notifications"
            element={
              <ProtectedRoute roles={["parent"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/parent-progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Parent Game Routes */}
          <Route
            path="/parent/games"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentGamesHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/games/:category"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentGameCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/games/:category/:gameId"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <UniversalParentGameRenderer />
              </ProtectedRoute>
            }
          />

          {/* Teacher Game Routes */}
          <Route
            path="/school-teacher/games"
            element={
              <TeacherProtectedRoute>
                <TeacherGamesHub />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/games/:category"
            element={
              <TeacherProtectedRoute>
                <TeacherGameCategoryPage />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/games/:category/:gameId"
            element={
              <TeacherProtectedRoute>
                <UniversalTeacherGameRenderer />
              </TeacherProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute roles={["seller"]} requireApproved={true}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* CSR Routes */}
          <Route
            path="/csr"
            element={<Navigate to="/csr/overview" replace />}
          />
          <Route
            path="/csr/dashboard"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                <CSRDashboard />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/notifications"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRNotifications />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/schools"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSchools />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/sponsorships"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSponsorships />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/sponsorships/new"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSponsorshipNew />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/sponsorships/:id/renew"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSponsorshipRenew />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/sponsorships/:id"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSponsorshipDetails />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/financial"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRFinancial />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/funds"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRFunds />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/funds/add"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRFundsAdd />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/funds/refund"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRFundsRefund />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/reports"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                <CSRReports />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/reports/generate"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRReportGenerate />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/gallery"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRGallery />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/testimonials"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRTestimonials />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/approvals"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                <CSRApprovals />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/profile"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRProfile />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/settings"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSettings />
                </CSRLayout>
              </ProtectedRoute>
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply/:jobId" element={<CareerApply />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Toaster /> {/* Toast notification container */}
    </div>
  );
};

export default App;
