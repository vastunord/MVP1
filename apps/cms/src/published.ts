import type { Payload } from "payload";
import type { Article } from "./editorial-policy.ts";

export async function publishedArticle(
  payload: Payload,
  slug: string,
  locale: "nb" | "en",
) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  // This fixed projection is the only unauthenticated article read. Staff and version data stay private.
  const result = await payload.find({
    collection: "articles",
    draft: false,
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    select: { slug: true, nb: true, en: true, cover: true },
  });
  const article = result.docs[0] as Article | undefined;
  if (!article) return null;
  return {
    slug: article.slug,
    cover: article.cover,
    locale,
    ...article[locale],
  };
}
