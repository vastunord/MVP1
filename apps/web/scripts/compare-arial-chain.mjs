// Local-only font lab: three independent cold contexts per case, with a fixed
// 400 ms network delay and 1.5 s observation window. Not field CLS.
import { chromium } from "@playwright/test";
const base = "http://127.0.0.1:3107";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [390, 1440]) for (const route of ["/", "/en"]) for (const adjusted of [false, true]) for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: {width, height:844}, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      await page.route("https://fonts.gstatic.com/**", async request => {
        await new Promise(resolve => setTimeout(resolve, 400));
        await request.continue();
      });
      await page.route("**/*.css*", async request => {
        const response = await request.fetch();
        const css = await response.text();
        const extra = adjusted ? '\n@font-face{font-family:"VN Lab Arial";src:local("Arial");size-adjust:124%} :root{--font-brand:"Zalando Sans Expanded","VN Lab Arial",Arial,Helvetica,sans-serif}' : "";
        await request.fulfill({response, body: css + extra});
      });
      await page.addInitScript(() => {
        window.__shifts = 0;
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shifts += entry.value; }).observe({type:"layout-shift", buffered:true});
      });
      const response = await page.goto(base + route, { waitUntil:"load" });
      await page.waitForTimeout(1500);
      console.log(JSON.stringify({width, route, adjusted, run, status:response?.status(), layoutShiftSumWithinWindow:await page.evaluate(() => Number(window.__shifts.toFixed(4)))}));
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
