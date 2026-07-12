/**
 * lib/json-tools.ts
 *
 * Pure JSON processing for the JSON Formatter tool: format, minify, and
 * validate with human-useful error locations. Framework-free and
 * unit-testable.
 */

export type JsonMode = "format" | "minify";

export type JsonResult =
  | { ok: true; output: string }
  | { ok: false; error: JsonError };

export interface JsonError {
  /** Human-readable message, without the noisy engine prefix. */
  message: string;
  /** 1-based, when the engine reports a position; otherwise undefined. */
  line?: number;
  column?: number;
}

/** Derive 1-based line/column from a character offset. */
function locate(text: string, position: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const end = Math.min(position, text.length);
  for (let i = 0; i < end; i++) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

/**
 * Parse the input and re-serialize it (2-space indent for "format",
 * compact for "minify"). On failure, extracts the character offset from
 * the engine's message ("… at position N") and converts it to line/column
 * ourselves — engines word their messages differently, but the offset is
 * reliable across them.
 */
export function processJson(input: string, mode: JsonMode): JsonResult {
  try {
    const parsed: unknown = JSON.parse(input);
    return {
      ok: true,
      output: JSON.stringify(parsed, null, mode === "format" ? 2 : 0),
    };
  } catch (caught) {
    const raw = caught instanceof Error ? caught.message : String(caught);
    const positionMatch = raw.match(/position (\d+)/i);

    if (positionMatch) {
      const { line, column } = locate(input, Number(positionMatch[1]));
      // Keep the useful head of the message ("Unexpected token …"), drop
      // the engine's own position/line suffix to avoid duplication.
      const message = raw.replace(/\s*(?:at|in)\s+(?:position|line)[\s\S]*$/i, "");
      return { ok: false, error: { message, line, column } };
    }

    return { ok: false, error: { message: raw } };
  }
}
