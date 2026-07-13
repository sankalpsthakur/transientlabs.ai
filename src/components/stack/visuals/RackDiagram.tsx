'use client';

import { useId } from 'react';
import { m, MotionValue, useTransform } from 'framer-motion';

interface RackDiagramProps {
  progress: MotionValue<number>;
  accent?: string;
}

const RACKS = Array.from({ length: 8 }, (_, i) => ({
  x: 95 + (i % 4) * 60,
  y: 95 + Math.floor(i / 4) * 90,
  delay: (i % 3) * 0.1,
}));

/** Scroll-scrubbed power-in / heat-out rack diagram. */
export function RackDiagram({
  progress,
  accent = '#E8A87C',
}: RackDiagramProps) {
  const uid = useId();
  const zoom = useTransform(progress, [0, 0.25], [0.85, 1]);
  const roof = useTransform(progress, [0.1, 0.35], [1, 0]);
  const roofY = useTransform(roof, (v) => (1 - v) * -30);
  const power = useTransform(progress, [0.3, 0.6], [0, 1]);
  const heat = useTransform(progress, [0.45, 0.75], [0, 1]);
  const scaleCmp = useTransform(progress, [0.65, 0.95], [0, 1]);
  const mw = useTransform(progress, [0.3, 0.9], [12, 120]);
  const mwText = useTransform(mw, (v) => `${Math.round(v)} MW`);
  const blades = useTransform(power, (v) => v);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <m.div style={{ scale: zoom }} className="origin-center">
        <svg viewBox="0 0 420 360" className="h-auto w-full" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-power`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5CE1A8" stopOpacity="0" />
              <stop offset="50%" stopColor="#5CE1A8" />
              <stop offset="100%" stopColor="#5CE1A8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-heat`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>

          <rect
            x="70"
            y="60"
            width="280"
            height="220"
            rx="6"
            fill="#1a1612"
            stroke="rgba(232,168,124,0.35)"
            strokeWidth="1.5"
          />

          <m.rect
            x="70"
            y="48"
            width="280"
            height="18"
            rx="3"
            fill="#2a221c"
            style={{ opacity: roof, y: roofY }}
          />

          {RACKS.map((rack, i) => (
            <g key={i}>
              <rect
                x={rack.x}
                y={rack.y}
                width="42"
                height="70"
                rx="2"
                fill="#0d0b09"
                stroke="rgba(255,255,255,0.08)"
              />
              <m.g style={{ opacity: blades }}>
                {Array.from({ length: 6 }, (_, s) => (
                  <rect
                    key={s}
                    x={rack.x + 6}
                    y={rack.y + 8 + s * 10}
                    width="30"
                    height="4"
                    rx="1"
                    fill={accent}
                    opacity={0.45 + s * 0.08}
                  />
                ))}
              </m.g>
            </g>
          ))}

          <m.g style={{ opacity: power }}>
            <path
              d="M20 180 H70"
              stroke={`url(#${uid}-power)`}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="18"
              y="168"
              fill="#5CE1A8"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              POWER IN
            </text>
          </m.g>

          <m.g style={{ opacity: heat }}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${140 + i * 50} 60 Q${150 + i * 50} 30 ${160 + i * 50} 20`}
                fill="none"
                stroke={`url(#${uid}-heat)`}
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.5 + i * 0.15}
              />
            ))}
            <text
              x="300"
              y="36"
              fill={accent}
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              HEAT OUT
            </text>
          </m.g>

          <m.g style={{ opacity: scaleCmp }}>
            <rect
              x="100"
              y="300"
              width="220"
              height="40"
              rx="4"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4 3"
            />
            <text
              x="210"
              y="325"
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui"
            >
              campus footprint ≈ stadium scale
            </text>
          </m.g>
        </svg>
      </m.div>

      <m.div
        className="mt-2 text-center font-mono text-sm"
        style={{ opacity: power, color: accent }}
      >
        <m.span>{mwText}</m.span>
        <span className="ml-2 text-white/40">facility draw (illustrative)</span>
      </m.div>
    </div>
  );
}
