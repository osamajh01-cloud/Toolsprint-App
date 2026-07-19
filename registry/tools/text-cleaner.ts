import type { Tool } from "@/types/tool";

/**
 * registry/tools/text-cleaner.ts
 *
 * Registry entry for the "Text Cleaner" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const textCleaner: Tool = {
  "id": "tool_004",
  "slug": "text-cleaner",
  "title": "Text Cleaner",
  "shortDescription": "Strip extra spaces, line breaks, and invisible characters from pasted text.",
  "category": "text",
  "tags": [
    "whitespace",
    "remove line breaks",
    "clean text",
    "formatting"
  ],
  "icon": "text",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Text Cleaner — Remove Extra Spaces & Line Breaks Online",
  "seoDescription": "Clean pasted text in one click: remove double spaces, stray line breaks, and invisible characters. Free browser-based text cleaning tool."
};
