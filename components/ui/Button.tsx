import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * components/ui/Button.tsx
 *
 * The product's single button. Every variant, size, and state resolves to
 * design-system tokens — no component sets a color itself.
 *
 * Variants: primary (the one strong action per view), secondary (filled,
 * neutral), outline (bordered, transparent), ghost (chrome-free), danger
 * (destructive), icon (square, icon-only — requires aria-label).
 *
 * States: hover shifts the surface, `active:scale-[0.98]` gives a physical
 * press (suppressed under motion-reduce), focus-visible draws a 2px ring
 * offset from the control, disabled drops opacity and pointer events, and
 * `loading` shows a spinner, disables interaction, and marks the control
 * aria-busy so assistive tech announces the wait.
 *
 * Renders as <button>, or as a Next <Link> when `href` is passed, so
 * navigation and actions share one appearance.
 */

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "icon";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 " +
  "active:scale-[0.98] motion-reduce:transform-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variantStyles: Record<Variant, string> = {
  primary:
    "rounded-full bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover hover:shadow-sm",
  secondary:
    "rounded-full bg-secondary text-secondary-foreground border border-border hover:border-border-strong hover:bg-surface-sunken",
  outline:
    "rounded-full border border-border-strong text-foreground hover:bg-secondary",
  ghost:
    "rounded-full text-foreground-muted hover:bg-secondary hover:text-foreground",
  danger:
    "rounded-full bg-danger text-danger-foreground shadow-xs hover:opacity-90",
  icon: "rounded-lg text-foreground-muted hover:bg-secondary hover:text-foreground",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3",
};

/** Icon buttons are square: size is a box, not padding. */
const iconSizeStyles: Record<Size, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-11",
};

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-4 motion-safe:animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Shows a spinner and blocks interaction while an action is running. */
  loading?: boolean;
  /** Optional leading icon (hidden while loading). */
  icon?: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  icon,
  ...props
}: ButtonProps) {
  const sizing = variant === "icon" ? iconSizeStyles[size] : sizeStyles[size];
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizing} ${className}`;

  if ("href" in props && props.href) {
    const { href, children, ...anchorProps } = props;
    return (
      <Link
        href={href}
        className={styles}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        {...anchorProps}
      >
        {loading ? <Spinner /> : icon}
        {children}
      </Link>
    );
  }

  const { children, disabled, ...buttonProps } =
    props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={styles}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}
