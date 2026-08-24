/**
 * Cost Uniformity Engine
 * 
 * Normalizes any subscription cost to a monthly-equivalent value.
 * - MONTHLY → cost
 * - YEARLY → cost / 12
 * 
 * This is a pure function with no side effects — easily unit-testable.
 * The original cost/billingCycle as entered by the user is preserved in the DB;
 * this normalized value is used only for aggregate metrics.
 * 
 * @param {number|string} cost - The subscription cost
 * @param {'MONTHLY'|'YEARLY'} billingCycle - The billing cycle
 * @returns {number} The monthly-equivalent cost
 */
export function normalizeToMonthly(cost, billingCycle) {
  const numericCost = Number(cost);

  if (isNaN(numericCost) || numericCost <= 0) {
    throw new Error('Cost must be a positive number');
  }

  if (billingCycle === 'MONTHLY') {
    return numericCost;
  }

  if (billingCycle === 'YEARLY') {
    return numericCost / 12;
  }

  throw new Error(`Invalid billing cycle: ${billingCycle}`);
}

/**
 * Sums normalized monthly costs for an array of subscriptions.
 * Only includes ACTIVE subscriptions for burn-rate calculation.
 * 
 * @param {Array<{cost: number|string, billingCycle: string, status: string}>} subscriptions
 * @returns {number} Total monthly burn rate
 */
export function calculateTotalMonthlyBurnRate(subscriptions) {
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'ACTIVE');

  const total = activeSubscriptions.reduce((sum, sub) => {
    return sum + normalizeToMonthly(sub.cost, sub.billingCycle);
  }, 0);

  // Round to 2 decimal places to avoid floating-point precision issues
  return Math.round(total * 100) / 100;
}
