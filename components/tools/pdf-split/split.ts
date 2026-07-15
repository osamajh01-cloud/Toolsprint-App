import { PDFDocument } from "pdf-lib";

/**
 * components/tools/pdf-split/split.ts
 *
 * Split planning + execution. Reuses the merge tool's PDF infrastructure:
 * readPageCount is imported from ../pdf-merge/merge (re-exported below for
 * this tool's UI), and page extraction uses the same pdf-lib copyPages
 * mechanism — pages are transplanted verbatim, never re-rendered.
 *
 * A "plan" is an ordered list of groups; each group (1-based page numbers)
 * becomes one output PDF, with a filename label. The five UI modes all
 * reduce to plans:
 *   ranges  "1-3,8,12-15" → three groups (one per comma token)
 *   pages   "1,5,8"       → ONE group with those pages
 *   every   —             → one single-page group per page
 *   everyN  n             → ceil(total/n) chunk groups
 *   custom  Set<number>   → ONE group with the checked pages
 */

export { readPageCount } from "@/components/tools/pdf-merge/merge";

export interface SplitGroup {
  /** 1-based page numbers, in output order. */
  pages: number[];
  /** Filename fragment, e.g. "pages-1-3" or "page-7". */
  label: string;
}

export type ParseResult =
  | { ok: true; groups: SplitGroup[] }
  | { ok: false; error: string };

function groupLabel(pages: number[]): string {
  if (pages.length === 1) return `page-${pages[0]}`;
  const contiguous = pages.every(
    (page, index) => index === 0 || page === pages[index - 1] + 1,
  );
  return contiguous
    ? `pages-${pages[0]}-${pages[pages.length - 1]}`
    : `pages-selection`;
}

/**
 * Parse "1-3, 8, 12-15" against the document's page count.
 * asGroups=true  → one group per comma token (range mode).
 * asGroups=false → all tokens flattened, deduped, sorted into one group
 *                  (single-pages mode).
 */
export function parsePageSelection(
  input: string,
  totalPages: number,
  asGroups: boolean,
): ParseResult {
  const tokens = input
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { ok: false, error: "Enter at least one page or range." };
  }

  const groups: number[][] = [];
  for (const token of tokens) {
    const single = token.match(/^(\d+)$/);
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);

    if (single) {
      const page = Number(single[1]);
      if (page < 1 || page > totalPages) {
        return {
          ok: false,
          error: `Page ${page} is out of range — this document has ${totalPages} pages.`,
        };
      }
      groups.push([page]);
    } else if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start > end) {
        return {
          ok: false,
          error: `"${token}" is reversed — write it as ${end}-${start}.`,
        };
      }
      if (start < 1 || end > totalPages) {
        return {
          ok: false,
          error: `"${token}" is out of range — this document has ${totalPages} pages.`,
        };
      }
      groups.push(
        Array.from({ length: end - start + 1 }, (_, index) => start + index),
      );
    } else {
      return {
        ok: false,
        error: `"${token}" isn't a page number or range like 12-15.`,
      };
    }
  }

  if (asGroups) {
    return {
      ok: true,
      groups: groups.map((pages) => ({ pages, label: groupLabel(pages) })),
    };
  }

  const flattened = [...new Set(groups.flat())].sort((a, b) => a - b);
  return { ok: true, groups: [{ pages: flattened, label: groupLabel(flattened) }] };
}

/** One single-page group per page: 1..total. */
export function planEveryPage(totalPages: number): SplitGroup[] {
  return Array.from({ length: totalPages }, (_, index) => ({
    pages: [index + 1],
    label: `page-${index + 1}`,
  }));
}

/** Chunks of n: 1-2, 3-4, … (last chunk may be shorter). */
export function planEveryN(totalPages: number, n: number): SplitGroup[] {
  const size = Math.max(1, Math.floor(n));
  const groups: SplitGroup[] = [];
  for (let start = 1; start <= totalPages; start += size) {
    const end = Math.min(start + size - 1, totalPages);
    const pages = Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
    groups.push({ pages, label: groupLabel(pages) });
  }
  return groups;
}

/** The checked pages, sorted, as one output document. */
export function planFromSelection(selected: Set<number>): SplitGroup[] {
  const pages = [...selected].sort((a, b) => a - b);
  if (pages.length === 0) return [];
  return [{ pages, label: groupLabel(pages) }];
}

export interface SplitOutput {
  bytes: Uint8Array;
  pageCount: number;
  label: string;
}

/**
 * Execute a plan: load the source once, copy each group's pages into a
 * fresh document. Yields between groups so progress paints during large
 * jobs; onProgress is 1-based.
 */
export async function splitPdf(
  source: ArrayBuffer,
  groups: SplitGroup[],
  onProgress?: (groupIndex: number, totalGroups: number) => void,
): Promise<SplitOutput[]> {
  const sourceDoc = await PDFDocument.load(source, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  const outputs: SplitOutput[] = [];
  for (let index = 0; index < groups.length; index++) {
    onProgress?.(index + 1, groups.length);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const group = groups[index];
    const output = await PDFDocument.create();
    const pages = await output.copyPages(
      sourceDoc,
      group.pages.map((page) => page - 1),
    );
    for (const page of pages) output.addPage(page);
    output.setProducer("ToolSprint PDF Split");

    outputs.push({
      bytes: await output.save(),
      pageCount: output.getPageCount(),
      label: group.label,
    });
  }

  return outputs;
}
