import express from 'express';
import csrGoalController from '../controllers/csrGoalController.js';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';

const router = express.Router();

// All routes require authentication and CSR role
router.use(requireAuth);
router.use(requireCSR);

// Create a new goal
router.post('/', csrGoalController.createGoal);

// Get all goals
router.get('/', csrGoalController.getGoals);

// Get goal progress summary (must be before /:goalId to avoid matching "progress" as goalId)
router.get('/progress', csrGoalController.getGoalProgress);

// Get goal by ID (parameterized route must come after static routes)
router.get('/:goalId', csrGoalController.getGoalById);

// Update goal
router.put('/:goalId', csrGoalController.updateGoal);

// Delete goal
router.delete('/:goalId', csrGoalController.deleteGoal);

// Add note to goal
router.post('/:goalId/notes', csrGoalController.addGoalNote);

export default router;

