import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type StatusPillStatus = "live" | "run" | "warn" | "err" | "idle";
export type StatusPillVariant = "default" | "dark" | "tint";

/** Status-Marker mit Ring — seit 2026-08-16 eckig mit runden Ecken (kein Kreis). */
const dotClasses: Record<StatusPillStatus, string> = {
  live: "bg-lime shadow-[0_0_0_3px_rgba(210,255,55,0.4)]",
  run: "bg-cobalt shadow-[0_0_0_3px_rgba(39,54,208,0.15)]",
  warn: "bg-amber shadow-[0_0_0_3px_rgba(227,154,11,0.18)]",
  err: "bg-signal shadow-[0_0_0_3px_rgba(229,72,77,0.16)]",
  idle: "bg-muted opacity-90",
};

/** Dünne Semantik-Flächen — nie als Panel, nur als Pill-Tint. */
const tintClasses: Record<StatusPillStatus, string> = {
  live: "border-transparent bg-lime/25 text-ink",
  run: "border-transparent bg-frost text-ink",
  warn: "border-transparent bg-amber-soft text-ink",
  err: "border-transparent bg-signal-soft text-[#b3383c]",
  idle: "border-transparent bg-mist text-ink",
};

export type StatusPillProps = {
  status: StatusPillStatus;
  children: ReactNode;
  variant?: StatusPillVariant;
  /** Punkt anzeigen — bei `tint` per Default aus (die Fläche trägt die Semantik). */
  dot?: boolean;
  className?: string;
};

/**
 * Status-Pill der Console: live (Lime), run (Cobalt), warn (Amber),
 * err (Signal), idle (Muted). Varianten: default (weiß mit Line-Rahmen),
 * dark (Ink) und tint (Soft-Fläche ohne Punkt).
 */
export function StatusPill({
  status,
  children,
  variant = "default",
  dot,
  className,
}: StatusPillProps) {
  const showDot = dot ?? variant !== "tint";
  return (
    <span
      className={cx(
        // Badge-Form: Viereck mit abgerundeten Ecken (Vorgabe 2026-08-16 —
        // Badges sind keine Pillen, rounded-full bleibt den Buttons vorbehalten).
        "inline-flex items-center gap-[7px] rounded-[6px] border px-[9px] py-1 text-xs whitespace-nowrap",
        variant === "dark" && "border-ink bg-ink text-white",
        variant === "tint" && tintClasses[status],
        variant === "default" && "border-line bg-white text-ink",
        className,
      )}
    >
      {showDot && (
        <span aria-hidden className={cx("size-1.5 rounded-[2px]", dotClasses[status])} />
      )}
      {children}
    </span>
  );
}
