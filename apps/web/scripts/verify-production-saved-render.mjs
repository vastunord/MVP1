// From apps/web: node scripts/verify-production-saved-render.mjs <owned-project-id> <successful-job-id>
// The owner signs in only inside the website. Runtime assertions print stage names, never URLs,
// private identifiers, cookies, tokens, media bytes, credentials, or page bodies.
import { chromium, expect } from "@playwright/test";
import { createHash } from "node:crypto";

const origin = "https://vastunord-web.vercel.app";
const [projectId, jobId, ...extra] = process.argv.slice(2);
if (extra.length || ![projectId, jobId].every((id) => typeof id === "string" && /^[\w-]{1,100}$/.test(id))) {
  throw new Error("Supply the owned project's identifier and its completed render-job identifier.");
}
const browser = await chromium.launch({ channel: "msedge", headless: false });
const context = await browser.newContext({ baseURL: origin, serviceWorkers: "block" });
const page = await context.newPage();
const assetPath = (id) => "/api/assets/" + encodeURIComponent(id) + "/download";
const historyPath = "/api/studio/renders?" + new URLSearchParams({ projectId });
let stage = "open approved Production account";
const requireTrue = (condition) => { if (!condition) throw new Error("Stage failed"); };
async function independentLogin() {
  await page.goto("/en/login?returnTo=%2Fapp%2Frenders", { waitUntil: "domcontentloaded" });
  console.log("Sign in privately in the website window using the approved account.");
  await page.waitForURL((url) => url.origin === origin && url.pathname.startsWith("/app"), { timeout: 600_000 });
  const approved = await page.evaluate(async () => {
    const response = await fetch("/api/auth/get-session", { cache: "no-store" });
    const session = response.ok ? await response.json() : null;
    return session?.user?.emailVerified === true && session.user.email.toLowerCase() === "contact@vastu.no";
  });
  requireTrue(approved);
}
async function savedResult() {
  stage = "read owned project and completed image metadata";
  const projectResponse = await context.request.get("/api/projects");
  requireTrue(projectResponse.ok());
  const project = (await projectResponse.json()).find((row) => row.id === projectId);
  requireTrue(typeof project?.name === "string");
  const history = await context.request.get(historyPath);
  requireTrue(history.ok());
  const render = (await history.json()).find((row) => row.id === jobId);
  requireTrue(render?.state === "SUCCEEDED" && render.media === "image");
  requireTrue([render.sourceAssetId, render.outputAssetId].every((id) => typeof id === "string" && /^[\w-]{1,100}$/.test(id)));
  requireTrue(render.sourceAssetId !== render.outputAssetId);
  stage = "open the existing private gallery result";
  await page.goto("/app/renders");
  const gallery = page.locator(".vn-private-renders");
  await gallery.getByRole("button", { name: project.name, exact: true }).click();
  const output = assetPath(render.outputAssetId);
  const source = assetPath(render.sourceAssetId);
  const thumbnail = gallery.locator(`button:has(img[src="${output}"])`);
  await thumbnail.click();
  const preview = gallery.locator(".vn-private-result");
  stage = "verify both image bytes and operable comparison";
  for (const src of [source, output]) {
    await expect.poll(() => preview.locator(`img[src="${src}"]`).evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  const divider = preview.getByRole("slider");
  const before = await divider.inputValue();
  await divider.press("ArrowRight");
  requireTrue(Number(await divider.inputValue()) === Number(before) + 1);
  await expect(preview.locator(".vn-private-comparison-before")).toHaveCSS("clip-path", /49%/);
  stage = "verify actual private download bytes";
  const link = preview.locator("a[download]");
  requireTrue(await link.getAttribute("href") === output);
  const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
  const stream = await download.createReadStream();
  requireTrue(stream);
  const digest = createHash("sha256");
  let bytes = 0;
  for await (const chunk of stream) { bytes += chunk.length; digest.update(chunk); }
  requireTrue(bytes > 0 && await download.failure() === null);
  await download.delete();
  return { output, source, hash: digest.digest("hex") };
}
try {
  await independentLogin();
  const first = await savedResult();
  console.log("PASS verified controlled session, owned render history, private gallery, comparison and download.");
  stage = "anonymous and logged-out access denial";
  const anonymous = await browser.newContext({ baseURL: origin });
  try {
    for (const path of [historyPath, first.output, first.source])
      requireTrue((await anonymous.request.get(path, { maxRedirects: 0 })).status() === 401);
  } finally { await anonymous.close(); }
  await page.goto("/app/settings");
  await page.getByRole("button", { name: /^(Sign out|Logg ut)$/ }).click();
  await page.waitForURL((url) => url.origin === origin && ["/", "/en"].includes(url.pathname));
  for (const path of [historyPath, first.output, first.source])
    requireTrue((await context.request.get(path, { maxRedirects: 0 })).status() === 401);
  console.log("PASS anonymous and logged-out access denied for the exact project and assets.");
  stage = "new approved user session";
  await independentLogin();
  const reopened = await savedResult();
  stage = "match saved source, output and returned download bytes";
  requireTrue(reopened.output === first.output && reopened.source === first.source && reopened.hash === first.hash);
  console.log("PASS same owned render, comparison and download after a new sign-in.");
} catch {
  console.error("BLOCKED at " + stage);
  process.exitCode = 1;
} finally {
  await browser.close();
}
