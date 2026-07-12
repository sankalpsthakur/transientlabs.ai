'use client';

import { useId } from 'react';
import { m, MotionValue, useTransform } from 'framer-motion';

interface SensorStackProps {
  progress: MotionValue<number>;
  accent?: string;
}

const POINT_DOTS = Array.from({ length: 20 }, (_, i) => ({
  x: 270 + (i % 8) * 18,
  y: 50 + Math.floor(i / 8) * 22,
  opacity: 0.5 + (i % 3) * 0.15,
}));

/** Exploded sensor suite assembling onto vehicle + vision overlay. */
export function SensorStack({
  progress,
  accent = '#C4A1FF',
}: SensorStackProps) {
  const uid = useId();
  const body = useTransform(progress, [0, 0.2], [0, 1]);
  const lidar = useTransform(progress, [0.15, 0.35], [0, 1]);
  const lidarY = useTransform(lidar, (v) => (1 - v) * -40);
  const cams = useTransform(progress, [0.3, 0.5], [0, 1]);
  const camY = useTransform(cams, (v) => (1 - v) * -24);
  const radar = useTransform(progress, [0.4, 0.6], [0, 1]);
  const vision = useTransform(progress, [0.55, 0.8], [0, 1]);
  const decision = useTransform(progress, [0.75, 0.95], [0, 1]);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <svg viewBox="0 0 440 360" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-car`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2430" />
            <stop offset="100%" stopColor="#141018" />
          </linearGradient>
          <radialGradient id={`${uid}-scan`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <m.g style={{ opacity: vision }}>
          <rect
            x="260"
            y="40"
            width="160"
            height="120"
            rx="6"
            fill="#0a080c"
            stroke="rgba(196,161,255,0.3)"
          />
          <rect x="275" y="90" width="40" height="50" rx="2" fill="rgba(94,180,120,0.5)" />
          <rect x="330" y="100" width="50" height="40" rx="2" fill="rgba(80,120,200,0.45)" />
          <rect x="280" y="55" width="100" height="30" rx="2" fill="rgba(200,160,80,0.35)" />
          {POINT_DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r="1.5"
              fill={accent}
              opacity={d.opacity}
            />
          ))}
          <text
            x="340"
            y="175"
            textAnchor="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            what the car sees
          </text>
        </m.g>

        <m.g style={{ opacity: body }}>
          <path
            d="M80 220 L110 180 L200 170 L280 180 L310 220 L300 250 L90 250 Z"
            fill={`url(#${uid}-car)`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />
          <rect x="130" y="185" width="50" height="28" rx="4" fill="rgba(126,162,255,0.15)" />
          <rect x="200" y="185" width="50" height="28" rx="4" fill="rgba(126,162,255,0.15)" />
          <circle cx="130" cy="250" r="16" fill="#0d0b10" stroke="rgba(255,255,255,0.2)" />
          <circle cx="260" cy="250" r="16" fill="#0d0b10" stroke="rgba(255,255,255,0.2)" />
        </m.g>

        <m.g style={{ opacity: lidar, y: lidarY }}>
          <ellipse cx="195" cy="155" rx="18" ry="10" fill={accent} opacity="0.85" />
          <ellipse cx="195" cy="155" rx="55" ry="22" fill={`url(#${uid}-scan)`} />
          <text
            x="195"
            y="130"
            textAnchor="middle"
            fill={accent}
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            lidar
          </text>
        </m.g>

        <m.g style={{ opacity: cams, y: camY }}>
          {[100, 160, 220, 280].map((x) => (
            <rect key={x} x={x} y="172" width="12" height="8" rx="1" fill="#7EA2FF" />
          ))}
          <text
            x="340"
            y="200"
            fill="#7EA2FF"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            cameras
          </text>
        </m.g>

        <m.g style={{ opacity: radar }}>
          <rect x="88" y="210" width="16" height="10" rx="2" fill="#5CE1A8" />
          <rect x="286" y="210" width="16" height="10" rx="2" fill="#5CE1A8" />
          <path
            d="M96 210 Q70 190 60 160"
            fill="none"
            stroke="#5CE1A8"
            strokeWidth="1"
            opacity="0.5"
          />
          <text
            x="50"
            y="150"
            fill="#5CE1A8"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            radar
          </text>
        </m.g>

        <m.g style={{ opacity: decision }}>
          <circle cx="195" cy="300" r="8" fill={accent} />
          <line x1="195" y1="308" x2="150" y2="335" stroke={accent} strokeWidth="1.2" />
          <line x1="195" y1="308" x2="240" y2="335" stroke={accent} strokeWidth="1.2" />
          <circle cx="150" cy="340" r="6" fill="none" stroke={accent} />
          <circle cx="240" cy="340" r="6" fill="none" stroke={accent} />
          <text
            x="195"
            y="360"
            textAnchor="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            predict → plan → act
          </text>
        </m.g>
      </svg>
    </div>
  );
}
