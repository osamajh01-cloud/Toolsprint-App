"use client";

import { useRef } from "react";

/* eslint-disable @next/next/no-img-element -- thumbnails are data: URLs
   rendered locally from the user's own file. */

/**
 * components/tools/pdf-split/PageGrid.tsx
 *
 * The visual page grid: one tile per page with its thumbnail (or a
 * placeholder while rendering / beyond the render limit) and page number.
 *
 * Two roles depending on mode:
 * - Read-only highlight (ranges / pages / every / everyN): tiles included
 *   in the current plan get the brand ring; others dim. Non-interactive.
 * - Custom selection: every tile is a toggle button (aria-pressed) and
 *   drag-select works via pointer events — press on a tile decides the
 *   verb (select vs deselect from its current state), then sweeping over
 *   tiles applies that verb. Works with mouse and touch; keyboard users
 *   Tab + Space/Enter each tile as normal buttons.
 *
 * Zoom is a class swap: three grid density levels passed by the parent.
 */

interface PageGridProps {
  pageCount: number;
  /** dataUrl per page (index 0 = page 1); null = not rendered (yet). */
  thumbnails: (string | null)[];
  /** Pages included by the current plan (highlighted). */
  highlighted: Set<number>;
  /** Interactive selection mode (custom). */
  selectable: boolean;
  onToggle?: (page: number, selected: boolean) => void;
  /** Tailwind grid-template class controlling tile density (zoom). */
  gridClassName: string;
}

export function PageGrid({
  pageCount,
  thumbnails,
  highlighted,
  selectable,
  onToggle,
  gridClassName,
}: PageGridProps) {
  /** Drag verb: while pointer is down, apply this selected-state to every
   *  tile swept over. null = not dragging. */
  const dragVerbRef = useRef<boolean | null>(null);

  function beginDrag(page: number) {
    const verb = !highlighted.has(page);
    dragVerbRef.current = verb;
    onToggle?.(page, verb);
  }

  function sweep(page: number) {
    if (dragVerbRef.current === null) return;
    if (highlighted.has(page) !== dragVerbRef.current) {
      onToggle?.(page, dragVerbRef.current);
    }
  }

  function endDrag() {
    dragVerbRef.current = null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul
      aria-label={selectable ? "Select pages" : "Page previews"}
      className={`grid gap-3 ${gridClassName}`}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {pages.map((page) => {
        const thumb = thumbnails[page - 1] ?? null;
        const active = highlighted.has(page);

        const tile = (
          <>
            <span
              className={`flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-md border bg-surface ${
                active ? "border-primary" : "border-border"
              }`}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-contain motion-safe:animate-fade-in"
                />
              ) : (
                <span className="text-[10px] text-foreground-muted">
                  {page}
                </span>
              )}
            </span>
            <span
              className={`text-xs tabular-nums ${
                active ? "font-semibold text-foreground" : "text-foreground-muted"
              }`}
            >
              {page}
            </span>
          </>
        );

        if (!selectable) {
          return (
            <li
              key={page}
              className={`flex flex-col items-center gap-1 transition-opacity ${
                active ? "" : "opacity-45"
              }`}
            >
              {tile}
            </li>
          );
        }

        return (
          <li key={page} className="flex">
            <button
              type="button"
              aria-pressed={active}
              aria-label={`Page ${page}${active ? ", selected" : ""}`}
              onPointerDown={(event) => {
                // Left button / touch only; keep right-click free.
                if (event.button === 0) beginDrag(page);
              }}
              onPointerEnter={() => sweep(page)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  onToggle?.(page, !active);
                }
              }}
              className={`flex w-full flex-col items-center gap-1 rounded-lg p-1 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active ? "" : "opacity-45 hover:opacity-80"
              }`}
              style={{ touchAction: "none" }}
            >
              {tile}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
