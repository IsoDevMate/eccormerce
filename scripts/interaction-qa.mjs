/**
 * Interaction QA — assert Index/Shop/New/PDP/modals behave as required.
 * Requires: npm run dev on BASE_URL (default http://localhost:3000)
 * Writes screenshots + report to .local/visual/qa/ (gitignored)
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = join(process.cwd(), ".local/visual/qa");
mkdirSync(out, { recursive: true });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.addInitScript(() => {
  localStorage.setItem("sable-cookie-consent", "rejected");
  localStorage.setItem("sable-email-dismissed", "1");
});

// Index
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
check("Index codes grid", (await page.locator("ul li .micro").count()) >= 10);
check("Index gender tabs", (await page.getByRole("button", { name: "Women" }).count()) >= 1);
check(
  "Nav Index → /",
  (await page.locator("header a", { hasText: "INDEX" }).getAttribute("href")) === "/",
);
await page.screenshot({ path: join(out, "01-index.png") });

await page.goto(`${base}/lookbook`, { waitUntil: "networkidle" });
check("/lookbook → Index", page.url().replace(/\/$/, "") === base.replace(/\/$/, "") || page.url() === `${base}/`);

// Shop + hover
await page.goto(`${base}/shop`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
check("Shop cards", (await page.locator("article.group").count()) >= 8);
check("Sort chip", (await page.getByRole("button", { name: /Sort/i }).count()) >= 1);

const card = page.locator("article.group").first();
await card.hover();
await page.waitForTimeout(400);
check("Hover Quick Add", await card.getByRole("button", { name: /Quick add/i }).isVisible());
check("Hover wishlist", await card.locator('button[aria-label*="wishlist"]').isVisible());
check("Hover quick view", await card.locator('button[aria-label*="Quick view"]').isVisible());
const opacities = await card.locator(".media-frame img").evaluateAll((nodes) =>
  nodes.map((n) => Number(getComputedStyle(n).opacity)),
);
check(
  "Hover crossfade",
  opacities.length >= 2 &&
    opacities.some((o) => o > 0.85) &&
    opacities.some((o) => o < 0.15),
  JSON.stringify(opacities),
);
await page.screenshot({ path: join(out, "03-shop-hover.png") });

const swatches = card.locator("button[aria-label^='Preview']");
if ((await swatches.count()) >= 2) {
  const imgs = card.locator(".media-frame img");
  const before = await imgs.first().getAttribute("src");
  await swatches.nth(1).hover();
  await page.waitForTimeout(350);
  const after = await imgs.first().getAttribute("src");
  check("Swatch hover swaps image", before !== after);
} else {
  check("Swatch hover swaps image", false, "need 2+ swatches");
}

await card.locator('button[aria-label*="Quick view"]').click();
await page.waitForTimeout(400);
check(
  "Quick view opens",
  (await page.locator('[role="dialog"]').filter({ hasText: /Full details|Select a size|Quick view/i }).count()) >= 1,
);
await page.screenshot({ path: join(out, "05-quick-view.png") });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// New
await page.goto(`${base}/shop/new`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
check("New grid ≥8", (await page.locator("article.group").count()) >= 8);
await page.screenshot({ path: join(out, "06-new.png") });

// PDP
await page.goto(`${base}/product/long-slip-dress`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
check("PDP Select a size", (await page.getByRole("button", { name: /Select a size/i }).count()) >= 1);
check("PDP Size guide", (await page.getByRole("button", { name: /Size guide/i }).count()) >= 1);
check("PDP Model sizing", (await page.getByRole("button", { name: /Model sizing/i }).count()) >= 1);
check(
  "PDP accordions",
  (await page.locator("summary", { hasText: /Details/i }).count()) >= 1 &&
    (await page.locator("summary", { hasText: /Fit/i }).count()) >= 1 &&
    (await page.locator("summary", { hasText: /Shipping/i }).count()) >= 1,
);
await page.screenshot({ path: join(out, "07-pdp.png") });

// Waitlist / notify
let notifyOk = false;
await page.goto(`${base}/shop`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const soon = page.locator("article.group").filter({ hasText: /Soon/i }).first();
if (await soon.count()) {
  await soon.hover();
  await page.waitForTimeout(350);
  const notify = soon.getByRole("button", { name: /Notify me/i });
  if (await notify.isVisible()) {
    await notify.click();
    await page.waitForTimeout(400);
    notifyOk =
      (await page.getByRole("heading", { name: /Notify me at drop|Join the waitlist/i }).count()) >= 1;
    check("Waitlist has image", (await page.locator(".fixed img").count()) >= 1);
    await page.screenshot({ path: join(out, "08-waitlist.png") });
    await page.keyboard.press("Escape");
  }
}
check("Waitlist/Notify modal", notifyOk);

// Mailing modal (~8s)
const mailPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mailPage.addInitScript(() => {
  localStorage.setItem("sable-cookie-consent", "rejected");
  localStorage.removeItem("sable-email-dismissed");
});
await mailPage.goto(`${base}/shop`, { waitUntil: "networkidle" });
await mailPage.waitForTimeout(8500);
check(
  "Mailing modal after 8s",
  await mailPage.getByRole("heading", { name: /Join our mailing list/i }).isVisible(),
);
check("Mailing Submit", (await mailPage.getByRole("button", { name: /^Submit$/i }).count()) >= 1);
check("Mailing No thanks", (await mailPage.getByText(/No, thanks/i }).count()) >= 1);
const split = await mailPage
  .locator("form")
  .filter({ hasText: /Submit/i })
  .evaluate((form) => {
    const panel = form.parentElement;
    return Boolean(panel?.className.includes("grid"));
  })
  .catch(() => false);
check("Mailing split grid", split);
await mailPage.screenshot({ path: join(out, "09-mailing-modal.png") });
await mailPage.close();

await browser.close();

const failed = results.filter((r) => !r.ok);
writeFileSync(join(out, "report.json"), JSON.stringify({ results, failed: failed.length }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  failed.forEach((f) => console.log("FAIL", f.name, f.detail));
  process.exit(1);
}
