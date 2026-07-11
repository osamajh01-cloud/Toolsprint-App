import type { Tool } from "@/types/tool";

/**
 * registry/tools/utm-link-builder.ts
 *
 * Registry entry for the "UTM Link Builder" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const utmLinkBuilder: Tool = {
  "id": "tool_015",
  "slug": "utm-link-builder",
  "title": "UTM Link Builder",
  "shortDescription": "Build campaign URLs with UTM parameters and validate them before sharing.",
  "category": "social-media",
  "tags": [
    "utm",
    "campaign",
    "tracking link",
    "analytics",
    "marketing"
  ],
  "icon": "link",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "UTM Link Builder — Create Trackable Campaign URLs",
  "seoDescription": "Build campaign links with utm_source, utm_medium, and utm_campaign parameters. Validated, encoded, and ready to paste into your posts and ads."
};
