// config/constants.js
// ─────────────────────────────────────────────
// App-wide constants and product stub data
// ─────────────────────────────────────────────

const path = require("path");

const STATIC_DIR = path.resolve(__dirname, "../../");

const PORT = parseInt(process.env.PORT || "4000", 10);

const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Product Catalogue Stub ───────────────────
const PRODUCTS = [
  {
    id: "go24-flamingo-v1",
    name: "GO24 Flamingo Flask",
    tagline: "Engineered for the Extremes",
    description:
      "The Go24 Flamingo is a masterpiece of thermal dynamics. SS 304 surgical-grade steel core, Tri-Ply Vacuum insulation, and a hand-crafted jute carrier — built for performance and sustainability.",
    price: {
      base: 89.0,
      currency: "USD",
      variants: {
        "350ML": { base: 79.0, premium: 89.0 },
        "500ML": { base: 89.0, premium: 99.0 },
        "750ML": { base: 99.0, premium: 109.0 },
        "1000ML": { base: 109.0, premium: 119.0 },
        "1500ML": { base: 129.0, premium: 139.0 },
      },
    },
    finishes: [
      { id: "deep-black",    name: "Deep Black",    hex: "#131313", image: "images/real_world_drops.png" },
      { id: "alpine-silver", name: "Alpine Silver",  hex: "#e5e2e1", image: "images/dark_jute_and_bottle.png" },
      { id: "sea-green",     name: "Sea Green",      hex: "#00ffa3", image: "images/indian_climate_spill.png" },
      { id: "royal-purple",  name: "Royal Purple",   hex: "#800080", image: "images/indian_climate_spill.png", premium: true },
    ],
    specs: {
      material:    "SS 304 Grade Stainless Steel",
      insulation:  "Tri-Ply Vacuum",
      heatRetain:  "24 hours",
      coldRetain:  "48 hours",
      finish:      "Powder Coated Matte",
      polymers:    "BPA-Free Polypropylene",
      carrier:     "Hand-crafted Jute (Zero-waste)",
      certification: "ISI Certified",
    },
    inStock: true,
  },
];

module.exports = { STATIC_DIR, PORT, NODE_ENV, PRODUCTS };
