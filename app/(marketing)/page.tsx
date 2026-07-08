import { Hero } from "@/components/marketing/Hero";

/**
 * app/(marketing)/page.tsx
 *
 * The public homepage. Lives inside the `(marketing)` route group so it
 * serves at `/` (route groups don't affect the URL) while allowing a
 * marketing-specific layout.tsx to be added to this group in Milestone 2
 * without touching other sections (tools, blog, auth, dashboard).
 *
 * Milestone 1 scope: hero only. Milestone 8 will rebuild this page with
 * featured tools, category showcase, and feature sections once the tool
 * catalog exists.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
