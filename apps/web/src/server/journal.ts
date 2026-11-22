type Environment = Record<string, string | undefined>;
export function journalOrigin(env: Environment) {
  if (!env.VASTUNORD_CMS_PUBLIC_ORIGIN) return null;
  try {
    const url = new URL(env.VASTUNORD_CMS_PUBLIC_ORIGIN);
    if (
      url.protocol !== "https:" ||
      url.origin + "/" !== url.href ||
      !(
        url.hostname === "cms.vastu.no" ||
        /^vastunord-cms(?:-[a-z0-9-]+)?\.vercel\.app$/.test(url.hostname)
      )
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

export type JournalEntry = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  cover: string;
  alt: string;
};
export type JournalList = {
  articles: Pick<JournalEntry, "slug" | "title" | "summary">[];
  page: number;
  pages: number;
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function card(item: unknown): item is JournalList["articles"][number] {
  if (
    !item ||
    typeof item !== "object" ||
    !("slug" in item) ||
    !("title" in item) ||
    !("summary" in item)
  )
    return false;
  return (
    typeof item.slug === "string" &&
    slugPattern.test(item.slug) &&
    typeof item.title === "string" &&
    typeof item.summary === "string"
  );
}
export async function journalFetch(
  origin: string,
  path: string,
  send: typeof fetch = fetch,
) {
  const response = await send(origin + "/published" + path, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(3500),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Journal service unavailable");
  return response.json();
}
export async function journalEntry(
  origin: string,
  slug: string,
  locale: string,
  send: typeof fetch = fetch,
): Promise<JournalEntry | null> {
  if (slug.length > 150 || !slugPattern.test(slug)) return null;
  const lang = locale === "en" ? "en" : "nb";
  const entry = await journalFetch(
    origin,
    "/" + slug + "?locale=" + lang,
    send,
  );
  if (entry === null) return null;
  if (
    !card(entry) ||
    entry.slug !== slug ||
    !("locale" in entry) ||
    entry.locale !== lang ||
    !("alt" in entry) ||
    typeof entry.alt !== "string" ||
    !("body" in entry) ||
    typeof entry.body !== "string" ||
    !("cover" in entry) ||
    typeof entry.cover !== "string" ||
    !/^\/(?:media\/(?:gallery|briefs|tools|canvas)|reference\/(?:editorial|studies))\/[a-z0-9-]+\.webp$/.test(
      entry.cover,
    )
  )
    throw new Error("Invalid published article");
  return {
    slug,
    title: entry.title,
    summary: entry.summary,
    alt: entry.alt,
    body: entry.body,
    cover: entry.cover,
  };
}
export async function journalList(
  origin: string,
  page: number,
  locale: string,
  send: typeof fetch = fetch,
): Promise<JournalList> {
  const data = await journalFetch(
    origin,
    "?locale=" + (locale === "en" ? "en" : "nb") + "&page=" + page,
    send,
  );
  if (
    !data ||
    !Array.isArray(data.articles) ||
    data.articles.length > 24 ||
    !data.articles.every(card) ||
    data.page !== page ||
    !Number.isSafeInteger(data.pages) ||
    data.pages < 0
  )
    throw new Error("Invalid journal listing");
  return data;
}
