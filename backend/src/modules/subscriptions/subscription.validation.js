import { z } from 'zod';

/**
 * Create subscription validation schema
 * Updated with new fields: notes, cost-splitting, free trial
 */
export const createSubscriptionSchema = z.object({
  serviceName: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name must be at most 100 characters')
    .trim(),
  cost: z
    .number()
    .positive('Cost must be greater than 0')
    .max(99999999.99, 'Cost is too large'),
  billingCycle: z.enum(['MONTHLY', 'YEARLY'], {
    errorMap: () => ({ message: 'Billing cycle must be MONTHLY or YEARLY' }),
  }),
  nextRenewalDate: z
    .string()
    .or(z.date())
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format'),
  // Feature 2: Notes (optional)
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .nullable(),
  // Feature 3: Cost-splitting (optional)
  isShared: z.boolean().optional().default(false),
  splitCount: z
    .number()
    .int()
    .min(1, 'Split count must be at least 1')
    .max(100, 'Split count must be at most 100')
    .optional()
    .default(1),
  splitNote: z
    .string()
    .max(255, 'Split note must be at most 255 characters')
    .optional()
    .nullable(),
  // Feature 4: Free trial tracker (optional)
  isTrial: z.boolean().optional().default(false),
  trialEndDate: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid trial end date format'),
  trialReminderDays: z
    .number()
    .int()
    .min(1, 'Trial reminder days must be at least 1')
    .max(30, 'Trial reminder days must be at most 30')
    .optional()
    .default(3),
});

/**
 * Update subscription validation schema (for general updates)
 */
export const updateSubscriptionSchema = z.object({
  serviceName: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name must be at most 100 characters')
    .trim()
    .optional(),
  cost: z
    .number()
    .positive('Cost must be greater than 0')
    .max(99999999.99, 'Cost is too large')
    .optional(),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']).optional(),
  nextRenewalDate: z
    .string()
    .or(z.date())
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format'),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .nullable(),
  isShared: z.boolean().optional(),
  splitCount: z
    .number()
    .int()
    .min(1, 'Split count must be at least 1')
    .max(100, 'Split count must be at most 100')
    .optional(),
  splitNote: z
    .string()
    .max(255, 'Split note must be at most 255 characters')
    .optional()
    .nullable(),
  isTrial: z.boolean().optional(),
  trialEndDate: z
    .string()
    .or(z.date())
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid trial end date format'),
  trialReminderDays: z
    .number()
    .int()
    .min(1, 'Trial reminder days must be at least 1')
    .max(30, 'Trial reminder days must be at most 30')
    .optional(),
});

/**
 * Update subscription status validation schema
 */
export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED'], {
    errorMap: () => ({ message: 'Status must be ACTIVE or PAUSED' }),
  }),
});
