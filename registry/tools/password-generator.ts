import type { Tool } from "@/types/tool";

/**
 * registry/tools/password-generator.ts
 *
 * Registry entry for the "Password Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const passwordGenerator: Tool = {
  "id": "tool_019",
  "slug": "password-generator",
  "title": "Password Generator",
  "shortDescription": "Generate strong random passwords with custom length and character sets.",
  "category": "productivity",
  "tags": [
    "password",
    "random",
    "secure",
    "generator",
    "strength"
  ],
  "icon": "key",
  "featured": false,
  "premium": false,
  collections: ["popular"],
  displayOrder: 6,
  createdAt: "2026-06-20",
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Strong Password Generator — Random & Secure, In-Browser",
  "seoDescription": "Generate strong random passwords with custom length, symbols, and digits. Created locally with the Web Crypto API — never sent anywhere."
};
