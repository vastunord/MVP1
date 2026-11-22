import assert from "node:assert/strict";
import { test } from "node:test";
import {
  indexableSections,
  publicIndexingEnabled,
  publicOrigin,
  publicPageUrls,
} from "../src/lib/public-index.ts";
import { sitemapOrigin } from "../src/server/discovery.ts";
import { previewPool, previewRole } from "../src/server/preview-target.ts";

test("protected Preview uses bilingual deployment URLs and remains closed to indexing", () => {
  const preview = {
    APP_ENV: "preview",
    VERCEL_ENV: "preview",
    VERCEL_URL: "vastunord-web-fixture.vercel.app",
    DATABASE_URL: `postgresql://${previewRole}:fixture@${previewPool}/neondb?sslmode=require`,
    PUBLIC_INDEXING_ENABLED: "true",
    COMMERCIAL_LAUNCH_APPROVED: "true",
  };
  const origin = sitemapOrigin(preview);
  assert.equal(origin, "https://vastunord-web-fixture.vercel.app");
  assert.deepEqual(publicPageUrls("/gallery", origin), {
    "nb-NO": origin + "/gallery",
    en: origin + "/en/gallery",
  });
  assert.ok(indexableSections.includes("gallery"));
  assert.equal(publicIndexingEnabled(preview), false);
  assert.equal(sitemapOrigin({ ...preview, DATABASE_URL: "" }), undefined);
  assert.equal(
    sitemapOrigin({ ...preview, VERCEL_URL: "invalid.example" }),
    undefined,
  );
  assert.equal(
    sitemapOrigin({ APP_ENV: "production", VERCEL_ENV: "production" }),
    undefined,
  );
  assert.equal(
    sitemapOrigin({
      ...preview,
      APP_ENV: "production",
      VERCEL_ENV: "production",
    }),
    publicOrigin,
  );
});
