import type { Tool } from "@/types/tool";

/**
 * registry/tools/regex-tester.ts
 *
 * Registry entry for the "Regex Tester" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const regexTester: Tool = {
  "id": "tool_008",
  "slug": "regex-tester",
  "title": "Regex Tester",
  "shortDescription": "Test regular expressions against sample text with live match highlighting.",
  "category": "developer",
  "tags": [
    "regex",
    "regular expression",
    "pattern",
    "match",
    "test"
  ],
  "icon": "code",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Regex Tester — Test Regular Expressions with Live Matches",
  "seoDescription": "Write a regular expression and see matches highlighted live against your sample text. Supports flags and group previews, free in the browser."
};
