'use client';

import { useEffect, useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface OverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  className?: string;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function mwFromProgress(p: number) {
  // Peak facility draw mid-rack; hold as we dive into silicon
  const t = smoothstep(0.26, 0.55, p);
  return Math.round(12 + t * (120 - 12));
}

type Phase = 'campus' | 'hall' | 'rack' | 'gpu' | 'die' | 'bit';

function phaseFromProgress(p: number): Phase {
  if (p < 0.16) return 'campus';
  if (p < 0.3) return 'hall';
  if (p < 0.44) return 'rack';
  if (p < 0.58) return 'gpu';
  if (p < 0.75) return 'die';
  return 'bit';
}

const PHASE_LABEL: Record<Phase, string> = {
  campus: 'Hyperscale campus',
  hall: 'Server hall',
  rack: 'GPU rack',
  gpu: 'Accelerator package',
  die: 'Die · gate grain',
  bit: 'Bits · tokens out',
};

/**
 * HTML HUD scrubbed with scroll: facility draw MW + continuum phase labels.
 */
export function Overlay({
  progress,
  accent = '#E8A87C',
  reduced = false,
  className,
}: OverlayProps) {
  const [mw, setMw] = useState(() =>
    reduced ? 120 : mwFromProgress(progress.get())
  );
  const [powerOn, setPowerOn] = useState(reduced);
  const [heatOn, setHeatOn] = useState(reduced);
  const [phase, setPhase] = useState<Phase>(() =>
    reduced ? 'die' : phaseFromProgress(progress.get())
  );
  const [hudOpacity, setHudOpacity] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setMw(120);
      setPowerOn(true);
      setHeatOn(true);
      setPhase('die');
      setHudOpacity(1);
      return;
    }
    const p = progress.get();
    setMw(mwFromProgress(p));
    setPowerOn(p >= 0.28);
    setHeatOn(p >= 0.4);
    setPhase(phaseFromProgress(p));
    setHudOpacity(smoothstep(0.06, 0.16, p));
  }, [reduced, progress]);

  useMotionValueEvent(progress, 'change', (p) => {
    if (reduced) return;
    setMw(mwFromProgress(p));
    setPowerOn(p >= 0.28);
    setHeatOn(p >= 0.4);
    setPhase(phaseFromProgress(p));
    setHudOpacity(smoothstep(0.06, 0.16, p));
  });

  const micro = phase === 'gpu' || phase === 'die' || phase === 'bit';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4',
        className
      )}
      aria-hidden
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 transition-opacity duration-300"
          style={{ opacity: hudOpacity }}
        >
          {PHASE_LABEL[phase]}
        </div>
        <div
          className="text-right transition-opacity duration-300"
          style={{ opacity: hudOpacity * (micro ? 0.55 : 1) }}
        >
          <div
            className="font-mono text-xl font-semibold tabular-nums sm:text-2xl"
            style={{ color: accent }}
          >
            {mw}
            <span className="ml-1 text-sm font-medium text-white/50">MW</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-white/35">
            facility draw · illustrative
          </div>
        </div>
      </div>

      <div className="mb-24 flex items-end justify-between gap-3 sm:mb-28">
        <div className="flex flex-col gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-opacity duration-300"
            style={{
              color: '#5CE1A8',
              opacity: powerOn && !micro ? 0.9 : micro && phase !== 'bit' ? 0.35 : 0,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            Power in
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-opacity duration-300"
            style={{
              color: accent,
              opacity: heatOn ? 0.9 : 0,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            {phase === 'bit' ? 'Heat residual' : 'Heat out'}
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-opacity duration-300"
            style={{
              color: '#9fd8ff',
              opacity: phase === 'bit' ? 0.9 : phase === 'die' ? 0.45 : 0,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            Token stream
          </span>
        </div>
        <div
          className="max-w-[10rem] text-right font-mono text-[9px] leading-snug text-white/40 transition-opacity duration-500 sm:max-w-[12rem] sm:text-[10px]"
          style={{
            opacity:
              phase === 'campus' || phase === 'hall'
                ? 0.75
                : phase === 'die' || phase === 'bit'
                  ? 0.8
                  : 0,
          }}
        >
          {phase === 'die' || phase === 'bit'
            ? 'Electricity in → bits flipped → heat out'
            : 'Campus footprint ≈ stadium scale'}
        </div>
      </div>
    </div>
  );
}
