"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Modal } from "./Modal";

export type InfoHintProps = {
  /** Ein-Satz-Erklärung im Hover-Tooltip. */
  short: string;
  /** Titel der Erklär-Karte (Modal). Ohne title+children öffnet Klick kein Modal. */
  title?: ReactNode;
  /** Ausführliche Erklärung in der Modal-Karte. */
  children?: ReactNode;
  /** Zugänglicher Name des Buttons — Default „Erklärung". */
  label?: string;
  className?: string;
};

/**
 * Info-Punkt („i"): kleines Erklärzeichen neben Begriffen und Spaltenköpfen.
 * Hover/Fokus zeigt die Ein-Satz-Erklärung als Tooltip, Klick öffnet — wenn
 * title/children gesetzt sind — die ausführliche Erklär-Karte als Modal.
 * Vorgabe 2026-08-16: Fachbegriffe (TTFT, Tokens/s, Kontingente …) tragen
 * immer ein solches „i".
 */
export function InfoHint({ short, title, children, label, className }: InfoHintProps) {
  const tipId = useId();
  const [tip, setTip] = useState(false);
  const [open, setOpen] = useState(false);
  const hasModal = title != null && children != null;

  return (
    <span className={cx("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label ?? "Erklärung"}
        aria-describedby={tip ? tipId : undefined}
        onPointerEnter={() => setTip(true)}
        onPointerLeave={() => setTip(false)}
        onFocus={() => setTip(true)}
        onBlur={() => setTip(false)}
        onClick={() => {
          if (hasModal) {
            setTip(false);
            setOpen(true);
          }
        }}
        className={cx(
          "inline-flex size-[15px] items-center justify-center rounded-full border border-line bg-card font-sans text-[9.5px] font-normal text-muted normal-case transition-colors duration-300 ease-fabrica select-none",
          hasModal ? "cursor-pointer hover:border-ink hover:text-ink" : "cursor-help",
        )}
      >
        i
      </button>

      {tip && !open && (
        <span
          id={tipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-[70] mb-1.5 w-max max-w-[240px] -translate-x-1/2 rounded-[10px] bg-ink px-2.5 py-1.5 text-left text-[11px] leading-snug font-light tracking-normal text-white normal-case shadow-lg"
        >
          {short}
          {hasModal && <span className="mt-0.5 block text-white/50">Klick für Details</span>}
        </span>
      )}

      {hasModal && (
        <Modal open={open} onClose={() => setOpen(false)} title={title}>
          {children}
        </Modal>
      )}
    </span>
  );
}
