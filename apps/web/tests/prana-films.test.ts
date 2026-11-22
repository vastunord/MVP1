import { strict as assert } from "node:assert";
import { test } from "node:test";
import { GET } from "../src/app/api/prana/film/route.ts";

const channelId = "UCT5ZBjxVTjTGmgvERQPZF9A";
const tag = `<yt:channelId>${channelId}</yt:channelId>`;
const entry = (channel: string, id: string) =>
  `<entry><yt:channelId>${channel}</yt:channelId><yt:videoId>${id}</yt:videoId></entry>`;

test("Prana shows only a real entry from the configured public channel", async (t) => {
  const cases = [
    { xml: `<feed>${tag}</feed>`, status: 200, videoId: null },
    { xml: `<feed>${tag}${entry(channelId, "testFilm001")}</feed>`, status: 200, videoId: "testFilm001" },
    { xml: `<feed>${tag}${entry("other", "testFilm001")}</feed>`, status: 503, videoId: null },
    { xml: `<feed>${tag}${entry(channelId, "bad id")}</feed>`, status: 503, videoId: null },
    { xml: "<html>Temporary error</html>", status: 503, videoId: null },
  ];
  for (const { xml, status, videoId } of cases) {
    const mock = t.mock.method(globalThis, "fetch", async (url: string) => {
      assert.equal(url, "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId);
      return new Response(xml);
    });
    const response = await GET();
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { videoId });
    mock.mock.restore();
  }
});
