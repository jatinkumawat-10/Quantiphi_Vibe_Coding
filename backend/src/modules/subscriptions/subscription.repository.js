import prisma from '../../config/db.js';

/**
 * Create a new subscription
 * 
 * @param {string} userId
 * @param {Object} data - { serviceName, cost, billingCycle, nextRenewalDate }
 * @returns {Promise<Object>}
 */
export async function createSubscription(userId, data) {
  return prisma.subscription.create({
    data: {
      userId,
      serviceName: data.serviceName,
      cost: data.cost,
      billingCycle: data.billingCycle,
      nextRenewalDate: new Date(data.nextRenewalDate),
    },
  });
}

/**
 * Get all subscriptions for a user
 * 
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getSubscriptionsByUserId(userId) {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextRenewalDate: 'asc' },
  });
}

/**
 * Get a single subscription by ID and user ID (for ownership verification)
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export async function getSubscriptionByIdAndUserId(subscriptionId, userId) {
  return prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId,
    },
  });
}

/**
 * Update subscription status
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @param {'ACTIVE'|'PAUSED'} status
 * @returns {Promise<Object>}
 */
export async function updateSubscriptionStatus(subscriptionId, userId, status) {
  return prisma.subscription.updateMany({
    where: {
      id: subscriptionId,
      userId,
    },
    data: { status },
  });
}

/**
 * Get active subscriptions for a user (for burn rate calculation)
 * 
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getActiveSubscriptionsByUserId(userId) {
  return prisma.subscription.findMany({
    where: {
      userId,
      status: 'ACTIVE',
    },
  });
}

/**
 * Delete a subscription (reserved for future phase / admin use)
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function deleteSubscription(subscriptionId, userId) {
  return prisma.subscription.deleteMany({
    where: {
      id: subscriptionId,
      userId,
    },
  });
}
