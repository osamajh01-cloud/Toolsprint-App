import type { ComponentType } from "react";
import { WordCounter } from "@/components/tools/word-counter/WordCounter";

/**
 * components/tools/implementations.ts
 *
 * Maps registry slugs to their interactive tool components. This is the
 * single join point between "a tool exists" (registry) and "a tool works"
 * (component):
 *
 * - Slug present here  → /tools/[slug] renders the component inside
 *   ToolShell's body slot.
 * - Slug absent        → ToolShell renders its launch-notice fallback.
 *
 * SHIPPING A NEW TOOL (the Milestone 6 loop): build the component under
 * components/tools/<slug>/, add one line here. No page, routing, layout,
 * or SEO changes — those are already registry-driven.
 *
 * Keys are typed against the Tool slug field's usage; a typo'd slug simply
 * never matches, and the page falls back safely to the launch notice.
 */

export const toolImplementations: Partial<Record<string, ComponentType>> = {
  "word-counter": WordCounter,
};

export function getToolImplementation(
  slug: string,
): ComponentType | undefined {
  return toolImplementations[slug];
}
