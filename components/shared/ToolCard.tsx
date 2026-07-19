import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { getCategory } from "@/registry/tools/categories";
import { isNew, isPopular } from "@/registry/tools";
import type { Tool } from "@/types/tool";

/**
 * components/shared/ToolCard.tsx
 *
 * The catalog card for one tool: icon, title, short description, category
 * badge, pricing badge, and the "Open tool" action. Lives in shared/ (not
 * tools/) because it renders in many places: the directory grid, the
 * featured section, "More in category" on tool pages, and later the
 * homepage (Milestone 8) and blog posts.
 *
 * The entire card is one <Link> (larger touch target, one tab stop) with
 * "Open tool" styled as the visual affordance inside it. All content comes
 * from the registry entry — nothing is duplicated.
 */

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = getCategory(tool.category);

  // Status badges, all derived from registry metadata — a tool can carry
  // several at once (e.g. Popular + New).
  const statusBadges: string[] = [];
  if (isPopular(tool)) statusBadges.push("Popular");
  if (isNew(tool)) statusBadges.push("New");
  if (tool.featured) statusBadges.push("Featured");

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <ToolIcon name={tool.icon} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {category && <Badge variant="outline">{category.title}</Badge>}
          <Badge variant="brand">{tool.premium ? "Pro" : "Free"}</Badge>
        </div>
      </div>

      {statusBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {statusBadges.map((label) => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>
      )}

      <div className="flex-1">
        <h3 className="font-semibold leading-snug">{tool.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {tool.shortDescription}
        </p>
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
        Open tool
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
