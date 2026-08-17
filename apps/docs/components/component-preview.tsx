"use client";

import { useState } from "react";
import {
  BlockSnake,
  Breadcrumbs,
  Button,
  Checkbox,
  DataTable,
  EmptyState,
  Field,
  InfoHint,
  Input,
  KpiCard,
  LogViewer,
  Modal,
  PipelineSteps,
  Radio,
  Section,
  SectionLabel,
  Select,
  Skeleton,
  SquareMatrixChart,
  SquareMatrixBreakdown,
  StatusPill,
  StreamFlicker,
  Tabs,
  Tag,
  Textarea,
  ToastProvider,
  Toggle,
  useToast,
} from "@360n-gmbh/ui";
import type { TabItem } from "@360n-gmbh/ui";

type PreviewProps = {
  slug: string;
  compact?: boolean;
};

function ToastExample() {
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => toast({ kind: "ok", message: "Kennlinie gespeichert" })}
    >
      Toast auslösen
    </Button>
  );
}

function InteractivePreview({ slug, compact = false }: PreviewProps) {
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [region, setRegion] = useState("de");
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState("business");

  switch (slug) {
    case "button":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button size={compact ? "sm" : "md"}>Deploy starten</Button>
          <Button size={compact ? "sm" : "md"} variant="lime">API-Key erstellen</Button>
          {!compact && <Button variant="outline">Abbrechen</Button>}
        </div>
      );
    case "tag":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Tag>Production</Tag><Tag variant="light">EU hosted</Tag><Tag variant="light">OpenAI API</Tag>
        </div>
      );
    case "status-pill":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatusPill status="live">live</StatusPill>
          <StatusPill status="run" variant="tint">streamt</StatusPill>
          <StatusPill status="warn" variant="tint">Kontingent</StatusPill>
          {!compact && <StatusPill status="err" variant="tint">Fehler</StatusPill>}
        </div>
      );
    case "field":
      return (
        <div className="grid w-full max-w-sm gap-4">
          <Field label="Projektname" hint="In Logs und Abrechnung sichtbar.">
            <Input placeholder="Research Lab" />
          </Field>
          {!compact && <Field label="Beschreibung"><Textarea rows={3} placeholder="Wofür wird das Projekt genutzt?" /></Field>}
        </div>
      );
    case "select":
      return (
        <Field label="Region" className="w-full max-w-xs">
          <Select defaultValue="eu-central">
            <option value="eu-central">EU Central</option>
            <option value="eu-west">EU West</option>
          </Select>
        </Field>
      );
    case "toggle":
      return (
        <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3">
          <Toggle checked={enabled} onChange={setEnabled} aria-label="Streaming" />
          <span className="text-[13px]">Streaming {enabled ? "aktiv" : "inaktiv"}</span>
        </div>
      );
    case "checkbox":
      return <Checkbox checked={checked} onChange={setChecked}>Key sicher gespeichert</Checkbox>;
    case "radio":
      return (
        <div role="radiogroup" className="flex flex-col gap-1">
          <Radio checked={region === "de"} onSelect={() => setRegion("de")}>Deutschland</Radio>
          <Radio checked={region === "fi"} onSelect={() => setRegion("fi")}>Finnland</Radio>
        </div>
      );
    case "skeleton":
      return (
        <div className="w-full max-w-sm space-y-4 rounded-card border border-line bg-white p-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton lines={compact ? 2 : 4} />
        </div>
      );
    case "empty-state":
      return (
        <EmptyState
          className={compact ? "w-full px-4 py-7" : "w-full max-w-lg"}
          icon={<span aria-hidden>+</span>}
          title="Noch keine API-Keys"
          description={compact ? undefined : "Erstelle einen Key für deinen ersten Request."}
          action={<Button size="sm" variant="lime">Key erstellen</Button>}
        />
      );
    case "kpi-card":
      return (
        <KpiCard
          className="w-full max-w-sm"
          label="Requests · 30 T"
          value="40.492"
          delta={{ label: "+18 %", tone: "up" }}
          sparkline={[18, 22, 19, 30, 28, 42, 48]}
        />
      );
    case "square-matrix-chart": {
      const values = compact
        ? [4, 6, 8, 5, 7, 3, 5, 6, 4, 7, 9, 6, 8, 4, 6, 5, 7, 3]
        : [4, 6, 8, 5, 7, 3, 5, 6, 4, 2, 6, 8, 5, 7, 4, 6, 9, 6, 8, 3, 5, 6, 4, 2, 7, 5, 6, 3];
      const data = values.map((value, index) => ({
        id: `day-${index + 1}`,
        label: `${index + 1}. Juni`,
        value,
        valueLabel: `${(value * 428).toLocaleString("de-DE")} Requests`,
        tone:
          index >= values.length - 4
            ? ("soft" as const)
            : index < 9
              ? ("neutral" as const)
              : ("strong" as const),
      }));
      return (
        <div className="w-full max-w-2xl overflow-hidden rounded-panel border border-line bg-white">
          <div className="flex flex-wrap items-start gap-4 border-b border-line px-5 py-4 sm:px-7">
            <div>
              <p className="text-[10px] tracking-[0.11em] uppercase">Requests</p>
              <p className="mt-2 inline-block bg-lime px-1.5 font-display text-3xl font-semibold tabular-nums sm:text-5xl">
                +32,6 %
              </p>
            </div>
            {!compact && (
              <div className="ml-auto flex gap-4 text-[10px] tracking-[0.08em] uppercase">
                <span className="text-muted">Täglich</span>
                <span className="text-muted">Wöchentlich</span>
                <span className="border-b border-ink pb-1">Monatlich</span>
              </div>
            )}
          </div>
          <div className="px-4 pt-2 pb-4 sm:px-7 sm:pt-5">
            <SquareMatrixChart
              data={data}
              rows={9}
              compact={compact}
              maxColumns={compact ? 18 : 32}
              ariaLabel="Requests im Juni"
              defaultActiveId={`day-${compact ? 11 : 17}`}
              axisLabels={
                compact ? undefined : { start: "01. Juni", middle: "15. Juni", end: "28. Juni" }
              }
            />
          </div>
        </div>
      );
    }
    case "square-matrix-breakdown":
      return (
        <div className="grid w-full max-w-xl gap-5 rounded-panel border border-line bg-white p-5 sm:grid-cols-[minmax(0,1fr)_180px] sm:p-7">
          <div>
            <p className="text-[10px] tracking-[0.1em] text-muted uppercase">Model Mix · 30 T</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">40.492</p>
            {!compact && <p className="mt-1 text-[11px] text-muted">Requests über alle Modelle</p>}
          </div>
          <SquareMatrixBreakdown
            ariaLabel="Request-Verteilung nach Modell"
            compact={compact}
            defaultActiveId="qwen"
            data={[
              { id: "llama", label: "Llama", value: 46, valueLabel: "46 %", tone: "neutral" },
              { id: "qwen", label: "Qwen", value: 31, valueLabel: "31 %", tone: "strong" },
              { id: "mistral", label: "Mistral", value: 15, valueLabel: "15 %", tone: "soft" },
              { id: "other", label: "Weitere", value: 8, valueLabel: "8 %", tone: "lime" },
            ]}
          />
        </div>
      );
    case "data-table": {
      const rows = [
        { id: "1", model: "Llama 3.3 70B", requests: 18420 },
        { id: "2", model: "Qwen 2.5 Coder", requests: 12072 },
        { id: "3", model: "Mistral Small", requests: 10000 },
      ];
      return (
        <DataTable
          className="w-full"
          title="Modelle"
          rows={compact ? rows.slice(0, 2) : rows}
          rowKey={(row) => row.id}
          columns={[
            { key: "model", header: "Modell", sortable: true },
            { key: "requests", header: "Requests", align: "right", sortable: true },
          ]}
        />
      );
    }
    case "log-viewer":
      return (
        <LogViewer
          className="w-full"
          height={compact ? 138 : 220}
          title="gateway · eu-01"
          caret
          lines={[
            { ts: "14:21:03", level: "ready", text: "gateway ready" },
            { ts: "14:21:08", level: "info", text: "model registry synced" },
            { ts: "14:21:11", level: "warn", text: "p95 latency +8 %" },
          ]}
        />
      );
    case "pipeline-steps":
      return (
        <PipelineSteps
          className="w-full max-w-lg"
          steps={[
            { label: "Prüfen", state: "done" },
            { label: "Laden", state: "active", meta: "42 %" },
            { label: "Traffic", state: "pending" },
          ]}
        />
      );
    case "tabs": {
      const items: TabItem[] = [
        { id: "business", label: "Business" },
        { id: "tech", label: "Tech", count: 12 },
      ];
      return (
        <div className="w-full max-w-md">
          <Tabs items={items} value={tab} onChange={setTab} />
          <p className="px-4 py-5 text-[13px] text-muted">Aktive Sicht: {tab === "business" ? "Business" : "Tech"}</p>
        </div>
      );
    }
    case "breadcrumbs":
      return <Breadcrumbs items={[{ label: "Modelle", href: "#" }, { label: "Llama 3.3 70B" }]} />;
    case "modal":
      return (
        <>
          <Button variant="outline" onClick={() => setModalOpen(true)}>Modal öffnen</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="API-Key widerrufen?"
            actions={<><Button variant="outline" onClick={() => setModalOpen(false)}>Abbrechen</Button><Button variant="danger">Widerrufen</Button></>}
          >
            Laufende Requests mit diesem Key schlagen danach fehl.
          </Modal>
        </>
      );
    case "toast":
      return <ToastExample />;
    case "info-hint":
      return (
        <span className="inline-flex items-center gap-2 text-sm">
          Time to First Token
          <InfoHint short="Zeit bis zum ersten Antwort-Token." title="Time to First Token">
            TTFT umfasst Warteschlange und Prompt-Verarbeitung.
          </InfoHint>
        </span>
      );
    case "section":
      return (
        <Section dark bleed className="w-full rounded-panel px-6 py-7">
          <SectionLabel className="text-white/55">Infrastruktur</SectionLabel>
          <h3 className="max-w-md font-display text-2xl font-semibold">Inference, die in Europa bleibt.</h3>
        </Section>
      );
    case "stream-flicker":
      return (
        <div className="relative w-full max-w-lg overflow-hidden rounded-card border border-line bg-white px-5 py-5">
          <StreamFlicker seed={360} opacity={0.22} rows={3} />
          <div className="relative flex items-center justify-between gap-3 text-[13px]">
            <span>req_8Kj91a</span><StatusPill status="run" variant="tint">streamt</StatusPill>
          </div>
        </div>
      );
    case "block-snake":
      return (
        <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 text-[13px]">
          <BlockSnake size={compact ? 20 : 26} /> Antwort wird vorbereitet
        </div>
      );
    default:
      return <span className="text-sm text-muted">Vorschau folgt.</span>;
  }
}

export function ComponentPreview(props: PreviewProps) {
  return (
    <ToastProvider>
      <InteractivePreview {...props} />
    </ToastProvider>
  );
}
