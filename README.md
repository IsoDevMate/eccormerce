# Sable — premium store

Next.js 15 + TypeScript + Tailwind 4. Small-catalogue house: **the grid is the store**.

**Live:** [eccormerce-alpha.vercel.app](https://eccormerce-alpha.vercel.app/) · **Repo:** [IsoDevMate/eccormerce](https://github.com/IsoDevMate/eccormerce)

**Dev:** `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Information architecture (Blaize / Yeezy small-store rule)

| Route | Job |
|-------|-----|
| `/` | **Product grid** — All / Women / Men tabs, zero splash before clothes |
| `/shop` | Redirects to `/` (config + page) |
| `/shop/women` · `/shop/men` | Gendered PLPs (ads/email land here) |
| `/shop/new` | New arrivals |
| `/shop/archive` | Full / line-filtered archive |
| `/product/[slug]` | PDP |
| `/thank-you` | Order confirmation |
| `/privacy` · `/terms` | Legal |
| `/robots.txt` · `/sitemap.xml` | SEO |

Nav: **New → Shop → Women → Men**.

Principles (not brand clones): [`docs/BLAIZE_PRINCIPLES.md`](docs/BLAIZE_PRINCIPLES.md)

---

## Visual QA (required)

Do **not** ship UI changes from code-only review. Capture and look at screenshots:

```bash
npm run visual:smoke
```

Details: [`docs/VISUAL_QA.md`](docs/VISUAL_QA.md). Artifacts go to `.local/visual/` (gitignored).

---

## Ship-ready checklist

- Custom 404, per-route titles + descriptions, OG image, favicon icon
- robots.txt + sitemap.xml
- Cookie banner + consent-gated Vercel Analytics
- Privacy + Terms with real London address (18 Great Portland Street, W1W 8QP)
- Thank-you page (checkout validates; no `alert`)
- Loading states, form error states
- Sticky mobile ATC on PDP
- Featured PLP video on index-0 products (`public/media/`)
- Badge discipline: 1 Best Seller, 1 New, 1 Limited
- Unique Unsplash IDs per image slot (q=70 + Next Image AVIF/WebP)

Still stand-in photography — a real shoot replaces Unsplash before a serious launch.

---

## Stack

- Catalog: `src/data/catalog.ts`
- Cart: `src/lib/cart-store.tsx` (localStorage)
- DB stub: `src/lib/db/` (Turso not wired)

Env: see `.env.example` (`NEXT_PUBLIC_SITE_URL`, Turso).
