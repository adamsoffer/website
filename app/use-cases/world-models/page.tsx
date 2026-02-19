"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* ── Stars data for hero ── */
const stars: [number, number, number, number][] = [
  [8, 6, 1, 0], [15, 18, 1, 0.6], [22, 10, 1, 1.2], [30, 22, 1, 0.3],
  [38, 5, 1, 1.8], [45, 15, 1, 0.9], [52, 8, 1, 2.1], [58, 20, 1, 0.4],
  [65, 12, 1, 1.5], [72, 6, 1, 0.7], [78, 18, 1, 2.4], [84, 9, 1, 1.1],
  [90, 14, 1, 0.2], [12, 25, 1, 1.7], [35, 28, 1, 2.0], [55, 24, 1, 0.5],
  [68, 26, 1, 1.3], [82, 22, 1, 1.9], [26, 3, 1, 2.3], [48, 2, 1, 0.8],
  [62, 28, 1, 1.6], [75, 3, 1, 2.2], [18, 30, 1, 0.1], [42, 30, 1, 1.4],
];

/* ── Expanded hero visual ── */
function HeroVisual() {
  const frameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let count = 1847;
    let raf: number;
    let last = 0;

    const tick = (time: number) => {
      if (time - last > 16) {
        count++;
        if (frameRef.current) {
          frameRef.current.textContent = `Frame ${count.toLocaleString()} \u00b7 12ms`;
        }
        last = time;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050908]">
      {/* Deep sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040706] via-[#050908] to-[#0a0a0a]" />

      {/* Stars */}
      {stars.map(([x, y, size, delay], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/50"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `twinkle 4s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Terrain layers revealed L to R */}
      <div
        className="absolute bottom-0 left-0 h-[55%] w-full"
        style={{
          clipPath: "inset(0 102% 0 0)",
          animation: "revealTerrain 6s linear forwards",
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Distant peaks */}
          <path
            d="M0 160 L60 100 L120 130 L200 70 L280 110 L340 55 L400 90 L460 60 L540 95 L600 50 L680 85 L740 65 L800 80 V240 H0Z"
            fill="rgba(24,121,78,0.10)"
          />
          {/* Far mountains */}
          <path
            d="M0 175 L80 120 L160 145 L260 95 L340 125 L420 85 L500 115 L580 90 L660 120 L740 100 L800 110 V240 H0Z"
            fill="rgba(24,121,78,0.15)"
          />
          {/* Mid hills */}
          <path
            d="M0 195 L100 155 L200 172 L310 140 L400 160 L500 142 L600 165 L700 150 L800 158 V240 H0Z"
            fill="rgba(24,121,78,0.20)"
          />
          {/* Near hills */}
          <path
            d="M0 210 L120 185 L240 198 L360 178 L480 192 L600 182 L720 195 L800 188 V240 H0Z"
            fill="rgba(24,121,78,0.28)"
          />
          {/* Foreground */}
          <path
            d="M0 225 L100 210 L200 218 L300 208 L400 215 L500 205 L600 212 L700 208 L800 212 V240 H0Z"
            fill="rgba(24,121,78,0.38)"
          />
          {/* Grid lines */}
          {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="240"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}
          {[0, 48, 96, 144, 192, 240].map((y) => (
            <line
              key={`h${y}`}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Generation cursor */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[2px]"
        style={{
          left: 0,
          background:
            "linear-gradient(to bottom, transparent, rgba(64,191,134,0.5) 30%, rgba(64,191,134,0.8) 50%, rgba(64,191,134,0.5) 70%, transparent)",
          boxShadow:
            "0 0 8px rgba(64,191,134,0.4), 0 0 20px rgba(64,191,134,0.2)",
          animation: "generateSweep 6s linear forwards",
        }}
      />

      {/* Horizon glow */}
      <div
        className="absolute bottom-[45%] left-0 right-0 h-[60px]"
        style={{
          background:
            "linear-gradient(to top, transparent, rgba(24,121,78,0.08), transparent)",
        }}
      />

      {/* HUD */}
      <div
        className="absolute left-4 top-4 font-mono text-[10px] text-emerald-400/70"
        style={{ animation: "breathe 3s ease-in-out infinite" }}
      >
        GENERATING
      </div>
      <div className="absolute right-4 top-4 font-mono text-[10px] text-white/35">
        60 FPS
      </div>
      <span
        ref={frameRef}
        className="absolute bottom-4 left-4 font-mono text-[10px] text-white/35"
      >
        Frame 1,847 &middot; 12ms
      </span>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/25">
        WORLD MODEL v0.3 &middot; 1920&times;1080
      </div>
    </div>
  );
}

/* ── Reference architecture diagram ── */
function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 900 220"
      className="h-auto w-full"
      fill="none"
      role="img"
      aria-label="Reference architecture: Inputs flow into the Livepeer Network for AI inference, encoding, and streaming delivery to Outputs"
    >
      {/* Node 1: Inputs */}
      <rect
        x="20"
        y="60"
        width="140"
        height="100"
        rx="8"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />
      <text
        x="90"
        y="88"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        fill="rgba(255,255,255,0.6)"
      >
        Inputs
      </text>
      <text
        x="90"
        y="108"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        Camera, Actions, Sensors
      </text>
      <text
        x="90"
        y="122"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        Text prompts, Game state
      </text>
      <text
        x="90"
        y="136"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        Audio, Motion capture
      </text>

      {/* Livepeer Network: outer container */}
      <rect
        x="230"
        y="20"
        width="440"
        height="180"
        rx="10"
        fill="rgba(24,121,78,0.04)"
        stroke="rgba(24,121,78,0.20)"
        strokeWidth="1"
        strokeDasharray="6 3"
      />
      <text
        x="450"
        y="42"
        textAnchor="middle"
        className="font-mono"
        fontSize="10"
        fill="rgba(64,191,134,0.5)"
      >
        LIVEPEER NETWORK
      </text>

      {/* Inner node: AI Inference */}
      <rect
        x="260"
        y="60"
        width="170"
        height="100"
        rx="8"
        fill="rgba(24,121,78,0.12)"
        stroke="rgba(24,121,78,0.4)"
        strokeWidth="1"
      />
      <text
        x="345"
        y="88"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        fill="rgba(64,191,134,0.8)"
      >
        AI Inference
      </text>
      <text
        x="345"
        y="108"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        World model execution
      </text>
      <text
        x="345"
        y="122"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        Frame generation
      </text>
      <text
        x="345"
        y="136"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        Elastic GPU orchestration
      </text>

      {/* Inner node: Streaming Delivery */}
      <rect
        x="470"
        y="60"
        width="170"
        height="100"
        rx="8"
        fill="rgba(24,121,78,0.08)"
        stroke="rgba(24,121,78,0.25)"
        strokeWidth="1"
      />
      <text
        x="555"
        y="88"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        fill="rgba(64,191,134,0.7)"
      >
        Streaming Delivery
      </text>
      <text
        x="555"
        y="108"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        Encoding + transcoding
      </text>
      <text
        x="555"
        y="122"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        Low-latency delivery
      </text>
      <text
        x="555"
        y="136"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(64,191,134,0.35)"
      >
        Global distribution
      </text>

      {/* Node 3: Outputs */}
      <rect
        x="740"
        y="60"
        width="140"
        height="100"
        rx="8"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />
      <text
        x="810"
        y="88"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        fill="rgba(255,255,255,0.6)"
      >
        Outputs
      </text>
      <text
        x="810"
        y="108"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        WebRTC, HLS streams
      </text>
      <text
        x="810"
        y="116"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        LED walls, Broadcast
      </text>
      <text
        x="810"
        y="136"
        textAnchor="middle"
        fontSize="8"
        fill="rgba(255,255,255,0.25)"
      >
        Interactive displays
      </text>

      {/* Connector 1: Inputs -> AI Inference */}
      <line
        x1="160"
        y1="110"
        x2="260"
        y2="110"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{ animation: "dashFlow 1.5s linear infinite" }}
      />
      <circle r="3" cy="110" fill="#40bf86" opacity="0">
        <animate
          attributeName="cx"
          from="165"
          to="255"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0.8;0"
          keyTimes="0;0.15;0.85;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Connector 2: AI Inference -> Streaming Delivery */}
      <line
        x1="430"
        y1="110"
        x2="470"
        y2="110"
        stroke="rgba(24,121,78,0.25)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{ animation: "dashFlow 1.5s linear infinite" }}
      />
      <circle r="3" cy="110" fill="#40bf86" opacity="0">
        <animate
          attributeName="cx"
          from="432"
          to="468"
          dur="1.2s"
          begin="0.3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0.8;0"
          keyTimes="0;0.15;0.85;1"
          dur="1.2s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Connector 3: Streaming Delivery -> Outputs */}
      <line
        x1="640"
        y1="110"
        x2="740"
        y2="110"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{ animation: "dashFlow 1.5s linear infinite" }}
      />
      <circle r="3" cy="110" fill="#40bf86" opacity="0">
        <animate
          attributeName="cx"
          from="645"
          to="735"
          dur="2s"
          begin="0.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0.8;0"
          keyTimes="0;0.15;0.85;1"
          dur="2s"
          begin="0.6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Arrow heads */}
      <polygon points="256,106 256,114 264,110" fill="rgba(255,255,255,0.15)" />
      <polygon points="466,106 466,114 474,110" fill="rgba(24,121,78,0.4)" />
      <polygon points="736,106 736,114 744,110" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

/* ── Data ── */

const infraChallenges = [
  {
    title: "Sustained GPU inference",
    description:
      "World models generate 30 to 60 frames per second, indefinitely. You need GPUs that stay warm and available for the duration of every session.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1210] to-[#070b0a]" />
        {/* Timeline showing infinite session duration */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet" fill="none">
          {/* Time axis */}
          <line x1="30" y1="95" x2="390" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          {/* Time labels */}
          <text x="30" y="110" fontSize="7" fill="rgba(255,255,255,0.2)" className="font-mono">0s</text>
          <text x="120" y="110" fontSize="7" fill="rgba(255,255,255,0.2)" className="font-mono">10m</text>
          <text x="210" y="110" fontSize="7" fill="rgba(255,255,255,0.2)" className="font-mono">1hr</text>
          <text x="300" y="110" fontSize="7" fill="rgba(255,255,255,0.2)" className="font-mono">8hr</text>
          <text x="370" y="110" fontSize="7" fill="rgba(255,255,255,0.15)" className="font-mono">...</text>
          {/* GPU utilization area — stays high the entire time */}
          <path
            d="M30 85 L30 28 C60 25, 80 32, 120 27 C160 22, 200 30, 240 26 C280 22, 320 28, 360 25 L370 24 L370 85 Z"
            fill="rgba(24,121,78,0.15)"
          />
          <path
            d="M30 28 C60 25, 80 32, 120 27 C160 22, 200 30, 240 26 C280 22, 320 28, 360 25 L370 24"
            stroke="rgba(64,191,134,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* 90%+ label */}
          <text x="36" y="24" fontSize="8" fill="rgba(64,191,134,0.5)" className="font-mono">GPU 94%</text>
          {/* Tick marks on timeline */}
          {[30, 120, 210, 300].map((x) => (
            <line key={x} x1={x} y1="92" x2={x} y2="98" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          ))}
          {/* Arrow at end indicating continuation */}
          <polygon points="385,95 378,91 378,99" fill="rgba(255,255,255,0.12)" />
        </svg>
      </div>
    ),
  },
  {
    title: "Sub-100ms round trips",
    description:
      "Interactive generation requires tight feedback loops. Batch inference queues and cold starts make the experience unusable.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1210] to-[#070b0a]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet" fill="none">
          {/* User input side */}
          <rect x="20" y="25" width="80" height="70" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <text x="60" y="48" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" className="font-mono">User Input</text>
          {/* Action icons — keyboard/mouse */}
          <rect x="35" y="55" width="18" height="12" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <rect x="58" y="55" width="18" height="12" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <circle cx="60" cy="80" r="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

          {/* Fast loop arrow — tight */}
          <path
            d="M110 60 C160 20, 230 20, 290 60"
            stroke="rgba(64,191,134,0.5)"
            strokeWidth="1"
            strokeDasharray="4 3"
            fill="none"
            style={{ animation: "dashFlow 1.5s linear infinite" }}
          />
          <polygon points="287,55 293,60 287,65" fill="rgba(64,191,134,0.5)" />
          <text x="200" y="30" textAnchor="middle" fontSize="9" fill="rgba(64,191,134,0.6)" className="font-mono">&lt;100ms</text>
          {/* Return path */}
          <path
            d="M290 65 C230 105, 160 105, 110 65"
            stroke="rgba(64,191,134,0.2)"
            strokeWidth="0.5"
            strokeDasharray="4 3"
            fill="none"
          />

          {/* Generated output side */}
          <rect x="300" y="25" width="80" height="70" rx="6" fill="rgba(24,121,78,0.06)" stroke="rgba(24,121,78,0.2)" strokeWidth="0.5" />
          <text x="340" y="48" textAnchor="middle" fontSize="8" fill="rgba(64,191,134,0.5)" className="font-mono">New Frame</text>
          {/* Mini terrain preview */}
          <path d="M310 85 L325 65 L340 75 L355 62 L370 72 L370 85 Z" fill="rgba(24,121,78,0.2)" />
          <path d="M310 85 L330 78 L350 82 L370 76 L370 85 Z" fill="rgba(24,121,78,0.3)" />
        </svg>
      </div>
    ),
  },
  {
    title: "Video encoding on every frame",
    description:
      "The output is video, not images. Every generated frame must be encoded and packaged for real-time delivery as it is produced.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1210] to-[#070b0a]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet" fill="none">
          {/* Raw frames (left side) — scattered individual images */}
          {[
            { x: 20, y: 15, w: 36, h: 26 },
            { x: 62, y: 22, w: 36, h: 26 },
            { x: 20, y: 48, w: 36, h: 26 },
            { x: 62, y: 55, w: 36, h: 26 },
            { x: 20, y: 81, w: 36, h: 26 },
            { x: 62, y: 88, w: 36, h: 26 },
          ].map((f, i) => (
            <g key={i}>
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              {/* Mini terrain inside each frame */}
              <path d={`M${f.x + 3} ${f.y + f.h - 3} L${f.x + f.w * 0.3} ${f.y + f.h * 0.4} L${f.x + f.w * 0.6} ${f.y + f.h * 0.6} L${f.x + f.w - 3} ${f.y + f.h * 0.35} L${f.x + f.w - 3} ${f.y + f.h - 3} Z`} fill={`rgba(24,121,78,${0.1 + i * 0.02})`} />
              <text x={f.x + 3} y={f.y + 8} fontSize="5" fill="rgba(255,255,255,0.15)" className="font-mono">f{1847 + i}</text>
            </g>
          ))}

          {/* Encode arrow */}
          <line x1="115" y1="60" x2="175" y2="60" stroke="rgba(64,191,134,0.3)" strokeWidth="1" strokeDasharray="4 3" style={{ animation: "dashFlow 1.5s linear infinite" }} />
          <polygon points="172,56 180,60 172,64" fill="rgba(64,191,134,0.4)" />
          <text x="147" y="52" textAnchor="middle" fontSize="7" fill="rgba(64,191,134,0.4)" className="font-mono">encode</text>

          {/* Video stream (right side) — single continuous player */}
          <rect x="190" y="18" width="190" height="84" rx="6" fill="rgba(24,121,78,0.06)" stroke="rgba(24,121,78,0.2)" strokeWidth="0.5" />
          {/* Video player chrome */}
          <rect x="198" y="26" width="174" height="56" rx="3" fill="rgba(24,121,78,0.08)" />
          {/* Terrain in player */}
          <path d="M198 72 L230 50 L260 60 L300 42 L340 55 L372 48 L372 82 L198 82 Z" fill="rgba(24,121,78,0.2)" />
          <path d="M198 78 L240 68 L280 74 L330 64 L372 70 L372 82 L198 82 Z" fill="rgba(24,121,78,0.3)" />
          {/* Play indicator */}
          <polygon points="206,30 206,38 212,34" fill="rgba(255,255,255,0.15)" />
          <text x="218" y="36" fontSize="6" fill="rgba(255,255,255,0.2)" className="font-mono">LIVE</text>
          {/* Progress bar */}
          <rect x="198" y="86" width="174" height="3" rx="1" fill="rgba(255,255,255,0.04)" />
          <rect x="198" y="86" width="120" height="3" rx="1" fill="rgba(24,121,78,0.4)" />
          {/* Bitrate label */}
          <text x="372" y="100" textAnchor="end" fontSize="6" fill="rgba(64,191,134,0.35)" className="font-mono">H.264 4.2Mbps</text>
        </svg>
      </div>
    ),
  },
  {
    title: "Elastic concurrency",
    description:
      "A prototype needs one GPU. A live event with thousands of viewers needs dynamic orchestration across many, without manual provisioning.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1210] to-[#070b0a]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet" fill="none">
          {/* Left: single session */}
          <rect x="15" y="20" width="80" height="80" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <text x="55" y="38" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" className="font-mono">Prototype</text>
          {/* Single GPU */}
          <rect x="35" y="50" width="40" height="22" rx="4" fill="rgba(24,121,78,0.3)" stroke="rgba(64,191,134,0.4)" strokeWidth="0.5" />
          <text x="55" y="64" textAnchor="middle" fontSize="7" fill="rgba(64,191,134,0.7)" className="font-mono">1 GPU</text>
          {/* Single user */}
          <circle cx="55" cy="84" r="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

          {/* Arrow */}
          <line x1="110" y1="60" x2="155" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="4 3" />
          <polygon points="152,56 160,60 152,64" fill="rgba(255,255,255,0.12)" />

          {/* Right: production scale */}
          <rect x="170" y="8" width="215" height="104" rx="6" fill="rgba(24,121,78,0.03)" stroke="rgba(24,121,78,0.12)" strokeWidth="0.5" />
          <text x="278" y="24" textAnchor="middle" fontSize="7" fill="rgba(64,191,134,0.4)" className="font-mono">Production</text>
          {/* GPU grid — many nodes */}
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 7 }).map((_, col) => (
              <rect
                key={`gpu${row}${col}`}
                x={185 + col * 27}
                y={32 + row * 18}
                width={22}
                height={13}
                rx={2.5}
                fill={`rgba(24,121,78,${0.15 + ((row * 7 + col) % 5) * 0.04})`}
                stroke="rgba(64,191,134,0.2)"
                strokeWidth="0.3"
                style={{ animation: "breathe 3s ease-in-out infinite", animationDelay: `${(row * 7 + col) * 0.08}s` }}
              />
            ))
          )}
          {/* User crowd at bottom */}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={`u${i}`}
              cx={190 + i * 16}
              cy="100"
              r="3"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.3"
            />
          ))}
          <text x="278" y="100" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.15)" className="font-mono">10,000+ sessions</text>
        </svg>
      </div>
    ),
  },
];

const capabilityMapping = [
  {
    capability: "Distributed GPU orchestration",
    detail:
      "Warm GPUs across global regions with sub-second cold start. Sessions are routed to the nearest available node.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="7" y1="7" x2="10" y2="10" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <line x1="17" y1="7" x2="14" y2="10" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <line x1="7" y1="17" x2="10" y2="14" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <line x1="17" y1="17" x2="14" y2="14" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      </svg>
    ),
  },
  {
    capability: "Continuous video pipeline",
    detail:
      "Built for sustained frame output, not batch request/response. Inference, encoding, and delivery run as a single pipeline.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M2 12h4l3-8 4 16 3-8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    capability: "Elastic scaling",
    detail:
      "Scale from 1 to 10,000+ concurrent sessions. The network provisions GPU capacity automatically as demand changes.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V14M8 20V10M12 20V6M16 20V10M20 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    capability: "Real-time video delivery",
    detail:
      "Native WebRTC and low-latency HLS support. Generated frames are encoded and delivered as production-ready video streams.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    capability: "Open model access",
    detail:
      "Run open-source world models or deploy your own via containers. No vendor lock-in on the model layer.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    capability: "Performance monitoring",
    detail:
      "Built-in observability for frame rate, latency, and GPU utilization across every session.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 14l3-3 2 2 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const applications = [
  {
    title: "Virtual Production",
    description:
      "Real-time AI environments that respond to camera movement, enabling previsualization without pre-built 3D assets.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d0a] to-[#0a0a0a]" />
        {/* Mini camera viewfinder */}
        <div className="absolute inset-3 rounded border border-white/[0.08]">
          <div className="absolute left-1 top-1 h-3 w-3 border-t border-l border-white/20" />
          <div className="absolute right-1 top-1 h-3 w-3 border-t border-r border-white/20" />
          <div className="absolute left-1 bottom-1 h-3 w-3 border-b border-l border-white/20" />
          <div className="absolute right-1 bottom-1 h-3 w-3 border-b border-r border-white/20" />
          {/* Crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-px w-4 bg-green/40" />
            <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-green/40" />
          </div>
          {/* Mini terrain */}
          <svg className="absolute bottom-0 left-0 right-0 h-[40%]" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
            <path d="M0 20 L20 10 L40 18 L60 8 L80 16 L100 12 V30 H0Z" fill="rgba(24,121,78,0.2)" />
            <path d="M0 25 L30 18 L60 22 L100 17 V30 H0Z" fill="rgba(24,121,78,0.3)" />
          </svg>
        </div>
        <div className="absolute left-3 bottom-1.5 font-mono text-[7px] text-white/25">REC</div>
        <div className="absolute right-3 bottom-1.5 font-mono text-[7px] text-emerald-400/40" style={{ animation: "breathe 3s ease-in-out infinite" }}>LIVE</div>
      </div>
    ),
  },
  {
    title: "Immersive Installations",
    description:
      "AI visuals reacting to audience input, motion capture, or environmental sensors at live events and exhibitions.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a]" />
        {/* Radial rings representing sensors */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" fill="none">
          {[12, 22, 32].map((r, i) => (
            <circle
              key={i}
              cx="50"
              cy="30"
              r={r}
              stroke="rgba(24,121,78,0.15)"
              strokeWidth="0.5"
              style={{ animation: "breathe 4s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}
            />
          ))}
          {/* Sensor dots */}
          {[[22, 14], [78, 14], [14, 46], [86, 46], [50, 6]].map(([x, y], i) => (
            <circle
              key={`s${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="rgba(64,191,134,0.5)"
              style={{ animation: "breathe 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
            />
          ))}
          {/* Lines from sensors to center */}
          {[[22, 14], [78, 14], [14, 46], [86, 46], [50, 6]].map(([x, y], i) => (
            <line
              key={`sl${i}`}
              x1={x}
              y1={y}
              x2="50"
              y2="30"
              stroke="rgba(64,191,134,0.1)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          ))}
          <circle cx="50" cy="30" r="3" fill="rgba(24,121,78,0.6)" />
        </svg>
      </div>
    ),
  },
  {
    title: "Interactive Streaming",
    description:
      "Live streams transformed by AI in real time, with viewers influencing the generated environment through direct participation.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] to-[#0a0a0a]" />
        {/* Mini stream player */}
        <div className="absolute inset-3 rounded border border-white/[0.08] bg-[#131313]">
          <div className="absolute left-2 top-1.5 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-red-500" style={{ animation: "breathe 2s ease-in-out infinite" }} />
            <span className="font-mono text-[6px] text-red-400/70">LIVE</span>
          </div>
          <div className="absolute right-2 top-1.5 font-mono text-[6px] text-white/25">847 viewers</div>
          {/* Chat-like dots representing viewer input */}
          <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-0.5">
            {[0.4, 0.6, 0.3, 0.5].map((w, i) => (
              <div
                key={i}
                className="h-[3px] rounded-full bg-white/[0.06]"
                style={{ width: `${w * 100}%`, animation: "breathe 5s ease-in-out infinite", animationDelay: `${i * 0.7}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Game Prototyping",
    description:
      "Frame-by-frame world simulation for early-stage game design and environment prototyping without a traditional rendering engine.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#070b0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d0a] to-[#0a0a0a]" />
        {/* Isometric grid suggesting a game level */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" fill="none">
          {/* Grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`g${i}`}
              x1={10 + i * 12}
              y1="10"
              x2={10 + i * 12}
              y2="55"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="10"
              y1={15 + i * 10}
              x2="94"
              y2={15 + i * 10}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          ))}
          {/* Blocks representing generated terrain */}
          {[
            [22, 25, 12, 20],
            [46, 20, 12, 25],
            [58, 30, 12, 15],
            [70, 22, 12, 23],
          ].map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={1}
              fill={`rgba(24,121,78,${0.15 + i * 0.05})`}
              stroke="rgba(24,121,78,0.25)"
              strokeWidth="0.5"
              style={{ animation: "breathe 4s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
        <div className="absolute left-3 bottom-1.5 font-mono text-[7px] text-white/25">Level gen: frame 42</div>
      </div>
    ),
  },
  {
    title: "Robotics and Agent Training",
    description:
      "Simulated environments generated on demand for training autonomous agents, robots, and reinforcement learning systems.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" fill="none">
          {/* Path that agent follows */}
          <path
            d="M15 45 L25 35 L40 38 L55 25 L65 30 L80 15"
            stroke="rgba(64,191,134,0.25)"
            strokeWidth="1"
            strokeDasharray="3 3"
            style={{ animation: "dashFlow 1.5s linear infinite" }}
          />
          {/* Waypoints */}
          {[[15, 45], [25, 35], [40, 38], [55, 25], [65, 30], [80, 15]].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="rgba(64,191,134,0.4)"
              stroke="rgba(64,191,134,0.6)"
              strokeWidth="0.5"
            />
          ))}
          {/* Agent dot traveling path */}
          <circle r="3" fill="#40bf86">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M15 45 L25 35 L40 38 L55 25 L65 30 L80 15"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Sim environment boundary */}
          <rect x="8" y="8" width="84" height="44" rx="3" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
        <div className="absolute right-3 bottom-1.5 font-mono text-[7px] text-emerald-400/40">Episode 2,847</div>
      </div>
    ),
  },
  {
    title: "Education and Training",
    description:
      "Scenario-based interactive environments for medical training, hazard simulation, and educational visualization.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-lg bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a]" />
        {/* Layered panels suggesting different scenarios */}
        <div className="absolute inset-3 flex gap-1">
          {[
            { from: "from-emerald-900/30", to: "to-cyan-900/20", label: "Scenario A" },
            { from: "from-cyan-900/20", to: "to-emerald-900/30", label: "Scenario B" },
            { from: "from-emerald-900/40", to: "to-amber-900/15", label: "Scenario C" },
          ].map((panel, i) => (
            <div
              key={i}
              className={`relative flex-1 overflow-hidden rounded border border-white/[0.06] bg-gradient-to-b ${panel.from} ${panel.to}`}
              style={{ animation: "breathe 5s ease-in-out infinite", animationDelay: `${i * 0.6}s` }}
            >
              <div className="absolute bottom-1 left-1 font-mono text-[5px] text-white/25">{panel.label}</div>
            </div>
          ))}
        </div>
        <div className="absolute left-3 bottom-1.5 font-mono text-[7px] text-white/25">3 active sessions</div>
      </div>
    ),
  },
];

/* ── Page ── */

export default function WorldModelsPage() {
  return (
    <>
      {/* ─── A: Hero ─── */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <HeroVisual />

        {/* Center overlay for text readability */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 48%, rgba(4,6,5,0.85) 0%, rgba(4,6,5,0.5) 60%, transparent 100%)",
          }}
        />

        <Container className="relative z-10 py-24 lg:py-32">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="font-mono text-xs uppercase tracking-wider text-green/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Use Case
            </motion.p>

            <motion.h1
              className="mt-4 text-4xl font-bold leading-[0.93] tracking-tight sm:text-5xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              World Models,{" "}
              <span className="text-gradient">Powered by Livepeer</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg text-white/50"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Real-time world models need GPU infrastructure that can sustain
              continuous inference, encode every frame, and deliver it as
              video. Livepeer provides that layer.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button href={EXTERNAL_LINKS.docs} variant="primary">
                Start Building <span aria-hidden="true">&rarr;</span>
              </Button>
              <Button
                href="https://daydream.live"
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Daydream
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: "linear-gradient(to bottom, transparent, #181818)",
          }}
        />
      </section>

      {/* ─── B: The Infrastructure Challenge ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <SectionHeader
                label="The Problem"
                title="World models break standard infrastructure"
                description="Most GPU infrastructure is built for batch inference: submit a request, wait for a result. World models are live systems that generate frames continuously and respond to input in real time. That requires a fundamentally different infrastructure layer."
                align="left"
              />
            </motion.div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {infraChallenges.map((challenge) => (
                <motion.div
                  key={challenge.title}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1a1a1a]"
                >
                  <div className="h-[140px] p-2 pb-0">
                    {challenge.visual}
                  </div>
                  <div className="px-7 py-5">
                    <h3 className="text-base font-medium text-white/90">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                      {challenge.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ─── D: Where Livepeer Fits ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        {/* Subtle grid background */}
        <div className="tile-bg pointer-events-none absolute inset-0 opacity-40" />
        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <SectionHeader
                label="Livepeer Network"
                title="What Livepeer provides"
                description="An open, permissionless GPU network designed for real-time AI video workloads. Inference, encoding, and delivery in one integrated pipeline."
              />
            </motion.div>

            {/* Capability list */}
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityMapping.map((row, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#1a1a1a] p-7 pl-10"
                >
                  {/* Green accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green/60 via-green/30 to-transparent" />
                  <div className="mb-3 text-green/70">{row.icon}</div>
                  <h3 className="text-base font-medium text-white/90">
                    {row.capability}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                    {row.detail}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Callout */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="mt-6 rounded-xl border border-green/20 bg-green/[0.04] p-6"
            >
              <p className="text-[13px] leading-relaxed text-white/60">
                <span className="font-medium text-white/80">Daydream</span>{" "}
                provides a real-time AI video gateway for world model
                experiences. The{" "}
                <span className="font-medium text-white/80">Builder API</span>{" "}
                enables direct access to the inference pipeline for custom
                integrations and open-source model experimentation.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ─── E: Example Applications ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <SectionHeader
                label="Applications"
                title="What you can build"
                description="World models enable a range of interactive, visual applications across industries."
              />
            </motion.div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <motion.div
                  key={app.title}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1a1a1a] transition-colors duration-200 hover:border-white/[0.12]"
                >
                  <div className="h-[120px] p-2 pb-0">
                    {app.visual}
                  </div>
                  <div className="px-5 py-5">
                    <h3 className="text-base font-medium text-white/90">
                      {app.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                      {app.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ─── F: Reference Architecture ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
              <SectionHeader
                label="Architecture"
                title="Reference architecture"
                description="A typical world model deployment on Livepeer follows this flow, from input signals through inference to delivered video."
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="-mx-4 mt-14 overflow-x-auto px-4 sm:mx-0 sm:px-0"
            >
              <div className="min-w-[640px]">
                <ArchitectureDiagram />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ─── G: Final CTA ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        {/* Faint terrain echo */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[40%] w-full"
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 80 L60 55 L120 70 L200 40 L280 60 L340 30 L400 50 L460 35 L540 55 L600 28 L680 48 L740 38 L800 45 V120 H0Z"
            fill="rgba(24,121,78,0.04)"
          />
          <path
            d="M0 95 L80 70 L160 82 L260 58 L340 72 L420 52 L500 68 L580 55 L660 72 L740 62 L800 66 V120 H0Z"
            fill="rgba(24,121,78,0.06)"
          />
        </svg>
        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-wider text-white/30">
                Get Started
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Build world model experiences on Livepeer
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/50 text-pretty">
                The infrastructure layer for real-time AI video is ready. Start
                building interactive, generated environments with
                production-grade GPU orchestration and streaming delivery.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href={EXTERNAL_LINKS.docs} variant="primary">
                  View the Docs <span aria-hidden="true">&rarr;</span>
                </Button>
                <Button href={EXTERNAL_LINKS.discord} variant="secondary">
                  Talk to the Team
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
