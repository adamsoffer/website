import type { Metadata } from "next";
import { AuthProvider } from "@/components/portal/AuthContext";

export const metadata: Metadata = {
  title: "Sign in — Livepeer Developer Portal",
  description:
    "Sign in or create an account to access the Livepeer Developer Portal.",
};

export default function PortalAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark">{children}</div>
    </AuthProvider>
  );
}
