import type { ReactNode } from "react";

interface DashboardPageHeaderProps {
  /** Primary page title — renders as h1. Kept small (text-base font-semibold) for editorial restraint. */
  title: string;
  /** Optional one-line subtitle below the title. */
  description?: string;
  /** Optional content rendered to the right of the title — primary action, glance stats, controls. */
  actions?: ReactNode;
  /** Adds a hairline border-bottom + bottom padding. Default `true`. Set `false` when the next surface (e.g. tab strip) brings its own divider. */
  bordered?: boolean;
  /** Optional className override for the wrapper (overrides default padding). */
  className?: string;
}

/**
 * DashboardPageHeader — Karri-style page header.
 *
 * Editorial restraint: small title, thin subtitle, generous breathing room,
 * optional inline actions/glance on the right (baseline-aligned). Information
 * density should come from the *content*, not the chrome. The title is
 * intentionally `text-base` — same as a strong section header — because the
 * sidebar already tells the user where they are; the page header doesn't need
 * to shout.
 */
export default function DashboardPageHeader({
  title,
  description,
  actions,
  bordered = true,
  className,
}: DashboardPageHeaderProps) {
  const wrapper = bordered
    ? "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-b border-hairline pb-5"
    : "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3";

  return (
    <div className={className ?? wrapper}>
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-fg-faint">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
