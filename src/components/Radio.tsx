"use client";

import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type RadioProps = {
  checked: boolean;
  /** Wird beim Auswählen aufgerufen — die Gruppenlogik hält der Aufrufer. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Optionales Label rechts neben dem Punkt. */
  children?: ReactNode;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Radio aus console-bausteine.html §014: 17-px-Kreis,
 * ausgewählt = Ink-Rahmen mit 9-px-Ink-Punkt.
 */
export function Radio({
  checked,
  onSelect,
  disabled = false,
  children,
  id,
  className,
  "aria-label": ariaLabel,
}: RadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      disabled={disabled}
      onClick={() => {
        if (!checked) onSelect?.();
      }}
      className={cx(
        "inline-flex cursor-pointer items-center gap-2.5 py-1 text-left text-[13px] text-ink disabled:cursor-default disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "inline-flex size-[17px] shrink-0 items-center justify-center rounded-full border bg-white transition-colors duration-300 ease-fabrica",
          checked ? "border-ink" : "border-line",
        )}
      >
        {checked && <span className="size-[9px] rounded-full bg-ink" />}
      </span>
      {children}
    </button>
  );
}
