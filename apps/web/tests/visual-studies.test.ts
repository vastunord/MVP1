import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { studyLessons } from "../src/lib/visual-study-lessons.ts";

const index = JSON.parse(
  readFileSync(
    new URL("../src/lib/visual-study-index.json", import.meta.url),
    "utf8",
  ),
) as {
  slug: string;
  title: string[];
  observation: string[];
  image: string;
  lens: string;
  palette: string[];
  light: number[];
}[];

test("every illustrated study has unique localized editorial content and measured image data", () => {
  assert.equal(index.length, 500);
  assert.equal(new Set(index.map((s) => s.slug)).size, 500);
  for (const locale of [0, 1]) {
    assert.equal(new Set(index.map((s) => s.title[locale])).size, 500);
    assert.equal(new Set(index.map((s) => s.observation[locale])).size, 500);
  }
  assert.deepEqual(
    new Set(index.map((s) => s.lens)),
    new Set(Object.keys(studyLessons)),
  );
  for (const study of index) {
    assert.match(study.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(study.title.length, 2);
    assert.equal(study.observation.length, 2);
    assert.ok(study.observation.every((note) => note.trim().length >= 18));
    assert.equal(study.palette.length, 3);
    assert.ok(study.palette.every((colour) => /^[a-f0-9]{6}$/.test(colour)));
    assert.equal(study.light.length, 9);
    assert.ok(
      study.light.every(
        (zone) => Number.isInteger(zone) && zone >= 0 && zone <= 255,
      ),
    );
  }
});

test("all 500 articles have their own compact, valid WebP file", () => {
  const folder = new URL("../public/reference/studies/", import.meta.url);
  assert.deepEqual(
    new Set(readdirSync(folder)),
    new Set(index.map((s) => s.image + ".webp")),
  );
  const hashes = new Set<string>();
  for (const entry of index) {
    const bytes = readFileSync(new URL(entry.image + ".webp", folder));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    hashes.add(createHash("sha256").update(bytes).digest("hex"));
  }
  assert.equal(hashes.size, 500);
});
