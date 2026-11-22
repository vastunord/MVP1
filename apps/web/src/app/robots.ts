import type { MetadataRoute } from "next";
import { publicOrigin, publicIndexingEnabled } from "@/lib/public-index";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  if (!publicIndexingEnabled(process.env))
    return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/app",
        "/api/",
        "/*login",
        "/*signup",
        "/*password",
        "/*verify-email",
        "/*onboarding",
        "/*newsletter/",
      ],
    },
    sitemap: publicOrigin + "/sitemap.xml",
  };
}
