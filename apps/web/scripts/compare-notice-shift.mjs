// Synthetic local CSS-injection lab only; does not modify the actual ribbon.
import { chromium } from "@playwright/test";
const base = "http://127.0.0.1:3112";
const browser = await chromium.launch({channel:"msedge",headless:true});
try {
  for (const path of ["/", "/en"]) for (const variant of ["baseline", "fixed-13rem", "unbounded"]) {
    const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    try {
      const page = await context.newPage();
      await page.route("https://fonts.gstatic.com/**", async request => {await new Promise(resolve => setTimeout(resolve,400)); await request.continue();});
      await page.route("**/*.css*", async request => {
        const response = await request.fetch();
        const css = await response.text();
        const value = variant === "fixed-13rem" ? "13rem" : "none";
        const extra = variant === "baseline" ? "" : `\n@media(max-width:44rem){.vg-header + .notice > span{max-width:${value}}}`;
        await request.fulfill({response, body:css+extra});
      });
      await page.addInitScript(() => {
        window.__lab = {sum:0, states:[]};
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.sum += entry.value; }).observe({type:"layout-shift", buffered:true});
        let before = "";
        function sample() {
          const notice=document.querySelector(".notice"), text=notice?.querySelector("span"), main=document.querySelector("main");
          if (notice && text && main) {
            const state={noticeH:Math.round(notice.getBoundingClientRect().height), textH:Math.round(text.getBoundingClientRect().height), textW:Math.round(text.getBoundingClientRect().width), mainY:Math.round(main.getBoundingClientRect().y), fontReady:document.fonts.check('400 16px "Zalando Sans Expanded"')};
            const hash=JSON.stringify(state);
            if (hash!==before) window.__lab.states.push(state);
            before=hash;
          }
          if (performance.now()<2200) requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      const response=await page.goto(base+path,{waitUntil:"load"});
      await page.waitForTimeout(1500); // fixed measurement window
      const result=await page.evaluate(()=>({sum:Number(window.__lab.sum.toFixed(4)),states:window.__lab.states,overflow:document.documentElement.scrollWidth>innerWidth}));
      console.log(JSON.stringify({path,variant,status:response?.status(),...result}));
    } finally {await context.close();}
  }
} finally {await browser.close();}
