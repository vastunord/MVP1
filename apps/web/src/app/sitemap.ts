import type { MetadataRoute } from "next";
import {
  indexableSections,
  publicPageUrls,
} from "@/lib/public-index";
import { marketingResources } from "@/lib/marketing-resources";
import { studySlugs } from "@/lib/visual-studies";
import { sitemapOrigin } from "@/server/discovery";
import { journalOrigin } from "@/server/journal";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = sitemapOrigin(process.env);
  if (!origin) return [];
  const slugs = new Set([
    ...marketingResources("en").articles.map((article) => article.id),
    ...studySlugs,
  ]);
  const paths = [
    ...indexableSections.map((section) => "/" + section),
    ...Array.from(slugs, (slug) => "/resources/" + slug),
    ...(journalOrigin(process.env) ? ["/resources/journal"] : []),
  ];
  return paths.flatMap((path) => {
    const languages = publicPageUrls(path, origin);
    return Object.values(languages).map((url) => ({
      url,
      alternates: { languages },
    }));
  });
}
