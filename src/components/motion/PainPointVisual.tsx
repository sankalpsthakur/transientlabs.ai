'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type PainPointKind =
  | 'privacy'
  | 'scale'
  | 'automation'
  | 'success'
  | 'vendor'
  | 'quality';

const stroke = 'rgba(255,255,255,0.55)';
const muted = 'rgba(255,255,255,0.25)';

function SvgShell({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox="0 0 120 60"
      className={cn('w-full h-14', className)}
      fill="none"
    >
      {children}
    </svg>
  );
}

function Privacy({ reduced }: { reduced: boolean }) {
  const pass = reduced ? { cx: 92 } : { cx: [18, 92] };
  const block = reduced ? { cx: 55, opacity: 0.9 } : { cx: [18, 55], opacity: [0, 1, 0] };

  return (
    <>
      {/* Pipe */}
      <path d="M10 30H110" stroke={muted} strokeWidth="2" strokeLinecap="round" />

      {/* Shield */}
      <path
        d="M60 10c8 5 16 5 16 5v14c0 10-8 18-16 21-8-3-16-11-16-21V15s8 0 16-5Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <rect x="56" y="24" width="8" height="8" rx="2" stroke={stroke} strokeWidth="2" />
      <path d="M58 24v-2a2 2 0 0 1 4 0v2" stroke={stroke} strokeWidth="2" />

      {/* Data packets */}
      <m.circle
        r="3"
        cy="30"
        fill="rgba(52,211,153,0.9)"
        initial={false}
        animate={pass}
        transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <m.circle
        r="3"
        cy="30"
        fill="rgba(248,113,113,0.9)"
        initial={false}
        animate={block}
        transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
    </>
  );
}

function Scale({ reduced }: { reduced: boolean }) {
  const needle = reduced ? { rotate: -10 } : { rotate: [-35, 25, -10] };
  const bars = reduced ? { scaleY: 1 } : { scaleY: [0.5, 1, 0.8] };

  return (
    <>
      {/* Gauge arc */}
      <path d="M25 42a35 35 0 0 1 70 0" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <path d="M30 42a30 30 0 0 1 60 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

      {/* Needle */}
      <m.g
        style={{ transformOrigin: '60px 42px' }}
        initial={false}
        animate={needle}
        transition={{ duration: 2.2, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <line x1="60" y1="42" x2="86" y2="30" stroke="rgba(96,165,250,0.9)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="42" r="3" fill="rgba(96,165,250,0.9)" />
      </m.g>

      {/* Cost/latency bars */}
      <g transform="translate(20 10)">
        {Array.from({ length: 6 }).map((_, i) => (
          <m.rect
            key={i}
            x={i * 6}
            y={18 - i}
            width="4"
            height={10 + i}
            rx="1"
            fill="rgba(255,255,255,0.18)"
            initial={false}
            animate={bars}
            transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: i * 0.05 }}
          />
        ))}
      </g>
    </>
  );
}

function Automation({ reduced }: { reduced: boolean }) {
  const path = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0, 1] };
  const check = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0, 1] };

  return (
    <>
      {/* Steps */}
      {[24, 60, 96].map((x) => (
        <circle key={x} cx={x} cy="30" r="10" stroke={stroke} strokeWidth="2" />
      ))}
      <m.path
        d="M34 30H50M70 30H86"
        stroke={muted}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={path}
        transition={{ duration: 0.9, ease: 'easeOut', repeat: reduced ? 0 : 0 }}
      />

      {/* Checks */}
      {[24, 60, 96].map((x, idx) => (
        <m.path
          key={x}
          d={`M${x - 4} 30l3 3 6-7`}
          stroke="rgba(52,211,153,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={check}
          transition={{ duration: 0.35, delay: reduced ? 0 : 0.15 * idx, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

function Success({ reduced }: { reduced: boolean }) {
  const line = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const pulse = reduced ? { opacity: 1, scale: 1 } : { opacity: [0.4, 1, 0.4], scale: [1, 1.15, 1] };

  return (
    <>
      {/* Axis */}
      <path d="M18 46V14M18 46H104" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      {/* Trend */}
      <m.path
        d="M18 40C34 38 38 32 50 30s18 8 28 6 16-14 26-18"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={line}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
      <m.circle
        cx="104"
        cy="18"
        r="4"
        fill="rgba(52,211,153,0.9)"
        initial={false}
        animate={pulse}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

function Vendor({ reduced }: { reduced: boolean }) {
  const red = reduced ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] };
  const reroute = reduced ? { opacity: 0.6 } : { opacity: [0.2, 0.9, 0.2] };

  return (
    <>
      {/* Nodes */}
      <circle cx="30" cy="18" r="7" stroke={stroke} strokeWidth="2" />
      <circle cx="30" cy="42" r="7" stroke={stroke} strokeWidth="2" />
      <m.circle
        cx="30"
        cy="30"
        r="7"
        stroke="rgba(248,113,113,0.9)"
        strokeWidth="2"
        initial={false}
        animate={red}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <rect x="56" y="24" width="10" height="12" rx="2" stroke={stroke} strokeWidth="2" />
      <circle cx="92" cy="30" r="9" stroke={stroke} strokeWidth="2" />

      {/* Links */}
      <path d="M37 18H56M37 42H56" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <m.path
        d="M37 30H56"
        stroke="rgba(248,113,113,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={red}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      />
      <m.path
        d="M66 30H83"
        stroke="rgba(96,165,250,0.65)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={reroute}
        transition={{ duration: 1.8, repeat: reduced ? 0 : Infinity, ease: 'easeInOut', delay: 0.1 }}
      />
    </>
  );
}

function Quality({ reduced }: { reduced: boolean }) {
  const draw = reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1], opacity: [0.2, 1] };
  const recover = reduced ? { y: 0 } : { y: [0, -2, 0] };

  return (
    <>
      <path d="M18 46V14M18 46H104" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <m.path
        d="M18 24c16 0 22 18 34 18s14-14 28-14 10 8 24 8"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={draw}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />

      {/* Eye */}
      <m.g
        initial={false}
        animate={recover}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M60 18c10 0 18 8 18 8s-8 8-18 8-18-8-18-8 8-8 18-8Z"
          stroke="rgba(96,165,250,0.75)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="60" cy="26" r="3" fill="rgba(96,165,250,0.9)" />
      </m.g>
    </>
  );
}

export function PainPointVisual({
  kind,
  ariaLabel,
  className,
}: {
  kind: PainPointKind;
  ariaLabel: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;

  const content = (() => {
    switch (kind) {
      case 'privacy':
        return <Privacy reduced={reduced} />;
      case 'scale':
        return <Scale reduced={reduced} />;
      case 'automation':
        return <Automation reduced={reduced} />;
      case 'success':
        return <Success reduced={reduced} />;
      case 'vendor':
        return <Vendor reduced={reduced} />;
      case 'quality':
        return <Quality reduced={reduced} />;
      default:
        return null;
    }
  })();

  return (
    <SvgShell ariaLabel={ariaLabel} className={className}>
      {content}
    </SvgShell>
  );
}
