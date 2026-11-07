/**
 * Global Error Handling Middleware for Cyclops AI
 *
 * Ensures all server errors conform to the API contract:
 * {
 *   "success": false,
 *   "error": {
 *     "code": "string",
 *     "message": "string"
 *   }
 * }
 * Never leaks stack traces, tokens, or raw authorization headers.
 */

export function errorHandler(err, req, res, next) {
  // Handle invalid JSON body in incoming requests
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body.'
      }
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || (statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR');
  const userMessage = err.message || 'An unexpected server error occurred. Please try again.';

  // Safe logging without credentials or sensitive request body
  console.error(`[Error] [${errorCode}] ${req.method} ${req.path} -> ${statusCode}: ${userMessage}`);

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: userMessage
    }
  });
}

/**
 * 404 Route Not Found Handler
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} not found.`
    }
  });
}

