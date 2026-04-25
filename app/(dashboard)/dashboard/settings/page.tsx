"use client";

import { Suspense, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { User, Key, Wallet } from "lucide-react";
import { useAuth } from "@/components/dashboard/AuthContext";
import TabStrip from "@/components/dashboard/TabStrip";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import AccountTab from "@/components/dashboard/settings/AccountTab";
import ApiKeysTab from "@/components/dashboard/settings/ApiKeysTab";
import PaymentTab from "@/components/dashboard/settings/PaymentTab";

type AccountTab = "profile" | "tokens" | "billing";

const VALID_TABS: AccountTab[] = ["profile", "tokens", "billing"];

// Account is the surface for everything-about-your-account: profile, auth
// credentials, and billing. Usage is a sibling primary route (/dashboard/usage),
// not a tab here — observability is too important to bury inside settings.
const TABS: { key: AccountTab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "tokens", label: "API Tokens", icon: Key },
  { key: "billing", label: "Billing", icon: Wallet },
];

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { isConnected, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Auth gate
  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.replace("/dashboard/login");
    }
  }, [isConnected, isLoading, router]);

  const rawTab = searchParams.get("tab");

  // Back-compat: old `?tab=account` URL → new `?tab=profile`.
  useEffect(() => {
    if (rawTab === "account") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("tab");
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  }, [rawTab, router, pathname, searchParams]);

  // Back-compat: `?tab=usage` route now lives at /dashboard/usage.
  useEffect(() => {
    if (rawTab === "usage") {
      router.replace("/dashboard/usage");
    }
  }, [rawTab, router]);

  const tab: AccountTab = VALID_TABS.includes(rawTab as AccountTab)
    ? (rawTab as AccountTab)
    : "profile";

  const setTab = useCallback(
    (key: AccountTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "profile") {
        params.delete("tab");
      } else {
        params.set("tab", key);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  if (isLoading || !isConnected) return null;

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-dark">
      <div className="mx-auto w-full max-w-5xl px-5 pt-6 pb-5 lg:px-6 lg:pt-10">
        <DashboardPageHeader
          bordered={false}
          title="Account"
          description="Profile, API tokens, and billing."
        />
      </div>

      {/* Horizontal tab strip */}
      <div className="sticky top-0 z-20 border-b border-hairline bg-dark">
        <div className="mx-auto w-full max-w-5xl px-5 lg:px-6">
          <TabStrip
            tabs={TABS}
            active={tab}
            onChange={setTab}
            layoutId="account-tabs"
            ariaLabel="Account sections"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl flex-1">
          {tab === "profile" && <AccountTab />}
          {tab === "tokens" && <ApiKeysTab />}
          {tab === "billing" && <PaymentTab />}
        </div>
      </div>
    </main>
  );
}
