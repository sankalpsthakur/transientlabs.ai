'use client';

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion';
import {
  StackCanvas,
  type ModuleExperienceProps,
} from '@/components/stack/webgl';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { cn } from '@/lib/utils';
import { INITIAL_ALARMS, PLANT_KIND, PLANT_NAME, buildTags } from './data';
import { createPlantState, reducePlant, type Mode, type PlantAction } from './model';
import { Overlay } from './Overlay';
import { Scene } from './Scene';
import { TopologySvg } from './TopologySvg';

const ACCENT = '#1F3F93';

function stageFromProgress(p: number, reduced: boolean): string {
  if (reduced) return 'L2 · IGNITION GATEWAY + EDGE · NORTH CELL';
  if (p < 0.16) return 'L0 · FIELD · PRESS / OVEN / PACK';
  if (p < 0.32) return 'L1 · PLC + CLAMP · HAZOP BANDS';
  if (p < 0.48) return 'L2 · IGNITION EDGE + GATEWAY';
  if (p < 0.62) return 'L2 · PERSPECTIVE / VISION + HISTORIAN';
  if (p < 0.76) return 'L3.5 · INDUSTRIAL DMZ';
  return 'L3–L4 · SOP GATE + ERP · SIS OFFSET';
}

function useProgressLabel(progress: MotionValue<number>, reduced: boolean): string {
  const [label, setLabel] = useState(() =>
    stageFromProgress(reduced ? 0.42 : progress.get(), reduced),
  );
  useMotionValueEvent(progress, 'change', (p) => {
    if (!reduced) setLabel(stageFromProgress(p, false));
  });
  return reduced ? stageFromProgress(0.42, true) : label;
}

/**
 * SCADA + Ignition offering. Purdue/Ignition topology, tag browser, alarms,
 * clamp SAT, modes 0–4, SIS no-write, disposable edge, SOP gate.
 */
export function ModuleExperience({
  progress,
  accent = ACCENT,
  reduced,
  className,
  fullBleed = false,
}: ModuleExperienceProps) {
  const prefersReduced = useReducedMotion();
  const tier = useDeviceTier();
  const quiet = Boolean(reduced ?? prefersReduced ?? false);
  const useWebgl = !quiet && tier !== 'low';

  const initial = useMemo(
    () => createPlantState(buildTags(), INITIAL_ALARMS),
    [],
  );
  const [state, dispatch] = useReducer(reducePlant, initial);
  const stageLabel = useProgressLabel(progress, quiet);

  const onKey = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (event.key >= '0' && event.key <= '4') {
        event.preventDefault();
        dispatch({ type: 'REQUEST_MODE', mode: Number(event.key) as Mode });
        return;
      }
      const key = event.key.toLowerCase();
      const map: Record<string, PlantAction> = {
        r: { type: 'REARM' },
        a: { type: 'APPROVE_SOP' },
        k: { type: 'KILL_EDGE' },
        s: { type: 'SELECT', node: 'sis' },
        escape: { type: 'SELECT', node: null },
      };
      const action = map[key] ?? map[event.key];
      if (action) {
        event.preventDefault();
        dispatch(action);
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div
      data-offering="scada-ignition"
      data-testid="scada-module"
      data-inbound-sis="false"
      data-write-path-sis="false"
      data-plant-twitch={state.plantTwitch}
      data-edge-alive={state.edgeAlive}
      data-mode={state.mode}
      data-reduced={quiet || undefined}
      tabIndex={0}
      aria-label={`${PLANT_NAME} SCADA and Ignition reference. ${PLANT_KIND}. Modes 0 to 4, SOP gate, SIS has no write path.`}
      className={cn(
        'relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#e2d3c1] bg-[#f8f2e9] text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#1F3F93]',
        fullBleed && 'lg:h-[100dvh] lg:max-w-none lg:rounded-none lg:border-0',
        className,
      )}
    >
      {useWebgl ? (
        <>
          <StackCanvas
            className="h-full min-h-[min(72vh,640px)] w-full max-w-none border-0 bg-[#161310] shadow-none"
            camera={{ position: [3.8, 1.7, 5.0], fov: 36 }}
            maxDpr={quiet ? 1 : undefined}
            fullBleed={fullBleed}
          >
            <Scene
              progress={progress}
              state={state}
              dispatch={dispatch}
              accent={accent}
              reduced={quiet}
            />
          </StackCanvas>
          <Overlay
            state={state}
            dispatch={dispatch}
            accent={accent}
            reduced={quiet}
            stageLabel={stageLabel}
          />
        </>
      ) : (
        <div data-testid="reduced-fallback" className="bg-[#f8f2e9]">
          <Overlay
            state={state}
            dispatch={dispatch}
            accent={accent}
            reduced
            stageLabel={stageLabel}
            flow
            diagram={
              <div className="pointer-events-auto">
                <TopologySvg
                  state={state}
                  reduced
                  onSelect={(node) => dispatch({ type: 'SELECT', node })}
                />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

export default ModuleExperience;

export { reducePlant, createPlantState, inboundSisExists } from './model';
export type { PlantState, PlantAction } from './model';
