import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Livepeer",
  description:
    "Join the Livepeer community: governance, events, ecosystem projects, and social channels for developers, operators, and token holders.",
  openGraph: {
    title: "Community | Livepeer",
    description:
      "Join the Livepeer community: governance, events, ecosystem projects, and social channels for developers, operators, and token holders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | Livepeer",
    description:
      "Join the Livepeer community: governance, events, ecosystem projects, and social channels for developers, operators, and token holders.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
