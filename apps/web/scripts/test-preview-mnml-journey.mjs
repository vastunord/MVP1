// Run only against the protected diagnostic Preview. Supply passwords through a
// protected process environment; never put them in arguments or terminal output.
import { createRequire } from "node:module";
import { runOwnerStage, runIsolationStage } from "./mnml-journey-stages.mjs";

const origin = process.env.VASTUNORD_TEST_ORIGIN;
const identity = process.env.VERCEL_OIDC_TOKEN;
const password = process.env.VASTUNORD_MNML_OWNER_PASSWORD;
if (
  !origin ||
  !/^https:\/\/vastunord-[a-z0-9]+-vastu-nord\.vercel\.app$/.test(origin) ||
  !identity ||
  !password
)
  throw new Error(
    "Protected Preview origin, identity and owner credential are required",
  );
const owner = { email: "contact@vastu.no", password, cookies: new Map() };
const second = {
  email: process.env.VASTUNORD_MNML_SECOND_EMAIL,
  password: process.env.VASTUNORD_MNML_SECOND_PASSWORD,
  cookies: new Map(),
};
function check(condition, message) {
  if (!condition) throw new Error(message);
}
async function request(user, path, method = "GET", body, extraHeaders = {}) {
  const headers = {
    "x-vercel-trusted-oidc-idp-token": identity,
    ...extraHeaders,
  };
  if (user?.cookies.size)
    headers.Cookie = [...user.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  if (method !== "GET") headers.Origin = origin;
  if (body) headers["Content-Type"] = "application/json";
  return fetch(origin + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
  });
}
async function signIn(user) {
  const response = await request(user, "/api/auth/sign-in/email", "POST", {
    email: user.email,
    password: user.password,
  });
  check(response.status === 200, `Sign-in failed: ${response.status}`);
  for (const cookie of response.headers.getSetCookie()) {
    const first = cookie.split(";")[0],
      at = first.indexOf("="),
      name = first.slice(0, at);
    if (
      at > 0 &&
      /^(?:__Secure-)?better-auth\.session_(?:token|data)(?:\.\d+)?$/.test(name)
    )
      user.cookies.set(name, first.slice(at + 1));
  }
  check(
    [...user.cookies.keys()].some((k) => k.includes(".session_token")),
    "Session cookie unavailable",
  );
}
async function history(user, project) {
  return request(
    user,
    "/api/studio/renders?" +
      new URLSearchParams({
        projectId: project.id,
        toolId: "room-reimagination",
      }),
  );
}
await signIn(owner);
const evidence = await runOwnerStage({
  onCheckpoint: async (stage) => console.log(`Owner checkpoint ${stage}: PASS`),
  async getOrCreateProject() {
    const workspace = await request(owner, "/api/workspaces/personal", "POST", {
      name: "Preview MNML QA",
    });
    check(workspace.ok, `Workspace unavailable: ${workspace.status}`);
    const list = await request(owner, "/api/projects");
    check(list.ok, `Projects unavailable: ${list.status}`);
    const matches = (await list.json()).filter(
      (p) => p.name === "MNML synthetic proof",
    );
    check(matches.length <= 1, "Ambiguous synthetic project");
    if (matches.length) return matches[0];
    const created = await request(
      owner,
      "/api/projects",
      "POST",
      { name: "MNML synthetic proof", description: "Synthetic provider proof" },
      { "idempotency-key": "6748c735-4bfb-4688-b90d-7b1b3004e909" },
    );
    check(created.ok, `Project creation failed: ${created.status}`);
    return created.json();
  },
  async attachExistingRender(project) {
    const response = await request(owner, "/api/internal/mnml-proof", "POST", {
      projectId: project.id,
    });
    check(response.ok, `Attachment failed: ${response.status}`);
    return response.json();
  },
  async verifyHistory(project, render) {
    const response = await history(owner, project);
    check(
      response.ok &&
        (await response.json()).some(
          (item) =>
            item.id === render.id &&
            item.state === "SUCCEEDED" &&
            item.outputAssetId === render.outputAssetId,
        ),
      "Saved render history unavailable",
    );
  },
  async verifyOwnerAssets(render) {
    for (const id of [render.sourceAssetId, render.outputAssetId]) {
      const response = await request(owner, `/api/assets/${id}/download`);
      check(
        response.status === 302,
        `Owner asset unavailable: ${response.status}`,
      );
      const url = new URL(response.headers.get("location"));
      check(
        url.protocol === "https:" &&
          url.hostname === "fqckmeg47wkbeorz.private.blob.vercel-storage.com",
        "Unexpected storage target",
      );
      const bytes = await fetch(url, { redirect: "manual" });
      check(
        bytes.ok && (await bytes.arrayBuffer()).byteLength > 0,
        "Private asset retrieval failed",
      );
    }
  },
  async verifyAnonymousDenial(render) {
    const response = await request(
      null,
      `/api/assets/${render.outputAssetId}/download`,
    );
    check(
      [401, 403, 404].includes(response.status),
      "Anonymous access was not denied",
    );
  },
  async verifyComparison(project, render) {
    const { chromium } = createRequire(import.meta.url)("@playwright/test");
    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });
    try {
      const context = await browser.newContext();
      await context.addCookies(
        [...owner.cookies].map(([name, value]) => ({
          name,
          value,
          url: origin,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        })),
      );
      await context.route("**/*", async (route) => {
        if (new URL(route.request().url()).origin === origin)
          await route.continue({
            headers: {
              ...route.request().headers(),
              "x-vercel-trusted-oidc-idp-token": identity,
            },
          });
        else await route.continue();
      });
      const page = await context.newPage();
      await page.goto(origin + "/app/tools/room-reimagination", {
        waitUntil: "domcontentloaded",
      });
      await page.getByRole("radio", { name: project.name }).check();
      await page.getByText(/^(Prosjektrendere|Project renders)$/).click();
      await page
        .getByRole("button", { name: new RegExp(render.id.slice(0, 8)) })
        .click();
      await page
        .getByRole("button", {
          name: /Sammenlign med original|Compare with source/,
        })
        .click();
      await page
        .getByRole("slider", {
          name: /Sammenlign før og etter|Before and after comparison/,
        })
        .waitFor({ state: "visible" });
      const images = page.locator(".studio-canvas .sample-stage img");
      await images.nth(0).waitFor({ state: "visible" });
      await images.nth(1).waitFor({ state: "visible" });
      await page.waitForFunction(
        ([sourceId, outputId]) => {
          const nodes = [
            ...document.querySelectorAll(".studio-canvas .sample-stage img"),
          ];
          return (
            nodes.length === 2 &&
            nodes.every((node) => node.complete && node.naturalWidth > 0) &&
            nodes[0].getAttribute("src")?.includes(outputId) &&
            nodes[1].getAttribute("src")?.includes(sourceId)
          );
        },
        [render.sourceAssetId, render.outputAssetId],
      );
    } finally {
      await browser.close();
    }
  },
  async signOutAndBackIn() {
    check(
      (await request(owner, "/api/auth/sign-out", "POST", {})).ok,
      "Sign-out failed",
    );
    owner.cookies.clear();
    await signIn(owner);
  },
});
console.log("Owner saved-render journey: PASS");
try {
  const result = await runIsolationStage(
    {
      async hasVerifiedSecondUser() {
        return Boolean(second.email && second.password);
      },
      async verifyOtherUserDenial(project, render) {
        await signIn(second);
        for (const path of [
          `/api/projects/${project.id}`,
          `/api/assets/${render.sourceAssetId}/download`,
          `/api/assets/${render.outputAssetId}/download`,
        ])
          check(
            [403, 404].includes((await request(second, path)).status),
            "Cross-user access was not denied",
          );
        check(
          [403, 404].includes((await history(second, project)).status),
          "Cross-user render history was not denied",
        );
      },
    },
    evidence,
  );
  console.log("Live two-user isolation:", result.status);
} catch (error) {
  console.error(
    "Live two-user isolation: FAILED; owner-stage evidence remains valid.",
  );
  throw error;
}
