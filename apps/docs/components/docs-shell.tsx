"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories, components } from "@/lib/components";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/92 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-6 px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <span className="size-3 rounded-full bg-ink" aria-hidden />
            <span className="font-display text-lg font-semibold tracking-tight">360n</span>
            <sup className="-ml-1 text-[8px]">®</sup>
            <span className="text-xs text-muted">ui</span>
          </Link>
          <nav className="hidden items-center gap-5 text-[12.5px] md:flex">
            <Link className={pathname === "/" ? "text-ink" : "text-muted hover:text-ink"} href="/">Komponenten</Link>
            <Link className={pathname.startsWith("/foundations") ? "text-ink" : "text-muted hover:text-ink"} href="/foundations">Grundlagen</Link>
          </nav>
          <a
            className="ml-auto rounded-full border border-line bg-white px-3.5 py-1.5 text-xs no-underline transition-colors hover:border-ink"
            href="https://github.com/360n-gmbh/360n-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] md:grid-cols-[238px_minmax(0,1fr)]">
        <aside className="hidden border-r border-line px-5 py-8 md:block">
          <nav className="sticky top-22 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <p className="mb-3 text-[10px] tracking-[0.12em] text-muted uppercase">Start</p>
            <Link href="/" className="mb-1 block rounded-[8px] px-2.5 py-1.5 text-[12.5px] hover:bg-white">Alle Komponenten</Link>
            <Link href="/foundations" className="mb-6 block rounded-[8px] px-2.5 py-1.5 text-[12.5px] hover:bg-white">Design-Grundlagen</Link>
            {categories.map((category) => (
              <div key={category} className="mb-5">
                <p className="mb-2 text-[10px] tracking-[0.12em] text-muted uppercase">{category}</p>
                {components.filter((item) => item.category === category).map((item) => {
                  const href = `/components/${item.slug}`;
                  const active = pathname === href || pathname === `${href}/`;
                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      className={`mb-0.5 block rounded-[8px] px-2.5 py-1.5 text-[12.5px] no-underline transition-colors ${active ? "bg-ink text-white" : "text-muted hover:bg-white hover:text-ink"}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 px-4 py-8 sm:px-7 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
