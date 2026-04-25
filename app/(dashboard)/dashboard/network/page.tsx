"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BarChart3, Activity, Wallet, Cpu, ArrowUpRight } from "lucide-react";
import OverviewTab from "@/components/dashboard/statistics/OverviewTab";
import UtilizationTab from "@/components/dashboard/statistics/UtilizationTab";
import PaymentsTab from "@/components/dashboard/statistics/PaymentsTab";
import GpusTab from "@/components/dashboard/statistics/GpusTab";
import TabStrip from "@/components/dashboard/TabStrip";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

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
    <Suspense>
      <NetworkContent />
    </Suspense>
  );
}

function NetworkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab");
  const tab: NetworkTab = VALID_TABS.includes(rawTab as NetworkTab)
    ? (rawTab as NetworkTab)
    : "overview";

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

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 pb-5 lg:px-6 lg:pt-10">
        <DashboardPageHeader
          bordered={false}
          title="Network"
          description="Live state of the open GPU network — orchestrators, payments, hardware."
          actions={
            <a
              href="https://status.livepeer.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-hairline bg-transparent px-3 text-[12px] font-medium text-fg-strong transition-colors hover:border-subtle hover:bg-white/[0.04] hover:text-white"
            >
              Status page
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          }
        />
      </div>

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
