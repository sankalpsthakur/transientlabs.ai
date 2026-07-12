'use client';

import { useEffect, useMemo, useState } from 'react';
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
 * Log-scale depth HUD: active rung + continuum bar across orders of magnitude.
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
  const [p, setP] = useState(reduced ? 0.85 : 0);
  const opacity = useTransform(progress, [0.02, 0.08], [0, 1]);

  useEffect(() => {
    if (reduced) {
      setRung(activeRung(moduleId, 0.85));
      setP(0.85);
      return;
    }
    return progress.on('change', (v) => {
      setRung(activeRung(moduleId, v));
      setP(v);
    });
  }, [progress, moduleId, reduced]);

  // Log-scale position of current length on the ladder
  const logMeta = useMemo(() => {
    const logs = ladder.map((r) => Math.log10(Math.max(r.lengthM, 1e-16)));
    const min = Math.min(...logs);
    const max = Math.max(...logs);
    const cur = Math.log10(Math.max(rung.lengthM, 1e-16));
    const t = max === min ? 0 : (cur - min) / (max - min);
    // Invert so macro is left, micro is right (zooming in)
    return { min, max, t: 1 - t };
  }, [ladder, rung]);

  return (
    <m.div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 md:p-4',
        className
      )}
      style={{ opacity: reduced ? 1 : opacity }}
    >
      <div className="rounded-xl border border-white/10 bg-black/65 p-3 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {/* Active rung */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              Depth · {rung.label}
            </div>
            <p className="mt-1 text-sm font-medium leading-snug text-white/90">
              {rung.caption}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">
              {rung.relation}
            </p>
          </div>
          <div className="shrink-0 text-right font-mono text-[10px] text-white/40">
            <div className="text-sm text-white/70">{formatLengthM(rung.lengthM)}</div>
            <div className="mt-0.5 text-white/30">{rung.scaleNote}</div>
            <div className="mt-1 text-white/25">scroll {(p * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Log continuum bar — macro ← → micro */}
        <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="absolute inset-y-0 left-0 rounded-full opacity-80"
            style={{
              width: `${Math.round(logMeta.t * 100)}%`,
              background: `linear-gradient(90deg, ${accent}33, ${accent})`,
            }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-black shadow"
            style={{
              left: `calc(${Math.round(logMeta.t * 100)}% - 6px)`,
              backgroundColor: accent,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[8px] uppercase tracking-wider text-white/25">
          <span>macro</span>
          <span>orders of magnitude</span>
          <span>micro</span>
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
                style={active ? { backgroundColor: accent } : undefined}
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
