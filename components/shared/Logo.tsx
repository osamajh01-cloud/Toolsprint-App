import Link from "next/link";
import { siteConfig } from "@/config/site";
import { localePath } from "@/i18n/paths";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * components/shared/Logo.tsx
 *
 * The TOOLAK wordmark: a compact glyph mark followed by the name. The mark
 * is an abstract bracket-and-spark — two angle brackets (the universal
 * sign for code/tools) framing a diagonal spark (speed) — drawn in the
 * brand gradient so it reads as a single considered symbol rather than
 * clip-art. It scales cleanly from the 24px header down to a favicon.
 *
 * The wordmark sets TOOLAK in an extra-bold, tightly tracked weight so the
 * short all-caps name has presence.
 *
 * One component, reused in the header, footer, and auth pages, so the mark
 * stays identical everywhere and any future change is made once.
 */

interface LogoProps {
  locale?: Locale;
  className?: string;
  asLink?: boolean;
  /** Hide the wordmark and show only the glyph (tight mobile chrome). */
  markOnly?: boolean;
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xs ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]">
        <path
          d="M8 6 4 12l4 6M16 6l4 6-4 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6.5 11 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className = "",
  asLink = true,
  locale = defaultLocale,
  markOnly = false,
}: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      {!markOnly && (
        <span className="text-xl font-extrabold tracking-tight">
          {siteConfig.shortName}
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href={localePath(locale, "/")}
      aria-label={`${siteConfig.name} home`}
      className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {content}
    </Link>
  );
}
