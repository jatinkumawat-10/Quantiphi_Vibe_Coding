import * as subscriptionRepository from './subscription.repository.js';
import { normalizeToMonthly, calculateTotalMonthlyBurnRate } from '../../utils/costNormalizer.js';
import { annotateWithRenewalInfo, countUpcomingRenewals } from '../../utils/dateCalculator.js';
import logger from '../../utils/logger.js';

/**
 * Create a new subscription for a user
 * 
 * @param {string} userId
 * @param {Object} data - { serviceName, cost, billingCycle, nextRenewalDate }
 * @returns {Promise<Object>}
 */
export async function createSubscription(userId, data) {
  const subscription = await subscriptionRepository.createSubscription(userId, data);
  logger.info({ userId, subscriptionId: subscription.id }, 'Subscription created');
  return subscription;
}

/**
 * Get all subscriptions for a user with server-side annotations
 * 
 * Each subscription is annotated with:
 * - normalizedMonthlyCost: the monthly-equivalent cost
 * - daysRemaining: days until next renewal
 * - isRenewingSoon: boolean flag for renewing within 7 days
 * 
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getSubscriptions(userId) {
  const subscriptions = await subscriptionRepository.getSubscriptionsByUserId(userId);

  // Annotate each subscription with computed fields
  const annotated = subscriptions.map((sub) => {
    const normalizedMonthlyCost = normalizeToMonthly(sub.cost, sub.billingCycle);
    const { daysRemaining, isRenewingSoon } = calculateRenewalInfoFromDate(sub.nextRenewalDate);

    return {
      ...sub,
      normalizedMonthlyCost: Math.round(normalizedMonthlyCost * 100) / 100,
      daysRemaining,
      isRenewingSoon,
    };
  });

  return annotated;
}

/**
 * Toggle subscription status (ACTIVE/PAUSED)
 * 
 * Verifies ownership before updating.
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @param {'ACTIVE'|'PAUSED'} status
 * @returns {Promise<Object>}
 */
export async function toggleSubscriptionStatus(subscriptionId, userId, status) {
  // Verify ownership
  const existing = await subscriptionRepository.getSubscriptionByIdAndUserId(subscriptionId, userId);

  if (!existing) {
    const error = new Error('Subscription not found');
    error.isOperational = true;
    error.statusCode = 404;
    error.code = 'SUBSCRIPTION_NOT_FOUND';
    throw error;
  }

  await subscriptionRepository.updateSubscriptionStatus(subscriptionId, userId, status);
  logger.info({ userId, subscriptionId, newStatus: status }, 'Subscription status toggled');

  return {
    ...existing,
    status,
  };
}

/**
 * Get dashboard metrics for a user
 * 
 * Returns:
 * - totalMonthlyBurnRate: sum of normalized monthly costs (ACTIVE only)
 * - upcomingRenewalsCount: count of subscriptions renewing within 7 days (all statuses)
 * 
 * @param {string} userId
 * @returns {Promise<{totalMonthlyBurnRate: number, upcomingRenewalsCount: number}>}
 */
export async function getMetrics(userId) {
  // Get all subscriptions for renewal count
  const allSubscriptions = await subscriptionRepository.getSubscriptionsByUserId(userId);

  // Get active subscriptions for burn rate
  const activeSubscriptions = allSubscriptions.filter((sub) => sub.status === 'ACTIVE');

  const totalMonthlyBurnRate = calculateTotalMonthlyBurnRate(activeSubscriptions);
  const upcomingRenewalsCount = countUpcomingRenewals(allSubscriptions);

  return {
    totalMonthlyBurnRate,
    upcomingRenewalsCount,
  };
}

// Helper: Calculate renewal info from a date
function calculateRenewalInfoFromDate(nextRenewalDate) {
  const renewalDate = new Date(nextRenewalDate);
  const currentDate = new Date();

  // Reset time portions to compare dates only
  const renewalDateOnly = new Date(
    renewalDate.getFullYear(),
    renewalDate.getMonth(),
    renewalDate.getDate()
  );
  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const diffTime = renewalDateOnly.getTime() - currentDateOnly.getTime();
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const isRenewingSoon = daysRemaining >= 0 && daysRemaining <= 7;

  return { daysRemaining, isRenewingSoon };
}
