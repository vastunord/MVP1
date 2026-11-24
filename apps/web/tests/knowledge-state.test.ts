import { test } from "node:test";
import assert from "node:assert/strict";
import { knowledgeSearch, readKnowledgeState } from "../src/lib/knowledge-state.ts";

test("knowledge query, topic and page round trip safely", () => {
  const state = { query: "oak & light", topic: 6, page: 3 };
  assert.deepEqual(readKnowledgeState(knowledgeSearch(state)), state);
  assert.equal(knowledgeSearch({ query: "", topic: -1, page: 0 }), "");
  assert.deepEqual(readKnowledgeState("?q=chair&topic=-5&page=-2"), {query: "chair", topic: -1, page: 0});
  assert.equal(readKnowledgeState("?page=999999999999999999999").page, 0);
  assert.equal(readKnowledgeState("?topic=900").topic, -1);
  assert.equal(readKnowledgeState("?topic=").topic, -1);
});
