"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { CopyButton } from "@/components/tools/CopyButton";
import { useClipboardRead } from "@/hooks/use-clipboard";
import {
  analyzeText,
  formatDuration,
  READING_WPM,
  SPEAKING_WPM,
} from "@/lib/text-analysis";

/**
 * components/tools/word-counter/WordCounter.tsx
 *
 * The first fully functional ToolSprint tool. Client component (it's all
 * user input), mounted into ToolShell's body slot by the tool page — the
 * shell already provides breadcrumbs, header, and SEO, so this component
 * is ONLY the tool.
 *
 * Performance: one `useMemo(analyzeText)` keyed on the text. The analysis
 * is O(n) string work — instant on every keystroke with no debounce, as
 * required. State is a single string, so nothing re-renders except this
 * island.
 *
 * Clipboard: copy/paste behavior comes from the shared CopyButton and
 * use-clipboard hook (extracted in Milestone 6 — this component was the
 * pattern's first home). Paste renders only where clipboard read is
 * supported, and blocked copies fall back to selecting the text.
 */

/** Soft guide for the length progress bar (doesn't limit input). */
const LENGTH_GUIDE = 10_000;

export function WordCounter() {
  const [text, setText] = useState("");
  const { canPaste, read } = useClipboardRead();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => analyzeText(text), [text]);
  const hasText = text.trim().length > 0;

  async function pasteText() {
    const clipboard = await read();
    if (clipboard) setText((current) => current + clipboard);
    // On success or permission denial alike, land focus in the textarea —
    // Ctrl/Cmd+V then just works if the API was blocked.
    textareaRef.current?.focus();
  }

  function clearText() {
    setText("");
    textareaRef.current?.focus();
  }

  const lengthPercent = Math.min(
    100,
    Math.round((stats.characters / LENGTH_GUIDE) * 100),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Input area */}
      <section aria-label="Text input" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="word-counter-input"
            className="text-sm font-medium text-muted-foreground"
          >
            Paste or type your text
          </label>
          <div className="flex flex-wrap gap-2">
            {canPaste && (
              <Button variant="secondary" size="sm" onClick={pasteText}>
                Paste from clipboard
              </Button>
            )}
            <CopyButton
              text={text}
              label="Copy text"
              disabled={!hasText}
              onError={() => textareaRef.current?.select()}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearText}
              disabled={!hasText}
            >
              Clear
            </Button>
          </div>
        </div>

        <textarea
          id="word-counter-input"
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start typing, or paste anything — an email, an essay, a blog post…"
          rows={10}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-border bg-background p-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />

        {/* Length guide */}
        <div className="flex flex-col gap-1.5">
          <div
            role="progressbar"
            aria-label="Text length guide"
            aria-valuemin={0}
            aria-valuemax={LENGTH_GUIDE}
            aria-valuenow={Math.min(stats.characters, LENGTH_GUIDE)}
            aria-valuetext={`${stats.characters.toLocaleString()} of ${LENGTH_GUIDE.toLocaleString()} characters`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-150"
              style={{ width: `${lengthPercent}%` }}
            />
          </div>
          <p className="text-xs tabular-nums text-muted-foreground">
            {stats.characters.toLocaleString()} /{" "}
            {LENGTH_GUIDE.toLocaleString()} characters
            {stats.characters > LENGTH_GUIDE && " — keep going, no limit"}
          </p>
        </div>
      </section>

      {/* Statistics */}
      {hasText ? (
        <section aria-label="Text statistics" className="flex flex-col gap-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatCard label="Words" value={stats.words.toLocaleString()} />
            <StatCard
              label="Characters"
              value={stats.characters.toLocaleString()}
            />
            <StatCard
              label="Characters (no spaces)"
              value={stats.charactersNoSpaces.toLocaleString()}
            />
            <StatCard
              label="Sentences"
              value={stats.sentences.toLocaleString()}
            />
            <StatCard
              label="Paragraphs"
              value={stats.paragraphs.toLocaleString()}
            />
            <StatCard
              label="Reading time"
              value={formatDuration(stats.readingTimeSeconds)}
              hint={`at ${READING_WPM} words/min`}
            />
            <StatCard
              label="Speaking time"
              value={formatDuration(stats.speakingTimeSeconds)}
              hint={`at ${SPEAKING_WPM} words/min`}
            />
            <StatCard
              label="Reading level"
              value={stats.readingLevel}
              hint="Flesch reading-ease estimate"
            />
          </dl>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Insights
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard
                label="Most used word"
                value={stats.mostUsedWord ?? "—"}
                hint="common words excluded"
              />
              <StatCard
                label="Longest word"
                value={stats.longestWord ?? "—"}
              />
              <StatCard
                label="Average word length"
                value={
                  stats.averageWordLength > 0
                    ? `${stats.averageWordLength} letters`
                    : "—"
                }
              />
            </dl>
          </div>
        </section>
      ) : (
        <EmptyState
          title="Your statistics will appear here"
          description="Word count, reading time, sentence stats, and more — updating live as you type. Nothing you write leaves your browser."
        />
      )}
    </div>
  );
}
