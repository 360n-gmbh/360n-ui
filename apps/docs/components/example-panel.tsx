"use client";

import { useState } from "react";
import { ComponentPreview } from "./component-preview";

export function ExamplePanel({ slug, code }: { slug: string; code: string }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="overflow-hidden rounded-panel border border-line bg-card">
      <div className="flex items-center border-b border-line px-4">
        {(["preview", "code"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`-mb-px cursor-pointer border-b-2 px-3 py-3 text-xs ${tab === item ? "border-ink text-ink" : "border-transparent text-muted"}`}
          >
            {item === "preview" ? "Vorschau" : "Code"}
          </button>
        ))}
        {tab === "code" && (
          <button type="button" onClick={copyCode} className="ml-auto cursor-pointer rounded-full border border-line bg-white px-3 py-1 text-[11px]">
            {copied ? "Kopiert" : "Kopieren"}
          </button>
        )}
      </div>
      {tab === "preview" ? (
        <div className="preview-checker flex min-h-[360px] items-center justify-center overflow-hidden p-6 sm:p-10">
          <ComponentPreview slug={slug} />
        </div>
      ) : (
        <pre className="max-w-full overflow-x-auto bg-ink-deep p-5 text-[12px] leading-7 text-white"><code>{code}</code></pre>
      )}
    </section>
  );
}
