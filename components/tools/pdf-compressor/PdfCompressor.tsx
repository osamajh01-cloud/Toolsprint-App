"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { StatCard } from "@/components/ui/StatCard";
import { CopyButton } from "@/components/tools/CopyButton";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import {
  compressPdf,
  readPageCount,
  type CompressSettings,
  type ProgressStage,
} from "@/components/tools/pdf-compressor/compress";
import { formatBytes, savingsPercent } from "@/lib/image-utils";
import { formatDuration } from "@/lib/text-analysis";
import { downloadBlob, withSuffix } from "@/lib/download";

/**
 * components/tools/pdf-compressor/PdfCompressor.tsx
 *
 * UI over the compression engine (compress.ts). Five presets map onto one
 * settings object; touching any custom control switches to Custom — the
 * settings object is the single source of truth (same pattern as the
 * image compressor's quality model). Time-saved figures assume 10 Mbps
 * upload / 25 Mbps download and say so.
 *
 * Honesty in the UI: the pre-run size is labeled a rough estimate; the
 * result card reports how many embedded images were actually recompressed;
 * and a PDF that's already optimized yields "Already optimized" rather
 * than a fabricated saving (the engine never replaces with bigger data).
 */

type PresetKey =
  | "maximum"
  | "high"
  | "balanced"
  | "quality"
  | "minimal"
  | "custom";

const PRESETS = [
  { value: "maximum", label: "Maximum" },
  { value: "high", label: "High" },
  { value: "balanced", label: "Balanced" },
  { value: "quality", label: "High quality" },
  { value: "minimal", label: "Minimal" },
  { value: "custom", label: "Custom" },
] as const;

const PRESET_SETTINGS: Record<Exclude<PresetKey, "custom">, CompressSettings> =
  {
    maximum: {
      imageQuality: 35,
      imageDpi: 96,
      downscaleImages: true,
      removeThumbnails: true,
      removeMetadata: true,
      optimizeStructure: true,
    },
    high: {
      imageQuality: 50,
      imageDpi: 120,
      downscaleImages: true,
      removeThumbnails: true,
      removeMetadata: true,
      optimizeStructure: true,
    },
    balanced: {
      imageQuality: 65,
      imageDpi: 150,
      downscaleImages: true,
      removeThumbnails: true,
      removeMetadata: false,
      optimizeStructure: true,
    },
    quality: {
      imageQuality: 80,
      imageDpi: 220,
      downscaleImages: true,
      removeThumbnails: false,
      removeMetadata: false,
      optimizeStructure: true,
    },
    minimal: {
      imageQuality: 90,
      imageDpi: 300,
      downscaleImages: false,
      removeThumbnails: false,
      removeMetadata: false,
      optimizeStructure: true,
    },
  };

/** Rough pre-run estimate factor per preset (labeled as such in the UI). */
const ESTIMATE_FACTOR: Record<Exclude<PresetKey, "custom">, number> = {
  maximum: 0.35,
  high: 0.45,
  balanced: 0.6,
  quality: 0.75,
  minimal: 0.9,
};

const UPLOAD_MBPS = 10;
const DOWNLOAD_MBPS = 25;
const MAX_FILE_MB = 100;

type Phase = "empty" | "loading" | "ready" | "compressing" | "done";

interface LoadedFile {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

interface Result {
  blob: Blob;
  filename: string;
  pageCount: number;
  imagesFound: number;
  imagesRecompressed: number;
}

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function PdfCompressor() {
  const [phase, setPhase] = useState<Phase>("empty");
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [preset, setPreset] = useState<PresetKey>("balanced");
  const [settings, setSettings] = useState<CompressSettings>(
    PRESET_SETTINGS.balanced,
  );
  const [stage, setStage] = useState<{
    stage: ProgressStage;
    current: number;
    total: number;
  } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const generationRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------ intake ------------------------------ */

  const loadFile = useCallback(async (file: File) => {
    if (!isPdf(file)) {
      setError(`${file.name || "That file"} isn't a PDF.`);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`${file.name} is larger than ${MAX_FILE_MB} MB.`);
      return;
    }

    generationRef.current += 1;
    const generation = generationRef.current;
    setError(null);
    setResult(null);
    setPhase("loading");

    try {
      const bytes = await file.arrayBuffer();
      const pageCount = await readPageCount(bytes);
      if (generation !== generationRef.current) return;
      setLoaded({ file, name: file.name, size: file.size, pageCount });
      setPhase("ready");
    } catch {
      if (generation !== generationRef.current) return;
      setPhase("empty");
      setError(
        "This PDF couldn't be read — it may be corrupted or use unsupported encryption.",
      );
    }
  }, []);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const file = event.clipboardData?.files?.[0];
      if (file) {
        event.preventDefault();
        void loadFile(file);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  function reset() {
    generationRef.current += 1;
    setLoaded(null);
    setResult(null);
    setError(null);
    setStage(null);
    setPhase("empty");
  }

  /* ----------------------------- settings ----------------------------- */

  function applyPreset(next: PresetKey) {
    setPreset(next);
    if (next !== "custom") setSettings(PRESET_SETTINGS[next]);
  }

  function updateSetting<K extends keyof CompressSettings>(
    key: K,
    value: CompressSettings[K],
  ) {
    setPreset("custom");
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const estimatedSize = useMemo(() => {
    if (!loaded) return 0;
    const factor =
      preset !== "custom"
        ? ESTIMATE_FACTOR[preset]
        : 0.25 + (settings.imageQuality / 100) * 0.65;
    return Math.round(loaded.size * factor);
  }, [loaded, preset, settings.imageQuality]);

  /* ------------------------------ compress ---------------------------- */

  async function runCompress() {
    if (!loaded) return;
    generationRef.current += 1;
    const generation = generationRef.current;
    setPhase("compressing");
    setError(null);
    setStage({ stage: "scan", current: 0, total: 0 });

    try {
      const bytes = await loaded.file.arrayBuffer();
      const outcome = await compressPdf(bytes, settings, (s, current, total) => {
        if (generation === generationRef.current) {
          setStage({ stage: s, current, total });
        }
      });
      if (generation !== generationRef.current) return;

      setResult({
        blob: new Blob([outcome.bytes as BlobPart], { type: "application/pdf" }),
        filename: withSuffix(loaded.name, "-compressed"),
        pageCount: outcome.pageCount,
        imagesFound: outcome.imagesFound,
        imagesRecompressed: outcome.imagesRecompressed,
      });
      setPhase("done");
    } catch {
      if (generation !== generationRef.current) return;
      setError("Compression failed — please try reloading the file.");
      setPhase("ready");
    }
  }

  /* ------------------------------- render ----------------------------- */

  const saved = result && loaded ? loaded.size - result.blob.size : 0;
  const savedPct =
    result && loaded ? savingsPercent(loaded.size, result.blob.size) : 0;

  const stageText =
    stage?.stage === "images"
      ? `Recompressing image ${stage.current} of ${stage.total}…`
      : stage?.stage === "save"
        ? "Rebuilding the document…"
        : "Scanning the document…";

  return (
    <div className="flex flex-col gap-8">
      {/* Dropzone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void loadFile(file);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-primary bg-primary-subtle" : "border-border bg-surface-sunken"
        }`}
      >
        <p className="text-lg font-semibold">
          {loaded ? "Drop a different PDF to replace it" : "Drop a PDF here"}
        </p>
        <p className="text-sm text-foreground-muted">
          …or paste from the clipboard where supported. Up to {MAX_FILE_MB} MB.
          The file never leaves your device.
        </p>
        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          aria-label="Choose a PDF file to compress"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void loadFile(file);
            event.target.value = "";
          }}
        />
      </div>

      {/* Empty state */}
      {phase === "empty" && !error && (
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-surface-sunken px-6 py-10 text-center motion-safe:animate-fade-in">
          {/* A heavy document pressed into a lighter one */}
          <svg
            aria-hidden="true"
            viewBox="0 0 160 96"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-24 w-40"
          >
            <path
              d="M18 12a4 4 0 0 1 4-4h30l12 12v52a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"
              className="stroke-border fill-background"
            />
            <path d="M52 8v12h12M26 36h26M26 44h26M26 52h26M26 60h18" className="stroke-border" />
            <path d="M78 48h14m0 0-5-5m5 5-5 5" className="stroke-foreground" />
            <path
              d="M104 28a4 4 0 0 1 4-4h22l10 10v34a4 4 0 0 1-4 4h-28a4 4 0 0 1-4-4z"
              className="stroke-primary fill-primary-subtle"
            />
            <path d="M130 24v10h10M112 46h18M112 54h18" className="stroke-primary" />
            <path d="M112 12v6M120 8v10M128 12v6" className="stroke-primary/60" />
          </svg>

          <ul className="flex flex-col gap-1.5 text-sm text-foreground-muted sm:flex-row sm:gap-6">
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-primary">•</span> Nothing
              leaves your device
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-primary">•</span> Text stays
              sharp &amp; selectable
            </li>
            <li className="flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="text-primary">•</span> No
              uploads, no accounts
            </li>
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-foreground-muted">
          <span className="font-semibold text-foreground">
            Can&apos;t continue:
          </span>{" "}
          {error}
        </p>
      )}

      {phase === "loading" && (
        <p role="status" className="text-sm text-foreground-muted">
          Reading the document…
        </p>
      )}

      {loaded && phase !== "empty" && phase !== "loading" && (
        <>
          {/* File info */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-sunken p-4">
            <div className="min-w-0">
              <p className="truncate font-medium" title={loaded.name}>
                {loaded.name}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge variant="outline">
                  {loaded.pageCount} {loaded.pageCount === 1 ? "page" : "pages"}
                </Badge>
                <Badge variant="outline">{formatBytes(loaded.size)}</Badge>
                {phase !== "done" && (
                  <Badge>~{formatBytes(estimatedSize)} estimated</Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear
            </Button>
          </div>

          {/* Presets + custom settings */}
          {phase !== "done" && (
            <div className="flex flex-col gap-5 rounded-xl border border-border p-4">
              <SegmentedControl
                label="Compression mode"
                options={PRESETS}
                value={preset}
                onChange={applyPreset}
              />

              <Slider
                id="pdf-image-quality"
                label="Image quality"
                value={settings.imageQuality}
                onChange={(value) => updateSetting("imageQuality", value)}
                min={10}
                max={100}
                formatValue={(v) => `${v}%`}
              />

              <Slider
                id="pdf-image-dpi"
                label="Image DPI target"
                value={settings.imageDpi}
                onChange={(value) => updateSetting("imageDpi", value)}
                min={72}
                max={300}
                step={2}
                formatValue={(v) => `${v} DPI`}
                disabled={!settings.downscaleImages}
              />

              <fieldset className="flex flex-wrap gap-x-8 gap-y-3">
                <legend className="sr-only">Compression options</legend>
                <Checkbox
                  id="pdf-downscale"
                  label="Downscale large images"
                  hint={`caps images near ${settings.imageDpi} DPI`}
                  checked={settings.downscaleImages}
                  onChange={(value) => updateSetting("downscaleImages", value)}
                />
                <Checkbox
                  id="pdf-thumbs"
                  label="Remove embedded thumbnails"
                  hint="per-page preview images"
                  checked={settings.removeThumbnails}
                  onChange={(value) => updateSetting("removeThumbnails", value)}
                />
                <Checkbox
                  id="pdf-meta"
                  label="Remove metadata"
                  hint="title, author, keywords, XMP"
                  checked={settings.removeMetadata}
                  onChange={(value) => updateSetting("removeMetadata", value)}
                />
                <Checkbox
                  id="pdf-structure"
                  label="Optimize structure & fonts"
                  hint="object streams, where the format supports it"
                  checked={settings.optimizeStructure}
                  onChange={(value) => updateSetting("optimizeStructure", value)}
                />
              </fieldset>

              <p className="text-xs text-foreground-muted">
                Pages are never rasterized — text and vector graphics keep
                their original sharpness. Only embedded JPEG images are
                recompressed.
              </p>
            </div>
          )}

          {/* Compress action / progress */}
          {phase !== "done" && (
            <div className="flex flex-col gap-3">
              <Button onClick={runCompress} disabled={phase === "compressing"}>
                {phase === "compressing" ? stageText : "Compress PDF"}
              </Button>
              {phase === "compressing" && (
                <div
                  role="progressbar"
                  aria-label="Compressing PDF"
                  aria-valuemin={0}
                  aria-valuemax={stage?.total || 1}
                  aria-valuenow={stage?.stage === "images" ? stage.current : 0}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
                >
                  <div
                    className={`h-full rounded-full bg-primary transition-[width] duration-200 ${
                      stage?.stage !== "images" ? "animate-pulse" : ""
                    }`}
                    style={{
                      width:
                        stage?.stage === "images" && stage.total
                          ? `${(stage.current / stage.total) * 100}%`
                          : "100%",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {phase === "done" && result && (
            <section
              aria-label="Compression result"
              className="flex flex-col gap-5 rounded-xl border border-border bg-surface-sunken p-6 motion-safe:animate-fade-in"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">
                  {savedPct > 0 ? `✓ −${savedPct}%` : "Already optimized"}
                </Badge>
                <p className="font-mono text-sm">{result.filename}</p>
                <CopyButton
                  text={result.filename}
                  label="Copy filename"
                  variant="ghost"
                />
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard
                  dense
                  label="Original"
                  value={formatBytes(loaded.size)}
                />
                <StatCard
                  dense
                  label="Compressed"
                  value={formatBytes(result.blob.size)}
                />
                <StatCard
                  dense
                  label="Saved"
                  value={saved > 0 ? formatBytes(saved) : "—"}
                />
                <StatCard
                  dense
                  label="Ratio"
                  value={`${(result.blob.size / loaded.size).toFixed(2)}×`}
                  hint={`${result.pageCount} pages kept`}
                />
                <StatCard
                  dense
                  label="Upload time saved"
                  value={
                    saved > 0
                      ? `~${formatDuration((saved * 8) / (UPLOAD_MBPS * 1e6))}`
                      : "—"
                  }
                  hint={`at ${UPLOAD_MBPS} Mbps`}
                />
                <StatCard
                  dense
                  label="Download time saved"
                  value={
                    saved > 0
                      ? `~${formatDuration((saved * 8) / (DOWNLOAD_MBPS * 1e6))}`
                      : "—"
                  }
                  hint={`at ${DOWNLOAD_MBPS} Mbps`}
                />
              </dl>

              <p className="text-sm text-foreground-muted">
                {result.imagesFound > 0
                  ? `${result.imagesRecompressed} of ${result.imagesFound} embedded ${
                      result.imagesFound === 1 ? "image" : "images"
                    } recompressed — the rest were already smaller than a re-encode.`
                  : "No recompressible images were found; savings come from document structure and metadata."}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => downloadBlob(result.blob, result.filename)}
                >
                  Download PDF
                </Button>
                <Button variant="secondary" onClick={reset}>
                  Compress another PDF
                </Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
