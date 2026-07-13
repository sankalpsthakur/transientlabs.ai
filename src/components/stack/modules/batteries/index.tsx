'use client';

import { useMemo } from 'react';
import type { ModuleExperienceProps } from '@/components/stack/webgl';
import { StackCanvas, ScaleLadderHUD } from '@/components/stack/webgl';
import { cn } from '@/lib/utils';
import { BatteriesScene } from './Scene';
import { CostCurveOverlay } from './CostCurveOverlay';

const ACCENT = '#F0C75E';

/** Mid-separator freeze + lattice hint for prefers-reduced-motion */
const REDUCED_PROGRESS = 0.72;

/** Static composition for prefers-reduced-motion / low tier. */
function ReducedStatic({ accent = ACCENT }: { accent?: string }) {
  return (
    <div
      className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/40"
      aria-hidden
    >
      <svg viewBox="0 0 440 400" className="h-full w-full p-6">
        <defs>
          <linearGradient id="bat-anode" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b8cae" />
            <stop offset="100%" stopColor="#3d5670" />
          </linearGradient>
          <linearGradient id="bat-cath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#a8842e" />
          </linearGradient>
        </defs>

        {/* Electrode sandwich */}
        <rect x="36" y="36" width="100" height="22" rx="3" fill="url(#bat-anode)" />
        <rect
          x="36"
          y="66"
          width="100"
          height="8"
          rx="2"
          fill="rgba(255,255,255,0.65)"
        />
        <rect x="36" y="82" width="100" height="22" rx="3" fill="url(#bat-cath)" />

        {/* Li⁺ frozen mid-separator */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={48 + i * 18}
            cy={70}
            r="4"
            fill={accent}
            opacity={0.55 + (i % 2) * 0.25}
          />
        ))}
        <text
          x="36"
          y="128"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
        >
          Li⁺ mid-separator · freeze
        </text>

        {/* Lattice hint */}
        {([0, 1, 2] as const).map((row) =>
          ([0, 1, 2] as const).map((col) => {
            const x = 280 + col * 28;
            const y = 48 + row * 28;
            return (
              <g key={`${row}-${col}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={row === 1 && col === 1 ? accent : 'rgba(255,255,255,0.2)'}
                  stroke={accent}
                  strokeWidth="1"
                  opacity={row === 1 && col === 1 ? 0.95 : 0.55}
                />
                {col < 2 && (
                  <line
                    x1={x + 5}
                    y1={y}
                    x2={x + 23}
                    y2={y}
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1"
                  />
                )}
                {row < 2 && (
                  <line
                    x1={x}
                    y1={y + 5}
                    x2={x}
                    y2={y + 23}
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })
        )}
        <text
          x="308"
          y="148"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
        >
          crystal host sites
        </text>

        {/* Pack shorthand */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={52 + i * 46}
            y="190"
            width="38"
            height="46"
            rx="3"
            fill="#1a1610"
            stroke={accent}
            strokeWidth="1.2"
          />
        ))}
        <rect
          x="42"
          y="180"
          width="200"
          height="68"
          rx="6"
          fill="none"
          stroke="rgba(240,199,94,0.45)"
          strokeWidth="1.5"
        />
        <text
          x="142"
          y="270"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
        >
          factory → pack → cell → lattice
        </text>

        {/* Cost curve */}
        <path
          d="M280 200 Q320 208 345 245 T410 300"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x="300"
          y="190"
          fill={accent}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
        >
          $1200 → $100/kWh
        </text>
      </svg>
    </div>
  );
}

/**
 * Battery Gigafactories — full scale continuum.
 * Factory → pack → module → cell → electrode → Li⁺ shuttle → crystal host.
 */
export function ModuleExperience({
  progress,
  accent = ACCENT,
  reduced = false,
  className,
  fullBleed = false,
}: ModuleExperienceProps) {
  const camera = useMemo(
    () => ({ position: [3.6, 2.6, 5.4] as [number, number, number], fov: 42 }),
    []
  );

  if (reduced) {
    return (
      <div className={cn('relative mx-auto w-full max-w-lg', fullBleed && 'lg:h-[100dvh] lg:max-w-none', className)}>
        <ReducedStatic accent={accent} />
        <ScaleLadderHUD
          moduleId="batteries"
          progress={progress}
          accent={accent}
          reduced
        />
      </div>
    );
  }

  return (
    <div className={cn('relative mx-auto w-full max-w-lg', fullBleed && 'lg:h-[100dvh] lg:max-w-none', className)}>
      <StackCanvas
        className="w-full max-w-none"
        camera={camera}
        rootMargin="220px 0px"
        fullBleed={fullBleed}
      >
        <BatteriesScene
          progress={progress}
          accent={accent}
          reduced={false}
          ionCount={14}
        />
      </StackCanvas>
      <CostCurveOverlay progress={progress} accent={accent} />
      <ScaleLadderHUD
        moduleId="batteries"
        progress={progress}
        accent={accent}
      />
    </div>
  );
}
