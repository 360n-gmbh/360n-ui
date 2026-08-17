import type { CSSProperties } from "react";
import { cx } from "../lib/cx";

export type BlockSnakeProps = {
  /** Kantenlänge des Loaders in px. */
  size?: number;
  /** Umlaufzeit in Sekunden. */
  duration?: number;
  className?: string;
  /** Zugänglicher Text — Default „Antwort wird vorbereitet". */
  label?: string;
};

/** Ring-Positionen (3×3 ohne Mitte), im Uhrzeigersinn ab oben links. */
const RING: [number, number][] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [0, 1],
];

/** Eine Zelle trägt Lime — der sparsame Neon-Akzent, wenn die Schlange vorbeiläuft. */
const NEON_INDEX = 2;

/**
 * BlockSnake: der Warte-Loader der Plattform (z. B. Time-to-First-Token im
 * Chat) — quadratische Blöcke auf einem Quadrat-Ring, eine Schlange aus drei
 * aktiven Zellen dreht im Uhrzeigersinn (Snake-Geste, harte Schritte, kein
 * Easing). Rein CSS, deterministisch, respektiert prefers-reduced-motion
 * über die globale Keyframe-Definition.
 */
export function BlockSnake({
  size = 20,
  duration = 1.1,
  className,
  label = "Antwort wird vorbereitet",
}: BlockSnakeProps) {
  const cell = size / 4; // Zellgröße; Lücke = restliche Verteilung über 3 Spuren
  const step = (col: number) => col * ((size - cell) / 2);

  return (
    <span
      role="img"
      aria-label={label}
      className={cx("relative inline-block shrink-0 align-middle", className)}
      style={{ width: size, height: size }}
    >
      {RING.map(([cx_, cy], i) => {
        const style: CSSProperties = {
          position: "absolute",
          left: step(cx_),
          top: step(cy),
          width: cell,
          height: cell,
          animation: `snake-step ${duration}s linear infinite`,
          animationDelay: `${(-(i / RING.length) * duration).toFixed(3)}s`,
        };
        return (
          <span
            key={i}
            aria-hidden
            className={i === NEON_INDEX ? "bg-lime" : "bg-ink"}
            style={style}
          />
        );
      })}
    </span>
  );
}
