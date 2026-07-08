import type { ElementType, ReactNode } from "react";

/**
 * components/ui/Container.tsx
 *
 * Layout primitive that constrains content to the site's max width with
 * consistent horizontal padding. Header, Footer, and every page section
 * use this instead of repeating `mx-auto max-w-* px-*` strings, so the
 * site's "content column" is defined in exactly one place.
 */

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Render as a different semantic element, e.g. "section" or "nav". */
  as?: ElementType;
}

export function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </Component>
  );
}
