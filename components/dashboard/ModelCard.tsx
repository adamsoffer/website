"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getModelIcon, formatRuns, isModelNew } from "@/lib/dashboard/utils";
import { generateCardBackground } from "@/lib/dashboard/generate-card-visual";
import StarButton from "@/components/dashboard/StarButton";
import Pill from "@/components/dashboard/Pill";
import type { Model } from "@/lib/dashboard/types";

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

function formatUnitPrice(model: Model): {
  amount: string;
  unit: string;
} {
  const p = model.pricing.amount;
  const decimals = p < 0.01 ? 4 : 3;
  return {
    amount: `$${p.toFixed(decimals)}`,
    unit: `/${model.pricing.unit}`,
  };
}

/**
 * ModelCard — capability card per the Livepeer Dashboard design v3
 * (Apr 2026, `.cap-card-*` in styles.css).
 *
 * Structure: 16:10 thumbnail with a backdrop-blur category chip pinned to the
 * bottom-left, then a body with name + warm/cold status pill, vendor, two-line
 * description (with reserved height so cards line up), and a three-column
 * stats footer (p50 latency, unit price, 7-day runs) separated by a hairline.
 *
 * Star (top-right, hover-reveal) and NEW (top-left, when applicable) badges
 * are preserved on top of the v3 chrome since they're working production
 * affordances on this surface.
 */
export default function ModelCard({
  model,
  hideNewBadge = false,
}: {
  model: Model;
  /** Starred / recently-viewed contexts already imply discovery — the NEW badge reads as noise there. */
  hideNewBadge?: boolean;
}) {
  const Icon = getModelIcon(model.category);
  const isWarm = model.status === "hot";
  const isNew = isModelNew(model) && !hideNewBadge;
  const price = formatUnitPrice(model);

  return (
    <Link
      href={`/dashboard/models/${model.id}`}
      className="group flex flex-col overflow-hidden rounded-md border border-hairline bg-dark-lighter transition-colors duration-150 hover:border-strong"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-card">
        {model.coverImage ? (
          <img
            src={model.coverImage}
            alt={`${model.name} by ${model.provider}`}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: generateCardBackground(model.id) }}
            aria-hidden="true"
          >
            <Icon
              className="h-7 w-7 text-fg-faint"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* NEW badge — top-left, only when the model is fresh */}
        {isNew && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-green-bright px-1.5 py-0.5 text-[10.5px] font-medium text-dark">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.25} />
            new
          </span>
        )}

        {/* Category chip — backdrop-blurred, bottom-left of the thumbnail */}
        <span
          className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-[4px] py-[3px] pr-[7px] pl-[6px] text-[10.5px] font-medium text-white/90"
          style={{
            background: "rgba(10, 10, 11, 0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <Icon className="h-3 w-3" aria-hidden="true" />
          {model.category}
        </span>

        {/* Star — top-right, hover-reveal */}
        <StarButton modelId={model.id} className="absolute top-2 right-2" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-3.5 pt-3 pb-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-white">
            {model.name}
          </span>
          <Pill tone={isWarm ? "warm" : "cold"} dot>
            {isWarm ? "warm" : "cold"}
          </Pill>
        </div>

        <p className="-mt-1 text-[11.5px] text-fg-faint">{model.provider}</p>

        <p
          className="text-[12px] leading-[1.45] text-fg-muted"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 34,
          }}
        >
          {model.description}
        </p>

        {/* Stats footer — 3 columns, hairline divider above */}
        <div className="mt-[2px] grid grid-cols-3 gap-2 border-t border-hairline pt-2.5">
          <Stat label="p50" value={formatLatency(model.latency)} />
          <Stat
            label="Price"
            value={
              <>
                {price.amount}
                <span className="text-fg-disabled">{price.unit}</span>
              </>
            }
          />
          <Stat label="7d runs" value={formatRuns(model.runs7d)} />
        </div>
      </div>
    </Link>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-fg-faint">
        {label}
      </span>
      <span className="truncate text-[12px] text-fg-strong">{value}</span>
    </div>
  );
}
