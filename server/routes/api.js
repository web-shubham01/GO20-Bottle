// routes/api.js
// ─────────────────────────────────────────────
// REST API Routes
//   - Product catalogue
//   - Cart session stubs
//   - AI agent hook (stub — ready for integration)
// ─────────────────────────────────────────────

const { Router } = require("express");
const { PRODUCTS } = require("../config/constants");

const { GoogleGenAI, Type, Schema } = require("@google/genai");

const router = Router();

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

// ─── In-memory cart store (per-session stub) ──
// Replace with Redis / DB in production
const cartStore = new Map();

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

/**
 * GET /api/products
 * Returns the full product catalogue
 */
router.get("/products", (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

/**
 * GET /api/products/:id
 * Returns a single product by ID
 */
router.get("/products/:id", (req, res, next) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    const err = new Error(`Product '${req.params.id}' not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ success: true, data: product });
});

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────

/**
 * GET /api/cart
 * Returns the current session cart
 */
router.get("/cart", (req, res) => {
  const sessionId = req.headers["x-session-id"] || "anonymous";
  const cart = cartStore.get(sessionId) || [];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ success: true, sessionId, items: cart, subtotal: subtotal.toFixed(2) });
});

/**
 * POST /api/cart
 * Add or update an item in the cart
 * Body: { productId, finishId, capacity, qty, price }
 */
router.post("/cart", (req, res) => {
  const sessionId = req.headers["x-session-id"] || "anonymous";
  const { productId, finishId, capacity, qty = 1, price } = req.body;

  if (!productId || !price) {
    return res.status(400).json({ success: false, error: "productId and price are required" });
  }

  const cart = cartStore.get(sessionId) || [];
  const existingIdx = cart.findIndex(
    (i) => i.productId === productId && i.finishId === finishId && i.capacity === capacity
  );

  if (existingIdx >= 0) {
    cart[existingIdx].qty += qty;
  } else {
    cart.push({ productId, finishId, capacity, qty, price: parseFloat(price) });
  }

  cartStore.set(sessionId, cart);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ success: true, sessionId, items: cart, subtotal: subtotal.toFixed(2) });
});

/**
 * DELETE /api/cart
 * Clears the cart for the session
 */
router.delete("/cart", (req, res) => {
  const sessionId = req.headers["x-session-id"] || "anonymous";
  cartStore.delete(sessionId);
  res.json({ success: true, message: "Cart cleared", sessionId });
});

// ─────────────────────────────────────────────
// AI AGENT HOOK (STUB)
// ─────────────────────────────────────────────

/**
 * POST /api/ai/recommend
 * AI product recommendation endpoint — stub ready for agent integration.
 *
 * Request body:
 *   { query: string, context?: object }
 *
 * Response contract (to be fulfilled by AI agent):
 *   { success: true, recommendation: { product, finish, reasoning } }
 *
 * Wire in your LLM/RAG layer here (OpenAI, Gemini, LangChain, etc.)
 */
router.post("/ai/recommend", async (req, res) => {
  const { query, context } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: "query is required" });
  }

  try {
    const systemInstruction = `You are the AI Personal Shopper for Go24 Flamingo Stainless Steel Flask.
Product Knowledge:
- Tri-Ply Vacuum Technology (TPVT) - thick aluminum layer between two SS 304 steel walls.
- Dual-functional lid (flip/sipper + outer Cup Cap). Includes Jute Bag.
- 100% BPA-Free.
- Do NOT recommend for carbonated drinks/sodas.
- Recommend pre-conditioning for 2 mins with hot/cold water for max thermal retention.
- Hand wash only (no wire scrubbers, store with lid open).

Recommendation Matrix (CRITICAL):
- Kids, school, short commutes -> 350ML (SKU: PXP 1006 CMBK).
- Gym, office, daily work -> 500ML (SKU: PXP 1006 BRBL).
- Short treks, day travel -> 750ML
- Heavy sports, field use -> 1000ML (SKU: PXP 1006 DMBL).
- Group picnics, road trips, massive capacity -> 1500ML

Parse the user's lifestyle need, match it to the exact capacity size from the matrix, output the specific SKU if available, and generate a 2-sentence conversational sales pitch explaining why that specific flask is perfect for them.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    capacity: { type: Type.STRING, description: "e.g., '350ML', '500ML', '750ML', '1000ML', '1500ML'" },
                    sku: { type: Type.STRING, description: "The specific SKU from the matrix if applicable" },
                    pitch: { type: Type.STRING, description: "A 2-sentence conversational sales pitch" }
                },
                required: ["capacity", "sku", "pitch"]
            }
        }
    });

    const aiData = JSON.parse(response.text);
    
    // Fallbacks
    let normalizedCap = aiData.capacity.toUpperCase().replace(" ", "");
    if (!["350ML", "500ML", "750ML", "1000ML", "1500ML"].includes(normalizedCap)) {
        normalizedCap = "500ML";
    }

    res.json({
      success: true,
      query,
      recommendation: {
        product: PRODUCTS[0],
        capacity: normalizedCap,
        sku: aiData.sku || "",
        reasoning: aiData.pitch,
        finish: PRODUCTS[0].finishes[0] // Default color finish
      },
    });

  } catch (error) {
    console.error("[AI Error]", error);
    res.status(500).json({ success: false, error: "Failed to generate AI recommendation" });
  }
});

module.exports = router;
