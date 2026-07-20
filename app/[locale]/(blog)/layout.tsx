import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

/**
 * app/[locale]/(blog)/layout.tsx
 *
 * Layout for the (blog) route group. Resolves the dictionary for the
 * active locale and passes it (with the locale) into SiteShell, so the
 * header and footer render translated text and locale-prefixed links.
 * Kept per-group so a section can diverge later without affecting others.
 */
export default async function GroupLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  return (
    <SiteShell locale={active} dictionary={dictionary}>
      {children}
    </SiteShell>
  );
}
