'use client';

import { MotionValue, m, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AgentId = 'sniper' | 'pulse' | 'vector' | 'spectre';

function DiagramShell({
  children,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox="0 0 160 90"
      className={cn('w-full h-full', className)}
      fill="none"
    >
      {children}
    </svg>
  );
}

function Sniper({ p }: { p: MotionValue<number> }) {
  const prd = useTransform(p, [0.15, 0.6], [0, 1]);
  const clean = useTransform(p, [0.3, 0.75], [0, 1]);
  return (
    <>
      <m.path
        d="M14 26c18-10 32-8 48-2s24 6 38-2 26-10 46 2"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: prd }}
      />
      <m.rect
        x="16"
        y="44"
        width="58"
        height="34"
        rx="8"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.04)"
        initial={false}
        style={{ opacity: prd }}
      />
      <m.path
        d="M24 54h34M24 62h42M24 70h28"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: prd }}
      />

      <m.rect
        x="88"
        y="34"
        width="56"
        height="44"
        rx="10"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.04)"
        initial={false}
        style={{ opacity: clean }}
      />
      <m.path
        d="M96 44h30M96 52h42M96 60h26"
        stroke="rgba(52,211,153,0.75)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: clean }}
      />
    </>
  );
}

function Pulse({ p }: { p: MotionValue<number> }) {
  const flow = useTransform(p, [0.15, 0.55], [0, 1]);
  const cards = useTransform(p, [0.45, 0.85], [0, 1]);
  return (
    <>
      {/* Chat stream */}
      <m.rect
        x="16"
        y="18"
        width="64"
        height="50"
        rx="10"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.03)"
        initial={false}
        style={{ opacity: flow }}
      />
      {Array.from({ length: 4 }).map((_, i) => (
        <m.rect
          key={i}
          x={24}
          y={26 + i * 10}
          width={44 - (i % 2) * 10}
          height="6"
          rx="3"
          fill="rgba(255,255,255,0.12)"
          initial={false}
          style={{ opacity: flow }}
        />
      ))}

      {/* Funnel */}
      <m.path
        d="M86 22h58l-20 20v28l-18 10V42L86 22Z"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.02)"
        initial={false}
        style={{ pathLength: flow }}
      />

      {/* Insight cards */}
      <m.g initial={false} style={{ opacity: cards }}>
        <rect x="92" y="50" width="26" height="18" rx="6" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.35)" />
        <rect x="118" y="46" width="26" height="18" rx="6" fill="rgba(34,211,238,0.10)" stroke="rgba(34,211,238,0.25)" />
        <rect x="106" y="68" width="28" height="16" rx="6" fill="rgba(34,211,238,0.10)" stroke="rgba(34,211,238,0.25)" />
      </m.g>
    </>
  );
}

function Vector({ p }: { p: MotionValue<number> }) {
  const draw = useTransform(p, [0.1, 0.55], [0, 1]);
  const gate = useTransform(p, [0.55, 0.9], [0, 1]);
  return (
    <>
      {/* Orchestrator */}
      <m.circle
        cx="54"
        cy="46"
        r="16"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.03)"
        initial={false}
        style={{ pathLength: draw }}
      />
      <m.path
        d="M42 46h24M54 34v24"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: draw }}
      />

      {/* Tool nodes */}
      {[{ x: 102, y: 24 }, { x: 128, y: 46 }, { x: 102, y: 68 }].map((n, idx) => (
        <m.g key={idx} initial={false} style={{ opacity: draw }}>
          <circle cx={n.x} cy={n.y} r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
        </m.g>
      ))}
      <m.path
        d="M70 40L92 30M70 46H116M70 52L92 62"
        stroke="rgba(59,130,246,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: draw }}
      />

      {/* Human review gate */}
      <m.rect
        x="18"
        y="18"
        width="22"
        height="56"
        rx="10"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        fill="rgba(245,158,11,0.08)"
        initial={false}
        style={{ opacity: gate }}
      />
      <m.path
        d="M28 32v28"
        stroke="rgba(245,158,11,0.45)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: gate }}
      />
    </>
  );
}

function Spectre({ p }: { p: MotionValue<number> }) {
  const draw = useTransform(p, [0.12, 0.55], [0, 1]);
  const flags = useTransform(p, [0.45, 0.9], [0, 1]);
  return (
    <>
      {/* Messy inputs */}
      <m.path
        d="M18 28c8-8 18 6 26-2s18-6 26 2"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: draw }}
      />
      <m.path
        d="M18 44c10-10 22 8 34-2s18-8 26 4"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        style={{ pathLength: draw }}
      />

      {/* Personas */}
      <m.g initial={false} style={{ opacity: draw }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <circle key={i} cx={92 + i * 18} cy="34" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
        ))}
      </m.g>

      {/* Pass/fail */}
      <m.g initial={false} style={{ opacity: flags }}>
        <path d="M84 64h14" stroke="rgba(34,197,94,0.8)" strokeWidth="3" strokeLinecap="round" />
        <path d="M110 58l10 10M120 58l-10 10" stroke="rgba(248,113,113,0.8)" strokeWidth="3" strokeLinecap="round" />
        <path d="M140 64h14" stroke="rgba(34,197,94,0.8)" strokeWidth="3" strokeLinecap="round" />
      </m.g>
    </>
  );
}

export function AgentDiagram({
  agentId,
  progress,
  ariaLabel,
  className,
}: {
  agentId: AgentId;
  progress: MotionValue<number>;
  ariaLabel: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const reducedProgress = useMotionValue(0.8);
  const p = reduced ? reducedProgress : progress;

  const inner = (() => {
    switch (agentId) {
      case 'sniper':
        return <Sniper p={p} />;
      case 'pulse':
        return <Pulse p={p} />;
      case 'vector':
        return <Vector p={p} />;
      case 'spectre':
        return <Spectre p={p} />;
      default:
        return null;
    }
  })();

  return (
    <DiagramShell
      ariaLabel={ariaLabel}
      className={cn('max-w-full', className)}
    >
      {inner}
    </DiagramShell>
  );
}
