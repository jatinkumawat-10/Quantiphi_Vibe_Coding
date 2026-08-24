import apiClient from '../../../utils/apiClient.js';

/**
 * Subscription API Module
 * 
 * Handles all subscription-related API calls.
 * Updated with new features: notes, cost-splitting, free trial
 */

/**
 * Get all subscriptions for the current user
 * 
 * @returns {Promise<Array>} Subscriptions with server-side annotations
 */
export async function getSubscriptions() {
  const response = await apiClient.get('/subscriptions');
  return response.data.data;
}

/**
 * Create a new subscription
 * Updated with new fields: notes, cost-splitting, free trial
 * 
 * @param {Object} data - subscription data
 * @returns {Promise<Object>} Created subscription
 */
export async function createSubscription(data) {
  const response = await apiClient.post('/subscriptions', data);
  return response.data.data;
}

/**
 * Update a subscription (notes, cost-splitting, trial, etc.)
 * 
 * @param {string} id - Subscription ID
 * @param {Object} data - fields to update
 * @returns {Promise<Object>} Updated subscription
 */
export async function updateSubscription(id, data) {
  const response = await apiClient.patch(`/subscriptions/${id}`, data);
  return response.data.data;
}

/**
 * Toggle subscription status
 * 
 * @param {string} id - Subscription ID
 * @param {'ACTIVE'|'PAUSED'} status - New status
 * @returns {Promise<Object>} Updated subscription
 */
export async function toggleSubscriptionStatus(id, status) {
  const response = await apiClient.patch(`/subscriptions/${id}/status`, { status });
  return response.data.data;
}

/**
 * Get dashboard metrics
 * Updated with trialEndingCount
 * 
 * @returns {{ totalMonthlyBurnRate: number, upcomingRenewalsCount: number, trialEndingCount: number }}
 */
export async function getMetrics() {
  const response = await apiClient.get('/subscriptions/metrics');
  return response.data.data;
}
