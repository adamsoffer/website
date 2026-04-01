"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import StatCard from "@/components/studio/statistics/StatCard";
import PeriodToggle from "@/components/studio/statistics/PeriodToggle";
import { StackedChartTooltip } from "@/components/studio/statistics/ChartTooltip";
import {
  ACCOUNT_USAGE_SUMMARY,
  ACCOUNT_USAGE_BY_SIGNER,
  ACCOUNT_USAGE_BY_TOKEN,
  ACCOUNT_USAGE_DAILY,
  MOCK_RECENT_REQUESTS,
  SIGNER_COLORS,
} from "@/lib/studio/mock-data";
import type {
  NetworkStat,
  AccountActivityRow,
  AccountUsageDailyPoint,
  SignerKey,
} from "@/lib/studio/types";

// ─── Period filter ───

type Period = "24h" | "7d" | "30d" | "3m";

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: "24h", label: "24H" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "3m", label: "3M" },
];

function filterByPeriod(
  data: AccountUsageDailyPoint[],
  period: Period,
): AccountUsageDailyPoint[] {
  const days =
    period === "24h" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return data.filter((d) => new Date(d.date) >= cutoff);
}

// ─── Signer filter ───

type SignerFilter = "all" | SignerKey;

const SIGNER_KEYS: SignerKey[] = [
  "freeTier",
  "paymthouse",
  "livepeerCloud",
  "ethWallet",
];

const SIGNER_LABELS: Record<SignerKey, string> = {
  freeTier: "Free tier",
  paymthouse: "Paymthouse",
  livepeerCloud: "Livepeer Cloud",
  ethWallet: "ETH wallet",
};

// ─── Activity log helpers ───

function formatActivityTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatActivityLatency(ms: number | null): string {
  if (ms == null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${ms} ms`;
}

// ─── Filter dropdown ───

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const current = options.find((o) => o.key === value)?.label ?? "All";
  return (
    <label className="relative flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/[0.04]">
      <span className="text-white/40">{label}</span>
      <span className="text-white/80">{current}</span>
      <ChevronDown className="h-3 w-3 text-white/40" aria-hidden="true" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.key} value={o.key} className="bg-dark text-white">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ─── Main ───

export default function UsageTab() {
  const [period, setPeriod] = useState<Period>("30d");
  const [signerFilter, setSignerFilter] = useState<SignerFilter>("all");
  const [tokenFilter, setTokenFilter] = useState<string>("all");
  const [highlightedRequestId, setHighlightedRequestId] = useState<
    string | null
  >(null);
  const searchParams = useSearchParams();
  const targetRequestId = searchParams.get("request");

  const chartData = useMemo(
    () => filterByPeriod(ACCOUNT_USAGE_DAILY, period),
    [period],
  );

  const totalRequests = useMemo(() => {
    return chartData.reduce(
      (sum, d) =>
        sum + d.freeTier + d.paymthouse + d.livepeerCloud + d.ethWallet,
      0,
    );
  }, [chartData]);

  const visibleSigners: SignerKey[] = useMemo(
    () => (signerFilter === "all" ? SIGNER_KEYS : [signerFilter]),
    [signerFilter],
  );

  const filteredSignerRows = useMemo(
    () =>
      ACCOUNT_USAGE_BY_SIGNER.filter(
        (row) => signerFilter === "all" || row.signer === signerFilter,
      ),
    [signerFilter],
  );

  const filteredTokenRows = useMemo(
    () =>
      ACCOUNT_USAGE_BY_TOKEN.filter(
        (row) => tokenFilter === "all" || row.tokenId === tokenFilter,
      ),
    [tokenFilter],
  );

  const periodCutoffMs = useMemo(() => {
    const days =
      period === "24h" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
    return Date.now() - days * 24 * 60 * 60 * 1000;
  }, [period]);

  const filteredActivity = useMemo<AccountActivityRow[]>(() => {
    return MOCK_RECENT_REQUESTS.filter((row) => {
      const ts = new Date(row.timestamp).getTime();
      if (Number.isNaN(ts) || ts < periodCutoffMs) return false;
      if (signerFilter !== "all" && row.signer !== signerFilter) return false;
      if (tokenFilter !== "all" && row.tokenId !== tokenFilter) return false;
      return true;
    });
  }, [periodCutoffMs, signerFilter, tokenFilter]);

  const clearAllFilters = () => {
    setPeriod("30d");
    setSignerFilter("all");
    setTokenFilter("all");
  };

  // Scroll to a specific request row when arriving with `?request=<id>`
  // (e.g. from clicking a row on the studio home). scrollIntoView cascades
  // through every scrollable ancestor, so it handles both the outer settings
  // scroll container and the inner 440px activity log region in one call.
  useEffect(() => {
    if (!targetRequestId) return;
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const el = document.querySelector<HTMLElement>(
        `[data-request-id="${CSS.escape(targetRequestId)}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRequestId(targetRequestId);
      } else {
        // Row not in the current filtered view — fall back to the section anchor
        document
          .getElementById("recent-requests")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    const timer = window.setTimeout(() => {
      if (!cancelled) setHighlightedRequestId(null);
    }, 1800);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [targetRequestId, filteredActivity]);

  const headerStats: NetworkStat[] = useMemo(() => {
    const freePct = Math.round(
      (ACCOUNT_USAGE_SUMMARY.freeTierUsed /
        ACCOUNT_USAGE_SUMMARY.freeTierLimit) *
        100,
    );
    return [
      {
        label: "Requests this period",
        value: ACCOUNT_USAGE_SUMMARY.requests.toLocaleString(),
        delta: "+12.4% vs last period",
        trend: "up",
      },
      {
        label: "Spend this period",
        value: ACCOUNT_USAGE_SUMMARY.spendDisplay,
        delta: "+8.1% vs last period",
        trend: "up",
      },
      {
        label: `Free tier (${freePct}% used)`,
        value: `${ACCOUNT_USAGE_SUMMARY.freeTierUsed.toLocaleString()} / ${ACCOUNT_USAGE_SUMMARY.freeTierLimit.toLocaleString()}`,
        delta: `Resets in ${ACCOUNT_USAGE_SUMMARY.freeTierResetIn}`,
        trend: "flat",
      },
    ];
  }, []);

  const signerSelectOptions = useMemo<{ key: SignerFilter; label: string }[]>(
    () => [
      { key: "all", label: "All signers" },
      ...SIGNER_KEYS.map((k) => ({ key: k, label: SIGNER_LABELS[k] })),
    ],
    [],
  );

  const tokenSelectOptions = useMemo(
    () => [
      { key: "all", label: "All tokens" },
      ...ACCOUNT_USAGE_BY_TOKEN.map((t) => ({
        key: t.tokenId,
        label: t.tokenName,
      })),
    ],
    [],
  );

  return (
    <div className="px-6 pt-6 pb-10">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {headerStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <PeriodToggle
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
        />
        <FilterSelect
          label="Signer"
          value={signerFilter}
          options={signerSelectOptions}
          onChange={setSignerFilter}
        />
        <FilterSelect
          label="Token"
          value={tokenFilter}
          options={tokenSelectOptions}
          onChange={setTokenFilter}
        />
      </div>

      {/* Usage breakdown chart */}
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-dark-surface p-5">
        <div className="mb-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Requests
          </p>
          <p className="mt-1 font-mono text-3xl font-bold text-white">
            {totalRequests.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-white/50">
            Daily request volume across signers for the selected period.
          </p>
        </div>

        <div className="mt-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="15%">
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.slice(5)}
                interval={
                  period === "24h"
                    ? 0
                    : period === "7d"
                      ? 0
                      : period === "30d"
                        ? 4
                        : 12
                }
              />
              <YAxis hide />
              <Tooltip
                content={<StackedChartTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              {visibleSigners.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="requests"
                  name={SIGNER_LABELS[key]}
                  fill={SIGNER_COLORS[key]}
                  radius={
                    i === visibleSigners.length - 1
                      ? [2, 2, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {SIGNER_KEYS.map((key) => {
            const dim =
              signerFilter !== "all" && signerFilter !== key
                ? "opacity-30"
                : "";
            return (
              <div key={key} className={`flex items-center gap-1.5 ${dim}`}>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: SIGNER_COLORS[key] }}
                />
                <span className="text-[11px] text-white/50">
                  {SIGNER_LABELS[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage per signer */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-dark-surface">
        <div className="border-b border-white/[0.06] px-5 py-3">
          <h3 className="text-sm font-medium text-white">Usage per signer</h3>
          <p className="text-[11px] text-white/40">
            Cost breakdown by payment routing source.
          </p>
        </div>

        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-2">
          <span className="min-w-0 flex-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
            Signer
          </span>
          <span className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Requests
          </span>
          <span className="w-16 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Share
          </span>
          <span className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Spend
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredSignerRows.map((row) => (
            <div key={row.signer} className="flex items-center gap-3 px-5 py-3">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: SIGNER_COLORS[row.signer] }}
              />
              <p className="min-w-0 flex-1 truncate text-sm text-white/80">
                {row.label}
              </p>
              <span className="w-24 shrink-0 text-right font-mono text-xs text-white/70">
                {row.requests.toLocaleString()}
              </span>
              <span className="w-16 shrink-0 text-right font-mono text-xs text-white/50">
                {row.percent}%
              </span>
              <span className="w-24 shrink-0 text-right font-mono text-xs text-white/70">
                {row.spendDisplay}
              </span>
            </div>
          ))}
          {filteredSignerRows.length === 0 && (
            <div className="px-5 py-8 text-center text-xs text-white/40">
              No signer activity for the current filter.
            </div>
          )}
        </div>
      </div>

      {/* Usage per token */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-dark-surface">
        <div className="border-b border-white/[0.06] px-5 py-3">
          <h3 className="text-sm font-medium text-white">Usage per token</h3>
          <p className="text-[11px] text-white/40">
            Activity grouped by API token.
          </p>
        </div>

        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-2">
          <span className="min-w-0 flex-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
            Token
          </span>
          <span className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Requests
          </span>
          <span className="w-28 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Last used
          </span>
          <span className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
            Spend
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredTokenRows.map((row) => (
            <div
              key={row.tokenId}
              className="flex items-center gap-3 px-5 py-3"
            >
              <p className="min-w-0 flex-1 truncate text-sm text-white/80">
                {row.tokenName}
              </p>
              <span className="w-24 shrink-0 text-right font-mono text-xs text-white/70">
                {row.requests.toLocaleString()}
              </span>
              <span className="w-28 shrink-0 text-right font-mono text-xs text-white/50">
                {row.lastUsed}
              </span>
              <span className="w-24 shrink-0 text-right font-mono text-xs text-white/70">
                {row.spendDisplay}
              </span>
            </div>
          ))}
          {filteredTokenRows.length === 0 && (
            <div className="px-5 py-8 text-center text-xs text-white/40">
              No token activity for the current filter.
            </div>
          )}
        </div>
      </div>

      {/* Recent requests — full activity log (filtered by tab-level filters) */}
      <div
        id="recent-requests"
        className="mt-6 scroll-mt-6 rounded-xl border border-white/[0.06] bg-dark-surface"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
          <div>
            <h3 className="text-sm font-medium text-white">Recent requests</h3>
            <p className="text-[11px] text-white/40">
              Latest API requests across all signers and tokens.
            </p>
          </div>
          <span className="font-mono text-[11px] text-white/40">
            Showing {Math.min(filteredActivity.length, 10)} of{" "}
            {filteredActivity.length}
          </span>
        </div>

        {filteredActivity.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-xs text-white/40">
              No requests match the current filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-2 text-xs text-green-bright transition-colors hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="scrollbar-dark max-h-[440px] overflow-y-auto">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/[0.06] bg-dark-surface px-5 py-2">
              <span className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-wider text-white/30">
                Time
              </span>
              <span className="min-w-0 flex-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
                Model
              </span>
              <span className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-wider text-white/30">
                Status
              </span>
              <span className="w-20 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                Latency
              </span>
              <span className="hidden w-32 shrink-0 text-[11px] font-medium uppercase tracking-wider text-white/30 lg:inline">
                Signer
              </span>
              <span className="hidden w-24 shrink-0 text-[11px] font-medium uppercase tracking-wider text-white/30 lg:inline">
                Token
              </span>
              <span className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-wider text-white/30">
                Cost
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filteredActivity.map((row) => {
                const isSuccess = row.status === "success";
                const isHighlighted = highlightedRequestId === row.id;
                return (
                  <div
                    key={row.id}
                    data-request-id={row.id}
                    className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                      isHighlighted
                        ? "bg-green/[0.08]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="w-20 shrink-0 font-mono text-[11px] text-white/40">
                      {formatActivityTime(row.timestamp)}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/80">
                      {row.model}
                    </span>
                    <span className="w-20 shrink-0">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                          isSuccess
                            ? "bg-green/15 text-green-bright"
                            : "bg-white/[0.06] text-white/50"
                        }`}
                      >
                        {row.status}
                      </span>
                    </span>
                    <span className="w-20 shrink-0 text-right font-mono text-[11px] text-white/60">
                      {formatActivityLatency(row.latencyMs)}
                    </span>
                    <span className="hidden w-32 shrink-0 items-center gap-1.5 text-[11px] text-white/70 lg:inline-flex">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: SIGNER_COLORS[row.signer] }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{row.signerLabel}</span>
                    </span>
                    <span className="hidden w-24 shrink-0 truncate text-[11px] text-white/50 lg:inline">
                      {row.tokenName}
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono text-[11px] text-white/70">
                      {row.costDisplay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
