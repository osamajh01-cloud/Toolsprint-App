import type { Tool } from "@/types/tool";

/**
 * registry/tools/case-converter.ts
 *
 * Registry entry for the "Case Converter" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const caseConverter: Tool = {
  "id": "tool_002",
  "slug": "case-converter",
  "title": "Case Converter",
  "shortDescription": "Switch text between UPPERCASE, lowercase, Title Case, and Sentence case in one click.",
  "category": "text",
  "tags": [
    "uppercase",
    "lowercase",
    "title case",
    "sentence case",
    "capitalize"
  ],
  "icon": "type",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Case Converter — Uppercase, Lowercase & Title Case Online",
  "seoDescription": "Convert text to uppercase, lowercase, title case, or sentence case instantly. Free online case converter with no sign-up and no upload."
};
