import { Card } from "@/components/ui/Card";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/WhyChooseUs.tsx
 *
 * The "why" section: five feature cards, each pairing an icon with a
 * claim the product actually keeps (privacy, speed, free, offline,
 * no-upload). Copy comes from the dictionary; icons are inline SVGs on
 * theme tokens. Server Component.
 */

const ICONS: Record<string, React.ReactNode> = {
  privacy: (
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zM9.5 12l2 2 3.5-4" />
  ),
  fast: <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />,
  free: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2c0 2.4-5 1.6-5 4.5 0 1.2 1.1 2 2.5 2s2.5-.8 2.5-2M12 5.5v2M12 16.5v2" />
    </>
  ),
  offline: (
    <>
      <path d="M5 12a7 7 0 0 1 13.4-2.8A4.5 4.5 0 0 1 17.5 18H7a4 4 0 0 1-2-7.5" />
      <path d="M12 21v-6m0 0-2.5 2.5M12 15l2.5 2.5" />
    </>
  ),
  noUpload: (
    <>
      <path d="M12 16V6m0 0-3.5 3.5M12 6l3.5 3.5" />
      <path d="M4 4l16 16" />
      <path d="M6 20h12" />
    </>
  ),
};

export function WhyChooseUs({ dictionary }: { dictionary: Dictionary }) {
  const { why } = dictionary;
  const features = [
    { icon: "privacy", title: why.privacyTitle, body: why.privacyBody },
    { icon: "fast", title: why.fastTitle, body: why.fastBody },
    { icon: "free", title: why.freeTitle, body: why.freeBody },
    { icon: "offline", title: why.offlineTitle, body: why.offlineBody },
    { icon: "noUpload", title: why.noUploadTitle, body: why.noUploadBody },
  ];

  return (
    <section aria-labelledby="why-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 id="why-heading" className="text-xl font-bold tracking-tight">
          {why.title}
        </h2>
        <p className="max-w-2xl text-sm text-foreground-muted">
          {why.description}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.icon} as="li" className="flex flex-col gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                {ICONS[feature.icon]}
              </svg>
            </span>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {feature.body}
            </p>
          </Card>
        ))}
      </ul>
    </section>
  );
}
