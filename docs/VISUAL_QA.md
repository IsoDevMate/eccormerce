# Visual QA — look at the pixels, not only the code

Code review alone is not enough for this store. Agents and humans must verify **rendered output**: layout, motion, transitions, sticky states, and first-viewport hierarchy.

## Rule

Before calling a PLP/PDP/nav change “done”:

1. Start the app (`npm run dev`).
2. Capture screenshots (Playwright smoke below).
3. Open the PNGs and judge: desire, friction, hierarchy — not “does the component exist.”
4. Compare against Blaize principles in `docs/BLAIZE_PRINCIPLES.md` (principles, not clones).

Local artifacts live under `.local/visual/` (gitignored).

## Playwright smoke

```bash
npm run visual:smoke
```

Writes desktop + mobile PNGs for `/`, `/shop/women`, and one PDP into `.local/visual/sable/`.

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
