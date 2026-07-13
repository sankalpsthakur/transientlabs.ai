'use client';

import { m, useTransform, type MotionValue } from 'framer-motion';

interface OverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

/**
 * Early-stage constellation HUD (count + shell chip).
 * Fades out as ScaleLadderHUD + MicroZoom take over past bus dive.
 */
export function Overlay({
  progress,
  accent = '#7EA2FF',
  reduced = false,
}: OverlayProps) {
  const count = useTransform(progress, [0.08, 0.42], [180, 7200]);
  const countText = useTransform(count, (v) =>
    reduced ? '7,000+' : Math.round(v).toLocaleString('en-US')
  );

  const shellLabel = useTransform(progress, (p): string => {
    if (p < 0.14) return 'SHELL 01 · ~340 km';
    if (p < 0.26) return 'SHELL 02 · ~550 km';
    if (p < 0.38) return 'SHELL 03 · ~1,100 km';
    return 'MESH COVERAGE · ACTIVE';
  });

  // Only show during constellation / shell rungs; clear bottom for ScaleLadderHUD
  const badgeOpacity = useTransform(
    progress,
    [0.04, 0.12, 0.32, 0.42],
    [0, 1, 1, 0]
  );
  const countOpacity = useTransform(
    progress,
    [0.04, 0.12, 0.3, 0.4],
    [0, 1, 0.85, 0]
  );

  if (reduced) {
    // ScaleLadderHUD carries reduced-mode copy; keep overlay quiet
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-5">
      {/* Top-left stage chip */}
      <m.div
        className="self-start rounded-md border border-white/10 bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-sm sm:text-[11px]"
        style={{ opacity: badgeOpacity, borderColor: `${accent}33` }}
      >
        <m.span>{shellLabel}</m.span>
      </m.div>

      {/* Top-right count — bottom reserved for ScaleLadderHUD */}
      <m.div
        className="absolute right-4 top-4 flex items-baseline gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 backdrop-blur-md sm:right-5 sm:top-5 sm:px-4"
        style={{
          opacity: countOpacity,
          boxShadow: `0 0 24px ${accent}18`,
        }}
      >
        <m.span
          className="font-mono text-base font-medium tabular-nums tracking-tight text-white sm:text-lg"
          style={{ color: accent }}
        >
          {countText}
        </m.span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px]">
          sats
        </span>
      </m.div>
    </div>
  );
}
