'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MAX_ROUNDS = 30;
const TICK_MS = 700;

function trustColor(t: number): string {
  if (t < 0.33) return 'rgb(248,113,113)';
  if (t < 0.66) return 'rgb(251,191,36)';
  return 'rgb(52,211,153)';
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const w = 240;
  const h = 40;
  const step = w / (MAX_ROUNDS - 1);
  const points = data.map((v, i) => `${i * step},${h - v * h}`).join(' ');
  const lastY = h - data[data.length - 1] * h;
  const lastX = (data.length - 1) * step;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn('w-full', className)} fill="none" preserveAspectRatio="none">
      <polyline
        points={points}
        stroke={trustColor(data[data.length - 1])}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={trustColor(data[data.length - 1])} />
    </svg>
  );
}

export function TrustGame() {
  const [observability, setObservability] = useState(true);
  const [rounds, setRounds] = useState<number[]>([0.5]);
  const [running, setRunning] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const observabilityRef = useRef(observability);
  observabilityRef.current = observability;

  const tick = useCallback(() => {
    setRounds(prev => {
      const last = prev[prev.length - 1];
      let next: number;
      if (observabilityRef.current) {
        next = last + 0.06 * (1 - last) + (Math.random() - 0.48) * 0.02;
      } else {
        next = last + (Math.random() - 0.55) * 0.12;
      }
      next = Math.max(0, Math.min(1, next));
      const updated = [...prev, next];
      if (updated.length > MAX_ROUNDS) return updated;
      return updated;
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !running) return;
    const id = setInterval(() => {
      setRounds(prev => {
        if (prev.length >= MAX_ROUNDS) {
          // Reset
          setTimeout(() => {
            setRounds([0.5]);
          }, 1500);
          return prev;
        }
        return prev;
      });
      tick();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, tick, prefersReducedMotion]);

  // If reduced motion, show static high-trust state
  useEffect(() => {
    if (prefersReducedMotion) {
      setRounds(Array.from({ length: 20 }, (_, i) => Math.min(0.95, 0.5 + i * 0.025)));
      setRunning(false);
    }
  }, [prefersReducedMotion]);

  const currentTrust = rounds[rounds.length - 1];
  const trustPct = Math.round(currentTrust * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Observability toggle */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
          Observability
        </span>
        <button
          type="button"
          onClick={() => setObservability(v => !v)}
          className={cn(
            'relative h-5 w-10 rounded-full transition-colors',
            observability ? 'bg-emerald-500/30' : 'bg-white/10',
          )}
          role="switch"
          aria-checked={observability}
          aria-label="Toggle observability"
        >
          <m.div
            className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
            animate={{ left: observability ? 22 : 2 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Trust nodes */}
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col items-center gap-1.5">
          <m.div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04]"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">H</span>
          </m.div>
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Human</span>
        </div>

        {/* Beam */}
        <div className="relative flex-1 mx-3">
          <div className="h-px bg-white/10" />
          <m.div
            className="absolute inset-y-0 left-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${trustColor(currentTrust)}, transparent)` }}
            animate={prefersReducedMotion ? { width: '60%', left: '20%' } : { left: ['0%', '40%', '0%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Trust percentage */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: trustColor(currentTrust) }}
            >
              {trustPct}%
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <m.div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04]"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <span className="text-sm">AI</span>
          </m.div>
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Agent</span>
        </div>
      </div>

      {/* Trust meter */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.15em] text-white/30">
          <span>Collapse</span>
          <span>Stable</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <m.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: `linear-gradient(90deg, rgb(248,113,113), rgb(251,191,36), rgb(52,211,153))` }}
            animate={{ width: `${trustPct}%` }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          />
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-10">
        <Sparkline data={rounds} />
      </div>

      {/* Insight */}
      <p className="text-[11px] leading-relaxed text-white/50">
        {observability
          ? 'Observable payoffs compound trust. Both sides converge to cooperation.'
          : 'Without observability, trust is volatile. Small defections cascade into collapse.'}
      </p>
    </div>
  );
}
