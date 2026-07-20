import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * app/[locale]/(tools)/tools/category/page.tsx
 *
 * /{locale}/tools/category has no content of its own — without this file
 * the URL would fall through to /tools/[slug] with slug="category" and
 * 404. A user trimming the URL bar lands on the directory instead, in
 * their own language.
 */
export default async function CategoryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : defaultLocale;
  redirect(`/${active}/tools`);
}
