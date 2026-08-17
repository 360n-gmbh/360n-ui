"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Aktionsleiste unten rechts — z. B. `<Button variant="outline">` + `<Button variant="lime">`. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Modal als Panel mit Ink-Schleier (console-bausteine.html §015):
 * Overlay in Ink/45 mit Blur, Panel mit 18-px-Radius. Schließt per
 * Escape und Klick auf den Schleier.
 */
export function Modal({ open, onClose, title, children, actions, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-3 backdrop-blur-[3px] sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          // max-h + interner Scroll: bei langem Inhalt scrollt der Body,
          // Titel und Aktionsleiste bleiben immer sichtbar (kein „Erstellen"-
          // Button, der erst nach Scrollen erscheint).
          "flex max-h-[min(90dvh,760px)] w-full max-w-[480px] min-w-0 flex-col rounded-panel bg-card p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-7",
          className,
        )}
      >
        {title != null && <h3 className="shrink-0 text-xl">{title}</h3>}
        {children != null && (
          <div className="mt-2.5 min-h-0 flex-1 overflow-y-auto text-[13px] text-muted">
            {children}
          </div>
        )}
        {actions != null && (
          <div className="mt-4.5 flex max-w-full shrink-0 flex-wrap justify-end gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
