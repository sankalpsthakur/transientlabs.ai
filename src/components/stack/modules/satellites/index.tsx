'use client';

import { cn } from '@/lib/utils';
import {
  StackCanvas,
  ScaleLadderHUD,
  type ModuleExperienceProps,
} from '@/components/stack/webgl';
import { Scene } from './Scene';
import { Overlay } from './Overlay';

const DEFAULT_ACCENT = '#7EA2FF';

/**
 * LEO Constellations — full scale continuum.
 * Constellation → shell → bus → phased array → RF/optical link → bit stream.
 */
export function ModuleExperience({
  progress,
  accent = DEFAULT_ACCENT,
  reduced = false,
  className,
  fullBleed = false,
}: ModuleExperienceProps) {
  return (
    <div
      className={cn(
        'relative mx-auto aspect-square w-full max-w-lg',
        fullBleed && 'lg:h-[100dvh] lg:max-w-none lg:aspect-auto',
        className
      )}
    >
      <StackCanvas
        className="h-full max-w-none w-full"
        fullBleed={fullBleed}
        camera={{ position: [0, 1.5, 6.2], fov: 38 }}
      >
        <Scene progress={progress} accent={accent} reduced={reduced} />
      </StackCanvas>
      <Overlay progress={progress} accent={accent} reduced={reduced} />
      <ScaleLadderHUD
        moduleId="satellites"
        progress={progress}
        accent={accent}
        reduced={reduced}
      />
    </div>
  );
}
