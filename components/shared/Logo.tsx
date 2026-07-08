import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * components/shared/Logo.tsx
 *
 * Text-only wordmark for ToolSprint. Kept as its own component (rather than
 * inlined in the homepage or header) because it will be reused in multiple
 * places: the homepage hero, the site Header (Milestone 2), the auth pages,
 * and the footer — all of which must stay visually identical and update
 * together if the brand name or styling ever changes.
 */

interface LogoProps {
  /** Optional additional classNames, e.g. to resize the logo in different contexts. */
  className?: string;
  /** Whether the logo should link to the homepage. Defaults to true. */
  asLink?: boolean;
}

export function Logo({ className = "", asLink = true }: LogoProps) {
  const content = (
    <span className={`text-xl font-bold tracking-tight ${className}`}>
      {siteConfig.shortName}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
