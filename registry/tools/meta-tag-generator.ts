import type { Tool } from "@/types/tool";

/**
 * registry/tools/meta-tag-generator.ts
 *
 * Registry entry for the "Meta Tag Generator" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const metaTagGenerator: Tool = {
  "id": "tool_011",
  "slug": "meta-tag-generator",
  "title": "Meta Tag Generator",
  "shortDescription": "Fill in a form and get copy-ready title, description, and Open Graph tags.",
  "category": "seo",
  "tags": [
    "meta tags",
    "open graph",
    "title tag",
    "description",
    "html head"
  ],
  "icon": "tag",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Meta Tag Generator — Title, Description & Open Graph Tags",
  "seoDescription": "Generate copy-paste-ready HTML meta tags: title, description, Open Graph, and Twitter cards. Preview how your page appears in search and shares."
};
