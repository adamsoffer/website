import { ReactNode } from "react";

/**
 * Badge — small label/pill component, used across both marketing and dashboard.
 *
 * Variants split into two groups:
 *  - Marketing-style: `default`, `app`, `category`, `tag`, `neutral` (uppercase, mono)
 *  - Dashboard-style: `statusWarm`, `statusCold`, `realtime`, `new`, `filter`,
 *    `precision` (sentence case, sans-serif)
 *
 * Each variant bakes its own padding / radius / text-size so callers pass only
 * `variant` and `children`. Use the `nonMono` prop for sans-serif rendering on
 * dashboard variants (default applies to status-* / realtime / new / filter /
 * precision automatically — but it's exposed for overrides).
 */
const VARIANT_STYLES = {
  // Marketing variants
  default:
    "rounded-full border-green/30 bg-green-subtle text-green-light px-3 py-1 text-xs font-mono",
  app: "rounded-md border-green-bright/40 bg-green-bright/10 text-green-bright px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-mono",
  category:
    "rounded border-transparent bg-white/[0.10] text-fg-faint px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-mono",
  tag: "rounded border-transparent bg-white/[0.06] text-fg-disabled px-2.5 py-0.5 text-[11px] font-mono",
  neutral:
    "rounded-full border-transparent bg-white/[0.06] text-fg-label px-1.5 py-[1px] text-[9px] leading-tight tracking-wide font-mono",

  // Dashboard variants — sans-serif, no border by default
  statusWarm:
    "rounded-full border-transparent bg-warm-subtle text-warm px-2 py-0.5 text-[11px] gap-1.5",
  statusCold:
    "rounded-full border-transparent bg-blue/10 text-blue-bright px-2 py-0.5 text-[11px] gap-1.5",
  realtime:
    "rounded-full border-transparent bg-green-bright/10 text-green-bright px-2 py-0.5 text-[11px] gap-1.5",
  new: "rounded-md border-transparent bg-green-bright text-dark px-2 py-1 text-[11px] gap-1",
  filter:
    "rounded-full border-transparent bg-white/[0.1] text-white px-2.5 py-1 text-xs gap-1",
  precision:
    "rounded border-transparent bg-white/[0.06] text-fg-faint px-1.5 py-0.5 text-[10px] font-mono",
} as const;

export default function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANT_STYLES;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center border font-medium ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
