import prisma from '../../config/db.js';

/**
 * Create a new subscription
 * Updated with new fields: notes, cost-splitting, free trial
 * 
 * @param {string} userId
 * @param {Object} data - subscription data
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
      // Feature 2: Notes
      notes: data.notes || null,
      // Feature 3: Cost-splitting
      isShared: data.isShared || false,
      splitCount: data.splitCount || 1,
      splitNote: data.splitNote || null,
      // Feature 4: Free trial tracker
      isTrial: data.isTrial || false,
      trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
      trialReminderDays: data.trialReminderDays || 3,
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
 * Update subscription (general update with all fields)
 * 
 * @param {string} subscriptionId
 * @param {string} userId
 * @param {Object} data - fields to update
 * @returns {Promise<Object>}
 */
export async function updateSubscription(subscriptionId, userId, data) {
  const updateData = {};

  // Only include fields that are defined
  if (data.serviceName !== undefined) updateData.serviceName = data.serviceName;
  if (data.cost !== undefined) updateData.cost = data.cost;
  if (data.billingCycle !== undefined) updateData.billingCycle = data.billingCycle;
  if (data.nextRenewalDate !== undefined) updateData.nextRenewalDate = new Date(data.nextRenewalDate);
  if (data.notes !== undefined) updateData.notes = data.notes || null;
  if (data.isShared !== undefined) updateData.isShared = data.isShared;
  if (data.splitCount !== undefined) updateData.splitCount = data.splitCount;
  if (data.splitNote !== undefined) updateData.splitNote = data.splitNote || null;
  if (data.isTrial !== undefined) updateData.isTrial = data.isTrial;
  if (data.trialEndDate !== undefined) updateData.trialEndDate = data.trialEndDate ? new Date(data.trialEndDate) : null;
  if (data.trialReminderDays !== undefined) updateData.trialReminderDays = data.trialReminderDays;

  return prisma.subscription.updateMany({
    where: {
      id: subscriptionId,
      userId,
    },
    data: updateData,
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
