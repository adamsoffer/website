"use client";

import { Suspense, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { User, Key, Wallet, Activity } from "lucide-react";
import { useAuth } from "@/components/studio/AuthContext";
import StudioFooter from "@/components/studio/StudioFooter";
import AccountTab from "@/components/studio/settings/AccountTab";
import ApiKeysTab from "@/components/studio/settings/ApiKeysTab";
import PaymentTab from "@/components/studio/settings/PaymentTab";
import UsageTab from "@/components/studio/settings/UsageTab";

type SettingsTab = "account" | "tokens" | "usage" | "billing";

const VALID_TABS: SettingsTab[] = ["account", "tokens", "usage", "billing"];

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "account", label: "Account", icon: User },
  { key: "tokens", label: "API Tokens", icon: Key },
  { key: "usage", label: "Usage", icon: Activity },
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
      router.replace("/studio/login");
    }
  }, [isConnected, isLoading, router]);

  const rawTab = searchParams.get("tab");
  const tab: SettingsTab = VALID_TABS.includes(rawTab as SettingsTab)
    ? (rawTab as SettingsTab)
    : "account";

  const setTab = useCallback(
    (key: SettingsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "account") {
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
    <main id="main-content" className="flex flex-1 flex-col">
      {/* Mobile tab bar */}
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
              Settings
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

        {/* Content + Footer */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div
            className={`mx-auto w-full flex-1 ${
              tab === "usage" ? "max-w-5xl" : "max-w-3xl"
            }`}
          >
            {/* Page header — shows on every tab */}
            <div className="border-b border-white/[0.06] px-6 pt-10 pb-5">
              <h1 className="text-2xl font-medium tracking-tight text-white">
                Settings
              </h1>
              <p className="mt-1.5 text-sm text-white/50">
                Manage your account, billing, and developer settings.
              </p>
            </div>

            {tab === "account" && <AccountTab />}
            {tab === "tokens" && <ApiKeysTab />}
            {tab === "usage" && <UsageTab />}
            {tab === "billing" && <PaymentTab />}
          </div>
          <StudioFooter />
        </div>
      </div>
    </main>
  );
}
