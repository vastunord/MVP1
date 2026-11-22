import { matchesDatabase } from "./production-target.ts";

export const previewPool =
  "ep-frosty-violet-bhh19hyh-pooler.c-10.eu-central-1.aws.neon.tech";
export const previewRole = "vastunord_preview_runtime";
export const previewBranch = "br-summer-night-bh70tetr";
export const previewStore = "store_FqCkmEg47WkbeoRZ";

export function isPreviewDatabase(url: string | undefined) {
  return matchesDatabase(url, previewPool, previewRole);
}
