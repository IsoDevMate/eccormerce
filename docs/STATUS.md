# Status

Last docs update: 2026-09-14. Branch: `main`.

## Shipped

- **Index-first entry:** `/` is the sparse product-code lookbook; `/shop` is the full commerce grid; `/lookbook` → `/`
- Women / Men deep links + Index gender tabs (All / Women / Men)
- Ship-ready surface: 404, meta, OG, favicon, robots, sitemap, privacy, terms, thank-you, cookie + analytics
- Checkout validation + thank-you (no `alert`)
- PDP: swatch-themed ATC, size guide / fit predictor, sticky mobile ATC, shipping honesty
- PLP: chip filters (sort / category / color / size), hover crossfade + swatch preview + quick add + wishlist + quick view
- Catalog: unique Unsplash slots; 19 dead IDs replaced; placeholder globe videos removed
- Agent tooling: `npm run visual:smoke`, Blaize principles + visual QA docs

## Open (do not pretend these are done)

1. **Real photography** — Unsplash still mismatches garments/colours; luxury signal is content, not CSS
2. **Featured PLP video** — re-enable only with real Sable MP4s in `public/media/`
3. **Turso / payments / tests** — DB stub only; checkout is demo; no Vitest/Playwright test suite yet
4. **Shared element transitions** (collection ↔ PDP) — CSS continuity is in place; true shared-layout needs View Transitions API or a motion lib when photos are real

## Interaction system (2026-09-14)

Rebuilt commerce interactions (not decoration):

- Index: codes-only 6-col grid (Yeezy-style sparsity)
- Shop PLP: gap-based editorial grid, hover image crossfade, swatch-hover colorway swap, Quick Add bar, wishlist, quick-view drawer
- Bag: animated drawer + bag-count flash on add
- PDP: SKIMS-like buy stack, hatched OOS sizes, color-matched ATC, model-sizing toggle
- Motion: CSS-only tokens in `globals.css` (transform + opacity, ~300ms)

## How agents should work

1. Change UI → `npm run visual:smoke` → **look at PNGs**
2. Check Unsplash URLs if grid shows broken images
3. Do not add features to compensate for weak photos
4. Prefer removing UI over decorating placeholders
