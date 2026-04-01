import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/constants";

const MOCK_STATUS = {
  healthy: true,
  orchestrators: 47,
  gpus: 312,
  callsPerMin: "2.4k",
};

const devLinks = [
  { label: "Docs", href: "https://docs.livepeer.org", external: true },
  { label: "Changelog", href: "https://docs.livepeer.org/changelog", external: true },
  { label: "Status", href: "/studio/stats", external: false },
  { label: "Discord", href: EXTERNAL_LINKS.discord, external: true },
];

const legalLinks = [
  { label: "Terms", href: "https://livepeer.org/terms", external: true },
  { label: "Privacy", href: "https://livepeer.org/privacy", external: true },
];

export default function StudioFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-dark">
      <div className="divider-gradient absolute top-0 left-0 right-0" />
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Network status with hover tooltip */}
        <div className="group relative">
          <Link
            href="/studio/stats"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-[13px] text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-bright opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-bright" />
            </span>
            {MOCK_STATUS.healthy ? "All services online" : "Service disruption"}
          </Link>

          {/* Hover tooltip — stats summary */}
          <div className="absolute bottom-full left-0 pb-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 z-50">
            <div className="w-52 rounded-lg border border-white/[0.08] bg-dark-card/95 backdrop-blur-xl shadow-xl p-3.5">
              <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-bright opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-bright" />
                </span>
                Network {MOCK_STATUS.healthy ? "Healthy" : "Disrupted"}
              </div>
              <div className="my-2.5 border-t border-white/[0.08]" />
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-white/50">
                  <span>Orchestrators</span>
                  <span className="font-mono text-white/70">{MOCK_STATUS.orchestrators}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>GPUs active</span>
                  <span className="font-mono text-white/70">{MOCK_STATUS.gpus}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Requests/min</span>
                  <span className="font-mono text-white/70">{MOCK_STATUS.callsPerMin}</span>
                </div>
              </div>
              <div className="my-2.5 border-t border-white/[0.08]" />
              <Link
                href="/studio/stats"
                className="text-[10px] text-white/40 transition-colors hover:text-white/60 pointer-events-auto"
              >
                View full stats →
              </Link>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {devLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/40 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] text-white/40 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}

          <span className="h-3 w-px bg-white/10" aria-hidden="true" />

          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-white/20 transition-colors hover:text-white/50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
