"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dynamic inflation meter SVG — replaces the static inflation.svg.
 *
 * Keeps the original hand-drawn gauge graphic (arcs, ticks, decorative circles)
 * but renders participation rate & inflation text as live <text> elements and
 * rotates the needle to match the current participation rate.
 *
 * The needle animates from 0% to the target participation rate when scrolled
 * into view.
 */
type InflationMeterProps = {
  participationRate: string; // e.g. "52.82%"
  inflationRate: string; // e.g. "0.0628%"
};

export default function InflationMeter({
  participationRate,
  inflationRate,
}: InflationMeterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  // Animate needle when component scrolls into view
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so the user sees the animation start
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parse participation % to rotate the needle.
  // The original SVG needle was drawn at the 44.46 % position.
  // Gauge goes left (0 %) → right (100 %) as a semicircle.
  // Positive rotation in SVG = clockwise = toward 100 % (right).
  const rate = parseFloat(participationRate) / 100; // 0–1
  const cx = 199.749;
  const cy = 169.677;

  // Rotation relative to the needle's original drawn position (44.46 %)
  const targetRotation = (rate - 0.4446) * 180; // degrees from original
  const startRotation = (0 - 0.4446) * 180; // 0 % position = –80°
  const currentRotation = animated ? targetRotation : startRotation;

  return (
    <svg
      ref={svgRef}
      width="400"
      height="401"
      viewBox="0 0 400 401"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <rect y="0.6875" width="400" height="400" rx="200" fill="#97F2EF" />

      <g clipPath="url(#clip0_meter)">
        {/* ── Gradient arc ── */}
        <mask
          id="mask0_meter"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="127"
          y="101"
          width="146"
          height="74"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M127.465 173.907L151.159 173.814C151.159 146.541 172.732 125.16 200.004 125.16C227.276 125.16 248.277 146.732 248.277 174.005L271.845 173.434H272.225C272.225 133.457 239.826 101.523 199.85 101.523C159.872 101.523 127.465 133.931 127.465 173.907Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_meter)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M127.465 173.907L151.159 173.814C151.159 146.541 172.732 125.16 200.004 125.16C227.276 125.16 248.277 146.732 248.277 174.005L271.845 173.434H272.225C272.225 133.457 239.826 101.523 199.85 101.523C159.872 101.523 127.465 133.931 127.465 173.907Z"
            fill="url(#paint0_meter)"
          />
        </g>

        {/* ── Arc outline ── */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M200.004 123.66C227.406 123.66 248.981 144.975 249.756 172.469L270.71 171.962C270.338 153.612 263.007 136.472 249.973 123.553C236.616 110.314 218.816 103.023 199.85 103.023C161.267 103.023 129.785 134.009 128.981 172.403L149.681 172.32C150.447 144.913 172.275 123.66 200.004 123.66ZM248.277 175.505C247.887 175.505 247.511 175.352 247.23 175.078C246.941 174.796 246.777 174.409 246.777 174.005C246.777 147.456 226.233 126.66 200.004 126.66C173.455 126.66 152.659 147.373 152.659 173.814C152.659 174.64 151.991 175.311 151.165 175.314L127.471 175.409C127.088 175.367 126.689 175.253 126.406 174.972C126.123 174.69 125.965 174.307 125.965 173.909C125.965 133.168 159.109 100.023 199.85 100.023C219.611 100.023 238.162 107.623 252.085 121.422C266.04 135.253 273.725 153.724 273.725 173.434C273.725 174.327 272.897 175.025 272.034 174.923C271.984 174.929 271.933 174.932 271.881 174.934L248.314 175.505H248.277Z"
          fill="black"
        />

        {/* ── Tick marks ── */}
        {/* Top center */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M199.73 126.035C198.843 126.035 198.125 125.316 198.125 124.431V101.918C198.125 101.032 198.843 100.312 199.73 100.312C200.617 100.312 201.334 101.032 201.334 101.918V124.431C201.334 125.316 200.617 126.035 199.73 126.035Z"
          fill="black"
        />
        {/* Upper right */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M223.006 131.702C222.741 131.702 222.472 131.636 222.224 131.497C221.451 131.065 221.174 130.087 221.607 129.313L232.595 109.665C233.027 108.892 234.005 108.615 234.779 109.048C235.552 109.48 235.829 110.458 235.396 111.232L224.408 130.881C224.114 131.405 223.568 131.702 223.006 131.702Z"
          fill="black"
        />
        {/* Right (near 100 %) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M242.442 149.649C241.908 149.649 241.385 149.381 241.081 148.897C240.61 148.144 240.838 147.155 241.588 146.684L260.666 134.73C261.416 134.258 262.407 134.486 262.878 135.236C263.347 135.989 263.121 136.978 262.37 137.449L243.293 149.403C243.028 149.57 242.733 149.649 242.442 149.649Z"
          fill="black"
        />
        {/* Left (near 0 %) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M157.496 149.649C157.205 149.649 156.911 149.57 156.646 149.403L137.57 137.449C136.818 136.978 136.592 135.989 137.061 135.236C137.533 134.486 138.523 134.258 139.274 134.73L158.35 146.684C159.101 147.155 159.328 148.144 158.858 148.897C158.553 149.381 158.031 149.649 157.496 149.649Z"
          fill="black"
        />
        {/* Upper left */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M176.45 131.703C175.888 131.703 175.342 131.407 175.048 130.882L164.06 111.233C163.627 110.459 163.904 109.481 164.677 109.049C165.453 108.616 166.429 108.892 166.861 109.666L177.849 129.314C178.282 130.088 178.005 131.066 177.232 131.498C176.984 131.637 176.715 131.703 176.45 131.703Z"
          fill="black"
        />

        {/* ── Needle (rotated to match live participation rate) ── */}
        <g
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: animated
              ? "transform 1.8s cubic-bezier(0.34, 1.3, 0.64, 1)"
              : "none",
          }}
        >
          {/* Center hub */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M199.749 167.069C198.311 167.069 197.141 168.239 197.141 169.677C197.141 171.116 198.311 172.285 199.749 172.285C201.187 172.285 202.357 171.116 202.357 169.677C202.357 168.239 201.187 167.069 199.749 167.069ZM199.749 175.495C196.541 175.495 193.93 172.885 193.93 169.677C193.93 166.468 196.541 163.859 199.749 163.859C202.957 163.859 205.567 166.468 205.567 169.677C205.567 172.885 202.957 175.495 199.749 175.495Z"
            fill="black"
          />
          {/* Needle pointer */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M202.363 166.109C202.141 166.423 201.805 166.659 201.4 166.747C200.535 166.94 199.679 166.395 199.486 165.529L196.368 151.501L198.087 165.598C198.196 166.478 197.568 167.278 196.688 167.386C195.809 167.494 195.009 166.866 194.901 165.986L189.197 119.201C189.097 118.351 189.678 117.571 190.52 117.425C191.364 117.28 192.171 117.822 192.358 118.66L202.619 164.834C202.721 165.293 202.616 165.752 202.363 166.109Z"
            fill="black"
          />
        </g>

        {/* ── Decorative side circles ── */}
        {/* Right circle */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M316.265 116.983C307.849 116.983 301.003 123.829 301.003 132.246C301.003 140.66 307.849 147.505 316.265 147.505C324.68 147.505 331.526 140.66 331.526 132.246C331.526 123.829 324.68 116.983 316.265 116.983ZM316.265 150.716C306.08 150.716 297.793 142.43 297.793 132.246C297.793 122.06 306.08 113.773 316.265 113.773C326.45 113.773 334.737 122.06 334.737 132.246C334.737 142.43 326.45 150.716 316.265 150.716Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M326.25 133.854C325.363 133.854 324.645 133.135 324.645 132.25C324.645 127.626 320.885 123.866 316.262 123.866C311.639 123.866 307.878 127.626 307.878 132.25C307.878 133.135 307.16 133.854 306.273 133.854C305.387 133.854 304.668 133.135 304.668 132.25C304.668 125.857 309.869 120.656 316.262 120.656C322.653 120.656 327.854 125.857 327.854 132.25C327.854 133.135 327.137 133.854 326.25 133.854Z"
          fill="black"
        />
        {/* Left circle */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M83.0736 116.983C74.6576 116.983 67.8116 123.829 67.8116 132.246C67.8116 140.66 74.6576 147.505 83.0736 147.505C91.4886 147.505 98.3346 140.66 98.3346 132.246C98.3346 123.829 91.4886 116.983 83.0736 116.983ZM83.0736 150.716C72.8876 150.716 64.6016 142.43 64.6016 132.246C64.6016 122.06 72.8876 113.773 83.0736 113.773C93.2586 113.773 101.545 122.06 101.545 132.246C101.545 142.43 93.2586 150.716 83.0736 150.716Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M93.0625 133.854C92.1755 133.854 91.4575 133.135 91.4575 132.25C91.4575 127.626 87.6975 123.866 83.0745 123.866C78.4515 123.866 74.6905 127.626 74.6905 132.25C74.6905 133.135 73.9715 133.854 73.0845 133.854C72.1995 133.854 71.4805 133.135 71.4805 132.25C71.4805 125.857 76.6815 120.656 83.0745 120.656C89.4655 120.656 94.6665 125.857 94.6665 132.25C94.6665 133.135 93.9495 133.854 93.0625 133.854Z"
          fill="black"
        />
      </g>

      {/* ── Dynamic participation text ── */}
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fill="#131418"
        style={{
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {participationRate} participation
      </text>

      {/* ── Inflation box ── */}
      <rect
        x="91.4844"
        y="252.688"
        width="217.016"
        height="48"
        fill="#A6ADEB"
      />
      <rect
        x="91.4844"
        y="252.688"
        width="217.016"
        height="48"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="200"
        y="282"
        textAnchor="middle"
        fill="#131418"
        style={{
          fontSize: "15px",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontWeight: 700,
          letterSpacing: "0.03em",
        }}
      >
        {inflationRate} inflation
      </text>

      {/* ── Defs ── */}
      <defs>
        <linearGradient
          id="paint0_meter"
          x1="127.465"
          y1="3725.58"
          x2="14603.5"
          y2="3725.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#24A8DF" />
          <stop offset="1" stopColor="#EB858A" />
        </linearGradient>
        <clipPath id="clip0_meter">
          <rect
            width="271"
            height="76"
            fill="white"
            transform="translate(64.5 99.6875)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
