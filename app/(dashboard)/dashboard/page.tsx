"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Code2,
  MessageSquare,
  FileText,
  Activity,
} from "lucide-react";
import { useAuth } from "@/components/dashboard/AuthContext";
import {
  MODELS,
  MOCK_RECENT_REQUESTS,
  ACCOUNT_USAGE_SUMMARY,
} from "@/lib/dashboard/mock-data";
import { getModelIcon } from "@/lib/dashboard/utils";
import EmptyState from "@/components/dashboard/EmptyState";
import ModelCard from "@/components/dashboard/ModelCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import type { ModelCategory } from "@/lib/dashboard/types";

function ViewAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-xs text-fg-muted transition-colors hover:text-white"
    >
      View all →
    </Link>
  );
}

// ─── Mock data ───

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function formatLatency(ms: number | null): string {
  if (ms == null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

// ─── Welcome Card ───

function WelcomeCard({
  isConnected,
}: {
  isConnected: boolean;
  // user is reserved for future personalization (greeting strings, model
  // recommendations) but not used in the current welcome — we lead with the
  // brand thesis, not "Welcome back, {name}".
  user: { name: string } | null;
}) {
  // Lead with the brand thesis: real-time AI video inference is what Livepeer
  // is for. One primary affordance — try the flagship real-time pipeline.
  // Other capabilities are one click away in /dashboard/explore.
  const flagshipModelId = "daydream-video";

  return (
    <section className="rounded-xl border border-hairline px-6 py-10 lg:px-10 lg:py-14">
      <p className="text-[11px] uppercase tracking-wider text-fg-label">
        Real-time AI video inference · on the open network
      </p>
      <h1 className="mt-4 text-2xl leading-tight text-white text-balance sm:text-3xl">
        Stream video in. Stream video out.
        <br className="hidden sm:inline" />
        <span className="text-fg-muted"> Sub-second latency, over WebRTC.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-fg-muted">
        The open network for GPU-powered video. Compose AI models with live
        transcoding into real-time pipelines that ship — at a fraction of the
        cost of centralized alternatives.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
        {isConnected ? (
          <>
            <Link
              href={`/dashboard/models/${flagshipModelId}?tab=playground`}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-green px-4 text-[13px] font-medium text-white transition-colors hover:bg-green-light active:bg-green-dark"
            >
              Try real-time inference
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard/explore"
              className="text-[13px] text-fg-muted transition-colors hover:text-white"
            >
              Browse all capabilities →
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/login"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-green px-4 text-[13px] font-medium text-white transition-colors hover:bg-green-light active:bg-green-dark"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <a
              href="https://docs.livepeer.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-fg-muted transition-colors hover:text-white"
            >
              Read the docs
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Featured Capabilities ───

function FeaturedCapabilities() {
  const featured = MODELS.filter((m) => m.featured).slice(0, 4);

  return (
    <div>
      <SectionHeader
        title="Featured capabilities"
        action={<ViewAllLink href="/dashboard/explore" />}
      />

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {featured.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}

// ─── Browse by Category ───

const HOME_CATEGORIES: {
  label: ModelCategory;
  subtitle: string;
}[] = [
  { label: "Video Generation", subtitle: "Generate video" },
  { label: "Video Editing", subtitle: "Edit footage" },
  { label: "Video Understanding", subtitle: "Understand video" },
  { label: "Live Transcoding", subtitle: "Transcode live" },
  { label: "Image Generation", subtitle: "Generate images" },
  { label: "Speech", subtitle: "Transcribe & synthesize" },
  { label: "Language", subtitle: "Run LLMs" },
];

function BrowseByCategory() {
  return (
    <div>
      <SectionHeader
        title="Browse by category"
        action={<ViewAllLink href="/dashboard/explore" />}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {HOME_CATEGORIES.map(({ label, subtitle }, i) => {
          const Icon = getModelIcon(label);
          const isLastOdd =
            i === HOME_CATEGORIES.length - 1 &&
            HOME_CATEGORIES.length % 2 === 1;
          return (
            <Link
              key={label}
              href={`/dashboard/explore?category=${encodeURIComponent(label)}`}
              className={`group flex flex-col rounded-xl bg-dark-surface/60 p-4 transition-colors hover:bg-dark-card ${
                isLastOdd ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-bright/10">
                <Icon className="h-4 w-4 text-green-bright" />
              </div>
              <p className="mt-3 text-sm font-medium text-white">
                {label}
              </p>
              <p className="mt-0.5 text-xs text-fg-muted">{subtitle}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Getting Started Strip ───

function GettingStartedStrip() {
  const cards = [
    {
      icon: FileText,
      title: "Documentation",
      description: "Guides and concepts for building on the network.",
      href: "https://docs.livepeer.org",
      external: true,
    },
    {
      icon: Code2,
      title: "API reference",
      description: "REST and streaming endpoints with full schemas.",
      href: "https://docs.livepeer.org/api-reference",
      external: true,
    },
    {
      icon: MessageSquare,
      title: "Community",
      description: "Get help from GPU providers and builders in Discord.",
      href: "https://discord.gg/livepeer",
      external: true,
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-white">Get started</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, title, description, href, external }) => {
          const Wrapper = external ? "a" : Link;
          const extraProps = external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={title}
              href={href}
              {...(extraProps as Record<string, string>)}
              className="group flex items-start gap-3 rounded-xl bg-dark-surface/60 p-4 transition-colors hover:bg-dark-card"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-bright/10 text-green-bright">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-white">{title}</p>
                  {external && (
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-fg-disabled transition-colors group-hover:text-fg-muted" />
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-fg-faint">
                  {description}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers for the workspace home ───

// Map a recent-request pipeline string to a category so we can pick an icon
// for runs whose model isn't in the MODELS list (mock data has /-shaped names
// like "daydream/video-v2"). Falls back to a generic activity icon.
const PIPELINE_TO_CATEGORY: Record<string, ModelCategory> = {
  "video-to-video": "Video Editing",
  "live-video-to-video": "Video Editing",
  "live-transcoding": "Live Transcoding",
  "text-to-image": "Image Generation",
  language: "Language",
  "audio-to-text": "Speech",
  "video-understanding": "Video Understanding",
  "text-to-speech": "Speech",
  "image-to-video": "Video Generation",
};

// Best-effort lookup from a recent-request row to a Model in our MODELS list.
// Matches on name fragment (provider or model slug). Used for the "Run again"
// CTA target — falls back to /dashboard/explore search if no match.
function findModelForRunRow(rowModel: string) {
  const slug = rowModel.split("/").pop() ?? rowModel;
  const provider = rowModel.split("/")[0] ?? "";
  return (
    MODELS.find((m) =>
      m.name.toLowerCase().replace(/\s+/g, "").includes(slug.toLowerCase().replace(/-/g, "")),
    ) ??
    MODELS.find((m) => m.provider.toLowerCase().includes(provider.toLowerCase())) ??
    null
  );
}

// ─── Last Run Hero — most prominent element on the workspace home ───

function LastRunHero() {
  const last = MOCK_RECENT_REQUESTS[0];
  if (!last) return null;

  const Icon =
    getModelIcon(PIPELINE_TO_CATEGORY[last.pipeline]) ?? Activity;
  const matchedModel = findModelForRunRow(last.model);
  const playgroundHref = matchedModel
    ? `/dashboard/models/${matchedModel.id}?tab=playground`
    : `/dashboard/explore?q=${encodeURIComponent(last.model.split("/").pop() ?? last.model)}`;

  const isSuccess = last.status === "success";

  return (
    <section>
      <p className="text-[10px] uppercase tracking-wider text-fg-label">
        Last run · {formatRelativeTime(last.timestamp)}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-hairline">
            <Icon className="h-4 w-4 text-fg-strong" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="flex items-baseline gap-2.5">
              <span className="font-mono text-base text-white">{last.model}</span>
              <span className="text-[11px] tabular-nums text-fg-faint">
                {formatLatency(last.latencyMs)}
              </span>
            </p>
            <p className="mt-1 flex items-center gap-2 text-[13px] text-fg-faint">
              <span
                className={`inline-flex items-center gap-1.5 ${
                  isSuccess ? "text-green-bright" : "text-fg-faint"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSuccess ? "bg-green-bright" : "bg-fg-faint"
                  }`}
                  aria-hidden="true"
                />
                {last.status}
              </span>
              <span className="text-fg-disabled">·</span>
              <span>{last.pipeline}</span>
              <span className="text-fg-disabled">·</span>
              <span>via {last.signerLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/dashboard/settings?tab=usage&request=${last.id}`}
            className="text-[13px] text-fg-muted transition-colors hover:text-white"
          >
            Inspect
          </Link>
          <Link
            href={playgroundHref}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-green px-4 text-[13px] font-medium text-white transition-colors hover:bg-green-light active:bg-green-dark"
          >
            Open in playground
            <kbd
              aria-hidden="true"
              className="inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-[3px] bg-black/20 px-1 text-[10px] font-medium leading-none text-white/85"
            >
              R
            </kbd>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Pinned — recently-used + starred models, one-click re-launch ───

function PinnedCapabilities() {
  // Build the pinned set: distinct models from recent runs (priority) + starred.
  const recentNames = Array.from(
    new Set(MOCK_RECENT_REQUESTS.map((r) => r.model)),
  );
  const recentModels = recentNames
    .map((name) => findModelForRunRow(name))
    .filter((m): m is (typeof MODELS)[number] => Boolean(m));

  // Take up to 4 (one row on lg).
  const seen = new Set<string>();
  const pinned = recentModels
    .filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    })
    .slice(0, 4);

  if (pinned.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Pinned</h2>
        <Link
          href="/dashboard/explore"
          className="text-xs text-fg-muted transition-colors hover:text-white"
        >
          See all capabilities →
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {pinned.map((model) => {
          const Icon = getModelIcon(model.category);
          return (
            <li key={model.id}>
              <Link
                href={`/dashboard/models/${model.id}?tab=playground`}
                className="group flex h-full items-center gap-3 rounded-md border border-hairline px-3 py-3 transition-colors hover:border-subtle hover:bg-white/[0.015]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.03]">
                  <Icon className="h-4 w-4 text-fg-strong" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-fg-label">
                    {model.provider.toLowerCase().replace(/\s+/g, "-")}
                  </p>
                  <p className="truncate text-sm text-white">{model.name}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Your Runs — recent runs as a slim list (was "Recent activity") ───

function YourRuns() {
  const rows = MOCK_RECENT_REQUESTS.slice(0, 10);

  if (rows.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-base font-semibold text-white">Your runs</h2>
        <EmptyState
          variant="guided"
          icon={<Activity className="h-4 w-4" />}
          title="No runs yet"
          description="Run inference to see your runs here — status, latency, and time per request."
          action={{ label: "Browse capabilities", href: "/dashboard/explore" }}
        />
      </section>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Your runs</h2>
        <Link
          href="/dashboard/settings?tab=usage"
          className="text-xs text-fg-muted transition-colors hover:text-white"
        >
          See all →
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-hairline">
        <div className="hidden items-center gap-4 border-b border-hairline bg-white/[0.015] px-4 py-2 text-[11px] uppercase tracking-wider text-fg-faint sm:flex">
          <span className="flex-1">Model</span>
          <span className="w-[68px]">Status</span>
          <span className="w-14 text-right">Latency</span>
          <span className="w-16 text-right">Time</span>
          <span className="h-4 w-4" aria-hidden="true" />
        </div>

        {rows.map((row) => {
          const isSuccess = row.status === "success";
          return (
            <Link
              key={row.id}
              href={`/dashboard/settings?tab=usage&request=${row.id}`}
              className="group flex flex-col gap-2 border-b border-hairline px-4 py-2.5 transition-colors last:border-0 hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="flex-1 truncate font-mono text-[13px] text-white">
                {row.model}
              </span>
              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-center text-xs sm:w-[68px] sm:justify-center ${
                    isSuccess
                      ? "bg-green/15 text-green-bright"
                      : "bg-white/[0.06] text-fg-faint"
                  }`}
                >
                  <span
                    className={`hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block ${
                      isSuccess ? "bg-green-bright" : "bg-fg-faint"
                    }`}
                    aria-hidden="true"
                  />
                  {row.status}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-fg-strong sm:w-14 sm:text-right">
                  {formatLatency(row.latencyMs)}
                </span>
                <span className="ml-auto text-xs tabular-nums text-fg-faint sm:ml-0 sm:w-16 sm:text-right">
                  {formatRelativeTime(row.timestamp)}
                </span>
                <ChevronRight
                  className="hidden h-4 w-4 shrink-0 text-fg-disabled opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Capacity Footnote — quiet free-tier line at the very bottom ───

function CapacityFootnote() {
  const used = ACCOUNT_USAGE_SUMMARY.freeTierUsed;
  const limit = ACCOUNT_USAGE_SUMMARY.freeTierLimit;
  const usedPct = (used / limit) * 100;

  const barTone =
    usedPct >= 95
      ? "bg-red-400"
      : usedPct >= 70
        ? "bg-warm"
        : "bg-green-bright";

  return (
    <Link
      href="/dashboard/settings?tab=usage"
      className="group flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-hairline pt-5 text-[12px] tabular-nums text-fg-faint transition-colors hover:text-fg-strong"
    >
      <span className="text-[10px] uppercase tracking-wider text-fg-label">
        Free tier
      </span>
      <span>
        <span className="text-fg-strong">{used.toLocaleString()}</span>
        <span className="mx-1 text-fg-disabled">/</span>
        {limit.toLocaleString()} used
      </span>
      <span
        className="inline-block h-[3px] w-32 overflow-hidden rounded-full bg-white/[0.06]"
        aria-hidden="true"
      >
        <span
          className={`block h-full ${barTone}`}
          style={{ width: `${Math.min(100, Math.max(1, usedPct))}%` }}
        />
      </span>
      <span>
        {usedPct.toFixed(usedPct < 10 ? 1 : 0)}% · resets in{" "}
        {ACCOUNT_USAGE_SUMMARY.freeTierResetIn}
      </span>
      <span className="ml-auto text-fg-muted transition-colors group-hover:text-white">
        Manage →
      </span>
    </Link>
  );
}


// ─── Home Page ───
//
// Workspace pattern (CCO rethink): the home is for getting back to work,
// not reading a stats report. Composition top-to-bottom:
//   1. Last run hero — the most likely next action is "do that again"
//   2. Pinned capabilities — recent + starred, one-click re-launch
//   3. Your runs — slim list of recent inferences
//   4. Capacity footnote — free tier as a quiet line, not a hero
//
// Stats (errors, p50, spend, 30d volume) live on /dashboard/settings?tab=usage
// where they belong. The home stays focused on "your work".

export default function HomePage() {
  const { isConnected, isLoading, user } = useAuth();

  if (isLoading) return null;

  // "Returning" = user has at least one prior request. Pre-real-backend, this
  // proxies through MOCK_RECENT_REQUESTS — flip it empty in mock-data to demo
  // the first-time flow.
  const isReturning = isConnected && MOCK_RECENT_REQUESTS.length > 0;

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <div className="flex-1 px-5 pt-6 pb-16 space-y-8 lg:px-8 lg:pt-10">
        {isConnected && isReturning && user ? (
          <>
            {/* 1 — last run hero, the page's primary affordance */}
            <LastRunHero />
            {/* 2 — pinned capabilities, one-click re-launch */}
            <PinnedCapabilities />
            {/* 3 — slim list of recent inferences */}
            <YourRuns />
            {/* 4 — capacity footnote, quiet at the bottom */}
            <CapacityFootnote />
          </>
        ) : (
          // First-time / disconnected — keep the welcome + discovery so the
          // user has something to land on. Returning users get the working
          // surface above; new users still need the marketing-y entry.
          <>
            <WelcomeCard isConnected={isConnected} user={user} />
            <FeaturedCapabilities />
            <BrowseByCategory />
            <GettingStartedStrip />
          </>
        )}
      </div>
    </main>
  );
}
