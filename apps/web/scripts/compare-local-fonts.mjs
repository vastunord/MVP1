// Local synthetic lab. The 400 ms font delay is an explicit network scenario;
// it does not represent field Core Web Vitals or an actual Arial-free OS.
import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:3107";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [390, 768, 1280, 1440]) for (const route of ["/", "/en"]) {
    for (const variant of ["baseline", "Arial", "Helvetica", "Segoe UI", "missing-to-Georgia"]) {
      const context = await browser.newContext({ viewport: {width, height:844}, reducedMotion: "reduce" });
      try {
        const page = await context.newPage();
        const available = variant === "baseline" || variant === "missing-to-Georgia" || await page.evaluate(async font => {
          try { await new FontFace("Local probe", `local("${font}")`).load(); return true; } catch { return false; }
        }, variant);
        if (!available) { console.log(JSON.stringify({width, route, variant, available:false})); continue; }
        await page.route("https://fonts.gstatic.com/**", async request => {
          await new Promise(resolve => setTimeout(resolve, 400));
          await request.continue();
        });
        if (variant !== "baseline") await page.route("**/*.css*", async request => {
          const response = await request.fetch();
          const missing = variant === "missing-to-Georgia";
          const name = missing ? "VN Font Not Installed" : variant;
          const next = missing ? "Georgia,serif" : "sans-serif";
          const css = await response.text();
          await request.fulfill({response, body: css + `\n@font-face{font-family:"VN Lab Fallback";src:local("${name}");size-adjust:124%} :root{--font-brand:"Zalando Sans Expanded","VN Lab Fallback",${next}}`});
        });
        await page.addInitScript(() => {
          window.__shiftSum = 0;
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shiftSum += entry.value;
          }).observe({type:"layout-shift", buffered:true});
        });
        const response = await page.goto(base + route, {waitUntil:"load"});
        // The 1.5 s observation window is a lab condition, not a readiness retry.
        await page.waitForTimeout(1500);
        const sum = await page.evaluate(() => Number(window.__shiftSum.toFixed(4)));
        console.log(JSON.stringify({width, route, variant, available:true, status:response?.status(), layoutShiftSumWithinWindow:sum}));
      } finally { await context.close(); }
    }
  }
} finally { await browser.close(); }
