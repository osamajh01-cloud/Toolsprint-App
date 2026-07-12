"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { removeDuplicateLines } from "@/lib/text-transform";

/**
 * components/tools/remove-duplicate-lines/RemoveDuplicateLines.tsx
 *
 * De-duplicate a list of lines with ignore-case, trim-whitespace, and
 * A→Z sort options; shows a live summary of how many lines were removed.
 * Logic lives in lib/text-transform (removeDuplicateLines).
 */
export function RemoveDuplicateLines() {
  const [input, setInput] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [sortLines, setSortLines] = useState(false);

  const result = useMemo(
    () =>
      removeDuplicateLines(input, { ignoreCase, trimWhitespace, sortLines }),
    [input, ignoreCase, trimWhitespace, sortLines],
  );

  const hasInput = input.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <ToolTextarea
        id="dedupe-input"
        label="Lines to de-duplicate"
        value={input}
        onChange={setInput}
        placeholder={"apples\nbananas\napples\ncherries\nbananas"}
        rows={8}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput("")}
            disabled={!hasInput}
          >
            Clear
          </Button>
        }
      />

      <fieldset className="flex flex-wrap gap-x-8 gap-y-3 rounded-xl border border-border p-4">
        <legend className="px-1.5 text-sm font-medium text-muted-foreground">
          Options
        </legend>
        <Checkbox
          id="dedupe-trim"
          label="Trim whitespace"
          hint="ignore leading/trailing spaces"
          checked={trimWhitespace}
          onChange={setTrimWhitespace}
        />
        <Checkbox
          id="dedupe-case"
          label="Ignore case"
          hint='"Apple" and "apple" match'
          checked={ignoreCase}
          onChange={setIgnoreCase}
        />
        <Checkbox
          id="dedupe-sort"
          label="Sort A to Z"
          hint="numeric-aware ordering"
          checked={sortLines}
          onChange={setSortLines}
        />
      </fieldset>

      {hasInput && (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {result.totalLines.toLocaleString()}{" "}
          {result.totalLines === 1 ? "line" : "lines"} →{" "}
          <span className="font-medium text-foreground">
            {result.uniqueLines.toLocaleString()} unique
          </span>
          {result.removedLines > 0 &&
            ` (${result.removedLines.toLocaleString()} removed)`}
        </p>
      )}

      <ToolOutput
        label="Unique lines"
        value={hasInput ? result.output : ""}
        placeholder="The de-duplicated list will appear here."
      />
    </div>
  );
}
