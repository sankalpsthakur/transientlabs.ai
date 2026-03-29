'use client';

import { useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Level {
  id: number;
  name: string;
  role: string;
  policy: string;
  governs: string;
  learnSpeed: string;
  color: string;
  colorMuted: string;
}

const levels: Level[] = [
  {
    id: 0,
    name: 'Regulators',
    role: 'Industry constraints',
    policy: 'Sets compliance boundaries, audit requirements, and data residency rules.',
    governs: 'Board, CEO, and all downstream actors',
    learnSpeed: 'Years — policy cycles measured in regulation periods',
    color: 'text-rose-400',
    colorMuted: 'border-rose-500/30 bg-rose-500/8',
  },
  {
    id: 1,
    name: 'Board / CEO',
    role: 'Organizational policy',
    policy: 'Sets strategy, risk tolerance, budget envelopes, and success metrics.',
    governs: 'Function heads and their teams',
    learnSpeed: 'Quarterly — adapts to market signals and board reviews',
    color: 'text-violet-400',
    colorMuted: 'border-violet-500/30 bg-violet-500/8',
  },
  {
    id: 2,
    name: 'Function Heads',
    role: 'Team objectives',
    policy: 'Allocates resources, sets OKRs, designs incentive contracts for task agents.',
    governs: 'Task AI agents within their domain',
    learnSpeed: 'Weekly — sprint cadence, retrospectives, reallocation',
    color: 'text-blue-400',
    colorMuted: 'border-blue-500/30 bg-blue-500/8',
  },
  {
    id: 3,
    name: 'Task AI Agents',
    role: 'Execution within constraints',
    policy: 'Optimizes assigned objective function subject to constraints from above.',
    governs: 'Tools, APIs, and data sources',
    learnSpeed: 'Real-time — adapts every inference cycle',
    color: 'text-emerald-400',
    colorMuted: 'border-emerald-500/30 bg-emerald-500/8',
  },
];

function LevelRow({ level, isActive, isDownstream, onClick }: {
  level: Level;
  isActive: boolean;
  isDownstream: boolean;
  onClick: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300',
          isActive ? level.colorMuted : 'border-white/[0.08] bg-white/[0.02]',
          isDownstream && !isActive && 'border-white/[0.12] bg-white/[0.04]',
          !isActive && !isDownstream && 'hover:border-white/[0.12] hover:bg-white/[0.03]',
        )}
        aria-expanded={isActive}
      >
        {/* Level number */}
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-semibold transition-colors',
          isActive ? `${level.colorMuted} ${level.color}` : 'bg-white/[0.06] text-white/40',
        )}>
          L{level.id}
        </div>

        {/* Name + role */}
        <div className="min-w-0 flex-1">
          <div className={cn(
            'text-sm font-semibold transition-colors',
            isActive ? level.color : 'text-white/80',
          )}>
            {level.name}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/35">
            {level.role}
          </div>
        </div>

        {/* Learn speed badge */}
        <div className="hidden sm:block">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.12em] text-white/30">
            {level.learnSpeed.split(' — ')[0]}
          </span>
        </div>

        {/* Expand indicator */}
        <m.span
          className="text-white/20 text-xs"
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
        >
          ▾
        </m.span>
      </button>

      {/* Detail panel */}
      <AnimatePresence>
        {isActive && (
          <m.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 px-4 pb-1 pt-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Policy</div>
                <p className="mt-1 text-[11px] leading-relaxed text-white/60">{level.policy}</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Governs</div>
                <p className="mt-1 text-[11px] leading-relaxed text-white/60">{level.governs}</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Learn speed</div>
                <p className="mt-1 text-[11px] leading-relaxed text-white/60">{level.learnSpeed}</p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Connector line (except last) */}
      {level.id < 3 && (
        <div className="flex justify-center py-1">
          <div className={cn(
            'h-4 w-px border-l border-dashed transition-colors',
            isActive || isDownstream ? 'border-white/20' : 'border-white/8',
          )} />
        </div>
      )}
    </div>
  );
}

export function StackelbergDiagram() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const toggle = (id: number) => {
    setActiveLevel(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/25">
        <span>Stackelberg hierarchy</span>
        <span>Click to expand</span>
      </div>

      {/* Levels */}
      <div className="flex flex-col">
        {levels.map(level => (
          <LevelRow
            key={level.id}
            level={level}
            isActive={activeLevel === level.id}
            isDownstream={activeLevel !== null && level.id > activeLevel}
            onClick={() => toggle(level.id)}
          />
        ))}
      </div>

      {/* Insight */}
      <p className="mt-4 text-[11px] leading-relaxed text-white/50">
        {activeLevel !== null
          ? `${levels[activeLevel].name} as Stackelberg Principal — sets the rules before downstream agents optimize.`
          : 'Each layer sets policy before the layers below optimize. The architecture is incentive-compatible by construction.'}
      </p>
    </div>
  );
}
