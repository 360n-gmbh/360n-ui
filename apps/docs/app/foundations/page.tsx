import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Design-Grundlagen",
  description: "Farbe, Typografie, Form, Bewegung und Inhaltsregeln des 360n Design-Systems.",
};

const colors = [
  ["Ink", "#111111", "bg-ink", "Text, Primäraktion, Struktur"],
  ["Paper", "#f5f5f5", "bg-paper", "Arbeitsfläche und Fugen"],
  ["Card", "#ffffff", "bg-card", "Inhaltsflächen"],
  ["Lime", "#d2ff37", "bg-lime", "Ein gezielter Akzent"],
  ["Cobalt", "#2736d0", "bg-cobalt", "Laufender technischer Zustand"],
  ["Signal", "#e5484d", "bg-signal", "Fehler und destruktive Aktion"],
  ["Amber", "#e39a0b", "bg-amber", "Warnung und Drift"],
];

export default function FoundationsPage() {
  return (
    <DocsShell>
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] tracking-[0.12em] text-muted uppercase">Foundations</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">Das System hinter der Oberfläche.</h1>
        <p className="mt-5 max-w-2xl text-[14px] leading-7 text-muted">360n ist ein präzises Werkzeug: ruhige Flächen, harte Information und genau ein Moment Lime, wenn Aufmerksamkeit wirklich zählt.</p>

        <section className="mt-14 border-t border-line pt-8">
          <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div><p className="text-[10px] tracking-[0.12em] text-muted uppercase">001</p><h2 className="mt-1 font-display text-xl font-semibold">Farbe</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {colors.map(([name, hex, bg, usage]) => (
                <div key={name} className="overflow-hidden rounded-card border border-line bg-white">
                  <div className={`h-24 ${bg}`} />
                  <div className="p-4"><div className="flex items-baseline justify-between gap-3"><strong className="font-display text-sm">{name}</strong><code className="text-[10px] text-muted">{hex}</code></div><p className="mt-1 text-[11px] text-muted">{usage}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div><p className="text-[10px] tracking-[0.12em] text-muted uppercase">002</p><h2 className="mt-1 font-display text-xl font-semibold">Typografie</h2></div>
            <div className="space-y-3 rounded-panel border border-line bg-white p-6 sm:p-8">
              <p className="font-display text-4xl font-semibold tracking-tight">Inter SemiBold spricht.</p>
              <p className="max-w-xl text-[15px] leading-7 text-muted">Cascadia Code erklärt. Zahlen bleiben mit tabular-nums stabil, während Live-Werte aktualisiert werden.</p>
              <p className="font-display text-5xl font-semibold tabular-nums">40.492 <small className="font-sans text-sm font-light text-muted">Requests</small></p>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div><p className="text-[10px] tracking-[0.12em] text-muted uppercase">003–006</p><h2 className="mt-1 font-display text-xl font-semibold">Regeln</h2></div>
            <ol className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
              {[
                ["Ein Akzent", "Lime markiert den wichtigsten Moment, nicht jede Interaktion."],
                ["Eckige Semantik", "Badges sind Vierecke mit weichen Ecken; Pills bleiben Aktionen vorbehalten."],
                ["Skeleton vor Spinner", "Inhalt lädt in seiner späteren Silhouette. Spinner gehören nur in Buttons."],
                ["Bewegung mit Zweck", "Maximal 500 ms im Werkzeug, deterministisch und reduced-motion-fähig."],
                ["Erklärung am Begriff", "Technische Metriken erhalten einen InfoHint statt globaler Fußnoten."],
                ["Keine geheimen Daten", "Keys, Tokens, interne IDs und Provider-Namen erscheinen nie in UI oder Logs."],
              ].map(([title, text], index) => (
                <li key={title} className="bg-white p-5"><span className="text-[10px] text-muted">0{index + 1}</span><h3 className="mt-2 font-display text-sm font-semibold">{title}</h3><p className="mt-1.5 text-[12px] leading-5 text-muted">{text}</p></li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </DocsShell>
  );
}
