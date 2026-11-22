const channelId = "UCT5ZBjxVTjTGmgvERQPZF9A";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

export async function GET() {
  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Channel feed unavailable");
    const xml = await response.text();
    if (!xml.includes("<feed") || !xml.includes(`<yt:channelId>${channelId}</yt:channelId>`)) {
      throw new Error("Unexpected channel feed");
    }
    const latest = xml.match(/<entry>[^]*?<\/entry>/)?.[0];
    const videoId = latest?.match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/)?.[1];
    if (latest && (!videoId || !latest.includes(`<yt:channelId>${channelId}</yt:channelId>`))) {
      throw new Error("Unexpected channel entry");
    }
    return Response.json({ videoId: videoId ?? null }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    return Response.json({ videoId: null }, {
      status: 503,
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }
}
