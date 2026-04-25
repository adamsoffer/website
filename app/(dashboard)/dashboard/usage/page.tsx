"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/AuthContext";
import UsageTab from "@/components/dashboard/settings/UsageTab";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

export default function UsagePage() {
  return (
    <Suspense>
      <UsageContent />
    </Suspense>
  );
}

function UsageContent() {
  const { isConnected, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.replace("/dashboard/login");
    }
  }, [isConnected, isLoading, router]);

  if (isLoading || !isConnected) return null;

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl flex-1">
          <div className="px-5 pt-6 lg:px-6 lg:pt-10">
            <DashboardPageHeader
              bordered={false}
              title="Usage"
              description="Requests, latency, errors, and spend across your API tokens."
            />
          </div>
          <UsageTab />
        </div>
      </div>
    </main>
  );
}
