'use client';

import { useReducedMotion } from 'framer-motion';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { cn } from '@/lib/utils';
import {
  BatchStrip,
  InsightBar,
  JourneyRail,
  PlantPanel,
  TierSwitcher,
} from './Controls';
import { Overlay } from './Overlay';
import { PaperCanvas } from './PaperCanvas';
import { PaperFallback } from './PaperFallback';
import { Scene } from './Scene';
import { livePointCount, STAGES } from './model';
import type { ModuleExperienceProps } from './types';
import { useDmrvState } from './useDmrvState';

export type { ModuleExperienceProps } from './types';
export type { DmrvStageId, DmrvTier } from './types';

/**
 * Biochar DMRV — distributed low / mid / high tech.
 * Paper industrial. Six-stage journey cannot skip. Keys 1/2/3 switch tiers.
 */
export function ModuleExperience({
  progress,
  reduced = false,
  className,
}: ModuleExperienceProps) {
  const prefersReduced = useReducedMotion();
  const device = useDeviceTier();
  const state = useDmrvState(progress);

  const useFallback = Boolean(
    reduced || prefersReduced || device === 'low' || device === 'unknown'
  );

  const stage = STAGES[state.stageIndex] ?? STAGES[0];

  return (
    <section
      data-offering="dmrv"
      data-dmrv-tier={state.tier}
      data-dmrv-stage={state.stageId}
      data-dmrv-fallback={useFallback ? 'true' : 'false'}
      data-dmrv-sensors={String(livePointCount(state.tier))}
      tabIndex={0}
      aria-label="Biochar DMRV — distributed low, mid, and high tech. Keys 1, 2, 3 switch tiers. Arrow keys move the journey without skipping."
      aria-keyshortcuts="1 2 3 ArrowLeft ArrowRight"
      className={cn(
        'relative w-full rounded-3xl border border-border bg-paper text-ink outline-none',
        'focus-visible:ring-2 focus-visible:ring-ink/30',
        className
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              Offering 01 · Biochar DMRV
            </p>
            <h2 className="mt-1 font-sans text-[22px] leading-tight tracking-tight sm:text-[26px]">
              From pyrolysis to permanence
            </h2>
            <InsightBar />
          </div>
          <TierSwitcher tier={state.tier} onChange={state.setTier} />
        </header>

        <div className="grid gap-4 lg:grid-cols-[13.5rem_minmax(0,1fr)_16.5rem] lg:items-stretch">
          <JourneyRail
            stageIndex={state.stageIndex}
            maxReached={state.maxReached}
            canEnter={state.canEnter}
            onRequest={state.requestStage}
          />

          <div className="relative min-h-[320px] lg:min-h-[520px]">
            {useFallback ? (
              <PaperFallback
                tier={state.tier}
                stageIndex={state.stageIndex}
                maxReached={state.maxReached}
                stageId={state.stageId}
              />
            ) : (
              <PaperCanvas className="absolute inset-0 h-full min-h-[320px]">
                <Scene
                  tier={state.tier}
                  stageIndex={state.stageIndex}
                  maxReached={state.maxReached}
                  reduced={false}
                />
              </PaperCanvas>
            )}
            <Overlay
              tier={state.tier}
              stageId={state.stageId}
              stageIndex={state.stageIndex}
            />
          </div>

          <PlantPanel tier={state.tier} stageId={state.stageId} />
        </div>

        <div>
          <p className="mb-2 text-[13px] leading-relaxed text-ink-light">
            <span className="font-medium text-ink">{stage.title}.</span>{' '}
            {stage.body}
          </p>
          {state.blockedMessage && (
            <p
              role="status"
              aria-live="polite"
              data-testid="dmrv-blocked"
              className="mb-2 font-mono text-[12px] text-[#8B5E34]"
            >
              {state.blockedMessage}
            </p>
          )}
          <BatchStrip
            stageIndex={state.stageIndex}
            maxReached={state.maxReached}
            stageId={state.stageId}
          />
        </div>
      </div>
    </section>
  );
}

export default ModuleExperience;
