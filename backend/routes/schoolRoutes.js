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
  getPendingTasks,
  getLeaderboard,
  exportTeacherAnalytics,
  getClassStudents,
  getTeacherMessages,
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
  markMessageAsRead,
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
  // Role management
  getRolePermissions,
  createCustomRole,
  updateRolePermissions,
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
import { requireAuth, requireSchoolAdmin, requireSchoolTeacher, requireSchoolRole } from '../middlewares/requireAuth.js';
import { getAdminProfileStats } from '../controllers/userController.js';
import { checkTeacherAccess } from '../controllers/teacherAccessController.js';
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

// School Admin Analytics Routes (Admin only)
router.get('/admin/analytics/student-adoption', requireAuth, requireSchoolAdmin, getStudentAdoption);
router.get('/admin/analytics/pillar-mastery', requireAuth, requireSchoolAdmin, getSchoolPillarMastery);
router.get('/admin/analytics/wellbeing-cases', requireAuth, requireSchoolAdmin, getWellbeingCases);
router.get('/admin/analytics/teacher-adoption', requireAuth, requireSchoolAdmin, getTeacherAdoption);
router.get('/admin/analytics/nep-alignment', requireAuth, requireSchoolAdmin, getNEPAlignment);

// Comprehensive School Admin Routes (Admin only)
router.get('/admin/campuses', requireAuth, requireSchoolAdmin, getOrganizationCampuses);
router.post('/admin/campuses', requireAuth, requireSchoolAdmin, addCampus);
router.get('/admin/kpis', requireAuth, requireSchoolAdmin, getComprehensiveKPIs);
router.get('/admin/heatmap', requireAuth, requireSchoolAdmin, getHeatmapData);
router.get('/admin/pending-approvals', requireAuth, requireSchoolAdmin, getPendingApprovals);
router.post('/admin/approve-reject', requireAuth, requireSchoolAdmin, approveOrRejectItem);
router.get('/admin/staff', requireAuth, requireSchoolAdmin, getAllStaff);
router.post('/admin/assign-teacher', requireAuth, requireSchoolAdmin, assignTeacherToClass);

// Template Management Routes (Admin only)
router.get('/admin/templates/export', requireAuth, requireSchoolAdmin, exportTemplates);
router.get('/admin/templates', requireAuth, requireSchoolAdmin, getTemplates);
router.post('/admin/templates', requireAuth, requireSchoolAdmin, createTemplate);
router.get('/admin/templates/:templateId', requireAuth, requireSchoolAdmin, getTemplateById);
router.put('/admin/templates/:templateId', requireAuth, requireSchoolAdmin, updateTemplate);
router.delete('/admin/templates/:templateId', requireAuth, requireSchoolAdmin, deleteTemplate);
router.post('/admin/templates/:templateId/approve', requireAuth, requireSchoolAdmin, approveTemplate);
router.post('/admin/templates/:templateId/reject', requireAuth, requireSchoolAdmin, rejectTemplate);

// Subscription & Billing Routes (Admin only)
router.get('/admin/subscription', requireAuth, requireSchoolAdmin, getSubscriptionDetails);
router.get('/admin/subscription/enhanced', requireAuth, requireSchoolAdmin, getEnhancedSubscriptionDetails);
router.post('/admin/subscription/upgrade', requireAuth, requireSchoolAdmin, upgradeSubscription);
router.post('/admin/subscription/renew', requireAuth, requireSchoolAdmin, renewSubscription);
router.get('/admin/subscription/plans', requireAuth, requireSchoolAdmin, getPlanComparison);
router.get('/admin/invoices/:invoiceId', requireAuth, requireSchoolAdmin, getInvoiceDetails);
router.put('/admin/subscription/payment-method', requireAuth, requireSchoolAdmin, updatePaymentMethod);

// Support & Trial Extension Routes (Admin only)
router.get('/admin/support/tickets', requireAuth, requireSchoolAdmin, getSupportTickets);

// Policy & Compliance Routes (Admin only)
router.get('/admin/compliance/dashboard', requireAuth, requireSchoolAdmin, getComplianceDashboard);
router.get('/admin/compliance/consents', requireAuth, requireSchoolAdmin, getConsentRecords);
router.post('/admin/compliance/consents', requireAuth, requireSchoolAdmin, createConsentRecord);
router.put('/admin/compliance/consents/:consentId/withdraw', requireAuth, requireSchoolAdmin, withdrawConsent);
router.get('/admin/compliance/policies', requireAuth, requireSchoolAdmin, getDataRetentionPolicies);
router.post('/admin/compliance/policies', requireAuth, requireSchoolAdmin, createDataRetentionPolicy);
router.put('/admin/compliance/policies/:policyId', requireAuth, requireSchoolAdmin, updateDataRetentionPolicy);
router.delete('/admin/compliance/policies/:policyId', requireAuth, requireSchoolAdmin, deleteDataRetentionPolicy);
router.post('/admin/compliance/policies/:policyId/enforce', requireAuth, requireSchoolAdmin, enforceDataRetention);
router.get('/admin/compliance/audit-logs', requireAuth, requireSchoolAdmin, getAuditLogs);
router.get('/admin/compliance/audit-logs/export', requireAuth, requireSchoolAdmin, exportAuditLogs);
router.get('/admin/compliance/user/:userId/consents', requireAuth, requireSchoolAdmin, getUserConsentStatus);
router.get('/admin/compliance/report', requireAuth, requireSchoolAdmin, generateComplianceReport);

// Enhanced Assignment Approval Routes (Admin only)
router.get('/admin/assignments/:assignmentId/preview', requireAuth, requireSchoolAdmin, getAssignmentPreview);
router.post('/admin/assignments/:assignmentId/approve', requireAuth, requireSchoolAdmin, approveAssignmentWithNotification);
router.post('/admin/assignments/:assignmentId/request-changes', requireAuth, requireSchoolAdmin, requestAssignmentChanges);
router.post('/admin/assignments/:assignmentId/reject', requireAuth, requireSchoolAdmin, rejectAssignment);

// Enhanced Template Management Routes (Admin only)
router.post('/admin/templates/upload', requireAuth, requireSchoolAdmin, uploadTemplateWithTags);
router.put('/admin/templates/:templateId/tags', requireAuth, requireSchoolAdmin, updateTemplateWithTags);

// Role Management Routes (Admin only)
router.get('/admin/roles', requireAuth, requireSchoolAdmin, getRolePermissions);
router.post('/admin/roles', requireAuth, requireSchoolAdmin, createCustomRole);
router.put('/admin/roles/:roleId', requireAuth, requireSchoolAdmin, updateRolePermissions);
router.post('/admin/users/create-with-role', requireAuth, requireSchoolAdmin, createUserWithRole);
router.put('/admin/users/:userId/assign-role', requireAuth, requireSchoolAdmin, assignRoleToUser);

// Escalation & Emergency Routes (Admin only)
router.get('/admin/escalation-chains', requireAuth, requireSchoolAdmin, getEscalationChains);
router.post('/admin/escalation-chains', requireAuth, requireSchoolAdmin, createEscalationChain);
router.put('/admin/escalation-chains/:chainId', requireAuth, requireSchoolAdmin, updateEscalationChain);
router.post('/admin/escalation/trigger', requireAuth, requireSchoolAdmin, triggerEscalation);
router.get('/admin/escalation/cases', requireAuth, requireSchoolAdmin, getEscalationCases);
router.put('/admin/escalation/cases/:caseId/resolve', requireAuth, requireSchoolAdmin, resolveEscalationCase);

// Helper Endpoints (Admin only)
router.get('/admin/profile-stats', requireAuth, requireSchoolAdmin, getAdminProfileStats);
router.get('/admin/organization-info', requireAuth, requireSchoolAdmin, getOrganizationInfo);
router.put('/admin/organization-info', requireAuth, requireSchoolAdmin, updateOrganizationInfo);
router.put('/admin/campuses/:campusId', requireAuth, requireSchoolAdmin, updateCampus);
router.delete('/admin/campuses/:campusId', requireAuth, requireSchoolAdmin, deleteCampus);
router.put('/admin/preferences', requireAuth, requireSchoolAdmin, updatePreferences);
router.get('/admin/recent-activity', requireAuth, requireSchoolAdmin, getRecentActivity);
router.get('/admin/top-performers', requireAuth, requireSchoolAdmin, getTopPerformers);
router.get('/admin/weekly-trend', requireAuth, requireSchoolAdmin, getWeeklyTrend);
router.get('/admin/analytics/performance-by-grade', requireAuth, requireSchoolAdmin, getPerformanceByGrade);
router.get('/admin/analytics/engagement-trend', requireAuth, requireSchoolAdmin, getEngagementTrend);
router.get('/admin/analytics/export', requireAuth, requireSchoolAdmin, exportAnalyticsReport);
router.get('/admin/classes', extractTenant, requireAuth, requireSchoolAdmin, getAllClasses);
router.get('/admin/students', extractTenant, requireAuth, requireSchoolAdmin, getStudentsWithFilters);
router.get('/admin/students/available', extractTenant, requireAuth, requireSchoolAdmin, getAvailableStudents);
router.post('/admin/students/create', extractTenant, requireAuth, requireSchoolAdmin, createStudent);
router.get('/admin/students/stats', extractTenant, requireAuth, requireSchoolAdmin, getAdminStudentStats);
router.get('/admin/students/export', extractTenant, requireAuth, requireSchoolAdmin, exportStudents);
router.post('/admin/students/sync-gender', extractTenant, requireAuth, requireSchoolAdmin, syncStudentGender);
router.get('/admin/students/:studentId', extractTenant, requireAuth, requireSchoolAdmin, getSchoolStudentDetails);
router.post('/admin/students/:studentId/reset-password', requireAuth, requireSchoolAdmin, resetStudentPassword);
router.delete('/admin/students/:studentId', requireAuth, requireSchoolAdmin, deleteStudent);
router.get('/admin/staff/stats', requireAuth, requireSchoolAdmin, getStaffStats);

// Teacher Management Routes (Admin only)
router.get('/admin/teachers', extractTenant, requireAuth, requireSchoolAdmin, getSchoolTeachers);
router.get('/admin/teachers/available', extractTenant, requireAuth, requireSchoolAdmin, getAvailableTeachers);
router.post('/admin/teachers/create', extractTenant, requireAuth, requireSchoolAdmin, createTeacher);
router.get('/admin/teachers/stats', requireAuth, requireSchoolAdmin, getAdminTeacherStats);
router.get('/admin/teachers/export', requireAuth, requireSchoolAdmin, exportTeachers);
router.get('/admin/teachers/:teacherId', requireAuth, requireSchoolAdmin, getTeacherDetailsById);
router.delete('/admin/teachers/:teacherId', requireAuth, requireSchoolAdmin, deleteTeacher);

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
router.get('/student/:studentId/parent', requireAuth, requireSchoolRole, getStudentParent);
router.get('/teacher/class-mastery', requireAuth, requireSchoolRole, getClassMasteryByPillar);
router.get('/teacher/students-at-risk', requireAuth, requireSchoolRole, getStudentsAtRisk);
router.get('/teacher/session-engagement', requireAuth, requireSchoolRole, getSessionEngagement);
router.get('/teacher/pending-tasks', requireAuth, requireSchoolRole, getPendingTasks);
router.get('/teacher/leaderboard', requireAuth, requireSchoolRole, getLeaderboard);
router.get('/teacher/class/:classId/students', requireAuth, requireSchoolRole, getClassStudents);
router.get('/teacher/messages', requireAuth, requireSchoolRole, getTeacherMessages);
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
router.put('/teacher/messages/:messageId/read', requireAuth, requireSchoolRole, markMessageAsRead);

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

export default router;