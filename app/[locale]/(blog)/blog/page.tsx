import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { getDictionary } from "@/i18n/dictionary";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * app/[locale]/(blog)/blog/page.tsx
 *
 * PLACEHOLDER: linked from the header nav in both languages. Replaced by
 * the real MDX blog in a later milestone.
 */

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);
  const title = dictionary.nav.blog;
  const description = dictionary.comingSoon.blogBody;

  return {
    title,
    description,
    alternates: localeAlternates(active, "/blog"),
    openGraph: { title, description, ...openGraphLocale(active) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const dictionary = await getDictionary(active);

  return (
    <ComingSoon
      locale={active}
      label={dictionary.comingSoon.label}
      title={dictionary.comingSoon.blogTitle}
      description={dictionary.comingSoon.blogBody}
      ctaHref="/tools"
      ctaText={dictionary.comingSoon.blogCta}
    />
  );
}
