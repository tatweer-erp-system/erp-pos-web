import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { authService, type Branch } from "@/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { Role, type LoginResponse } from "@/types/auth";
import type { ApiError } from "@/types/api";

interface EyePos {
  x: number;
  y: number;
}

// ─── Saudi Accounting Illustration (left panel) ───────────────────────────────
function SaudiIllustration() {
  return (
    <svg
      viewBox="0 0 560 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000d06" />
          <stop offset="35%" stopColor="#001f0c" />
          <stop offset="70%" stopColor="#003d18" />
          <stop offset="100%" stopColor="#006C35" />
        </linearGradient>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a55a" />
          <stop offset="100%" stopColor="#7a5510" />
        </linearGradient>
        <linearGradient id="barUp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id="barUp2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Sky background ── */}
      <rect width="560" height="760" fill="url(#skyGrad)" />

      {/* ── Subtle dot-grid ── */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(col =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
          row => (
            <circle
              key={`dot-${col}-${row}`}
              cx={col * 40 + 20}
              cy={row * 40 + 20}
              r="0.6"
              fill="white"
              opacity="0.06"
            />
          )
        )
      )}

      {/* ── Stars ── */}
      <circle cx="28" cy="35" r="1.4" fill="white" opacity="0.9" />
      <circle cx="68" cy="18" r="0.8" fill="white" opacity="0.7" />
      <circle cx="110" cy="44" r="1.2" fill="white" opacity="0.8" />
      <circle cx="165" cy="12" r="1.0" fill="white" opacity="0.9" />
      <circle cx="230" cy="28" r="0.9" fill="white" opacity="0.65" />
      <circle cx="290" cy="10" r="1.3" fill="white" opacity="0.85" />
      <circle cx="350" cy="38" r="0.7" fill="white" opacity="0.7" />
      <circle cx="510" cy="22" r="1.1" fill="white" opacity="0.9" />
      <circle cx="540" cy="55" r="0.8" fill="white" opacity="0.6" />
      <circle cx="55" cy="80" r="0.9" fill="white" opacity="0.5" />
      <circle cx="135" cy="65" r="1.1" fill="white" opacity="0.75" />
      <circle cx="200" cy="88" r="0.7" fill="white" opacity="0.6" />
      <circle cx="270" cy="72" r="1.4" fill="white" opacity="0.9" />
      <circle cx="315" cy="88" r="0.8" fill="white" opacity="0.7" />
      <circle cx="390" cy="58" r="1.0" fill="white" opacity="0.8" />
      <circle cx="480" cy="90" r="1.2" fill="white" opacity="0.5" />
      <circle cx="525" cy="78" r="0.9" fill="white" opacity="0.7" />
      <circle cx="42" cy="122" r="0.6" fill="white" opacity="0.6" />
      <circle cx="178" cy="108" r="1.0" fill="white" opacity="0.4" />
      <circle cx="370" cy="118" r="0.8" fill="white" opacity="0.5" />
      <circle cx="490" cy="112" r="1.1" fill="white" opacity="0.7" />
      <circle cx="75" cy="148" r="0.7" fill="white" opacity="0.45" />
      <circle cx="248" cy="140" r="0.9" fill="white" opacity="0.5" />
      <circle cx="435" cy="135" r="1.0" fill="white" opacity="0.4" />

      {/* ── Crescent moon (top right) ── */}
      <circle cx="460" cy="72" r="36" fill="url(#moonGlow)" />
      <circle cx="460" cy="72" r="30" fill="#fef3c7" opacity="0.96" />
      <circle cx="476" cy="62" r="24" fill="#001208" />

      {/* ── Islamic 8-pointed star pattern (top left corner, very subtle) ── */}
      {[0, 1, 2].map(col =>
        [0, 1, 2].map(row => {
          const x = col * 52 + 10;
          const y = row * 52 + 10;
          return (
            <g key={`star-${col}-${row}`} opacity="0.07">
              <polygon
                points={`${x + 16},${y} ${x + 20},${y + 10} ${x + 32},${y + 10} ${x + 22},${y + 17} ${x + 26},${y + 28} ${x + 16},${y + 21} ${x + 6},${y + 28} ${x + 10},${y + 17} ${x},${y + 10} ${x + 12},${y + 10}`}
                fill="white"
              />
            </g>
          );
        })
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── RIYADH SKYLINE SILHOUETTES ── */}

      {/* Far background buildings (faint) */}
      <rect
        x="0"
        y="430"
        width="28"
        height="200"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="32"
        y="400"
        width="20"
        height="230"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="56"
        y="420"
        width="24"
        height="210"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="84"
        y="390"
        width="16"
        height="240"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="104"
        y="410"
        width="22"
        height="220"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="460"
        y="400"
        width="24"
        height="230"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="488"
        y="420"
        width="18"
        height="210"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="510"
        y="390"
        width="28"
        height="240"
        rx="2"
        fill="white"
        opacity="0.06"
      />
      <rect
        x="542"
        y="410"
        width="18"
        height="220"
        rx="2"
        fill="white"
        opacity="0.06"
      />

      {/* Mid-level buildings */}
      <rect
        x="20"
        y="340"
        width="34"
        height="290"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="58"
        y="310"
        width="28"
        height="320"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="140"
        y="360"
        width="36"
        height="270"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="180"
        y="345"
        width="28"
        height="285"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="340"
        y="350"
        width="34"
        height="280"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="378"
        y="330"
        width="26"
        height="300"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="430"
        y="340"
        width="30"
        height="290"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="464"
        y="360"
        width="22"
        height="270"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="490"
        y="310"
        width="38"
        height="320"
        rx="2"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="532"
        y="345"
        width="28"
        height="285"
        rx="2"
        fill="white"
        opacity="0.1"
      />

      {/* ── Al Faisaliah Tower (برج الفيصلية) — left, tapered with sphere ── */}
      {/* Base */}
      <rect
        x="88"
        y="490"
        width="52"
        height="10"
        rx="1"
        fill="white"
        opacity="0.14"
      />
      {/* Tower body — tapering polygon */}
      <polygon
        points="96,490 102,290 114,280 126,280 138,290 132,490"
        fill="white"
        opacity="0.15"
      />
      {/* Glass sphere */}
      <circle cx="114" cy="268" r="22" fill="white" opacity="0.18" />
      <circle cx="114" cy="268" r="14" fill="white" opacity="0.08" />
      {/* Antenna */}
      <line
        x1="114"
        y1="246"
        x2="114"
        y2="210"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.2"
      />
      <circle cx="114" cy="208" r="3" fill="white" opacity="0.3" />
      {/* Windows */}
      <rect
        x="108"
        y="310"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="108"
        y="330"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="108"
        y="350"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="108"
        y="370"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.15"
      />
      <rect
        x="108"
        y="390"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="108"
        y="410"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.15"
      />
      <rect
        x="108"
        y="430"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="108"
        y="450"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.15"
      />
      <rect
        x="108"
        y="470"
        width="12"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />

      {/* ── Kingdom Centre Tower (برج المملكة) — center, iconic keyhole top ── */}
      {/* Base platform */}
      <rect
        x="218"
        y="520"
        width="124"
        height="14"
        rx="2"
        fill="white"
        opacity="0.16"
      />
      {/* Left tower column */}
      <rect
        x="228"
        y="170"
        width="26"
        height="350"
        rx="2"
        fill="white"
        opacity="0.2"
      />
      {/* Right tower column */}
      <rect
        x="306"
        y="170"
        width="26"
        height="350"
        rx="2"
        fill="white"
        opacity="0.2"
      />
      {/* Sky bridge / arch connecting top — the iconic keyhole */}
      <path
        d="M228 220 Q280 145 332 220"
        fill="none"
        stroke="white"
        strokeWidth="20"
        opacity="0.18"
        strokeLinecap="round"
      />
      {/* Mid-level sky lobby bridge */}
      <rect
        x="222"
        y="330"
        width="116"
        height="12"
        rx="2"
        fill="white"
        opacity="0.18"
      />
      {/* Antennas */}
      <line
        x1="241"
        y1="168"
        x2="241"
        y2="130"
        stroke="white"
        strokeWidth="2"
        opacity="0.22"
      />
      <line
        x1="319"
        y1="168"
        x2="319"
        y2="130"
        stroke="white"
        strokeWidth="2"
        opacity="0.22"
      />
      <circle cx="241" cy="128" r="3" fill="white" opacity="0.3" />
      <circle cx="319" cy="128" r="3" fill="white" opacity="0.3" />
      {/* Left column windows */}
      <rect
        x="232"
        y="190"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="190"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="214"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="214"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="250"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="250"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="274"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="274"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="350"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="350"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="374"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="374"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="398"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="398"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="422"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="422"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="446"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="446"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="232"
        y="470"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="244"
        y="470"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      {/* Right column windows */}
      <rect
        x="310"
        y="190"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="190"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="214"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="214"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="250"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="250"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="274"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="274"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="350"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="350"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="374"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="374"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="398"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="398"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="422"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="422"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="446"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="446"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />
      <rect
        x="310"
        y="470"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.22"
      />
      <rect
        x="322"
        y="470"
        width="8"
        height="12"
        rx="1"
        fill="#4ade80"
        opacity="0.18"
      />

      {/* ── Al Mamlaka / other tall tower (right side) ── */}
      <rect
        x="408"
        y="290"
        width="40"
        height="240"
        rx="2"
        fill="white"
        opacity="0.16"
      />
      {/* Crown / stepped top */}
      <rect
        x="412"
        y="275"
        width="32"
        height="16"
        rx="2"
        fill="white"
        opacity="0.18"
      />
      <rect
        x="418"
        y="260"
        width="20"
        height="16"
        rx="2"
        fill="white"
        opacity="0.2"
      />
      <line
        x1="428"
        y1="258"
        x2="428"
        y2="235"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.22"
      />
      {/* Windows */}
      <rect
        x="415"
        y="300"
        width="10"
        height="8"
        rx="1"
        fill="#facc15"
        opacity="0.2"
      />
      <rect
        x="430"
        y="300"
        width="10"
        height="8"
        rx="1"
        fill="#facc15"
        opacity="0.2"
      />
      <rect
        x="415"
        y="320"
        width="10"
        height="8"
        rx="1"
        fill="#facc15"
        opacity="0.2"
      />
      <rect
        x="430"
        y="320"
        width="10"
        height="8"
        rx="1"
        fill="#facc15"
        opacity="0.2"
      />
      <rect
        x="415"
        y="340"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="430"
        y="340"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="415"
        y="360"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="430"
        y="360"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="415"
        y="380"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="430"
        y="380"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="415"
        y="400"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />
      <rect
        x="430"
        y="400"
        width="10"
        height="8"
        rx="1"
        fill="#4ade80"
        opacity="0.2"
      />

      {/* ── Desert dunes ── */}
      <path
        d="M0 558 Q50 532 120 552 Q200 572 290 545 Q370 522 450 548 Q500 560 560 540 L560 760 L0 760 Z"
        fill="url(#sandGrad)"
        opacity="0.55"
      />
      <path
        d="M0 580 Q90 558 180 578 Q270 598 360 572 Q440 550 560 572 L560 760 L0 760 Z"
        fill="url(#sandGrad)"
        opacity="0.35"
      />
      {/* Sand highlight */}
      <path
        d="M0 580 Q90 558 180 578 Q270 598 360 572 Q440 550 560 572"
        fill="none"
        stroke="#e8c870"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── FINANCIAL CHART ELEMENTS ── */}

      {/* Rising bar chart card (top left area) */}
      <g filter="url(#softGlow)">
        <rect
          x="30"
          y="185"
          width="148"
          height="110"
          rx="10"
          fill="#003d18"
          opacity="0.85"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
        {/* Title */}
        <rect
          x="42"
          y="198"
          width="55"
          height="5"
          rx="2"
          fill="#86efac"
          opacity="0.7"
        />
        {/* Bars */}
        <rect x="42" y="255" width="14" height="32" rx="2" fill="url(#barUp)" />
        <rect x="62" y="241" width="14" height="46" rx="2" fill="url(#barUp)" />
        <rect x="82" y="228" width="14" height="59" rx="2" fill="url(#barUp)" />
        <rect
          x="102"
          y="213"
          width="14"
          height="74"
          rx="2"
          fill="url(#barUp)"
        />
        <rect
          x="122"
          y="204"
          width="14"
          height="83"
          rx="2"
          fill="url(#barUp)"
        />
        <rect
          x="142"
          y="196"
          width="14"
          height="91"
          rx="2"
          fill="url(#barUp)"
        />
        {/* Trend line */}
        <polyline
          points="49,253 69,239 89,226 109,211 129,202 149,193"
          stroke="#facc15"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Up arrow */}
        <polygon points="149,188 157,196 141,196" fill="#facc15" />
        {/* Axis */}
        <line
          x1="38"
          y1="290"
          x2="162"
          y2="290"
          stroke="#22c55e"
          strokeWidth="0.6"
          opacity="0.5"
        />
      </g>

      {/* KPI card – total revenue */}
      <g>
        <rect
          x="30"
          y="310"
          width="148"
          height="62"
          rx="10"
          fill="#003d18"
          opacity="0.85"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
        <text
          x="44"
          y="330"
          fill="#86efac"
          fontSize="10"
          fontFamily="Arial, sans-serif"
          opacity="0.85"
        >
          إجمالي الإيرادات
        </text>
        <text
          x="44"
          y="356"
          fill="#4ade80"
          fontSize="19"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          filter="url(#softGlow)"
        >
          ٢.٤M ريال
        </text>
        {/* trend badge */}
        <rect
          x="128"
          y="320"
          width="38"
          height="18"
          rx="9"
          fill="#15803d"
          opacity="0.9"
        />
        <text
          x="147"
          y="332"
          fill="#bbf7d0"
          fontSize="9"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          ▲ 8.2%
        </text>
      </g>

      {/* Pie / donut chart card (right side) */}
      <g filter="url(#softGlow)">
        <rect
          x="382"
          y="185"
          width="148"
          height="120"
          rx="10"
          fill="#003d18"
          opacity="0.85"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
        {/* Donut chart */}
        {/* Background circle */}
        <circle
          cx="434"
          cy="240"
          r="38"
          fill="none"
          stroke="#005522"
          strokeWidth="18"
        />
        {/* Slice 1 – 38% green */}
        <circle
          cx="434"
          cy="240"
          r="38"
          fill="none"
          stroke="#4ade80"
          strokeWidth="18"
          strokeDasharray="90 148"
          strokeDashoffset="0"
        />
        {/* Slice 2 – 28% light green */}
        <circle
          cx="434"
          cy="240"
          r="38"
          fill="none"
          stroke="#86efac"
          strokeWidth="18"
          strokeDasharray="66 172"
          strokeDashoffset="-90"
        />
        {/* Slice 3 – 22% yellow */}
        <circle
          cx="434"
          cy="240"
          r="38"
          fill="none"
          stroke="#fde68a"
          strokeWidth="18"
          strokeDasharray="52 186"
          strokeDashoffset="-156"
        />
        {/* Slice 4 – 12% white */}
        <circle
          cx="434"
          cy="240"
          r="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="18"
          strokeDasharray="30 208"
          strokeDashoffset="-208"
          opacity="0.5"
        />
        {/* Center text */}
        <circle cx="434" cy="240" r="22" fill="#003d18" />
        <text
          x="434"
          y="237"
          textAnchor="middle"
          fill="#4ade80"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          2026
        </text>
        <text
          x="434"
          y="249"
          textAnchor="middle"
          fill="#86efac"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          SAR
        </text>
        {/* Legend items */}
        <rect x="480" y="210" width="8" height="8" rx="2" fill="#4ade80" />
        <text
          x="492"
          y="218"
          fill="#86efac"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          مبيعات
        </text>
        <rect x="480" y="224" width="8" height="8" rx="2" fill="#86efac" />
        <text
          x="492"
          y="232"
          fill="#86efac"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          مشتريات
        </text>
        <rect x="480" y="238" width="8" height="8" rx="2" fill="#fde68a" />
        <text
          x="492"
          y="246"
          fill="#86efac"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          نفقات
        </text>
        <rect
          x="480"
          y="252"
          width="8"
          height="8"
          rx="2"
          fill="white"
          opacity="0.5"
        />
        <text
          x="492"
          y="260"
          fill="#86efac"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          أخرى
        </text>
      </g>

      {/* Ledger / document card */}
      <g>
        <rect
          x="382"
          y="320"
          width="148"
          height="80"
          rx="10"
          fill="#003d18"
          opacity="0.85"
          stroke="#22c55e"
          strokeWidth="0.8"
        />
        <rect
          x="394"
          y="334"
          width="100"
          height="4"
          rx="2"
          fill="#4ade80"
          opacity="0.6"
        />
        <rect
          x="394"
          y="344"
          width="76"
          height="3"
          rx="1.5"
          fill="#86efac"
          opacity="0.45"
        />
        <rect
          x="394"
          y="352"
          width="90"
          height="3"
          rx="1.5"
          fill="#86efac"
          opacity="0.45"
        />
        <rect
          x="394"
          y="360"
          width="64"
          height="3"
          rx="1.5"
          fill="#86efac"
          opacity="0.45"
        />
        <rect
          x="394"
          y="368"
          width="84"
          height="3"
          rx="1.5"
          fill="#4ade80"
          opacity="0.5"
        />
        <rect
          x="394"
          y="376"
          width="70"
          height="3"
          rx="1.5"
          fill="#86efac"
          opacity="0.45"
        />
        <rect
          x="394"
          y="384"
          width="96"
          height="3"
          rx="1.5"
          fill="#fde68a"
          opacity="0.5"
        />
        {/* Currency symbol right */}
        <text
          x="508"
          y="358"
          fill="#4ade80"
          fontSize="22"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          opacity="0.25"
        >
          ﷼
        </text>
      </g>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── BRANDING OVERLAY ── */}

      {/* Horizontal rule */}
      <line
        x1="80"
        y1="150"
        x2="480"
        y2="150"
        stroke="#22c55e"
        strokeWidth="0.6"
        opacity="0.25"
      />

      {/* System name in Arabic */}
      <text
        x="280"
        y="118"
        textAnchor="middle"
        fill="white"
        fontSize="44"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        opacity="0.95"
        filter="url(#softGlow)"
      >
        تطوير
      </text>
      <text
        x="280"
        y="142"
        textAnchor="middle"
        fill="#86efac"
        fontSize="12"
        fontFamily="Arial, sans-serif"
        letterSpacing="4"
        opacity="0.85"
      >
        TATWEER ERP
      </text>

      {/* Bottom tagline */}
      <text
        x="280"
        y="720"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontFamily="Arial, sans-serif"
        opacity="0.35"
        letterSpacing="2"
      >
        المملكة العربية السعودية · رؤية ٢٠٣٠
      </text>

      {/* Saudi Vision 2030 inspired accent bar at bottom */}
      <rect
        x="80"
        y="730"
        width="400"
        height="2"
        rx="1"
        fill="#22c55e"
        opacity="0.3"
      />

      {/* Floating Saudi riyal symbol (watermark) */}
      <text
        x="280"
        y="460"
        textAnchor="middle"
        fill="#22c55e"
        fontSize="220"
        fontFamily="Arial, sans-serif"
        opacity="0.03"
        fontWeight="bold"
      >
        ﷼
      </text>
    </svg>
  );
}

// ─── Animated Business Character ─────────────────────────────────────────────
function BusinessCharacter({
  isPasswordFocused,
  eyePos,
}: {
  isPasswordFocused: boolean;
  eyePos: EyePos;
}) {
  const px = Math.max(-3, Math.min(3, eyePos.x * 3));
  const py = Math.max(-3, Math.min(3, eyePos.y * 3));

  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse cx="80" cy="212" rx="44" ry="7" fill="#003d18" opacity="0.18" />

      {/* Legs */}
      <rect x="57" y="160" width="19" height="40" rx="8" fill="#14532d" />
      <rect x="84" y="160" width="19" height="40" rx="8" fill="#14532d" />
      {/* Shoes */}
      <rect x="53" y="192" width="27" height="12" rx="6" fill="#0f172a" />
      <rect x="80" y="192" width="27" height="12" rx="6" fill="#0f172a" />

      {/* Body / Thobe (Saudi traditional white robe with green trim) */}
      <rect x="43" y="108" width="74" height="60" rx="14" fill="#f8fafc" />
      {/* Green collar/trim */}
      <rect x="43" y="108" width="74" height="8" rx="4" fill="#006C35" />
      {/* Center placket */}
      <rect x="73" y="116" width="14" height="42" rx="3" fill="#f0f0f0" />
      {/* Saudi green badge */}
      <rect
        x="84"
        y="122"
        width="22"
        height="15"
        rx="3"
        fill="#006C35"
        opacity="0.9"
      />
      <rect
        x="87"
        y="125"
        width="16"
        height="2"
        rx="1"
        fill="white"
        opacity="0.8"
      />
      <rect
        x="87"
        y="130"
        width="12"
        height="2"
        rx="1"
        fill="white"
        opacity="0.6"
      />

      {/* Briefcase arm (left) — swings up to cover eyes on password focus */}
      <g
        style={{
          transform: isPasswordFocused
            ? "translate(-2px, -62px) rotate(-18deg)"
            : "translate(0px, 0px) rotate(0deg)",
          transformOrigin: "46px 118px",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Arm */}
        <rect x="28" y="118" width="22" height="13" rx="6" fill="#f5d5b8" />
        {/* Briefcase body */}
        <rect x="8" y="124" width="38" height="28" rx="5" fill="#92400e" />
        <rect
          x="8"
          y="124"
          width="38"
          height="28"
          rx="5"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        {/* Handle */}
        <path
          d="M20 124 Q28 114 36 124"
          stroke="#78350f"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Center latch */}
        <rect x="24" y="134" width="8" height="8" rx="2" fill="#fbbf24" />
        {/* Shine */}
        <rect
          x="11"
          y="127"
          width="7"
          height="12"
          rx="2"
          fill="#a16207"
          opacity="0.35"
        />
      </g>

      {/* Right arm (holding document) */}
      <rect x="110" y="118" width="22" height="13" rx="6" fill="#f5d5b8" />
      {/* Document */}
      <rect
        x="112"
        y="126"
        width="30"
        height="36"
        rx="3"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <line
        x1="117"
        y1="133"
        x2="138"
        y2="133"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="117"
        y1="139"
        x2="138"
        y2="139"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="117"
        y1="145"
        x2="132"
        y2="145"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="117"
        y1="151"
        x2="135"
        y2="151"
        stroke="#bbf7d0"
        strokeWidth="1.5"
      />
      {/* SAR symbol on doc */}
      <text
        x="122"
        y="158"
        fill="#006C35"
        fontSize="8"
        fontFamily="Arial"
        opacity="0.6"
      >
        ﷼
      </text>

      {/* Neck */}
      <rect x="69" y="94" width="22" height="18" rx="6" fill="#f5d5b8" />

      {/* Head */}
      <ellipse cx="80" cy="74" rx="31" ry="32" fill="#f5d5b8" />
      {/* Ear left */}
      <ellipse cx="49" cy="74" rx="5" ry="7" fill="#f5d5b8" />
      {/* Ear right */}
      <ellipse cx="111" cy="74" rx="5" ry="7" fill="#f5d5b8" />

      {/* Ghutra (Saudi head covering — white) */}
      <path
        d="M49 58 Q50 32 80 28 Q110 32 111 58 Q108 44 80 40 Q52 44 49 58Z"
        fill="#f8fafc"
      />
      {/* Igal (black rope on ghutra) */}
      <path
        d="M49 56 Q52 50 80 48 Q108 50 111 56"
        stroke="#1c1917"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <ellipse cx="67" cy="74" rx="9" ry="8" fill="white" />
      <ellipse cx="93" cy="74" rx="9" ry="8" fill="white" />

      {!isPasswordFocused && (
        <>
          <circle cx={67 + px} cy={74 + py} r="4.5" fill="#1e293b" />
          <circle cx={93 + px} cy={74 + py} r="4.5" fill="#1e293b" />
          <circle
            cx={69 + px}
            cy={72 + py}
            r="1.5"
            fill="white"
            opacity="0.9"
          />
          <circle
            cx={95 + px}
            cy={72 + py}
            r="1.5"
            fill="white"
            opacity="0.9"
          />
        </>
      )}

      {isPasswordFocused && (
        <>
          {/* Closed eyes — curved downward arc */}
          <path
            d="M58 74 Q67 80 76 74"
            stroke="#1e293b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M84 74 Q93 80 102 74"
            stroke="#1e293b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Eyebrows */}
      <path
        d="M59 63 Q67 59 75 62"
        stroke="#4a3728"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        style={{
          transform: isPasswordFocused ? "translateY(2px)" : "translateY(0)",
          transition: "transform 0.3s ease",
        }}
      />
      <path
        d="M85 62 Q93 59 101 63"
        stroke="#4a3728"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        style={{
          transform: isPasswordFocused ? "translateY(2px)" : "translateY(0)",
          transition: "transform 0.3s ease",
        }}
      />

      {/* Smile */}
      <path
        d="M69 88 Q80 96 91 88"
        stroke="#c97d5a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{
          transform: isPasswordFocused
            ? "scaleX(0.65) translateX(14px)"
            : "scaleX(1)",
          transformOrigin: "80px 91px",
          transition: "transform 0.35s ease",
        }}
      />
    </svg>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function InputIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
      {children}
    </span>
  );
}

// ─── Design settings ──────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  {
    id: "green",
    name: "أخضر",
    primary: "#006C35",
    dark: "#004d26",
    light: "#dcfce7",
  },
  {
    id: "blue",
    name: "أزرق",
    primary: "#1a56db",
    dark: "#1240ab",
    light: "#dbeafe",
  },
  {
    id: "violet",
    name: "بنفسجي",
    primary: "#7c3aed",
    dark: "#5b21b6",
    light: "#ede9fe",
  },
  {
    id: "red",
    name: "أحمر",
    primary: "#dc2626",
    dark: "#b91c1c",
    light: "#fee2e2",
  },
  {
    id: "slate",
    name: "رمادي",
    primary: "#374151",
    dark: "#1f2937",
    light: "#f1f5f9",
  },
  {
    id: "amber",
    name: "ذهبي",
    primary: "#b45309",
    dark: "#92400e",
    light: "#fef3c7",
  },
] as const;

type ColorPreset = (typeof COLOR_PRESETS)[number];
type DesignVariant = 1 | 2 | 3;

const DESIGN_OPTIONS: { id: DesignVariant; name: string; desc: string }[] = [
  { id: 1, name: "كلاسيك", desc: "لوحة التوضيح + النموذج" },
  { id: 2, name: "مركزي", desc: "بطاقة عائمة على خلفية فاتحة" },
  { id: 3, name: "جريء", desc: "خلفية ملونة كاملة" },
];

function SettingsDrawer({
  open,
  onClose,
  color,
  onColorChange,
  design,
  onDesignChange,
}: {
  open: boolean;
  onClose: () => void;
  color: ColorPreset;
  onColorChange: (c: ColorPreset) => void;
  design: DesignVariant;
  onDesignChange: (d: DesignVariant) => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[10000] bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-[10001] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="font-bold text-slate-800 text-sm">إعدادات الصفحة</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* Colors */}
          <section>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              اللون الرئيسي
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {COLOR_PRESETS.map(c => {
                const active = color.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onColorChange(c)}
                    className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all duration-150 ${
                      active
                        ? "border-slate-800 shadow-sm scale-105"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: c.primary }}
                    />
                    <span className="text-[10px] font-medium text-slate-600">
                      {c.name}
                    </span>
                    {active && (
                      <span
                        className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: c.primary }}
                      >
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Designs */}
          <section>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              التصميم
            </p>
            <div className="space-y-2">
              {DESIGN_OPTIONS.map(opt => {
                const active = design === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onDesignChange(opt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-right ${
                      active
                        ? "border-slate-800 bg-slate-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {/* Mini preview */}
                    <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 flex">
                      {opt.id === 1 && (
                        <>
                          <div
                            className="w-6 h-full flex-shrink-0"
                            style={{ background: color.primary }}
                          />
                          <div className="flex-1 bg-white flex items-center justify-center">
                            <div className="space-y-0.5 w-5">
                              <div className="h-0.5 bg-slate-200 rounded" />
                              <div className="h-0.5 bg-slate-200 rounded w-3" />
                              <div
                                className="h-1.5 rounded mt-1"
                                style={{ background: color.primary }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {opt.id === 2 && (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: color.light }}
                        >
                          <div className="w-8 h-6 bg-white rounded shadow-sm flex flex-col overflow-hidden">
                            <div
                              className="h-1.5 w-full"
                              style={{ background: color.primary }}
                            />
                          </div>
                        </div>
                      )}
                      {opt.id === 3 && (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: color.primary }}
                        >
                          <div className="w-8 h-6 bg-white/95 rounded shadow-sm flex flex-col overflow-hidden">
                            <div
                              className="h-1.5 w-full"
                              style={{ background: color.dark }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700">
                        {opt.name}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {opt.desc}
                      </div>
                    </div>
                    {active && (
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: color.primary }}
                      >
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function Login() {
  const [, setLocation] = useLocation();
  const { login: authLogin, selectBranch } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [eyePos, setEyePos] = useState<EyePos>({ x: 0, y: 0 });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Design settings
  const [colorPreset, setColorPreset] = useState<ColorPreset>(() => {
    const saved = localStorage.getItem("login-color-id");
    return (
      (COLOR_PRESETS as readonly ColorPreset[]).find(c => c.id === saved) ??
      COLOR_PRESETS[0]
    );
  });
  const [design, setDesign] = useState<DesignVariant>(
    () => (Number(localStorage.getItem("login-design")) as DesignVariant) || 1
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleColorChange(c: ColorPreset) {
    setColorPreset(c);
    localStorage.setItem("login-color-id", c.id);
  }
  function handleDesignChange(d: DesignVariant) {
    setDesign(d);
    localStorage.setItem("login-design", String(d));
  }

  // Branch selection step
  const [step, setStep] = useState<"form" | "branch">("form");
  const [loginBranches, setLoginBranches] = useState<Branch[]>([]);
  const [pendingLoginResponse, setPendingLoginResponse] =
    useState<LoginResponse | null>(null);
  const [redirectTo, setRedirectTo] = useState("/");

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setLocation(redirectTo), 1200);
    return () => clearTimeout(t);
  }, [success, redirectTo]);

  const characterRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPasswordFocused || !characterRef.current) return;
      const rect = characterRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setEyePos({
        x: (e.clientX - cx) / (window.innerWidth / 2),
        y: (e.clientY - cy) / (window.innerHeight / 2),
      });
    },
    [isPasswordFocused]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  function validate() {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "البريد الإلكتروني مطلوب.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "أدخل بريداً إلكترونياً صحيحاً.";
    if (!password) errs.password = "كلمة المرور مطلوبة.";
    else if (password.length < 6)
      errs.password = "كلمة المرور 6 أحرف على الأقل.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      if (response.branches.length === 1) {
        // Single branch — log in directly
        authLogin(response);
        selectBranch(response.branches[0]);
        setRedirectTo(response.user.role === Role.Cashier ? "/pos" : "/");
        setSuccess(true);
      } else {
        // Multiple branches — let user choose
        setPendingLoginResponse(response);
        setLoginBranches(response.branches);
        setStep("branch");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setErrors({
        email: apiErr.message || "بيانات الاعتماد غير صحيحة. حاول مجدداً.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleBranchSelect(branch: Branch) {
    if (!pendingLoginResponse) return;
    authLogin(pendingLoginResponse);
    selectBranch(branch);
    setRedirectTo(
      pendingLoginResponse.user.role === Role.Cashier ? "/pos" : "/"
    );
    setSuccess(true);
  }

  // Shared input class builder
  const inputCls = (hasError: boolean) =>
    [
      "w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm text-slate-800",
      "placeholder-slate-400 outline-none transition-all duration-200",
      hasError
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:bg-white",
    ].join(" ");

  const { primary, dark, light } = colorPreset;

  // ── Shared: settings gear button + drawer ───────────────────────────────
  const settingsUI = (
    <>
      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        color={colorPreset}
        onColorChange={handleColorChange}
        design={design}
        onDesignChange={handleDesignChange}
      />
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 right-4 z-[9999] w-10 h-10 flex items-center justify-center rounded-xl shadow-lg hover:shadow-xl transition-all text-white"
        style={{ background: `linear-gradient(135deg, ${primary}, ${dark})` }}
        aria-label="إعدادات الصفحة"
        title="إعدادات الصفحة"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </>
  );

  // ── Shared: the login card (character + card + demo section) ────────────
  const formCard = (
    <div className="w-full max-w-sm relative">
      {/* Character */}
      <div
        ref={characterRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-32 h-40 select-none"
        style={{ filter: `drop-shadow(0 6px 14px ${primary}40)` }}
      >
        <BusinessCharacter
          isPasswordFocused={isPasswordFocused}
          eyePos={eyePos}
        />
      </div>

      {/* Card */}
      <div className="mt-16 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div
          className="px-8 pt-24 pb-5 text-center text-white"
          style={{
            background: `linear-gradient(to right, ${primary}, ${dark})`,
          }}
        >
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" />
                <circle cx="17.5" cy="17.5" r="3.5" fill="white" />
              </svg>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg leading-tight tracking-wide">
                تطوير
              </div>
              <div className="text-white/70 text-[10px] tracking-widest font-medium uppercase">
                Tatweer ERP
              </div>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="px-7 pt-5 pb-7">
          <h1 className="text-lg font-bold text-slate-800 text-center mb-0.5">
            مرحباً بك
          </h1>
          <p className="text-slate-500 text-xs text-center mb-5">
            سجّل الدخول للمتابعة إلى لوحة التحكم
          </p>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: light }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: primary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-semibold text-sm" style={{ color: primary }}>
                تم تسجيل الدخول بنجاح!
              </p>
              <p className="text-slate-400 text-xs">
                جارٍ التحويل إلى لوحة التحكم…
              </p>
            </div>
          ) : step === "branch" ? (
            <div className="space-y-2.5">
              <div className="text-center mb-4">
                <h2 className="text-base font-bold text-slate-800">
                  اختر الفرع
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  حدد الفرع الذي تريد الدخول إليه
                </p>
              </div>
              {loginBranches.map(branch => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleBranchSelect(branch)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-150 text-left"
                  onMouseEnter={e =>
                    (e.currentTarget.style.borderColor = primary)
                  }
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(to bottom right, ${primary}, ${dark})`,
                    }}
                  >
                    {branch.code}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="font-semibold text-sm text-slate-800">
                      {branch.name}
                    </div>
                    <div className="text-xs text-slate-400">{branch.code}</div>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-300 flex-shrink-0 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors pt-2 flex items-center justify-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                رجوع
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="email"
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <InputIcon>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </InputIcon>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors(p => ({ ...p, email: undefined }));
                    }}
                    placeholder="you@company.com"
                    className={inputCls(!!errors.email)}
                    dir="ltr"
                  />
                </div>
                {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="password"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <InputIcon>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </InputIcon>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors(p => ({ ...p, password: undefined }));
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="••••••••"
                    className={`${inputCls(!!errors.password)} pr-11`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-end pt-0.5">
                <a
                  href="#"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: primary }}
                  onClick={e => e.preventDefault()}
                >
                  نسيت كلمة المرور؟
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 mt-1"
                style={{
                  background: `linear-gradient(to right, ${primary}, ${dark})`,
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    جارٍ تسجيل الدخول…
                  </>
                ) : (
                  <>
                    تسجيل الدخول
                    <svg
                      className="w-4 h-4 rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} تطوير ERP &nbsp;·&nbsp; نظام آمن
            للمؤسسات &nbsp;·&nbsp;
            <a
              href="#"
              className="hover:text-slate-600 transition-colors"
              onClick={e => e.preventDefault()}
            >
              سياسة الخصوصية
            </a>
          </p>
        </div>
      </div>

      {/* Vision 2030 badge */}
      <p className="text-center text-[10px] text-slate-400 mt-4 tracking-wide">
        المملكة العربية السعودية &nbsp;·&nbsp; رؤية ٢٠٣٠
      </p>
    </div>
  );

  // ── Design 1: Classic split (illustration + form) ────────────────────────
  if (design === 1)
    return (
      <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {settingsUI}
        <div className="relative lg:w-[55%] h-52 lg:h-auto flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0">
            <SaudiIllustration />
          </div>
          <div className="hidden lg:block absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white/10" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 py-10 lg:py-0">
          {formCard}
        </div>
      </div>
    );

  // ── Design 2: Centered card on light gradient ────────────────────────────
  if (design === 2)
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 py-10"
        style={{
          background: `linear-gradient(135deg, ${light} 0%, #ffffff 55%, ${light}99 100%)`,
        }}
      >
        {settingsUI}
        {formCard}
      </div>
    );

  // ── Design 3: Bold colored background ───────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${dark} 100%)`,
      }}
    >
      {settingsUI}
      {formCard}
    </div>
  );
}

// ─── Inline error message component ──────────────────────────────────────────
function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg
        className="w-3 h-3 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </p>
  );
}
