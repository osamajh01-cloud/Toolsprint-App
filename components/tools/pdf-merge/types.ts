/**
 * components/tools/pdf-merge/types.ts
 *
 * Item model shared by PdfMerge (state owner) and PdfFileRow
 * (presentation). Tool-local UI state, so it stays in the tool folder.
 */

export interface PdfItem {
  id: string;
  file: File;
  /** null while the page count is being read. */
  pageCount: number | null;
  status: "reading" | "ready" | "error";
}
