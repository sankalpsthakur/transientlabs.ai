'use client';

import { cn } from '@/lib/utils';
import {
  StackCanvas,
  ScaleLadderHUD,
  type ModuleExperienceProps,
} from '@/components/stack/webgl';
import { Scene } from './Scene';

/**
 * Autonomous Vehicles — full scale continuum.
 * Street → vehicle → sensors → ray/return → pixel/point → feature/intent → control bit.
 * Accent default: #C4A1FF (robotics / stack content).
 */
export function ModuleExperience({
  progress,
  accent = '#C4A1FF',
  reduced = false,
  className,
  fullBleed = false,
}: ModuleExperienceProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-lg', fullBleed && 'lg:h-[100dvh] lg:max-w-none', className)}>
      <StackCanvas
        className="w-full max-w-none bg-[#050408]/40"
        camera={{ position: [2.55, 1.85, 4.2], fov: 38 }}
        maxDpr={reduced ? 1 : undefined}
        fullBleed={fullBleed}
      >
        <Scene progress={progress} accent={accent} reduced={reduced} />
      </StackCanvas>
      <ScaleLadderHUD
        moduleId="autonomous-vehicles"
        progress={progress}
        accent={accent}
        reduced={reduced}
      />
    </div>
  );
}

export default ModuleExperience;
