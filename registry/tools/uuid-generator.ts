import type { Tool } from "@/types/tool";

/**
 * registry/tools/uuid-generator.ts
 *
 * Registry entry for the "UUID Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const uuidGenerator: Tool = {
  "id": "tool_007",
  "slug": "uuid-generator",
  "title": "UUID Generator",
  "shortDescription": "Generate one or many random v4 UUIDs, ready to copy into your code.",
  "category": "developer",
  "tags": [
    "uuid",
    "guid",
    "unique id",
    "identifier",
    "v4"
  ],
  "icon": "hash",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "UUID v4 Generator — Create Random Unique IDs Online",
  "seoDescription": "Generate cryptographically random UUID v4 identifiers in bulk. Copy single IDs or whole lists — free, instant, and browser-based."
};
