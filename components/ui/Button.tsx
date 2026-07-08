import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * components/ui/Button.tsx
 *
 * Reusable, style-only button primitive. This is a "dumb" component: it
 * knows nothing about tools, marketing copy, or business logic — only how
 * a button should look and size itself. Every future CTA (hero, pricing,
 * dashboard, forms) should use this component instead of ad-hoc
 * `<button className="...">` markup, so visual consistency is a single
 * source of truth.
 *
 * Renders as a real `<button>` when no `href` is provided, or as a Next.js
 * `<Link>` when `href` is provided — so it works for both in-page actions
 * and navigation without the caller needing two different components.
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-150 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:opacity-90",
  secondary:
    "bg-muted text-foreground border border-border hover:bg-muted/70",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
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
  ...props
}: ButtonProps) {
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={styles} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={styles} {...buttonProps}>
      {buttonProps.children}
    </button>
  );
}
