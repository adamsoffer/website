"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

export interface SubNavTab {
  key: string;
  label: string;
  icon?: ElementType;
}

interface StudioSubNavProps {
  tabs: readonly SubNavTab[];
  activeKey: string;
  onChange: (key: string) => void;
  /** Label for aria-label on the nav element. */
  ariaLabel?: string;
  /** Only render below this breakpoint. Defaults to lg (matches existing sidebar pattern). */
  hideAt?: "md" | "lg";
}

/**
 * Mobile-only horizontal-scroll sub-navigation strip.
 *
 * Renders as a row of pill-style tab buttons that scroll horizontally when
 * content exceeds the viewport. A right-edge fade mask signals scrollability.
 * Desktop/tablet hides it above `hideAt:` — the sidebar takes over.
 *
 * Active tab uses a subtle pill highlight matching the Holographik card
 * treatment (bg-white/[0.06] border-white/[0.08]).
 */
export default function StudioSubNav({
  tabs,
  activeKey,
  onChange,
  ariaLabel = "Section",
  hideAt = "lg",
}: StudioSubNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Detect overflow to show edge fade affordances
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const canScroll = el.scrollWidth > el.clientWidth;
      const atStart = el.scrollLeft <= 2;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setShowLeftFade(canScroll && !atStart);
      setShowRightFade(canScroll && !atEnd);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [tabs]);

  // Scroll active tab into view on mount + key change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>("[data-active]");
    active?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeKey]);

  const hideClass = hideAt === "lg" ? "lg:hidden" : "md:hidden";

  return (
    <nav
      aria-label={ariaLabel}
      className={`${hideClass} sticky top-16 z-30 border-b border-white/[0.08] bg-dark/95 backdrop-blur-md`}
    >
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto px-4 py-1.5"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                aria-current={active ? "page" : undefined}
                data-active={active ? "" : undefined}
                onClick={() => onChange(key)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border border-white/[0.08] bg-white/[0.06] text-white"
                    : "text-white/55 hover:text-white/80"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-green-bright" : "text-white/40"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>

        {/* Left-edge fade — signals content scrolled off to the left */}
        {showLeftFade && (
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(18,18,18,0.95))",
            }}
            aria-hidden="true"
          />
        )}

        {/* Right-edge fade — signals more content to the right */}
        {showRightFade && (
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(18,18,18,0.95))",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
}
