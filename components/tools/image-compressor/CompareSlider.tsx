"use client";

import { useCallback, useRef, useState } from "react";

/**
 * components/tools/image-compressor/CompareSlider.tsx
 *
 * Interactive before/after comparison: the compressed image is the base
 * layer, the original sits on top clipped to the left of a draggable
 * divider — drag right to reveal more of the original, left for more of
 * the compressed result.
 *
 * Input support:
 * - Pointer events with setPointerCapture → one code path for mouse,
 *   touch, and pen. `touch-action: pan-y` keeps vertical page scrolling
 *   alive on phones while claiming horizontal drags.
 * - The handle is a focusable role="slider" with the standard keyboard
 *   contract: ←/→ move 2%, Shift+←/→ move 10%, Home/End jump to the ends;
 *   position is announced via aria-valuenow/aria-valuetext.
 *
 * Both images render absolutely with identical object-contain layout, so
 * the clip line always cuts through perfectly aligned pixels. The
 * checkerboard backdrop makes preserved transparency visible.
 */

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Accessible description of what is being compared. */
  alt: string;
}

export function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "Compressed",
  alt,
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const positionFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    setPosition(Math.min(100, Math.max(0, Math.round(ratio * 100))));
  }, []);

  function onPointerDown(event: React.PointerEvent) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    positionFromClientX(event.clientX);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (draggingRef.current) positionFromClientX(event.clientX);
  }

  function endDrag() {
    draggingRef.current = false;
  }

  function onHandleKeyDown(event: React.KeyboardEvent) {
    const step = event.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (event.key === "ArrowLeft") next = position - step;
    else if (event.key === "ArrowRight") next = position + step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    if (next !== null) {
      event.preventDefault();
      setPosition(Math.min(100, Math.max(0, next)));
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative h-64 w-full cursor-ew-resize select-none overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] motion-safe:animate-fade-in"
      style={{ touchAction: "pan-y" }}
    >
      {/* Base layer: compressed result */}
      {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs of local files */}
      <img
        src={afterSrc}
        alt={`${alt} — ${afterLabel.toLowerCase()}`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {/* Top layer: original, clipped to the left of the divider */}
      {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs of local files */}
      <img
        src={beforeSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-surface/85 px-2 py-0.5 text-[11px] font-medium">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-surface/85 px-2 py-0.5 text-[11px] font-medium">
        {afterLabel}
      </span>

      {/* Divider + keyboard handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Comparison divider for ${alt}: left of the line shows ${beforeLabel.toLowerCase()}, right shows ${afterLabel.toLowerCase()}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-valuetext={`${position}% ${beforeLabel.toLowerCase()}`}
        onKeyDown={onHandleKeyDown}
        className="absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none"
        style={{ left: `${position}%` }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 text-foreground-muted"
        >
          <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
        </svg>
      </div>
    </div>
  );
}
