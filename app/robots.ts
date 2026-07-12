import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * app/robots.ts
 *
 * /robots.txt companion to the sitemap: allows full crawling and points
 * crawlers at /sitemap.xml so it's discovered without manual submission.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
