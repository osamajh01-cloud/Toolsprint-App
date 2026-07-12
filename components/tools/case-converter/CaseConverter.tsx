"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { convertCase, type CaseStyle } from "@/lib/text-transform";

/**
 * components/tools/case-converter/CaseConverter.tsx
 *
 * Eight case styles behind one segmented control; output updates live on
 * every keystroke and style change. Conversion logic lives in
 * lib/text-transform (convertCase).
 */

const STYLES = [
  { value: "lowercase", label: "lowercase" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
] as const;

export function CaseConverter() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<CaseStyle>("title");

  const output = useMemo(() => convertCase(input, style), [input, style]);

  return (
    <div className="flex flex-col gap-6">
      <ToolTextarea
        id="case-input"
        label="Your text"
        value={input}
        onChange={setInput}
        placeholder="the quick brown fox jumps over the lazy dog"
        rows={5}
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
        label="Case style"
        options={STYLES}
        value={style}
        onChange={setStyle}
      />

      <ToolOutput
        label="Converted text"
        value={output}
        placeholder="The converted text will appear here."
      />
    </div>
  );
}
