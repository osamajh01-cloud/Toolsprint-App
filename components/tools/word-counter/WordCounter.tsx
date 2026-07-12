"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
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
 * Clipboard: Copy uses navigator.clipboard.writeText with a transient
 * "Copied" confirmation (announced via the button's aria-live). Paste is
 * feature-detected after mount — Firefox doesn't expose readText — and
 * the button only renders where it can work, so the UI never shows a
 * control that's guaranteed to fail.
 */

/** Soft guide for the length progress bar (doesn't limit input). */
const LENGTH_GUIDE = 10_000;

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

/** One statistic tile. Local to this tool — the label/value card pattern
 *  will be promoted to components/ui if a second tool needs it. */
function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-2xl font-bold tabular-nums tracking-tight">
        {value}
      </dd>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [canPaste, setCanPaste] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Feature-detect clipboard read support after mount (browser-only API;
  // checking during render would desync server and client markup).
  useEffect(() => {
    setCanPaste(
      typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.readText === "function",
    );
  }, []);

  const stats = useMemo(() => analyzeText(text), [text]);
  const hasText = text.trim().length > 0;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write blocked (permissions) — select the text instead so
      // the user can copy manually; never fail silently.
      textareaRef.current?.select();
    }
  }

  async function pasteText() {
    try {
      const clipboard = await navigator.clipboard.readText();
      if (clipboard) setText((current) => current + clipboard);
      textareaRef.current?.focus();
    } catch {
      // Permission denied — focus the textarea so Ctrl/Cmd+V just works.
      textareaRef.current?.focus();
    }
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
            <Button
              variant="secondary"
              size="sm"
              onClick={copyText}
              disabled={!hasText}
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy text"}
            </Button>
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
