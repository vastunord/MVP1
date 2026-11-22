// Run once via the isolated Vastu Nord Vercel CLI's trusted-source OIDC identity.
// Arguments: <immutable-preview-origin> --register [--exercise-media]
import { randomBytes, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import sharp from "sharp";
import { previewStore } from "../src/server/preview-target.ts";

// The operator supplies the approved controlled inbox only for the test process.
const inbox = process.env.VASTUNORD_QA_INBOX?.trim();
const ownerStoreHost =
  previewStore.slice("store_".length).toLowerCase() +
  ".private.blob.vercel-storage.com";
const timeout = 20_000;
class JourneyError extends Error {}
function check(ok, message) {
  if (!ok) throw new JourneyError(message);
}
function status(response, expected, step) {
  check(
    expected.includes(response.status),
    step + " returned HTTP " + response.status,
  );
}
function usableId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
}
function summarize(error) {
  return error instanceof JourneyError
    ? error.message
    : "A request or response could not be completed";
}

async function main() {
  check(
    inbox && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inbox),
    "Supply the approved test inbox through VASTUNORD_QA_INBOX",
  );
  const [address, ...flags] = process.argv.slice(2);
  check(
    flags.includes("--register") &&
      flags.every((flag) =>
        ["--register", "--exercise-media"].includes(flag),
      ) &&
      new Set(flags).size === flags.length,
    "Expected a Preview origin and explicit --register; add --exercise-media to test private storage",
  );
  check(
    address && URL.canParse(address),
    "A verified immutable Preview origin is required",
  );
  const target = new URL(address);
  check(
    [
      "https://vastunord-dwj7afpcd-vastu-nord.vercel.app/",
      "https://vastunord-67rdd27lp-vastu-nord.vercel.app/",
    ].includes(target.href),
    "The target differs from the owner-approved immutable Vastu Nord Preview",
  );
  check(
    process.env.VERCEL_OIDC_TOKEN,
    "The isolated Vastu Nord CLI's trusted-source testing identity is required",
  );

  const token = process.env.VERCEL_OIDC_TOKEN;
  const password = randomBytes(32).toString("base64url");
  const session = new Map();
  async function request(
    path,
    { method = "GET", json, png, extra, signedIn = true, wait = timeout } = {},
  ) {
    const url = new URL(path, target);
    check(
      url.origin === target.origin,
      "Refusing to forward Preview credentials to another origin",
    );
    const headers = new Headers(extra);
    headers.set("x-vercel-trusted-oidc-idp-token", token);
    if (signedIn && session.size)
      headers.set(
        "Cookie",
        [...session].map(([k, v]) => k + "=" + v).join("; "),
      );
    if (method !== "GET") headers.set("Origin", target.origin);
    if (json) headers.set("Content-Type", "application/json");
    if (png) headers.set("Content-Type", "image/png");
    return fetch(url, {
      headers,
      method,
      body: png ?? (json ? JSON.stringify(json) : undefined),
      redirect: "manual",
      signal: AbortSignal.timeout(wait),
    });
  }
  // A production immutable deployment has a similar hostname. The rehearsal
  // sitemap uses the exact deployment host only on a database-pinned Preview.
  const unauthenticated = await fetch(new URL("/sitemap.xml", target), {
    redirect: "manual",
    signal: AbortSignal.timeout(timeout),
  });
  const challenge = unauthenticated.headers.get("location");
  const vercelChallenge =
    unauthenticated.status === 302 &&
    challenge &&
    URL.canParse(challenge) &&
    new URL(challenge).origin === "https://vercel.com";
  check(
    [401, 403].includes(unauthenticated.status) || vercelChallenge,
    "The anonymous request did not reach the expected Vercel protection challenge",
  );
  const sitemap = await request("/sitemap.xml");
  status(sitemap, [200], "Preview identity check");
  check(
    (await sitemap.text()).includes(
      "<loc>" + target.origin + "/en/gallery</loc>",
    ),
    "The deployment did not return its own isolated Preview sitemap",
  );
  const anonymous = await request("/api/auth/get-session");
  status(anonymous, [200], "Authentication readiness");
  check(
    (await anonymous.json()) === null,
    "Expected an anonymous initial session",
  );
  status(await request("/api/projects"), [401], "Anonymous project access");
  console.log(
    "PASS protected Preview identity, authentication readiness and anonymous project denial",
  );

  const registered = await request("/api/auth/sign-up/email", {
    method: "POST",
    extra: { "x-vn-locale": "nb-NO" },
    json: {
      email: inbox,
      password,
      name: "Vastu Nord Preview QA",
      callbackURL: "/login?verified=1",
    },
  });
  status(registered, [200, 201], "Registration");
  console.log(
    "Registration request accepted. Please verify the message in the approved inbox. Waiting up to five minutes.",
  );
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    const response = await request("/api/auth/sign-in/email", {
      method: "POST",
      json: { email: inbox, password },
      wait: Math.max(1, Math.min(timeout, deadline - Date.now())),
    });
    if (response.status === 200) {
      for (const value of response.headers.getSetCookie()) {
        const pair = value.split(";")[0];
        const split = pair.indexOf("=");
        if (split < 1) continue;
        const name = pair.slice(0, split);
        if (
          /^(?:__Secure-)?better-auth\.session_(?:token|data)(?:\.\d+)?$/.test(
            name,
          )
        )
          session.set(name, pair.slice(split + 1));
      }
      check(
        [...session.keys()].some((k) => k.includes(".session_token")),
        "Sign-in did not establish an application session",
      );
      break;
    }
    if (response.status === 401)
      throw new JourneyError(
        "The signup password was rejected; the controlled address may already have a Preview account",
      );
    status(response, [403], "First sign-in");
    check(
      (await response.json()).code === "EMAIL_NOT_VERIFIED",
      "Sign-in was refused for a reason other than pending verification",
    );
    await delay(Math.min(30_000, Math.max(0, deadline - Date.now())));
  }
  check(
    session.size,
    "Email verification was not observed within the five-minute window",
  );
  try {
    const active = await request("/api/auth/get-session");
    status(active, [200], "Verified session");
    const { user } = await active.json();
    check(
      user?.email === inbox && user.emailVerified === true,
      "A verified session for the approved inbox was not observed",
    );
    console.log(
      "PASS email verified and first sign-in with the original registration password",
    );
    if (flags.includes("--exercise-media")) await exercisePrivateMedia(request);
  } finally {
    try {
      status(
        await request("/api/auth/sign-out", { method: "POST", json: {} }),
        [200],
        "Sign-out",
      );
      const ended = await request("/api/auth/get-session");
      status(ended, [200], "Session invalidation");
      check(
        (await ended.json()) === null,
        "The previous session still resolves after sign-out",
      );
      console.log("PASS sign-out and session invalidation");
    } finally {
      session.clear();
    }
  }
}

async function exercisePrivateMedia(request) {
  const key = randomUUID();
  const name = "Preview QA " + key;
  const workspace = await request("/api/workspaces/personal", {
    method: "POST",
    json: { name: "Preview QA" },
  });
  status(workspace, [201], "Personal workspace");
  check(
    usableId((await workspace.json()).id),
    "Personal workspace was not available",
  );
  const image = await sharp({
    create: { width: 2, height: 2, channels: 3, background: "#6a8676" },
  })
    .png()
    .toBuffer();
  const created = await request("/api/projects", {
    method: "POST",
    extra: { "Idempotency-Key": key },
    json: { name },
  });
  status(created, [201], "Synthetic project creation");
  const project = await created.json();
  check(
    usableId(project.id) && project.name === name,
    "The synthetic project identity could not be verified",
  );
  const projectPath = "/api/projects/" + project.id;
  const collection = projectPath + "/assets";
  let uploadStarted = false;
  let assetId;
  console.log("Synthetic project identifier:", key);
  try {
    const before = await request(collection);
    status(before, [200], "Initial image list");
    const initial = await before.json();
    check(
      Array.isArray(initial) && initial.length === 0,
      "The newly created synthetic project was not empty",
    );
    uploadStarted = true;
    const uploaded = await request(collection, { method: "POST", png: image });
    status(uploaded, [201], "Synthetic image upload");
    const receipt = await uploaded.json();
    check(usableId(receipt.assetId), "Missing synthetic upload receipt");
    assetId = receipt.assetId;
    const list = await request(collection);
    status(list, [200], "Saved image list");
    const rows = await list.json();
    check(
      Array.isArray(rows) &&
        rows.length === 1 &&
        rows[0].id === assetId &&
        rows[0].mimeType === "image/png",
      "The upload was not found in the synthetic project",
    );
    const download = "/api/assets/" + assetId + "/download";
    status(
      await request(download, { signedIn: false }),
      [401],
      "Anonymous private download",
    );
    const grant = await request(download);
    status(grant, [302], "Authorized private download");
    const signed = new URL(grant.headers.get("location"));
    check(
      signed.protocol === "https:" &&
        signed.hostname === ownerStoreHost &&
        !signed.port &&
        !signed.username &&
        !signed.password,
      "Download authority differed from the private Preview store",
    );
    // The scoped Blob URL is the only credential on this cross-origin request.
    const body = await fetch(signed, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeout),
    });
    status(body, [200], "Private Blob retrieval");
    check(
      Buffer.from(await body.arrayBuffer()).equals(image),
      "The retrieved private image did not match the uploaded fixture",
    );
    console.log(
      "PASS synthetic project, private upload, image listing, anonymous denial and byte-for-byte retrieval",
    );
  } finally {
    if (assetId) {
      status(
        await request("/api/assets/" + assetId, { method: "DELETE" }),
        [200],
        "Synthetic asset cleanup",
      );
      const list = await request(collection);
      status(list, [200], "Post-deletion list");
      check(
        (await list.json()).length === 0,
        "The synthetic project still lists an image",
      );
    } else if (uploadStarted) {
      console.log(
        "Cleanup needs review: upload receipt unavailable; preserving the synthetic project.",
      );
    }
    if (!uploadStarted || assetId) {
      status(
        await request(projectPath, {
          method: "DELETE",
          json: { confirmation: name },
        }),
        [200],
        "Synthetic project cleanup",
      );
      console.log("PASS synthetic project cleanup");
    }
  }
}

try {
  await main();
} catch (error) {
  console.error("BLOCKED", summarize(error));
  process.exitCode = 1;
}
