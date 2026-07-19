"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { useClipboardRead } from "@/hooks/use-clipboard";
import { processJson, type JsonMode } from "@/lib/json-tools";

/**
 * components/tools/json-formatter/JsonFormatter.tsx
 *
 * Format / minify / validate JSON with live processing on every keystroke
 * (the "auto formatting while typing" requirement — no Run button). All
 * parsing lives in lib/json-tools; this component is state + composition
 * of the shared tool blocks.
 */

const MODES = [
  { value: "format", label: "Format (2-space)" },
  { value: "minify", label: "Minify" },
] as const;

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<JsonMode>("format");
  const { canPaste, read } = useClipboardRead();

  const result = useMemo(
    () => (input.trim() ? processJson(input, mode) : null),
    [input, mode],
  );

  async function paste() {
    const clipboard = await read();
    if (clipboard) setInput(clipboard);
  }

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        label="Output mode"
        options={MODES}
        value={mode}
        onChange={setMode}
      />

      <ToolTextarea
        id="json-input"
        label="JSON input"
        value={input}
        onChange={setInput}
        placeholder='{"paste": "your JSON here", "formats": "as you type"}'
        rows={10}
        mono
        actions={
          <>
            {canPaste && (
              <Button variant="secondary" size="sm" onClick={paste}>
                Paste
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              disabled={!input}
            >
              Clear
            </Button>
          </>
        }
      />

      {/* Validation status — announced when it changes */}
      {result && (
        <div aria-live="polite">
          {result.ok ? (
            <Badge variant="primary">Valid JSON</Badge>
          ) : (
            <div
              role="alert"
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface-sunken p-4 text-sm"
            >
              <p className="font-semibold text-foreground">Invalid JSON</p>
              <p className="font-mono text-foreground-muted">
                {result.error.message}
                {result.error.line !== undefined &&
                  ` — line ${result.error.line}, column ${result.error.column}`}
              </p>
            </div>
          )}
        </div>
      )}

      <ToolOutput
        label={mode === "format" ? "Formatted JSON" : "Minified JSON"}
        value={result?.ok ? result.output : ""}
        placeholder={
          result && !result.ok
            ? "Fix the error above to see the result."
            : "Formatted output will appear here."
        }
        mono
      />
    </div>
  );
}
