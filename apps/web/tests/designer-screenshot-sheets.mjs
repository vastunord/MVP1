// Run from the repository with: node --experimental-strip-types apps/web/tests/designer-screenshot-sheets.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { tools } from "@vastunord/contracts/tools";

const root = fileURLToPath(new URL("../../../docs/evidence/designer-parity/", import.meta.url));
const out = path.join(root, "comparison");
const width = 1363, height = 936, tileWidth = 500, tileHeight = Math.round(height * tileWidth / width);
const gutter = 8, header = 30;
const columnNames = ["Designer prototype", "Local candidate", "Absolute RGB difference"];
const evidence = [];
const label = (text, w) => Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + header +
  '"><text x="6" y="21" font-size="16" font-family="sans-serif" fill="white">' + text.replaceAll("&", "&amp;") + '</text></svg>');

// Refuse comparisons that would stretch one screen to fit the other.
for (const tool of tools) {
  const pair = await Promise.all(["reference", "candidate"].map(async dir => {
    const bytes = await readFile(path.join(root, dir, tool.id + ".png"));
    const m = await sharp(bytes).metadata();
    if (m.width !== width || m.height !== height) throw new Error(tool.id + " " + dir + " must be " + width + "×" + height);
    return sharp(bytes).removeAlpha().toColourspace("srgb").raw().toBuffer();
  }));
  const [a, b] = pair;
  const difference = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) difference[i] = Math.abs(a[i] - b[i]);
  const panels = await Promise.all([a, b, difference].map(data => sharp(data, {raw: {width, height, channels: 3}})
    .resize(tileWidth, tileHeight, {fit: "fill"}).png().toBuffer()));
  evidence.push({tool, panels});
}
await mkdir(out, {recursive: true});
for (let start = 0; start < evidence.length; start += 4) {
  const rows = evidence.slice(start, start + 4);
  const totalWidth = 3 * tileWidth + 2 * gutter;
  const layers = columnNames.map((name, i) => ({input: label(name, tileWidth), left: i * (tileWidth + gutter), top: 0}));
  rows.forEach(({tool, panels}, row) => {
    const y = header + row * (header + tileHeight + gutter);
    layers.push({input: label(tool.name, totalWidth), top: y, left: 0});
    panels.forEach((input, i) => layers.push({input, left: i * (tileWidth + gutter), top: y + header}));
  });
  const layer = sharp({create:{width: totalWidth, height: header + rows.length * (header + tileHeight + gutter), channels: 3, background:"#172533"}});
  await writeFile(path.join(out, "tools-" + (start + 1) + "-" + (start + rows.length) + ".webp"),
    await layer.composite(layers).webp({quality: 88, effort: 4}).toBuffer());
}
console.log("Verified and paired " + evidence.length + " desktop captures at " + width + "×" + height + ".");
