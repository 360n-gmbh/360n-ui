"use client";

import { cx } from "../lib/cx";

export type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Schalter aus console-bausteine.html §014: Track in Mist,
 * an = Ink-Track mit Lime-Knopf. Bewegung 350 ms mit easeFabrica.
 */
export function Toggle({
  checked,
  onChange,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full border transition-colors duration-[350ms] ease-fabrica disabled:cursor-default disabled:opacity-50",
        checked ? "border-ink bg-ink" : "border-line bg-mist",
        className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "absolute top-0.5 left-0.5 size-4 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-[350ms] ease-fabrica",
          checked ? "translate-x-[18px] bg-lime" : "translate-x-0 bg-white",
        )}
      />
    </button>
  );
}
