import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/Faq.tsx
 *
 * FAQ section built on native <details>/<summary> — expand/collapse,
 * keyboard operation, and screen-reader semantics come from the platform
 * with zero JavaScript. The chevron rotates via the open state in CSS
 * (group-open), behind motion-safe.
 *
 * The page injects FAQPage JSON-LD generated from the SAME dictionary
 * array this renders (lib/seo.faqJsonLd), so the visible answers and the
 * schema are one source and cannot drift.
 */
export function Faq({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-6">
      <h2 id="faq-heading" className="text-xl font-bold tracking-tight">
        {dictionary.faq.title}
      </h2>

      <div className="flex flex-col gap-2">
        {dictionary.faq.items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border bg-surface transition-colors open:border-primary/40 hover:border-border-strong"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              {item.q}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0 text-foreground-subtle transition-transform motion-safe:duration-200 group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-foreground-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
