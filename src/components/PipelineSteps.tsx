import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type PipelineStepState = "done" | "active" | "pending";

export type PipelineStep = {
  label: ReactNode;
  /** Kleiner Zusatz unter dem Label, z. B. "HF → S3 · 4 m". */
  meta?: ReactNode;
  state: PipelineStepState;
};

export type PipelineStepsProps = {
  steps: PipelineStep[];
  className?: string;
};

/**
 * Schritt-Anzeige für den Deploy-Workflow: erledigt = Ink,
 * aktiv = Lime mit Ring, offen = Linie. Der aktive Schritt ist
 * der einzige mit Gewicht.
 */
export function PipelineSteps({ steps, className }: PipelineStepsProps) {
  return (
    <ol className={cx("flex list-none items-start", className)}>
      {steps.map((step, i) => {
        const done = step.state === "done";
        const active = step.state === "active";
        return (
          <li key={i} className="relative min-w-[70px] flex-1 text-center">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cx(
                  "absolute top-3.5 right-[calc(-50%+16px)] left-[calc(50%+16px)] h-0.5",
                  done ? "bg-ink" : "bg-line",
                )}
              />
            )}
            <span
              className={cx(
                "relative z-[1] mx-auto flex size-7 items-center justify-center rounded-full border text-[11px]",
                done && "border-ink bg-ink text-white",
                active &&
                  "border-lime bg-lime text-ink shadow-[0_0_0_5px_rgba(210,255,55,0.3)]",
                step.state === "pending" && "border-line bg-white text-muted",
              )}
            >
              {done ? (
                <svg
                  aria-label="erledigt"
                  className="size-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <p className={cx("mt-2 text-[11px]", active && "font-display font-semibold")}>
              {step.label}
            </p>
            {step.meta != null && <p className="text-[10px] text-muted">{step.meta}</p>}
          </li>
        );
      })}
    </ol>
  );
}
