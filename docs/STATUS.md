# Status

Last docs update: 2026-09-14. Branch: `main`.

## Shipped

- Grid-first entry: `/` is the archive; `/shop` → `/`; Women / Men as tabs + deep links
- Ship-ready surface: 404, meta, OG, favicon, robots, sitemap, privacy, terms, thank-you, cookie + analytics
- Checkout validation + thank-you (no `alert`)
- PDP: swatch-themed ATC, size guide / fit predictor, sticky mobile ATC, shipping honesty
- PLP: quieter text filters (categories, sort, worn/studio, colour) after visual QA
- Catalog: unique Unsplash slots; 19 dead IDs replaced; placeholder globe videos removed
- Agent tooling: `npm run visual:smoke`, Blaize principles + visual QA docs

## Open (do not pretend these are done)

1. **Real photography** — Unsplash still mismatches garments/colours; luxury signal is content, not CSS
2. **Featured PLP video** — re-enable only with real Sable MP4s in `public/media/`
3. **Turso / payments / tests** — DB stub only; checkout is demo; no Vitest/Playwright test suite yet
4. **Brand hierarchy pass** — further reduce chrome vs Yeezy-level sparsity if product desire still lags

## How agents should work

1. Change UI → `npm run visual:smoke` → **look at PNGs**
2. Check Unsplash URLs if grid shows broken images
3. Do not add features to compensate for weak photos
4. Prefer removing UI over decorating placeholders
