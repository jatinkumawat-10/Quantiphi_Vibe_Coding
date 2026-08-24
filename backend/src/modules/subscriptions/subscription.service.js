import * as subscriptionRepository from './subscription.repository.js';
import { normalizeToMonthly, calculateTotalMonthlyBurnRate, calculateBillingNudge } from '../../utils/costNormalizer.js';
import { annotateWithRenewalInfo, countUpcomingRenewals, calculateTrialStatus } from '../../utils/dateCalculator.js';
import logger from '../../utils/logger.js';

/**
 * Create a new subscription for a user
 * Updated with new fields: notes, cost-splitting, free trial
 * 
 * @param {string} userId
 * @param {Object} data - subscription data
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
 * - billingNudge: suggestion to switch billing cycle (Feature 1)
 * - trialStatus: trial status info (Feature 4)
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
    const billingNudge = calculateBillingNudge(sub.cost, sub.billingCycle);
    const trialStatus = calculateTrialStatus(sub.isTrial, sub.trialEndDate, sub.trialReminderDays);

    return {
      ...sub,
      normalizedMonthlyCost: Math.round(normalizedMonthlyCost * 100) / 100,
      daysRemaining,
      isRenewingSoon,
      billingNudge,
      trialStatus,
    };
  });

  return annotated;
}

/**
 * Update subscription (general update)
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @param {Object} data - fields to update
 * @returns {Promise<Object>}
 */
export async function updateSubscription(subscriptionId, userId, data) {
  // Verify ownership
  const existing = await subscriptionRepository.getSubscriptionByIdAndUserId(subscriptionId, userId);

  if (!existing) {
    const error = new Error('Subscription not found');
    error.isOperational = true;
    error.statusCode = 404;
    error.code = 'SUBSCRIPTION_NOT_FOUND';
    throw error;
  }

  await subscriptionRepository.updateSubscription(subscriptionId, userId, data);
  logger.info({ userId, subscriptionId, fields: Object.keys(data) }, 'Subscription updated');

  return {
    ...existing,
    ...data,
  };
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
 * - trialEndingCount: count of trials ending soon (Feature 4)
 * 
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function getMetrics(userId) {
  // Get all subscriptions for renewal count and trial count
  const allSubscriptions = await subscriptionRepository.getSubscriptionsByUserId(userId);

  // Get active subscriptions for burn rate
  const activeSubscriptions = allSubscriptions.filter((sub) => sub.status === 'ACTIVE');

  const totalMonthlyBurnRate = calculateTotalMonthlyBurnRate(activeSubscriptions);
  const upcomingRenewalsCount = countUpcomingRenewals(allSubscriptions);

  // Feature 4: Count trials ending soon
  const trialEndingCount = allSubscriptions.filter((sub) => {
    const trialStatus = calculateTrialStatus(sub.isTrial, sub.trialEndDate, sub.trialReminderDays);
    return trialStatus.isTrialEndingSoon;
  }).length;

  return {
    totalMonthlyBurnRate,
    upcomingRenewalsCount,
    trialEndingCount,
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
