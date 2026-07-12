"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { reverseText, type ReverseMode } from "@/lib/text-transform";

/**
 * components/tools/text-reverser/TextReverser.tsx
 *
 * Reverse characters (grapheme-aware — emoji survive), word order, or
 * line order. Logic lives in lib/text-transform (reverseText).
 */

const MODES = [
  { value: "characters", label: "Characters" },
  { value: "words", label: "Words" },
  { value: "lines", label: "Lines" },
] as const;

export function TextReverser() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReverseMode>("characters");

  const output = useMemo(() => reverseText(input, mode), [input, mode]);

  return (
    <div className="flex flex-col gap-6">
      <ToolTextarea
        id="reverse-input"
        label="Your text"
        value={input}
        onChange={setInput}
        placeholder={"first line of text\nsecond line of text"}
        rows={6}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput("")}
            disabled={!input}
          >
            Clear
          </Button>
        }
      />

      <SegmentedControl
        label="Reverse by"
        options={MODES}
        value={mode}
        onChange={setMode}
      />

      <ToolOutput
        label="Reversed text"
        value={output}
        placeholder="The reversed text will appear here."
      />
    </div>
  );
}
