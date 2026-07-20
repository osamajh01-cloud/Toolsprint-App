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
 * schema.org BreadcrumbList markup mirroring the visible breadcrumb trail
 * (Home / Tools / Category / Tool). The last item is the current page and
 * carries no URL, per Google's structured-data guidance.
 */
export function breadcrumbJsonLd(
  items: { name: string; url?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
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

/** schema.org FAQPage — generated from the same dictionary array the
 *  visible FAQ renders, so the markup and the schema can never disagree. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** schema.org Organization for the homepage. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    sameAs: [
      "https://twitter.com/toolsprint",
      "https://github.com/toolsprint",
    ],
  };
}
