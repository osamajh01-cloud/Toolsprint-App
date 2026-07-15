"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { PageGrid } from "@/components/tools/pdf-split/PageGrid";
import {
  parsePageSelection,
  planEveryN,
  planEveryPage,
  planFromSelection,
  readPageCount,
  splitPdf,
  type SplitGroup,
} from "@/components/tools/pdf-split/split";
import { formatBytes } from "@/lib/image-utils";
import { downloadBlob, downloadZip } from "@/lib/download";

/**
 * components/tools/pdf-split/PdfSplit.tsx
 *
 * Split one PDF five ways: page ranges (one output per range), single
 * pages (one combined output), every page, every N pages, or a visual
 * checkbox/drag selection on the thumbnail grid. The current mode+input
 * reduces to a "plan" (SplitGroup[]) via pure functions in split.ts; the
 * grid highlights exactly the pages the plan covers, and the summary line
 * (outputs, pages, estimated size) derives live from the same plan —
 * single source of truth, no drift.
 *
 * The loaded file's bytes are held once in a ref (needed for both
 * thumbnail rendering and splitting); thumbnails render progressively via
 * a cancellable sequential queue (see thumbnails.ts). pdfjs is imported
 * dynamically on file load, so the renderer costs nothing until a PDF is
 * actually dropped.
 */

type Mode = "ranges" | "pages" | "every" | "everyN" | "custom";
type Phase = "empty" | "loading" | "ready" | "splitting" | "done";

const MODES = [
  { value: "ranges", label: "Page ranges" },
  { value: "pages", label: "Single pages" },
  { value: "every", label: "Every page" },
  { value: "everyN", label: "Every N pages" },
  { value: "custom", label: "Pick visually" },
] as const;

const N_CHIPS = [
  { value: "2", label: "2" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
] as const;

const ZOOM_LEVELS = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
] as const;

const ZOOM_GRID: Record<string, string> = {
  s: "grid-cols-[repeat(auto-fill,minmax(64px,1fr))]",
  m: "grid-cols-[repeat(auto-fill,minmax(88px,1fr))]",
  l: "grid-cols-[repeat(auto-fill,minmax(120px,1fr))]",
};

interface LoadedFile {
  name: string;
  size: number;
  pageCount: number;
}

interface OutputDoc {
  blob: Blob;
  name: string;
  pageCount: number;
}

const MAX_FILE_MB = 100;

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function PdfSplit() {
  const [phase, setPhase] = useState<Phase>("empty");
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
  const [mode, setMode] = useState<Mode>("ranges");
  const [rangeInput, setRangeInput] = useState("");
  const [pagesInput, setPagesInput] = useState("");
  const [everyN, setEveryN] = useState(2);
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState<(typeof ZOOM_LEVELS)[number]["value"]>("m");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [outputs, setOutputs] = useState<OutputDoc[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const bytesRef = useRef<ArrayBuffer | null>(null);
  const generationRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------- file intake --------------------------- */

  const loadFile = useCallback(async (file: File) => {
    if (!isPdf(file)) {
      setLoadError(`${file.name || "That file"} isn't a PDF.`);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setLoadError(`${file.name} is larger than ${MAX_FILE_MB} MB.`);
      return;
    }

    generationRef.current += 1;
    const generation = generationRef.current;
    setLoadError(null);
    setOutputs([]);
    setSelection(new Set());
    setPhase("loading");

    try {
      const bytes = await file.arrayBuffer();
      const pageCount = await readPageCount(bytes.slice(0));
      if (generation !== generationRef.current) return;

      bytesRef.current = bytes;
      setLoaded({ name: file.name, size: file.size, pageCount });
      setThumbnails(new Array<string | null>(pageCount).fill(null));
      setPhase("ready");

      // Thumbnails: pdfjs is imported only now — first actual PDF load.
      const { renderThumbnails } = await import(
        "@/components/tools/pdf-split/thumbnails"
      );
      void renderThumbnails(
        bytes,
        pageCount,
        (pageNumber, dataUrl) => {
          setThumbnails((current) => {
            const next = [...current];
            next[pageNumber - 1] = dataUrl;
            return next;
          });
        },
        () => generation !== generationRef.current,
      );
    } catch {
      if (generation !== generationRef.current) return;
      setPhase("empty");
      setLoadError(
        "This PDF couldn't be read — it may be corrupted or use unsupported encryption.",
      );
    }
  }, []);

  // Paste a PDF anywhere on the page (where browsers supply files).
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

  // Cancel thumbnail rendering on unmount.
  useEffect(
    () => () => {
      generationRef.current += 1;
    },
    [],
  );

  function reset() {
    generationRef.current += 1;
    bytesRef.current = null;
    setLoaded(null);
    setThumbnails([]);
    setOutputs([]);
    setSelection(new Set());
    setRangeInput("");
    setPagesInput("");
    setLoadError(null);
    setPhase("empty");
  }

  /* ------------------------------- plan ------------------------------- */

  const plan: { groups: SplitGroup[]; error: string | null } = useMemo(() => {
    if (!loaded) return { groups: [], error: null };
    switch (mode) {
      case "ranges": {
        if (!rangeInput.trim()) return { groups: [], error: null };
        const parsed = parsePageSelection(rangeInput, loaded.pageCount, true);
        return parsed.ok
          ? { groups: parsed.groups, error: null }
          : { groups: [], error: parsed.error };
      }
      case "pages": {
        if (!pagesInput.trim()) return { groups: [], error: null };
        const parsed = parsePageSelection(pagesInput, loaded.pageCount, false);
        return parsed.ok
          ? { groups: parsed.groups, error: null }
          : { groups: [], error: parsed.error };
      }
      case "every":
        return { groups: planEveryPage(loaded.pageCount), error: null };
      case "everyN":
        return { groups: planEveryN(loaded.pageCount, everyN), error: null };
      case "custom":
        return { groups: planFromSelection(selection), error: null };
    }
  }, [loaded, mode, rangeInput, pagesInput, everyN, selection]);

  const highlighted = useMemo(
    () => new Set(plan.groups.flatMap((group) => group.pages)),
    [plan],
  );

  const plannedPages = highlighted.size;
  const estimatedSize =
    loaded && plannedPages > 0
      ? Math.round((loaded.size * plannedPages) / loaded.pageCount)
      : 0;

  /* ------------------------------ actions ----------------------------- */

  async function runSplit() {
    const bytes = bytesRef.current;
    if (!bytes || !loaded || plan.groups.length === 0) return;
    generationRef.current += 1;
    const generation = generationRef.current;

    setPhase("splitting");
    setProgress({ current: 0, total: plan.groups.length });

    const base = loaded.name.replace(/\.pdf$/i, "");
    try {
      const results = await splitPdf(bytes.slice(0), plan.groups, (i, t) => {
        if (generation === generationRef.current) {
          setProgress({ current: i, total: t });
        }
      });
      if (generation !== generationRef.current) return;

      setOutputs(
        results.map((result) => ({
          blob: new Blob([result.bytes as BlobPart], { type: "application/pdf" }),
          name: `${base}-${result.label}.pdf`,
          pageCount: result.pageCount,
        })),
      );
      setPhase("done");
    } catch {
      if (generation !== generationRef.current) return;
      setLoadError("The split failed — please try reloading the file.");
      setPhase("ready");
    }
  }

  async function downloadAllAsZip() {
    if (outputs.length === 0 || !loaded) return;
    setZipping(true);
    try {
      await downloadZip(
        outputs.map((output) => ({ name: output.name, blob: output.blob })),
        `${loaded.name.replace(/\.pdf$/i, "")}-split.zip`,
      );
    } finally {
      setZipping(false);
    }
  }

  const totalOutputSize = outputs.reduce((sum, output) => sum + output.blob.size, 0);
  const totalOutputPages = outputs.reduce((sum, output) => sum + output.pageCount, 0);
  const renderedCount = thumbnails.filter(Boolean).length;

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
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void loadFile(file);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-brand bg-brand/5" : "border-border bg-muted/30"
        }`}
      >
        <p className="text-lg font-semibold">
          {loaded ? "Drop a different PDF to replace it" : "Drop a PDF here"}
        </p>
        <p className="text-sm text-muted-foreground">
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
          aria-label="Choose a PDF file to split"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void loadFile(file);
            event.target.value = "";
          }}
        />
      </div>

      {/* Empty state */}
      {phase === "empty" && !loadError && (
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-muted/20 px-6 py-10 text-center motion-safe:animate-fade-in">
          {/* One document fanning out into parts */}
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
              d="M14 16a4 4 0 0 1 4-4h30l12 12v44a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z"
              className="stroke-brand fill-brand/10"
            />
            <path d="M48 12v12h12M22 40h26M22 48h26M22 56h18" className="stroke-brand" />
            <path d="M72 48h14m0 0-5-5m5 5-5 5" className="stroke-foreground" />
            <path
              d="M100 12a3 3 0 0 1 3-3h20l8 8v20a3 3 0 0 1-3 3h-25a3 3 0 0 1-3-3z"
              className="stroke-border fill-background"
            />
            <path
              d="M100 56a3 3 0 0 1 3-3h20l8 8v20a3 3 0 0 1-3 3h-25a3 3 0 0 1-3-3z"
              className="stroke-border fill-background"
            />
            <path d="M106 22h16M106 28h12M106 66h16M106 72h12" className="stroke-border" />
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
              <span aria-hidden="true" className="text-brand">•</span> Visual
              page previews
            </li>
          </ul>
        </div>
      )}

      {loadError && (
        <p role="alert" className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Can&apos;t use that file:</span>{" "}
          {loadError}
        </p>
      )}

      {phase === "loading" && (
        <p role="status" className="text-sm text-muted-foreground">
          Reading the document…
        </p>
      )}

      {/* Loaded file: info, modes, grid, action */}
      {loaded && (phase === "ready" || phase === "splitting" || phase === "done") && (
        <>
          {/* File info */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium" title={loaded.name}>
                {loaded.name}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge variant="outline">
                  {loaded.pageCount} {loaded.pageCount === 1 ? "page" : "pages"}
                </Badge>
                <Badge variant="outline">{formatBytes(loaded.size)}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear
            </Button>
          </div>

          {/* Mode + inputs */}
          <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <SegmentedControl
              label="Split mode"
              options={MODES}
              value={mode}
              onChange={setMode}
            />

            {mode === "ranges" && (
              <Input
                id="split-ranges"
                label="Page ranges (each range becomes its own PDF)"
                value={rangeInput}
                onChange={setRangeInput}
                placeholder="1-3, 8, 12-15"
                hint={`Pages 1–${loaded.pageCount}. Separate ranges with commas.`}
                autoComplete="off"
                spellCheck={false}
              />
            )}

            {mode === "pages" && (
              <Input
                id="split-pages"
                label="Pages to extract (into one PDF)"
                value={pagesInput}
                onChange={setPagesInput}
                placeholder="1, 5, 8, 20"
                hint={`Pages 1–${loaded.pageCount}. Ranges like 4-6 work here too.`}
                autoComplete="off"
                spellCheck={false}
              />
            )}

            {mode === "everyN" && (
              <div className="flex flex-wrap items-end gap-4">
                <SegmentedControl
                  label="Pages per PDF"
                  options={N_CHIPS}
                  value={String(everyN)}
                  onChange={(next) => setEveryN(Number(next))}
                />
                <Input
                  id="split-every-n"
                  label="Custom"
                  type="number"
                  min={1}
                  max={loaded.pageCount}
                  value={String(everyN)}
                  onChange={(next) => {
                    const parsed = Math.max(1, Math.floor(Number(next) || 1));
                    setEveryN(Math.min(parsed, loaded.pageCount));
                  }}
                  className="w-28"
                />
              </div>
            )}

            {mode === "custom" && (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Click or drag across pages below to select them.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelection(
                      new Set(
                        Array.from({ length: loaded.pageCount }, (_, i) => i + 1),
                      ),
                    )
                  }
                >
                  Select all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelection(new Set())}
                  disabled={selection.size === 0}
                >
                  Select none
                </Button>
              </div>
            )}

            {plan.error && (
              <p role="alert" className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Check your input:
                </span>{" "}
                {plan.error}
              </p>
            )}

            {/* Live plan summary */}
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {plan.groups.length > 0 ? (
                <>
                  Will create{" "}
                  <span className="font-semibold text-foreground">
                    {plan.groups.length}{" "}
                    {plan.groups.length === 1 ? "PDF" : "PDFs"}
                  </span>{" "}
                  covering {plannedPages}{" "}
                  {plannedPages === 1 ? "page" : "pages"} · estimated{" "}
                  {formatBytes(estimatedSize)} total
                </>
              ) : (
                "No pages selected yet."
              )}
            </p>
          </div>

          {/* Preview grid + zoom */}
          <section aria-label="Page previews" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                {mode === "custom" ? "Select pages" : "Preview"}
                {renderedCount < Math.min(loaded.pageCount, 300) && (
                  <span role="status" className="ml-2 text-xs">
                    rendering previews… {renderedCount}/
                    {Math.min(loaded.pageCount, 300)}
                  </span>
                )}
              </p>
              <SegmentedControl
                label="Thumbnail size"
                options={ZOOM_LEVELS}
                value={zoom}
                onChange={setZoom}
              />
            </div>
            <PageGrid
              pageCount={loaded.pageCount}
              thumbnails={thumbnails}
              highlighted={highlighted}
              selectable={mode === "custom"}
              onToggle={(page, selected) =>
                setSelection((current) => {
                  const next = new Set(current);
                  if (selected) next.add(page);
                  else next.delete(page);
                  return next;
                })
              }
              gridClassName={ZOOM_GRID[zoom]}
            />
          </section>

          {/* Split action / progress */}
          {phase !== "done" && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={runSplit}
                disabled={phase === "splitting" || plan.groups.length === 0}
              >
                {phase === "splitting"
                  ? `Creating PDF ${progress.current} of ${progress.total}…`
                  : plan.groups.length > 0
                    ? `Split into ${plan.groups.length} ${plan.groups.length === 1 ? "PDF" : "PDFs"}`
                    : "Split"}
              </Button>
              {phase === "splitting" && (
                <div
                  role="progressbar"
                  aria-label="Splitting PDF"
                  aria-valuemin={0}
                  aria-valuemax={progress.total}
                  aria-valuenow={progress.current}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-200"
                    style={{
                      width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {phase === "done" && outputs.length > 0 && (
            <section
              aria-label="Split results"
              className="flex flex-col gap-5 rounded-xl border border-border bg-muted/20 p-6 motion-safe:animate-fade-in"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">✓ Split complete</Badge>
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard dense label="PDFs created" value={outputs.length} />
                <StatCard dense label="Pages exported" value={totalOutputPages} />
                <StatCard
                  dense
                  label="Total size"
                  value={formatBytes(totalOutputSize)}
                />
              </dl>

              <ul className="flex flex-col gap-2" aria-label="Generated PDFs">
                {outputs.map((output) => (
                  <li
                    key={output.name}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm" title={output.name}>
                        {output.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {output.pageCount}{" "}
                        {output.pageCount === 1 ? "page" : "pages"} ·{" "}
                        {formatBytes(output.blob.size)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadBlob(output.blob, output.name)}
                    >
                      Download
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {outputs.length > 1 && (
                  <Button onClick={downloadAllAsZip} disabled={zipping}>
                    {zipping ? "Zipping…" : "Download all as ZIP"}
                  </Button>
                )}
                <Button variant="secondary" onClick={reset}>
                  Split another PDF
                </Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
