import type { CSSProperties } from "react";
import { cx } from "../lib/cx";

export type StreamFlickerProps = {
  /** Deterministischer Seed — gleiche Zeile, gleiches Muster (Hydration-sicher). */
  seed?: number;
  /** Deckkraft des gesamten Overlays. */
  opacity?: number;
  /** Anzahl Block-Spuren übereinander. */
  rows?: number;
  className?: string;
};

/**
 * StreamFlicker: das Streaming-Signal der Plattform — Blöcke ziehen in
 * mehreren Spuren von rechts nach links, einzelne Zellen flackern hart
 * (steps(2)), die Kanten laufen über eine Maske weich aus. Als absolutes
 * Overlay über das GANZE Listenelement legen (Eltern-Element: relative;
 * Overlay ist pointer-events-frei und rein dekorativ).
 * Muster deterministisch aus `seed` (LCG) — kein Math.random im Render.
 */
export function StreamFlicker({
  seed = 1177,
  opacity = 0.35,
  rows: rowCount = 4,
  className,
}: StreamFlickerProps) {
  // LCG wie in der Design-Referenz — deterministisch pro Seed.
  let s = (seed * 97 + 13) >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const ri = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));

  const SZ = 7; // Zellgröße px
  const GAP = 1.5;
  const PITCH = SZ + GAP;
  const COPY = 1400; // eine Kopie der Spur — breiter als jede Listenzeile

  const rows = Array.from({ length: rowCount }, () => {
    const dur = +(14 + rnd() * 6).toFixed(1);
    const delay = +(-rnd() * dur).toFixed(1);
    const cells: {
      kind: "cell" | "hole";
      w: number;
      a?: number;
      neon?: boolean;
      anim?: string;
    }[] = [];
    let x = 0;
    while (x < COPY) {
      const run = ri(2, 6);
      for (let k = 0; k < run && x < COPY; k++) {
        // Ganz leichtes Neon: nur ~1 von 8 Blöcken trägt Lime, der Rest Ink —
        // der Akzent bleibt sparsam (eine Handvoll Funken pro Zeile).
        const neon = rnd() < 0.12;
        cells.push({
          kind: "cell",
          w: SZ,
          neon,
          a: neon ? 0.85 : +(0.23 + rnd() * 0.23).toFixed(2),
          anim: `cell-blink ${(0.8 + rnd() * 1.6).toFixed(1)}s steps(2) ${(-rnd() * 2).toFixed(1)}s infinite`,
        });
        x += PITCH;
      }
      const hole = ri(2, 4) * PITCH;
      cells.push({ kind: "hole", w: hole });
      x += hole;
    }
    // Zellen dupliziert → -50 % translateX ist exakt eine Kopie = nahtlos.
    return { dur, delay, cells: cells.concat(cells) };
  });

  const maskStyle: CSSProperties = {
    opacity,
    WebkitMaskImage:
      "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
    maskImage:
      "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
  };

  return (
    <span
      aria-hidden
      className={cx(
        "pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden",
        className,
      )}
      style={{ ...maskStyle, gap: GAP }}
    >
      {rows.map((row, r) => (
        <span key={r} className="block flex-none overflow-hidden" style={{ height: SZ }}>
          <span
            className="flex w-max items-center"
            style={{
              height: SZ,
              animation: `stream-flow ${row.dur}s linear infinite`,
              animationDelay: `${row.delay}s`,
            }}
          >
            {row.cells.map((c, i) =>
              c.kind === "hole" ? (
                <span key={i} className="flex-none" style={{ width: c.w }} />
              ) : (
                <span
                  key={i}
                  className={c.neon ? "flex-none bg-lime" : "flex-none bg-ink"}
                  style={{
                    width: c.w,
                    height: SZ,
                    marginRight: GAP,
                    opacity: c.a,
                    animation: c.anim,
                  }}
                />
              ),
            )}
          </span>
        </span>
      ))}
    </span>
  );
}
