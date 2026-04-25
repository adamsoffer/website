import type { ReactNode } from "react";

type Trend = "up" | "down" | "flat";

interface KpiCardProps {
  /** Small caps label rendered above the value. */
  label: string;
  /** The number/string headline. Renders in tabular-nums monospace. */
  value: string;
  /** Optional trend delta string ("+12.4% vs last period") rendered below the value. */
  delta?: string;
  /** Direction of the delta. Drives the delta color. Default `flat`. */
  trend?: Trend;
  /** Optional icon glyph rendered inline with the label. */
  icon?: ReactNode;
}

// Editorial restraint: color carries the direction, no arrow icon, italic delta.
const TREND_COLOR: Record<Trend, string> = {
  up: "text-green-bright",
  down: "text-red-400",
  flat: "text-fg-faint",
};

/**
 * KpiCard — single source of truth for stat tiles across the dashboard.
 *
 * Editorial treatment: no border, no card chrome — whitespace and the grid gap
 * separate stats. Label sits in small-caps tracked tier; value reads like a
 * pull-quote (text-3xl mono medium, leading-tight); delta is italic with color
 * alone carrying the direction.
 */
export default function KpiCard({
  label,
  value,
  delta,
  trend = "flat",
  icon,
}: KpiCardProps) {
  const color = TREND_COLOR[trend];

  return (
    <div className="py-1">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-fg-label">
        {icon && <span className="text-fg-disabled">{icon}</span>}
        {label}
      </p>
      <p className="mt-2 text-3xl font-medium leading-none tabular-nums text-white">
        {value}
      </p>
      {/* nbsp placeholder keeps grid heights aligned when delta absent */}
      <p
        className={`mt-2 text-xs italic tabular-nums ${color}`}
        aria-hidden={!delta}
      >
        {delta ? <span className="truncate">{delta}</span> : " "}
      </p>
    </div>
  );
}
