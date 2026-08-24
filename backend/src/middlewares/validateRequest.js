/**
 * Request Validation Middleware Factory
 * 
 * Creates a middleware that validates request body/params/query against a Zod schema.
 * Returns 400 with validation details if validation fails.
 * 
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'params'|'query'} source - Which part of the request to validate
 * @returns {Function} Express middleware
 */
export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.format();
      const firstError = result.error.errors[0];

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: firstError?.message || 'Validation failed',
          details: formattedErrors._errors
            ? formattedErrors._errors
            : result.error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
              })),
        },
      });
    }

    // Attach parsed (and potentially transformed) data to the request
    req[source] = result.data;
    next();
  };
}
