import type { ComponentProps, ReactNode } from "react";
import { cx } from "../lib/cx";

/**
 * Field-Rezept der Website: weiße Karte, Line-Rahmen, Fokus färbt den Rahmen Ink.
 * Fehler sprechen Signal — als Rahmen und Hinweiszeile, nie als Fläche.
 */
export const fieldControlClasses =
  "w-full rounded-card border border-line bg-white px-3.5 py-[11px] text-[13px] text-ink outline-none transition-colors duration-300 ease-fabrica placeholder:text-muted focus:border-ink disabled:opacity-50";

export type InputProps = ComponentProps<"input"> & {
  /** Fehler-Zustand: Rahmen in Signal. */
  invalid?: boolean;
};

export function Input({ invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid ? true : rest["aria-invalid"]}
      className={cx(fieldControlClasses, invalid && "border-signal", className)}
    />
  );
}

export type TextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ invalid = false, className, rows = 5, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      aria-invalid={invalid ? true : rest["aria-invalid"]}
      className={cx(fieldControlClasses, "resize-none", invalid && "border-signal", className)}
    />
  );
}

export type FieldProps = {
  /** Label über dem Control — 11,5 px in Muted. */
  label?: ReactNode;
  /** Hinweiszeile unter dem Control. */
  hint?: ReactNode;
  /** Fehlertext — ersetzt den Hinweis und spricht Signal. */
  error?: ReactNode;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

/** Formularzeile: Label + Control + Hinweis/Fehler. */
export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[11.5px] text-muted">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-[11px] text-signal">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
