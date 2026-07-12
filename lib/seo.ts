import { siteConfig } from "@/config/site";
import type { Tool } from "@/types/tool";

/**
 * lib/seo.ts
 *
 * Centralized structured-data (JSON-LD) helpers, per the architecture's
 * "seo.ts centralizes generateMetadata/JSON-LD" plan. Started in Milestone
 * 5 with the SoftwareApplication schema for tool pages; Milestone 7 adds
 * sitemap/OG helpers, Milestone 10 adds Article schema for blog posts.
 */

/**
 * schema.org SoftwareApplication markup for a tool page. Because it's
 * built from the registry entry, every tool page — current and future —
 * gets correct structured data with zero per-tool work. All tools are
 * free browser apps, hence the zero-price offer and "Web browser" OS.
 */
export function toolJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.seoDescription,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * Serialize JSON-LD for a <script type="application/ld+json"> tag.
 * "<" is escaped so payload content can never close the script tag
 * early (standard XSS hardening for inline JSON).
 */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
