// Local experiment only. Both variants buffer/intercept HTML for comparability.
import { chromium } from "@playwright/test";
const base = "http://127.0.0.1:3107";
const brand = "https://fonts.gstatic.com/s/zalandosansexpanded/v3/JTUJjJci8Cy470GaeFwsix1hi3aTmrgRwU-zrEw7.woff2";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [390, 1440]) for (const route of ["/", "/en"]) for (const preload of [false, true]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      await page.route(base + "/**", async (request) => {
        if (request.request().resourceType() !== "document") return request.continue();
        const response = await request.fetch();
        const body = await response.text();
        const link = preload ? `<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href="${brand}">` : "";
        await request.fulfill({ response, body: body.replace("<head>", "<head>" + link) });
      });
      await page.addInitScript(() => {
        window.__shifts = 0;
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shifts += entry.value; }).observe({ type: "layout-shift", buffered: true });
      });
      const response = await page.goto(base + route, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      console.log(JSON.stringify({ width, route, preload, status: response?.status(), layoutShiftSumWithinWindow: await page.evaluate(() => Number(window.__shifts.toFixed(4))) }));
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
