"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ImageItemCard } from "@/components/tools/image-compressor/ImageItemCard";
import type { CompressorItem } from "@/components/tools/image-compressor/types";
import {
  formatBytes,
  getImageDimensions,
  isSupportedImage,
  savingsPercent,
} from "@/lib/image-utils";
import { formatDuration } from "@/lib/text-analysis";

/**
 * components/tools/image-compressor/ImageCompressor.tsx
 *
 * Batch image compression, 100% on-device. Files come in via drag & drop,
 * the file picker, or clipboard paste; each becomes a CompressorItem and
 * is re-encoded by browser-image-compression IN A WEB WORKER, so even
 * large photos never block the UI thread. No network request is made at
 * any point — verifiable in DevTools.
 *
 * Quality model: presets (Low/Medium/High/Maximum) drive the 10–100
 * slider; moving the slider switches to Custom. "Auto" hands the target
 * to the library instead (aim for half the original size at its default
 * quality search). Quality changes recompress every item live, with two
 * safeguards:
 *   - a 300 ms settle timer so dragging the slider doesn't queue dozens
 *     of worker jobs, and
 *   - a generation counter so results from a superseded run are dropped
 *     (never rendered over newer ones).
 *
 * Memory: object URLs are revoked on recompress, remove, clear, and
 * unmount; dimension reads close their ImageBitmap immediately. The ZIP
 * writer (fflate) is imported only inside the download handler, so it
 * costs nothing until the moment it's used.
 */

type QualityMode = "low" | "medium" | "high" | "maximum" | "auto" | "custom";

const QUALITY_PRESETS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "maximum", label: "Maximum" },
  { value: "auto", label: "Auto" },
] as const;

/** 100 → 10 in steps of ten; chip active when the slider sits on it. */
const PERCENT_CHIPS = Array.from({ length: 10 }, (_, index) => {
  const value = 100 - index * 10;
  return { value: String(value), label: `${value}%` };
});

const PRESET_VALUES: Partial<Record<QualityMode, number>> = {
  low: 40,
  medium: 60,
  high: 80,
  maximum: 95,
};

const MAX_FILE_MB = 50;

export function ImageCompressor() {
  const [items, setItems] = useState<CompressorItem[]>([]);
  const [mode, setMode] = useState<QualityMode>("high");
  const [quality, setQuality] = useState(80);
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [zipping, setZipping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Bumped on every settings change; stale worker results are dropped. */
  const generationRef = useRef(0);
  /** Live view of items for the unmount cleanup. */
  const itemsRef = useRef(items);
  itemsRef.current = items;

  /* ------------------------- compression core ------------------------- */

  const compressItem = useCallback(
    async (item: CompressorItem, generation: number) => {
      const options =
        mode === "auto"
          ? {
              maxSizeMB: Math.max(0.1, item.originalSize / 1024 / 1024 / 2),
              useWebWorker: true,
              fileType: item.file.type,
            }
          : {
              initialQuality: quality / 100,
              alwaysKeepResolution: true,
              useWebWorker: true,
              fileType: item.file.type,
              // Effectively "quality only": don't chase a size target.
              maxSizeMB: Number.POSITIVE_INFINITY,
              onProgress: (progress: number) => {
                if (generation !== generationRef.current) return;
                setItems((current) =>
                  current.map((entry) =>
                    entry.id === item.id && entry.status === "compressing"
                      ? { ...entry, progress: Math.round(progress) }
                      : entry,
                  ),
                );
              },
            };

      try {
        const result = await imageCompression(item.file, options);
        if (generation !== generationRef.current) return;

        // Result dimensions: proves "resolution unchanged" (manual mode)
        // or reveals Auto's downscale honestly.
        let resultDims: { width: number; height: number } | null = null;
        try {
          resultDims = await getImageDimensions(result);
        } catch {
          /* dimensions stay unknown */
        }
        if (generation !== generationRef.current) return;

        setItems((current) =>
          current.map((entry) => {
            if (entry.id !== item.id) return entry;
            if (entry.compressedUrl) URL.revokeObjectURL(entry.compressedUrl);

            // If re-encoding didn't help (common for optimized PNGs),
            // fall back to the original — never ship a bigger "compressed" file.
            const useOriginal = result.size >= entry.originalSize;
            const blob: Blob = useOriginal ? entry.file : result;

            return {
              ...entry,
              status: "done",
              progress: 100,
              compressedBlob: blob,
              compressedUrl: URL.createObjectURL(blob),
              compressedSize: blob.size,
              compressedWidth: useOriginal ? entry.width : (resultDims?.width ?? null),
              compressedHeight: useOriginal ? entry.height : (resultDims?.height ?? null),
              error: null,
            };
          }),
        );
      } catch {
        if (generation !== generationRef.current) return;
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: "error",
                  error:
                    "this image could not be re-encoded. It may be corrupted or in an unsupported variant.",
                }
              : entry,
          ),
        );
      }
    },
    [mode, quality],
  );

  /* --------------------------- adding files --------------------------- */

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const bad: string[] = [];
      const accepted: File[] = [];

      for (const file of list) {
        if (!isSupportedImage(file)) {
          bad.push(`${file.name || "clipboard image"} — only JPEG, PNG, and WebP are supported`);
        } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
          bad.push(`${file.name} — larger than ${MAX_FILE_MB} MB`);
        } else {
          accepted.push(file);
        }
      }
      setRejected(bad);
      if (accepted.length === 0) return;

      const generation = generationRef.current;
      const newItems: CompressorItem[] = await Promise.all(
        accepted.map(async (file) => {
          let dimensions: { width: number; height: number } | null = null;
          try {
            dimensions = await getImageDimensions(file);
          } catch {
            /* dimensions stay unknown; compression can still proceed */
          }
          return {
            id: crypto.randomUUID(),
            file,
            originalUrl: URL.createObjectURL(file),
            width: dimensions?.width ?? null,
            height: dimensions?.height ?? null,
            originalSize: file.size,
            status: "compressing" as const,
            progress: 0,
            compressedBlob: null,
            compressedUrl: null,
            compressedSize: null,
            compressedWidth: null,
            compressedHeight: null,
            error: null,
          };
        }),
      );

      setItems((current) => [...current, ...newItems]);
      newItems.forEach((item) => void compressItem(item, generation));
    },
    [compressItem],
  );

  /* ------------------ recompress on settings change ------------------ */

  const isFirstSettingsRun = useRef(true);
  useEffect(() => {
    if (isFirstSettingsRun.current) {
      isFirstSettingsRun.current = false;
      return;
    }
    generationRef.current += 1;
    const generation = generationRef.current;
    const snapshot = itemsRef.current;
    if (snapshot.length === 0) return;

    // Settle timer: recompress once the slider stops moving for 300 ms.
    const timer = window.setTimeout(() => {
      if (generation !== generationRef.current) return;
      setItems((current) =>
        current.map((entry) => ({
          ...entry,
          status: "compressing",
          progress: 0,
        })),
      );
      snapshot.forEach((item) => void compressItem(item, generation));
    }, 300);

    return () => window.clearTimeout(timer);
    // compressItem is memoized on [mode, quality], so depending on it
    // re-runs this effect exactly when the settings change.
  }, [compressItem]);

  /* ----------------------------- intake UX ---------------------------- */

  // Paste an image anywhere on the page.
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const files = event.clipboardData?.files;
      if (files && files.length > 0) {
        event.preventDefault();
        void addFiles(files);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  // Revoke every object URL on unmount.
  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      }
    },
    [],
  );

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files.length > 0) {
      void addFiles(event.dataTransfer.files);
    }
  }

  /* ------------------------------ actions ----------------------------- */

  function removeItem(id: string) {
    setItems((current) => {
      const target = current.find((entry) => entry.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearAll() {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    }
    setItems([]);
    setRejected([]);
  }

  function compressedName(name: string): string {
    const dot = name.lastIndexOf(".");
    return dot > 0
      ? `${name.slice(0, dot)}-compressed${name.slice(dot)}`
      : `${name}-compressed`;
  }

  function downloadItem(item: CompressorItem) {
    if (!item.compressedBlob) return;
    const url = URL.createObjectURL(item.compressedBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = compressedName(item.file.name);
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadZip() {
    const done = itemsRef.current.filter(
      (entry) => entry.status === "done" && entry.compressedBlob,
    );
    if (done.length === 0) return;
    setZipping(true);
    try {
      // fflate is loaded only here — first ZIP click, not before.
      const { zip } = await import("fflate");

      const entries: Record<string, Uint8Array> = {};
      const used = new Set<string>();
      for (const item of done) {
        let name = compressedName(item.file.name);
        let counter = 2;
        while (used.has(name)) {
          const dot = name.lastIndexOf(".");
          name =
            dot > 0
              ? `${name.slice(0, dot)}-${counter}${name.slice(dot)}`
              : `${name}-${counter}`;
          counter += 1;
        }
        used.add(name);
        entries[name] = new Uint8Array(
          await item.compressedBlob!.arrayBuffer(),
        );
      }

      const data = await new Promise<Uint8Array>((resolve, reject) => {
        // level 0: the images are already compressed; deflating them
        // again wastes CPU for ~0% gain.
        zip(entries, { level: 0 }, (error, result) =>
          error ? reject(error) : resolve(result),
        );
      });

      const blob = new Blob([data as BlobPart], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "toolsprint-compressed-images.zip";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  }

  /* ------------------------------ totals ------------------------------ */

  const totals = useMemo(() => {
    const done = items.filter(
      (entry) => entry.status === "done" && entry.compressedSize !== null,
    );
    const original = done.reduce((sum, entry) => sum + entry.originalSize, 0);
    const compressed = done.reduce(
      (sum, entry) => sum + (entry.compressedSize ?? 0),
      0,
    );
    return { doneCount: done.length, original, compressed };
  }, [items]);

  const anyCompressing = items.some((entry) => entry.status === "compressing");

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="flex flex-col gap-8">
      {/* Dropzone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragActive ? "border-brand bg-brand/5" : "border-border bg-muted/30"
        }`}
      >
        <p className="text-lg font-semibold">
          {items.length > 0
            ? "+ Add more images"
            : "Drop JPEG, PNG, or WebP images here"}
        </p>
        <p className="text-sm text-muted-foreground">
          …or paste from the clipboard (Ctrl/Cmd&nbsp;+&nbsp;V). Up to{" "}
          {MAX_FILE_MB} MB per file. Images never leave your device.
        </p>
        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label="Choose images to compress"
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
            event.target.value = ""; // allow re-selecting the same file
          }}
        />
      </div>

      {/* Empty state: privacy story + illustration, until images arrive */}
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-muted/20 px-6 py-10 text-center motion-safe:animate-fade-in">
          {/* Illustration: a photo shrinking, drawn with theme tokens */}
          <svg
            aria-hidden="true"
            viewBox="0 0 160 96"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-24 w-40"
          >
            <rect
              x="6"
              y="6"
              width="84"
              height="64"
              rx="8"
              className="stroke-border fill-background"
            />
            <circle cx="30" cy="28" r="7" className="stroke-brand" />
            <path d="m14 62 20-20 14 12 16-16 22 24" className="stroke-brand" />
            <rect
              x="112"
              y="34"
              width="42"
              height="32"
              rx="6"
              className="stroke-brand fill-brand/10"
            />
            <circle cx="124" cy="45" r="3.5" className="stroke-brand" />
            <path d="m116 62 10-10 7 6 8-8 11 12" className="stroke-brand" />
            <path d="M94 50h12m0 0-5-5m5 5-5 5" className="stroke-foreground" />
          </svg>

          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-brand">•</span> Nothing
              leaves your device
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-brand">•</span> No
              uploads, no accounts
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-brand">•</span> Fast
              in-browser processing
            </li>
          </ul>
        </div>
      )}

      {/* Rejected files */}
      {rejected.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-border bg-muted/40 p-4 text-sm"
        >
          <p className="font-semibold text-foreground">
            {rejected.length} {rejected.length === 1 ? "file was" : "files were"}{" "}
            skipped
          </p>
          <ul className="mt-1 list-inside list-disc text-muted-foreground">
            {rejected.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quality controls */}
      <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
        <SegmentedControl
          label="Quality preset"
          options={QUALITY_PRESETS}
          value={mode /* "custom" matches no chip — intentionally */}
          onChange={(next) => {
            setMode(next);
            const preset = PRESET_VALUES[next];
            if (preset !== undefined) setQuality(preset);
          }}
        />
        <Slider
          id="compressor-quality"
          label={mode === "auto" ? "Quality (managed by Auto)" : "Quality"}
          value={quality}
          onChange={(next) => {
            setQuality(next);
            setMode("custom");
          }}
          min={10}
          max={100}
          formatValue={(v) => `${v}%`}
          disabled={mode === "auto"}
        />
        {mode !== "auto" && (
          <SegmentedControl
            label="Quality percentage"
            options={PERCENT_CHIPS}
            value={String(quality)}
            onChange={(next) => {
              setQuality(Number(next));
              setMode("custom");
            }}
          />
        )}
        <p className="text-xs text-muted-foreground">
          {mode === "auto"
            ? "Auto targets roughly half the original file size per image."
            : "Changing quality recompresses every image below, live."}
        </p>
      </div>

      {/* Totals + batch actions */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {anyCompressing ? (
              <span role="status">Compressing {items.length === 1 ? "image" : "images"}…</span>
            ) : totals.doneCount > 0 ? (
              <>
                <span className="font-semibold text-foreground">
                  {formatBytes(totals.original)} →{" "}
                  {formatBytes(totals.compressed)}
                </span>{" "}
                across {totals.doneCount}{" "}
                {totals.doneCount === 1 ? "image" : "images"} — saved{" "}
                {formatBytes(totals.original - totals.compressed)} of storage (
                {savingsPercent(totals.original, totals.compressed)}%) and ~
                {formatDuration(
                  ((totals.original - totals.compressed) * 8) / 10_000_000,
                )}{" "}
                of upload time at 10 Mbps
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {totals.doneCount > 1 && (
              <Button size="sm" onClick={downloadZip} disabled={zipping}>
                {zipping ? "Zipping…" : "Download all as ZIP"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <ul aria-label="Images" className="flex flex-col gap-4">
          {items.map((item) => (
            <ImageItemCard
              key={item.id}
              item={item}
              onDownload={downloadItem}
              onRemove={removeItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
