export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentDoc = {
  slug: string;
  name: string;
  category: "Aktion" | "Formular" | "Daten" | "Feedback" | "Navigation" | "Bewegung" | "Layout";
  description: string;
  guidance: string;
  code: string;
  props: PropDoc[];
};

const classNameProp: PropDoc = {
  name: "className",
  type: "string",
  description: "Optionale Klassen für gezielte Layout-Anpassungen.",
};

export const components: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    category: "Aktion",
    description: "Primäre und sekundäre Aktionen mit der 360n Roll-Hover-Signatur.",
    guidance: "Lime bleibt der wichtigsten Aktion einer Fläche vorbehalten. Spinner erscheinen nur während einer Aktion, nie als Inhalts-Loader.",
    code: `import { Button } from "@360n-gmbh/ui";

<Button variant="dark">Deploy starten</Button>
<Button variant="lime" href="/keys">API-Key erstellen</Button>`,
    props: [
      { name: "variant", type: '"dark" | "lime" | "light" | "outline" | "ghost" | "danger"', default: '"dark"', description: "Visuelle Priorität der Aktion." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Höhe und horizontaler Innenabstand." },
      { name: "pending", type: "boolean", default: "false", description: "Sperrt die Aktion und zeigt den Aktions-Spinner." },
      classNameProp,
    ],
  },
  {
    slug: "tag",
    name: "Tag",
    category: "Daten",
    description: "Kompaktes, eckiges Label für Kategorien und Projektmerkmale.",
    guidance: "Tags sind keine Statusanzeige. Für Laufzustände wird StatusPill verwendet.",
    code: `import { Tag } from "@360n-gmbh/ui";

<Tag>Production</Tag>
<Tag variant="light">EU hosted</Tag>`,
    props: [
      { name: "variant", type: '"ink" | "light" | "onDark"', default: '"ink"', description: "Kontrastvariante für den jeweiligen Untergrund." },
      classNameProp,
    ],
  },
  {
    slug: "status-pill",
    name: "StatusPill",
    category: "Feedback",
    description: "Semantischer Zustand für live, laufend, Warnung, Fehler und inaktiv.",
    guidance: "Die tint-Variante trägt die Semantik über die Fläche und zeigt standardmäßig keinen Punkt.",
    code: `import { StatusPill } from "@360n-gmbh/ui";

<StatusPill status="live">live</StatusPill>
<StatusPill status="warn" variant="tint">Kontingent</StatusPill>`,
    props: [
      { name: "status", type: '"live" | "run" | "warn" | "err" | "idle"', description: "Semantischer Zustand." },
      { name: "variant", type: '"default" | "dark" | "tint"', default: '"default"', description: "Darstellung auf hellem, dunklem oder getöntem Grund." },
      { name: "dot", type: "boolean", description: "Überschreibt die automatische Marker-Anzeige." },
      classNameProp,
    ],
  },
  {
    slug: "field",
    name: "Field",
    category: "Formular",
    description: "Label, Eingabe und Hinweis- oder Fehlerzeile als konsistente Einheit.",
    guidance: "Fehler werden mit Signal-Rahmen und Text kommuniziert, nicht mit großen roten Flächen.",
    code: `import { Field, Input } from "@360n-gmbh/ui";

<Field label="Projektname" hint="In Logs und Abrechnung sichtbar.">
  <Input placeholder="Research Lab" />
</Field>`,
    props: [
      { name: "label", type: "ReactNode", description: "Beschriftung oberhalb des Controls." },
      { name: "hint", type: "ReactNode", description: "Hilfetext unterhalb des Controls." },
      { name: "error", type: "ReactNode", description: "Fehlertext; ersetzt den Hinweis." },
      classNameProp,
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "Formular",
    description: "Natives Select im Field-Rezept mit eigenem Chevron.",
    guidance: "Native Semantik bleibt erhalten. Komplexe, durchsuchbare Menüs gehören in einen separaten Combobox-Baustein.",
    code: `import { Select } from "@360n-gmbh/ui";

<Select defaultValue="eu-central">
  <option value="eu-central">EU Central</option>
  <option value="eu-west">EU West</option>
</Select>`,
    props: [
      { name: "invalid", type: "boolean", default: "false", description: "Aktiviert den Fehlerrahmen und aria-invalid." },
      { name: "wrapperClassName", type: "string", description: "Klassen für den äußeren Wrapper." },
      classNameProp,
    ],
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Formular",
    description: "Binärer Schalter mit Ink-Track und Lime-Knopf.",
    guidance: "Nur für Einstellungen verwenden, die unmittelbar wirksam werden. Speichern-pflichtige Formulare nutzen Checkboxen.",
    code: `const [enabled, setEnabled] = useState(true);

<Toggle checked={enabled} onChange={setEnabled} aria-label="Streaming" />`,
    props: [
      { name: "checked", type: "boolean", description: "Kontrollierter Zustand." },
      { name: "onChange", type: "(checked: boolean) => void", description: "Wird bei einer Zustandsänderung aufgerufen." },
      { name: "disabled", type: "boolean", default: "false", description: "Deaktiviert den Schalter." },
      classNameProp,
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Formular",
    description: "Mehrfachauswahl mit kompakter Ink-Fläche und Lime-Haken.",
    guidance: "Checkboxen erlauben mehrere unabhängige Entscheidungen; für genau eine Auswahl Radio verwenden.",
    code: `const [saved, setSaved] = useState(false);

<Checkbox checked={saved} onChange={setSaved}>
  Key sicher gespeichert
</Checkbox>`,
    props: [
      { name: "checked", type: "boolean", description: "Kontrollierter Zustand." },
      { name: "onChange", type: "(checked: boolean) => void", description: "Wird bei einer Zustandsänderung aufgerufen." },
      { name: "children", type: "ReactNode", description: "Optionales Label rechts neben der Box." },
      classNameProp,
    ],
  },
  {
    slug: "radio",
    name: "Radio",
    category: "Formular",
    description: "Einzelauswahl innerhalb einer kontrollierten Gruppe.",
    guidance: "Die Gruppenlogik bleibt beim Aufrufer; jedes Radio erhält einen eindeutigen zugänglichen Namen.",
    code: `<Radio checked={region === "de"} onSelect={() => setRegion("de")}>
  Deutschland
</Radio>`,
    props: [
      { name: "checked", type: "boolean", description: "Ob diese Option gewählt ist." },
      { name: "onSelect", type: "() => void", description: "Wird bei Auswahl aufgerufen." },
      { name: "children", type: "ReactNode", description: "Label der Option." },
      classNameProp,
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    description: "Mist-Schimmer in der Silhouette des erwarteten Inhalts.",
    guidance: "Skeletons enden immer in Inhalt oder EmptyState. Für Aktionen ist der Button-pending-Zustand vorgesehen.",
    code: `import { Skeleton } from "@360n-gmbh/ui";

<Skeleton className="h-8 w-32" />
<Skeleton lines={3} />`,
    props: [
      { name: "lines", type: "number", description: "Erzeugt mehrere Text-Silhouetten mit variierten Breiten." },
      { name: "style", type: "CSSProperties", description: "Inline-Maße für dynamische Silhouetten." },
      classNameProp,
    ],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    category: "Feedback",
    description: "Erklärender Nullzustand mit optionaler Primäraktion.",
    guidance: "Ein leerer Zustand beantwortet: Was fehlt, warum ist es leer und was ist der nächste sinnvolle Schritt?",
    code: `<EmptyState
  title="Noch keine API-Keys"
  description="Erstelle einen Key für deinen ersten Request."
  action={<Button variant="lime">Key erstellen</Button>}
/>`,
    props: [
      { name: "title", type: "ReactNode", description: "Kurze, konkrete Zustandsbeschreibung." },
      { name: "description", type: "ReactNode", description: "Erklärung und nächster Schritt." },
      { name: "icon", type: "ReactNode", description: "Optionales 16-px-Icon." },
      { name: "action", type: "ReactNode", description: "Primäraktion." },
      classNameProp,
    ],
  },
  {
    slug: "kpi-card",
    name: "KpiCard",
    category: "Daten",
    description: "Kennzahl, Vergleich und kompakte Square-Matrix-Sparkline in einer ruhigen Karte.",
    guidance: "Eine Karte beantwortet genau eine Frage. Vergleichszeitraum und Einheit müssen sichtbar sein.",
    code: `<KpiCard
  label="Requests · 30 T"
  value="40.492"
  delta={{ label: "+18 %", tone: "up" }}
  sparkline={[18, 22, 19, 30, 28, 42, 48]}
/>`,
    props: [
      { name: "label", type: "ReactNode", description: "Kontext und Zeitraum der Kennzahl." },
      { name: "value", type: "ReactNode", description: "Formatierter Hauptwert." },
      { name: "deltaTone", type: '"up" | "warn" | "bad" | "calm"', default: '"calm"', description: "Semantik des Vergleichswerts." },
      { name: "sparkline", type: "number[]", description: "Optionale Verlaufspunkte." },
      classNameProp,
    ],
  },
  {
    slug: "square-matrix-chart",
    name: "SquareMatrixChart",
    category: "Daten",
    description:
      "Responsive Zeitreihe aus vertikalen Quadratstapeln mit tastaturbedienbarer Detailansicht.",
    guidance:
      "Für Mengen, Kosten und Nutzungsverläufe mit 12 bis etwa 60 Perioden. Grau trägt die Serie, Ink markiert Hover und Fokus; Lime bleibt einer gezielten Akzentserie oder aktiven Hervorhebung vorbehalten.",
    code: `import { SquareMatrixChart } from "@360n-gmbh/ui";

const days = [
  { id: "jun-14", label: "14. Juni", value: 1842, valueLabel: "1.842 Requests" },
  { id: "jun-15", label: "15. Juni", value: 2310, valueLabel: "2.310 Requests", tone: "strong" },
  { id: "jun-16", label: "16. Juni", value: 920, valueLabel: "920 Requests", tone: "soft" },
];

<SquareMatrixChart
  data={days}
  rows={10}
  ariaLabel="Requests pro Tag im Juni"
  defaultActiveId="jun-15"
  axisLabels={{ start: "01. Juni", middle: "15. Juni", end: "30. Juni" }}
/>`,
    props: [
      {
        name: "data",
        type: "SquareMatrixDatum[]",
        description:
          "Perioden mit ID, Label, Rohwert und optionaler Formatierung oder Tonalität (Grau, Lime, Amber, Signal).",
      },
      {
        name: "ariaLabel",
        type: "string",
        description: "Zugänglicher Name der gesamten Visualisierung.",
      },
      {
        name: "rows",
        type: "number",
        default: "10",
        description: "Maximale Stapelhöhe; wird sicher auf 2 bis 24 Zeilen begrenzt.",
      },
      {
        name: "maxColumns",
        type: "number",
        description: "Begrenzt lange Zeitreihen auf die letzten N Perioden.",
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description: "Verdichtete StatCard-Variante mit fünf Zeilen und ohne sichtbare Caption.",
      },
      {
        name: "height",
        type: "number | string",
        default: "240 / 36 compact",
        description:
          "Stabile Zeichenhöhe für kurze und lange Reihen; Quadrate behalten ihr Seitenverhältnis.",
      },
      {
        name: "domain",
        type: "readonly [number, number]",
        description:
          "Optionale feste Domäne für vergleichbare Charts; Standard ist 0 bis zum höchsten Wert.",
      },
      {
        name: "axisLabels",
        type: "{ start: string; middle?: string; end: string }",
        description: "Sichtbare Orientierung für große Zeitreihen; in compact ausgeblendet.",
      },
      { name: "activeId", type: "string | null", description: "Kontrollierter aktiver Zeitraum." },
      {
        name: "defaultActiveId",
        type: "string | null",
        default: "null",
        description: "Initiale Hervorhebung im unkontrollierten Modus.",
      },
      {
        name: "activeTone",
        type: '"ink" | "lime"',
        default: '"ink"',
        description: "Farbe für Hover, Fokus und Touch.",
      },
      {
        name: "formatValue",
        type: "(value, datum) => string",
        description: "Zahlenformatierung, wenn kein valueLabel gesetzt ist.",
      },
      {
        name: "onActiveChange",
        type: "(datum | null) => void",
        description: "Meldet die aktive Periode für gekoppelte KPIs oder Details.",
      },
      { name: "instruction", type: "string", description: "Bedienhinweis für Screenreader." },
      {
        name: "emptyLabel",
        type: "string",
        default: '"Keine Daten verfügbar."',
        description: "Text bei einer leeren Datenreihe.",
      },
      classNameProp,
    ],
  },
  {
    slug: "square-matrix-breakdown",
    name: "SquareMatrixBreakdown",
    category: "Daten",
    description:
      "100-Zellen-Matrix als präziser, interaktiver Ersatz für Pie- und Donut-Diagramme.",
    guidance:
      "Für Anteile eines Ganzen mit höchstens sechs Segmenten. Jede Zelle entspricht bei der Standardgröße ungefähr einem Prozentpunkt; Hover oder Tastaturfokus färben das vollständige Segment schwarz.",
    code: `import { SquareMatrixBreakdown } from "@360n-gmbh/ui";

<SquareMatrixBreakdown
  ariaLabel="Request-Verteilung nach Modell"
  data={[
    { id: "llama", label: "Llama", value: 46, valueLabel: "46 %" },
    { id: "qwen", label: "Qwen", value: 31, valueLabel: "31 %", tone: "strong" },
    { id: "other", label: "Weitere", value: 23, valueLabel: "23 %", tone: "lime" },
  ]}
/>`,
    props: [
      {
        name: "data",
        type: "SquareMatrixBreakdownDatum[]",
        description:
          "Segmente mit ID, Label, Anteil und optionalem Grau-, Lime-, Amber- oder Signalton.",
      },
      { name: "ariaLabel", type: "string", description: "Zugänglicher Name der Verteilung." },
      {
        name: "cells",
        type: "number",
        default: "100",
        description: "Gesamtzahl der Zellen; Rundungsreste werden stabil verteilt.",
      },
      {
        name: "columns",
        type: "number",
        default: "10",
        description: "Spaltenzahl; 10 erzeugt mit 100 Zellen das klassische 10×10-Raster.",
      },
      { name: "activeId", type: "string | null", description: "Kontrolliertes aktives Segment." },
      {
        name: "defaultActiveId",
        type: "string | null",
        default: "null",
        description: "Initial hervorgehobenes Segment.",
      },
      {
        name: "activeTone",
        type: '"ink" | "lime"',
        default: '"ink"',
        description: "Farbe des aktiven Segments.",
      },
      {
        name: "formatValue",
        type: "(value, datum) => string",
        description: "Optionale Wertformatierung für Legende und Screenreader.",
      },
      {
        name: "onActiveChange",
        type: "(datum | null) => void",
        description: "Meldet Hover, Fokus und Touch nach außen.",
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description: "Blendet die Legende visuell aus, hält sie aber zugänglich.",
      },
      classNameProp,
    ],
  },
  {
    slug: "data-table",
    name: "DataTable",
    category: "Daten",
    description: "Sortierbare, paginierbare Arbeitstabelle mit Loading- und Empty-State.",
    guidance: "Keine Zebra-Streifen. Zahlen stehen rechts und verwenden Tabellenziffern; breite Tabellen dürfen innerhalb der Karte scrollen.",
    code: `const columns = [
  { key: "model", header: "Modell", sortable: true },
  { key: "requests", header: "Requests", align: "right" },
];

<DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />`,
    props: [
      { name: "columns", type: "DataTableColumn<T>[]", description: "Spalten, Renderer und Sortierlogik." },
      { name: "rows", type: "T[]", description: "Anzuzeigende Datensätze." },
      { name: "rowKey", type: "(row, index) => string | number", description: "Stabiler React-Schlüssel." },
      { name: "loading", type: "boolean", default: "false", description: "Zeigt Skeleton-Zeilen." },
      classNameProp,
    ],
  },
  {
    slug: "log-viewer",
    name: "LogViewer",
    category: "Daten",
    description: "Dichtes Ink-Panel für strukturierte Laufzeitmeldungen.",
    guidance: "Keine Secrets oder Klartext-Keys in Logzeilen. Level-Farbe ergänzt den Text, ersetzt ihn aber nicht.",
    code: `<LogViewer lines={[
  { ts: "14:21:03", level: "ready", text: "gateway ready" },
  { ts: "14:21:08", level: "info", text: "model loaded" },
]} />`,
    props: [
      { name: "lines", type: "LogLine[]", description: "Zeit, Level und Meldung je Zeile." },
      { name: "follow", type: "boolean", default: "false", description: "Hält die Ansicht am neuesten Eintrag." },
      { name: "title", type: "ReactNode", description: "Optionaler Titel in der Kopfleiste." },
      classNameProp,
    ],
  },
  {
    slug: "pipeline-steps",
    name: "PipelineSteps",
    category: "Daten",
    description: "Vertikaler Ablauf für Deployments und mehrstufige Jobs.",
    guidance: "Schritte sind done, active oder pending. Fehler werden zusätzlich im erklärenden Text benannt.",
    code: `<PipelineSteps steps={[
  { label: "Artefakt prüfen", state: "done" },
  { label: "Modell laden", state: "active", meta: "42 %" },
  { label: "Traffic öffnen", state: "pending" },
]} />`,
    props: [
      { name: "steps", type: "PipelineStep[]", description: "Geordnete Schritte mit Zustand und optionalen Metadaten." },
      classNameProp,
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Lokale Inhaltsnavigation mit Ink-Unterstrich.",
    guidance: "Tabs wechseln Ansichten im selben Kontext. Für Seitenwechsel werden Links in Sidebar oder Breadcrumbs verwendet.",
    code: `<Tabs
  items={[
    { id: "business", label: "Business" },
    { id: "tech", label: "Tech", count: 12 },
  ]}
  defaultValue="business"
/>`,
    props: [
      { name: "items", type: "TabItem[]", description: "IDs, Labels und optionale Zähler." },
      { name: "value", type: "string", description: "Aktive ID im kontrollierten Modus." },
      { name: "defaultValue", type: "string", description: "Initiale ID im unkontrollierten Modus." },
      { name: "onChange", type: "(id: string) => void", description: "Callback beim Wechsel." },
      classNameProp,
    ],
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    category: "Navigation",
    description: "Leise Orientierung innerhalb verschachtelter Bereiche.",
    guidance: "Die aktuelle Seite ist kein Link. Labels bleiben kurz und spiegeln die Informationsarchitektur.",
    code: `<Breadcrumbs items={[
  { label: "Modelle", href: "/modelle" },
  { label: "Llama 3.3 70B" },
]} />`,
    props: [
      { name: "items", type: "BreadcrumbItem[]", description: "Geordnete Links; der letzte Eintrag ist die aktuelle Seite." },
      { name: "linkComponent", type: "ElementType", default: '"a"', description: "Optionaler Router-Link, etwa next/link." },
      classNameProp,
    ],
  },
  {
    slug: "modal",
    name: "Modal",
    category: "Feedback",
    description: "Fokussierte Entscheidung oder Erklärung über der aktuellen Seite.",
    guidance: "Modals sind kurz, schließen per Escape und dürfen auf kleinen Viewports nie einen seitlichen Seitenscroll erzeugen.",
    code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="API-Key widerrufen?"
  actions={<Button variant="danger">Widerrufen</Button>}
>
  Laufende Requests mit diesem Key schlagen danach fehl.
</Modal>`,
    props: [
      { name: "open", type: "boolean", description: "Steuert die Sichtbarkeit." },
      { name: "onClose", type: "() => void", description: "Schließen über Escape, Overlay oder Aktion." },
      { name: "title", type: "ReactNode", description: "Handlungsorientierter Titel." },
      { name: "actions", type: "ReactNode", description: "Sekundär- und Primäraktion." },
      classNameProp,
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Feedback",
    description: "Kurzlebige Rückmeldung nach einer Aktion.",
    guidance: "Toasts ergänzen einen sichtbaren Zustandswechsel. Kritische Entscheidungen gehören in die Seite oder ein Modal.",
    code: `const { toast } = useToast();

toast({
  kind: "ok",
  message: "Kennlinie gespeichert",
});`,
    props: [
      { name: "kind", type: '"ok" | "err" | "warn" | "info"', default: '"ok"', description: "Semantik des Markers." },
      { name: "message", type: "ReactNode", description: "Kurze, konkrete Rückmeldung." },
      { name: "duration", type: "number", default: "4200", description: "Anzeigedauer in Millisekunden; 0 bleibt stehen." },
    ],
  },
  {
    slug: "info-hint",
    name: "InfoHint",
    category: "Feedback",
    description: "Kontextuelle Erklärung für Fachbegriffe und Metriken.",
    guidance: "Hover erklärt in einem Satz; Klick öffnet nur dann Details, wenn wirklich zusätzliche Information existiert.",
    code: `<InfoHint
  short="Zeit bis zum ersten Antwort-Token."
  title="Time to First Token"
>
  TTFT umfasst Warteschlange und Prompt-Verarbeitung.
</InfoHint>`,
    props: [
      { name: "short", type: "string", description: "Ein-Satz-Tooltip." },
      { name: "title", type: "ReactNode", description: "Optionaler Titel der Detailkarte." },
      { name: "children", type: "ReactNode", description: "Ausführliche Erklärung im Modal." },
      { name: "label", type: "string", default: '"Erklärung"', description: "Zugänglicher Name des Buttons." },
      classNameProp,
    ],
  },
  {
    slug: "section",
    name: "Section",
    category: "Layout",
    description: "Seitensektion mit konsistenter Breite, Rhythmus und Dark-Variante.",
    guidance: "Section organisiert große Seitenbereiche; Karten innerhalb einer Sektion behalten ihre eigene Semantik.",
    code: `<Section dark className="py-16">
  <SectionLabel>Infrastruktur</SectionLabel>
  <h2>Inference, die in Europa bleibt.</h2>
</Section>`,
    props: [
      { name: "dark", type: "boolean", default: "false", description: "Ink-Fläche mit Panel-Radius." },
      { name: "bleed", type: "boolean", default: "false", description: "Entfernt die innere Maximalbreite." },
      { name: "id", type: "string", description: "Anker für Seitennavigation." },
      classNameProp,
    ],
  },
  {
    slug: "stream-flicker",
    name: "StreamFlicker",
    category: "Bewegung",
    description: "Deterministisches Zeilen-Overlay als Streaming-Signal.",
    guidance: "Immer über die ganze aktive Zeile legen. Der Seed bleibt pro Request stabil; Bewegung respektiert reduced motion.",
    code: `<div className="relative overflow-hidden">
  <StreamFlicker seed={request.id.length} />
  <span>Antwort streamt …</span>
</div>`,
    props: [
      { name: "seed", type: "number", default: "1177", description: "Deterministischer Ausgangswert des Musters." },
      { name: "opacity", type: "number", default: "0.35", description: "Deckkraft des Overlays." },
      { name: "rows", type: "number", default: "4", description: "Anzahl der Blockspuren." },
      classNameProp,
    ],
  },
  {
    slug: "block-snake",
    name: "BlockSnake",
    category: "Bewegung",
    description: "Quadratischer Loader für Time-to-First-Token.",
    guidance: "Nur für die kurze Wartephase vor dem ersten Stream-Token. Seiteninhalte laden weiterhin mit Skeletons.",
    code: `<BlockSnake
  size={24}
  label="Antwort wird vorbereitet"
/>`,
    props: [
      { name: "size", type: "number", default: "20", description: "Kantenlänge in Pixeln." },
      { name: "duration", type: "number", default: "1.1", description: "Umlaufzeit in Sekunden." },
      { name: "label", type: "string", default: '"Antwort wird vorbereitet"', description: "Zugängliche Beschreibung." },
      classNameProp,
    ],
  },
];

export const componentBySlug = new Map(components.map((component) => [component.slug, component]));

export const categories = Array.from(new Set(components.map((component) => component.category)));
