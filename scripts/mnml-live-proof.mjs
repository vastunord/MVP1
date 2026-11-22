// One explicitly authorized provider proof. Never schedule or retry automatically.
import sharp from "sharp";
import { put } from "@vercel/blob";

const proofId = "6748c735-4bfb-4688-b90d-7b1b3004e909";
// This proof has already consumed the owner's one-render authorization.
throw new Error("The authorized MNML proof has already been executed");
const key = (process.env.MNMLAPI || process.env.MNML_API_KEY || "").trim();
const api = "https://api.mnml.ai/v2";
if (process.env.APP_ENV !== "preview" || process.env.VERCEL_ENV !== "preview" ||
    process.env.BLOB_STORE_ID !== "store_FqCkmEg47WkbeoRZ" || !key.startsWith("mk_live_")) {
  throw new Error("MNML proof requires the verified Vastu Nord Preview");
}
const headers = { Authorization: "Bearer " + key };
const get = async (path) => fetch(api + path, {
  headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(20000),
});
const [accountResponse, enginesResponse] = await Promise.all([get("/account"), get("/engines")]);
if (!accountResponse.ok || !enginesResponse.ok) {
  console.log("MNML_PROOF", JSON.stringify({ status: "preflight-blocked",
    accountStatus: accountResponse.status, enginesStatus: enginesResponse.status }));
} else {
  const account = await accountResponse.json();
  const catalog = await enginesResponse.json();
  const engine = catalog.data?.engines?.find((item) => item.id === "v4.5-fast");
  const price = engine?.prices?.render_usd;
  const balance = account.data?.balance_usd;
  if (!engine?.available || !Number.isFinite(price) || price <= 0 || price > 1 ||
      !Number.isFinite(balance) || balance < price) {
    console.log("MNML_PROOF", JSON.stringify({ status: "budget-or-engine-blocked" }));
  } else {
    // The image is created from geometric shapes for this test and contains no user data.
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="768" height="512"><rect width="768" height="512" fill="#f4eee4"/><path d="M0 390 L768 390 L768 512 L0 512Z" fill="#c9ad8d"/><rect x="65" y="55" width="245" height="240" fill="#bfd6de" stroke="#eee" stroke-width="18"/><path d="M188 62 V288 M74 175 H300" stroke="#eee" stroke-width="12"/><rect x="360" y="310" width="295" height="85" rx="15" fill="#a1aa98"/><rect x="340" y="360" width="325" height="65" rx="12" fill="#8e9a87"/><rect x="465" y="405" width="20" height="45" fill="#705944"/><ellipse cx="430" cy="435" rx="100" ry="25" fill="#b48a63"/></svg>';
    const image = await sharp(Buffer.from(svg)).png().toBuffer();
    const response = await fetch(api + "/renders", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", "Idempotency-Key": proofId },
      body: JSON.stringify({ engine: engine.id, mode: "interior", count: 1,
        image: "data:image/png;base64," + image.toString("base64"),
        prompt: "A calm Scandinavian living room with pale oak, soft daylight and natural textiles. Preserve the room layout." }),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      console.log("MNML_PROOF", JSON.stringify({ status: "submission-failed", http: response.status }));
    } else {
      const accepted = await response.json();
      const id = accepted.data?.id;
      const charged = accepted.data?.charged_usd;
      if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw new Error("Invalid job identifier");
      console.log("MNML_PROOF", JSON.stringify({ status: "accepted", id, chargedUsd: charged }));
      for (let attempt = 0; attempt < 18; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const poll = await get("/jobs/" + id);
        if (!poll.ok) {
          console.log("MNML_PROOF", JSON.stringify({ status: "poll-failed", id, http: poll.status }));
          break;
        }
        const job = (await poll.json()).data;
        if (job?.id !== id) throw new Error("Unexpected provider job");
        if (job.status === "failed" || job.status === "canceled") {
          console.log("MNML_PROOF", JSON.stringify({ status: job.status, id, refundedUsd: job.refunded_usd }));
          break;
        }
        if (job.status !== "succeeded") continue;
        const output = job.outputs?.find((item) => item.media === "image");
        const url = new URL(output?.url);
        if (url.origin !== "https://api.mnml.ai" || url.pathname !== "/v2/files/" + id ||
            !url.searchParams.get("exp") || !url.searchParams.get("sig")) throw new Error("Invalid result URL");
        const file = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(20000) });
        if (!file.ok) throw new Error("Result download failed");
        const bytes = Buffer.from(await file.arrayBuffer());
        if (!bytes.length || bytes.length > 24 * 1024 * 1024) throw new Error("Invalid result size");
        const result = await sharp(bytes, { limitInputPixels: 40000000, failOn: "error" }).webp().toBuffer();
        let stored = false;
        try {
          await put("private/diagnostics/" + proofId + "/result.webp", result, {
            access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "image/webp",
          });
          stored = true;
        } catch {
          // An unavailable build-time Blob identity must not discard the known provider job.
        }
        console.log("MNML_PROOF", JSON.stringify({ status: "succeeded", id, chargedUsd: job.charged_usd, privateBlob: stored }));
        break;
      }
    }
  }
}
