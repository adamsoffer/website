import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/components/dashboard/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
  title: "Developer Dashboard — Livepeer",
  description:
    "Browse AI capabilities, manage API keys, and monitor usage on the Livepeer network.",
};

// Dashboard runs on Geist (Vercel's open-source font) instead of Favorit Pro —
// the dashboard is a *tool*, the marketing site is the brand. We attach the Geist
// CSS variables to this subtree and override `--font-sans` / `--font-mono` so
// every Tailwind `font-sans` / `font-mono` consumer below this point picks Geist.
const geistOverride = {
  "--font-sans": "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  "--font-mono": "var(--font-geist-mono), ui-monospace, monospace",
} as CSSProperties;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Linear's "floating panel" pattern: a darker outer bg fills the viewport, the
  // sidebar sits flush against the left edge on the same plane, and the main
  // content area floats above as a slightly lighter rounded panel with an 8px
  // gutter on the top/right/bottom. Measured directly from linear.app:
  //   outer bg: lch(1.82) ≈ #070707 (we use bg-shell #0e0e0e)
  //   panel bg: lch(4.52) ≈ #101010 (we use bg-dark #121212)
  //   panel: 12px radius, 0.5px border, 8px margin (top/right/bottom)
  return (
    <AuthProvider>
      <div
        className={`flex min-h-screen flex-col bg-shell font-sans md:h-screen md:min-h-0 md:flex-row md:overflow-hidden ${GeistSans.variable} ${GeistMono.variable}`}
        style={geistOverride}
      >
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-dark md:my-2 md:mr-2 md:rounded-xl md:overflow-y-auto">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
