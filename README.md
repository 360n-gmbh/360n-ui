# @360n-gmbh/ui

360n Design-System: Tokens + React-Komponenten für Console, Admin und Website.

Die deploybare Component-Dokumentation lebt im selben Repo unter `apps/docs`.
Damit gehören Live-Beispiele, Design-Regeln und Package-Version immer zum
gleichen Commit.

Das Paket ist ein **Source-Paket** — es liefert TypeScript-Quellen und eine
Token-Datei, keinen Build. Next.js-Apps kompilieren die Komponenten selbst
(`transpilePackages`), dadurch gibt es genau eine Wahrheit für Tokens und
Bausteine, und Website, Console und Admin driften nicht auseinander.

Quellen des Systems: der Living Styleguide der Website (360n.ai/design,
Kapitel 001–006) und die Console-Bausteine (Kapitel 007–015) aus
`docs/04-umsetzung/12-design-system`.

## Voraussetzungen

- React 19, Tailwind CSS 4 (die Komponenten sind mit Tailwind-4-Klassen gebaut)
- Node 22 / npm
- Optional: `motion` ^12 (Seiten-Choreografie), `lucide-react` (Icons)

## Installation

Variante A — direkt als Git-Dependency (privates Repo, Git-Zugriff nötig):

```jsonc
// package.json
"dependencies": {
  "@360n-gmbh/ui": "github:360n-gmbh/360n-ui"
}
```

Variante B — über GitHub Packages:

```ini
# .npmrc im Projekt
@360n-gmbh:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @360n-gmbh/ui
```

## Einbindung in Next.js

1. Paket transpilen lassen:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@360n-gmbh/ui"],
};
```

2. Tokens importieren und die Quellen für Tailwind sichtbar machen —
   **Tailwind 4 scannt `node_modules` nicht automatisch**, deshalb ist die
   `@source`-Zeile Pflicht (Pfad relativ zur CSS-Datei):

```css
/* app/globals.css */
@import "tailwindcss";
@import "@360n-gmbh/ui/tokens.css";
@source "../node_modules/@360n-gmbh/ui/src";
```

3. Fonts lädt die App selbst (Souveränitäts-Linie: Self-Hosting statt
   Google-Fonts-Request), z. B. über `next/font/google`:

```ts
// app/layout.tsx
import { Cascadia_Code, Inter } from "next/font/google";

const cascadia = Cascadia_Code({ subsets: ["latin"], weight: ["300"] });
const inter = Inter({ subsets: ["latin"], weight: ["600"] });
```

Die Tokens definieren `--font-sans` (Cascadia Code) und `--font-display`
(Inter) mit System-Fallbacks — sobald die Fonts geladen sind, greifen sie.

4. Komponenten verwenden:

```tsx
import { Button, DataTable, KpiCard, StatusPill } from "@360n-gmbh/ui";

<Button variant="dark">Neuer Deploy</Button>
<StatusPill status="run">läuft</StatusPill>
```

Toasts brauchen einmalig den Provider (Client-Baum):

```tsx
import { ToastProvider, useToast } from "@360n-gmbh/ui";

// im Layout: <ToastProvider>{children}</ToastProvider>
// in einer Komponente:
const { toast } = useToast();
toast({ kind: "ok", message: "Kennlinie #13 gespeichert — keine Drift." });
```

## Was drin ist

**Tokens** (`tokens.css`): der `@theme`-Block der Website (Fonts, Farben
ink/paper/line/mist/muted/lime/frost/cobalt, Radien 14/18 px, easeFabrica,
Marquee) plus die Console-Semantik `--color-signal`/`--color-amber` (+ Soft-
Tints) sowie Shimmer-, Blink- und Toast-Keyframes und die Base-Layer
(Body-Defaults, Inter-Headlines, Lime-`::selection`).

**Komponenten** (`src/`):

| Baustein | Zweck |
|---|---|
| `Button` | Roll-Hover-Signatur; Varianten dark/lime/light/outline/ghost/danger, Größen sm/md/lg, `pending` für Aktionen |
| `Tag` | Chip in ink/light/onDark |
| `StatusPill` | Punkt-mit-Ring: live/run/warn/err/idle; Varianten default/dark/tint |
| `Field`, `Input`, `Textarea` | Field-Rezept mit Hinweis-/Fehlerzeile (Signal) |
| `Select`, `Toggle`, `Checkbox`, `Radio` | Formular-Controls aus Console-Kapitel 014 |
| `Skeleton` | Mist-Schimmer — **der Lade-Standard** |
| `EmptyState` | gestrichelte Karte mit Icon-Kachel und Primäraktion |
| `KpiCard`, `Sparkline` | KPI-Zahl mit Delta-Pill und kompakter Square-Matrix-Sparkline |
| `SquareMatrixChart` | responsive Zeitreihe aus Quadratstapeln; Hover/Fokus in Ink, optionale Lime-Akzente |
| `SquareMatrixBreakdown` | 100-Zellen-Verteilung als quadratischer Pie-/Donut-Ersatz mit Segmentfokus |
| `Section`, `SectionLabel` | Seitensektion + Eyebrow-Label mit Lime-Punkt |
| `Tabs`, `Breadcrumbs` | Navigation (Ink-Unterstrich, Muted-Brotkrumen) |
| `DataTable` | generisch: Spalten-Definition, sortierbar, rechtsbündige Zahlen, Footer-Pagination, Skeleton-Ladezustand |
| `LogViewer` | Ink-Deep-Panel, Level-Farben, `follow`, Lime-Caret |
| `PipelineSteps` | Deploy-Workflow: done/active/pending |
| `ToastProvider`/`useToast`, `Modal` | Feedback unten rechts, Panel mit Ink-Schleier |

## Design-Regeln (Kurzfassung)

- **Ein Akzent:** Lime markiert, was zählt — ein Marker pro Abschnitt.
  Semantik (Signal/Amber) nur als Punkt, Text oder dünne Fläche, nie als Panel.
- **Skeleton-Standard:** Listen, Tabellen und Karten laden mit Mist-Schimmer
  in der Silhouette des Inhalts. Nie Spinner für Inhalte — Spinner nur an
  Aktionen (`<Button pending>`). Leere Ergebnisse zeigen `EmptyState`.
- **Bewegung:** eine Easing-Kurve (`ease-fabrica`); im Werkzeug ≤ 0,5 s,
  `prefers-reduced-motion` respektieren. Der Roll-Hover bleibt (Signatur).
- **Zwei Stimmen:** Inter SemiBold für Headlines, Cascadia Code Light für
  Copy; Zahlen mit `tabular-nums`.

## Entwicklung

```bash
npm install
npm run check   # tsc --noEmit
npm run lint    # eslint src
npm run docs:dev    # Component Docs auf http://localhost:3003
npm run docs:check  # Docs-Typecheck
npm run docs:build  # statischer Export mit allen Component-Seiten
```

Kein Build-Schritt — die Quellen sind das Artefakt.

## Veröffentlichung

Der aktive `.github/workflows/ci.yml` prüft `npm ci`, Audit ab Moderate, TypeScript
und ESLint bei jedem Push auf `main` sowie bei jedem Pull Request; Actions sind auf
volle Commit-SHAs gepinnt.

`release.yml` nutzt Release Please: Änderungen auf `main` sammeln sich in einer
Release-PR. Beim Merge entstehen Version, Changelog und GitHub Release; derselbe
Lauf veröffentlicht `@360n-gmbh/ui` nach GitHub Packages. `docs.yml` baut und
deployt die statische Component-Dokumentation bei jedem Push auf `main`.

Die Informationsarchitektur der Docs ist vom MIT-lizenzierten shadcn/ui-Projekt
inspiriert. Der erforderliche Hinweis steht in `THIRD_PARTY_NOTICES.md`; 360n-
Komponenten und Inhalte bleiben proprietär.

## Lizenz

Proprietär — © 360n GmbH. Keine Weitergabe außerhalb der Organisation.
