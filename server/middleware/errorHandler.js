// middleware/errorHandler.js
// ─────────────────────────────────────────────
// Global Express error handler
// ─────────────────────────────────────────────

const { NODE_ENV } = require("../config/constants");

/**
 * 404 Not Found — catch-all for unknown routes
 */
function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

/**
 * Global error responder
 * In production, hides stack trace from client.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  console.error(`[ERROR] ${statusCode} — ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      ...(NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}

module.exports = { notFound, errorHandler };
