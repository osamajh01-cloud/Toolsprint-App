import type { Tool } from "@/types/tool";

/**
 * registry/tools/unit-converter.ts
 *
 * Registry entry for the "Unit Converter" tool. This file is the ONLY place this
 * tool's information lives — the directory card, search index, tool page,
 * and SEO metadata all read from it via registry/tools/index.ts.
 */
export const unitConverter: Tool = {
  "id": "tool_020",
  "slug": "unit-converter",
  "title": "Unit Converter",
  "shortDescription": "Convert length, weight, temperature, and data units with instant results.",
  "category": "productivity",
  "tags": [
    "units",
    "convert",
    "metric",
    "imperial",
    "temperature"
  ],
  "icon": "scale",
  "featured": false,
  "premium": false,
  "languageSupport": [
    "en"
  ],
  "seoTitle": "Unit Converter — Length, Weight, Temperature & Data",
  "seoDescription": "Convert between metric and imperial units for length, weight, temperature, and data sizes. Instant, accurate, and free in your browser."
};
