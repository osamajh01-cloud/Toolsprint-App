"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element -- previews are blob: object
   URLs of user-local files; next/image optimization neither applies nor
   works for them. */

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { CompareSlider } from "@/components/tools/image-compressor/CompareSlider";
import {
  formatBytes,
  formatLabel,
  savingsPercent,
} from "@/lib/image-utils";
import { formatDuration } from "@/lib/text-analysis";
import type { CompressorItem } from "@/components/tools/image-compressor/types";

/**
 * components/tools/image-compressor/ImageItemCard.tsx
 *
 * One image's full result panel: interactive before/after CompareSlider,
 * a statistics grid (sizes, savings, dimensions, format, upload time
 * saved at 10 Mbps), image-information badges (resolution status, color
 * format, transparency), and per-item actions. Presentation only — state
 * lives in ImageCompressor; the one exception is the transient download
 * feedback (busy → "Downloaded" badge), which is pure UI feedback and so
 * belongs to the card.
 */

interface ImageItemCardProps {
  item: CompressorItem;
  onDownload: (item: CompressorItem) => void;
  onRemove: (id: string) => void;
}

/** JPEG has no alpha channel; PNG/WebP do. */
function colorFormat(mimeType: string): string {
  return mimeType === "image/jpeg" ? "RGB (no alpha)" : "RGBA";
}

export function ImageItemCard({
  item,
  onDownload,
  onRemove,
}: ImageItemCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function handleDownload() {
    setDownloading(true);
    onDownload(item);
    // The blob save is effectively instant; hold the busy state briefly so
    // the button visibly responds, then land on the persistent badge.
    timerRef.current = window.setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 600);
  }

  const done = item.status === "done";
  const saved =
    done && item.compressedSize !== null
      ? savingsPercent(item.originalSize, item.compressedSize)
      : null;
  const savedBytes =
    done && item.compressedSize !== null
      ? item.originalSize - item.compressedSize
      : 0;
  const resolutionUnchanged =
    item.compressedWidth !== null &&
    item.compressedWidth === item.width &&
    item.compressedHeight === item.height;
  const supportsAlpha = item.file.type !== "image/jpeg";

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border p-4 transition-colors hover:border-brand/40 motion-safe:animate-fade-in">
      {/* Header: filename + remove */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="min-w-0 truncate font-medium" title={item.file.name}>
          {item.file.name}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.file.name}`}
        >
          Remove
        </Button>
      </div>

      {/* Image information badges */}
      <div className="flex flex-wrap gap-1.5" aria-label="Image information">
        {item.width !== null && item.height !== null && (
          <Badge variant="outline">
            {item.width} × {item.height} px
          </Badge>
        )}
        <Badge variant="outline">{formatLabel(item.file.type)}</Badge>
        <Badge variant="outline">{colorFormat(item.file.type)}</Badge>
        {done &&
          (resolutionUnchanged ? (
            <Badge>Resolution unchanged</Badge>
          ) : item.compressedWidth !== null ? (
            <Badge>
              Resized to {item.compressedWidth} × {item.compressedHeight} px
            </Badge>
          ) : null)}
        {done && supportsAlpha && <Badge>Transparency preserved</Badge>}
      </div>

      {/* Comparison: interactive once compressed, original + overlay before */}
      {done && item.compressedUrl ? (
        <CompareSlider
          beforeSrc={item.originalUrl}
          afterSrc={item.compressedUrl}
          alt={item.file.name}
        />
      ) : (
        <div className="relative h-64 w-full overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
          <img
            src={item.originalUrl}
            alt={item.file.name}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain opacity-60"
          />
          {item.status === "compressing" && (
            <span
              role="status"
              className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground"
            >
              Compressing… {item.progress}%
            </span>
          )}
        </div>
      )}

      {/* Per-item progress bar while compressing */}
      {item.status === "compressing" && (
        <div
          role="progressbar"
          aria-label={`Compressing ${item.file.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={item.progress}
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}

      {/* Error state */}
      {item.status === "error" && (
        <p role="alert" className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Couldn&apos;t compress:
          </span>{" "}
          {item.error}
        </p>
      )}

      {/* Statistics grid */}
      {done && item.compressedSize !== null && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            dense
            label="Original"
            value={formatBytes(item.originalSize)}
          />
          <StatCard
            dense
            label="Compressed"
            value={formatBytes(item.compressedSize)}
          />
          <StatCard
            dense
            label="Saved"
            value={savedBytes > 0 ? formatBytes(savedBytes) : "—"}
          />
          <StatCard
            dense
            label="Reduction"
            value={saved !== null && saved > 0 ? `−${saved}%` : "0%"}
          />
          <StatCard
            dense
            label="Dimensions"
            value={
              item.width !== null ? `${item.width}×${item.height}` : "—"
            }
          />
          <StatCard
            dense
            label="Upload time saved"
            value={
              savedBytes > 0
                ? `~${formatDuration((savedBytes * 8) / 10_000_000)}`
                : "—"
            }
            hint="at 10 Mbps"
          />
        </dl>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="flex flex-wrap items-center gap-2">
          {done && saved !== null && (
            <Badge variant="brand">
              {saved > 0 ? `−${saved}%` : "Already optimized"}
            </Badge>
          )}
          {downloaded && (
            <Badge className="motion-safe:animate-fade-in">
              ✓ Downloaded
            </Badge>
          )}
        </div>

        <Button
          size="sm"
          onClick={handleDownload}
          disabled={!done || downloading}
          aria-live="polite"
        >
          {downloading ? "Saving…" : downloaded ? "Download again" : "Download"}
        </Button>
      </div>
    </li>
  );
}
