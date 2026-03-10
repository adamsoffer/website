import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A 10-Minute Primer | Livepeer",
  description:
    "Through storytelling, illustration, and data, the Livepeer Primer explains how a specialized GPU network powers real-time video AI — and how it works.",
};

export default function PrimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
