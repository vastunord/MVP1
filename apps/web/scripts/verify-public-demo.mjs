import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";

const publicOrigin = "https://vastunord-web.vercel.app";
const localOrigin = "http://127.0.0.1:3100";
const origin = process.argv[2];
assert(
  [localOrigin, publicOrigin].includes(origin),
  "Pass the local port 3100 origin or Vastu Nord public alias.",
);
const deployment = origin === publicOrigin ? "live" : "local";
const styles = await readFile(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const brandFonts = new Set(
  [
    ...styles.matchAll(
      /url\("(https:\/\/fonts\.gstatic\.com\/s\/zalandosansexpanded\/[^"]+\.woff2)"\)/g,
    ),
  ].map((match) => match[1]),
);
assert(brandFonts.size > 0, "Brand font locations missing from CSS");
const evidence = new URL(
  "../../../docs/evidence/v7-studio-knowledge/" + deployment + "/",
  import.meta.url,
);
const studies = JSON.parse(
  await readFile(
    new URL("../src/lib/visual-study-index.json", import.meta.url),
    "utf8",
  ),
);
assert(
  studies.length >= 500 &&
    new Set(studies.map((s) => s.slug)).size === studies.length,
);
const report = {
  origin,
  checkedAt: new Date().toISOString(),
  viewports: [],
  editors: [],
  articles: [],
  closedServices: {},
  galleryTools: 0,
  screenshots: [],
  fontFailures: [],
};
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({
  baseURL: origin,
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  serviceWorkers: "block",
});
// Existing visitor choices keep overlays out of the visual review; no account or persisted browser profile is used.
await context.addInitScript(() => {
  localStorage.setItem(
    "vn-cookie-choices",
    JSON.stringify({
      version: 1,
      decidedAt: "2026-01-01T00:00:00Z",
      marketing: false,
      statistics: false,
    }),
  );
  localStorage.setItem(
    "vn-newsletter-display",
    JSON.stringify({ version: 1, state: "minimized" }),
  );
});
const page = await context.newPage();
await page.route("**/*", (route) => {
  const request = route.request();
  if (
    (new URL(request.url()).origin !== origin &&
      !(
        brandFonts.has(request.url()) &&
        request.resourceType() === "font" &&
        request.method() === "GET"
      )) ||
    !["GET", "HEAD"].includes(request.method())
  )
    return route.abort();
  return route.continue();
});
page.setDefaultTimeout(10000);
async function open(path) {
  const response = await page.goto(path, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  assert.equal(response?.status(), 200, "Page load " + path);
  assert.equal(new URL(page.url()).origin, origin);
  await page
    .locator("#vn-cookie-launcher")
    .waitFor({ state: "attached", timeout: 20000 });
}
async function photo(locator) {
  await locator.scrollIntoViewIfNeeded();
  return locator.evaluate(async (el) => {
    await el.decode();
    if (el.naturalWidth < 50 || el.naturalHeight < 20)
      throw Error("An illustration did not decode.");
    return new URL(el.currentSrc).pathname;
  });
}
async function noOverflow() {
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert(
    metrics.document <= metrics.viewport + 1,
    "Horizontal overflow on " +
      new URL(page.url()).pathname +
      " " +
      JSON.stringify(metrics),
  );
}
async function screenshot(name) {
  const fontAvailable = await page.evaluate(async () => {
    try {
      const faces = await document.fonts.load(
        '400 16px "Zalando Sans Expanded"',
        "Vastu Nord",
      );
      await document.fonts.ready;
      return (
        faces.some((face) => face.status === "loaded") &&
        document.fonts.check('400 16px "Zalando Sans Expanded"', "Vastu Nord")
      );
    } catch {
      return false;
    }
  });
  if (!fontAvailable) {
    report.fontFailures.push(name);
    console.warn(
      "Brand font did not load for " +
        name +
        ". Screenshot shows fallback typography.",
    );
  }
  await mkdir(evidence, { recursive: true });
  await page.screenshot({
    path: fileURLToPath(new URL(name + ".png", evidence)),
    animations: "disabled",
  });
  report.screenshots.push(name + ".png");
}
try {
  for (const [width, height] of [
    [1440, 900],
    [1024, 800],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await open(width === 390 ? "/" : "/en");
    await noOverflow();
    const hero = page.locator(".photo-hero");
    await expect(hero.getByRole("slider")).toBeVisible();
    assert.equal(await hero.locator(".photo-hero-stage img").count(), 2);
    await photo(hero.locator(".photo-hero-stage img").first());
    const possibilities = page
      .locator(".mk-split")
      .getByRole("link", {
        name: width === 390 ? "Åpne Studio" : "Open Studio",
        exact: true,
      })
      .filter({ visible: true });
    assert((await possibilities.count()) > 0);
    assert.equal(
      await possibilities.first().getAttribute("href"),
      "/app/library",
    );
    const faq = page.locator("#questions details");
    await expect(faq).toHaveCount(12);
    const pictures = new Set();
    for (const item of await faq.all()) {
      if (!(await item.evaluate((el) => el.open)))
        await item.locator("summary").click();
      const img = item.locator(".home-question-answer img");
      assert((await img.getAttribute("alt"))?.trim());
      const paragraph = item.locator(".home-question-answer p");
      assert((await paragraph.innerText()).trim().length > 25);
      pictures.add(await photo(img));
      await noOverflow();
      if (width === 390) {
        const [a, b] = await Promise.all([
          img.boundingBox(),
          paragraph.boundingBox(),
        ]);
        assert(
          a.width >= 200 &&
            b.y >= a.y + a.height - 1 &&
            b.x + b.width <= width + 1,
          "Narrow FAQ should stack the photo and answer inside the viewport",
        );
      }
    }
    assert.equal(pictures.size, 12, "FAQ illustrations must be distinct");
    await faq.first().locator("summary").click();
    await page.locator("#questions h2").evaluate((el) =>
      window.scrollTo({
        top:
          scrollY +
          el.getBoundingClientRect().top -
          (document.querySelector("header")?.getBoundingClientRect().height ||
            0) -
          20,
        behavior: "instant",
      }),
    );
    if (width === 390 || width === 1440) await screenshot("faq-" + width);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await screenshot("home-" + width);
    report.viewports.push({
      width,
      height,
      decodedFaqIllustrations: pictures.size,
      overflow: false,
    });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const tool of tools) {
    await open(tool.route);
    const canvas = page.locator(".studio-canvas");
    await expect(
      canvas.getByRole("heading", { level: 1, name: tool.name, exact: true }),
    ).toBeVisible();
    assert.equal(await canvas.getByRole("slider").count(), 0);
    assert.equal(await page.locator(".studio-variants").count(), 0);
    await photo(canvas.locator(".sample-stage img").first());
    await expect(page.locator(".primary-action .primary")).toBeDisabled();
    await noOverflow();
    report.editors.push(tool.route);
  }
  await open("/app/tools/room-reimagination");
  const comparison = page.locator(".studio-canvas .compare-toggle");
  await comparison.click();
  const slider = page.locator(".studio-canvas input[type=range]");
  await expect(slider).toHaveValue("50");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("51");
  await comparison.click();
  await expect(slider).toHaveCount(0);
  await page.getByRole("radio", { name: "Videovandring", exact: true }).check();
  await expect(page.locator(".studio-engine")).toContainText("10 s");
  await page
    .getByRole("radio", { name: "Design fra bilde", exact: true })
    .check();
  for (const [width, height] of [
    [390, 844],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => document.fonts.ready);
    const levels = page.getByRole("group", { name: "Prana V1", exact: true });
    assert.equal(await levels.getByRole("radio").count(), 5);
    await levels.getByRole("radio", { name: "Ultra", exact: true }).check();
    for (const tile of await levels.locator("label").all()) {
      const rect = await tile.boundingBox();
      assert(
        rect?.height >= 44 && rect.width > 42,
        "Clipped Prana V1 tile at " + width,
      );
    }
    await noOverflow();
    if (width === 390) {
      await page.locator(".studio-engine").scrollIntoViewIfNeeded();
      await screenshot("studio-options-390");
    }
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await screenshot("studio-room-1440");
  await open("/app/renders");
  await page.locator(".vn-tile-open").first().click();
  const gallery = page.locator(".vn-scene-dialog");
  const select = gallery.getByRole("combobox");
  for (const tool of tools) {
    await select.selectOption(tool.id);
    const link = gallery.locator('a[href*="?sample=gallery-"]').first();
    assert.equal(
      await link.getAttribute("href"),
      tool.route + "?sample=gallery-01",
    );
    report.galleryTools++;
  }
  await gallery.locator('a[href*="?sample=gallery-"]').first().click();
  await expect(page.locator(".selected-stage img")).toHaveAttribute(
    "src",
    /scene-01/,
  );
  for (const index of [0, Math.floor(studies.length / 2), studies.length - 1]) {
    const study = studies[index];
    for (const [i, prefix] of ["", "/en"].entries()) {
      const route = prefix + "/resources/" + study.slug;
      await open(route);
      const article = page.locator("article.visual-study");
      await expect(article.getByRole("heading", { level: 1 })).toHaveText(
        study.title[i],
      );
      const image = await photo(article.locator("figure img").first());
      assert.equal(image, "/reference/studies/" + study.image + ".webp");
      assert(study.observation[i].trim().length > 25);
      await expect(article.locator("figure img").first()).toHaveAttribute(
        "alt",
        study.observation[i],
      );
      await expect(article.locator(".study-intro")).toContainText(
        study.observation[i],
      );
      assert(
        (await article.locator(".study-reading").innerText()).trim().length >
          150,
      );
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        publicOrigin + route,
      );
      await noOverflow();
      report.articles.push({ route, image });
      if (index === 0 && i === 1) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await screenshot("study-1440");
      }
    }
  }
  for (const [method, path] of [
    ["GET", "/api/auth/get-session"],
    ["GET", "/api/account"],
    ["GET", "/api/projects"],
    ["GET", "/api/assets/demo-read-only/download"],
    ["GET", "/api/studio/renders?projectId=public-demo"],
    ["POST", "/api/prana"],
  ]) {
    // Empty request cannot produce a model call, write a project, register a user or contact an inbox.
    const res = await context.request.fetch(origin + path, {
      method,
      maxRedirects: 0,
      ...(method === "POST" ? { data: {}, headers: { Origin: origin } } : {}),
    });
    assert.equal(res.status(), 503, "Expected closed service " + path);
    report.closedServices[path] = res.status();
    await res.dispose();
  }
  await writeFile(
    new URL("checks.json", evidence),
    JSON.stringify(report, null, 2) + "\n",
    "utf8",
  );
  console.log(
    "PASS " +
      deployment +
      ": four widths, twelve FAQ images, " +
      report.editors.length +
      " editors, " +
      report.articles.length +
      " localised articles, " +
      Object.keys(report.closedServices).length +
      " closed APIs, gallery and optional comparison.",
  );
} finally {
  await context.close();
  await browser.close();
}
