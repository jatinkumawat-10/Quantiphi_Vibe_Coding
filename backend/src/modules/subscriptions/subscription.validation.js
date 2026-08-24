import { z } from 'zod';

/**
 * Create subscription validation schema
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
});

/**
 * Update subscription status validation schema
 */
export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED'], {
    errorMap: () => ({ message: 'Status must be ACTIVE or PAUSED' }),
  }),
});
