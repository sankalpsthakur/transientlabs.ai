'use client';

import { useId } from 'react';
import { m, MotionValue, useTransform } from 'framer-motion';

interface OrbitGlobeProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

const SAT_POSITIONS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  return {
    x: 200 + Math.cos(angle) * 140,
    y: 200 + Math.sin(angle) * 52,
    opacityFactor: 0.35 + (i % 5) * 0.12,
  };
});

/** SVG globe with scroll-populated satellite shells — no WebGL required. */
export function OrbitGlobe({
  progress,
  accent = '#7EA2FF',
  reduced = false,
}: OrbitGlobeProps) {
  const uid = useId();
  const rot = useTransform(progress, [0, 1], [0, 120]);
  const shell1 = useTransform(progress, [0.05, 0.3], [0, 1]);
  const shell2 = useTransform(progress, [0.2, 0.5], [0, 1]);
  const shell3 = useTransform(progress, [0.4, 0.7], [0, 1]);
  const beam = useTransform(progress, [0.55, 0.85], [0, 1]);
  const count = useTransform(progress, [0.1, 0.9], [200, 7200]);
  const countText = useTransform(count, (v) =>
    reduced ? '7,000+' : `${Math.round(v).toLocaleString()}`
  );
  const satOpacity = useTransform(shell2, (v) => v);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-globe`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="55%" stopColor="#0B1220" />
            <stop offset="100%" stopColor="#05080f" />
          </radialGradient>
          <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[70, 100, 130].map((r, i) => (
          <m.ellipse
            key={r}
            cx="200"
            cy="200"
            rx={r + 40}
            ry={r * 0.38 + 18}
            fill="none"
            stroke={accent}
            strokeWidth="0.8"
            style={{
              opacity: [shell1, shell2, shell3][i],
              rotate: rot,
              transformOrigin: '200px 200px',
            }}
            strokeDasharray="4 6"
          />
        ))}

        <circle cx="200" cy="200" r="78" fill={`url(#${uid}-globe)`} />
        <ellipse
          cx="200"
          cy="200"
          rx="78"
          ry="78"
          fill="none"
          stroke="rgba(126,162,255,0.25)"
          strokeWidth="1"
        />
        <path
          d="M155 175c12-18 38-22 52-8 10 10 8 28-4 36-14 10-36 6-48-8z"
          fill="rgba(94,120,180,0.35)"
        />
        <path
          d="M210 210c18-6 40 4 36 22-4 16-28 20-42 8-10-8-8-24 6-30z"
          fill="rgba(94,120,180,0.28)"
        />

        <m.g style={{ opacity: satOpacity }}>
          {SAT_POSITIONS.map((sat, i) => (
            <circle
              key={i}
              cx={sat.x}
              cy={sat.y}
              r="2.2"
              fill={accent}
              opacity={sat.opacityFactor}
            />
          ))}
        </m.g>

        <m.path
          d="M200 200 L155 340 L245 340 Z"
          fill={`url(#${uid}-beam)`}
          style={{ opacity: beam }}
        />
      </svg>

      <m.div
        className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 font-mono text-sm text-white backdrop-blur-sm"
        style={{ opacity: shell1 }}
      >
        <m.span>{countText}</m.span>
        <span className="ml-2 text-white/50">sats</span>
      </m.div>
    </div>
  );
}
