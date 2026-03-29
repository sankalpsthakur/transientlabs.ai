'use client';

import { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Policy = 'proportional' | 'capped' | 'equal';

interface DeptData {
  label: string;
  color: string;
  colorMuted: string;
}

const departments: DeptData[] = [
  { label: 'Engineering', color: 'bg-blue-400', colorMuted: 'bg-blue-400/25' },
  { label: 'Marketing', color: 'bg-amber-400', colorMuted: 'bg-amber-400/25' },
  { label: 'Sales', color: 'bg-emerald-400', colorMuted: 'bg-emerald-400/25' },
  { label: 'Ops', color: 'bg-violet-400', colorMuted: 'bg-violet-400/25' },
];

const policyData: Record<Policy, { req: number[]; alloc: number[]; insight: string }> = {
  proportional: {
    req: [92, 85, 78, 88],
    alloc: [38, 35, 32, 36],
    insight: 'Proportional allocation creates inflation incentives. Agents learn to overstate need — the system diverges from truth.',
  },
  capped: {
    req: [55, 52, 48, 50],
    alloc: [40, 38, 35, 37],
    insight: 'Capped allocation removes the gaming incentive. Requests converge to honest signals — a Nash-stable budget.',
  },
  equal: {
    req: [40, 40, 40, 40],
    alloc: [25, 25, 25, 25],
    insight: 'Equal allocation eliminates gaming but also optimization. No agent has reason to signal — information is lost.',
  },
};

const policies: { key: Policy; label: string }[] = [
  { key: 'proportional', label: 'Proportional' },
  { key: 'capped', label: 'Capped' },
  { key: 'equal', label: 'Equal' },
];

export function BudgetSimulator() {
  const [policy, setPolicy] = useState<Policy>('proportional');
  const prefersReducedMotion = useReducedMotion();
  const data = policyData[policy];

  return (
    <div className="flex flex-col gap-4">
      {/* Policy selector */}
      <div className="flex gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {policies.map(p => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPolicy(p.key)}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-all',
              policy === p.key
                ? 'bg-white/12 text-white shadow-[0_2px_8px_rgba(255,255,255,0.06)]'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.18em] text-white/30">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-4 rounded-sm bg-white/15" />
          <span>Requested</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-4 rounded-sm bg-white/40" />
          <span>Allocated</span>
        </div>
      </div>

      {/* Budget bars */}
      <div className="flex flex-col gap-3">
        {departments.map((dept, i) => (
          <div key={dept.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                {dept.label}
              </span>
              <span className="text-[10px] font-mono text-white/30">
                {data.alloc[i]}% / {data.req[i]}%
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.04]">
              {/* Requested */}
              <m.div
                className={cn('absolute inset-y-0 left-0 rounded-full', dept.colorMuted)}
                animate={{ width: `${data.req[i]}%` }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Allocated */}
              <m.div
                className={cn('absolute inset-y-0 left-0 rounded-full', dept.color)}
                animate={{ width: `${data.alloc[i]}%` }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <m.p
        key={policy}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] leading-relaxed text-white/50"
      >
        {data.insight}
      </m.p>
    </div>
  );
}
