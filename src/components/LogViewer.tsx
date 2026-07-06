"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Toggle } from "./Toggle";

export type LogLevel = "info" | "ready" | "warn" | "error";

export type LogLine = {
  /** Zeitstempel, z. B. "14:31:52.104" — gerendert in Weiß/35. */
  ts?: string;
  level?: LogLevel;
  text: ReactNode;
};

const levelClasses: Record<LogLevel, string> = {
  info: "text-white/55",
  ready: "text-lime",
  warn: "text-amber",
  error: "text-[#ff8589]",
};

const levelLabels: Record<LogLevel, string> = {
  info: "[INFO]",
  ready: "[READY]",
  warn: "[WARN]",
  error: "[ERROR]",
};

export type LogViewerProps = {
  lines: LogLine[];
  /** Kopfzeile, z. B. "sglang · glm-4.7-air · node-03". */
  title?: ReactNode;
  /** Status neben dem Titel, z. B. eine `<StatusPill>`. */
  status?: ReactNode;
  /** Automatisch ans Ende scrollen, wenn neue Zeilen ankommen. */
  follow?: boolean;
  /** Rendert den Follow-Schalter in der Kopfzeile. */
  onFollowChange?: (follow: boolean) => void;
  /** Blinkender Lime-Cursor am Ende — für laufende Streams. */
  caret?: boolean;
  /** Höhe des Log-Bereichs in Pixeln. */
  height?: number;
  className?: string;
};

/**
 * Log-Viewer: Ink-Deep-Panel, 12-px-Monospace, Zeitstempel in Weiß/35,
 * Level in den Semantik-Farben, Cursor blinkt Lime.
 */
export function LogViewer({
  lines,
  title,
  status,
  follow = true,
  onFollowChange,
  caret = false,
  height = 240,
  className,
}: LogViewerProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (follow && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, follow]);

  return (
    <div className={cx("overflow-hidden rounded-card bg-ink-deep text-white", className)}>
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3 text-xs">
        {title != null && <span className="font-display font-semibold">{title}</span>}
        {status}
        {onFollowChange && (
          <label className="ml-auto flex items-center gap-2 text-[11px] text-white/55">
            Follow
            <Toggle
              checked={follow}
              onChange={onFollowChange}
              className="scale-85"
              aria-label="Follow"
            />
          </label>
        )}
      </div>
      <div
        ref={bodyRef}
        className="overflow-y-auto px-4 py-3.5 font-sans text-xs leading-[1.9]"
        style={{ height }}
      >
        {lines.map((line, i) => (
          <div key={i}>
            {line.ts && <span className="mr-2.5 text-white/35">{line.ts}</span>}
            {line.level && (
              <span className={cx("mr-2 inline-block w-[52px]", levelClasses[line.level])}>
                {levelLabels[line.level]}
              </span>
            )}
            {line.text}
          </div>
        ))}
        {caret && (
          <span
            aria-hidden
            className="inline-block h-3.5 w-[7px] -translate-y-0.5 animate-blink bg-lime align-middle"
          />
        )}
      </div>
    </div>
  );
}
