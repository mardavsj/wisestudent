import express from 'express';
import csrAlertController from '../controllers/csrAlertController.js';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';

const router = express.Router();

// All routes require authentication and CSR role
router.use(requireAuth);
router.use(requireCSR);

// Create a new alert rule
router.post('/rules', csrAlertController.createAlertRule);

// Get all alert rules
router.get('/rules', csrAlertController.getAlertRules);

// Update alert rule
router.put('/rules/:ruleId', csrAlertController.updateAlertRule);

// Delete alert rule
router.delete('/rules/:ruleId', csrAlertController.deleteAlertRule);

// Get unread alerts count (must be before / to avoid matching "unread" as a parameter)
router.get('/unread/count', csrAlertController.getUnreadAlertsCount);

// Get all alerts (generic route must come after specific routes)
router.get('/', csrAlertController.getAlerts);

// Acknowledge alert
router.post('/:alertId/acknowledge', csrAlertController.acknowledgeAlert);

// Resolve alert
router.post('/:alertId/resolve', csrAlertController.resolveAlert);

// Dismiss alert
router.post('/:alertId/dismiss', csrAlertController.dismissAlert);

export default router;

