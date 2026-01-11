import express from 'express';
import {
  getSchoolStats,
  getSchoolActivities,
  getSchoolClasses,
  getSchoolStudents,
  getSchoolTeachers,
  getAvailableTeachers,
  getAdminTeacherStats,
  getTeacherDetailsById,
  createTeacher,
  deleteTeacher,
  exportTeachers,
  getAllClasses,
  getClassStats,
  getClassDetails,
  createClass,
  createSequentialClass,
  addStudentsToClass,
  addStudentsByEmailToClass,
  addTeachersToClass,
  removeTeacherFromClass,
  removeStudentFromClass,
  updateClass,
  deleteClass,
  getTeacherStats,
  getTeacherClasses,
  getTeacherAssignments,
  getAssignmentTypeStats,
  getTeacherTimetable,
  getAllStudentsForTeacher,
  getStudentAnalyticsForTeacher,
  getStudentParent,
  getClassMasteryByPillar,
  getStudentsAtRisk,
  getSessionEngagement,
  getStudentTransactionsForTeacher,
  getPendingTasks,
  getLeaderboard,
  exportTeacherAnalytics,
  getClassStudents,
  getClassMissions,
  getStudentStats,
  getStudentAssignments,
  getStudentTimetable,
  getStudentGrades,
  getStudentAnnouncements,
  getParentChildren,
  getChildStats,
  getParentActivities,
  getParentFees,
  getParentAnnouncements,
  createSchoolStudent,
  createSchoolTeacher,
  createSchoolParent,
  createAssignment,
  updateAssignment,
  deleteAssignmentForTeacher,
  deleteAssignmentForEveryone,
  deleteAssignmentForStudent,
  getAssignmentById,
  createSampleData,
  getTeacherSettings,
  updateTeacherSettings,
  getStudentDetails,
  saveStudentNote,
  toggleStudentFlag,
  sendStudentMessage,
  generateInviteLink,
  sendEmailInvites,
  getTeacherGroups,
  createStudentGroup,
  updateStudentGroups,
  searchStudents,
  assignStudentsToClass,
  generateRegistrationLink,
  bulkUploadStudents,
  getInavoraCatalog,
  getAvailableBadges,
  getStudentsForAssignment,
  aiSuggestStudents,
  // New analytics endpoints
  getStudentAdoption,
  getSchoolPillarMastery,
  getWellbeingCases,
  getTeacherAdoption,
  getNEPAlignment,
  // Comprehensive admin endpoints
  getOrganizationCampuses,
  addCampus,
  getComprehensiveKPIs,
  getHeatmapData,
  getPendingApprovals,
  approveOrRejectItem,
  getAllStaff,
  assignTeacherToClass,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  exportTemplates,
  getSubscriptionDetails,
  upgradeSubscription,
  renewSubscription,
  // Compliance endpoints
  getConsentRecords,
  createConsentRecord,
  withdrawConsent,
  getDataRetentionPolicies,
  createDataRetentionPolicy,
  updateDataRetentionPolicy,
  deleteDataRetentionPolicy,
  getAuditLogs,
  exportAuditLogs,
  getComplianceDashboard,
  enforceDataRetention,
  getUserConsentStatus,
  generateComplianceReport,
  // Enhanced assignment approval
  getAssignmentPreview,
  approveAssignmentWithNotification,
  requestAssignmentChanges,
  rejectAssignment,
  // Enhanced template management
  uploadTemplateWithTags,
  updateTemplateWithTags,
  // User management
  createUserWithRole,
  assignRoleToUser,
  // Escalation management
  getEscalationChains,
  createEscalationChain,
  updateEscalationChain,
  triggerEscalation,
  getEscalationCases,
  resolveEscalationCase,
  // NEP Competency tracking
  getNEPCompetencies,
  createNEPCompetency,
  logNEPCoverage,
  getNEPCoverageReport,
  exportNEPCoverageCSV,
  exportNEPCoverageJSON,
  seedNEPCompetencies,
  updateTemplateNEPCompetencies,
  updateAssignmentNEPCompetencies,
  getNEPDashboard,
  // Enhanced billing & support
  getEnhancedSubscriptionDetails,
  getSupportTickets,
  getInvoiceDetails,
  updatePaymentMethod,
  getPlanComparison,
  // Helper endpoints
  getOrganizationInfo,
  getRecentActivity,
  getTopPerformers,
  getWeeklyTrend,
  getPerformanceByGrade,
  getEngagementTrend,
  getStudentsWithFilters,
  getAvailableStudents,
  getAdminStudentStats,
  getStaffStats,
  createStudent,
  deleteStudent,
  resetStudentPassword,
  syncStudentGender,
  getSchoolStudentDetails,
  exportStudents,
  exportAnalyticsReport,
  getTemplateById,
  approveTemplate,
  rejectTemplate,
  updateOrganizationInfo,
  updateCampus,
  deleteCampus,
  updatePreferences
} from '../controllers/schoolController.js';
import { extractTenant, enforceTenantIsolation } from '../middlewares/tenantMiddleware.js';
import { requireAuth, requireSchoolAdmin, requireSchoolTeacher, requireSchoolRole, loadUserPermissions } from '../middlewares/requireAuth.js';
import { requirePermission } from '../utils/permissionChecker.js';
import { getAdminProfileStats } from '../controllers/userController.js';
import { checkTeacherAccess } from '../controllers/teacherAccessController.js';
import {
  completeTeacherGame,
  getTeacherGameProgress,
  unlockTeacherGameReplay
} from '../controllers/teacherGameController.js';
import {
  getSelfAwareTeacherBadgeStatus,
  collectSelfAwareTeacherBadgeEndpoint,
  getTeacherBadges,
  getCalmTeacherBadgeStatus,
  collectCalmTeacherBadgeEndpoint,
  getCompassionBalanceBadgeStatus,
  collectCompassionBalanceBadgeEndpoint,
  checkBalancedLifeBadgeStatus,
  collectBalancedLifeBadge,
  checkMindfulMasteryBadgeStatus,
  collectMindfulMasteryBadge,
  getMindfulMasteryBadgeStatus,
  collectMindfulMasteryBadgeEndpoint,
  getResilientEducatorBadgeStatus,
  collectResilientEducatorBadgeEndpoint,
  checkClearCommunicatorBadgeStatus,
  collectClearCommunicatorBadge,
  getClearCommunicatorBadgeStatus,
  collectClearCommunicatorBadgeEndpoint,
  getConnectedTeacherBadgeStatus,
  collectConnectedTeacherBadgeEndpoint,
  getPurposefulTeacherBadgeStatus,
  collectPurposefulTeacherBadgeEndpoint,
  getSelfCareChampionBadgeStatus,
  collectSelfCareChampionBadgeEndpoint
} from '../controllers/teacherBadgeController.js';
import multer from 'multer';

// Configure multer for CSV upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);
router.use(enforceTenantIsolation);

// School Admin Routes
router.get('/stats', requireAuth, requireSchoolRole, getSchoolStats);
router.get('/activities', requireAuth, requireSchoolRole, getSchoolActivities);
router.get('/classes', requireAuth, requireSchoolRole, getSchoolClasses);
router.get('/students', requireAuth, requireSchoolRole, getSchoolStudents);
router.get('/teachers', requireAuth, requireSchoolRole, getSchoolTeachers);

// School Admin Analytics Routes (with permission checks)
router.get('/admin/analytics/student-adoption', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getStudentAdoption);
router.get('/admin/analytics/pillar-mastery', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getSchoolPillarMastery);
router.get('/admin/analytics/wellbeing-cases', requireAuth, loadUserPermissions, requirePermission(['viewAnalytics', 'viewWellbeingCases']), getWellbeingCases);
router.get('/admin/analytics/teacher-adoption', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getTeacherAdoption);
router.get('/admin/analytics/nep-alignment', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getNEPAlignment);

// Comprehensive School Admin Routes (with permission checks)
router.get('/admin/campuses', requireAuth, loadUserPermissions, requirePermission(['viewDashboard', 'viewAllCampuses', 'viewOwnCampusOnly'], { mode: 'any' }), getOrganizationCampuses);
router.post('/admin/campuses', requireAuth, loadUserPermissions, requirePermission('manageCampuses'), addCampus);
router.get('/admin/kpis', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getComprehensiveKPIs);
router.get('/admin/heatmap', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getHeatmapData);
router.get('/admin/pending-approvals', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), getPendingApprovals);
router.post('/admin/approve-reject', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), approveOrRejectItem);
router.get('/admin/staff', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getAllStaff);
router.post('/admin/assign-teacher', requireAuth, loadUserPermissions, requirePermission('assignClasses'), assignTeacherToClass);

// Template Management Routes (with permission checks)
router.get('/admin/templates/export', requireAuth, loadUserPermissions, requirePermission('viewAllAssignments'), exportTemplates);
router.get('/admin/templates', requireAuth, loadUserPermissions, requirePermission('viewAllAssignments'), getTemplates);
router.post('/admin/templates', requireAuth, loadUserPermissions, requirePermission('createTemplates'), createTemplate);
router.get('/admin/templates/:templateId', requireAuth, loadUserPermissions, requirePermission('viewAllAssignments'), getTemplateById);
router.put('/admin/templates/:templateId', requireAuth, loadUserPermissions, requirePermission('editTemplates'), updateTemplate);
router.delete('/admin/templates/:templateId', requireAuth, loadUserPermissions, requirePermission('deleteTemplates'), deleteTemplate);
router.post('/admin/templates/:templateId/approve', requireAuth, loadUserPermissions, requirePermission('approveTemplates'), approveTemplate);
router.post('/admin/templates/:templateId/reject', requireAuth, loadUserPermissions, requirePermission('approveTemplates'), rejectTemplate);

// Subscription & Billing Routes (with permission checks)
router.get('/admin/subscription', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), getSubscriptionDetails);
router.get('/admin/subscription/enhanced', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), getEnhancedSubscriptionDetails);
router.post('/admin/subscription/upgrade', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), upgradeSubscription);
router.post('/admin/subscription/renew', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), renewSubscription);
router.get('/admin/subscription/plans', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), getPlanComparison);
router.get('/admin/invoices/:invoiceId', requireAuth, loadUserPermissions, requirePermission('viewFinancials'), getInvoiceDetails);
router.put('/admin/subscription/payment-method', requireAuth, loadUserPermissions, requirePermission('manageSubscription'), updatePaymentMethod);

// Support & Trial Extension Routes (Admin only)
router.get('/admin/support/tickets', requireAuth, requireSchoolAdmin, getSupportTickets);

// Policy & Compliance Routes (with permission checks)
router.get('/admin/compliance/dashboard', requireAuth, loadUserPermissions, requirePermission('viewComplianceData'), getComplianceDashboard);
router.get('/admin/compliance/consents', requireAuth, loadUserPermissions, requirePermission('viewComplianceData'), getConsentRecords);
router.post('/admin/compliance/consents', requireAuth, loadUserPermissions, requirePermission('manageConsents'), createConsentRecord);
router.put('/admin/compliance/consents/:consentId/withdraw', requireAuth, loadUserPermissions, requirePermission('manageConsents'), withdrawConsent);
router.get('/admin/compliance/policies', requireAuth, loadUserPermissions, requirePermission('viewComplianceData'), getDataRetentionPolicies);
router.post('/admin/compliance/policies', requireAuth, loadUserPermissions, requirePermission('managePolicies'), createDataRetentionPolicy);
router.put('/admin/compliance/policies/:policyId', requireAuth, loadUserPermissions, requirePermission('managePolicies'), updateDataRetentionPolicy);
router.delete('/admin/compliance/policies/:policyId', requireAuth, loadUserPermissions, requirePermission('managePolicies'), deleteDataRetentionPolicy);
router.post('/admin/compliance/policies/:policyId/enforce', requireAuth, loadUserPermissions, requirePermission('managePolicies'), enforceDataRetention);
router.get('/admin/compliance/audit-logs', requireAuth, loadUserPermissions, requirePermission('viewAuditLogs'), getAuditLogs);
router.get('/admin/compliance/audit-logs/export', requireAuth, loadUserPermissions, requirePermission('viewAuditLogs'), exportAuditLogs);
router.get('/admin/compliance/user/:userId/consents', requireAuth, loadUserPermissions, requirePermission('viewComplianceData'), getUserConsentStatus);
router.get('/admin/compliance/report', requireAuth, loadUserPermissions, requirePermission('viewComplianceData'), generateComplianceReport);

// Enhanced Assignment Approval Routes (with permission checks)
router.get('/admin/assignments/:assignmentId/preview', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), getAssignmentPreview);
router.post('/admin/assignments/:assignmentId/approve', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), approveAssignmentWithNotification);
router.post('/admin/assignments/:assignmentId/request-changes', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), requestAssignmentChanges);
router.post('/admin/assignments/:assignmentId/reject', requireAuth, loadUserPermissions, requirePermission('approveAssignments'), rejectAssignment);

// Enhanced Template Management Routes (with permission checks)
router.post('/admin/templates/upload', requireAuth, loadUserPermissions, requirePermission('createTemplates'), uploadTemplateWithTags);
router.put('/admin/templates/:templateId/tags', requireAuth, loadUserPermissions, requirePermission('editTemplates'), updateTemplateWithTags);

// User Management Routes (with permission checks)
router.post('/admin/users/create-with-role', requireAuth, loadUserPermissions, requirePermission('createStaff'), createUserWithRole);
router.put('/admin/users/:userId/assign-role', requireAuth, loadUserPermissions, requirePermission('editStaff'), assignRoleToUser);

// Escalation & Emergency Routes (with permission checks)
router.get('/admin/escalation-chains', requireAuth, loadUserPermissions, requirePermission('manageEscalation'), getEscalationChains);
router.post('/admin/escalation-chains', requireAuth, loadUserPermissions, requirePermission('manageEscalation'), createEscalationChain);
router.put('/admin/escalation-chains/:chainId', requireAuth, loadUserPermissions, requirePermission('manageEscalation'), updateEscalationChain);
router.post('/admin/escalation/trigger', requireAuth, loadUserPermissions, requirePermission('manageEscalation'), triggerEscalation);
router.get('/admin/escalation/cases', requireAuth, loadUserPermissions, requirePermission('viewWellbeingCases'), getEscalationCases);
router.put('/admin/escalation/cases/:caseId/resolve', requireAuth, loadUserPermissions, requirePermission('resolveWellbeingCases'), resolveEscalationCase);

// Helper Endpoints (with permission checks)
router.get('/admin/profile-stats', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getAdminProfileStats);
router.get('/admin/organization-info', requireAuth, loadUserPermissions, requirePermission('manageSettings'), getOrganizationInfo);
router.put('/admin/organization-info', requireAuth, loadUserPermissions, requirePermission('manageSettings'), updateOrganizationInfo);
router.put('/admin/campuses/:campusId', requireAuth, loadUserPermissions, requirePermission('manageCampuses'), updateCampus);
router.delete('/admin/campuses/:campusId', requireAuth, loadUserPermissions, requirePermission('manageCampuses'), deleteCampus);
router.put('/admin/preferences', requireAuth, loadUserPermissions, requirePermission('manageSettings'), updatePreferences);
router.get('/admin/recent-activity', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getRecentActivity);
router.get('/admin/top-performers', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getTopPerformers);
router.get('/admin/weekly-trend', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getWeeklyTrend);
router.get('/admin/analytics/performance-by-grade', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getPerformanceByGrade);
router.get('/admin/analytics/engagement-trend', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getEngagementTrend);
router.get('/admin/analytics/export', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), exportAnalyticsReport);
router.get('/admin/classes', extractTenant, requireAuth, requireSchoolAdmin, getAllClasses);
router.get('/admin/students', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getStudentsWithFilters);
router.get('/admin/students/available', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getAvailableStudents);
router.post('/admin/students/create', extractTenant, requireAuth, loadUserPermissions, requirePermission('createStudent'), createStudent);
router.get('/admin/students/stats', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getAdminStudentStats);
router.get('/admin/students/export', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewStudentPII'), exportStudents);
router.post('/admin/students/sync-gender', extractTenant, requireAuth, loadUserPermissions, requirePermission('editStudent'), syncStudentGender);
router.get('/admin/students/:studentId', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewStudentPII'), getSchoolStudentDetails);
router.post('/admin/students/:studentId/reset-password', requireAuth, loadUserPermissions, requirePermission('editStudent'), resetStudentPassword);
router.delete('/admin/students/:studentId', requireAuth, loadUserPermissions, requirePermission('deleteStudent'), deleteStudent);
router.get('/admin/staff/stats', requireAuth, requireSchoolAdmin, getStaffStats);

// Teacher Management Routes (with permission checks)
router.get('/admin/teachers', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getSchoolTeachers);
router.get('/admin/teachers/available', extractTenant, requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getAvailableTeachers);
router.post('/admin/teachers/create', extractTenant, requireAuth, loadUserPermissions, requirePermission('createStaff'), createTeacher);
router.get('/admin/teachers/stats', requireAuth, loadUserPermissions, requirePermission('viewAnalytics'), getAdminTeacherStats);
router.get('/admin/teachers/export', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), exportTeachers);
router.get('/admin/teachers/:teacherId', requireAuth, loadUserPermissions, requirePermission('viewDashboard'), getTeacherDetailsById);
router.delete('/admin/teachers/:teacherId', requireAuth, loadUserPermissions, requirePermission('deleteStaff'), deleteTeacher);

// Class Management Routes (Admin only)
router.get('/admin/classes', requireAuth, requireSchoolAdmin, getAllClasses);
router.post('/admin/classes/create', extractTenant, requireAuth, requireSchoolAdmin, createClass);
router.post('/admin/classes/create-sequential', extractTenant, requireAuth, requireSchoolAdmin, createSequentialClass);
router.get('/admin/classes/stats', extractTenant, requireAuth, requireSchoolAdmin, getClassStats);
router.get('/admin/classes/:classId', extractTenant, requireAuth, requireSchoolAdmin, getClassDetails);
router.post('/admin/classes/:classId/students', extractTenant, requireAuth, requireSchoolAdmin, addStudentsToClass);
router.post('/admin/classes/:classId/students-by-email', extractTenant, requireAuth, requireSchoolAdmin, addStudentsByEmailToClass);
router.post('/admin/classes/:classId/teachers', extractTenant, requireAuth, requireSchoolAdmin, addTeachersToClass);
router.delete('/admin/classes/:classId/teachers/:teacherId', extractTenant, requireAuth, requireSchoolAdmin, removeTeacherFromClass);
router.delete('/admin/classes/:classId/students/:studentId', extractTenant, requireAuth, requireSchoolAdmin, removeStudentFromClass);
router.put('/admin/classes/:classId', extractTenant, requireAuth, requireSchoolAdmin, updateClass);
router.delete('/admin/classes/:classId', extractTenant, requireAuth, requireSchoolAdmin, deleteClass);

// NEP Competency Tracking & Export Routes (Admin only)
router.get('/admin/nep/competencies', requireAuth, requireSchoolAdmin, getNEPCompetencies);
router.post('/admin/nep/competencies', requireAuth, requireSchoolAdmin, createNEPCompetency);
router.post('/admin/nep/competencies/seed', requireAuth, requireSchoolAdmin, seedNEPCompetencies);
router.post('/admin/nep/coverage/log', requireAuth, requireSchoolAdmin, logNEPCoverage);
router.get('/admin/nep/coverage/report', requireAuth, requireSchoolAdmin, getNEPCoverageReport);
router.get('/admin/nep/coverage/export/csv', requireAuth, requireSchoolAdmin, exportNEPCoverageCSV);
router.get('/admin/nep/coverage/export/json', requireAuth, requireSchoolAdmin, exportNEPCoverageJSON);
router.get('/admin/nep/dashboard', requireAuth, requireSchoolAdmin, getNEPDashboard);
router.put('/admin/templates/:templateId/nep-competencies', requireAuth, requireSchoolAdmin, updateTemplateNEPCompetencies);
router.put('/admin/assignments/:assignmentId/nep-competencies', requireAuth, requireSchoolAdmin, updateAssignmentNEPCompetencies);

// Subscription Expiration Notification Routes
router.get('/subscription/:subscriptionId/expiration-notifications', requireAuth, requireSchoolRole, async (req, res) => {
  const { getExpirationNotificationStatus } = await import('../controllers/subscriptionExpirationNotificationController.js');
  return getExpirationNotificationStatus(req, res);
});

// School Teacher Routes (Teacher only or admin)
router.get('/teacher/access', requireAuth, requireSchoolRole, checkTeacherAccess);
router.get('/teacher/stats', requireAuth, requireSchoolRole, getTeacherStats);
router.get('/teacher/classes', requireAuth, requireSchoolRole, getTeacherClasses);
router.get('/teacher/assignments', requireAuth, requireSchoolRole, getTeacherAssignments);
router.get('/teacher/assignment-type-stats', requireAuth, requireSchoolRole, getAssignmentTypeStats);
router.get('/teacher/timetable', requireAuth, requireSchoolRole, getTeacherTimetable);
router.get('/teacher/all-students', requireAuth, requireSchoolRole, getAllStudentsForTeacher);
router.get('/teacher/student/:studentId/analytics', requireAuth, requireSchoolRole, getStudentAnalyticsForTeacher);
router.get('/teacher/student/:studentId/transactions', requireAuth, requireSchoolRole, getStudentTransactionsForTeacher);
router.get('/student/:studentId/parent', requireAuth, requireSchoolRole, getStudentParent);
router.get('/teacher/class-mastery', requireAuth, requireSchoolRole, getClassMasteryByPillar);
router.get('/teacher/students-at-risk', requireAuth, requireSchoolRole, getStudentsAtRisk);
router.get('/teacher/session-engagement', requireAuth, requireSchoolRole, getSessionEngagement);
router.get('/teacher/pending-tasks', requireAuth, requireSchoolRole, getPendingTasks);
router.get('/teacher/leaderboard', requireAuth, requireSchoolRole, getLeaderboard);
router.get('/teacher/class/:classId/students', requireAuth, requireSchoolRole, getClassStudents);
router.get('/teacher/class-missions', requireAuth, requireSchoolRole, getClassMissions);
router.get('/teacher/analytics/export', requireAuth, requireSchoolRole, exportTeacherAnalytics);

// Assignment/Task CRUD
router.post('/teacher/assignments', requireAuth, requireSchoolRole, createAssignment);
router.put('/teacher/assignments/:assignmentId', requireAuth, requireSchoolRole, updateAssignment);
router.delete('/teacher/assignments/:assignmentId/for-me', requireAuth, requireSchoolRole, deleteAssignmentForTeacher);
router.delete('/teacher/assignments/:assignmentId/for-everyone', requireAuth, requireSchoolRole, deleteAssignmentForEveryone);

// Student delete assignment
router.delete('/student/assignments/:assignmentId/for-me', requireAuth, requireSchoolRole, deleteAssignmentForStudent);

// Message operations

// Sample data creation (for testing)
router.post('/teacher/create-sample-data', requireAuth, requireSchoolRole, createSampleData);

// Teacher settings
router.get('/teacher/settings', requireAuth, requireSchoolRole, getTeacherSettings);
router.put('/teacher/settings', requireAuth, requireSchoolRole, updateTeacherSettings);

// Student details and actions
router.get('/teacher/student/:studentId/details', requireAuth, requireSchoolRole, getStudentDetails);
router.post('/teacher/student/:studentId/notes', requireAuth, requireSchoolRole, saveStudentNote);
router.put('/teacher/student/:studentId/flag', requireAuth, requireSchoolRole, toggleStudentFlag);
router.post('/teacher/student/:studentId/message', requireAuth, requireSchoolRole, sendStudentMessage);
router.put('/teacher/student/:studentId/groups', requireAuth, requireSchoolRole, updateStudentGroups);

// Invite links and email
router.post('/teacher/generate-invite', requireAuth, requireSchoolRole, generateInviteLink);
router.post('/teacher/send-invites', requireAuth, requireSchoolRole, sendEmailInvites);
router.post('/teacher/generate-registration-link', requireAuth, requireSchoolRole, generateRegistrationLink);

// Student management
router.get('/teacher/search-students', requireAuth, requireSchoolRole, searchStudents);
router.post('/teacher/assign-students', requireAuth, requireSchoolRole, assignStudentsToClass);
router.post('/teacher/bulk-upload-students', requireAuth, requireSchoolRole, upload.single('csvFile'), bulkUploadStudents);

// Student groups
router.get('/teacher/groups', requireAuth, requireSchoolRole, getTeacherGroups);
router.post('/teacher/groups', requireAuth, requireSchoolRole, createStudentGroup);

router.get('/teacher/inavora-catalog', requireAuth, requireSchoolRole, getInavoraCatalog);
router.get('/teacher/available-badges', requireAuth, requireSchoolRole, getAvailableBadges);
router.post('/teacher/get-students-for-assignment', requireAuth, requireSchoolRole, getStudentsForAssignment);
router.post('/teacher/ai-suggest-students', requireAuth, requireSchoolRole, aiSuggestStudents);
router.delete('/teacher/class/:classId/student/:studentId', requireAuth, requireSchoolRole, removeStudentFromClass);

// School Student Routes
router.get('/student/stats', requireAuth, requireSchoolRole, getStudentStats);
router.get('/student/assignments', requireAuth, requireSchoolRole, getStudentAssignments);
router.get('/assignments/:assignmentId', requireAuth, requireSchoolRole, getAssignmentById);
router.get('/student/timetable', requireAuth, requireSchoolRole, getStudentTimetable);
router.get('/student/grades', requireAuth, requireSchoolRole, getStudentGrades);
router.get('/student/announcements', requireAuth, requireSchoolRole, getStudentAnnouncements);

// School Parent Routes
router.get('/parent/children', requireAuth, requireSchoolRole, getParentChildren);
router.get('/parent/child/:childId/stats', requireAuth, requireSchoolRole, getChildStats);
router.get('/parent/activities', requireAuth, requireSchoolRole, getParentActivities);
router.get('/parent/fees', requireAuth, requireSchoolRole, getParentFees);
router.get('/parent/announcements', requireAuth, requireSchoolRole, getParentAnnouncements);

// School Admin Creation Routes (Admin only)
router.post('/student', requireAuth, requireSchoolAdmin, createSchoolStudent);
router.post('/teacher', requireAuth, requireSchoolAdmin, createSchoolTeacher);
router.post('/parent', requireAuth, requireSchoolAdmin, createSchoolParent);

// Teacher Game Routes
// POST /api/school/teacher/game/complete - Complete a teacher game
router.post('/teacher/game/complete', requireAuth, requireSchoolRole, completeTeacherGame);

// GET /api/school/teacher/game/progress/:gameId - Get teacher game progress
router.get('/teacher/game/progress/:gameId', requireAuth, requireSchoolRole, getTeacherGameProgress);

// POST /api/school/teacher/game/unlock-replay/:gameId - Unlock replay for teacher game
router.post('/teacher/game/unlock-replay/:gameId', requireAuth, requireSchoolRole, unlockTeacherGameReplay);

// Teacher Badge Routes
// GET /api/school/teacher/badge/self-aware-teacher - Get Self-Aware Teacher Badge status
router.get('/teacher/badge/self-aware-teacher', requireAuth, requireSchoolRole, getSelfAwareTeacherBadgeStatus);

// POST /api/school/teacher/badge/self-aware-teacher/collect - Collect Self-Aware Teacher Badge
router.post('/teacher/badge/self-aware-teacher/collect', requireAuth, requireSchoolRole, collectSelfAwareTeacherBadgeEndpoint);

// GET /api/school/teacher/badge/calm-teacher - Get Calm Teacher Badge status
router.get('/teacher/badge/calm-teacher', requireAuth, requireSchoolRole, getCalmTeacherBadgeStatus);

// POST /api/school/teacher/badge/calm-teacher/collect - Collect Calm Teacher Badge
router.post('/teacher/badge/calm-teacher/collect', requireAuth, requireSchoolRole, collectCalmTeacherBadgeEndpoint);

// GET /api/school/teacher/badge/compassion-balance - Get Compassion Balance Badge status
router.get('/teacher/badge/compassion-balance', requireAuth, requireSchoolRole, getCompassionBalanceBadgeStatus);

// POST /api/school/teacher/badge/compassion-balance/collect - Collect Compassion Balance Badge
router.post('/teacher/badge/compassion-balance/collect', requireAuth, requireSchoolRole, collectCompassionBalanceBadgeEndpoint);

// GET /api/school/teacher/badge/balanced-life - Get Balanced Life Badge status
router.get('/teacher/badge/balanced-life', requireAuth, requireSchoolRole, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await checkBalancedLifeBadgeStatus(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error getting Balanced Life Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
});

// POST /api/school/teacher/badge/balanced-life/collect - Collect Balanced Life Badge
router.post('/teacher/badge/balanced-life/collect', requireAuth, requireSchoolRole, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await collectBalancedLifeBadge(userId);
    if (result.success) {
      res.json({ success: true, ...result });
    } else {
      res.status(400).json({ success: false, ...result });
    }
  } catch (error) {
    console.error('Error collecting Balanced Life Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
});

// GET /api/school/teacher/badge/mindful-mastery - Get Mindful Mastery Badge status
router.get('/teacher/badge/mindful-mastery', requireAuth, requireSchoolRole, getMindfulMasteryBadgeStatus);

// POST /api/school/teacher/badge/mindful-mastery/collect - Collect Mindful Mastery Badge
router.post('/teacher/badge/mindful-mastery/collect', requireAuth, requireSchoolRole, collectMindfulMasteryBadgeEndpoint);

// GET /api/school/teacher/badge/resilient-educator - Get Resilient Educator Badge status
router.get('/teacher/badge/resilient-educator', requireAuth, requireSchoolRole, getResilientEducatorBadgeStatus);

// POST /api/school/teacher/badge/resilient-educator/collect - Collect Resilient Educator Badge
router.post('/teacher/badge/resilient-educator/collect', requireAuth, requireSchoolRole, collectResilientEducatorBadgeEndpoint);

// GET /api/school/teacher/badge/clear-communicator - Get Clear Communicator Badge status
router.get('/teacher/badge/clear-communicator', requireAuth, requireSchoolRole, getClearCommunicatorBadgeStatus);

// POST /api/school/teacher/badge/clear-communicator/collect - Collect Clear Communicator Badge
router.post('/teacher/badge/clear-communicator/collect', requireAuth, requireSchoolRole, collectClearCommunicatorBadgeEndpoint);

// GET /api/school/teacher/badge/connected-teacher - Get Connected Teacher Badge status
router.get('/teacher/badge/connected-teacher', requireAuth, requireSchoolRole, getConnectedTeacherBadgeStatus);

// POST /api/school/teacher/badge/connected-teacher/collect - Collect Connected Teacher Badge
router.post('/teacher/badge/connected-teacher/collect', requireAuth, requireSchoolRole, collectConnectedTeacherBadgeEndpoint);

// GET /api/school/teacher/badge/purposeful-teacher - Get Purposeful Teacher Badge status
router.get('/teacher/badge/purposeful-teacher', requireAuth, requireSchoolRole, getPurposefulTeacherBadgeStatus);

// POST /api/school/teacher/badge/purposeful-teacher/collect - Collect Purposeful Teacher Badge
router.post('/teacher/badge/purposeful-teacher/collect', requireAuth, requireSchoolRole, collectPurposefulTeacherBadgeEndpoint);

// GET /api/school/teacher/badge/self-care-champion - Get Self-Care Champion Badge status
router.get('/teacher/badge/self-care-champion', requireAuth, requireSchoolRole, getSelfCareChampionBadgeStatus);

// POST /api/school/teacher/badge/self-care-champion/collect - Collect Self-Care Champion Badge
router.post('/teacher/badge/self-care-champion/collect', requireAuth, requireSchoolRole, collectSelfCareChampionBadgeEndpoint);

// GET /api/school/teacher/badges - Get all teacher badges
router.get('/teacher/badges', requireAuth, requireSchoolRole, getTeacherBadges);

export default router;
