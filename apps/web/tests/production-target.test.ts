import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isProductionDatabase,
  productionPool,
  productionRuntimeRole,
} from "../src/server/production-target.ts";
test("Production refuses Development, owners, alternate databases and connection overrides", () => {
  const scoped = new URL(
    "postgres://" +
      productionRuntimeRole +
      ":fixture@" +
      productionPool +
      "/neondb?sslmode=require&channel_binding=require",
  );
  assert.equal(isProductionDatabase(scoped.href), true);
  for (const [key, value] of Object.entries({
    hostname: "localhost",
    username: "neondb_owner",
    password: "",
    port: "5433",
    pathname: "/postgres",
    search: "?sslmode=disable",
  })) {
    const other = new URL(scoped);
    Reflect.set(other, key, value);
    assert.equal(isProductionDatabase(other.href), false, key);
  }
  assert.equal(isProductionDatabase(scoped.href + "&host=localhost"), false);
  assert.equal(isProductionDatabase(scoped.href + "&sslmode=disable"), false);
});
