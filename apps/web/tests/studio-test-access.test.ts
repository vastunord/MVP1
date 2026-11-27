import { test } from "node:test";
import assert from "node:assert/strict";
import { controlledRenderingAllowanceReady } from "../src/lib/studio-test-access.ts";

test("configuration alone cannot enable paid generation without an enforced allowance", () => {
  assert.equal(controlledRenderingAllowanceReady(), false);
});
