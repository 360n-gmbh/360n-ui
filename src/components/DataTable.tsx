"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Skeleton } from "./Skeleton";

export type DataTableColumn<T> = {
  /** Eindeutiger Schlüssel — Default-Zelle liest `row[key]`. */
  key: string;
  header: ReactNode;
  /** Zahlen-Spalten rechtsbündig mit Tabellenziffern. */
  align?: "left" | "right";
  sortable?: boolean;
  /** Sortierwert; Default: `row[key]`. */
  sortValue?: (row: T) => number | string;
  /** Zell-Renderer; Default: `String(row[key])`. */
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  /** Aktiviert die Footer-Pagination. */
  pageSize?: number;
  /** Skeleton-Zeilen statt Inhalt — der Lade-Standard, nie ein Spinner. */
  loading?: boolean;
  /** Anzahl Skeleton-Zeilen im Ladezustand (Default: pageSize bzw. 5). */
  loadingRows?: number;
  /** Wird bei 0 Zeilen gerendert — z. B. ein `<EmptyState>`. */
  emptyState?: ReactNode;
  /** Titel in der Kopfleiste der Karte. */
  title?: ReactNode;
  /** Werkzeuge rechts in der Kopfleiste (Pills, Filter-Button …). */
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  /**
   * Vollflächiges Zeilen-Overlay (z. B. `<StreamFlicker/>` für streamende
   * Requests): wird absolut über die GANZE Zeile gelegt — die `<tr>` wird
   * dafür `relative`, das Overlay sitzt in der ersten Zelle und spannt per
   * `inset-0` über die Zeile. `null` = kein Overlay für diese Zeile.
   */
  rowDecoration?: (row: T, index: number) => ReactNode;
  className?: string;
};

const thClasses =
  "whitespace-nowrap border-b border-line bg-card px-3.5 py-2.5 text-left text-[10.5px] font-light tracking-[0.08em] text-muted uppercase";
const tdClasses = "whitespace-nowrap border-t border-line px-3.5 py-2.5";

/**
 * Das Arbeitstier der Console: Kopfzeile 10,5 px versal in Muted,
 * Zahlen rechtsbündig mit Tabellenziffern, Zeilen-Hover in Paper,
 * sortierbare Spalten mit Pfeil, Footer-Pagination.
 * Keine Zebra-Streifen — die Linie reicht.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  pageSize,
  loading = false,
  loadingRows,
  emptyState,
  title,
  toolbar,
  onRowClick,
  rowDecoration,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const valueOf =
      col.sortValue ??
      ((row: T) => (row as Record<string, unknown>)[col.key] as number | string);
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = valueOf(a);
      const bv = valueOf(b);
      const res =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), "de");
      return sort.dir === "desc" ? -res : res;
    });
    return copy;
  }, [rows, sort, columns]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const visible = pageSize
    ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : sorted;

  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "desc" ? "asc" : "desc" }
        : { key, dir: "desc" },
    );
    setPage(0);
  }

  const skeletonCount = loadingRows ?? pageSize ?? 5;

  return (
    <div className={cx("overflow-hidden rounded-card border border-line bg-card", className)}>
      {(title != null || toolbar != null) && (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-4.5 py-3.5">
          {title != null && <h4 className="text-sm">{title}</h4>}
          {toolbar != null && <div className="ml-auto flex items-center gap-2.5">{toolbar}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      active ? (sort!.dir === "desc" ? "descending" : "ascending") : undefined
                    }
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                    className={cx(
                      thClasses,
                      col.align === "right" && "text-right",
                      col.sortable &&
                        "cursor-pointer transition-colors duration-300 ease-fabrica select-none hover:text-ink",
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                    {col.sortable && (
                      <span aria-hidden className="ml-1 inline-block w-2.5 text-ink">
                        {active ? (sort!.dir === "desc" ? "↓" : "↑") : ""}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="[&>tr:first-child>td]:border-t-0">
            {loading ? (
              Array.from({ length: skeletonCount }, (_, r) => (
                <tr key={r}>
                  {columns.map((col) => (
                    <td key={col.key} className={tdClasses}>
                      <Skeleton
                        className={cx("h-3.5", col.align === "right" ? "ml-auto w-12" : "w-24")}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6">
                  {emptyState ?? (
                    <p className="text-center text-[12.5px] text-muted">Keine Einträge.</p>
                  )}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => {
                const decoration = rowDecoration?.(row, i);
                return (
                  <tr
                    key={rowKey(row, i)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cx(
                      "transition-colors duration-300 ease-fabrica hover:bg-paper",
                      onRowClick && "cursor-pointer",
                      decoration != null && "relative",
                    )}
                  >
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        className={cx(
                          tdClasses,
                          col.align === "right" && "text-right tabular-nums",
                          col.cellClassName,
                        )}
                      >
                        {ci === 0 && decoration != null && (
                          // inset-0 bezieht sich auf die relative <tr> — das
                          // Overlay spannt damit über die gesamte Zeile.
                          <span aria-hidden className="pointer-events-none absolute inset-0">
                            {decoration}
                          </span>
                        )}
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize != null && !loading && sorted.length > 0 && (
        <div className="flex items-center gap-2.5 border-t border-line px-4.5 py-3 text-xs text-muted">
          <span className="tabular-nums">
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} von{" "}
            {sorted.length}
          </span>
          <span className="ml-auto flex gap-1.5">
            <button
              type="button"
              aria-label="Vorherige Seite"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors duration-300 ease-fabrica hover:bg-mist disabled:cursor-default disabled:opacity-35 disabled:hover:bg-card"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              aria-label="Nächste Seite"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors duration-300 ease-fabrica hover:bg-mist disabled:cursor-default disabled:opacity-35 disabled:hover:bg-card"
            >
              &rsaquo;
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
