/**
 * config/navigation.ts
 *
 * Single source of truth for every navigation tree on the site: the header
 * links, the mobile menu (same items), and the footer columns. Header,
 * MobileNav, and Footer all render from this file, so adding a page later
 * (e.g. real Blog in Milestone 10) means editing one object — never JSX.
 *
 * `comingSoon` marks routes that exist as placeholder pages but aren't
 * launched yet; nav components render a small "Soon" badge for them.
 */

export interface NavItem {
  title: string;
  href: string;
  /** Renders a "Soon" badge next to the link. */
  comingSoon?: boolean;
  /**
   * The target page does not exist yet (ships in a later milestone).
   * Nav components must render these as inert text — never a dead link.
   */
  disabled?: boolean;
  /** External links open in a new tab with rel security attributes. */
  external?: boolean;
}

export interface NavColumn {
  title: string;
  items: NavItem[];
}

/** Primary navigation shown in the header and the mobile menu. */
export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Tools", href: "/tools" },
  { title: "Pricing", href: "/pricing", comingSoon: true },
  { title: "Blog", href: "/blog", comingSoon: true },
];

/** Footer link columns: Product, Resources, Legal, Social. */
export const footerNav: NavColumn[] = [
  {
    title: "Product",
    items: [
      { title: "All tools", href: "/tools" },
      { title: "Pricing", href: "/pricing", comingSoon: true },
      { title: "What's new", href: "/blog", comingSoon: true },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Blog", href: "/blog", comingSoon: true },
      { disabled: true, title: "Contact", href: "/contact", comingSoon: true },
      { disabled: true, title: "About", href: "/about", comingSoon: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { disabled: true, title: "Privacy policy", href: "/privacy", comingSoon: true },
      { disabled: true, title: "Terms of service", href: "/terms", comingSoon: true },
    ],
  },
  {
    title: "Social",
    items: [
      {
        title: "X (Twitter)",
        href: "https://twitter.com/toolsprint",
        external: true,
      },
      {
        title: "GitHub",
        href: "https://github.com/toolsprint",
        external: true,
      },
    ],
  },
];
