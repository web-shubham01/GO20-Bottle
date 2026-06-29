# Go24 Flamingo — Backend Server

## Stack
- **Runtime**: Node.js v24
- **Framework**: Express.js
- **Middleware**: Helmet (security), Morgan (logging), CORS
- **Serving**: Static HTML/CSS/JS from the parent `../` directory

## Project Structure

```
server/
├── server.js            # App entry point
├── package.json         # Dependencies
├── .env.example         # Environment variable template
├── routes/
│   ├── pages.js         # HTML page routes (Home, Shop, Concierge, Tech, Heritage)
│   ├── api.js           # REST API routes (products, cart stub, AI hook)
│   └── health.js        # Health-check endpoint
├── middleware/
│   ├── logger.js        # Request logger setup
│   └── errorHandler.js  # Global error handler
├── config/
│   └── constants.js     # App-wide constants (port, paths, product data)
└── README.md            # This file
```

## Routes

### Page Routes (GET)
| Route | Serves |
|-------|--------|
| `/` or `/home` | `index.html` — Storefront homepage |
| `/shop` or `/pdp` | `pdp.html` — Product Detail Page |
| `/concierge` | `concierge.html` — AI Shopper (stub ready) |
| `/tech` | `tech.html` — Technical Specifications |
| `/heritage` | `heritage.html` — Brand Heritage |

### API Routes (JSON)
| Route | Description |
|-------|-------------|
| `GET /api/health` | Server health check |
| `GET /api/products` | Product catalogue (stub data) |
| `GET /api/products/:id` | Single product detail |
| `POST /api/cart` | Add item to cart session |
| `POST /api/ai/recommend` | **AI hook (stub)** — ready for agent integration |

## Quick Start

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server starts on `http://localhost:4000`

## AI Agent Integration (Next Step)
The `/api/ai/recommend` route is stubbed and ready. Wire in your LLM/RAG layer here — the request/response contract is already defined.
