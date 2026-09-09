# Sable — premium store

Next.js 15 + TypeScript + Tailwind 4 store. UI-first build toward a hybrid performance/brand experience (Stüssy × Le Labo principles), with Turso/SQLite planned for persistence.

**Dev:** `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Where we are (2026-09-09)

### Done — UI / experience

| Area | Status |
|------|--------|
| Gender split entry (`/`) | Live — Women / Men, skip to full archive |
| PLP (`/shop`, `/shop/women`, `/shop/men`) | Live — 2/4 density, Worn/Studio toggle, subcategory rail, popular filters, color refine, editorial card in grid |
| PDP (`/product/[slug]`) | Live — color-matched ATC, solid size buttons, size guide + fit predictor, shipping estimator, sticky mobile bar |
| Bag drawer + checkout shell | Live — gift wrap, no express wallets on PDP |
| Delayed email capture (~8s) | Live — UI only; does not write to DB yet |
| Search (⌘K / header) | Live — client search over catalog |
| Design system | Paper/ink tokens, Instrument Serif + Geist, square corners |
| Catalog | 26 typed products in `src/data/catalog.ts` (Unsplash stand-ins) |

### Scaffolded — not wired

| Area | Status |
|------|--------|
| Turso / libSQL + Drizzle | Schema + client exist (`src/lib/db/*`). Catalog still in-memory TS. Newsletter action validates email but does not persist. |
| Auth / orders / payments | Not started |
| Real photography / CMS | Not started |
| Admin / merchandising | Not started |

### Explicitly out of scope so far

- Copying Skims/Yeezy/Stüssy layouts pixel-for-pixel
- Postgres (we use SQLite/Turso by design)
- Backend-first features before the shopping UI feels right

---

## Architecture (current)

```
src/
  app/                  # App Router pages + server actions
  components/
    plp/                # Product listing
    pdp/                # Product detail
    cart/               # Drawer
    site/               # Header, footer, search, email overlay
  data/catalog.ts       # Source of truth for products (for now)
  lib/
    cart-store.tsx      # Client cart (localStorage)
    catalog.ts          # Queries over catalog
    db/                 # Drizzle + Turso stub
    format.ts, cn.ts, env.ts
  types/product.ts
```

**Patterns borrowed from the Shamiri architecture notes:** App Router, server actions, Zod at boundaries, `lib/` singleton client, feature folders. Domain is commerce, not education.

**Philosophy brief (compressed):** brand world + conversion confidence. PLP/PDP as first landings. Model + studio imagery. Size/shipping on the purchase surface. Filters above the fold when the catalog needs them. Homepage (here: gender split) as a map, not a brochure.

---

## Test suites

**There are none yet.**

- No `*.test.ts` / `*.spec.ts`
- No Vitest, Jest, Playwright, or Testing Library in `package.json`
- Scripts today: `dev`, `build`, `start`, `lint` only
- Verification so far: TypeScript (`tsc --noEmit`), manual route HTTP checks, headless screenshots

### What tests would unlock next

| Layer | Why it matters for this store |
|-------|-------------------------------|
| Unit — `lib/catalog`, `format`, fit predictor, filters | Protects PLP/PDP logic as the catalog grows |
| Component — size guide, ATC color, density/Worn toggles | Locks the conversion patterns we care about |
| E2E — split → PLP → PDP → bag → checkout | Proves the journey we optimized for |
| Contract — newsletter / future Turso writes | Safe to wire persistence without guessing |

Recommended stack when we add them: **Vitest** (unit) + **Playwright** (e2e), aligned with how DigitalHub was tested.

---

## How to run

```bash
npm install
npm run dev
```

Optional env (see `.env.example`):

```
TURSO_DATABASE_URL=file:./.data/sable.db
TURSO_AUTH_TOKEN=
```

---

## Sensible next steps (when you resume)

1. Add Vitest + a few catalog/filter unit tests, then Playwright for the happy path.
2. Persist newsletter + catalog via Turso.
3. Replace Unsplash with real product media.
4. Harden checkout (still a local shell).

Stop here until you pick the next slice.
