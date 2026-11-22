import { test } from "node:test";
import assert from "node:assert/strict";
import {
  runIsolationStage,
  runOwnerStage,
} from "../scripts/mnml-journey-stages.mjs";

test("owner stage needs no second user and retains evidence after sign-in", async () => {
  const calls = [];
  const mark = (name) => async () => {
    calls.push(name);
  };
  const evidence = await runOwnerStage({
    getOrCreateProject: async () => ({ id: "project" }),
    attachExistingRender: async () => ({ id: "render" }),
    verifyHistory: mark("history"),
    verifyOwnerAssets: mark("assets"),
    verifyAnonymousDenial: mark("anonymous"),
    verifyComparison: mark("comparison"),
    signOutAndBackIn: mark("signin"),
  });
  assert.deepEqual(evidence, {
    project: { id: "project" },
    render: { id: "render" },
  });
  assert.deepEqual(calls, [
    "history",
    "assets",
    "anonymous",
    "comparison",
    "signin",
    "history",
    "assets",
  ]);
  assert.deepEqual(
    await runIsolationStage(
      { hasVerifiedSecondUser: async () => false },
      evidence,
    ),
    { status: "PENDING" },
  );
});

test("isolation failure does not delete or mutate owner evidence", async () => {
  const evidence = { project: { id: "project" }, render: { id: "render" } };
  await assert.rejects(
    runIsolationStage(
      {
        hasVerifiedSecondUser: async () => true,
        verifyOtherUserDenial: async () => {
          throw new Error("denial failed");
        },
      },
      evidence,
    ),
    /denial failed/,
  );
  assert.deepEqual(evidence, {
    project: { id: "project" },
    render: { id: "render" },
  });
});
