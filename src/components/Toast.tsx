"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export type ToastKind = "ok" | "err" | "warn" | "info";

export type ToastOptions = {
  message: ReactNode;
  /** Punkt-Semantik: ok = Lime, err = Signal, warn = Amber, info = Cobalt. */
  kind?: ToastKind;
  /** Anzeigedauer in ms; 0 = bleibt stehen. Default: 4200. */
  duration?: number;
};

type ToastEntry = Required<Pick<ToastOptions, "kind" | "duration">> &
  Pick<ToastOptions, "message"> & { id: number };

const dotClasses: Record<ToastKind, string> = {
  ok: "bg-lime shadow-[0_0_0_3px_rgba(210,255,55,0.4)]",
  err: "bg-signal shadow-[0_0_0_3px_rgba(229,72,77,0.18)]",
  warn: "bg-amber shadow-[0_0_0_3px_rgba(227,154,11,0.18)]",
  info: "bg-cobalt shadow-[0_0_0_3px_rgba(39,54,208,0.15)]",
};

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** Zugriff auf den Toast-Helfer — nur innerhalb von `<ToastProvider>`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast muss innerhalb von <ToastProvider> verwendet werden.");
  }
  return ctx;
}

export type ToastProviderProps = {
  children: ReactNode;
};

/**
 * Toast-Helfer: Meldungen unten rechts mit Punkt-Semantik,
 * schließen sich nach 4,2 s selbst.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      const entry: ToastEntry = {
        id,
        message: options.message,
        kind: options.kind ?? "ok",
        duration: options.duration ?? 4200,
      };
      setToasts((current) => [...current, entry]);
      if (entry.duration > 0) {
        setTimeout(() => dismiss(id), entry.duration);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-5 bottom-5 z-[70] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex min-w-[280px] animate-toast-in items-center gap-2.5 rounded-card border border-line bg-card px-4 py-3 text-[13px] text-ink shadow-[0_10px_34px_rgba(0,0,0,0.12)]"
          >
            <span aria-hidden className={cx("size-[7px] shrink-0 rounded-full", dotClasses[t.kind])} />
            <span>{t.message}</span>
            <button
              type="button"
              aria-label="Schließen"
              onClick={() => dismiss(t.id)}
              className="ml-auto cursor-pointer bg-transparent text-sm text-muted transition-colors duration-300 ease-fabrica hover:text-ink"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
