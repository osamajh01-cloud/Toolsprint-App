import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * components/layout/SiteShell.tsx
 *
 * Standard public page chrome: Header on top, Footer at the bottom, and a
 * main content region that grows to push the footer to the viewport bottom
 * on short pages (flex column + flex-1).
 *
 * The (marketing), (tools), and (blog) route groups all currently share
 * identical chrome, so each group's layout.tsx delegates here instead of
 * repeating the same JSX three times. When a section later needs different
 * chrome (e.g. the dashboard's sidebar, or a tools sidebar), that group
 * swaps this component out in ITS OWN layout without touching the others —
 * which is exactly why the architecture uses route groups.
 *
 * `id="main-content"` is the target of the Header's skip link.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
