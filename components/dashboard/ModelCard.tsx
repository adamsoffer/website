"use client";

import Link from "next/link";
import { Sparkles, Snowflake, Zap } from "lucide-react";
import {
  getModelIcon,
  formatPrice,
  isModelNew,
} from "@/lib/dashboard/utils";
import { generateCardBackground } from "@/lib/dashboard/generate-card-visual";
import StarButton from "@/components/dashboard/StarButton";
import StatusDot from "@/components/dashboard/StatusDot";
import Tooltip from "@/components/ui/Tooltip";
import type { Model } from "@/lib/dashboard/types";

export default function ModelCard({
  model,
  hideNewBadge = false,
}: {
  model: Model;
  /** Starred/recently-viewed contexts already imply discovery — the NEW badge reads as noise there. */
  hideNewBadge?: boolean;
}) {
  const Icon = getModelIcon(model.category);
  const providerSlug = model.provider.toLowerCase().replace(/\s+/g, "-");
  const isWarm = model.status === "hot";
  const isNew = isModelNew(model) && !hideNewBadge;

  return (
    <Link
      href={`/dashboard/models/${model.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-hairline transition-colors duration-150 hover:border-subtle hover:bg-white/[0.015]"
    >
      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden">
        {model.coverImage ? (
          <img
            src={model.coverImage}
            alt={`${model.name} by ${model.provider}`}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: generateCardBackground(model.id) }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] ring-1 ring-white/[0.1] backdrop-blur-sm">
              <Icon
                className="h-5 w-5 text-fg-strong"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* NEW badge — top-left, with safe margin from corner */}
        {isNew && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-green-bright px-2 py-1 text-[11px] font-medium text-dark">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.25} />
            new
          </span>
        )}

        {/* Status pills — bottom-left. Warm/Cold + optional Realtime (moat signal). */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-[11px] font-medium backdrop-blur-sm ${
              isWarm ? "text-warm" : "text-blue-bright"
            }`}
          >
            {isWarm ? (
              <StatusDot tone="warm" />
            ) : (
              <Snowflake className="h-2.5 w-2.5" />
            )}
            {isWarm ? "Warm" : "Cold"}
          </span>
          {model.realtime && (
            <Tooltip content="Supports streaming (WebRTC) inference">
              <span
                tabIndex={0}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-[11px] font-medium text-green-bright backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-bright/40"
              >
                <Zap className="h-2.5 w-2.5" fill="currentColor" />
                Realtime
              </span>
            </Tooltip>
          )}
        </div>

        {/* Star — top-right, hover-reveal */}
        <StarButton modelId={model.id} className="absolute top-3 right-3" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-wider text-fg-label">
          {providerSlug}
        </p>
        <p className="text-[15px] font-medium leading-snug text-white">
          {model.name}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 self-start rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-fg-muted">
          <Icon className="h-3 w-3" />
          {model.category}
        </span>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-fg-faint">
          {model.description}
        </p>

        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-end border-t border-hairline pt-4">
          <span className="text-xs text-fg-strong">
            {formatPrice(model)}
          </span>
        </div>
      </div>
    </Link>
  );
}
