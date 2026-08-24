import logger from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Centralized Error Handler Middleware
 * 
 * Catches all unhandled errors and returns a sanitized response.
 * Full stack traces are only logged server-side (never sent to client).
 */
export function errorHandler(err, req, res, _next) {
  // Log the full error with stack trace
  logger.error({
    err,
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
  });

  // Determine if this is a known application error
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: {
        code: err.code || 'APPLICATION_ERROR',
        message: err.message,
      },
    });
  }

  // Handle Prisma-specific errors
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: `A record with this ${field} already exists.`,
      },
    });
  }

  if (err.code === 'P2025') {
    // Record not found
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      },
    });
  }

  // For unexpected errors, return a generic message in production
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
}
