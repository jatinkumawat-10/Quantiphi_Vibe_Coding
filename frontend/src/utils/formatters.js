import { format, formatDistanceToNow, isToday, isTomorrow, differenceInDays } from 'date-fns';

/**
 * Format currency amount
 * 
 * @param {number} amount
 * @param {string} currency - default 'USD'
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for display
 * 
 * @param {string|Date} date
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Get human-readable renewal text
 * 
 * @param {string|Date} renewalDate
 * @returns {string} e.g., "Today", "Tomorrow", "in 3 days"
 */
export function getRenewalText(renewalDate) {
  const date = new Date(renewalDate);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const days = differenceInDays(date, new Date());
  if (days <= 7) return `in ${days} days`;
  
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format billing cycle for display
 * 
 * @param {string} cycle - 'MONTHLY' or 'YEARLY'
 * @returns {string} 'Monthly' or 'Yearly'
 */
export function formatBillingCycle(cycle) {
  return cycle.charAt(0) + cycle.slice(1).toLowerCase();
}
