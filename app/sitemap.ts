import type { MetadataRoute } from "next";
import { categories, tools } from "@/registry/tools";
import { locales } from "@/i18n/config";
import { localeUrl } from "@/i18n/seo";

/**
 * app/sitemap.ts
 *
 * Localized sitemap at /sitemap.xml. Every page appears once per language
 * with an `alternates.languages` block, which is how Google reads
 * hreflang from a sitemap — so the two language versions of a page are
 * explicitly paired rather than competing as duplicates.
 *
 * Registry-driven: a new tool, category, or LOCALE is picked up here with
 * zero edits to this file.
 */

/** hreflang alternates for one locale-agnostic path. */
function alternatesFor(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = localeUrl(locale, path);
  }
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/tools", priority: 0.9, freq: "weekly" },
    { path: "/pricing", priority: 0.3, freq: "monthly" },
    { path: "/blog", priority: 0.3, freq: "monthly" },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority, freq } of staticPaths) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: alternatesFor(path),
      });
    }

    for (const category of categories) {
      const path = `/tools/category/${category.slug}`;
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: alternatesFor(path),
      });
    }

    for (const tool of tools) {
      const path = `/tools/${tool.slug}`;
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternatesFor(path),
      });
    }
  }

  return entries;
}
