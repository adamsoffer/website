import type { Metadata } from "next";
import { AuthProvider } from "@/components/portal/AuthContext";
import PortalHeader from "@/components/portal/PortalHeader";

export const metadata: Metadata = {
  title: "Developer Portal — Livepeer",
  description:
    "Browse AI capabilities, manage API keys, and monitor usage on the Livepeer network.",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-dark">
        <PortalHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </AuthProvider>
  );
}
