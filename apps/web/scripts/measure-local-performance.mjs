// Local lab only: start a clean local production server before running this script.
// Do not use this for field metrics or routes with private customer data.
import { chromium } from "@playwright/test";

const base = process.env.VN_PERF_BASE ?? "http://127.0.0.1:3107";
const origin = new URL(base);
if (!["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname))
  throw new Error("This synthetic lab is restricted to localhost.");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__vnLab = { lcp: 0, cls: 0, shifts: [] };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__vnLab.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
            window.__vnLab.cls += entry.value;
            window.__vnLab.shifts.push({ value: Number(entry.value.toFixed(4)), tags: entry.sources.map(({ node, previousRect, currentRect }) => ({ tag: node?.tagName ?? "unknown", className: typeof node?.className === "string" ? node.className : "", fromY: Math.round(previousRect.y), toY: Math.round(currentRect.y) })) });
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      for (const route of ["/en", "/app", "/app/renders"]) {
        for (let run = 1; run <= 3; run++) {
          const response = await page.goto(base + route, { waitUntil: "load" });
          // Fixed measurement window, not a test retry or readiness heuristic.
          await page.waitForTimeout(1500);
          const data = await page.evaluate(() => {
            const navigation = performance.getEntriesByType("navigation")[0];
            return { ttfbMs: Math.round(navigation.responseStart), lcpWithinWindowMs: Math.round(window.__vnLab.lcp), layoutShiftSumWithinWindow: Number(window.__vnLab.cls.toFixed(4)), shifts: window.__vnLab.shifts };
          });
          console.log(JSON.stringify({ viewport, route, run, status: response?.status(), ...data }));
        }
      }
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
