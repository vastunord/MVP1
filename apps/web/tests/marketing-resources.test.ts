import assert from "node:assert/strict";
import { test } from "node:test";
import { marketingResources } from "../src/lib/marketing-resources.ts";
import { knowledgeTopics } from "../src/lib/knowledge-state.ts";
import { tools } from "../../../packages/contracts/src/tools.ts";

test("five bilingual guides supply useful decisions, limitations, next steps and Studio destinations", () => {
  const no = marketingResources("nb-NO");
  const en = marketingResources("en");
  assert.equal(no.categories.length, knowledgeTopics.length);
  assert.equal(en.categories.length, knowledgeTopics.length);
  assert.equal(no.articles.length, 5);
  assert.deepEqual(no.articles.map(a => a.id), en.articles.map(a => a.id));
  const supported = new Set(tools.map(tool => tool.id));
  assert.equal(supported.size, 17);
  for (const [i, article] of en.articles.entries()) {
    assert.ok(supported.has(article.tool));
    assert.ok(article.tags.every(tag => Number.isInteger(tag) && tag >= 0 && tag < knowledgeTopics.length));
    for (const key of ["body", "compare", "limitation", "nextStep"] as const) {
      assert.ok(article[key].length > 80, `${article.id}: ${key} needs useful context`);
      assert.ok(no.articles[i][key].length > 80, `${article.id}: missing Norwegian ${key}`);
      assert.notEqual(article[key], no.articles[i][key]);
    }
  }
});
