import { strict as assert } from "node:assert";
import { test } from "node:test";
import { cmsEnvironment } from "../src/environment.ts";
import {
  staffRole,
  canPublish,
  approvedCover,
  publishable,
} from "../src/editorial-policy.ts";

test("CMS configuration requires its dedicated secret, host, role, named database and TLS", () => {
  const host = "ep-cms-test.eu-central-1.aws.neon.tech";
  const url = new URL(
    "postgresql://" + host + "/vastunord_cms?sslmode=require",
  );
  url.username = "vastunord_cms_runtime";
  url.password = "synthetic-fixture";
  const env = {
    VASTUNORD_CMS_SECRET: "synthetic-test-only".repeat(3),
    VASTUNORD_CMS_DATABASE_HOST: host,
    VASTUNORD_CMS_DATABASE_URL: url.href,
  };
  assert.equal(cmsEnvironment(env).connectionString, url.href);
  assert.throws(() =>
    cmsEnvironment({ ...env, PAYLOAD_DROP_DATABASE: "true" }),
  );
  assert.throws(() => cmsEnvironment(env, "migration"));
  const direct = new URL(url);
  direct.username = "vastunord_cms_migrator";
  const migrator = {
    ...env,
    VASTUNORD_CMS_DATABASE_HOST: host.replace(".eu-", "-pooler.eu-"),
    VASTUNORD_CMS_MIGRATION_DATABASE_URL: direct.href,
  };
  assert.equal(
    cmsEnvironment(migrator, "migration").connectionString,
    direct.href,
  );
  assert.throws(() => cmsEnvironment(migrator));
  direct.hostname = migrator.VASTUNORD_CMS_DATABASE_HOST;
  assert.throws(() =>
    cmsEnvironment(
      { ...migrator, VASTUNORD_CMS_MIGRATION_DATABASE_URL: direct.href },
      "migration",
    ),
  );
  assert.throws(() => cmsEnvironment({ DATABASE_URL: url.href }));
  for (const [key, value] of [
    ["username", "neondb_owner"],
    ["pathname", "/neondb"],
    ["hostname", "other.neon.tech"],
    ["search", "?sslmode=disable"],
  ]) {
    const changed = new URL(url);
    Object.assign(changed, { [key]: value });
    assert.throws(() =>
      cmsEnvironment({ ...env, VASTUNORD_CMS_DATABASE_URL: changed.href }),
    );
  }
});
test("only editorial staff can publish and only approved public photo paths qualify", () => {
  assert.equal(
    staffRole({ collection: "users", role: "administrator" }),
    undefined,
  );
  assert.equal(
    canPublish(staffRole({ collection: "staff", role: "editor" })),
    false,
  );
  assert.equal(
    canPublish(staffRole({ collection: "staff", role: "publisher" })),
    true,
  );
  assert.equal(approvedCover("/reference/editorial/home-close.webp"), true);
  assert.equal(approvedCover("/api/assets/private/download"), false);
  assert.equal(approvedCover("https://images.invalid/photo.webp"), false);
});

test("editorial publication requires rights evidence, approved image and complete copy in each locale", () => {
  const copy = { title:"Synthetic title", summary:"Synthetic summary", body:"Synthetic article text", alt:"Synthetic image description" };
  const base = { slug:"synthetic-article", sourceNote:"Synthetic rights record", rightsConfirmed:true, cover:"/reference/editorial/home-close.webp", nb:copy, en:copy };
  assert.equal(publishable(base), true);
  assert.equal(publishable({...base, rightsConfirmed:false}), false);
  assert.equal(publishable({...base, sourceNote:"  "}), false);
  assert.equal(publishable({...base, cover:"/api/assets/private/download"}), false);
  assert.equal(publishable({...base, slug:" "}), false);
  for (const locale of ["nb", "en"] as const) for (const field of ["title", "summary", "body", "alt"] as const) {
    assert.equal(publishable({...base, [locale]:{...copy, [field]:" "}}), false, `${locale}.${field}`);
  }
});
