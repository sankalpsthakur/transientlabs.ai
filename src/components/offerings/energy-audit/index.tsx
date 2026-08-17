'use client';

import type { ModuleExperienceProps } from '@/components/stack/webgl';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { cn } from '@/lib/utils';
import { useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MicroZoom } from './MicroZoom';
import { Overlay } from './Overlay';
import { PlantDrawing } from './PlantDrawing';
import { Scene } from './Scene';
import {
  HOTSPOT_ORDER,
  STAGES,
  progressForStage,
  stageFromProgress,
  type HotspotId,
  type StageId,
} from './playbook';

const DEFAULT_ACCENT = '#1F3F93';
const REDUCED_STAGE: StageId = 'hotspots';
const REDUCED_HOTSPOT: HotspotId = 'compressor';

export { playbook, STAGES, HOTSPOTS, PAYBACK, HANDOFF } from './playbook';
export type { StageId, HotspotId } from './playbook';

/**
 * Offering 4 — Energy audit folio.
 * Bills → hotspot map → register → tags → clamps → SOP drafts → Ignition handoff.
 * Paper / ink. One optional WebGL context. Work may orbit; authority does not.
 */
export function ModuleExperience({
  progress,
  accent = DEFAULT_ACCENT,
  reduced = false,
  className,
  fullBleed = false,
}: ModuleExperienceProps) {
  const prefers = useReducedMotion();
  const quiet = reduced || !!prefers;
  const tier = useDeviceTier();
  const rootRef = useRef<HTMLDivElement>(null);
  const lastProgress = useRef(progress.get());

  const [progressStage, setProgressStage] = useState<StageId>(() =>
    quiet ? REDUCED_STAGE : stageFromProgress(progress.get())
  );
  const [stageOverride, setStageOverride] = useState<StageId | null>(quiet ? REDUCED_STAGE : null);
  const [hotspot, setHotspot] = useState<HotspotId>(REDUCED_HOTSPOT);

  useMotionValueEvent(progress, 'change', (p) => {
    if (quiet) return;
    const next = stageFromProgress(p);
    setProgressStage(next);
    if (Math.abs(p - lastProgress.current) > 0.04) {
      setStageOverride(null);
    }
    lastProgress.current = p;
  });

  const stage = stageOverride ?? progressStage;

  const goStage = useCallback(
    (id: StageId) => {
      setStageOverride(id);
    },
    []
  );

  const cycleHotspot = useCallback((dir: 1 | -1) => {
    setHotspot((current) => {
      const i = HOTSPOT_ORDER.indexOf(current);
      const next = (i + dir + HOTSPOT_ORDER.length) % HOTSPOT_ORDER.length;
      return HOTSPOT_ORDER[next];
    });
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const i = STAGES.findIndex((s) => s.id === stage);
        const next = event.key === 'ArrowRight' ? Math.min(STAGES.length - 1, i + 1) : Math.max(0, i - 1);
        goStage(STAGES[next].id);
      } else if (event.key === 'ArrowDown' || event.key === 'j') {
        event.preventDefault();
        cycleHotspot(1);
      } else if (event.key === 'ArrowUp' || event.key === 'k') {
        event.preventDefault();
        cycleHotspot(-1);
      } else if (event.key >= '1' && event.key <= '7') {
        event.preventDefault();
        const idx = Number(event.key) - 1;
        if (STAGES[idx]) goStage(STAGES[idx].id);
      } else if (event.key === 'Escape') {
        goStage('hotspots');
      } else if (event.key === 'c') {
        setHotspot('compressor');
      } else if (event.key === 'n') {
        setHotspot('kiln');
      } else if (event.key === 'h') {
        setHotspot('hvac');
      } else if (event.key === 'l') {
        setHotspot('line');
      }
    };

    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [stage, goStage, cycleHotspot]);

  const webgl = !quiet && tier === 'high';

  const liveRegion = useMemo(
    () => `${STAGES.find((s) => s.id === stage)?.label}. ${hotspot}.`,
    [stage, hotspot]
  );

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      data-offering="energy-audit"
      data-stage={stage}
      data-hotspot={hotspot}
      data-reduced={quiet ? 'true' : 'false'}
      data-full-bleed={fullBleed || undefined}
      aria-label="Energy audit to Ignition handoff. Arrow keys change stage. J and K cycle loads."
      className={cn(
        'relative isolate w-full overflow-hidden rounded-[1.6rem] border border-border bg-paper text-ink outline-none',
        'aspect-[4/5] min-h-[28rem] sm:aspect-[16/11] sm:min-h-[34rem]',
        fullBleed && 'lg:h-[100dvh] lg:min-h-0 lg:aspect-auto lg:rounded-none lg:border-0',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(24,18,13,0.025) 0, rgba(24,18,13,0.025) 1px, transparent 1px, transparent 4px)',
        }}
      />

      <Scene
        progress={progress}
        accent={accent}
        reduced={quiet}
        stage={stage}
        hotspot={hotspot}
        enabled={webgl}
      />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[1fr_auto] gap-0 pb-28 pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:grid-rows-1 lg:gap-0 lg:pb-24 lg:pt-14">
        <div className="relative min-h-0 min-w-0">
          <PlantDrawing
            stage={stage}
            hotspot={hotspot}
            onSelect={setHotspot}
            accent={accent}
            reduced={quiet}
            className="h-full"
          />
        </div>
        <div className="relative z-[2] min-h-[240px] p-3 sm:p-4 lg:min-h-0 lg:py-2 lg:pr-4">
          <MicroZoom stage={stage} hotspot={hotspot} accent={accent} reduced={quiet} />
        </div>
      </div>

      <Overlay stage={stage} hotspot={hotspot} accent={accent} reduced={quiet} onStage={goStage} />

      <div className="sr-only" aria-live="polite">
        {liveRegion}
      </div>
    </div>
  );
}

/** Drop-in preview when the host page has no scroll progress of its own. */
export function EnergyAuditPreview({
  accent = DEFAULT_ACCENT,
  reduced,
  className,
  fullBleed,
  initialStage = 'hotspots',
}: Omit<ModuleExperienceProps, 'progress'> & { initialStage?: StageId }) {
  const progress = useMotionValue(progressForStage(initialStage));
  return (
    <ModuleExperience
      progress={progress}
      accent={accent}
      reduced={reduced}
      className={className}
      fullBleed={fullBleed}
    />
  );
}

export default ModuleExperience;
