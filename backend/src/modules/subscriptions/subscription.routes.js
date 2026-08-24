import { Router } from 'express';
import { create, getAll, update, updateStatus, getMetrics, remove } from './subscription.controller.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createSubscriptionSchema, updateSubscriptionSchema, updateStatusSchema } from './subscription.validation.js';

const router = Router();

// All subscription routes require authentication
router.use(authenticateToken);

// GET /api/subscriptions/metrics - must be before /:id routes
router.get('/metrics', getMetrics);

// GET /api/subscriptions - list all subscriptions
router.get('/', getAll);

// POST /api/subscriptions - create a new subscription
router.post('/', validateRequest(createSubscriptionSchema), create);

// PATCH /api/subscriptions/:id/status - toggle status
router.patch('/:id/status', validateRequest(updateStatusSchema), updateStatus);

// PATCH /api/subscriptions/:id - update subscription (notes, cost-splitting, trial)
router.patch('/:id', validateRequest(updateSubscriptionSchema), update);

// DELETE /api/subscriptions/:id - reserved for future phase
router.delete('/:id', remove);

export default router;
