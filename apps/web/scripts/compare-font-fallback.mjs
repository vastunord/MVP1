// Synthetic local experiment. Georgia substitutes for an Arial-unavailable system;
// this does not represent a real OS/browser without Arial.
import { chromium } from "@playwright/test";

const base = process.env.VN_PERF_BASE ?? "http://127.0.0.1:3107";
if (!["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname))
  throw new Error("Font experiments are restricted to localhost.");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [390, 768, 1280, 1440]) {
    for (const route of ["/", "/en"]) {
      for (const variant of ["baseline", "adjusted-arial", "missing-arial-georgia"]) {
        const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
        try {
          const page = await context.newPage();
          if (variant !== "baseline") await page.route("**/*.css*", async request => {
            const response = await request.fetch();
            const missing = variant === "missing-arial-georgia";
            const font = missing ? 'local("VN Font Not Installed")' : 'local("Arial")';
            const next = missing ? "Georgia,serif" : "Arial,sans-serif";
            const css = await response.text();
            await request.fulfill({ response, body: css + `\n@font-face{font-family:"VN Lab Fallback";src:${font};size-adjust:124%} :root{--font-brand:"Zalando Sans Expanded","VN Lab Fallback",${next}}` });
          });
          await page.addInitScript(() => {
            window.__shiftSum = 0;
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shiftSum += entry.value;
            }).observe({ type: "layout-shift", buffered: true });
          });
          const response = await page.goto(base + route, { waitUntil: "load" });
          // This fixed observation period is a lab condition, not a readiness retry.
          await page.waitForTimeout(1500);
          const shift = await page.evaluate(() => Number(window.__shiftSum.toFixed(4)));
          console.log(JSON.stringify({ width, route, variant, status: response?.status(), layoutShiftSumWithinWindow: shift }));
        } finally { await context.close(); }
      }
    }
  }
} finally { await browser.close(); }
