"use client";

import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Optionales Label rechts neben der Box. */
  children?: ReactNode;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Checkbox aus console-bausteine.html §014: 17-px-Box mit 5-px-Radius,
 * an = Ink-Fläche mit Lime-Haken.
 */
export function Checkbox({
  checked,
  onChange,
  disabled = false,
  children,
  id,
  className,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        "inline-flex cursor-pointer items-center gap-2.5 py-1 text-left text-[13px] text-ink disabled:cursor-default disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "inline-flex size-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-300 ease-fabrica",
          checked ? "border-ink bg-ink" : "border-line bg-white",
        )}
      >
        {checked && (
          <svg
            className="size-2.5 text-lime"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}
