"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LOCALE_COOKIE,
  isLocale,
  locales,
  localeMeta,
  type Locale,
} from "@/i18n/config";

/**
 * components/layout/LanguageSwitcher.tsx
 *
 * Real language switching (Milestone 13 — this replaces the Milestone 2
 * placeholder). Selecting a language:
 *   1. writes the choice to a long-lived cookie, so middleware honors it
 *      on later visits instead of re-detecting from Accept-Language, and
 *   2. navigates to the SAME page in the other language by swapping the
 *      locale segment — the user keeps their place instead of being sent
 *      back to the homepage.
 *
 * Accessibility: a radiogroup whose options are labeled with each
 * language's own endonym ("English", "العربية"), so a screen reader in
 * either language announces something meaningful. `lang` is set per
 * option so the Arabic label is pronounced with Arabic phonology.
 */

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;

    // Persist the explicit choice for one year.
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;

    // Swap the leading locale segment, keeping the rest of the path.
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    startTransition(() => router.push(segments.join("/") || `/${next}`));
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-busy={isPending || undefined}
      className="inline-flex items-center rounded-full border border-border p-0.5 text-xs font-medium"
    >
      {locales.map((code) => {
        const meta = localeMeta[code];
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={meta.name}
            lang={meta.htmlLang}
            onClick={() => switchTo(code)}
            className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active
                ? "bg-secondary text-foreground"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {meta.short}
          </button>
        );
      })}
    </div>
  );
}
