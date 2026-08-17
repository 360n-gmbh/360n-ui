import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs-shell";
import { ExamplePanel } from "@/components/example-panel";
import { componentBySlug, components } from "@/lib/components";

export function generateStaticParams() {
  return components.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const component = componentBySlug.get(slug);
  return component
    ? { title: component.name, description: component.description }
    : { title: "Komponente nicht gefunden" };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = componentBySlug.get(slug);
  if (!component) notFound();

  const index = components.findIndex((item) => item.slug === component.slug);
  const previous = index > 0 ? components[index - 1] : undefined;
  const next = index < components.length - 1 ? components[index + 1] : undefined;

  return (
    <DocsShell>
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] tracking-[0.12em] text-muted uppercase">{component.category}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{component.name}</h1>
        <p className="mt-4 max-w-2xl text-[14px] leading-7 text-muted">{component.description}</p>

        <div className="mt-9">
          <ExamplePanel slug={component.slug} code={component.code} />
        </div>

        <section className="mt-12 grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
          <h2 className="font-display text-lg font-semibold">Wann einsetzen</h2>
          <div className="rounded-card border border-line bg-white p-5 text-[13px] leading-6 text-muted">{component.guidance}</div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-lg font-semibold">API</h2>
            <p className="mt-1 text-[11px] text-muted">Öffentliche Props</p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-card border border-line bg-card">
            <table className="w-full min-w-[660px] border-collapse text-left text-[12px]">
              <thead className="bg-paper text-[10px] tracking-[0.1em] text-muted uppercase">
                <tr><th className="px-4 py-3 font-light">Prop</th><th className="px-4 py-3 font-light">Typ</th><th className="px-4 py-3 font-light">Default</th><th className="px-4 py-3 font-light">Beschreibung</th></tr>
              </thead>
              <tbody>
                {component.props.map((prop) => (
                  <tr key={prop.name} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-semibold">{prop.name}</td>
                    <td className="px-4 py-3"><code className="rounded-[5px] bg-mist px-1.5 py-0.5 text-[11px]">{prop.type}</code></td>
                    <td className="px-4 py-3 text-muted">{prop.default ?? "–"}</td>
                    <td className="max-w-md px-4 py-3 leading-5 text-muted">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <nav className="mt-14 grid grid-cols-2 gap-3 border-t border-line pt-6">
          {previous ? <Link href={`/components/${previous.slug}`} className="rounded-card border border-line bg-white p-4 text-xs no-underline hover:border-ink"><span className="block text-[10px] text-muted">← Zurück</span><strong className="mt-1 block font-display">{previous.name}</strong></Link> : <span />}
          {next ? <Link href={`/components/${next.slug}`} className="rounded-card border border-line bg-white p-4 text-right text-xs no-underline hover:border-ink"><span className="block text-[10px] text-muted">Weiter →</span><strong className="mt-1 block font-display">{next.name}</strong></Link> : <span />}
        </nav>
      </div>
    </DocsShell>
  );
}
