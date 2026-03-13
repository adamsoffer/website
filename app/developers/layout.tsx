import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers | Livepeer",
  description:
    "Build with Livepeer: documentation, SDKs, and tools for integrating real-time video transcoding, livestreaming, and AI processing.",
  openGraph: {
    title: "Developers | Livepeer",
    description:
      "Build with Livepeer: documentation, SDKs, and tools for integrating real-time video transcoding, livestreaming, and AI processing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developers | Livepeer",
    description:
      "Build with Livepeer: documentation, SDKs, and tools for integrating real-time video transcoding, livestreaming, and AI processing.",
  },
};

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
