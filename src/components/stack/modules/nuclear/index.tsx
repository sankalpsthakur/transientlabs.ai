'use client';

import {
  StackCanvas,
  ScaleLadderHUD,
  type ModuleExperienceProps,
} from '@/components/stack/webgl';
import { cn } from '@/lib/utils';
import { Scene } from './Scene';
import { Overlay } from './Overlay';

const DEFAULT_ACCENT = '#5CE1A8';

/** Mid assembly / early fission freeze for reduced motion */
const REDUCED_PROGRESS = 0.62;

/**
 * Nuclear / SMR module experience — full continuum:
 * pad → containment → vessel → assembly → pellet → fission → neutron economy.
 * Accent matches stack content (#5CE1A8). Hook: 24/7 firm power.
 */
export function ModuleExperience({
  progress,
  accent = DEFAULT_ACCENT,
  reduced = false,
  className,
}: ModuleExperienceProps) {
  return (
    <div
      className={cn(
        'relative mx-auto aspect-square w-full max-w-lg',
        className
      )}
    >
      <StackCanvas
        className="h-full max-w-none w-full"
        camera={{ position: [3.6, 1.85, 5.6], fov: 36 }}
        maxDpr={reduced ? 1 : undefined}
      >
        <Scene
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={reduced ? REDUCED_PROGRESS : undefined}
          particleCount={reduced ? 40 : 72}
        />
      </StackCanvas>
      <Overlay progress={progress} accent={accent} reduced={reduced} />
      <ScaleLadderHUD
        moduleId="nuclear"
        progress={progress}
        accent={accent}
        reduced={reduced}
      />
    </div>
  );
}
