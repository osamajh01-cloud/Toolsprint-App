import type { Tool } from "@/types/tool";

/**
 * registry/tools/url-encoder.ts
 *
 * Registry entry for the "URL Encoder / Decoder" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const urlEncoder: Tool = {
  "id": "tool_009",
  "slug": "url-encoder",
  "title": "URL Encoder / Decoder",
  "shortDescription": "Percent-encode URLs or decode encoded strings back to readable text.",
  "category": "developer",
  "tags": [
    "url",
    "percent encoding",
    "encode",
    "decode",
    "query string"
  ],
  "icon": "link",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "URL Encoder & Decoder — Percent-Encode Links Online",
  "seoDescription": "Encode URLs and query strings to percent-encoding or decode them back instantly. Free URL encoding tool, no data leaves your browser."
};
