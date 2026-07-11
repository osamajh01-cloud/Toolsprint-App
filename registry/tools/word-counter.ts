import type { Tool } from "@/types/tool";

/**
 * registry/tools/word-counter.ts
 *
 * Registry entry for the "Word Counter" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const wordCounter: Tool = {
  "id": "tool_001",
  "slug": "word-counter",
  "title": "Word Counter",
  "shortDescription": "Count words, characters, sentences, and reading time as you type.",
  "category": "text",
  "tags": [
    "words",
    "characters",
    "count",
    "reading time",
    "writing"
  ],
  "icon": "text",
  "featured": true,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Free Online Word Counter — Words, Characters & Reading Time",
  "seoDescription": "Paste or type text to instantly count words, characters, sentences, and estimated reading time. Free, private, and runs entirely in your browser."
};
