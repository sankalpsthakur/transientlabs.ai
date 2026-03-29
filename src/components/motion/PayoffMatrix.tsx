'use client';

import { useState, useCallback } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STRATEGIES = ['Cooperate', 'Defect'] as const;

type Payoffs = [[[number, number], [number, number]], [[number, number], [number, number]]];

const DEFAULT_PAYOFFS: Payoffs = [
  [[3, 3], [0, 5]],
  [[5, 0], [1, 1]],
];

function findNashEquilibria(payoffs: Payoffs): [number, number][] {
  const nash: [number, number][] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const otherR = 1 - r;
      const otherC = 1 - c;
      const rowBest = payoffs[r][c][0] >= payoffs[otherR][c][0];
      const colBest = payoffs[r][c][1] >= payoffs[r][otherC][1];
      if (rowBest && colBest) nash.push([r, c]);
    }
  }
  return nash;
}

function getInsight(nash: [number, number][]): string {
  if (nash.length === 0) return 'No pure Nash equilibrium — the system cycles without a stable state.';
  if (nash.length === 1) {
    const [r, c] = nash[0];
    if (r === 0 && c === 0) return 'Cooperation is the equilibrium — the architecture incentivizes alignment.';
    if (r === 1 && c === 1) return 'Both defect — the system converges to mutual loss. Redesign the payoffs.';
    return `Mixed outcome (${STRATEGIES[r]}/${STRATEGIES[c]}) — one agent dominates.`;
  }
  return 'Multiple equilibria — the system needs a coordination mechanism to select.';
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-mono text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Decrease"
      >
        -
      </button>
      <span className="w-5 text-center font-mono text-xs text-white/90">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-mono text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export function PayoffMatrix() {
  const [payoffs, setPayoffs] = useState<Payoffs>(DEFAULT_PAYOFFS);
  const prefersReducedMotion = useReducedMotion();

  const updatePayoff = useCallback((r: number, c: number, player: number, value: number) => {
    setPayoffs(prev => {
      const next = prev.map(row => row.map(cell => [...cell])) as Payoffs;
      next[r][c][player] = value;
      return next;
    });
  }, []);

  const nash = findNashEquilibria(payoffs);
  const isNash = (r: number, c: number) => nash.some(([nr, nc]) => nr === r && nc === c);
  const insight = getInsight(nash);

  return (
    <div className="flex flex-col gap-4">
      {/* Column headers */}
      <div className="grid grid-cols-[4.5rem_1fr_1fr] gap-2">
        <div />
        {STRATEGIES.map(s => (
          <div key={s} className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/70">
            B: {s}
          </div>
        ))}
      </div>

      {/* Matrix rows */}
      {STRATEGIES.map((rowStrat, r) => (
        <div key={rowStrat} className="grid grid-cols-[4.5rem_1fr_1fr] gap-2">
          <div className="flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400/70">
            A: {rowStrat}
          </div>
          {STRATEGIES.map((_, c) => {
            const cellIsNash = isNash(r, c);
            return (
              <m.div
                key={c}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors',
                  cellIsNash
                    ? 'border-emerald-400/50 bg-emerald-500/10'
                    : 'border-white/10 bg-white/[0.03]',
                )}
                animate={prefersReducedMotion ? {} : {
                  boxShadow: cellIsNash
                    ? '0 0 20px rgba(52,211,153,0.15)'
                    : '0 0 0px transparent',
                }}
                transition={{ duration: 0.3 }}
              >
                {cellIsNash && (
                  <div className="absolute -top-2 right-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider text-emerald-400">
                    Nash
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono uppercase text-amber-400/50">A</span>
                    <Stepper
                      value={payoffs[r][c][0]}
                      onChange={(v) => updatePayoff(r, c, 0, v)}
                    />
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono uppercase text-cyan-400/50">B</span>
                    <Stepper
                      value={payoffs[r][c][1]}
                      onChange={(v) => updatePayoff(r, c, 1, v)}
                    />
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      ))}

      {/* Insight */}
      <m.p
        key={insight}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] leading-relaxed text-white/50"
      >
        {insight}
      </m.p>
    </div>
  );
}
