import type { Tool } from "@/types/tool";

/**
 * registry/tools/image-to-base64.ts
 *
 * Registry entry for the "Image to Base64" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const imageToBase64: Tool = {
  "id": "tool_016",
  "slug": "image-to-base64",
  "title": "Image to Base64",
  "shortDescription": "Convert an image file into a Base64 data URI without uploading it anywhere.",
  "category": "image",
  "tags": [
    "image",
    "base64",
    "data uri",
    "embed",
    "convert"
  ],
  "icon": "image",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Image to Base64 Converter — Data URIs Without Uploading",
  "seoDescription": "Convert PNG, JPG, or SVG images to Base64 data URIs directly in your browser. Your file never leaves your device — private by design."
};
