import type { ComponentProps } from "react";
import { cx } from "../lib/cx";
import { fieldControlClasses } from "./Field";

export type SelectProps = ComponentProps<"select"> & {
  /** Fehler-Zustand: Rahmen in Signal. */
  invalid?: boolean;
  /** Klassen für den äußeren Wrapper (Breite etc.). */
  wrapperClassName?: string;
};

/**
 * Natives Select im Field-Rezept — appearance-none plus eigener Chevron
 * (Muster aus console-bausteine.html §014).
 */
export function Select({
  invalid = false,
  className,
  wrapperClassName,
  children,
  ...rest
}: SelectProps) {
  return (
    <span className={cx("relative block", wrapperClassName)}>
      <select
        {...rest}
        aria-invalid={invalid ? true : rest["aria-invalid"]}
        className={cx(
          fieldControlClasses,
          "cursor-pointer appearance-none pr-9",
          invalid && "border-signal",
          className,
        )}
      >
        {children}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
