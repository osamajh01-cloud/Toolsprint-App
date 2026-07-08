import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * app/(blog)/layout.tsx
 *
 * Layout for the (blog) route group. Currently delegates to the shared
 * SiteShell (Header + Footer chrome). Exists as a separate file — rather
 * than putting the shell in the root layout — so this section can diverge
 * later (different nav, sidebars, section-specific providers) without
 * affecting any other route group.
 */
export default function GroupLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
