import type { Metadata } from "next";
import { AuthProvider } from "@/components/studio/AuthContext";

export const metadata: Metadata = {
  title: "Sign in — Livepeer Studio",
  description: "Sign in or create an account to access Livepeer Studio.",
};

export default function StudioAuthLayout({
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
