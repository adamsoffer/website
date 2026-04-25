import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** The section title (renders as h2). */
  title: string;
  /** Optional one-line description below the title. */
  description?: string;
  /** Optional content rendered to the right of the title — typically a "View all →" link or a control. */
  action?: ReactNode;
  /** Visual size. `default` = home/usage section (`text-base`), `lg` = page heading (`text-xl/2xl`). */
  size?: "default" | "lg";
  /** Optional className for the wrapper (margin, etc.). Default `mb-4`. */
  className?: string;
}

/**
 * Dashboard SectionHeader — distinct from `components/ui/SectionHeader.tsx`
 * which is for marketing hero typography.
 *
 * Replaces the ad-hoc `<h2 className="text-base font-semibold">` + `<Link>View all →</Link>`
 * markup repeated 6+ times on the home page and elsewhere on dashboard surfaces.
 */
export default function SectionHeader({
  title,
  description,
  action,
  size = "default",
  className,
}: SectionHeaderProps) {
  const titleClass =
    size === "lg"
      ? "text-lg font-semibold text-white text-balance"
      : "text-base font-semibold text-white text-balance";

  return (
    <div className={className ?? "mb-4"}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={titleClass}>{title}</h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && (
        <p className="mt-1 text-sm text-fg-faint text-balance">{description}</p>
      )}
    </div>
  );
}
