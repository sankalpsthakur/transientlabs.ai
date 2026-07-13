'use client';

import { useId } from 'react';
import { m, MotionValue, useTransform } from 'framer-motion';

interface CellAssemblyProps {
  progress: MotionValue<number>;
  accent?: string;
}

/** Scroll-assembled cell layers → pack → cost curve. */
export function CellAssembly({
  progress,
  accent = '#F0C75E',
}: CellAssemblyProps) {
  const uid = useId();
  const anode = useTransform(progress, [0.05, 0.2], [0, 1]);
  const anodeY = useTransform(anode, (v) => (1 - v) * 20);
  const sep = useTransform(progress, [0.15, 0.3], [0, 1]);
  const sepY = useTransform(sep, (v) => (1 - v) * 16);
  const cathode = useTransform(progress, [0.25, 0.4], [0, 1]);
  const cathodeY = useTransform(cathode, (v) => (1 - v) * 12);
  const roll = useTransform(progress, [0.35, 0.55], [0, 1]);
  const pack = useTransform(progress, [0.5, 0.7], [0, 1]);
  const curve = useTransform(progress, [0.65, 0.95], [0, 1]);
  const cost = useTransform(progress, [0.65, 0.95], [1200, 100]);
  const costText = useTransform(cost, (v) => `$${Math.round(v)}/kWh`);

  const pathLen = 280;
  const dash = useTransform(curve, (v) => pathLen * (1 - v));

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <svg viewBox="0 0 440 380" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-anode`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b8cae" />
            <stop offset="100%" stopColor="#3d5670" />
          </linearGradient>
          <linearGradient id={`${uid}-cath`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#a8842e" />
          </linearGradient>
        </defs>

        <m.rect
          x="40"
          y="80"
          width="100"
          height="28"
          rx="3"
          fill={`url(#${uid}-anode)`}
          style={{ opacity: anode, y: anodeY }}
        />
        <m.text
          x="150"
          y="98"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: anode }}
        >
          anode
        </m.text>

        <m.rect
          x="40"
          y="118"
          width="100"
          height="12"
          rx="2"
          fill="rgba(255,255,255,0.7)"
          style={{ opacity: sep, y: sepY }}
        />
        <m.text
          x="150"
          y="128"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: sep }}
        >
          separator
        </m.text>

        <m.rect
          x="40"
          y="140"
          width="100"
          height="28"
          rx="3"
          fill={`url(#${uid}-cath)`}
          style={{ opacity: cathode, y: cathodeY }}
        />
        <m.text
          x="150"
          y="158"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: cathode }}
        >
          cathode
        </m.text>

        <m.g style={{ opacity: roll }}>
          <ellipse
            cx="280"
            cy="130"
            rx="50"
            ry="50"
            fill="none"
            stroke={accent}
            strokeWidth="14"
            strokeDasharray="20 8"
          />
          <ellipse
            cx="280"
            cy="130"
            rx="28"
            ry="28"
            fill="none"
            stroke="#6b8cae"
            strokeWidth="10"
          />
          <circle cx="280" cy="130" r="10" fill="rgba(255,255,255,0.2)" />
          <text
            x="280"
            y="200"
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            jelly-roll → cell
          </text>
        </m.g>

        <m.g style={{ opacity: pack }}>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={60 + i * 48}
              y="230"
              width="40"
              height="48"
              rx="3"
              fill="#1a1610"
              stroke={accent}
              strokeWidth="1.2"
            />
          ))}
          <rect
            x="50"
            y="220"
            width="210"
            height="70"
            rx="6"
            fill="none"
            stroke="rgba(240,199,94,0.4)"
            strokeWidth="1.5"
          />
          <text
            x="155"
            y="310"
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            cells → module → pack
          </text>
        </m.g>

        <m.g style={{ opacity: curve }}>
          <line
            x1="300"
            y1="240"
            x2="300"
            y2="350"
            stroke="rgba(255,255,255,0.15)"
          />
          <line
            x1="300"
            y1="350"
            x2="420"
            y2="350"
            stroke="rgba(255,255,255,0.15)"
          />
          <m.path
            d="M300 250 Q330 255 350 290 T420 340"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={pathLen}
            style={{ strokeDashoffset: dash }}
          />
          <text
            x="360"
            y="230"
            fill={accent}
            fontSize="11"
            fontFamily="ui-monospace, monospace"
          >
            learning curve
          </text>
        </m.g>
      </svg>

      <m.div
        className="text-center font-mono text-sm"
        style={{ opacity: curve, color: accent }}
      >
        <m.span>{costText}</m.span>
        <span className="ml-2 text-white/40">illustrative cell cost descent</span>
      </m.div>
    </div>
  );
}
