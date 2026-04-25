"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  Snowflake,
  BarChart3,
  Play,
  Code,
  FileText,
  Clock,
  Server,
  RotateCcw,
  Zap,
} from "lucide-react";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import CopyButton from "@/components/dashboard/CopyButton";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import CostTag from "@/components/dashboard/CostTag";
import KeyBadge from "@/components/dashboard/KeyBadge";
import StarButton from "@/components/dashboard/StarButton";
import StatusDot from "@/components/dashboard/StatusDot";
import Tooltip from "@/components/ui/Tooltip";
import { getModelById, SETTINGS_API_KEYS } from "@/lib/dashboard/mock-data";
import { getModelIcon, formatRuns, formatPrice } from "@/lib/dashboard/utils";
import PlaygroundForm from "@/components/dashboard/playground/PlaygroundForm";
import JsonInput from "@/components/dashboard/playground/JsonInput";
import PlaygroundOutput from "@/components/dashboard/playground/PlaygroundOutput";
import TranscodingOutput from "@/components/dashboard/playground/TranscodingOutput";
import CodeSnippets from "@/components/dashboard/playground/CodeSnippets";
import WebcamPlayground from "@/components/dashboard/playground/WebcamPlayground";
import ModelAnalytics from "@/components/dashboard/stats/ModelAnalytics";
import type { Model } from "@/lib/dashboard/types";

// ─── Tabs ───

type Tab = "playground" | "api" | "readme" | "stats";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "playground", label: "Playground", icon: Play },
  { key: "api", label: "API", icon: Code },
  { key: "readme", label: "README", icon: FileText },
  { key: "stats", label: "Stats", icon: BarChart3 },
];

// ─── Playground Tab ───

function PlaygroundTab({ model }: { model: Model }) {
  const [inputMode, setInputMode] = useState<"form" | "json" | "python" | "node" | "http">("form");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | undefined>();
  const [lastRunValues, setLastRunValues] = useState<Record<string, unknown> | null>(null);

  const handleRun = useCallback(
    (values: Record<string, unknown>) => {
      setLastRunValues(values);
      setIsRunning(true);
      setResult(null);
      const time = 0.3 + Math.random() * 1.5;
      setTimeout(() => {
        setIsRunning(false);
        setInferenceTime(parseFloat(time.toFixed(1)));

        const cfg = model.playgroundConfig;
        if (!cfg) return;

        if (cfg.outputType === "text" && cfg.mockOutputText) {
          setResult(cfg.mockOutputText);
        } else if (
          (cfg.outputType === "image" ||
            cfg.outputType === "video" ||
            cfg.outputType === "audio") &&
          cfg.mockOutputUrl
        ) {
          setResult(cfg.mockOutputUrl);
        } else if (cfg.outputType === "audio") {
          setResult("audio-mock");
        } else if (cfg.outputType === "json") {
          setResult(
            JSON.stringify(
              {
                embedding: [0.023, -0.041, 0.087, 0.012, -0.056],
                model: model.id,
                usage: { prompt_tokens: 12, total_tokens: 12 },
              },
              null,
              2,
            ),
          );
        } else {
          setResult(cfg.mockOutputUrl || "Output generated successfully");
        }
      }, time * 1000);
    },
    [model],
  );

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isRunning) {
        handleRun({});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, isRunning]);

  if (!model.playgroundConfig) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Play className="h-10 w-10 text-fg-disabled" />
        <p className="mt-3 text-sm text-fg-label">
          Playground not available for this model
        </p>
      </div>
    );
  }

  if (model.playgroundConfig.playgroundVariant === "webcam") {
    return <WebcamPlayground model={model} />;
  }

  const INPUT_MODES = [
    { key: "form" as const, label: "Form" },
    { key: "json" as const, label: "JSON" },
    { key: "python" as const, label: "Python" },
    { key: "node" as const, label: "Node.js" },
    { key: "http" as const, label: "HTTP" },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left: Input */}
      <div>
        {/* Label stacks above the format picker on mobile where 5 segments + label
            would overflow; inline side-by-side from sm+ where there's room. */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-fg-label">
            Request
          </span>
          <div
            role="tablist"
            aria-label="Request format"
            className="scrollbar-none flex shrink-0 items-center overflow-x-auto rounded-lg border border-hairline bg-white/[0.02] p-0.5"
          >
            {INPUT_MODES.map((mode) => {
              const selected = inputMode === mode.key;
              return (
                <button
                  key={mode.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setInputMode(mode.key)}
                  className={`flex h-9 shrink-0 items-center rounded-md px-2.5 text-xs font-medium transition-colors focus:outline-none sm:h-7 ${
                    selected
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-fg-faint hover:text-fg-strong"
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {inputMode === "form" && (
          <PlaygroundForm
            config={model.playgroundConfig}
            onRun={handleRun}
            isRunning={isRunning}
          />
        )}
        {inputMode === "json" && (
          <JsonInput
            config={model.playgroundConfig}
            onRun={handleRun}
            isRunning={isRunning}
          />
        )}
        {(inputMode === "python" ||
          inputMode === "node" ||
          inputMode === "http") && (
          <div className="flex flex-col">
            <div className="pb-4">
              <CodeSnippets model={model} fixedLang={inputMode} />
            </div>
            <div className="flex items-center gap-2 border-t border-hairline pt-4">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-subtle px-3 py-2 text-xs text-fg-label transition-colors hover:bg-white/[0.04] hover:text-fg-muted focus:outline-none"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to defaults
              </button>
              <button
                type="button"
                onClick={() => handleRun({})}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-light hover:shadow-lg hover:shadow-green-bright/25 active:scale-[0.98] disabled:bg-white/[0.06] disabled:text-fg-disabled disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-bright/50 motion-reduce:active:scale-100"
              >
                {isRunning ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-strong border-t-white" />
                    Running...
                  </>
                ) : (
                  "Run"
                )}
              </button>
              <CostTag mode="free" />
              <span className="ml-auto text-[10px] text-fg-label">
                ctrl+enter
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Output */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-fg-faint">Output</h3>
        {model.playgroundConfig.playgroundVariant === "transcoding" ? (
          <TranscodingOutput
            result={result}
            isRunning={isRunning}
            inferenceTime={inferenceTime}
            modelName={model.name}
            posterUrl={model.playgroundConfig.mockOutputUrl}
          />
        ) : (
          <PlaygroundOutput
            outputType={model.playgroundConfig.outputType}
            result={result}
            isRunning={isRunning}
            inferenceTime={inferenceTime}
            category={model.category}
            modelName={model.name}
            mockOutputJson={model.playgroundConfig.mockOutputJson}
            model={model}
            lastRunValues={lastRunValues}
          />
        )}
      </div>
    </div>
  );
}

// ─── API Tab ───

function ApiTab({ model }: { model: Model }) {
  const baseUrl = model.apiEndpoint ?? "https://gateway.livepeer.org/v1";
  const endpoint =
    model.category === "Language"
      ? `${baseUrl}/chat/completions`
      : `${baseUrl}/${model.id}`;
  const defaultKey =
    SETTINGS_API_KEYS.find((k) => k.isDefault) ?? SETTINGS_API_KEYS[0];

  return (
    <div className="space-y-6">
      {/* Auth — your key, ready to copy */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-fg-faint">
          Your API key
        </p>
        <KeyBadge prefix={defaultKey.prefix} />
        <p className="mt-2 text-[11px] text-fg-faint">
          Drop this into the <code className="text-fg-muted">Authorization</code> header below, or{" "}
          <Link
            href="/dashboard/settings?tab=tokens"
            className="text-fg-strong underline-offset-2 hover:text-white hover:underline"
          >
            manage your keys
          </Link>
          .
        </p>
      </div>

      {/* Endpoint */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-fg-faint">
          Endpoint
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-dark-surface p-4">
          <span className="shrink-0 rounded bg-green/15 px-1.5 py-0.5 text-[10px] font-semibold text-green-bright">
            POST
          </span>
          <code className="min-w-0 flex-1 break-all text-xs text-fg-strong sm:text-sm">
            {endpoint}
          </code>
        </div>
      </div>

      {/* Quick start */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-fg-faint">
          Quick start
        </p>
        <CodeSnippets model={model} />
      </div>

      {/* Pricing footer — compact, since the hero already shows the list price */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-dark-surface px-4 py-3 text-xs text-fg-faint">
        <span>
          Billed per request. Free tier covers your first 10,000 each month.
        </span>
        <Link
          href="/dashboard/settings?tab=billing"
          className="text-fg-strong underline-offset-2 hover:text-white hover:underline"
        >
          Add a payment provider →
        </Link>
      </div>
    </div>
  );
}

// ─── README Tab ───

function ReadmeTab({ model }: { model: Model }) {
  if (!model.readme) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-10 w-10 text-fg-disabled" />
        <p className="mt-3 text-sm text-fg-label">No README available</p>
      </div>
    );
  }

  // Simple markdown-ish rendering (headers, code blocks, lists, tables)
  const lines = model.readme.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="overflow-hidden rounded-lg border border-hairline"
        >
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-hairline bg-dark-surface">
                {tableRows[0].map((cell, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left font-medium text-fg-faint"
                  >
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(2).map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-hairline last:border-0"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-fg-label">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableRows = [];
    }
    inTable = false;
  };

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="scrollbar-dark overflow-x-auto rounded-lg border border-hairline bg-black/40 p-4 text-xs leading-relaxed text-fg-muted"
          >
            {codeContent.trim()}
          </pre>,
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        if (inTable) flushTable();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      return;
    }

    if (line.startsWith("|")) {
      if (!inTable) inTable = true;
      const cells = line
        .split("|")
        .filter((c) => c.trim() !== "");
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="mt-5 mb-2 text-xl font-semibold text-white first:mt-0"
        >
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="mt-5 mb-2 text-lg font-semibold text-fg first:mt-0"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="mt-4 mb-2 text-sm font-semibold text-fg-strong first:mt-0"
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex items-start gap-2 pl-4 text-sm text-fg-faint">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" aria-hidden="true" />
            <span>
              <span className="font-medium text-fg-strong">{match[1]}</span>
              <span className="text-fg-disabled"> — </span>
              {match[2]}
            </span>
          </div>,
        );
      } else {
        elements.push(
          <div key={i} className="flex items-start gap-2 pl-4 text-sm text-fg-faint">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" aria-hidden="true" />
            <span>{line.slice(2).replace(/\*\*/g, "")}</span>
          </div>,
        );
      }
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 pl-4 text-sm text-fg-faint">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" aria-hidden="true" />
          <span>{line.slice(2)}</span>
        </div>,
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-fg-faint">
          {line}
        </p>,
      );
    }
  });

  if (inTable) flushTable();

  return (
    <article className="rounded-xl border border-hairline bg-dark-surface p-5">
      <div className="max-w-3xl space-y-1">{elements}</div>
    </article>
  );
}

// ─── Stats Tab ───

function StatsTab({ model }: { model: Model }) {
  return <ModelAnalytics model={model} />;
}

// ─── Main Page ───

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("playground");
  const model = getModelById(id);

  if (!model) {
    return (
      <main id="main-content" className="flex flex-1 flex-col bg-dark">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm text-fg-label">Model not found</p>
          <Link
            href="/dashboard/explore"
            className="mt-3 text-xs text-green-bright hover:underline focus:outline-none rounded"
          >
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const Icon = getModelIcon(model.category);

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <div className="flex-1">
        <div className="mx-auto max-w-5xl px-5 pt-6 pb-8 lg:pt-10">
          <Breadcrumb
            className="mb-5"
            items={[
              { label: "Explore", href: "/dashboard/explore" },
              { label: model.name },
            ]}
          />
          {/* Hero — tightened: smaller icon, smaller title, less chrome */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-hairline">
              <Icon className="h-5 w-5 text-fg-strong" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-fg-label">
                    {model.provider}
                  </p>
                  <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h1 className="text-lg font-semibold text-white text-balance break-words">
                      {model.name}
                    </h1>
                    {model.precision && (
                      <span className="font-mono text-[11px] text-fg-faint">
                        {model.precision}
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions — top right, icon-only on mobile to avoid cramping */}
                <div className="flex shrink-0 items-center gap-2">
                  <StarButton modelId={model.id} variant="inline" />
                  <CopyButton
                    value={model.id}
                    label="Copy ID"
                    ariaLabel="Copy capability ID"
                    variant="bordered"
                    size="md"
                    hideLabelOnMobile
                  />
                </div>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {model.description}
              </p>
            </div>
          </div>

          {/* Status + metadata — one wrapping row, status first. Slightly more gap-y so the
              colored pill row and the plain-text metadata row read as two distinct groupings. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs text-fg-muted">
            {/* Warm / Cold — matches Explore StatusBadge palette (orange / blue) for consistency across surfaces */}
            {model.status === "hot" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-subtle px-2.5 py-1 font-medium text-warm">
                <StatusDot tone="warm" />
                Warm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue/10 px-2.5 py-1 font-medium text-blue-bright">
                <Snowflake className="h-2.5 w-2.5" />
                Cold
              </span>
            )}
            {/* Realtime — moat capability marker, clickable to filter Explore */}
            {model.realtime && (
              <Tooltip content="Supports streaming (WebRTC) inference">
                <Link
                  href="/dashboard/explore?realtime=1"
                  className="inline-flex items-center gap-1.5 rounded-full bg-green-bright/10 px-2.5 py-1 font-medium text-green-bright transition-colors hover:bg-green-bright/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-bright/40"
                >
                  <Zap className="h-2.5 w-2.5" fill="currentColor" />
                  Realtime
                </Link>
              </Tooltip>
            )}
            {/* Task badge — clickable, filters Explore by this category */}
            <Link
              href={`/dashboard/explore?category=${encodeURIComponent(model.category)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-fg-strong transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              <Icon className="h-2.5 w-2.5 text-fg-faint" aria-hidden="true" />
              {model.category}
            </Link>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Flame className="h-3 w-3 text-fg-disabled" aria-hidden="true" />
              {formatRuns(model.runs7d)} runs
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Clock className="h-3 w-3 text-fg-disabled" aria-hidden="true" />
              {model.latency}ms latency
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Server className="h-3 w-3 text-fg-disabled" aria-hidden="true" />
              {model.orchestrators} GPUs
            </span>
            <span className="text-fg-strong">
              {formatPrice(model)}
            </span>
          </div>

          {/* Tabs — desktop horizontal strip */}
          <div
            className="mt-8 hidden gap-1 overflow-x-auto border-b border-subtle md:flex"
            role="tablist"
            aria-label="Model section"
            style={{ scrollbarWidth: "none" }}
            onKeyDown={(e) => {
              const i = TABS.findIndex((t) => t.key === activeTab);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setActiveTab(TABS[(i + 1) % TABS.length].key);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setActiveTab(TABS[(i - 1 + TABS.length) % TABS.length].key);
              } else if (e.key === "Home") {
                e.preventDefault();
                setActiveTab(TABS[0].key);
              } else if (e.key === "End") {
                e.preventDefault();
                setActiveTab(TABS[TABS.length - 1].key);
              }
            }}
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`tabpanel-${tab.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.key)}
                  className={`-mb-px flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm transition-colors focus:outline-none ${
                    selected
                      ? "border-green-bright font-semibold text-white"
                      : "border-transparent font-medium text-fg-faint hover:text-fg"
                  }`}
                >
                  <tab.icon
                    className={`h-4 w-4 ${
                      selected ? "text-green-bright" : "text-fg-label"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tabs — mobile scroll strip */}
          <DashboardSubNav
            hideAt="md"
            ariaLabel="Model section"
            tabs={TABS}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as Tab)}
            className="mt-6"
          />

          {/* Tab content */}
          <div
            className="mt-6 pb-12"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "playground" && <PlaygroundTab model={model} />}
            {activeTab === "api" && <ApiTab model={model} />}
            {activeTab === "readme" && <ReadmeTab model={model} />}
            {activeTab === "stats" && <StatsTab model={model} />}
          </div>
        </div>
      </div>
    </main>
  );
}
