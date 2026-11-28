import { test } from "node:test";
import assert from "node:assert/strict";
import { findTool } from "@vastunord/contracts/tools";
import { mayaDraftKey, readMayaDraft, clearMayaDrafts } from "../src/lib/maya-drafts.ts";

test("Maya draft keys isolate account, project and tool and reject corrupt or stale settings", () => {
  const tool = findTool("room-reimagination")!;
  const key = mayaDraftKey("user-a", "project-a", tool.id);
  assert.notEqual(key, mayaDraftKey("user-b", "project-a", tool.id));
  assert.notEqual(key, mayaDraftKey("user-a", "project-b", tool.id));
  assert.notEqual(key, mayaDraftKey("user-a", "project-a", "garden-design"));
  const draft = { version: 1, values: { medium: "Watercolor" }, prompt: "A quiet room", avoid: "", engine: "fast", workflow: "design" };
  assert.deepEqual(readMayaDraft(JSON.stringify(draft), tool), draft);
  assert.equal(readMayaDraft("not json", tool), null);
  assert.equal(readMayaDraft(JSON.stringify({ ...draft, version: 2 }), tool), null);
  assert.equal(readMayaDraft(JSON.stringify({ ...draft, values: { medium: "unknown" } }), tool), null);
  assert.equal(readMayaDraft(JSON.stringify({ ...draft, workflow: "video" }), tool), null);
});

test("sign-out cleanup removes only Maya draft keys", () => {
  const map = new Map([[mayaDraftKey("a", "p", "t"), "{}"], ["other", "keep"]]);
  const storage = { get length() { return map.size; }, key: (i: number) => [...map.keys()][i] ?? null, removeItem: (key: string) => { map.delete(key); } } as Storage;
  clearMayaDrafts(storage);
  assert.deepEqual([...map.entries()], [["other", "keep"]]);
});

test("pool drafts restore the spa option offered by the selected mode", () => {
  const tool = findTool("pool-redesign")!;
  const draft = { version: 1, values: { mode: "Pool + Spa", "spa-option-0": "Spillover spa" }, prompt: "", avoid: "", engine: "fast", workflow: "design" };
  assert.deepEqual(readMayaDraft(JSON.stringify(draft), tool), draft);
  assert.equal(readMayaDraft(JSON.stringify({ ...draft, values: { ...draft.values, mode: "Spa" } }), tool), null);
});
