"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { NetworkStat } from "@/lib/studio/types";

export default function StatCard({ stat }: { stat: NetworkStat }) {
  const TrendIcon =
    stat.trend === "up"
      ? TrendingUp
      : stat.trend === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    stat.trend === "up"
      ? "text-green-bright"
      : stat.trend === "down"
        ? "text-red-400"
        : "text-white/50";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-dark-surface p-4">
      <p className="text-[11px] text-white/50">{stat.label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-white">
        {stat.value}
      </p>
      {stat.delta && (
        <div
          className={`mt-0.5 flex items-center gap-1 font-mono text-xs ${trendColor}`}
        >
          <TrendIcon className="h-3 w-3" />
          {stat.delta}
        </div>
      )}
    </div>
  );
}
