"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { CopyButton } from "@/components/tools/CopyButton";
import { PdfFileRow } from "@/components/tools/pdf-merge/PdfFileRow";
import { mergePdfBytes, readPageCount } from "@/components/tools/pdf-merge/merge";
import type { PdfItem } from "@/components/tools/pdf-merge/types";
import { formatBytes } from "@/lib/image-utils";

/**
 * components/tools/pdf-merge/PdfMerge.tsx
 *
 * Combine PDFs entirely on-device. Files arrive by drag & drop, the file
 * picker, or clipboard paste; each is parsed once for its page count
 * (then released — no decoded documents are held in memory). The user
 * orders the list by dragging rows or with Move up/down buttons, merges
 * with one click, and downloads the result. No network request exists in
 * this code path.
 *
 * Merge flow: bytes are (re)read from the File objects at merge time and
 * streamed through pdf-lib document-by-document, with a progress callback
 * ("Merging file i of N") and an event-loop yield between documents so
 * the UI keeps painting during large jobs. A generation guard drops the
 * result if the user cleared the list mid-merge.
 */

type Phase = "select" | "merging" | "done";

interface MergeOutput {
  url: string;
  size: number;
  pageCount: number;
  fileCount: number;
  filename: string;
}

const MAX_FILE_MB = 100;

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function PdfMerge() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [phase, setPhase] = useState<Phase>("select");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [output, setOutput] = useState<MergeOutput | null>(null);
  const [rejected, setRejected] = useState<string[]>([]);
  const [mergeError, setMergeError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const generationRef = useRef(0);
  const outputRef = useRef(output);
  outputRef.current = output;

  /* --------------------------- adding files --------------------------- */

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const bad: string[] = [];
    const accepted: File[] = [];

    for (const file of list) {
      if (!isPdf(file)) {
        bad.push(`${file.name || "clipboard file"} — only PDF files are supported`);
      } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
        bad.push(`${file.name} — larger than ${MAX_FILE_MB} MB`);
      } else {
        accepted.push(file);
      }
    }
    setRejected(bad);
    if (accepted.length === 0) return;

    const newItems: PdfItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      pageCount: null,
      status: "reading" as const,
    }));
    setItems((current) => [...current, ...newItems]);

    // Read page counts asynchronously; documents are discarded after.
    for (const item of newItems) {
      void (async () => {
        try {
          const bytes = await item.file.arrayBuffer();
          const pageCount = await readPageCount(bytes);
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? { ...entry, pageCount, status: "ready" }
                : entry,
            ),
          );
        } catch {
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id ? { ...entry, status: "error" } : entry,
            ),
          );
        }
      })();
    }
  }, []);

  // Paste PDFs anywhere on the page (where the browser supplies files).
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const files = event.clipboardData?.files;
      if (files && files.length > 0) {
        event.preventDefault();
        addFiles(files);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  // Revoke the output URL on unmount.
  useEffect(
    () => () => {
      if (outputRef.current) URL.revokeObjectURL(outputRef.current.url);
    },
    [],
  );

  /* ---------------------------- reordering ---------------------------- */

  function moveItem(id: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((entry) => entry.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function onRowDragOver(overId: string) {
    if (!draggingId || draggingId === overId) return;
    setItems((current) => {
      const from = current.findIndex((entry) => entry.id === draggingId);
      const to = current.findIndex((entry) => entry.id === overId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }

  function clearAll() {
    generationRef.current += 1; // abandon any in-flight merge result
    if (outputRef.current) URL.revokeObjectURL(outputRef.current.url);
    setItems([]);
    setOutput(null);
    setRejected([]);
    setMergeError(null);
    setPhase("select");
  }

  /* ------------------------------ merging ----------------------------- */

  const readyItems = useMemo(
    () => items.filter((entry) => entry.status === "ready"),
    [items],
  );

  async function merge() {
    if (readyItems.length < 2) return;
    generationRef.current += 1;
    const generation = generationRef.current;

    setPhase("merging");
    setMergeError(null);
    setProgress({ current: 0, total: readyItems.length });

    try {
      const sources: ArrayBuffer[] = [];
      for (const item of readyItems) {
        sources.push(await item.file.arrayBuffer());
      }

      const result = await mergePdfBytes(sources, (current, total) => {
        if (generation === generationRef.current) {
          setProgress({ current, total });
        }
      });
      if (generation !== generationRef.current) return;

      const blob = new Blob([result.bytes as BlobPart], {
        type: "application/pdf",
      });
      if (outputRef.current) URL.revokeObjectURL(outputRef.current.url);

      const date = new Date().toISOString().slice(0, 10);
      setOutput({
        url: URL.createObjectURL(blob),
        size: blob.size,
        pageCount: result.pageCount,
        fileCount: readyItems.length,
        filename: `merged-${date}.pdf`,
      });
      setPhase("done");
    } catch {
      if (generation !== generationRef.current) return;
      setMergeError(
        "The merge failed — one of the files may be corrupted or use unsupported encryption.",
      );
      setPhase("select");
    }
  }

  function downloadMerged() {
    if (!output) return;
    const anchor = document.createElement("a");
    anchor.href = output.url;
    anchor.download = output.filename;
    anchor.click();
  }

  /* ------------------------------ render ------------------------------ */

  const totalPages = readyItems.reduce(
    (sum, entry) => sum + (entry.pageCount ?? 0),
    0,
  );

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
          if (event.dataTransfer.files.length > 0) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragActive ? "border-brand bg-brand/5" : "border-border bg-muted/30"
        }`}
      >
        <p className="text-lg font-semibold">
          {items.length > 0 ? "+ Add more PDFs" : "Drop PDF files here"}
        </p>
        <p className="text-sm text-muted-foreground">
          …or paste from the clipboard where your browser supports it. Up to{" "}
          {MAX_FILE_MB} MB per file. Files never leave your device.
        </p>
        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="sr-only"
          aria-label="Choose PDF files to merge"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {/* Empty state: illustration + privacy bullets */}
      {items.length === 0 && phase === "select" && (
        <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-muted/20 px-6 py-10 text-center motion-safe:animate-fade-in">
          {/* Two documents flowing into one */}
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
              d="M10 14a4 4 0 0 1 4-4h26l10 10v40a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z"
              className="stroke-border fill-background"
            />
            <path d="M40 10v10h10M18 34h24M18 42h24M18 50h16" className="stroke-border" />
            <path
              d="M10 42a4 4 0 0 1 4-4h26l10 10v34a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z"
              transform="translate(6 6)"
              className="stroke-brand/50 fill-background"
            />
            <path d="M72 48h16m0 0-5-5m5 5-5 5" className="stroke-foreground" />
            <path
              d="M104 20a4 4 0 0 1 4-4h30l12 12v44a4 4 0 0 1-4 4h-38a4 4 0 0 1-4-4z"
              className="stroke-brand fill-brand/10"
            />
            <path d="M138 16v12h12M112 42h26M112 50h26M112 58h20" className="stroke-brand" />
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
              <span aria-hidden="true" className="text-brand">•</span> Original
              quality preserved
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

      {/* File list */}
      {items.length > 0 && (
        <section aria-label="Files to merge" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {items.length} {items.length === 1 ? "file" : "files"}
              </span>
              {totalPages > 0 && <> · {totalPages} pages total</>} — drag rows
              or use the arrows to set the merge order
            </p>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>

          <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
              <PdfFileRow
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                onMove={moveItem}
                onRemove={removeItem}
                onDragStart={setDraggingId}
                onDragOverRow={onRowDragOver}
                onDragEnd={() => setDraggingId(null)}
                isDragging={draggingId === item.id}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Merge error */}
      {mergeError && (
        <p role="alert" className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Merge failed:</span>{" "}
          {mergeError}
        </p>
      )}

      {/* Merge action / progress */}
      {items.length > 0 && phase !== "done" && (
        <div className="flex flex-col gap-3">
          <Button
            onClick={merge}
            disabled={phase === "merging" || readyItems.length < 2}
          >
            {phase === "merging"
              ? `Merging file ${progress.current} of ${progress.total}…`
              : `Merge ${readyItems.length} PDFs`}
          </Button>
          {readyItems.length < 2 && phase === "select" && (
            <p className="text-xs text-muted-foreground">
              Add at least two readable PDFs to merge.
            </p>
          )}
          {phase === "merging" && (
            <div
              role="progressbar"
              aria-label="Merging PDFs"
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

      {/* Success state */}
      {phase === "done" && output && (
        <section
          aria-label="Merged PDF"
          className="flex flex-col gap-5 rounded-xl border border-border bg-muted/20 p-6 motion-safe:animate-fade-in"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">✓ Merged</Badge>
            <p className="font-mono text-sm text-foreground">
              {output.filename}
            </p>
            <CopyButton
              text={output.filename}
              label="Copy filename"
              variant="ghost"
            />
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              dense
              label="Files merged"
              value={output.fileCount}
            />
            <StatCard dense label="Pages" value={output.pageCount} />
            <StatCard
              dense
              label="Final size"
              value={formatBytes(output.size)}
            />
          </dl>

          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadMerged}>Download merged PDF</Button>
            <Button variant="secondary" onClick={clearAll}>
              Merge another set
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
