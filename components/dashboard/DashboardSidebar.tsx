"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  LayoutGrid,
  Activity,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Globe,
  Settings,
  Key,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LivepeerWordmark, LivepeerSymbol } from "@/components/icons/LivepeerLogo";
import { PORTAL_NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/components/dashboard/AuthContext";
import DashboardSearch from "@/components/dashboard/DashboardSearch";
import Drawer from "@/components/ui/Drawer";
import NavLink from "@/components/dashboard/NavLink";
import StatusDot from "@/components/dashboard/StatusDot";
import Tooltip from "@/components/ui/Tooltip";

const NAV_ICONS = { House, LayoutGrid, Activity, Globe } as const;

const COLLAPSED_KEY = "dashboard.sidebar.collapsed";

function getNavActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  if (itemHref === "/dashboard/explore") {
    return (
      pathname === "/dashboard/explore" ||
      pathname.startsWith("/dashboard/explore/") ||
      pathname.startsWith("/dashboard/models/")
    );
  }
  return pathname.startsWith(itemHref);
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) {
  const dims = size === "md" ? "h-8 w-8 text-xs" : "h-7 w-7 text-[11px]";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-green-bright/15 font-semibold text-green-bright ring-1 ring-green-bright/25 ${dims}`}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

// ─── AvatarMenu — opens downward from the top of the sidebar ────────────────

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4 },
};

interface AvatarMenuProps {
  user: { name: string; email: string; initials: string };
  disconnect: () => void;
  collapsed: boolean;
}

function AvatarMenu({ user, disconnect, collapsed }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`Account menu for ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title={collapsed ? user.name : undefined}
        className={
          collapsed
            ? `flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                open ? "bg-white/[0.08]" : "hover:bg-white/[0.06]"
              }`
            : `flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
                open ? "bg-white/[0.08]" : "hover:bg-white/[0.06]"
              }`
        }
      >
        <Avatar initials={user.initials} />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-fg">
              {user.name}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-fg-label transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-orientation="vertical"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full z-[100] mt-2 w-64 overflow-hidden rounded-xl border border-hairline bg-dark-card backdrop-blur-xl ${
              collapsed ? "left-full ml-2 mt-0 top-0 origin-top-left" : "left-0 origin-top-left"
            }`}
          >
            <div className="border-b border-hairline px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar initials={user.initials} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{user.name}</div>
                  <div className="truncate text-xs text-fg-faint">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="px-1.5 py-1.5">
              {[
                { label: "Settings", href: "/dashboard/settings", icon: Settings },
                { label: "API Tokens", href: "/dashboard/settings?tab=tokens", icon: Key },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-strong transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <item.icon className="h-4 w-4 text-fg-label" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-hairline px-1.5 py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-faint transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar content (shared between desktop + mobile drawer) ───────────────

interface SidebarContentProps {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Called when a nav item is clicked — used to close mobile drawer. */
  onNavigate?: () => void;
  /** Hides the collapse toggle (used inside the mobile drawer). */
  hideToggle?: boolean;
}

function SidebarContent({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  hideToggle = false,
}: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isConnected, user, disconnect } = useAuth();

  const padX = collapsed ? "px-2.5" : "px-3";

  return (
    <div className="flex h-full flex-col bg-shell">
      {/* Top: avatar (when signed in) or logo (when signed out) + collapse toggle */}
      <div
        className={`flex shrink-0 items-center gap-2 pt-3 pb-2 ${padX} ${collapsed ? "flex-col" : ""}`}
      >
        <div className={collapsed ? "" : "min-w-0 flex-1"}>
          {isConnected && user ? (
            <AvatarMenu user={user} disconnect={disconnect} collapsed={collapsed} />
          ) : (
            <Link
              href="/dashboard"
              aria-label="Livepeer Developer Dashboard"
              className="flex items-center"
              onClick={onNavigate}
            >
              {collapsed ? (
                <LivepeerSymbol className="h-5 w-5 text-white" aria-hidden="true" />
              ) : (
                <LivepeerWordmark className="h-3.5 w-auto text-white" aria-hidden="true" />
              )}
            </Link>
          )}
        </div>

        {!hideToggle && onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-fg-faint transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Search */}
      <div className={`shrink-0 pb-2 ${padX}`}>
        {collapsed ? (
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", [isMac ? "metaKey" : "ctrlKey"]: true }),
              );
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        ) : (
          <DashboardSearch mobile />
        )}
      </div>

      {/* Primary nav */}
      <nav aria-label="Developer Dashboard" className={`flex-1 overflow-y-auto pb-2 ${padX}`}>
        <ul className="space-y-0.5">
          {PORTAL_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = getNavActive(item.href, pathname);
            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  icon={Icon}
                  label={item.label}
                  active={active}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: Network + Docs + Changelog + sign-in/sign-up (signed-out).
          Network is internal protocol view (GPUs, payments). The Statuspage
          row lives below as a separate operational-health concern. */}
      <div className={`shrink-0 border-t border-hairline pt-2 pb-2 ${padX} space-y-1`}>
        <NavLink
          href="/dashboard/network"
          icon={Globe}
          label="Network"
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <NavLink
          href="https://docs.livepeer.org"
          icon={BookOpen}
          label="Docs"
          collapsed={collapsed}
          external
          onNavigate={onNavigate}
        />

        <NavLink
          href="https://docs.livepeer.org/changelog"
          icon={Sparkles}
          label="Changelog"
          collapsed={collapsed}
          external
          onNavigate={onNavigate}
        />

        {!isConnected && (
          collapsed ? (
            <button
              type="button"
              aria-label="Sign in"
              title="Sign in"
              onClick={() => {
                router.push("/dashboard/login");
                onNavigate?.();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <User className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  router.push("/dashboard/login");
                  onNavigate?.();
                }}
                className="text-sm text-fg-muted transition-colors hover:text-white"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/dashboard/login");
                  onNavigate?.();
                }}
                className="ml-auto select-none rounded-full bg-green px-3.5 py-1 text-[13px] font-medium text-white transition-colors hover:bg-green-light active:bg-green-dark"
              >
                Sign up
              </button>
            </div>
          )
        )}
      </div>

      {/* Statuspage row — operational health, external link. Standard
          Statuspage convention: a single line with a status dot indicating
          uptime. Distinct from the internal Network nav above (which shows
          protocol/GPU/payment data). When something's degraded, this dot
          turns warm/red. */}
      <div className={`shrink-0 border-t border-hairline ${padX} py-2`}>
        {collapsed ? (
          <Tooltip content="All services operational" side="right">
            <a
              href="https://status.livepeer.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Status: all services operational (opens in new tab)"
              className="flex h-7 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/[0.025]"
            >
              <StatusDot tone="green" size="md" />
            </a>
          </Tooltip>
        ) : (
          <a
            href="https://status.livepeer.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Status: all services operational (opens in new tab)"
            className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-[12px] text-fg-muted transition-colors hover:bg-white/[0.025] hover:text-white"
          >
            <StatusDot tone="green" />
            <span className="min-w-0 flex-1 truncate">All services operational</span>
            <ExternalLink className="h-3 w-3 shrink-0 text-fg-disabled" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Public component ──────────────────────────────────────────────────────

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSED_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      // ignore
    }
    // Defer transition enablement one frame so the initial width doesn't animate.
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Avoid flashing the wrong width before localStorage read completes.
  const desktopWidth = collapsed ? "md:w-14" : "md:w-60";
  const transition = hydrated ? "transition-[width] duration-200 ease-out" : "";

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-green focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex sticky top-0 h-screen shrink-0 flex-col ${desktopWidth} ${transition}`}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </aside>

      {/* Mobile top bar with hamburger */}
      <div className="sticky top-0 z-40 flex md:hidden h-14 items-center gap-2 border-b border-hairline bg-shell px-4">
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          aria-controls="dashboard-sidebar-drawer"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-fg-strong transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile overlay drawer */}
      <Drawer
        id="dashboard-sidebar-drawer"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ariaLabel="Navigation"
        side="left"
      >
        <SidebarContent collapsed={false} hideToggle onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}
