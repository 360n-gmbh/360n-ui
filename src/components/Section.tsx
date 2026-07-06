import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type SectionProps = {
  children: ReactNode;
  id?: string;
  /** Dunkle Sektionen: Ink-Panel mit Panel-Radius (18 px). */
  dark?: boolean;
  /** Ohne innere Max-Breite rendern. */
  bleed?: boolean;
  className?: string;
};

/** Seitensektion mit konsistenter Max-Breite und vertikalem Rhythmus. */
export function Section({ children, id, dark = false, bleed = false, className }: SectionProps) {
  return (
    <section id={id} className={cx(dark && "rounded-panel bg-ink text-white", className)}>
      <div className={bleed ? undefined : "mx-auto w-full max-w-7xl px-5 sm:px-8"}>{children}</div>
    </section>
  );
}

export type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

/** Eyebrow-Label über Überschriften: Lime-Punkt mit Ring + Muted-Text. */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cx("mb-4 inline-flex items-center gap-2 text-sm text-muted", className)}>
      <span className="size-1.5 rounded-full bg-lime ring-2 ring-ink/10" aria-hidden />
      {children}
    </p>
  );
}
