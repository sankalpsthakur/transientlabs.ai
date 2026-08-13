'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DEFAULT_ACCENT } from './constants';
import { ModuleExperience } from './ModuleExperience';
import type { FirmExperienceProps } from './types';

type FirmPreviewProps = Omit<FirmExperienceProps, 'progress'> & {
  autoPlay?: boolean;
  controls?: boolean;
};

/**
 * Self-contained mount for decks / reviews. Owns its own 0–1 progress.
 * Parent pages should prefer ModuleExperience + a shared scroll MotionValue.
 */
export function FirmPreview({
  accent = DEFAULT_ACCENT,
  reduced,
  className,
  fullBleed = false,
  onPortal,
  initialPortal = null,
  autoPlay = true,
  controls = true,
}: FirmPreviewProps) {
  const progress = useMotionValue(0.22);
  const prefersReduced = useReducedMotion();
  const quiet = reduced ?? prefersReduced ?? false;
  const [playing, setPlaying] = useState(autoPlay && !quiet);

  useEffect(() => {
    if (!playing || quiet) return;
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const t = (Math.sin(frame * 0.006) + 1) / 2;
      progress.set(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, progress, quiet]);

  return (
    <div data-firm-preview="" className={cn('relative', className)}>
      <ModuleExperience
        progress={progress}
        accent={accent}
        reduced={quiet}
        fullBleed={fullBleed}
        onPortal={onPortal}
        initialPortal={initialPortal}
      />
      {controls && (
        <label className="mt-3 flex items-center gap-3 px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#67584b]">
            Depth
          </span>
          <input
            data-firm-scrub=""
            type="range"
            min={0}
            max={1000}
            defaultValue={220}
            aria-label="Firm nucleus depth"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#e2d3c1] accent-[#1f3f93]"
            onChange={(event) => {
              setPlaying(false);
              progress.set(Number(event.target.value) / 1000);
            }}
          />
        </label>
      )}
    </div>
  );
}
