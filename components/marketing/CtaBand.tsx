import { Button } from "@/components/ui/Button";
import { tools } from "@/registry/tools";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/CtaBand.tsx
 *
 * Closing call-to-action before the footer: the workshop grid returns as
 * a quiet callback to the hero (the design's signature element bookends
 * the page), around one heading, one line, one button. Tool count is
 * registry-derived. Server Component.
 */
export function CtaBand({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-surface-sunken"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 workshop-grid opacity-50"
      />
      <div className="relative flex flex-col items-center gap-4 px-6 py-14 text-center">
        <h2
          id="cta-heading"
          className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {dictionary.cta.title}
        </h2>
        <p className="max-w-md text-balance text-foreground-muted">
          {t(dictionary.cta.body, { count: tools.length })}
        </p>
        <Button href={localePath(locale, "/tools")} size="lg" className="mt-2">
          {dictionary.cta.button}
        </Button>
      </div>
    </section>
  );
}
