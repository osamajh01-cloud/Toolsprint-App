"use client";

/* eslint-disable @next/next/no-img-element -- previews are blob: object
   URLs of user-local files; next/image optimization neither applies nor
   works for them. */

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  formatBytes,
  formatLabel,
  savingsPercent,
} from "@/lib/image-utils";
import type { CompressorItem } from "@/components/tools/image-compressor/types";

/**
 * components/tools/image-compressor/ImageItemCard.tsx
 *
 * One row of the compressor's result list: original vs compressed
 * previews, image information (dimensions, format, sizes), the savings
 * figure, and per-item actions (download, remove). Pure presentation —
 * all state lives in ImageCompressor; this card only renders an item and
 * reports clicks upward.
 */

interface ImageItemCardProps {
  item: CompressorItem;
  onDownload: (item: CompressorItem) => void;
  onRemove: (id: string) => void;
}

function Preview({
  src,
  label,
  sizeText,
}: {
  src: string | null;
  label: string;
  sizeText: string | null;
}) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1.5">
      <figcaption className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {sizeText && (
          <span className="ml-1.5 normal-case tracking-normal text-foreground">
            {sizeText}
          </span>
        )}
      </figcaption>
      <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
        {src ? (
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted-foreground">Compressing…</span>
        )}
      </div>
    </figure>
  );
}

export function ImageItemCard({
  item,
  onDownload,
  onRemove,
}: ImageItemCardProps) {
  const saved =
    item.status === "done" && item.compressedSize !== null
      ? savingsPercent(item.originalSize, item.compressedSize)
      : null;

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border p-4">
      {/* Header: filename + info badges + remove */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium" title={item.file.name}>
            {item.file.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.width && item.height
              ? `${item.width} × ${item.height} px · `
              : ""}
            {formatLabel(item.file.type)} · {formatBytes(item.originalSize)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.file.name}`}
        >
          Remove
        </Button>
      </div>

      {/* Previews */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Preview
          src={item.originalUrl}
          label="Original"
          sizeText={formatBytes(item.originalSize)}
        />
        <Preview
          src={item.status === "done" ? item.compressedUrl : null}
          label="Compressed"
          sizeText={
            item.status === "done" && item.compressedSize !== null
              ? formatBytes(item.compressedSize)
              : null
          }
        />
      </div>

      {/* Status row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="flex flex-wrap items-center gap-2">
          {item.status === "compressing" && (
            <span
              role="status"
              className="text-sm tabular-nums text-muted-foreground"
            >
              Compressing… {item.progress}%
            </span>
          )}
          {item.status === "error" && (
            <span role="alert" className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Couldn&apos;t compress:
              </span>{" "}
              {item.error}
            </span>
          )}
          {item.status === "done" && saved !== null && (
            <>
              <Badge variant="brand">
                {saved > 0 ? `−${saved}%` : "Already optimized"}
              </Badge>
              {saved > 0 && item.compressedSize !== null && (
                <span className="text-sm text-muted-foreground">
                  saved{" "}
                  {formatBytes(item.originalSize - item.compressedSize)}
                </span>
              )}
            </>
          )}
        </div>

        <Button
          size="sm"
          onClick={() => onDownload(item)}
          disabled={item.status !== "done"}
        >
          Download
        </Button>
      </div>

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
    </li>
  );
}
