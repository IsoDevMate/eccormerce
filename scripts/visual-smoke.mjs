/**
 * Capture first-viewport screenshots for visual QA.
 * Requires: npm i -D playwright && npx playwright install chromium
 * Dev server on BASE_URL (default http://localhost:3000).
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = join(process.cwd(), ".local/visual/sable");
mkdirSync(out, { recursive: true });

const routes = [
  { path: "/", name: "home" },
  { path: "/shop/women", name: "women" },
  { path: "/shop/men", name: "men" },
  { path: "/product/long-slip-dress", name: "pdp-slip" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });
  for (const route of routes) {
    await page.goto(base + route.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const file = join(out, `${route.name}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file);
  }
  await page.close();
}
await browser.close();
