import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type TagVariant = "ink" | "light" | "onDark";

const variantClasses: Record<TagVariant, string> = {
  /** Dunkler Chip auf hellem Grund (Website-Standard). */
  ink: "bg-ink text-white",
  /** Heller Chip mit Line-Rahmen (Console). */
  light: "border border-line bg-white text-ink",
  /** Umrissener Chip auf Ink-Panels. */
  onDark: "border border-white/15 text-white/80",
};

export type TagProps = {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
};

/** Kleiner runder Chip für Kategorien, Labels und Projekt-Tags. */
export function Tag({ children, variant = "ink", className }: TagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
