# Visual QA — look at the pixels, not only the code

Code review alone is not enough for this store. Agents and humans must verify **rendered output**: layout, motion, transitions, sticky states, broken media, and first-viewport hierarchy.

## Rule

Before calling a PLP/PDP/nav change “done”:

1. Start the app (`npm run dev`).
2. Capture screenshots (`npm run visual:smoke`).
3. Open the PNGs and judge: desire, friction, hierarchy — not “does the component exist.”
4. Compare against [`BLAIZE_PRINCIPLES.md`](./BLAIZE_PRINCIPLES.md) (principles, not clones).

Local artifacts live under `.local/visual/` (gitignored).

## Playwright smoke

```bash
# one-time browsers (if needed)
npx playwright install chromium

# if browsers land outside the default cache path:
# export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright

npm run visual:smoke
```

Writes desktop + mobile first-viewport PNGs for:

- `/` (Index)
- `/shop`
- `/shop/women`
- `/shop/men`
- `/product/long-slip-dress`

into `.local/visual/sable/`. Cookie banner is dismissed via `localStorage` so the fold stays readable.

### What smoke already caught once

- Featured “fashion” video was a **globe** animation → removed until real footage
- **19 Unsplash 404s** → broken cards / category thumbs
- PDP image mismatched the named garment

Re-run smoke after any catalog or PLP/PDP change.

## Blaize source video (local, not in repo)

```
/home/archlinux/Downloads/Yeezy vs Skims in web design - Blaze Smith (720p, h264).mp4
```

Extract frames for side-by-side review:

```bash
mkdir -p .local/visual/blaize
ffmpeg -y -i "/home/archlinux/Downloads/Yeezy vs Skims in web design - Blaze Smith (720p, h264).mp4" \
  -vf "fps=1/6" -q:v 3 .local/visual/blaize/frame-%03d.jpg
```

## Catalog image health

Quick check that every `u("photo-…")` in `src/data/catalog.ts` still returns an image:

```bash
node --input-type=module -e '
import { readFileSync } from "fs";
const t = readFileSync("src/data/catalog.ts","utf8");
const ids = [...new Set([...t.matchAll(/u\\("(photo-[^"]+)"\\)/g)].map(m=>m[1]))];
let bad = 0;
for (const id of ids) {
  const r = await fetch("https://images.unsplash.com/"+id+"?auto=format&fit=crop&w=80&q=30");
  if (!r.ok || !(r.headers.get("content-type")||"").includes("image")) {
    console.log("BAD", id, r.status); bad++;
  }
}
console.log("checked", ids.length, "bad", bad);
'
```
