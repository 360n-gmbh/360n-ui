"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ComponentPreview } from "./component-preview";
import { components } from "@/lib/components";

export function ComponentGallery() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("de");
    if (!needle) return components;
    return components.filter((component) =>
      `${component.name} ${component.category} ${component.description}`.toLocaleLowerCase("de").includes(needle),
    );
  }, [query]);

  return (
    <section aria-labelledby="component-heading">
      <div className="mb-6 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.12em] text-muted uppercase">{components.length} Bausteine</p>
          <h2 id="component-heading" className="mt-1 font-display text-2xl font-semibold tracking-tight">Komponenten</h2>
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Komponenten durchsuchen</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Komponente suchen …"
            className="h-10 w-full rounded-full border border-line bg-white px-4 text-[12.5px] outline-none transition-colors placeholder:text-muted focus:border-ink"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((component) => (
            <article key={component.slug} className="group overflow-hidden rounded-panel border border-line bg-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink">
              <div className="preview-checker flex min-h-[220px] items-center justify-center overflow-hidden border-b border-line p-5">
                <ComponentPreview slug={component.slug} compact />
              </div>
              <div className="flex items-start gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.1em] text-muted uppercase">{component.category}</p>
                  <h3 className="mt-1 font-display text-base font-semibold">{component.name}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{component.description}</p>
                </div>
                <Link
                  href={`/components/${component.slug}`}
                  aria-label={`${component.name} öffnen`}
                  className="ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-sm no-underline transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"
                >
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-panel border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Keine Komponente gefunden.</p>
          <button type="button" onClick={() => setQuery("")} className="mt-2 cursor-pointer text-xs text-muted underline underline-offset-4">Suche zurücksetzen</button>
        </div>
      )}
    </section>
  );
}
