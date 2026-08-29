import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Skeleton } from "./Skeleton";
import { SquareMatrixChart } from "./SquareMatrixChart";

export type SparklineTone = "lime" | "amber" | "signal";

export type SparklineProps = {
  /** Rohwerte in zeitlicher Reihenfolge — werden auf Quadratstapel normalisiert. */
  points: number[];
  /** Semantik des letzten Zeitraums; Lime bleibt als sichtbarer Akzent erhalten. */
  tone?: SparklineTone;
  /** Zugänglicher Name der kompakten Zeitreihe. */
  ariaLabel?: string;
  className?: string;
};

/**
 * Rückwärtskompatibler StatCard-Graph in der Square-Matrix-Sprache. Bestehende
 * `points`-Aufrufer brauchen keine Migration; Zwischenwerte werden nur
 * visuell interpoliert, Originalwerte und Endpunkte bleiben unverändert.
 */
export function Sparkline({
  points,
  tone = "lime",
  ariaLabel = "Verlauf der Kennzahl",
  className,
}: SparklineProps) {
  if (points.length < 2) return null;

  const columnCount = Math.max(24, points.length);
  const data = Array.from({ length: columnCount }, (_, index) => {
    const position = (index / (columnCount - 1)) * (points.length - 1);
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.min(points.length - 1, Math.ceil(position));
    const fraction = position - lowerIndex;
    const lower = points[lowerIndex] ?? 0;
    const upper = points[upperIndex] ?? lower;
    const value = lower + (upper - lower) * fraction;
    const isLast = index === columnCount - 1;
    return {
      id: `spark-${index}`,
      label: `Wert ${index + 1} von ${columnCount}`,
      value,
      tone: isLast ? tone : ("neutral" as const),
    };
  });

  return (
    <SquareMatrixChart
      data={data}
      rows={3}
      maxColumns={24}
      compact
      ariaLabel={ariaLabel}
      className={cx("mt-2 w-full", className)}
    />
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
 * Delta als Pill, kompakter Square-Matrix-Verlauf mit optionalem Lime-Endpunkt.
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
