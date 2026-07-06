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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[3px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          "w-full max-w-[480px] rounded-panel bg-card p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)]",
          className,
        )}
      >
        {title != null && <h3 className="text-xl">{title}</h3>}
        {children != null && <div className="mt-2.5 text-[13px] text-muted">{children}</div>}
        {actions != null && <div className="mt-4.5 flex justify-end gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
