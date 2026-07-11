import type { Tool } from "@/types/tool";

/**
 * registry/tools/json-formatter.ts
 *
 * Registry entry for the "JSON Formatter" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const jsonFormatter: Tool = {
  "id": "tool_005",
  "slug": "json-formatter",
  "title": "JSON Formatter",
  "shortDescription": "Format, validate, and minify JSON with clear error messages for invalid input.",
  "category": "developer",
  "tags": [
    "json",
    "format",
    "validate",
    "minify",
    "pretty print"
  ],
  "icon": "braces",
  "featured": true,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "JSON Formatter & Validator — Pretty Print JSON Online",
  "seoDescription": "Format, validate, and minify JSON instantly with precise error locations. Free online JSON formatter that never uploads your data."
};
