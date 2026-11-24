import { test } from "node:test";
import assert from "node:assert/strict";
import { knowledgeSearch, knowledgeTopics, quickTipTopic, readKnowledgeState } from "../src/lib/knowledge-state.ts";
import { guides } from "../src/components/workspace-experience-data.ts";
import { studyLessons } from "../src/lib/visual-study-lessons.ts";

test("knowledge query, topic and page round trip safely", () => {
  const state = { query: "oak & light", topic: 6, page: 3 };
  assert.deepEqual(readKnowledgeState(knowledgeSearch(state)), state);
  assert.equal(knowledgeSearch({ query: "", topic: -1, page: 0 }), "");
  assert.deepEqual(readKnowledgeState("?q=chair&topic=-5&page=-2"), {query: "chair", topic: -1, page: 0});
  assert.equal(readKnowledgeState("?page=999999999999999999999").page, 0);
  assert.equal(readKnowledgeState("?topic=900").topic, -1);
  assert.equal(readKnowledgeState("?topic=").topic, -1);
});

test("quick tips and image-study categories map to the shared taxonomy", () => {
  const topics = new Set<string>(knowledgeTopics);
  for (const guide of guides) assert.ok(topics.has(quickTipTopic(guide.id)), guide.id);
  assert.equal(quickTipTopic("nordic"), "design");
  assert.equal(quickTipTopic("vastu"), "design");
  for (const lesson of Object.values(studyLessons)) {
    assert.ok(Number.isInteger(lesson.tag) && lesson.tag >= 0 && lesson.tag < knowledgeTopics.length);
  }
});
