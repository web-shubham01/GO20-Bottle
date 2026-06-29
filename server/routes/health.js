// routes/health.js
// ─────────────────────────────────────────────
// Health-check endpoint — used by load balancers,
// uptime monitors, and CI/CD pipelines.
// ─────────────────────────────────────────────

const { Router } = require("express");
const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "go24-flamingo-api",
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    node: process.version,
  });
});

module.exports = router;
