import type { Tool } from "@/types/tool";

/**
 * registry/tools/qr-code-generator.ts
 *
 * Registry entry for the "QR Code Generator" tool. This file is the ONLY
 * place this tool's information lives — the directory card, search index,
 * tool page, sitemap, and SEO metadata all read from it via
 * registry/tools/index.ts.
 */
export const qrCodeGenerator: Tool = {
  id: "tool_023",
  slug: "qr-code-generator",
  title: "QR Code Generator",
  shortDescription:
    "Create QR codes for links, text, email, phone, SMS, or WiFi — download as PNG.",
  category: "image",
  tags: ["qr code", "wifi qr", "url to qr", "png", "scan", "generator"],
  icon: "qr",
  featured: false,
  premium: false,
  popular: true,
  displayOrder: 5,
  createdAt: "2026-07-02",
  languageSupport: ["en"],
  seoTitle: "QR Code Generator — URL, WiFi, Email & Text QR Codes (Free)",
  seoDescription:
    "Generate QR codes for URLs, text, email, phone, SMS, and WiFi credentials. Pick size and error correction, then download a crisp PNG — free, in-browser.",
};
