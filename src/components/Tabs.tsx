"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type TabItem = {
  id: string;
  label: ReactNode;
  /** Optionaler Zähler rechts neben dem Label. */
  count?: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  /** Kontrollierter Modus: aktive Tab-ID. */
  value?: string;
  /** Unkontrollierter Modus: initiale Tab-ID (Default: erster Tab). */
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
};

/**
 * Tab-Leiste mit Ink-Unterstrich (console-bausteine.html §015).
 * Die Panels rendert der Aufrufer anhand der aktiven ID.
 */
export function Tabs({ items, value, defaultValue, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;

  return (
    <div role="tablist" className={cx("flex gap-0.5 border-b border-line", className)}>
      {items.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => {
              setInternal(item.id);
              onChange?.(item.id);
            }}
            className={cx(
              "-mb-px cursor-pointer border-b-2 px-4 py-2 transition-colors duration-300 ease-fabrica",
              on
                ? "border-ink font-display text-[12.5px] font-semibold text-ink"
                : "border-transparent text-[13px] text-muted hover:text-ink",
            )}
          >
            {item.label}
            {item.count != null && <span className="ml-1.5 text-[11px] text-muted">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
