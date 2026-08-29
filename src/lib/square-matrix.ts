export type SquareMatrixDomain = readonly [number, number];

/**
 * Visuelle Unterteilung einer logischen Matrixzelle. Die Datengenauigkeit
 * bleibt dabei unverändert; nur das industrielle Raster wird feiner.
 */
export type SquareMatrixDensity = "regular" | "dense" | "ultra";

const squareMatrixSubdivisions: Record<SquareMatrixDensity, number> = {
  regular: 1,
  dense: 2,
  ultra: 3,
};

export function squareMatrixSubdivision(density: SquareMatrixDensity) {
  return squareMatrixSubdivisions[density];
}

/**
 * Unterteilt ein zeilenweise sortiertes Raster, ohne die räumliche Zuordnung
 * seiner logischen Zellen zu verlieren. Unvollständige letzte Zeilen werden
 * mit `null` aufgefüllt, damit Subtiles nicht in die nächste Zeile rutschen.
 */
export function subdivideSquareMatrixGrid<T>(
  cells: T[],
  columns: number,
  subdivision: number,
): Array<T | null> {
  if (cells.length === 0) return [];
  const columnCount = Number.isFinite(columns) ? Math.max(1, Math.round(columns)) : 1;
  const subdivisionCount = Number.isFinite(subdivision)
    ? Math.max(1, Math.round(subdivision))
    : 1;
  const rowCount = Math.ceil(cells.length / columnCount);
  const result: Array<T | null> = [];

  for (let row = 0; row < rowCount; row += 1) {
    for (let tileRow = 0; tileRow < subdivisionCount; tileRow += 1) {
      for (let column = 0; column < columnCount; column += 1) {
        const cell = cells[row * columnCount + column] ?? null;
        for (let tileColumn = 0; tileColumn < subdivisionCount; tileColumn += 1) {
          result.push(cell);
        }
      }
    }
  }

  return result;
}

export function finiteMatrixValue(value: number) {
  return Number.isFinite(value) ? value : 0;
}

/** Normalisiert Rohwerte deterministisch auf eine feste Zahl Quadratzeilen. */
export function normalizeSquareMatrixValues(
  values: number[],
  rows: number,
  domain?: SquareMatrixDomain,
) {
  const safeValues = values.map(finiteMatrixValue);
  const domainMin = finiteMatrixValue(domain?.[0] ?? 0);
  const inferredMax = Math.max(domainMin, ...safeValues, 0);
  const domainMax = Math.max(domainMin, finiteMatrixValue(domain?.[1] ?? inferredMax));
  const span = domainMax - domainMin;

  return safeValues.map((value) => {
    const ratio = span === 0 ? (value > domainMin ? 1 : 0) : (value - domainMin) / span;
    return value <= domainMin ? 0 : Math.max(1, Math.round(Math.min(1, Math.max(0, ratio)) * rows));
  });
}

/**
 * Größte-Rest-Methode: verteilt Segmentwerte auf exakt `cellCount` Zellen,
 * auch wenn Prozentwerte gerundet, negativ oder nicht endlich sind.
 */
export function allocateSquareMatrixCells(values: number[], cellCount: number) {
  const safeValues = values.map((value) => Math.max(0, finiteMatrixValue(value)));
  const total = safeValues.reduce((sum, value) => sum + value, 0);
  if (total <= 0 || cellCount <= 0) return values.map(() => 0);

  const raw = safeValues.map((value) => (value / total) * cellCount);
  const allocation = raw.map(Math.floor);
  const remaining = cellCount - allocation.reduce((sum, value) => sum + value, 0);
  const byRemainder = raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (let index = 0; index < remaining; index += 1) {
    const target = byRemainder[index % byRemainder.length];
    if (target) allocation[target.index] = (allocation[target.index] ?? 0) + 1;
  }
  return allocation;
}

export function nextSquareMatrixIndex(key: string, current: number, length: number) {
  if (length <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "ArrowRight" || key === "ArrowDown") return Math.min(length - 1, current + 1);
  if (key === "ArrowLeft" || key === "ArrowUp") return Math.max(0, current - 1);
  return null;
}
