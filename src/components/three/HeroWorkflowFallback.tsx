'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const defaultAria =
  'Orbital operating architecture: plant stack, finance match tiers, and batch evidence around a human approval gate.';

export function HeroWorkflowFallback({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('rounded-2xl border border-border bg-paper/70 p-5 backdrop-blur-sm', className)}
    >
      <svg viewBox="0 0 320 180" className="h-auto w-full" fill="none">
        <circle cx="160" cy="90" r="62" stroke="rgba(24,18,13,0.12)" />
        <circle cx="160" cy="90" r="40" stroke="rgba(24,18,13,0.1)" />
        {['Field', 'PLC', 'SCADA', 'MES', 'ERP'].map((label, i) => (
          <g key={label}>
            <rect x="18" y={16 + i * 30} width="72" height="22" rx="7" fill="white" stroke="rgba(31,63,147,0.45)" />
            <text x="54" y={31 + i * 30} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, Menlo, monospace" fill="#18120d">
              {label}
            </text>
          </g>
        ))}
        {['T1', 'T2', 'T3', 'T4'].map((label, i) => (
          <text key={label} x={248} y={40 + i * 28} fontSize="10" fontFamily="ui-monospace, Menlo, monospace" fill="#8b5e34">
            {label}
          </text>
        ))}
        <rect x="128" y="76" width="64" height="28" rx="8" fill="white" stroke="#18120d" />
        <text x="160" y="94" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, Menlo, monospace" fill="#18120d">
          Approve
        </text>
        <m.circle
          cx="160"
          cy="28"
          r="3"
          fill="#3d5c4a"
          animate={reduced ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
