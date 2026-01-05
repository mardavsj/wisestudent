import express from 'express';
import csrOverviewController from '../controllers/csrOverviewController.js';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';

const router = express.Router();

// Enable authentication and authorization
router.use(requireAuth);
router.use(requireCSR);

// Get comprehensive overview data
router.get('/data', csrOverviewController.getOverviewData);

// Get real-time metrics
router.get('/realtime', csrOverviewController.getRealTimeMetrics);

// Get impact data by region
router.get('/impact/region/:region', csrOverviewController.getImpactByRegion);

// Get module progress data
router.get('/modules', csrOverviewController.getModuleProgress);

// Get regional data
router.get('/regional', csrOverviewController.getRegionalData);

// Get skills development data
router.get('/skills', csrOverviewController.getSkillsDevelopment);

// Get recent activity
router.get('/activity', csrOverviewController.getRecentActivity);

// Get live statistics
router.get('/live-stats', csrOverviewController.getLiveStats);

export default router;
