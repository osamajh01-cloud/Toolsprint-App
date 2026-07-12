import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories, tools } from "@/registry/tools";

/**
 * app/sitemap.ts
 *
 * Registry-driven sitemap at /sitemap.xml — the Milestone 7 requirement
 * that every tool joins the sitemap "automatically from the registry".
 * Tool #24 and category #7 appear here with zero edits to this file.
 * Placeholder sections (pricing, blog) are listed at low priority; the
 * trust pages arrive with Milestone 13 and will be added then.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/tools/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
