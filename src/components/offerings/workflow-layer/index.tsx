'use client';

import { motionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { cn } from '@/lib/utils';
import { Fallback } from './Fallback';
import { GOLD, selectionKey } from './model';
import { Overlay } from './Overlay';
import { PaperCanvas } from './PaperCanvas';
import { Scene } from './Scene';
import type { WorkflowExperienceProps } from './types';
import { useWorkflowState } from './useWorkflowState';

/**
 * Offering 2 — ERP / CRM / MRP / MES / QMS governed workflow layer.
 * Production floor · finance orrery · commercial desk. Paper / ink / gold.
 * Cloud proposes. A named person arms. SIS has no write path.
 */
export function ModuleExperience({
  progress,
  accent = GOLD,
  reduced = false,
  className,
  fullBleed = false,
  initialLane = 'production',
  onLaneChange,
}: WorkflowExperienceProps) {
  const prefers = useReducedMotion();
  const tier = useDeviceTier();
  const freeze = reduced || prefers === true;
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const internal = useMemo<MotionValue<number>>(() => motionValue(0.36), []);
  const scrub = progress ?? internal;

  const api = useWorkflowState({
    progress: scrub,
    initialLane,
    freeze,
    onLaneChange,
  });

  useEffect(() => {
    if (progress || freeze || api.interacting) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const cycle = ((now - start) / 52000) % 1;
      const p = cycle < 0.5 ? cycle * 2 : 2 - cycle * 2;
      internal.set(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, freeze, api.interacting, internal]);

  const showWebGL = ready && !freeze && (tier === 'high' || tier === 'medium');

  return (
    <div
      className={cn(
        'relative mx-auto aspect-[4/3] w-full max-w-3xl outline-none',
        fullBleed && 'lg:h-[100dvh] lg:max-w-none lg:aspect-auto',
        className
      )}
      data-offering="workflow-layer"
      data-lane={api.lane}
      data-selection={selectionKey(api.selection)}
      data-reduced={freeze ? 'true' : 'false'}
      data-sop-gate={api.orders.some((o) => o.phase === 'armed' || o.phase === 'executing') ? 'open' : 'locked'}
      tabIndex={0}
      role="region"
      aria-label="Governed workflow layer. Production, finance, and commercial lanes. Keyboard supported."
    >
      {showWebGL ? (
        <PaperCanvas
          className="h-full min-h-[320px] w-full"
          camera={{ position: [3.6, 2.2, 4.6], fov: 34 }}
          reduced={freeze}
        >
          <Scene api={api} progress={scrub} accent={accent} reduced={freeze} />
        </PaperCanvas>
      ) : (
        <Fallback api={api} />
      )}
      <Overlay api={api} accent={accent} reduced={freeze} />
    </div>
  );
}

export default ModuleExperience;

export type { WorkflowExperienceProps } from './types';
export type { ModuleExperience as ModuleExperienceFn } from './types';
