// routes/pages.js
// ─────────────────────────────────────────────
// HTML Page Routes — serves the frontend pages
// Each route maps a clean URL to an HTML file
// ─────────────────────────────────────────────

const { Router } = require("express");
const path = require("path");
const { STATIC_DIR } = require("../config/constants");

const router = Router();

// Helper: send an HTML file from the static dir
const sendPage = (filename) => (req, res) => {
  res.sendFile(path.join(STATIC_DIR, filename));
};

// ─── Page Routes ─────────────────────────────

/**
 * GET / → Storefront Homepage
 */
router.get(["/", "/home"], sendPage("index.html"));

/**
 * GET /shop → Product Detail Page (PDP)
 * Also accessible at /pdp (legacy alias)
 */
router.get(["/shop", "/pdp"], sendPage("pdp.html"));

/**
 * GET /concierge → AI Shopper Interface
 * Stub page — AI logic wired in separately
 */
router.get("/concierge", sendPage("concierge.html"));

/**
 * GET /tech → Technical Specifications
 */
router.get("/tech", sendPage("tech.html"));

/**
 * GET /heritage → Brand Heritage & Story
 */
router.get("/heritage", sendPage("heritage.html"));

/**
 * GET /thermal → Thermal Technology Page
 */
router.get("/thermal", sendPage("thermal.html"));

/**
 * GET /specs → Full Specifications (alternate)
 */
router.get("/specs", sendPage("specs.html"));

module.exports = router;
