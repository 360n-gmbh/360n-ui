"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cx } from "../lib/cx";
import {
  nextSquareMatrixIndex,
  normalizeSquareMatrixValues,
  squareMatrixSubdivision,
} from "../lib/square-matrix";
import type { SquareMatrixDensity } from "../lib/square-matrix";

export type SquareMatrixTone = "neutral" | "soft" | "strong" | "lime" | "amber" | "signal";
export type SquareMatrixActiveTone = "ink" | "lime";

export type SquareMatrixDatum = {
  /** Stabiler Schlüssel des Zeitraums. */
  id: string;
  /** Sichtbarer und zugänglicher Name, z. B. „18. Juni“. */
  label: string;
  /** Nicht negativer Rohwert; die Komponente normalisiert ihn auf `rows`. */
  value: number;
  /** Bereits formatierter Wert für Tooltip und Screenreader. */
  valueLabel?: string;
  /** Ruhige Grundfarbe; Hover und Fokus überschreiben sie mit `activeTone`. */
  tone?: SquareMatrixTone;
};

export type SquareMatrixAxisLabels = {
  start: string;
  middle?: string;
  end: string;
  /** Optionale vollständige Tick-Reihe; wird gleichmäßig über die Achse verteilt. */
  ticks?: readonly string[];
};

export type SquareMatrixChartProps = {
  data: SquareMatrixDatum[];
  /** Zugänglicher Name der gesamten Visualisierung. */
  ariaLabel: string;
  /** Maximale Anzahl vertikal gestapelter Quadrate. */
  rows?: number;
  /** Zeigt höchstens die letzten N Perioden; die Originaldaten bleiben unverändert. */
  maxColumns?: number;
  /**
   * Verdichtete Variante für StatCards: weniger Zeilen, ohne sichtbare Caption
   * und Tooltip. Explizite `axisLabels` bleiben als schmale Zeitachse sichtbar.
   */
  compact?: boolean;
  /** Visuelle Unterteilung pro logischer Zelle; ändert weder Werte noch Interaktion. */
  density?: SquareMatrixDensity;
  /** Responsive Zeichenhöhe; Default 240 px, in `compact` 36 px. */
  height?: number | string;
  /** Explizite Wertedomäne; Default ist 0 bis zum höchsten Datenwert. */
  domain?: readonly [number, number];
  /** Sichtbare Start-, optionale Mitte- und Endbeschriftung unter der Matrix. */
  axisLabels?: SquareMatrixAxisLabels;
  /** Kontrollierter aktiver Zeitraum. `null` entfernt die Hervorhebung. */
  activeId?: string | null;
  /** Initialer aktiver Zeitraum im unkontrollierten Modus. */
  defaultActiveId?: string | null;
  /** Hervorhebung auf Hover, Fokus und Touch. */
  activeTone?: SquareMatrixActiveTone;
  /** Eigene Zahlenformatierung, falls `valueLabel` nicht gesetzt ist. */
  formatValue?: (value: number, datum: SquareMatrixDatum) => string;
  /** Wird bei Hover, Fokus, Touch und beim Verlassen aufgerufen. */
  onActiveChange?: (datum: SquareMatrixDatum | null) => void;
  /** Kurzer Bedienhinweis für Screenreader. */
  instruction?: string;
  /** Text im leeren Zustand. */
  emptyLabel?: string;
  className?: string;
};

const TILE = 4;
const TILE_GAP = 1;

const toneStyle: Record<SquareMatrixTone, { fill: string; opacity: number }> = {
  neutral: { fill: "var(--color-muted)", opacity: 0.55 },
  soft: { fill: "var(--color-muted)", opacity: 0.18 },
  strong: { fill: "var(--color-ink-soft)", opacity: 0.78 },
  lime: { fill: "var(--color-lime)", opacity: 1 },
  amber: { fill: "var(--color-amber)", opacity: 1 },
  signal: { fill: "var(--color-signal)", opacity: 1 },
};

const activeFill: Record<SquareMatrixActiveTone, string> = {
  ink: "var(--color-ink)",
  lime: "var(--color-lime)",
};

const defaultNumberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

function boundedRows(rows: number) {
  if (!Number.isFinite(rows)) return 10;
  return Math.min(24, Math.max(2, Math.round(rows)));
}

/**
 * SquareMatrixChart übersetzt eine Zeitreihe in vertikale Stapel aus kleinen
 * Quadraten. Die Matrix bleibt bei jeder Breite proportional, benötigt keine
 * Chart-Library und erzeugt deshalb nie einen horizontalen Seitenscroll.
 *
 * Jeder Zeitraum ist per Roving-Tabindex erreichbar; Pfeiltasten, Home und End
 * wechseln die aktive Spalte. Der Screenreader erhält die Originalwerte statt
 * der rein dekorativen Quadrate.
 */
export function SquareMatrixChart({
  data,
  ariaLabel,
  rows = 10,
  maxColumns,
  compact = false,
  density = "dense",
  height,
  domain,
  axisLabels,
  activeId,
  defaultActiveId = null,
  activeTone = "ink",
  formatValue,
  onActiveChange,
  instruction = "Mit linker und rechter Pfeiltaste den Zeitraum wechseln.",
  emptyLabel = "Keine Daten verfügbar.",
  className,
}: SquareMatrixChartProps) {
  const descriptionId = useId();
  const tooltipId = useId();
  const patternPrefix = useId().replaceAll(":", "");
  const buttons = useRef<Array<SVGRectElement | null>>([]);
  const visibleData = useMemo(() => {
    if (maxColumns == null || !Number.isFinite(maxColumns)) return data;
    const count = Math.max(1, Math.floor(maxColumns));
    return data.length > count ? data.slice(-count) : data;
  }, [data, maxColumns]);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const [rovingId, setRovingId] = useState<string | null>(
    defaultActiveId ?? visibleData[0]?.id ?? null,
  );
  const controlled = activeId !== undefined;
  const resolvedActiveId = controlled ? activeId : internalActiveId;
  const rowCount = boundedRows(compact && rows === 10 ? 5 : rows);
  const subdivision = squareMatrixSubdivision(density);
  const logicalCell = subdivision * TILE + (subdivision - 1) * TILE_GAP;
  const step = logicalCell + TILE_GAP;

  const chart = useMemo(() => {
    const counts = normalizeSquareMatrixValues(
      visibleData.map((datum) => datum.value),
      rowCount,
      domain,
    );
    return visibleData.map((datum, index) => ({ datum, count: counts[index] ?? 0 }));
  }, [visibleData, domain, rowCount]);

  const activeIndex = chart.findIndex(({ datum }) => datum.id === resolvedActiveId);
  const active = activeIndex >= 0 ? chart[activeIndex] : null;
  const chartWidth = Math.max(logicalCell, chart.length * step - TILE_GAP);
  const chartHeight = rowCount * step - TILE_GAP;
  const axisTicks = axisLabels
    ? axisLabels.ticks && axisLabels.ticks.length >= 2
      ? [...axisLabels.ticks]
      : [axisLabels.start, axisLabels.middle ?? "", axisLabels.end]
    : [];

  function valueLabel(datum: SquareMatrixDatum) {
    return (
      datum.valueLabel ??
      formatValue?.(datum.value, datum) ??
      defaultNumberFormatter.format(datum.value)
    );
  }

  function setActive(datum: SquareMatrixDatum | null) {
    if (!controlled) setInternalActiveId(datum?.id ?? null);
    onActiveChange?.(datum);
  }

  function focusAt(index: number) {
    const nextIndex = Math.min(chart.length - 1, Math.max(0, index));
    const datum = chart[nextIndex]?.datum;
    if (!datum) return;
    setRovingId(datum.id);
    setActive(datum);
    buttons.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<SVGRectElement>, index: number) {
    if (event.key === "Escape") {
      event.preventDefault();
      setActive(null);
      return;
    }
    const nextIndex = nextSquareMatrixIndex(event.key, index, chart.length);
    if (nextIndex == null) return;
    event.preventDefault();
    focusAt(nextIndex);
  }

  if (chart.length === 0) {
    return (
      <figure
        aria-label={ariaLabel}
        className={cx(
          "flex min-h-32 min-w-0 items-center justify-center overflow-hidden rounded-card border border-dashed border-line bg-card px-5 py-8 text-center text-[12px] text-muted",
          className,
        )}
      >
        <figcaption>{emptyLabel}</figcaption>
      </figure>
    );
  }

  return (
    <figure
      aria-label={ariaLabel}
      aria-describedby={descriptionId}
      className={cx("min-w-0 max-w-full overflow-hidden", className)}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setActive(null);
      }}
    >
      <span id={descriptionId} className="sr-only">
        {instruction}
      </span>

      <div className={cx("relative min-w-0 max-w-full", compact ? "pt-0" : "pt-11")}>
        <svg
          role="group"
          aria-label={ariaLabel}
          aria-describedby={descriptionId}
          className="block w-full max-w-full overflow-visible"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={height ?? (compact ? 36 : 240)}
          preserveAspectRatio="xMidYMax meet"
          shapeRendering="crispEdges"
        >
          <defs>
            {Object.entries(toneStyle).map(([tone, visual]) => (
              <pattern
                key={tone}
                id={`${patternPrefix}-tone-${tone}`}
                width={TILE + TILE_GAP}
                height={TILE + TILE_GAP}
                patternUnits="userSpaceOnUse"
              >
                <rect width={TILE} height={TILE} fill={visual.fill} fillOpacity={visual.opacity} />
              </pattern>
            ))}
            {Object.entries(activeFill).map(([tone, fill]) => (
              <pattern
                key={tone}
                id={`${patternPrefix}-active-${tone}`}
                width={TILE + TILE_GAP}
                height={TILE + TILE_GAP}
                patternUnits="userSpaceOnUse"
              >
                <rect width={TILE} height={TILE} fill={fill} />
              </pattern>
            ))}
          </defs>

          {chart.map(({ datum, count }, columnIndex) => {
            const isActive = datum.id === resolvedActiveId;
            const tone = datum.tone ?? "neutral";
            const stackHeight = Math.max(0, count * step - TILE_GAP);
            const tabbableId = chart.some(({ datum: item }) => item.id === rovingId)
              ? rovingId
              : chart[0]?.datum.id;

            return (
              <g key={datum.id}>
                {stackHeight > 0 && (
                  <>
                    <rect
                      aria-hidden="true"
                      x={columnIndex * step}
                      y={chartHeight - stackHeight}
                      width={logicalCell}
                      height={stackHeight}
                      fill={`url(#${patternPrefix}-tone-${tone})`}
                    />
                    <rect
                      aria-hidden="true"
                      x={columnIndex * step}
                      y={chartHeight - stackHeight}
                      width={logicalCell}
                      height={stackHeight}
                      fill={`url(#${patternPrefix}-active-${activeTone})`}
                      opacity={isActive ? 1 : 0}
                      className="transition-opacity duration-200 ease-fabrica motion-reduce:transition-none"
                    />
                  </>
                )}
                <rect
                  ref={(node) => {
                    buttons.current[columnIndex] = node;
                  }}
                  role="button"
                  tabIndex={datum.id === tabbableId ? 0 : -1}
                  aria-label={`${datum.label}: ${valueLabel(datum)}`}
                  aria-describedby={isActive && !compact ? tooltipId : undefined}
                  x={columnIndex * step}
                  y={0}
                  width={logicalCell}
                  height={chartHeight}
                  fill="transparent"
                  pointerEvents="all"
                  onFocus={() => {
                    setRovingId(datum.id);
                    setActive(datum);
                  }}
                  onBlur={() => setActive(null)}
                  onPointerEnter={() => setActive(datum)}
                  onClick={() => {
                    setRovingId(datum.id);
                    setActive(datum);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, columnIndex)}
                  className="cursor-crosshair outline-none"
                />
              </g>
            );
          })}
        </svg>

        {active && !compact && (
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute top-0 z-10 w-max max-w-[min(13rem,80%)] -translate-x-1/2 border border-ink bg-ink px-2.5 py-1.5 text-left text-[10px] leading-4 break-words text-white shadow-[3px_3px_0_var(--color-lime)]"
            style={{ left: "50%" }}
          >
            <span className="block text-white/60">{active.datum.label}</span>
            <strong className="block font-display font-semibold tabular-nums">
              {valueLabel(active.datum)}
            </strong>
          </div>
        )}
      </div>

      {axisLabels && (
        <div aria-hidden="true" className={cx(compact ? "mt-1.5" : "mt-2.5")}>
          <div
            className="grid h-1 border-t border-line"
            style={{ gridTemplateColumns: `repeat(${axisTicks.length}, minmax(0, 1fr))` }}
          >
            {axisTicks.map((label, index) => (
              <span key={`${index}-${label}`} className="relative h-1">
                <span
                  className={cx(
                    "absolute top-0 h-1 border-l border-line",
                    index === 0
                      ? "left-0"
                      : index === axisTicks.length - 1
                        ? "right-0"
                        : "left-1/2",
                  )}
                />
              </span>
            ))}
          </div>
          <div
            className={cx(
              "grid items-start gap-1 text-muted tabular-nums",
              compact
                ? "text-[9px] leading-3"
                : "font-display text-[10px] leading-3 font-semibold tracking-[0.02em]",
            )}
            style={{ gridTemplateColumns: `repeat(${axisTicks.length}, minmax(0, 1fr))` }}
          >
            {axisTicks.map((label, index) => (
              <span
                key={`${index}-${label}`}
                className={cx(
                  "truncate",
                  index === 0
                    ? "text-left"
                    : index === axisTicks.length - 1
                      ? "text-right"
                      : "text-center",
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <figcaption
        className={cx(
          compact
            ? "sr-only"
            : cx(
                "flex min-h-5 items-center border-t border-line pt-2.5 text-[10px] tracking-[0.04em] text-muted",
                axisLabels ? "mt-2" : "mt-3",
              ),
        )}
      >
        <span aria-live="polite" className="min-w-0 truncate">
          {active ? `${active.datum.label} · ${valueLabel(active.datum)}` : "Zeitraum wählen"}
        </span>
        <span aria-hidden className="ml-auto shrink-0 pl-3 text-[9px] tracking-[0.08em] uppercase">
          ← →
        </span>
      </figcaption>
    </figure>
  );
}
