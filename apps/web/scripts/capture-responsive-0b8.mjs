import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Historical local, signed-out evidence only. Start the exact recorded build
// before use; this script cannot independently verify the server's build SHA.
// It overwrites the output directory's existing evidence.
const base = "http://127.0.0.1:3109";
const output = path.resolve("../../docs/evidence/responsive-local/0b8c924");
const source = "0b8c924efbe0ce4af4873614b2364a0be9ed3a1f";
const routes = [
  ["home", "/en"],
  ["login", "/en/login"],
  ["editor", "/app/tools/room-reimagination"],
  ["gallery", "/app/renders"],
];
const widths = [390, 768, 1280, 1440, 1920, 2560];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const captures = [];
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    const page = await context.newPage();
    await page.route("https://**/*", (route) => route.abort());
    for (const [name, route] of routes) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      if (response?.status() !== 200) throw new Error(`${route}: HTTP ${response?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      // Full-page captures include content below the viewport; request lazy
      // images first so the screenshot does not mistake unloaded tiles for UI.
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        for (const image of images) image.loading = "eager";
        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      });
      const metrics = await page.evaluate(() => ({ viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, title: document.title, unresolvedImages: Array.from(document.images).filter((image) => !image.naturalWidth).length }));
      if (metrics.documentWidth > width) throw new Error(`${route} overflows at ${width}px`);
      const filename = `${name}-${width}.jpg`;
      await page.screenshot({ path: path.join(output, filename), fullPage: true, type: "jpeg", quality: 65 });
      captures.push({ route, width, height: 900, filename, status: response.status(), ...metrics });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(path.join(output, "checks.json"), JSON.stringify({ source, environment: "Local Next.js production build; signed out; Edge headless; 1x CSS pixels; reduced motion; HTTPS requests blocked", limitations: "No actual device, browser zoom, authenticated assets, screen reader or approved Figma comparison. Consent and newsletter overlays suppressed for stable capture; separate fixture tests cover their sampled behavior.", captures }, null, 2) + "\n");
const rows = routes.map(([name, route]) => `| ${route} | ${widths.map((width) => `[${width}](${name}-${width}.jpg)`).join(" · ")} |`).join("\n");
await writeFile(path.join(output, "README.md"), `# Local responsive capture matrix\n\nSource: \`${source}\`. A local Next.js production build was captured signed out in headless Microsoft Edge, 1 CSS pixel per device pixel, 900px viewport height, reduced motion and blocked HTTPS requests. All 24 captures returned HTTP 200 with no horizontal document overflow. See [checks.json](checks.json).\n\n| Route | Viewport width in CSS pixels |\n|---|---|\n${rows}\n\nThese captures do not establish actual device or browser-zoom behavior, authenticated saved-render behavior, screen-reader use or exact Figma parity. Cookie and newsletter overlays were suppressed for stable captures; their sampled behavior is documented separately. Images are local noncommercial demonstration evidence, not approval for commercial publication.\n`);
console.log(`Captured ${captures.length} responsive screens in ${output}`);
