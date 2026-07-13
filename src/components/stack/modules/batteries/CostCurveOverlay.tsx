'use client';

import { useId } from 'react';
import { m, type MotionValue, useTransform } from 'framer-motion';

export interface CostCurveOverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  className?: string;
  reduced?: boolean;
}

const PATH_LEN = 320;

/**
 * HTML/SVG HUD: lithium-ion learning curve during factory / pack phase.
 * Sits top-right so ScaleLadderHUD owns the bottom continuum.
 * Illustrative $1200 → $100 /kWh — not a live data feed.
 */
export function CostCurveOverlay({
  progress,
  accent = '#F0C75E',
  className,
  reduced = false,
}: CostCurveOverlayProps) {
  const uid = useId();

  // Early continuum: gigafactory → pack (before micro takes over)
  const opacity = useTransform(
    progress,
    [0.04, 0.1, 0.22, 0.34],
    reduced ? [0.85, 0.85, 0.85, 0.85] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [0.04, 0.12], [-8, 0]);
  const curve = useTransform(progress, [0.08, 0.28], [0, 1]);
  const dash = useTransform(curve, (v) => PATH_LEN * (1 - v));
  const cost = useTransform(progress, [0.08, 0.28], [1200, 100]);
  const costText = useTransform(cost, (v) => `$${Math.round(v)}/kWh`);
  const gwh = useTransform(progress, [0.12, 0.28], [0, 1]);

  return (
    <m.div
      className={
        className ??
        'pointer-events-none absolute top-3 right-3 left-3 sm:left-auto sm:w-52'
      }
      style={{ opacity, y }}
      aria-hidden
    >
      <div className="rounded-xl border border-white/10 bg-black/55 px-3 py-2.5 backdrop-blur-md">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            learning curve
          </span>
          <m.span
            className="font-mono text-sm font-medium tabular-nums"
            style={{ color: accent }}
          >
            {costText}
          </m.span>
        </div>

        <svg viewBox="0 0 200 72" className="h-auto w-full" role="img">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-stroke`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={accent} stopOpacity="1" />
            </linearGradient>
          </defs>

          <line
            x1="18"
            y1="8"
            x2="18"
            y2="58"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <line
            x1="18"
            y1="58"
            x2="190"
            y2="58"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          <m.path
            d="M18 12 C48 14, 70 22, 95 34 S150 52, 190 54 L190 58 L18 58 Z"
            fill={`url(#${uid}-fill)`}
            style={{ opacity: curve }}
          />

          <m.path
            d="M18 12 C48 14, 70 22, 95 34 S150 52, 190 54"
            fill="none"
            stroke={`url(#${uid}-stroke)`}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeDasharray={PATH_LEN}
            style={{ strokeDashoffset: dash }}
          />

          <m.circle
            cx="190"
            cy="54"
            r="3.5"
            fill={accent}
            style={{ opacity: curve }}
          />

          <text
            x="22"
            y="68"
            fill="rgba(255,255,255,0.35)"
            fontSize="7"
            fontFamily="ui-monospace, monospace"
          >
            cumulative GWh
          </text>
          <text
            x="4"
            y="36"
            fill="rgba(255,255,255,0.35)"
            fontSize="7"
            fontFamily="ui-monospace, monospace"
            transform="rotate(-90 4 36)"
          >
            $/kWh
          </text>
        </svg>

        <m.p
          className="mt-0.5 font-mono text-[9px] leading-snug text-white/40"
          style={{ opacity: gwh }}
        >
          illustrative cell cost descent · not a forecast
        </m.p>
      </div>
    </m.div>
  );
}
