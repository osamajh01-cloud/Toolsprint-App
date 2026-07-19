"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/image-utils";
import type { PdfItem } from "@/components/tools/pdf-merge/types";

/**
 * components/tools/pdf-merge/PdfFileRow.tsx
 *
 * One entry in the merge list: position number, drag handle, file info
 * (name, page count, size), and reorder/remove controls. Reordering works
 * three ways so every input method is covered:
 *   - HTML5 drag & drop (the row is draggable; parent handles the drop),
 *   - Move up / Move down buttons (keyboard + touch friendly),
 *   - and the buttons carry per-file aria-labels so screen-reader users
 *     hear exactly what will move.
 * Presentation only — order state lives in PdfMerge.
 */

interface PdfFileRowProps {
  item: PdfItem;
  index: number;
  total: number;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOverRow: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function PdfFileRow({
  item,
  index,
  total,
  onMove,
  onRemove,
  onDragStart,
  onDragOverRow,
  onDragEnd,
  isDragging,
}: PdfFileRowProps) {
  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart(item.id);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverRow(item.id);
      }}
      onDragEnd={onDragEnd}
      onDrop={(event) => event.preventDefault()}
      className={`flex flex-wrap items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 motion-safe:animate-fade-in ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Position + drag handle */}
      <span className="flex items-center gap-2">
        <span className="w-6 text-center text-sm font-semibold tabular-nums text-foreground-muted">
          {index + 1}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 cursor-grab text-foreground-muted"
        >
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </span>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={item.file.name}>
          {item.file.name}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {item.status === "reading" && (
            <span role="status" className="text-xs text-foreground-muted">
              Reading…
            </span>
          )}
          {item.status === "ready" && item.pageCount !== null && (
            <Badge variant="outline">
              {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
            </Badge>
          )}
          {item.status === "error" && (
            <span role="alert" className="text-xs text-foreground-muted">
              <span className="font-semibold text-foreground">
                Can&apos;t read this PDF
              </span>{" "}
              — it will be skipped
            </span>
          )}
          <Badge variant="outline">{formatBytes(item.file.size)}</Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMove(item.id, -1)}
          disabled={index === 0}
          aria-label={`Move ${item.file.name} up`}
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMove(item.id, 1)}
          disabled={index === total - 1}
          aria-label={`Move ${item.file.name} down`}
        >
          ↓
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.file.name}`}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
