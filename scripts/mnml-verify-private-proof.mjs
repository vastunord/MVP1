// Read back the existing synthetic proof; no render submission is made.
import { get } from "@vercel/blob";
import sharp from "sharp";

if (process.env.VERCEL_ENV !== "preview" || process.env.APP_ENV !== "preview" ||
    process.env.BLOB_STORE_ID !== "store_FqCkmEg47WkbeoRZ") {
  throw new Error("Unexpected Preview store");
}
try {
  const blob = await get("private/diagnostics/6748c735-4bfb-4688-b90d-7b1b3004e909/result.webp", {
    access: "private", useCache: false,
  });
  if (!blob?.stream) throw new Error();
  const chunks = [];
  let size = 0;
  for await (const chunk of blob.stream) {
    size += chunk.length;
    if (size > 24 * 1024 * 1024) throw new Error();
    chunks.push(chunk);
  }
  const info = await sharp(Buffer.concat(chunks), { limitInputPixels: 40000000 }).metadata();
  if (info.format !== "webp" || !info.width || !info.height) throw new Error();
  console.log("MNML_PRIVATE_PROOF", JSON.stringify({ read: true, format: info.format, width: info.width, height: info.height }));
} catch {
  console.log("MNML_PRIVATE_PROOF", JSON.stringify({ read: false }));
}
