import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { getDictionary } from "@/i18n/dictionary";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(marketing)/pricing/page.tsx
 *
 * PLACEHOLDER: linked from the header nav in both languages, so it must
 * exist and be honest about its status. Replaced in a later milestone by
 * the real pricing page.
 */

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);
  const title = dictionary.nav.pricing;
  const description = dictionary.comingSoon.pricingBody;

  return {
    title,
    description,
    alternates: localeAlternates(active, "/pricing"),
    openGraph: { title, description, ...openGraphLocale(active) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  return (
    <ComingSoon
      locale={active}
      label={dictionary.comingSoon.label}
      title={dictionary.comingSoon.pricingTitle}
      description={dictionary.comingSoon.pricingBody}
      ctaHref="/tools"
      ctaText={dictionary.comingSoon.pricingCta}
    />
  );
}
