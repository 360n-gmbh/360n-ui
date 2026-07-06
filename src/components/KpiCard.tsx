import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Skeleton } from "./Skeleton";

export type SparklineTone = "lime" | "amber" | "signal";

const toneFill: Record<SparklineTone, string> = {
  lime: "var(--color-lime)",
  amber: "var(--color-amber)",
  signal: "var(--color-signal)",
};

export type SparklineProps = {
  /** Rohwerte in zeitlicher Reihenfolge — werden auf die ViewBox normalisiert. */
  points: number[];
  /** Farbe des letzten Punkts — nur er trägt Farbe, die Linie bleibt Ink. */
  tone?: SparklineTone;
  className?: string;
};

/**
 * Monochrome Sparkline: Serie in Ink 1,5 px, nur der aktuelle Wert
 * trägt Farbe (Lime = gut, Amber = Drift, Signal = schlecht).
 */
export function Sparkline({ points, tone = "lime", className }: SparklineProps) {
  if (points.length < 2) return null;
  const w = 120;
  const h = 34;
  const padX = 3;
  const padY = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((v, i) => {
    const x = padX + (i / (points.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (v - min) / span) * (h - padY * 2);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
  });
  const last = coords[coords.length - 1]!;
  return (
    <svg
      aria-hidden
      className={cx("mt-2 block h-[34px] w-full", className)}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <polyline
        points={coords.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.6"
        fill={toneFill[tone]}
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
    </svg>
  );
}

export type KpiDeltaTone = "up" | "warn" | "bad" | "calm";

const deltaClasses: Record<KpiDeltaTone, string> = {
  up: "bg-lime text-ink",
  warn: "bg-amber-soft text-amber",
  bad: "bg-signal-soft text-signal",
  calm: "bg-mist text-muted",
};

export type KpiCardProps = {
  label: ReactNode;
  /** Formatierter Wert — Zahlformatierung macht der Aufrufer. */
  value: ReactNode;
  /** Einheit hinter dem Wert, z. B. "ms", "%", "€". */
  unit?: ReactNode;
  /** Delta-Pill: Lime = gut, Amber = Drift, Signal = schlecht, Mist = neutral. */
  delta?: { label: ReactNode; tone?: KpiDeltaTone };
  /** Rohwerte für die Sparkline unter der Zahl. */
  sparkline?: number[];
  sparklineTone?: SparklineTone;
  /** Skeleton-Silhouette statt Inhalt — der Lade-Standard. */
  loading?: boolean;
  className?: string;
};

/**
 * KPI-Karte: Zahl in Inter SemiBold mit Tabellenziffern, Label in Muted,
 * Delta als Pill, Sparkline monochrom mit einem farbigen Endpunkt.
 */
export function KpiCard({
  label,
  value,
  unit,
  delta,
  sparkline,
  sparklineTone = "lime",
  loading = false,
  className,
}: KpiCardProps) {
  return (
    <div className={cx("rounded-card border border-line bg-card px-4.5 pt-4 pb-3", className)}>
      <p className="text-[11px] tracking-[0.03em] text-muted">{label}</p>
      {loading ? (
        <>
          <Skeleton className="mt-2.5 h-7 w-24" />
          <Skeleton className="mt-3 h-[34px] w-full" />
        </>
      ) : (
        <>
          <div className="flex items-end justify-between gap-2">
            <p className="mt-1.5 font-display text-3xl font-semibold tracking-tight tabular-nums">
              {value}
              {unit != null && (
                <small className="ml-1 align-baseline font-sans text-[15px] font-light text-muted">
                  {unit}
                </small>
              )}
            </p>
            {delta && (
              <span
                className={cx(
                  "rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap",
                  deltaClasses[delta.tone ?? "calm"],
                )}
              >
                {delta.label}
              </span>
            )}
          </div>
          {sparkline && <Sparkline points={sparkline} tone={sparklineTone} />}
        </>
      )}
    </div>
  );
}
