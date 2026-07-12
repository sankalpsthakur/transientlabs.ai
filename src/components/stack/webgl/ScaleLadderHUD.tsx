'use client';

import { useEffect, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { m, useTransform } from 'framer-motion';
import type { ModuleId } from '@/lib/stack/content';
import {
  activeRung,
  formatLengthM,
  scaleLadders,
  type ScaleRung,
} from '@/lib/stack/scale-ladders';
import { cn } from '@/lib/utils';

interface ScaleLadderHUDProps {
  moduleId: ModuleId;
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  className?: string;
}

/**
 * Textual scale continuum that stays in lockstep with scroll-scrubbed 3D.
 * Shows active rung + full ladder so viewers never lose the zoom context.
 */
export function ScaleLadderHUD({
  moduleId,
  progress,
  accent = '#7EA2FF',
  reduced = false,
  className,
}: ScaleLadderHUDProps) {
  const ladder = scaleLadders[moduleId];
  const [rung, setRung] = useState<ScaleRung>(() =>
    activeRung(moduleId, reduced ? 0.85 : 0)
  );
  const opacity = useTransform(progress, [0.02, 0.08], [0, 1]);

  useEffect(() => {
    if (reduced) {
      setRung(activeRung(moduleId, 0.85));
      return;
    }
    return progress.on('change', (v) => {
      setRung(activeRung(moduleId, v));
    });
  }, [progress, moduleId, reduced]);

  return (
    <m.div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 md:p-4',
        className
      )}
      style={{ opacity: reduced ? 1 : opacity }}
    >
      <div className="rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur-md">
        {/* Active rung */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              Scale · {rung.label}
            </div>
            <p className="mt-1 text-sm font-medium leading-snug text-white/90">
              {rung.caption}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">
              {rung.relation}
            </p>
          </div>
          <div className="shrink-0 text-right font-mono text-[10px] text-white/40">
            <div>{formatLengthM(rung.lengthM)}</div>
            <div className="mt-0.5 text-white/30">{rung.scaleNote}</div>
          </div>
        </div>

        {/* Full ladder ticks */}
        <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Scale ladder">
          {ladder.map((step) => {
            const active = step.id === rung.id;
            return (
              <li
                key={step.id}
                className={cn(
                  'rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors',
                  active
                    ? 'border-transparent text-black'
                    : 'border-white/10 text-white/35'
                )}
                style={
                  active
                    ? { backgroundColor: accent }
                    : undefined
                }
                title={`${step.label}: ${step.scaleNote}`}
              >
                {step.label}
              </li>
            );
          })}
        </ol>
      </div>
    </m.div>
  );
}
