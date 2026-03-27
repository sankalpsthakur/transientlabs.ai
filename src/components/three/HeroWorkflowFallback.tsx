'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const defaultAria =
  'AI product engineering workflow: interconnected systems with data flowing through strategy, design, engineering, and AI.';

export function HeroWorkflowFallback({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  const pulse = reduced ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] };

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'rounded-2xl border border-border bg-paper/70 backdrop-blur-sm p-5',
        className
      )}
    >
      <svg viewBox="0 0 320 140" className="w-full h-auto" fill="none">
        {/* Links */}
        <path d="M64 40H132" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
        <path d="M188 40H256" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
        <path d="M160 64V104" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />

        {/* Nodes */}
        {[
          { x: 24, y: 24, label: 'Strategy', c: 'rgba(14,165,233,0.8)' },
          { x: 132, y: 24, label: 'Design', c: 'rgba(34,197,94,0.8)' },
          { x: 240, y: 24, label: 'Engineering', c: 'rgba(168,85,247,0.8)' },
          { x: 132, y: 96, label: 'AI', c: 'rgba(245,158,11,0.85)' },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width="80"
              height="32"
              rx="10"
              fill="rgba(255,255,255,0.7)"
              stroke="rgba(0,0,0,0.18)"
            />
            <rect
              x={n.x}
              y={n.y}
              width="80"
              height="32"
              rx="10"
              fill="none"
              stroke={n.c}
              strokeWidth="1.5"
              opacity="0.7"
            />
            <text
              x={n.x + 40}
              y={n.y + 21}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="rgba(0,0,0,0.8)"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Packets */}
        <m.circle
          cx="64"
          cy="40"
          r="4"
          fill="rgba(0,0,0,0.45)"
          initial={false}
          animate={reduced ? { cx: 64 } : { cx: [64, 132] }}
          transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
        />
        <m.circle
          cx="188"
          cy="40"
          r="4"
          fill="rgba(0,0,0,0.45)"
          initial={false}
          animate={reduced ? { cx: 188 } : { cx: [188, 256] }}
          transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <m.circle
          cx="160"
          cy="64"
          r="4"
          fill="rgba(0,0,0,0.45)"
          initial={false}
          animate={reduced ? { cy: 64 } : { cy: [64, 104] }}
          transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: 0.35 }}
        />

        {/* Reliability badge */}
        <m.g
          initial={false}
          animate={pulse}
          transition={{ duration: 2.0, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
        >
          <circle cx="292" cy="112" r="14" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.18)" />
          <path
            d="M292 102c6 4 12 4 12 4v10c0 8-6 14-12 16-6-2-12-8-12-16v-10s6 0 12-4Z"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="2"
          />
        </m.g>
      </svg>
    </div>
  );
}
