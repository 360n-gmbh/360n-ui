import type { CSSProperties } from "react";
import { cx } from "../lib/cx";

/** Mist-Schimmer — Silhouette des kommenden Inhalts. */
export const skeletonClasses =
  "animate-shimmer rounded-lg bg-[linear-gradient(100deg,var(--color-mist)_40%,#f3f3f3_50%,var(--color-mist)_60%)] bg-[length:200%_100%]";

export type SkeletonProps = {
  /** Maße über Klassen steuern, z. B. `h-8 w-24`. Default-Höhe: 14 px. */
  className?: string;
  /** Mehrzeilige Text-Silhouette mit variierenden Breiten. */
  lines?: number;
  style?: CSSProperties;
};

/**
 * Skeleton-Loader — der Lade-Standard für Listen, Tabellen und Karten.
 * Mist-Schimmer in der Silhouette des kommenden Inhalts; nie Spinner für
 * Inhalte. Leere Ergebnisse zeigen einen EmptyState, keine Skeletons in
 * Endlosschleife.
 */
export function Skeleton({ className, lines, style }: SkeletonProps) {
  if (lines !== undefined && lines > 1) {
    const widths = ["w-2/5", "w-[88%]", "w-2/3", "w-3/4", "w-1/2"];
    return (
      <div aria-hidden className={cx("flex flex-col gap-2", className)} style={style}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cx("h-3.5", widths[i % widths.length], skeletonClasses)} />
        ))}
      </div>
    );
  }
  return <div aria-hidden className={cx("h-3.5", skeletonClasses, className)} style={style} />;
}
