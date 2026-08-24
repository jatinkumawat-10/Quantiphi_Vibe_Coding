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

/**
 * Feature 4: Free Trial Tracker
 * 
 * Computes trial status for a subscription.
 * 
 * Returns:
 * - isTrial: boolean - whether this is a trial subscription
 * - isTrialActive: boolean - whether trial is currently active
 * - isTrialEndingSoon: boolean - trial ending within reminder window
 * - daysUntilTrialEnd: number - days until trial ends
 * - message: string - status message
 * 
 * @param {boolean} isTrial - Whether subscription is in trial
 * @param {Date|string|null} trialEndDate - When trial ends
 * @param {number} reminderDays - Days before trial end to show reminder
 * @returns {Object} Trial status info
 */
export function calculateTrialStatus(isTrial, trialEndDate, reminderDays = 3) {
  if (!isTrial || !trialEndDate) {
    return {
      isTrial: false,
      isTrialActive: false,
      isTrialEndingSoon: false,
      daysUntilTrialEnd: null,
      message: '',
    };
  }

  const endDate = new Date(trialEndDate);
  const currentDate = new Date();

  // Reset time portions to compare dates only
  const endDateOnly = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const diffTime = endDateOnly.getTime() - currentDateOnly.getTime();
  const daysUntilTrialEnd = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Trial is active if end date is in the future or today
  const isTrialActive = daysUntilTrialEnd >= 0;

  // Trial is ending soon if within reminder window
  const isTrialEndingSoon = daysUntilTrialEnd >= 0 && daysUntilTrialEnd <= reminderDays;

  let message = '';
  if (isTrialEndingSoon) {
    message = daysUntilTrialEnd === 0
      ? 'Trial ends today!'
      : `Trial ends in ${daysUntilTrialEnd} day${daysUntilTrialEnd === 1 ? '' : 's'}`;
  } else if (isTrialActive) {
    message = `Free trial active (${daysUntilTrialEnd} days left)`;
  } else {
    message = 'Trial ended';
  }

  return {
    isTrial: true,
    isTrialActive,
    isTrialEndingSoon,
    daysUntilTrialEnd,
    message,
  };
}
