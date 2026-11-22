import type { MetadataRoute } from "next";
import {
  indexableSections,
  publicIndexingEnabled,
  publicPageUrls,
} from "@/lib/public-index";
import { marketingResources } from "@/lib/marketing-resources";
import { studySlugs } from "@/lib/visual-studies";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicIndexingEnabled(process.env)) return [];
  const slugs = new Set([
    ...marketingResources("en").articles.map((article) => article.id),
    ...studySlugs,
  ]);
  const paths = [
    ...indexableSections.map((section) => "/" + section),
    ...Array.from(slugs, (slug) => "/resources/" + slug),
  ];
  return paths.flatMap((path) => {
    const languages = publicPageUrls(path);
    return Object.values(languages).map((url) => ({
      url,
      alternates: { languages },
    }));
  });
}
