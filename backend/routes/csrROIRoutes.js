import express from 'express';
import csrROIController from '../controllers/csrROIController.js';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';

const router = express.Router();

// All routes require authentication and CSR role
router.use(requireAuth);
router.use(requireCSR);

// Create a new ROI calculation
router.post('/', csrROIController.createROICalculation);

// Get all ROI calculations
router.get('/', csrROIController.getROICalculations);

// Get ROI summary (must be before /:calculationId to avoid matching "summary" as calculationId)
router.get('/summary', csrROIController.getROISummary);

// Get calculation by ID (parameterized route must come after static routes)
router.get('/:calculationId', csrROIController.getCalculationById);

// Update calculation
router.put('/:calculationId', csrROIController.updateCalculation);

// Delete calculation
router.delete('/:calculationId', csrROIController.deleteCalculation);

// Add note to calculation
router.post('/:calculationId/notes', csrROIController.addCalculationNote);

export default router;

