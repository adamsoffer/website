"use client";

import Link from "next/link";
import { ExternalLink, type LucideIcon } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  external?: boolean;
  onNavigate?: () => void;
}

export default function NavLink({
  href,
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  external = false,
  onNavigate,
}: NavLinkProps) {
  const base =
    "group relative flex h-9 items-center rounded-md text-sm transition-colors";
  const state = active
    ? "bg-white/[0.05] text-white"
    : "text-fg-muted hover:bg-white/[0.025] hover:text-white";
  const layout = collapsed ? "w-9 justify-center" : "w-full gap-3 px-2.5";
  const className = `${base} ${state} ${layout}`;

  const content = (
    <>
      {active && !collapsed && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-green-bright motion-safe:[animation:breathe_4s_ease-in-out_infinite]"
        />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-fg-faint"}`}
        aria-hidden="true"
      />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {external && (
            <ExternalLink
              className="h-3 w-3 shrink-0 text-fg-disabled"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </>
  );

  const linkEl = external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={collapsed ? label : undefined}
      className={className}
      onClick={onNavigate}
    >
      {content}
    </a>
  ) : (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={className}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );

  // When collapsed (icon-only rail), wrap in a Tooltip pointing right so the
  // user can read the label without expanding the sidebar.
  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        {linkEl}
      </Tooltip>
    );
  }

  return linkEl;
}
