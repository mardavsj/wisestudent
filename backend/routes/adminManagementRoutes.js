import express from 'express';
import {
  getAdminPanel,
  getAdminAnalytics,
  getAllStudents,
  getAdminRedemptions,
  getAllRedemptions,
  getAdminStatsPanel,
  getAdminUsersPanel,
  getAdminSettings,
  updateAdminSettings,
  updateRedemptionStatus,
  toggleUserStatus,
  updateRedemption,
  getUsersStats,
  getRedemptionsStats,
  getAnalyticsData,
  getStatsData,
  createUserWithPlan
} from '../controllers/adminManagementController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Panel & Dashboard
router.get('/panel', getAdminPanel);

// Analytics
router.get('/analytics', getAdminAnalytics);

// Students Management
router.get('/students', getAllStudents);

// Redemptions Management
router.get('/redemptions', getAdminRedemptions);
router.get('/all-redemptions', getAllRedemptions);
router.put('/redemptions/:id/approve', updateRedemptionStatus);
router.put('/redemptions/:id/reject', updateRedemptionStatus);
router.put('/redemptions/:id', updateRedemption);

// Statistics
router.get('/stats', getAdminStatsPanel);

// Users Management
router.get('/users', getAdminUsersPanel);
router.get('/users/stats', getUsersStats);
router.put('/users/:id/status', toggleUserStatus);

// Settings
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

// Stats endpoints
router.get('/redemptions/stats', getRedemptionsStats);
router.get('/all-redemptions/stats', getRedemptionsStats);

// Create user with subscription plan (bypassing payment) - For testing
router.post('/users/create-with-plan', createUserWithPlan);

export default router;

