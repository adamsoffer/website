"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart3, Activity, Wallet, Cpu } from "lucide-react";
import OverviewTab from "@/components/studio/statistics/OverviewTab";
import UtilizationTab from "@/components/studio/statistics/UtilizationTab";
import PaymentsTab from "@/components/studio/statistics/PaymentsTab";
import GpusTab from "@/components/studio/statistics/GpusTab";
import StudioFooter from "@/components/studio/StudioFooter";

type StatsTab = "overview" | "utilization" | "payments" | "gpus";

const VALID_TABS: StatsTab[] = ["overview", "utilization", "payments", "gpus"];

const TABS: { key: StatsTab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "utilization", label: "Utilization", icon: Activity },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "gpus", label: "GPUs", icon: Cpu },
];

export default function StatsPage() {
  return (
    <Suspense>
      <StatsContent />
    </Suspense>
  );
}

function StatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab");
  const tab: StatsTab = VALID_TABS.includes(rawTab as StatsTab)
    ? (rawTab as StatsTab)
    : "overview";

  const setTab = useCallback(
    (key: StatsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", key);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      {/* Mobile tab bar — outside the flex row so it sits above content */}
      <div className="flex border-b border-white/10 bg-dark-surface px-4 lg:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs transition-colors ${
              tab === key
                ? "border-white/40 text-white"
                : "border-transparent text-white/50 hover:text-white/70"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-[calc(100vh-3rem-2.75rem)]">
        {/* Sidebar */}
        <div className="hidden w-[260px] flex-shrink-0 self-stretch border-r border-white/10 bg-dark lg:block">
          <div className="sticky top-12 max-h-[calc(100vh-3rem)] overflow-y-auto px-5 pt-6 pb-5 space-y-4">
            <p className="mb-1.5 px-3 text-xs font-medium uppercase tracking-wider text-white/50">
              Statistics
            </p>
            <div className="space-y-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    tab === key
                      ? "bg-white/[0.08] font-medium text-white"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Page header */}
          <div className="border-b border-white/[0.06] px-6 pt-10 pb-5">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Stats
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              Real-time health and usage of the Livepeer network.
            </p>
          </div>

          <div className="flex-1">
            {tab === "overview" && <OverviewTab />}
            {tab === "utilization" && <UtilizationTab />}
            {tab === "payments" && <PaymentsTab />}
            {tab === "gpus" && <GpusTab />}
          </div>
          <StudioFooter />
        </div>
      </div>
    </main>
  );
}
