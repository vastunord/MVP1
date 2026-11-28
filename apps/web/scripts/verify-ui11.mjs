import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3100").origin;
const live = origin === "https://vastunord-web.vercel.app";
assert(live || new URL(origin).hostname === "127.0.0.1", "Use the Vastu Nord release origin or the loopback test server.");
const evidence = new URL(`../../../docs/evidence/maya-${live ? "live" : "local"}/ui11/`, import.meta.url);
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [390, 768, 1280, 1440]) {
    for (const lang of ["nb-NO", "en"]) {
      for (const theme of ["dark", "light"]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        try {
          await context.addCookies([{name:"vn-locale",value:lang,url:origin},{name:"vn-theme",value:theme,url:origin}]);
          await context.addInitScript(() => {
            localStorage.setItem("vn-cookie-choices", JSON.stringify({ version:1, decidedAt:new Date().toISOString(), statistics:false, marketing:false }));
            localStorage.setItem("vn-newsletter-display", JSON.stringify({ version:1, state:"confirmed" }));
          });
          const page = await context.newPage();
          const label = width+"-"+lang+"-"+theme;
          for (const route of [lang === "en" ? "/en" : "/", "/app/tools/room-reimagination"]) {
            assert.equal((await page.goto(origin+route, {waitUntil:"domcontentloaded",timeout:60000}))?.status(), 200);
            await page.locator("#vn-cookie-launcher").waitFor({state:"attached"});
            const measured = await page.evaluate(async () => {
              const loaded = await document.fonts.load('500 16px "Inter Variable"', 'æ ø å Æ Ø Å');
              const compact = Array.from(document.querySelectorAll(".choices-compact .studio-choice")).filter(el => el.getBoundingClientRect().height > 0);
              return {font:loaded.length > 0 && loaded.every(f=>f.status==="loaded"), body:getComputedStyle(document.body).fontFamily,
                lang:document.documentElement.lang, theme:document.documentElement.dataset.theme,
                overflow:document.documentElement.scrollWidth - innerWidth,
                undersized:compact.filter(el=>el.getBoundingClientRect().height < 44).length};
            });
            assert(measured.font && measured.body.includes("Inter Variable"), "font "+label+route);
            assert.equal(measured.lang,lang); assert.equal(measured.theme,theme);
            assert(measured.overflow<=1,"horizontal overflow "+label+route+" "+measured.overflow);
            assert.equal(measured.undersized,0);
            if (route.startsWith("/app")) continue;
            const stage = page.locator(".photo-hero-stage");
            if (width===1440 && lang==="en" && theme==="light") {
              const range = stage.getByRole("slider");
              for (const split of [0,50,100]) {
                await range.fill(String(split));
                await stage.screenshot({path:fileURLToPath(new URL("hero-"+split+".png",evidence))});
              }
              await page.getByRole("button",{name:"Next image pair"}).click();
              await page.locator('[data-scene="forest-living"]').waitFor();
              assert.equal(await range.inputValue(),"0");
              await stage.screenshot({path:fileURLToPath(new URL("hero-next-original.png",evidence))});
            }
            if ((width===390 && lang==="nb-NO" && theme==="light") || (width===1280 && lang==="en" && theme==="dark")) {
              await page.screenshot({path:fileURLToPath(new URL("home-"+label+".png",evidence))});
            }
          }
          console.log("PASS", label, "homepage and Studio");
        } finally { await context.close(); }
      }
    }
  }
} finally { await browser.close(); }
