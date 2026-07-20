import { categories, tools } from "@/registry/tools";
import { locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/StatsBand.tsx
 *
 * Live statistics strip under the hero. Every figure is DERIVED, not
 * typed in: tool count from the registry, category count from the
 * category registry, language count from the locale config. Add a tool,
 * category, or locale and this band updates itself. The one hardcoded
 * value — 100% browser processing — is a product guarantee, not a count.
 *
 * Server Component; a <dl> so each figure is a term/definition pair for
 * screen readers.
 */
export function StatsBand({ dictionary }: { dictionary: Dictionary }) {
  const stats = [
    { value: String(tools.length), label: dictionary.stats.totalTools },
    { value: String(categories.length), label: dictionary.stats.categories },
    { value: String(locales.length), label: dictionary.stats.languages },
    {
      value: dictionary.stats.browserProcessingValue,
      label: dictionary.stats.browserProcessing,
    },
  ];

  return (
    <section aria-label={dictionary.stats.heading} className="border-b border-border">
      <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <dd className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
              {stat.value}
            </dd>
            <dt className="text-sm text-foreground-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
