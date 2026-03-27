'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TechPatternType =
  | 'citations'
  | 'evals'
  | 'structured'
  | 'cost'
  | 'observability'
  | 'workflows';

const stroke = 'rgba(0,0,0,0.55)';
const muted = 'rgba(0,0,0,0.18)';

function Shell({
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
      viewBox="0 0 140 72"
      className={cn('w-full h-20', className)}
      fill="none"
    >
      {children}
    </svg>
  );
}

function Citations({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const pulse = reduced ? { opacity: 1, scale: 1 } : { opacity: [0.35, 1, 0.35], scale: [1, 1.12, 1] };

  return (
    <>
      {/* Doc */}
      <rect x="10" y="16" width="26" height="40" rx="4" stroke={stroke} strokeWidth="2" />
      <path d="M16 26h14M16 34h18M16 42h12" stroke={muted} strokeWidth="2" strokeLinecap="round" />

      {/* Brain-ish node */}
      <m.circle
        cx="70"
        cy="36"
        r="16"
        stroke={stroke}
        strokeWidth="2"
        initial={false}
        animate={draw}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <path d="M62 36h16" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <path d="M70 28v16" stroke={muted} strokeWidth="2" strokeLinecap="round" />

      {/* Output */}
      <rect x="104" y="24" width="26" height="24" rx="4" stroke={stroke} strokeWidth="2" />
      <m.path
        d="M36 36H54"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      />
      <m.path
        d="M86 36H104"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Citations */}
      {[0, 1].map((i) => (
        <m.circle
          key={i}
          cx={116 + i * 10}
          cy="52"
          r="3"
          fill="rgba(34,197,94,0.8)"
          initial={false}
          animate={pulse}
          transition={{ duration: 1.8, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
      ))}
    </>
  );
}

function Evals({ reduced }: { reduced: boolean }) {
  const needle = reduced ? { rotate: 18 } : { rotate: [-10, 28, 18] };
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };

  return (
    <>
      <rect x="12" y="18" width="36" height="36" rx="6" stroke={stroke} strokeWidth="2" />
      <path d="M18 30h18M18 38h22" stroke={muted} strokeWidth="2" strokeLinecap="round" />

      <rect x="56" y="24" width="28" height="24" rx="5" stroke={stroke} strokeWidth="2" />
      <m.path
        d="M48 36H56"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      />
      <m.path
        d="M84 36H96"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Gauge */}
      <path d="M96 52a20 20 0 0 1 40 0" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <path d="M100 52a16 16 0 0 1 32 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <m.g
        style={{ transformOrigin: '116px 52px' }}
        initial={false}
        animate={needle}
        transition={{ duration: 2.0, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <line x1="116" y1="52" x2="128" y2="44" stroke="rgba(34,197,94,0.85)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="116" cy="52" r="3" fill="rgba(34,197,94,0.85)" />
      </m.g>
    </>
  );
}

function Structured({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const check = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0, 1] };

  return (
    <>
      <rect x="16" y="16" width="44" height="40" rx="6" stroke={stroke} strokeWidth="2" />
      <path d="M26 28h24M26 36h18M26 44h22" stroke={muted} strokeWidth="2" strokeLinecap="round" />

      {/* Curly braces */}
      <m.path
        d="M76 22c-6 0-6 6-6 6v6c0 6-6 6-6 6s6 0 6 6v6s0 6 6 6"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={draw}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <m.path
        d="M102 22c6 0 6 6 6 6v6c0 6 6 6 6 6s-6 0-6 6v6s0 6-6 6"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={draw}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.08 }}
      />

      {/* Checks */}
      {[86, 104, 122].map((x, idx) => (
        <m.path
          key={x}
          d={`M${x - 4} 40l3 3 6-7`}
          stroke="rgba(34,197,94,0.85)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={check}
          transition={{ duration: 0.35, delay: reduced ? 0 : 0.15 + idx * 0.1, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

function Cost({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const fill = reduced ? { width: '70%' } : { width: ['35%', '78%', '70%'] };

  return (
    <>
      <rect x="16" y="18" width="108" height="16" rx="8" stroke={stroke} strokeWidth="2" />
      <m.rect
        x="18"
        y="20"
        height="12"
        rx="6"
        fill="rgba(34,197,94,0.35)"
        initial={false}
        animate={fill}
        transition={{ duration: 2.2, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <m.path
        d="M16 48h108"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <m.path
        d="M28 54h24M68 54h40"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
      />
    </>
  );
}

function Observability({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const loop = reduced ? { rotate: 0 } : { rotate: [0, 360] };

  return (
    <>
      <rect x="14" y="16" width="112" height="40" rx="8" stroke={stroke} strokeWidth="2" />
      <m.path
        d="M22 44c10-12 22-10 34-8s20 10 34 6 18-14 28-18"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={draw}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />
      <m.g
        style={{ transformOrigin: '38px 30px' }}
        initial={false}
        animate={loop}
        transition={{ duration: 6, repeat: reduced ? 0 : Infinity, ease: 'linear' }}
      >
        <path
          d="M38 22a8 8 0 1 1-7 4"
          stroke="rgba(14,165,233,0.65)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M30 26l2 6-6-1" fill="rgba(14,165,233,0.65)" />
      </m.g>
    </>
  );
}

function Workflows({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const flip = reduced ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] };

  return (
    <>
      {[20, 60, 100].map((x) => (
        <rect key={x} x={x} y="22" width="20" height="20" rx="6" stroke={stroke} strokeWidth="2" />
      ))}
      <m.path
        d="M40 32h20M80 32h20"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={draw}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <m.path
        d="M66 26l6 6-6 6"
        stroke="rgba(248,113,113,0.8)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={flip}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <m.path
        d="M66 48c0 10 16 10 16 0"
        stroke="rgba(34,197,94,0.8)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={draw}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
      />
    </>
  );
}

export function TechPatternVisual({
  type,
  ariaLabel,
  className,
}: {
  type: TechPatternType;
  ariaLabel: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;

  const inner = (() => {
    switch (type) {
      case 'citations':
        return <Citations reduced={reduced} />;
      case 'evals':
        return <Evals reduced={reduced} />;
      case 'structured':
        return <Structured reduced={reduced} />;
      case 'cost':
        return <Cost reduced={reduced} />;
      case 'observability':
        return <Observability reduced={reduced} />;
      case 'workflows':
        return <Workflows reduced={reduced} />;
      default:
        return null;
    }
  })();

  return (
    <Shell ariaLabel={ariaLabel} className={className}>
      {inner}
    </Shell>
  );
}
