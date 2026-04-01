"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ExternalLink, TrendingUp, Search } from "lucide-react";
import PeriodToggle from "./PeriodToggle";
import { SimpleChartTooltip } from "./ChartTooltip";
import {
  PAYMENT_HISTORY,
  PAYMENT_STATS,
  PAYMENT_TRANSACTIONS,
} from "@/lib/studio/mock-data";

// ─── Period options ───

type Period = "30d" | "3m" | "all";

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: "30d", label: "30D" },
  { key: "3m", label: "3M" },
  { key: "all", label: "All" },
];

// ─── Summary card ───

function SummaryCard({
  label,
  eth,
  usd,
}: {
  label: string;
  eth: number;
  usd: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-dark-surface p-5">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-white">
        ${usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </p>
      <div className="mt-1 flex items-center gap-1 text-xs text-green-bright">
        <TrendingUp className="h-3 w-3" />
        <span className="font-mono">{eth.toFixed(2)} ETH</span>
      </div>
    </div>
  );
}

// ─── Pagination ───

const PAGE_SIZE = 10;

// ─── Main ───

export default function PaymentsTab() {
  const [period, setPeriod] = useState<Period>("3m");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const chartData = useMemo(() => {
    const days = period === "30d" ? 30 : period === "3m" ? 90 : PAYMENT_HISTORY.length;
    return PAYMENT_HISTORY.slice(-days);
  }, [period]);

  const filteredTxs = useMemo(() => {
    if (!search) return PAYMENT_TRANSACTIONS;
    const q = search.toLowerCase();
    return PAYMENT_TRANSACTIONS.filter(
      (tx) =>
        tx.orchestrator.toLowerCase().includes(q) ||
        tx.pipeline.toLowerCase().includes(q) ||
        tx.txHash.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredTxs.length / PAGE_SIZE);
  const pageTxs = filteredTxs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-6 p-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">Payments</h2>
        <p className="mt-1 text-sm text-white/50">
          ETH fees flowing through the network for completed inference jobs, paid to orchestrators.
        </p>
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-white/[0.06] bg-dark-surface p-5">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Network Revenue
            </p>
            <p className="mt-1 text-sm text-white/50">
              Daily fees paid to orchestrators for inference work
            </p>
          </div>
          <PeriodToggle value={period} onChange={setPeriod} options={PERIOD_OPTIONS} />
        </div>

        <div className="mt-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barCategoryGap="15%">
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.slice(5)}
                interval={period === "30d" ? 4 : 12}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<SimpleChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar
                dataKey="volumeUsd"
                fill="#40bf86"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Last 24 Hours"
          eth={PAYMENT_STATS.lastDay.eth}
          usd={PAYMENT_STATS.lastDay.usd}
        />
        <SummaryCard
          label="Last 30 Days"
          eth={PAYMENT_STATS.lastMonth.eth}
          usd={PAYMENT_STATS.lastMonth.usd}
        />
        <SummaryCard
          label="All Time"
          eth={PAYMENT_STATS.allTime.eth}
          usd={PAYMENT_STATS.allTime.usd}
        />
      </div>

      {/* Recent payments table */}
      <div className="rounded-xl border border-white/[0.06] bg-dark-surface">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search payments..."
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none w-56"
            />
          </div>
          <span className="text-[11px] text-white/40">
            {filteredTxs.length} payments{search ? " found" : " loaded"}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* Header */}
          <div className="flex min-w-[700px] items-center gap-4 border-b border-white/[0.06] px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
            <span className="w-36">Date</span>
            <span className="w-28">Orchestrator</span>
            <span className="flex-1">Pipeline</span>
            <span className="w-24 text-right">ETH</span>
            <span className="w-24 text-right">USD</span>
            <span className="w-28 text-right">Block</span>
            <span className="w-8" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04]">
            {pageTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex min-w-[700px] items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <span className="w-36 text-xs text-white/50">
                  {new Date(tx.date).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="w-28 font-mono text-xs text-white/60">{tx.orchestrator}</span>
                <span className="flex-1 text-xs text-white/50">{tx.pipeline}</span>
                <span className="w-24 text-right font-mono text-xs text-white/70">
                  {tx.amountEth.toFixed(4)}
                </span>
                <span className="w-24 text-right font-mono text-xs text-white/50">
                  ${tx.amountUsd.toFixed(2)}
                </span>
                <span className="w-28 text-right font-mono text-[11px] text-white/40">
                  {tx.block.toLocaleString()}
                </span>
                <a
                  href={`https://arbiscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-8 items-center justify-center text-white/30 transition-colors hover:text-white/60"
                  title="View on Arbiscan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-2.5">
            <span className="text-xs text-white/40">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredTxs.length)} of{" "}
              {filteredTxs.length} payments
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="rounded-md px-2.5 py-1 text-xs text-white/50 transition-colors hover:bg-white/[0.06] disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-md px-2.5 py-1 text-xs text-white/50 transition-colors hover:bg-white/[0.06] disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
