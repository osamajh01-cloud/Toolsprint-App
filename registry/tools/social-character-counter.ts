import type { Tool } from "@/types/tool";

/**
 * registry/tools/social-character-counter.ts
 *
 * Registry entry for the "Social Character Counter" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const socialCharacterCounter: Tool = {
  "id": "tool_013",
  "slug": "social-character-counter",
  "title": "Social Character Counter",
  "shortDescription": "Live character counts against X, Instagram, LinkedIn, and TikTok limits.",
  "category": "social-media",
  "tags": [
    "character limit",
    "twitter",
    "x",
    "instagram",
    "linkedin",
    "post length"
  ],
  "icon": "hash",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Social Media Character Counter — X, Instagram & LinkedIn Limits",
  "seoDescription": "Type a post and watch live character counts against the limits of X, Instagram, LinkedIn, and TikTok. Never get cut off mid-post again."
};
