import * as subscriptionService from './subscription.service.js';

/**
 * POST /api/subscriptions
 * Create a new subscription
 */
export async function create(req, res, next) {
  try {
    const subscription = await subscriptionService.createSubscription(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/subscriptions
 * Get all subscriptions for the logged-in user (annotated)
 */
export async function getAll(req, res, next) {
  try {
    const subscriptions = await subscriptionService.getSubscriptions(req.user.id);

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/subscriptions/:id/status
 * Toggle subscription status (ACTIVE/PAUSED)
 */
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await subscriptionService.toggleSubscriptionStatus(
      id,
      req.user.id,
      status
    );

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/subscriptions/metrics
 * Get dashboard metrics (burn rate + upcoming renewals)
 */
export async function getMetrics(req, res, next) {
  try {
    const metrics = await subscriptionService.getMetrics(req.user.id);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/subscriptions/:id
 * Delete a subscription (reserved for future phase)
 */
export async function remove(req, res, next) {
  try {
    // Not implemented in Phase 1
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Delete functionality is reserved for a future phase.',
      },
    });
  } catch (error) {
    next(error);
  }
}
