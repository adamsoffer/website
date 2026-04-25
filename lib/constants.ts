export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Network",
    href: "https://explorer.livepeer.org",
    children: [
      { label: "Ecosystem", href: "/ecosystem" },
      { label: "Livepeer Token", href: "/token" },
      {
        label: "Delegate LPT",
        href: "https://explorer.livepeer.org",
        external: true,
      },
      {
        label: "Provide GPUs",
        href: "https://docs.livepeer.org",
        external: true,
      },
      {
        label: "Roadmap",
        href: "https://roadmap.livepeer.org/roadmap",
        external: true,
      },
    ],
  },
  {
    label: "Resources",
    href: "/brand",
    children: [
      { label: "Primer", href: "/primer" },
      { label: "Blog", href: "/blog" },
      {
        label: "Documentation",
        href: "https://docs.livepeer.org",
        external: true,
      },
      { label: "Brand", href: "/brand" },
    ],
  },
];

// Three-item nav, builder mental model:
//   Home         = your workspace (last runs, pinned capabilities)
//   Capabilities = catalog (models, services, pipelines — was "Explore")
//   Usage        = observability (errors, latency, spend, runs)
// Account (profile, tokens, billing) routes through the avatar dropdown — no
// primary nav item needed. Network protocol view lives at /dashboard/network
// and is reached via the sidebar footer status link.
export const PORTAL_NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "House" as const },
  {
    label: "Capabilities",
    href: "/dashboard/explore",
    icon: "LayoutGrid" as const,
  },
  { label: "Usage", href: "/dashboard/usage", icon: "Activity" as const },
] as const;

export const EXTERNAL_LINKS = {
  docs: "https://docs.livepeer.org",
  explorer: "https://explorer.livepeer.org",
  discord: "https://discord.gg/livepeer",
  twitter: "https://twitter.com/Livepeer",
  github: "https://github.com/livepeer",
  forum: "https://forum.livepeer.org",
  grants: "https://github.com/livepeer/grants",
  studio: "https://livepeer.studio",
  staking: "https://explorer.livepeer.org/",
} as const;
