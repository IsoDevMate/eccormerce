# Sable — premium store

Next.js 15 + TypeScript + Tailwind 4. Small-catalogue house: **Index first, shop one click away**.

**Live:** [eccormerce-alpha.vercel.app](https://eccormerce-alpha.vercel.app/) · **Repo:** [IsoDevMate/eccormerce](https://github.com/IsoDevMate/eccormerce)

**Dev:** `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Docs

| Doc | What |
|-----|------|
| [`docs/BLAIZE_PRINCIPLES.md`](docs/BLAIZE_PRINCIPLES.md) | Commercial principles from Blaize / Yeezy–Skims breakdown (not brand clones) |
| [`docs/VISUAL_QA.md`](docs/VISUAL_QA.md) | Playwright screenshots + frame extract — **required before calling UI done** |
| [`docs/STATUS.md`](docs/STATUS.md) | What’s shipped, what’s still open |

---

## Information architecture

| Route | Job |
|-------|-----|
| `/` | **Index** — codes-only lookbook (All / Women / Men). Desire before chrome |
| `/lookbook` | Redirects to `/` |
| `/shop` | Full commerce grid — names, prices, filters, quick add |
| `/shop/women` · `/shop/men` | Gendered PLPs (ads/email land here) |
| `/shop/new` | New arrivals |
| `/shop/archive` | Full / line-filtered archive |
| `/product/[slug]` | PDP |
| `/thank-you` | Order confirmation |
| `/privacy` · `/terms` | Legal |
| `/robots.txt` · `/sitemap.xml` | SEO |

Nav: **Index → Shop → New → Women → Men**.

---

## Visual QA (required)

Do **not** ship UI changes from code-only review:

```bash
npm run dev          # terminal 1
npm run visual:smoke # first-viewport PNGs → .local/visual/sable/
npm run visual:qa    # interaction asserts → .local/visual/qa/
```

Open the PNGs **and** confirm `visual:qa` prints all PASS. Judge desire, hierarchy, broken media, and whether hover/modals actually fire — not “does the component exist.”

Details: [`docs/VISUAL_QA.md`](docs/VISUAL_QA.md).

---

## Ship-ready checklist

- Custom 404, per-route titles + descriptions, OG image, favicon
- robots.txt + sitemap.xml
- Cookie banner + consent-gated Vercel Analytics
- Privacy + Terms with real London address (18 Great Portland Street, W1W 8QP)
- Thank-you page (checkout validates; no `alert`)
- Loading states, form error states, sticky mobile ATC
- Quiet PLP filters (text chips — sort / category / color / size)
- SENSE-style mailing list modal (split panel, 8s delay) + waitlist/notify for OOS / coming soon
- Badge discipline: 1 Best Seller, 1 New, 1 Limited
- Catalog images: unique Unsplash IDs, dead URLs replaced after Playwright smoke
- Featured PLP video **only when real garment footage exists** (globe placeholders removed)

Still stand-in photography — a real shoot replaces Unsplash before a serious launch.

---

## Stack

- Catalog: `src/data/catalog.ts`
- Cart: `src/lib/cart-store.tsx` (localStorage)
- Wishlist: `src/lib/wishlist-store.tsx` (localStorage)
- DB stub: `src/lib/db/` (Turso not wired)
- Visual smoke: `scripts/visual-smoke.mjs`

Env: see `.env.example` (`NEXT_PUBLIC_SITE_URL`, Turso).
