import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import subscriptionRoutes from '../modules/subscriptions/subscription.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export default router;
