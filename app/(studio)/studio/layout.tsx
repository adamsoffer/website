import type { Metadata } from "next";
import { AuthProvider } from "@/components/studio/AuthContext";
import StudioHeader from "@/components/studio/StudioHeader";

export const metadata: Metadata = {
  title: "Studio — Livepeer Developer Dashboard",
  description:
    "Browse AI capabilities, manage API keys, and monitor usage on the Livepeer network.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-dark">
        <StudioHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </AuthProvider>
  );
}
