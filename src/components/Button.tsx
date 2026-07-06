"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { cx } from "../lib/cx";

export type ButtonVariant = "dark" | "lime" | "light" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  dark: "bg-ink text-white hover:bg-ink-soft",
  lime: "bg-lime text-ink hover:brightness-95",
  light: "bg-white text-ink hover:bg-mist",
  outline: "border border-line bg-transparent text-ink hover:bg-white",
  ghost: "border border-line bg-white text-ink hover:bg-mist",
  danger: "bg-signal text-white hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendert einen Link (`<a>`) statt eines Buttons. */
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /**
   * Lauf-Indikator während einer Aktion (z. B. Submit) — der einzige Ort,
   * an dem im 360n-System ein Spinner erlaubt ist. Inhalte laden mit Skeletons.
   */
  pending?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  title?: string;
  "aria-label"?: string;
};

function Spinner() {
  return (
    <svg className="size-3.5 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Pill-Button mit dem Roll-Hover der Website: das Label ist doppelt gerendert,
 * das sichtbare fährt per `group-hover:-translate-y-full` nach oben raus,
 * das Duplikat rollt von unten nach — pures CSS, 500 ms mit easeFabrica.
 */
export function Button({
  children,
  variant = "dark",
  size = "md",
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  pending = false,
  onClick,
  className,
  title,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cx(
    "group inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full whitespace-nowrap no-underline transition-[background-color,border-color,filter] duration-500 ease-fabrica",
    variantClasses[variant],
    sizeClasses[size],
    (disabled || pending) && "pointer-events-none opacity-60",
    className,
  );

  const label = (
    <>
      {pending && <Spinner />}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-fabrica group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-fabrica group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
        onClick={onClick}
        className={classes}
        title={title}
        aria-label={ariaLabel}
        aria-disabled={disabled || pending || undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || pending}
      onClick={onClick}
      className={classes}
      title={title}
      aria-label={ariaLabel}
      aria-busy={pending || undefined}
    >
      {label}
    </button>
  );
}
