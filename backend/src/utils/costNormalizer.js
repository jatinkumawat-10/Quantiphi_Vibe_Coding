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

/**
 * Feature 1: Annual vs Monthly Nudge
 * 
 * Flags subscriptions where switching billing cycle would save money.
 * 
 * Logic:
 * - For MONTHLY subscriptions: Estimate yearly cost = cost × 12
 *   If yearly cost > current yearly cost, suggest switching
 * - For YEARLY subscriptions: Already on yearly, no nudge needed
 *   (but we can show potential savings if they were monthly)
 * 
 * Returns a nudge object with suggestion and potential savings.
 * 
 * @param {number|string} cost - The subscription cost
 * @param {'MONTHLY'|'YEARLY'} billingCycle - The billing cycle
 * @returns {{ shouldNudge: boolean, suggestedCycle: string, monthlySavings: number, yearlySavings: number, message: string }}
 */
export function calculateBillingNudge(cost, billingCycle) {
  const numericCost = Number(cost);

  if (isNaN(numericCost) || numericCost <= 0) {
    return {
      shouldNudge: false,
      suggestedCycle: billingCycle,
      monthlySavings: 0,
      yearlySavings: 0,
      message: '',
    };
  }

  // If already on yearly, no nudge needed
  if (billingCycle === 'YEARLY') {
    return {
      shouldNudge: false,
      suggestedCycle: 'YEARLY',
      monthlySavings: 0,
      yearlySavings: 0,
      message: '',
    };
  }

  // For MONTHLY subscriptions:
  // Calculate what yearly would cost: cost × 12
  const estimatedYearlyCost = numericCost * 12;
  
  // Typical yearly discount is 15-20% (we use 17% as average)
  // This means if you pay monthly, you're effectively paying more
  const estimatedDiscountedYearly = estimatedYearlyCost * 0.83; // 17% discount
  const yearlySavings = estimatedYearlyCost - estimatedDiscountedYearly;
  const monthlySavings = yearlySavings / 12;

  // Only nudge if savings are meaningful (at least $1/month)
  const shouldNudge = monthlySavings >= 1;

  return {
    shouldNudge,
    suggestedCycle: 'YEARLY',
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    yearlySavings: Math.round(yearlySavings * 100) / 100,
    message: shouldNudge
      ? `Save $${Math.round(yearlySavings * 100) / 100}/year by switching to yearly billing`
      : '',
  };
}
