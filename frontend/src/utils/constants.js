/**
 * Application Constants
 * 
 * Centralized constants for the frontend application.
 */

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  SUBSCRIPTIONS: {
    BASE: '/subscriptions',
    METRICS: '/subscriptions/metrics',
    STATUS: (id) => `/subscriptions/${id}/status`,
  },
};

// Billing cycle options
export const BILLING_CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

// Subscription status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
};

// Renewal alert threshold (days)
export const RENEWAL_ALERT_DAYS = 7;

// Form validation
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
  },
  SERVICE_NAME: {
    MAX_LENGTH: 100,
  },
  COST: {
    MIN: 0.01,
    MAX: 99999999.99,
  },
};
