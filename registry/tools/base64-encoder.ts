import type { Tool } from "@/types/tool";

/**
 * registry/tools/base64-encoder.ts
 *
 * Registry entry for the "Base64 Encoder / Decoder" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const base64Encoder: Tool = {
  "id": "tool_006",
  "slug": "base64-encoder",
  "title": "Base64 Encoder / Decoder",
  "shortDescription": "Encode text to Base64 or decode Base64 back to plain text, entirely offline.",
  "category": "developer",
  "tags": [
    "base64",
    "encode",
    "decode",
    "conversion"
  ],
  "icon": "binary",
  "featured": false,
  "premium": false,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Base64 Encode & Decode Online — Fast and Private",
  "seoDescription": "Encode text to Base64 or decode Base64 strings back to readable text. Runs fully in your browser — nothing is sent to a server."
};
