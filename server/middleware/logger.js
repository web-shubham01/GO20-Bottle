// middleware/logger.js
// ─────────────────────────────────────────────
// HTTP request logger using Morgan
// ─────────────────────────────────────────────

const morgan = require("morgan");
const { NODE_ENV } = require("../config/constants");

// Use concise "dev" format in development, combined Apache log in production
const logger = morgan(NODE_ENV === "production" ? "combined" : "dev");

module.exports = logger;
