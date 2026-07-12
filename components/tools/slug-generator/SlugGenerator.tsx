"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import { ToolOutput } from "@/components/tools/ToolOutput";
import { slugify } from "@/lib/text-transform";

/**
 * components/tools/slug-generator/SlugGenerator.tsx
 *
 * Headline in, SEO-friendly slug out — live on every keystroke.
 * Transformation logic lives in lib/text-transform (slugify): lowercase,
 * accents stripped, spaces to hyphens, duplicate hyphens collapsed.
 */
export function SlugGenerator() {
  const [input, setInput] = useState("");

  const slug = useMemo(() => slugify(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ToolTextarea
        id="slug-input"
        label="Title or sentence"
        value={input}
        onChange={setInput}
        placeholder="How to Bake the Perfect Crème Brûlée — A Chef's Guide!"
        rows={3}
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

      <ToolOutput
        label="URL slug"
        value={slug}
        placeholder="your-seo-friendly-slug-appears-here"
        mono
      />
    </div>
  );
}
