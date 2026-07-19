"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { useClipboardRead } from "@/hooks/use-clipboard";
import { decodeBase64, encodeBase64 } from "@/lib/base64";

/**
 * components/tools/base64-encoder/Base64Tool.tsx
 *
 * Encode text to Base64 or decode it back, live on every keystroke.
 * Unicode-safe conversion and input validation live in lib/base64;
 * invalid Base64 gets a clear error card (role="alert"), never mojibake.
 */

const MODES = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
] as const;

type Mode = (typeof MODES)[number]["value"];

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const { canPaste, read } = useClipboardRead();

  const result = useMemo(() => {
    if (!input) return null;
    return mode === "encode" ? encodeBase64(input) : decodeBase64(input);
  }, [input, mode]);

  async function paste() {
    const clipboard = await read();
    if (clipboard) setInput(clipboard);
  }

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        label="Direction"
        options={MODES}
        value={mode}
        onChange={setMode}
      />

      <ToolTextarea
        id="base64-input"
        label={mode === "encode" ? "Plain text" : "Base64 input"}
        value={input}
        onChange={setInput}
        placeholder={
          mode === "encode"
            ? "Any text — Unicode and emoji are handled correctly."
            : "SGVsbG8sIFRvb2xTcHJpbnQh"
        }
        rows={6}
        mono={mode === "decode"}
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

      {result && !result.ok && (
        <div
          role="alert"
          className="rounded-xl border border-border bg-surface-sunken p-4 text-sm"
        >
          <p className="font-semibold text-foreground">Can&apos;t decode this</p>
          <p className="mt-1 text-foreground-muted">{result.error}</p>
        </div>
      )}

      <ToolOutput
        label={mode === "encode" ? "Base64" : "Decoded text"}
        value={result?.ok ? result.output : ""}
        placeholder={
          result && !result.ok
            ? "Fix the input above to see the result."
            : "The result will appear here."
        }
        mono={mode === "encode"}
      />
    </div>
  );
}
