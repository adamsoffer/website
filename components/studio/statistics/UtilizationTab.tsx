"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import StatCard from "./StatCard";
import { PIPELINE_UTILIZATION, LIVE_JOBS } from "@/lib/studio/mock-data";
import type { NetworkStat, PipelineUtilization, LiveJobStatus } from "@/lib/studio/types";

// ─── Utilization bar ───

function UtilBar({ pct }: { pct: number }) {
  const color =
    pct >= 80
      ? "bg-green-bright"
      : pct >= 50
        ? "bg-green-bright/60"
        : pct >= 20
          ? "bg-blue-bright/60"
          : "bg-white/20";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-white/[0.06]">
        <div
          className={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="font-mono text-xs text-white/50">{pct}%</span>
    </div>
  );
}

// ─── Status badge ───

function StatusBadge({ status }: { status: PipelineUtilization["status"] | LiveJobStatus }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-bright/10", text: "text-green-bright", label: "Active" },
    online: { bg: "bg-green-bright/10", text: "text-green-bright", label: "online" },
    degraded: { bg: "bg-yellow-400/10", text: "text-yellow-400", label: "degraded" },
    cold: { bg: "bg-white/[0.06]", text: "text-white/40", label: "Cold" },
    completed: { bg: "bg-white/[0.06]", text: "text-white/40", label: "done" },
  };
  const { bg, text, label } = config[status] || config.cold;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "online" || status === "active" ? "bg-green-bright" : status === "degraded" ? "bg-yellow-400" : "bg-white/30"}`} />
      {label}
    </span>
  );
}

// ─── Live Job Feed ───

const REFRESH_OPTIONS = ["5s", "15s", "30s", "90s"];

function LiveJobFeed() {
  const [refreshInterval, setRefreshInterval] = useState("30s");
  const activeJobCount = LIVE_JOBS.filter((j) => j.status !== "completed").length;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-dark-surface">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div>
          <h3 className="text-sm font-medium text-white/80">Live Job Feed</h3>
          <p className="text-[11px] text-white/40">
            Showing {LIVE_JOBS.length} of {activeJobCount + 9} active jobs
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh interval toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5">
            <RefreshCw className="ml-1.5 h-3 w-3 text-white/30" />
            {REFRESH_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setRefreshInterval(opt)}
                className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                  refreshInterval === opt
                    ? "bg-white/[0.1] font-medium text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-bright/10 px-2.5 py-1 text-[11px] font-medium text-green-bright">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-bright" />
            LIVE
          </span>
        </div>
      </div>

      {/* Column headers — outside scroll */}
      <div className="overflow-x-auto">
        <div className="flex min-w-[600px] items-center gap-4 border-b border-white/[0.06] px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
          <span className="flex-1">Pipeline</span>
          <span className="w-44">Model</span>
          <span className="w-20 text-right">FPS</span>
          <span className="w-14 text-right">Age</span>
          <span className="w-20">Status</span>
        </div>
      </div>

      {/* Scrollable rows only */}
      <div className="scrollbar-dark max-h-[360px] overflow-y-auto overflow-x-auto">
        <div className="divide-y divide-white/[0.04]">
          {LIVE_JOBS.map((job) => (
            <div
              key={job.id}
              className="flex min-w-[600px] items-center gap-4 px-5 py-2.5 transition-colors hover:bg-white/[0.02]"
            >
              <span className="flex-1 text-sm text-white/70">{job.pipeline}</span>
              <span className="w-44 truncate font-mono text-xs text-white/50">{job.model}</span>
              <span className="w-20 text-right font-mono text-xs text-white/50">
                {job.fpsIn != null
                  ? `${job.fpsIn.toFixed(0)} / ${job.fpsOut?.toFixed(0)}`
                  : job.latencyMs != null
                    ? `${job.latencyMs}ms`
                    : "—"}
              </span>
              <span className="w-14 text-right font-mono text-[11px] text-white/40">{job.age}</span>
              <span className="w-20">
                <StatusBadge status={job.status} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ───

export default function UtilizationTab() {
  const [search, setSearch] = useState("");

  const kpi: NetworkStat[] = useMemo(() => {
    const active = PIPELINE_UTILIZATION.filter((p) => p.status !== "cold");
    const totalWarm = PIPELINE_UTILIZATION.reduce((s, p) => s + p.warmOrchestrators, 0);

    return [
      { label: "Active Jobs", value: "24", delta: "+3", trend: "up" as const },
      { label: "Active Pipelines", value: `${active.length}`, trend: "flat" as const },
      { label: "Warm Capabilities", value: `${totalWarm}`, delta: "+12", trend: "up" as const },
      { label: "Requests (1h)", value: "4,280", delta: "+340", trend: "up" as const },
    ];
  }, []);

  const filteredPipelines = useMemo(() => {
    if (!search) return PIPELINE_UTILIZATION;
    const q = search.toLowerCase();
    return PIPELINE_UTILIZATION.filter((p) => p.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">Utilization</h2>
        <p className="mt-1 text-sm text-white/50">
          Real-time network activity and pipeline capacity across the Livepeer AI inference network.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpi.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Live Jobs */}
      <LiveJobFeed />

      {/* Pipelines */}
      <div className="rounded-xl border border-white/[0.06] bg-dark-surface">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white/80">Pipelines</h3>
            <p className="text-[11px] text-white/40">
              {filteredPipelines.length} active across the network
            </p>
          </div>
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pipelines..."
              className="w-56 rounded-lg border border-white/[0.08] bg-white/[0.03] py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Column headers — outside scroll */}
        <div className="overflow-x-auto">
          <div className="flex min-w-[700px] items-center gap-4 border-b border-white/[0.06] px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
            <span className="flex-1">Pipeline</span>
            <span className="w-16 text-right">Warm</span>
            <span className="w-16 text-right">Capacity</span>
            <span className="w-32">Utilization</span>
            <span className="w-20 text-right">Latency</span>
            <span className="w-20 text-right">Price</span>
            <span className="w-20">Status</span>
          </div>
        </div>

        {/* Scrollable rows only */}
        <div className="scrollbar-dark max-h-[480px] overflow-y-auto overflow-x-auto">
          <div className="divide-y divide-white/[0.04]">
            {filteredPipelines.map((p) => (
              <div
                key={p.id}
                className="flex min-w-[700px] items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <span className="flex-1 text-sm text-white/70">{p.name}</span>
                <span className="w-16 text-right font-mono text-xs text-green-bright">
                  {p.warmOrchestrators}
                </span>
                <span className="w-16 text-right font-mono text-xs text-white/50">
                  {p.totalCapacity}
                </span>
                <span className="w-32">
                  <UtilBar pct={p.utilizationPct} />
                </span>
                <span className="w-20 text-right font-mono text-xs text-white/50">
                  {p.avgLatencyMs > 0 ? `${p.avgLatencyMs}ms` : "—"}
                </span>
                <span className="w-20 text-right font-mono text-xs text-white/50">
                  ${p.price}{p.priceUnit}
                </span>
                <span className="w-20">
                  <StatusBadge status={p.status} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] sm:grid-cols-4">
          {(() => {
            const totalCap = PIPELINE_UTILIZATION.length;
            const warmCap = PIPELINE_UTILIZATION.filter((p) => p.status !== "cold").length;
            const coldCap = totalCap - warmCap;
            const avgUtil = Math.round(
              PIPELINE_UTILIZATION.filter((p) => p.status !== "cold").reduce((s, p) => s + p.utilizationPct, 0) /
                warmCap,
            );
            return [
              { label: "Total Pipelines", value: `${totalCap}` },
              { label: "Warm", value: `${warmCap}` },
              { label: "Cold", value: `${coldCap}` },
              { label: "Avg Utilization", value: `${avgUtil}%` },
            ].map((stat) => (
              <div key={stat.label} className="px-5 py-3">
                <p className="text-[11px] text-white/40">{stat.label}</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
