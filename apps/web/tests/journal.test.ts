import { test } from "node:test";
import assert from "node:assert/strict";
import {
  journalEntry,
  journalList,
  journalOrigin,
} from "../src/server/journal.ts";
const origin = "https://vastunord-cms.vercel.app";
test("the journal uses the dedicated origin and renders only projected fields", async () => {
  assert.equal(journalOrigin({ VASTUNORD_CMS_PUBLIC_ORIGIN: origin }), origin);
  for (const value of [
    "https://other.vercel.app",
    "http://cms.vastu.no",
    origin + "/admin",
    origin + "@other.no",
  ])
    assert.equal(journalOrigin({ VASTUNORD_CMS_PUBLIC_ORIGIN: value }), null);
  const finding = {
    slug: "light",
    locale: "en",
    title: "Light",
    summary: "Window light",
    body: "A reading chair.",
    alt: "Chair by a window.",
    cover: "/reference/editorial/guide-light.webp",
  };
  const send: typeof fetch = async (url, opts) => {
    assert.equal(url, origin + "/published/light?locale=en");
    assert.equal(opts?.cache, "no-store");
    return Response.json({ ...finding, sourceNote: "editorial only" });
  };
  const value = await journalEntry(origin, "light", "en", send);
  assert.equal(value?.body, finding.body);
  assert.ok(!Object.hasOwn(value!, "sourceNote"));
  assert.equal(
    await journalEntry(
      origin,
      "light",
      "en",
      async () => new Response(null, { status: 404 }),
    ),
    null,
  );
  await assert.rejects(
    journalEntry(origin, "light", "en", async () =>
      Response.json({ ...finding, cover: "https://outside.example/a.webp" }),
    ),
  );
  const result = await journalList(origin, 1, "nb-NO", async (url) => {
    assert.equal(url, origin + "/published?locale=nb&page=1");
    return Response.json({
      articles: [{ slug: "lys", summary: "Kort", title: "Lys", sourceNote:"private editorial fixture" }],
      page: 1,
      pages: 1,
      staffEmail: "private@example.invalid",
    });
  });
  assert.equal(result.articles[0].slug, "lys");
  assert.ok(!Object.hasOwn(result.articles[0], "sourceNote"));
  assert.ok(!Object.hasOwn(result, "staffEmail"));
  await assert.rejects(journalList(origin, 0, "en", async () => { throw new Error("must not fetch"); }), /Invalid journal page/);
});
