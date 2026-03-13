import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livepeer — About The Livepeer Foundation",
  description:
    "The Livepeer Foundation is a neutral, non-profit steward of the Livepeer protocol, coordinating long-term strategy, core development and ecosystem growth.",
  openGraph: {
    title: "Livepeer — About The Livepeer Foundation",
    description:
      "The Livepeer Foundation is a neutral, non-profit steward of the Livepeer protocol, coordinating long-term strategy, core development and ecosystem growth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Livepeer — About The Livepeer Foundation",
    description:
      "The Livepeer Foundation is a neutral, non-profit steward of the Livepeer protocol, coordinating long-term strategy, core development and ecosystem growth.",
  },
};

export default function FoundationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
