# Go24 Flamingo — Design System (DESIGN.md)

## Brand Identity
| Token | Value |
|-------|-------|
| Brand Name | GO24 FLAMINGO |
| Tagline | Engineered for the Extremes |
| Aesthetic | Dark brutalist / sci-fi premium |
| Typography | Anton (display/headlines) · Hanken Grotesk (body) · Geist (labels/UI) |

## Colour Palette (Dark Mode First)
| Name | Hex | Usage |
|------|-----|-------|
| `background` / `surface` | `#131313` | Page background |
| `primary` | `#a5e7ff` | Accent / CTA highlight |
| `primary-container` | `#00d2ff` | Button fills |
| `secondary-fixed` | `#52ffac` | Neon green accent, stats |
| `on-surface` | `#e5e2e1` | Body text |
| `on-surface-variant` | `#bbc9cf` | Muted text |
| `outline-variant` | `#3c494e` | Dividers, borders |
| `surface-container` | `#20201f` | Card backgrounds |
| `surface-container-high` | `#2a2a2a` | Elevated cards |
| `surface-container-highest` | `#353535` | Highest elevation |
| `error` | `#ffb4ab` | Error states |

## Spacing
| Token | Value |
|-------|-------|
| `margin-mobile` | 20px |
| `margin-desktop` | 64px |
| `gutter` | 24px |
| `section-gap` | 120px |
| `container-max` | 1440px |

## Typography Scale
| Token | Size / Leading | Font |
|-------|----------------|------|
| `display-lg` | 120px / 110px | Anton |
| `headline-xl` | 72px / 72px | Anton |
| `headline-lg` | 48px / 52px | Anton |
| `headline-xl-mobile` | 48px / 48px | Anton |
| `body-lg` | 18px / 28px | Hanken Grotesk |
| `body-md` | 16px / 24px | Hanken Grotesk |
| `label-md` | 14px / 20px · 0.1em tracking | Geist |
| `label-sm` | 12px / 16px · 0.05em tracking | Geist |

## Border Radius
| Token | Value |
|-------|-------|
| `DEFAULT` | 0.5rem |
| `lg` | 1rem |
| `xl` | 1.5rem |
| `full` | 9999px |

## Component Patterns
### Glass Panel
```css
background: rgba(26, 26, 26, 0.7);
backdrop-filter: blur(24px);
border-top: 1px solid rgba(165, 231, 255, 0.2);
border-left: 1px solid rgba(165, 231, 255, 0.2);
box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
```

### Kinetic Button (Primary CTA)
```css
background: #a5e7ff;
color: #001f28;
transition: all 0.3s ease;
/* Hover */
box-shadow: 0 0 20px #52ffac;
transform: translateY(-2px);
```

### Scanning Line Animation
```css
@keyframes scan {
  0%, 100% { top: 0; }
  50% { top: 100%; }
}
```

## Page Map
| URL | File | Purpose |
|-----|------|---------|
| `/` | `index.html` | Storefront homepage |
| `/shop` | `pdp.html` | Product Detail Page |
| `/concierge` | `concierge.html` | AI Shopper |
| `/tech` | `tech.html` | Technical Specifications |
| `/heritage` | `heritage.html` | Brand Heritage |
| `/thermal` | `thermal.html` | Thermal Technology |
| `/specs` | `specs.html` | Full Specifications |

## Product: GO24 Flamingo
- **Material**: SS 304 Surgical-grade Stainless Steel
- **Insulation**: Tri-Ply Vacuum (Copper-plated core)
- **Heat Retention**: 24 hours
- **Cold Retention**: 48 hours
- **Carrier**: Hand-crafted Jute (Zero-waste, ISI Certified)
- **Sizes**: 350 / 500 / 750 / 1000 / 1500 ML
- **Finishes**: Deep Black · Alpine Silver · Sea Green · Royal Purple (Premium)

## AI Shopper Integration Points
- `POST /api/ai/recommend` — stubbed in `server/routes/api.js`
- `concierge.html` — frontend shell ready for chat UI
- Feed context: product catalogue from `GET /api/products`
