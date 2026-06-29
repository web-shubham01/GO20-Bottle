// server.js — Go24 Flamingo Backend
// ─────────────────────────────────────────────
// Entry point. Wires middleware, routes, and
// static file serving into one Express app.
// ─────────────────────────────────────────────

require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const path    = require("path");

const { PORT, STATIC_DIR, NODE_ENV } = require("./config/constants");
const logger                          = require("./middleware/logger");
const { notFound, errorHandler }      = require("./middleware/errorHandler");
const healthRouter                    = require("./routes/health");
const pagesRouter                     = require("./routes/pages");
const apiRouter                       = require("./routes/api");

const app = express();

// ─── Security ────────────────────────────────
app.use(
  helmet({
    // Relax CSP so external CDNs (Tailwind, Google Fonts) load correctly
    contentSecurityPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────
app.use(cors());

// ─── Request Logging ─────────────────────────
app.use(logger);

// ─── Body Parsing ─────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Static Assets ────────────────────────────
// Serve the entire frontend folder (HTML, CSS, JS, images)
app.use(express.static(STATIC_DIR));

// ─── Routes ───────────────────────────────────
app.use("/api", healthRouter);          // GET  /api/health
app.use("/api", apiRouter);             // GET/POST/DELETE /api/products, /api/cart, /api/ai/recommend
app.use("/", pagesRouter);              // GET  /, /shop, /pdp, /concierge, /tech, /heritage, /thermal, /specs

// ─── Error Handling ───────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log("─".repeat(55));
  console.log("  🔥 GO24 FLAMINGO — Backend Server");
  console.log("─".repeat(55));
  console.log(`  Env       : ${NODE_ENV}`);
  console.log(`  Port      : ${PORT}`);
  console.log(`  Static    : ${STATIC_DIR}`);
  console.log("");
  console.log("  Page Routes:");
  console.log(`    GET  http://localhost:${PORT}/           → Home`);
  console.log(`    GET  http://localhost:${PORT}/shop       → Product Page`);
  console.log(`    GET  http://localhost:${PORT}/concierge  → AI Shopper`);
  console.log(`    GET  http://localhost:${PORT}/tech       → Tech Specs`);
  console.log(`    GET  http://localhost:${PORT}/heritage   → Heritage`);
  console.log("");
  console.log("  API Routes:");
  console.log(`    GET  http://localhost:${PORT}/api/health`);
  console.log(`    GET  http://localhost:${PORT}/api/products`);
  console.log(`    POST http://localhost:${PORT}/api/cart`);
  console.log(`    POST http://localhost:${PORT}/api/ai/recommend  ← AI STUB`);
  console.log("─".repeat(55));
});

module.exports = app; // for testing
