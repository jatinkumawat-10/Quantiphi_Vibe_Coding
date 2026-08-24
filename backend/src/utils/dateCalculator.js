/**
 * Date Intersect Calculator
 * 
 * Computes daysRemaining for each subscription and flags isRenewingSoon.
 * 
 * isRenewingSoon = daysRemaining >= 0 && daysRemaining <= 7
 * 
 * This is a pure function with no side effects — easily unit-testable.
 * 
 * @param {Date|string} nextRenewalDate - The next renewal date
 * @returns {{ daysRemaining: number, isRenewingSoon: boolean }}
 */
export function calculateRenewalInfo(nextRenewalDate) {
  const renewalDate = new Date(nextRenewalDate);
  const currentDate = new Date();

  // Reset time portions to compare dates only (not datetime)
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

  // Calculate difference in whole days
  const diffTime = renewalDateOnly.getTime() - currentDateOnly.getTime();
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isRenewingSoon = daysRemaining >= 0 && daysRemaining <= 7;

  return { daysRemaining, isRenewingSoon };
}

/**
 * Annotates an array of subscriptions with renewal info.
 * 
 * @param {Array<{nextRenewalDate: Date|string}>} subscriptions
 * @returns {Array<{nextRenewalDate: Date|string, daysRemaining: number, isRenewingSoon: boolean}>}
 */
export function annotateWithRenewalInfo(subscriptions) {
  return subscriptions.map((sub) => {
    const { daysRemaining, isRenewingSoon } = calculateRenewalInfo(sub.nextRenewalDate);
    return {
      ...sub,
      daysRemaining,
      isRenewingSoon,
    };
  });
}

/**
 * Counts subscriptions renewing within the next 7 days (inclusive).
 * 
 * @param {Array<{nextRenewalDate: Date|string}>} subscriptions
 * @returns {number}
 */
export function countUpcomingRenewals(subscriptions) {
  return subscriptions.filter((sub) => {
    const { isRenewingSoon } = calculateRenewalInfo(sub.nextRenewalDate);
    return isRenewingSoon;
  }).length;
}
