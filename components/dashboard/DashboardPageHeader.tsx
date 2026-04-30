import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface DashboardPageHeaderProps {
  /** Primary page title — renders as the last (current) breadcrumb. */
  title: string;
  /** Optional leading icon (lucide). Rendered to the left of the title at the
   *  same size as the breadcrumb glyph in the design. */
  icon?: LucideIcon;
  /** Optional one-line description rendered ABOVE the chrome bar in the page
   *  body when caller wants additional context. The chrome bar itself stays
   *  pure breadcrumb + actions. */
  description?: string;
  /** Optional content rendered to the right of the breadcrumbs — primary
   *  action, glance stats, controls. Kept compact (icon-buttons, sm primary). */
  actions?: ReactNode;
  /** @deprecated — chrome bar always has a hairline border-bottom. Kept for
   *  call-site backward compat. */
  bordered?: boolean;
  /** Optional className override. */
  className?: string;
}

/**
 * DashboardPageHeader — 44px chrome bar at the top of every dashboard route.
 *
 * Linear / Livepeer Console pattern: a slim breadcrumb bar with left-aligned
 * crumbs and right-aligned actions. The page title lives in the breadcrumb,
 * not as a hero. Information density comes from the *content*; this bar is
 * pure chrome and stays out of the way.
 */
export default function DashboardPageHeader({
  title,
  icon: Icon,
  description,
  actions,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={
        className ??
        "flex h-[44px] shrink-0 items-center gap-3 border-b border-hairline bg-dark px-5"
      }
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-[4px] px-1.5 py-1 text-[13px] font-medium text-white">
        {Icon && (
          <Icon
            className="h-3.5 w-3.5 shrink-0 text-fg-faint"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
        <span className="truncate" title={description}>
          {title}
        </span>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
  );
}
