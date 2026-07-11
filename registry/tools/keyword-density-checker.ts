import type { Tool } from "@/types/tool";

/**
 * registry/tools/keyword-density-checker.ts
 *
 * Registry entry for the "Keyword Density Checker" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const keywordDensityChecker: Tool = {
  "id": "tool_012",
  "slug": "keyword-density-checker",
  "title": "Keyword Density Checker",
  "shortDescription": "Paste text to see how often each keyword appears and its percentage of the total.",
  "category": "seo",
  "tags": [
    "keyword density",
    "word frequency",
    "content analysis",
    "seo audit"
  ],
  "icon": "chart",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Keyword Density Checker — Analyze Word Frequency Online",
  "seoDescription": "Check keyword density in any text: see counts and percentages for every word and phrase. Free on-page SEO analysis in your browser."
};
