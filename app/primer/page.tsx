import type { Metadata } from "next";
import { fetchProtocolStats } from "@/lib/subgraph";
import PrimerContent from "@/components/primer/PrimerContent";

export const metadata: Metadata = {
  title: "Livepeer: A 10-Minute Primer",
  description:
    "Through storytelling, illustration, and data, the Livepeer Primer explains, at a high level, the problem Livepeer solves, and how it works.",
  openGraph: {
    title: "Livepeer: A 10-Minute Primer",
    description:
      "Through storytelling, illustration, and data, the Livepeer Primer explains, at a high level, the problem Livepeer solves, and how it works.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Livepeer: A 10-Minute Primer",
    description:
      "Through storytelling, illustration, and data, the Livepeer Primer explains, at a high level, the problem Livepeer solves, and how it works.",
  },
};

export default async function PrimerPage() {
  const stats = await fetchProtocolStats();
  return <PrimerContent stats={stats} />;
}
