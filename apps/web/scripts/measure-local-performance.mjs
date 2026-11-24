// Local lab only: start a clean local production server before running this script.
// Do not use this for field metrics or routes with private customer data.
import { chromium } from "@playwright/test";

const base = process.env.VN_PERF_BASE ?? "http://127.0.0.1:3107";
const quickWidth = Number(process.env.VN_PERF_WIDTH ?? "390");
const quickRoute = process.env.VN_PERF_LOCALE === "nb" ? "/" : "/en";
const origin = new URL(base);
if (!["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname))
  throw new Error("This synthetic lab is restricted to localhost.");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const viewport of (process.env.VN_PERF_QUICK ? [{ width: quickWidth, height: 844 }] : [{ width: 390, height: 844 }, { width: 1440, height: 900 }])) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      if (process.env.VN_PERF_BLOCK_FONT) await page.route("https://fonts.gstatic.com/**", route => route.abort());
      if (process.env.VN_PERF_TEST_FALLBACK) await page.route("**/*.css*", async route => {
        const response = await route.fetch();
        const css = await response.text();
        const noArial = process.env.VN_PERF_NO_ARIAL;
        const fallback = noArial ? 'local("VN Font Not Installed")' : 'local("Arial")';
        const finalFallback = noArial ? "Georgia,serif" : "Arial,sans-serif";
        await route.fulfill({ response, body: css + `\n@font-face{font-family:"VN Lab Fallback";src:${fallback};size-adjust:124%} :root{--font-brand:"Zalando Sans Expanded","VN Lab Fallback",${finalFallback}}` });
      });
      await page.addInitScript(() => {
        window.__vnLab = { lcp: 0, cls: 0, shifts: [], fontEvents: [], geometry: [] };
        for (const type of ["loading", "loadingdone", "loadingerror"]) document.fonts.addEventListener(type, () => window.__vnLab.fontEvents.push({ type, at: Math.round(performance.now()) }));
        let previous = "";
        const sample = () => {
          const get = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { y: Math.round(rect.y), h: Math.round(rect.height), display: getComputedStyle(element).display };
          };
          const state = { fontReady: document.fonts.check('400 16px "Zalando Sans Expanded"'), header: get(".vg-header"), notice: get(".notice"), noticeText: document.querySelector(".notice > span")?.textContent, main: get("main"), hero: get(".photo-hero"), heroCopy: get(".photo-hero-copy"), heroImage: get(".photo-hero-visual"), quick: get(".mk-quick") };
          const serialized = JSON.stringify(state);
          if (serialized !== previous && state.main) window.__vnLab.geometry.push({ at: Math.round(performance.now()), fonts: document.fonts.status, ...state });
          previous = serialized;
          if (performance.now() < 2200) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__vnLab.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
            window.__vnLab.cls += entry.value;
            window.__vnLab.shifts.push({ value: Number(entry.value.toFixed(4)), at: Math.round(entry.startTime), fonts: document.fonts.status, noticeHeight: Math.round(document.querySelector(".notice")?.getBoundingClientRect().height ?? 0), headerHeight: Math.round(document.querySelector(".vg-header")?.getBoundingClientRect().height ?? 0), tags: entry.sources.map(({ node, previousRect, currentRect }) => ({ tag: node?.tagName ?? "unknown", className: typeof node?.className === "string" ? node.className : "", connected: node?.isConnected, fromY: Math.round(previousRect.y), toY: Math.round(currentRect.y), fromHeight: Math.round(previousRect.height), toHeight: Math.round(currentRect.height) })) });
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      for (const route of (process.env.VN_PERF_QUICK ? [quickRoute] : ["/en", "/app", "/app/renders"])) {
        for (let run = 1; run <= (process.env.VN_PERF_QUICK ? 1 : 3); run++) {
          const response = await page.goto(base + route, { waitUntil: "load" });
          // Fixed measurement window, not a test retry or readiness heuristic.
          await page.waitForTimeout(1500);
          const data = await page.evaluate(() => {
            const navigation = performance.getEntriesByType("navigation")[0];
            const context = document.createElement("canvas").getContext("2d");
            const fontWidths = {};
            for (const font of ["Arial", "Zalando Sans Expanded"]) {
              context.font = `400 16px "${font}"`;
              fontWidths[font] = Math.round(context.measureText("Noncommercial demonstration · in development").width);
            }
            const preload = [...document.querySelectorAll('link[rel="preload"][as="font"]')].length;
            const fontRequests = performance.getEntriesByType("resource").filter(entry => entry.name.includes("fonts.gstatic.com")).map(entry => ({initiator: entry.initiatorType, start: Math.round(entry.startTime), end: Math.round(entry.responseEnd)}));
            return { ttfbMs: Math.round(navigation.responseStart), lcpWithinWindowMs: Math.round(window.__vnLab.lcp), layoutShiftSumWithinWindow: Number(window.__vnLab.cls.toFixed(4)), shifts: window.__vnLab.shifts, fontEvents: window.__vnLab.fontEvents, geometry: window.__vnLab.geometry, fontWidths, preload, fontRequests };
          });
          console.log(JSON.stringify({ viewport, route, run, status: response?.status(), ...data }));
        }
      }
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
