import { ComponentGallery } from "@/components/component-gallery";
import { DocsShell } from "@/components/docs-shell";

export default function HomePage() {
  return (
    <DocsShell>
      <section className="docs-grid relative mb-14 overflow-hidden rounded-panel border border-line bg-card px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-[6px] border border-line bg-white px-2.5 py-1 text-[10px] tracking-[0.1em] text-muted uppercase">
            <span className="size-1.5 rounded-[2px] bg-lime shadow-[0_0_0_3px_rgba(210,255,55,0.35)]" />
            Package + Living Guidelines
          </div>
          <h1 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Eine Sprache.<br />Jede Oberfläche.
          </h1>
          <p className="mt-6 max-w-2xl text-[14px] leading-7 text-muted sm:text-[15px]">
            Die produktive Referenz für 360n: echte React-Komponenten, Tokens, Regeln und kopierbare Beispiele – versioniert im selben Commit wie das Node-Package.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#component-heading" className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-xs text-white no-underline">Komponenten ansehen</a>
            <code className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-[11.5px]">npm i @360n-gmbh/ui</code>
          </div>
        </div>
        <span aria-hidden className="absolute -right-12 -bottom-16 size-56 rotate-12 bg-lime opacity-90 [clip-path:polygon(0_0,100%_18%,82%_100%,12%_84%)]" />
      </section>

      <ComponentGallery />
    </DocsShell>
  );
}
