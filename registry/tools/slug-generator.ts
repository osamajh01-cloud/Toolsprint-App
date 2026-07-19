import type { Tool } from "@/types/tool";

/**
 * registry/tools/slug-generator.ts
 *
 * Registry entry for the "Slug Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const slugGenerator: Tool = {
  "id": "tool_010",
  "slug": "slug-generator",
  "title": "Slug Generator",
  "shortDescription": "Turn any headline into a clean, lowercase, hyphenated URL slug.",
  "category": "seo",
  "tags": [
    "slug",
    "url",
    "permalink",
    "seo friendly"
  ],
  "icon": "link",
  "featured": true,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "URL Slug Generator — Convert Titles to SEO-Friendly Slugs",
  "seoDescription": "Convert any title or sentence into a clean, lowercase, hyphen-separated URL slug. Handles punctuation and special characters automatically."
};
