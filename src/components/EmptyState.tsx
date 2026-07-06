import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Icon in der Kachel — z. B. ein Lucide-Icon (16 px, strokeWidth 1.75). */
  icon?: ReactNode;
  /** Primäraktion, z. B. ein `<Button>`. */
  action?: ReactNode;
  className?: string;
};

/**
 * Leerer Zustand: gestrichelte Karte mit Icon-Kachel, die zur ersten
 * Aktion einlädt — statt einer leeren Tabelle oder eines Dauer-Skeletons.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cx(
        "rounded-card border border-dashed border-line bg-white px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-paper [&_svg]:size-4">
          {icon}
        </span>
      )}
      <h4 className="mt-3.5 text-base">{title}</h4>
      {description && (
        <p className="mx-auto mt-1.5 max-w-[340px] text-[12.5px] text-muted">{description}</p>
      )}
      {action && <div className="mt-4.5 flex justify-center">{action}</div>}
    </div>
  );
}
