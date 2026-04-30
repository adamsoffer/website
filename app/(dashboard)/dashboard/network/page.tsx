"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart3, Activity, Globe, Wallet, Cpu, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/dashboard/AuthContext";
import OverviewTab from "@/components/dashboard/statistics/OverviewTab";
import UtilizationTab from "@/components/dashboard/statistics/UtilizationTab";
import PaymentsTab from "@/components/dashboard/statistics/PaymentsTab";
import GpusTab from "@/components/dashboard/statistics/GpusTab";
import TabStrip from "@/components/dashboard/TabStrip";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DashboardPageSkeleton from "@/components/dashboard/DashboardPageSkeleton";
import SignInWall from "@/components/dashboard/SignInWall";

type NetworkTab = "overview" | "utilization" | "payments" | "gpus";

const VALID_TABS: NetworkTab[] = ["overview", "utilization", "payments", "gpus"];

const TABS: { key: NetworkTab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "utilization", label: "Utilization", icon: Activity },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "gpus", label: "GPUs", icon: Cpu },
];

export default function NetworkPage() {
  return (
    <Suspense
      fallback={<DashboardPageSkeleton withTabs kpiCount={4} withChart />}
    >
      <NetworkContent />
    </Suspense>
  );
}

function NetworkContent() {
  const { isConnected, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab");
  const tab: NetworkTab = VALID_TABS.includes(rawTab as NetworkTab)
    ? (rawTab as NetworkTab)
    : "overview";

  // `setTab` lives above the auth gates so the hook order stays stable
  // between rendered states (loading → wall → content). Calling hooks after
  // an early return violates the Rules of Hooks.
  const setTab = useCallback(
    (key: NetworkTab) => {
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

  // Network is per-workspace per the v4 prototype — even though the sidebar
  // surfaces it for logged-out users in its footer (no lock icon), clicking
  // through lands on a sign-in wall with route-specific copy. Keeps the
  // workspace gate consistent without hiding the entry point entirely.
  if (isLoading) return null;
  if (!isConnected) return <SignInWall route="network" />;

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <DashboardPageHeader
        title="Network"
        icon={Globe}
        description="Live state of the open GPU network — orchestrators, payments, hardware."
        actions={
          <a
            href="https://status.livepeer.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[26px] items-center gap-1.5 rounded-[4px] border border-transparent px-2.5 text-[12.5px] font-medium text-fg-strong transition-colors hover:border-hairline hover:bg-hover hover:text-fg"
          >
            Status page
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        }
      />

      {/* Horizontal tab strip */}
      <div className="sticky top-0 z-20 border-b border-hairline bg-dark">
        <div className="mx-auto w-full max-w-6xl px-5 lg:px-6">
          <TabStrip
            tabs={TABS}
            active={tab}
            onChange={setTab}
            layoutId="network-tabs"
            ariaLabel="Network sections"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1">
          {tab === "overview" && <OverviewTab />}
          {tab === "utilization" && <UtilizationTab />}
          {tab === "payments" && <PaymentsTab />}
          {tab === "gpus" && <GpusTab />}
        </div>
      </div>
    </main>
  );
}
