import express from 'express';
import csrComplianceController from '../controllers/csrComplianceController.js';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';

const router = express.Router();

// All routes require authentication and CSR role
router.use(requireAuth);
router.use(requireCSR);

// Create a new compliance event
router.post('/', csrComplianceController.createComplianceEvent);

// Get all compliance events
router.get('/', csrComplianceController.getComplianceEvents);

// Get upcoming events (next 30 days)
router.get('/upcoming', csrComplianceController.getUpcomingEvents);

// Get overdue events
router.get('/overdue', csrComplianceController.getOverdueEvents);

// Get calendar view
router.get('/calendar', csrComplianceController.getCalendarView);

// Get event by ID
router.get('/:eventId', csrComplianceController.getEventById);

// Update event
router.put('/:eventId', csrComplianceController.updateEvent);

// Delete event
router.delete('/:eventId', csrComplianceController.deleteEvent);

// Add note to event
router.post('/:eventId/notes', csrComplianceController.addEventNote);

export default router;

