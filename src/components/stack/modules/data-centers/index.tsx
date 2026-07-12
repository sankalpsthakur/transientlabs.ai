'use client';

import { useEffect, useMemo } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ScaleLadderHUD,
  StackCanvas,
  type ModuleExperienceProps,
} from '@/components/stack/webgl';
import { Scene } from './Scene';
import { Overlay } from './Overlay';

const ACCENT = '#E8A87C';
/** Matches Scene REDUCED_P — GPU package + lit die keyframe */
const REDUCED_PROGRESS = 0.62;

/**
 * Hyperscale Data Centers — production scroll-driven WebGL module.
 * Continuum: campus → hall → rack → accelerator → die → bit/token.
 * Camera, roof peel, rack LEDs, power/heat, micro grain all scrub via progress.
 */
export function ModuleExperience({
  progress,
  accent = ACCENT,
  reduced = false,
  className,
}: ModuleExperienceProps) {
  // Freeze HUD on GPU+die rung when reduced (avoid ScaleLadderHUD's default 0.85 = bit)
  const freezeProgress = useMemo(() => motionValue(REDUCED_PROGRESS), []);
  const hudProgress: MotionValue<number> = reduced ? freezeProgress : progress;

  useEffect(() => {
    if (!reduced) return;
    // Nudge so ScaleLadderHUD's progress.on('change') picks up the freeze value
    freezeProgress.set(REDUCED_PROGRESS - 0.001);
    freezeProgress.set(REDUCED_PROGRESS);
  }, [reduced, freezeProgress]);

  return (
    <div className={cn('relative mx-auto w-full max-w-lg', className)}>
      <StackCanvas
        className="aspect-[4/3] w-full max-w-none border-white/10 bg-[#070605]/90 sm:aspect-square"
        camera={{ position: [5.2, 3.8, 5.5], fov: 40 }}
        maxDpr={reduced ? 1 : undefined}
      >
        <Scene progress={progress} accent={accent} reduced={reduced} />
      </StackCanvas>

      <Overlay
        progress={progress}
        accent={accent}
        reduced={reduced}
      />

      <ScaleLadderHUD
        moduleId="data-centers"
        progress={hudProgress}
        accent={accent}
        reduced={false}
      />
    </div>
  );
}

export default ModuleExperience;
