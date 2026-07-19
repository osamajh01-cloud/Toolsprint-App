import type { Tool } from "@/types/tool";

/**
 * registry/tools/hashtag-generator.ts
 *
 * Registry entry for the "Hashtag Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const hashtagGenerator: Tool = {
  "id": "tool_014",
  "slug": "hashtag-generator",
  "title": "Hashtag Generator",
  "shortDescription": "Turn keywords into formatted hashtag sets, deduplicated and copy-ready.",
  "category": "social-media",
  "tags": [
    "hashtags",
    "instagram",
    "tags",
    "social reach"
  ],
  "icon": "hash",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Hashtag Generator — Build Clean Hashtag Sets from Keywords",
  "seoDescription": "Paste keywords and get a clean, deduplicated hashtag set formatted for Instagram, X, and TikTok. Copy the whole block in one click."
};
