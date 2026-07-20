import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/layout/SiteShell.tsx
 *
 * Standard public page chrome: Header, a growing main region, Footer.
 * Takes the resolved locale and dictionary from the route-group layout
 * and passes them to the header and footer, so no chrome component has to
 * load a dictionary itself.
 *
 * `id="main-content"` is the target of the Header's skip link.
 */
export function SiteShell({
  children,
  locale,
  dictionary,
}: {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} dictionary={dictionary} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} dictionary={dictionary} />
    </div>
  );
}
