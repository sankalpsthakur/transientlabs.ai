'use client';

import { cn } from '@/lib/utils';
import {
  BATCH_COLLARS,
  INSIGHT,
  livePointCount,
  MONITORING_POINTS,
  PERMANENCE_YEARS,
  STAGES,
  tierById,
  TIERS,
  YIELD_CARBON_RANGE,
} from './model';
import { isCollarLocked } from './model';
import type { DmrvStageId, DmrvTier } from './types';

export function TierSwitcher({
  tier,
  onChange,
}: {
  tier: DmrvTier;
  onChange: (tier: DmrvTier) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="DMRV tech tier. Keys 1, 2, 3."
      className="inline-flex rounded-full border border-border bg-paper-warm/60 p-0.5"
    >
      {TIERS.map((item) => {
        const active = item.id === tier;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-keyshortcuts={item.key}
            data-testid={`dmrv-tier-${item.id}`}
            onClick={() => onChange(item.id)}
            className={cn(
              'min-w-[4.5rem] rounded-full px-3 py-1.5 text-left transition-colors duration-300',
              active
                ? 'bg-ink text-paper shadow-sm'
                : 'text-ink-muted hover:text-ink'
            )}
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-70">
              {item.key}
            </span>
            <span className="block font-sans text-[13px] leading-none">
              {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function JourneyRail({
  stageIndex,
  maxReached,
  canEnter,
  onRequest,
}: {
  stageIndex: number;
  maxReached: number;
  canEnter: (index: number) => boolean;
  onRequest: (index: number) => boolean;
}) {
  return (
    <ol
      className="flex flex-row gap-1 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible"
      aria-label="Six-stage credit journey. Cannot skip."
    >
      {STAGES.map((stage, index) => {
        const current = index === stageIndex;
        const done = index < maxReached || (index <= maxReached && !current);
        const locked = !canEnter(index) && !current;
        return (
          <li key={stage.id} className="flex-1 md:flex-none">
            <button
              type="button"
              data-testid={`dmrv-stage-${stage.id}`}
              aria-current={current ? 'step' : undefined}
              aria-disabled={locked}
              disabled={locked}
              onClick={() => onRequest(index)}
              className={cn(
                'flex w-full items-start gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors duration-300 md:mb-1',
                current && 'border-ink bg-ink text-paper',
                !current && done && 'border-border bg-paper-warm/70 text-ink',
                !current &&
                  !done &&
                  !locked &&
                  'border-dashed border-border text-ink-muted hover:border-ink/40 hover:text-ink',
                locked && 'cursor-not-allowed border-transparent text-ink/30'
              )}
            >
              <span className="font-mono text-[10px] tabular-nums tracking-widest">
                {stage.numeral}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] leading-tight">{stage.title}</span>
                <span
                  className={cn(
                    'mt-0.5 hidden text-[10px] leading-snug md:block',
                    current ? 'text-paper/70' : 'text-ink-muted'
                  )}
                >
                  {stage.kicker}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function PlantPanel({
  tier,
  stageId,
}: {
  tier: DmrvTier;
  stageId: DmrvStageId;
}) {
  const def = tierById(tier);
  const live = livePointCount(tier);

  return (
    <aside
      className="flex flex-col gap-4 text-ink"
      data-testid="dmrv-plant-panel"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          What changes in the plant
        </p>
        <p className="mt-1 text-[13px] leading-relaxed">{def.plantChange}</p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Typical sensor BOM
          <span className="ml-1 normal-case tracking-normal text-ink/45">
            — engineering typical, not a quoted price
          </span>
        </p>
        <ul className="mt-1.5 space-y-1">
          {def.bom.map((item) => (
            <li
              key={item}
              className="flex gap-2 font-mono text-[11px] leading-snug text-ink-light"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8B5E34]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Agent layer
        </p>
        <p className="mt-1 text-[13px] leading-relaxed">{def.agentLayer}</p>
      </div>
      <div className="rounded-xl border border-border bg-paper-warm/50 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          Sensor density · {live} / {MONITORING_POINTS.length} live
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-light">
          {def.evidence}
        </p>
      </div>
      {stageId === 'verify' && (
        <p className="text-[12px] leading-relaxed text-ink-light">
          {def.rejection}
        </p>
      )}
    </aside>
  );
}

export function BatchStrip({
  stageIndex,
  maxReached,
  stageId,
}: {
  stageIndex: number;
  maxReached: number;
  stageId: DmrvStageId;
}) {
  const showYield = maxReached >= 2 && stageIndex >= 2;
  const showLiability = maxReached >= 4 && stageIndex >= 4;
  const showLock = stageId === 'retire';

  return (
    <div
      className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-end sm:justify-between"
      data-testid="dmrv-batch-strip"
    >
      <ul className="flex flex-wrap gap-2">
        {BATCH_COLLARS.map((collar) => {
          const locked = isCollarLocked(collar, stageIndex, maxReached);
          return (
            <li
              key={collar.id}
              data-locked={locked || undefined}
              className={cn(
                'rounded-md border px-2 py-1 font-mono text-[11px] tracking-wide',
                locked
                  ? 'border-ink/30 bg-paper-warm text-ink'
                  : 'border-dashed border-border text-ink/35'
              )}
            >
              <span className="mr-1.5 text-[9px] uppercase text-ink-muted">
                {collar.short}
              </span>
              {locked ? collar.sampleId : '————'}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        {showYield && (
          <span
            data-testid="dmrv-yield"
            className="rounded-full border border-border bg-paper-warm px-2.5 py-1 font-mono text-[11px] text-ink"
          >
            Yield {YIELD_CARBON_RANGE.min}–{YIELD_CARBON_RANGE.max}% C
          </span>
        )}
        {showLiability && (
          <span
            data-testid="dmrv-liability"
            className="rounded-full border border-ink/20 bg-ink px-2.5 py-1 font-mono text-[11px] text-paper"
          >
            {PERMANENCE_YEARS}y liability
          </span>
        )}
        {showLock && (
          <span
            data-testid="dmrv-retire-lock"
            className="rounded-full border border-[#8B5E34]/40 bg-[#8B5E34] px-2.5 py-1 font-mono text-[11px] text-paper"
          >
            Retirement locked
          </span>
        )}
      </div>
    </div>
  );
}

export function InsightBar() {
  return (
    <p className="max-w-xl text-[14px] leading-snug text-ink-light sm:text-[15px]">
      {INSIGHT}
    </p>
  );
}
