"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cx } from "../lib/cx";
import { allocateSquareMatrixCells, nextSquareMatrixIndex } from "../lib/square-matrix";
import type { SquareMatrixActiveTone, SquareMatrixTone } from "./SquareMatrixChart";

export type SquareMatrixBreakdownDatum = {
  id: string;
  label: string;
  /** Nicht negativer Anteil; absolute Zahlen und Prozentwerte sind möglich. */
  value: number;
  valueLabel?: string;
  tone?: SquareMatrixTone;
};

export type SquareMatrixBreakdownProps = {
  data: SquareMatrixBreakdownDatum[];
  ariaLabel: string;
  /** Anzahl der Matrixzellen; Default 100 für direkt lesbare Prozentanteile. */
  cells?: number;
  /** Spaltenzahl der Matrix; bei 100 Zellen ergibt 10 das 10×10-Raster. */
  columns?: number;
  activeId?: string | null;
  defaultActiveId?: string | null;
  activeTone?: SquareMatrixActiveTone;
  formatValue?: (value: number, datum: SquareMatrixBreakdownDatum) => string;
  onActiveChange?: (datum: SquareMatrixBreakdownDatum | null) => void;
  /** Blendet die interaktive Segmentlegende visuell aus, erhält sie aber für Screenreader. */
  compact?: boolean;
  emptyLabel?: string;
  className?: string;
};

const toneClasses: Record<SquareMatrixTone, string> = {
  neutral: "bg-muted/55",
  soft: "bg-muted/20",
  strong: "bg-ink-soft/80",
  lime: "bg-lime",
  amber: "bg-amber",
  signal: "bg-signal",
};

const activeClasses: Record<SquareMatrixActiveTone, string> = {
  ink: "bg-ink",
  lime: "bg-lime",
};

const formatter = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

function safeInteger(value: number, fallback: number, min: number, max: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Waffle-Chart als quadratischer Ersatz für Pie- und Donut-Diagramme. Bei der
 * Standardgröße entspricht jede der 100 Zellen ungefähr einem Prozentpunkt.
 */
export function SquareMatrixBreakdown({
  data,
  ariaLabel,
  cells = 100,
  columns = 10,
  activeId,
  defaultActiveId = null,
  activeTone = "ink",
  formatValue,
  onActiveChange,
  compact = false,
  emptyLabel = "Keine Verteilung verfügbar.",
  className,
}: SquareMatrixBreakdownProps) {
  const descriptionId = useId();
  const legendButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const cellCount = safeInteger(cells, 100, 4, 400);
  const columnCount = safeInteger(columns, 10, 2, 20);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const [rovingId, setRovingId] = useState<string | null>(defaultActiveId ?? data[0]?.id ?? null);
  const controlled = activeId !== undefined;
  const resolvedActiveId = controlled ? activeId : internalActiveId;

  const { visualCells, total } = useMemo(() => {
    const allocation = allocateSquareMatrixCells(
      data.map((datum) => datum.value),
      cellCount,
    );
    const nextCells = data.flatMap((datum, segmentIndex) =>
      Array.from({ length: allocation[segmentIndex] ?? 0 }, (_, localIndex) => ({
        datum,
        key: `${datum.id}-${localIndex}`,
      })),
    );
    return {
      visualCells: nextCells,
      total: data.reduce(
        (sum, datum) => sum + Math.max(0, Number.isFinite(datum.value) ? datum.value : 0),
        0,
      ),
    };
  }, [cellCount, data]);

  const active = data.find((datum) => datum.id === resolvedActiveId) ?? null;

  function labelFor(datum: SquareMatrixBreakdownDatum) {
    if (datum.valueLabel) return datum.valueLabel;
    if (formatValue) return formatValue(datum.value, datum);
    const share = total > 0 ? (Math.max(0, datum.value) / total) * 100 : 0;
    return `${formatter.format(datum.value)} · ${formatter.format(share)} %`;
  }

  function setActive(datum: SquareMatrixBreakdownDatum | null) {
    if (!controlled) setInternalActiveId(datum?.id ?? null);
    onActiveChange?.(datum);
  }

  function focusAt(index: number, moveFocus = true) {
    const nextIndex = Math.min(data.length - 1, Math.max(0, index));
    const datum = data[nextIndex];
    if (!datum) return;
    setRovingId(datum.id);
    setActive(datum);
    if (moveFocus) legendButtons.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent, index: number, moveFocus = true) {
    if (event.key === "Escape") {
      event.preventDefault();
      setActive(null);
      return;
    }
    const nextIndex = nextSquareMatrixIndex(event.key, index, data.length);
    if (nextIndex == null) return;
    event.preventDefault();
    focusAt(nextIndex, moveFocus);
  }

  if (visualCells.length === 0) {
    return (
      <figure
        aria-label={ariaLabel}
        className={cx(
          "flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-card border border-dashed border-line bg-card p-6 text-center text-[12px] text-muted",
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
      tabIndex={compact ? 0 : undefined}
      className={cx(
        "min-w-0 max-w-full overflow-hidden outline-none",
        compact && "focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2",
        className,
      )}
      onFocus={(event) => {
        if (!compact || event.currentTarget !== event.target) return;
        const datum = active ?? data[0];
        if (!datum) return;
        setRovingId(datum.id);
        setActive(datum);
      }}
      onBlur={(event) => {
        if (compact && !event.currentTarget.contains(event.relatedTarget)) setActive(null);
      }}
      onKeyDown={(event) => {
        if (!compact || event.currentTarget !== event.target) return;
        const currentIndex = Math.max(
          0,
          data.findIndex((datum) => datum.id === (active?.id ?? rovingId)),
        );
        handleKeyDown(event, currentIndex, false);
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setActive(null);
      }}
    >
      <span id={descriptionId} className="sr-only">
        Segmente mit den Pfeiltasten wechseln. Aktive Zellen werden hervorgehoben.
      </span>

      <div
        aria-hidden="true"
        className="grid w-full gap-[clamp(2px,0.65vw,5px)]"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {visualCells.map(({ datum, key }) => {
          const selected = datum.id === resolvedActiveId;
          return (
            <span
              key={key}
              data-segment={datum.id}
              onPointerEnter={() => setActive(datum)}
              onClick={() => {
                setRovingId(datum.id);
                setActive(datum);
              }}
              className={cx(
                "aspect-square min-w-0 transition-colors duration-200 ease-fabrica motion-reduce:transition-none",
                selected ? activeClasses[activeTone] : toneClasses[datum.tone ?? "neutral"],
              )}
            />
          );
        })}
      </div>

      <figcaption className={cx("mt-4", compact && "sr-only")}>
        <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-2">
          {data.map((datum, index) => {
            const selected = datum.id === resolvedActiveId;
            const tabbableId = data.some((item) => item.id === rovingId) ? rovingId : data[0]?.id;
            return (
              <button
                key={datum.id}
                ref={(node) => {
                  legendButtons.current[index] = node;
                }}
                type="button"
                tabIndex={!compact && datum.id === tabbableId ? 0 : -1}
                aria-label={`${datum.label}: ${labelFor(datum)}`}
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
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="inline-flex min-w-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left text-[10px] text-muted outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden
                  className={cx(
                    "size-2 shrink-0",
                    selected ? activeClasses[activeTone] : toneClasses[datum.tone ?? "neutral"],
                  )}
                />
                <span className="truncate">{datum.label}</span>
                <strong className="font-display font-semibold tabular-nums text-ink">
                  {labelFor(datum)}
                </strong>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="sr-only">
          {active ? `${active.label}: ${labelFor(active)}` : "Kein Segment aktiv"}
        </p>
      </figcaption>
    </figure>
  );
}
