"use client";

import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

/**
 * components/tools/CopyButton.tsx
 *
 * The "Copy → Copied" button every tool uses. Wraps the ui/Button
 * primitive with clipboard behavior from use-clipboard so the confirmation
 * pattern (label swap, aria-live announcement, 2s reset) is implemented
 * once. `onError` lets callers provide a fallback when clipboard write is
 * blocked (e.g. select the source text) — copying never fails silently.
 */

interface CopyButtonProps {
  /** Text to copy — or a getter, for values computed at click time. */
  text: string | (() => string);
  label?: string;
  copiedLabel?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onError?: () => void;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  disabled = false,
  variant = "secondary",
  size = "sm",
  onError,
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  async function handleCopy() {
    const value = typeof text === "function" ? text() : text;
    const success = await copy(value);
    if (!success) onError?.();
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={disabled}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
