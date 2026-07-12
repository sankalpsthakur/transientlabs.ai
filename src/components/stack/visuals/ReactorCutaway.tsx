'use client';

import { useId } from 'react';
import { m, MotionValue, useTransform } from 'framer-motion';

interface ReactorCutawayProps {
  progress: MotionValue<number>;
  accent?: string;
}

const NEUTRONS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const r = 55 + (i % 3) * 12;
  return {
    x: 180 + Math.cos(a) * r,
    y: 170 + Math.sin(a) * r,
    opacity: 0.4 + (i % 4) * 0.15,
  };
});

/** Layer-by-layer reactor de-shell + SMR vs GW footprint. */
export function ReactorCutaway({
  progress,
  accent = '#5CE1A8',
}: ReactorCutawayProps) {
  const uid = useId();
  const containment = useTransform(progress, [0.05, 0.3], [1, 0.15]);
  const vessel = useTransform(progress, [0.2, 0.45], [1, 0.25]);
  const core = useTransform(progress, [0.35, 0.6], [0.4, 1]);
  const particles = useTransform(progress, [0.4, 0.7], [0, 1]);
  const shrink = useTransform(progress, [0.65, 0.95], [1, 0.28]);
  const smrLabel = useTransform(progress, [0.7, 0.9], [0, 1]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 360 400" className="h-auto w-full" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <m.rect
          x="40"
          y="320"
          width="280"
          height="50"
          rx="4"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeDasharray="5 4"
          style={{ opacity: smrLabel }}
        />
        <m.text
          x="180"
          y="350"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: smrLabel }}
        >
          GW-scale civil footprint
        </m.text>

        <m.g style={{ scale: shrink, transformOrigin: '180px 180px' }}>
          <m.ellipse
            cx="180"
            cy="170"
            rx="120"
            ry="140"
            fill="rgba(20,40,32,0.9)"
            stroke={accent}
            strokeWidth="2"
            style={{ opacity: containment }}
          />

          <m.ellipse
            cx="180"
            cy="170"
            rx="78"
            ry="95"
            fill="rgba(18,30,26,0.95)"
            stroke="rgba(92,225,168,0.5)"
            strokeWidth="1.5"
            style={{ opacity: vessel }}
          />

          <m.circle
            cx="180"
            cy="170"
            r="42"
            fill={`url(#${uid}-core)`}
            style={{ opacity: core }}
          />
          <m.circle
            cx="180"
            cy="170"
            r="22"
            fill={accent}
            style={{ opacity: core }}
          />

          <m.g style={{ opacity: particles }}>
            {NEUTRONS.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r="2.5"
                fill={accent}
                opacity={n.opacity}
              />
            ))}
          </m.g>

          <m.text
            x="300"
            y="90"
            fill="rgba(255,255,255,0.55)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            style={{ opacity: containment }}
          >
            containment
          </m.text>
          <m.text
            x="268"
            y="150"
            fill="rgba(255,255,255,0.55)"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            style={{ opacity: vessel }}
          >
            vessel
          </m.text>
          <m.text
            x="210"
            y="175"
            fill="#0a120e"
            fontSize="10"
            fontWeight="600"
            fontFamily="ui-monospace, monospace"
            style={{ opacity: core }}
          >
            core
          </m.text>
        </m.g>

        <m.text
          x="180"
          y="390"
          textAnchor="middle"
          fill={accent}
          fontSize="12"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: smrLabel }}
        >
          SMR: same physics · factory module
        </m.text>
      </svg>
    </div>
  );
}
