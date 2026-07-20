import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * config/navigation.ts
 *
 * Navigation structure — routes and flags only. Since Milestone 13 the
 * LABELS come from the dictionary rather than living here, so nav text is
 * translated without duplicating the structure per language. Callers pass
 * a dictionary and get back a fully labeled tree.
 *
 * Paths are locale-agnostic ("/tools"); components prefix them with the
 * active locale via localePath().
 */

export interface NavItem {
  title: string;
  href: string;
  /** Renders a "Soon" badge next to the link. */
  comingSoon?: boolean;
  /** Target page doesn't exist yet — render as inert text, never a link. */
  disabled?: boolean;
  /** External links open in a new tab with rel security attributes. */
  external?: boolean;
}

export interface NavColumn {
  title: string;
  items: NavItem[];
}

/** Primary navigation shown in the header and the mobile menu. */
export function getMainNav(dictionary: Dictionary): NavItem[] {
  const { nav } = dictionary;
  return [
    { title: nav.home, href: "/" },
    { title: nav.tools, href: "/tools" },
    { title: nav.pricing, href: "/pricing", comingSoon: true },
    { title: nav.blog, href: "/blog", comingSoon: true },
  ];
}

/** Footer link columns: Product, Resources, Legal, Social. */
export function getFooterNav(dictionary: Dictionary): NavColumn[] {
  const { footer } = dictionary;
  return [
    {
      title: footer.product,
      items: [
        { title: footer.allTools, href: "/tools" },
        { title: footer.pricing, href: "/pricing", comingSoon: true },
        { title: footer.whatsNew, href: "/blog", comingSoon: true },
      ],
    },
    {
      title: footer.resources,
      items: [
        { title: footer.blog, href: "/blog", comingSoon: true },
        { disabled: true, title: footer.contact, href: "/contact", comingSoon: true },
        { disabled: true, title: footer.about, href: "/about", comingSoon: true },
      ],
    },
    {
      title: footer.legal,
      items: [
        { disabled: true, title: footer.privacy, href: "/privacy", comingSoon: true },
        { disabled: true, title: footer.terms, href: "/terms", comingSoon: true },
      ],
    },
    {
      title: footer.social,
      items: [
        { title: "X (Twitter)", href: "https://twitter.com/toolsprint", external: true },
        { title: "GitHub", href: "https://github.com/toolsprint", external: true },
      ],
    },
  ];
}
