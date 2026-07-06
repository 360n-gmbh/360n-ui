import { Fragment } from "react";
import type { ElementType, ReactNode } from "react";
import { cx } from "../lib/cx";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Link-Komponente, z. B. `Link` aus next/link. Default: `<a>`. */
  linkComponent?: ElementType;
  className?: string;
};

/** Brotkrumen in Muted, Trenner in Line, aktuelle Seite in Ink. */
export function Breadcrumbs({ items, linkComponent: Link = "a", className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Brotkrumen"
      className={cx("flex flex-wrap items-center gap-2 text-[13px] text-muted", className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span aria-hidden className="text-line">
                /
              </span>
            )}
            {isLast ? (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-muted no-underline transition-colors duration-300 ease-fabrica hover:text-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
