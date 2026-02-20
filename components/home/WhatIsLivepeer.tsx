"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";


const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const pipelines = [
  {
    name: "Real-time Object Detection",
    model: "YOLOv8",
    status: "running" as const,
    region: "US East",
    latency: "12ms",
    cost: "$0.003/min",
  },
  {
    name: "Live Stream Upscaling",
    model: "ESRGAN",
    status: "running" as const,
    region: "EU West",
    latency: "45ms",
    cost: "$0.005/min",
  },
  {
    name: "Speech-to-Text",
    model: "Whisper v3",
    status: "running" as const,
    region: "US East",
    latency: "180ms",
    cost: "$0.002/min",
  },
  {
    name: "Scene Classification",
    model: "CLIP",
    status: "queued" as const,
    region: "—",
    latency: "—",
    cost: "—",
  },
  {
    name: "Video Generation",
    model: "Stable Video",
    status: "completed" as const,
    region: "AP South",
    latency: "2.1s",
    cost: "$0.012/min",
  },
  {
    name: "Background Removal",
    model: "SAM 2",
    status: "running" as const,
    region: "US West",
    latency: "28ms",
    cost: "$0.004/min",
  },
  {
    name: "Audio Enhancement",
    model: "Demucs v4",
    status: "completed" as const,
    region: "EU West",
    latency: "95ms",
    cost: "$0.003/min",
  },
];

function StatusIcon({ status }: { status: "running" | "queued" | "completed" }) {
  if (status === "running")
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-white/50">
        <span className="h-[7px] w-[7px] rounded-full border-[1.5px] border-emerald-400/80 bg-emerald-400/20" />
        Running
      </span>
    );
  if (status === "queued")
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-white/50">
        <span className="h-[7px] w-[7px] rounded-full border-[1.5px] border-amber-400/80 bg-amber-400/20" />
        Queued
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-white/50">
      <span className="h-[7px] w-[7px] rounded-full border-[1.5px] border-white/20 bg-white/5" />
      Done
    </span>
  );
}

function ProductUI() {
  return (
    <div className="relative">
      {/* Glow effect behind the frame — neutral, reduced */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-3xl opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      {/* Gradient border wrapper — Linear-style */}
      <div
        className="relative rounded-xl p-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 100%)",
        }}
      >
      {/* App frame */}
      <div className="relative overflow-hidden rounded-xl bg-[#0c0c0c]">
        <div className="flex min-h-[520px]">
          {/* Sidebar */}
          <div className="hidden w-[200px] flex-shrink-0 border-r border-white/[0.06] sm:block">
            {/* Sidebar header — account dropdown */}
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-400 to-pink-400 text-[10px] font-bold text-white">
                LI
              </span>
              <span className="text-[13px] font-medium text-white/70">Livepeer, Inc.</span>
              <svg className="ml-auto h-3 w-3 text-white/25" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5l3 3 3-3" />
              </svg>
            </div>

            <div className="px-2 py-3">
              {/* Main nav */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5 rounded-md bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium text-white/80">
                  {/* Pipelines — stacked layers icon */}
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M8 1.5L1.5 5 8 8.5 14.5 5z" />
                    <path d="M1.5 8L8 11.5 14.5 8" />
                    <path d="M1.5 11L8 14.5 14.5 11" />
                  </svg>
                  Pipelines
                </div>
                <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                  {/* Streams — play/broadcast icon */}
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M5.5 4v8l7-4z" />
                  </svg>
                  Streams
                </div>
                <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                  {/* Assets — film frame icon */}
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="2" y="3" width="12" height="10" rx="1.5" />
                    <path d="M2 6h12M2 10h12M5 3v10M11 3v10" />
                  </svg>
                  Assets
                </div>
                <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                  {/* Models — grid/blocks icon */}
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
                    <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
                    <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
                    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
                  </svg>
                  Models
                </div>
              </div>

              {/* Monitor section */}
              <div className="mt-5">
                <div className="mb-1 px-3 text-[11px] font-medium tracking-wider text-white/20 uppercase">
                  Monitor
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                    {/* Usage — bar chart icon */}
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M3 13V8M7 13V5M11 13V3" strokeLinecap="round" />
                    </svg>
                    Usage
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                    {/* Logs — terminal/console icon */}
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
                      <path d="M5 7l2 1.5L5 10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 10h2" strokeLinecap="round" />
                    </svg>
                    Logs
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] text-white/35">
                    {/* API Keys — key icon */}
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <circle cx="5.5" cy="7" r="3" />
                      <path d="M8 8.5l5 5M11 11.5l2-2" strokeLinecap="round" />
                    </svg>
                    API Keys
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Content header — tab navigation */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-2.5">
              <div className="flex items-center gap-1">
                <span className="rounded-md px-2.5 py-1 text-[13px] font-medium text-white/50">
                  Pipelines
                </span>
                <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[13px] font-medium text-white/80">
                  All pipelines
                </span>
                <span className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] text-white/30">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="6" cy="6" r="5" />
                    <path d="M6 4v4M4 6h4" strokeLinecap="round" />
                  </svg>
                  New view
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-white/50">
                  + Add pipeline
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-2">
              <div className="flex items-center gap-1.5 text-[12px] text-white/30">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
                </svg>
                Filter
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1 text-[12px] text-white/30">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="2" y="2" width="5" height="5" rx="0.5" />
                  <rect x="9" y="2" width="5" height="5" rx="0.5" />
                  <rect x="2" y="9" width="5" height="5" rx="0.5" />
                  <rect x="9" y="9" width="5" height="5" rx="0.5" />
                </svg>
                Display
              </div>
            </div>

            {/* Table */}
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_90px_80px_70px_80px] items-center gap-2 border-b border-white/[0.06] px-5 py-2 text-[11px] font-medium text-white/25">
                <span>Name</span>
                <span>Model</span>
                <span>Status</span>
                <span className="hidden sm:block">Region</span>
                <span className="hidden sm:block">Latency</span>
                <span className="hidden sm:block">Cost</span>
              </div>

              {/* Table rows */}
              {pipelines.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={`grid grid-cols-[1fr_100px_90px_80px_70px_80px] items-center gap-2 px-5 py-2.5 text-[12px] ${
                    i < pipelines.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate text-white/70">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-white/15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <circle cx="8" cy="8" r="6" />
                    </svg>
                    {p.name}
                  </span>
                  <span className="text-[12px] text-white/30">
                    {p.model}
                  </span>
                  <StatusIcon status={p.status} />
                  <span className="hidden text-[12px] text-white/30 sm:block">
                    {p.region}
                  </span>
                  <span className="hidden text-[12px] text-white/30 sm:block">
                    {p.latency}
                  </span>
                  <span className="hidden text-[12px] text-white/30 sm:block">
                    {p.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function WhatIsLivepeer() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="divider-gradient absolute top-0 left-0 right-0" />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
            <SectionHeader
              label="The Network"
              title="Deploy real-time AI video pipelines"
              description="A global GPU network with published SLAs, elastic scaling, and pay-as-you-go pricing. Run AI video pipelines with no vendor lock-in."
              align="split"
            />
          </motion.div>

          {/* Product UI showcase — Linear-style floating frame */}
          <motion.div
            className="relative mt-20"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            <ProductUI />
            {/* Bottom fade to section bg */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #181818)",
              }}
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
