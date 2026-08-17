'use client';

import { useEffect, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FIRM_COLORS,
  FIRM_ICP,
  FIRM_INSIGHT,
  FIRM_PRIORS,
  PORTALS,
  SEALS,
  STRATA,
  SYSTEMS,
} from './constants';
import type { FirmInteraction } from './types';

interface OverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  interaction: FirmInteraction;
}

/**
 * HTML HUD. Priors, seals, portals, ICP — never inside WebGL.
 * No faces, no client wordmarks, no confidential numbers.
 */
export function Overlay({
  progress,
  accent = FIRM_COLORS.signal,
  reduced = false,
  interaction,
}: OverlayProps) {
  const [p, setP] = useState(() => progress.get());
  useEffect(() => progress.on('change', setP), [progress]);

  const stage = interaction.portal
    ? (PORTALS.find((item) => item.id === interaction.portal)?.hrefHint.toUpperCase() ??
      'FIRM · HANDOFF')
    : p < 0.16
      ? 'FIRM · LONG EXPOSURE'
      : p < 0.38
        ? 'SYSTEMS · ONE ORBIT'
        : p < 0.68
          ? 'SLAB · MAP / RULES / ACTIONS / TRACE'
          : 'CONTROL LAYER · INSPECTABLE';

  const cue =
    PORTALS.find((item) => item.id === interaction.portal)?.cue ?? FIRM_INSIGHT;
  const priorLine = FIRM_PRIORS.find((item) => item.id === interaction.prior);

  return (
    <div
      data-firm-overlay=""
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="rounded-md border bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#67584b] backdrop-blur-sm sm:text-[11px]"
          style={{ borderColor: `${accent}33` }}
        >
          <span data-firm-stage="">{stage}</span>
        </div>
        <ul
          data-firm-seals=""
          className="flex flex-wrap justify-end gap-1.5"
          aria-label="Security seals"
        >
          {SEALS.map((seal) => (
            <li key={seal.id}>
              <span
                data-firm-seal={seal.id}
                title={seal.sub}
                className="inline-flex items-center rounded-full border border-[#e2d3c1] bg-white/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink backdrop-blur-sm"
              >
                {seal.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <p
          data-firm-icp=""
          className="max-w-[18rem] rounded-lg border border-[#e2d3c1] bg-white/65 px-3 py-2 text-[11px] leading-snug text-[#2b231d] backdrop-blur-sm"
        >
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-[#67584b]">
            {FIRM_ICP.eyebrow} · {FIRM_ICP.range}
          </span>
          {FIRM_ICP.line}
        </p>
        <div
          className="flex flex-wrap gap-1"
          role="toolbar"
          aria-label="Control slab strata"
        >
          {STRATA.map((stratum) => {
            const on = interaction.stratum === stratum.id;
            return (
              <button
                key={stratum.id}
                type="button"
                data-firm-stratum={stratum.id}
                aria-pressed={on}
                onClick={() => interaction.selectStratum(stratum.id)}
                className={cn(
                  'pointer-events-auto rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors',
                  on
                    ? 'border-[#18120d] bg-[#18120d] text-[#f8f2e9]'
                    : 'border-[#e2d3c1] bg-white/70 text-[#67584b] hover:border-[#18120d]/40'
                )}
              >
                {stratum.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto space-y-2.5">
        <div
          data-firm-systems=""
          className="flex flex-wrap gap-1.5"
          role="toolbar"
          aria-label="Existing systems"
        >
          {SYSTEMS.map((sys) => {
            const on = interaction.system === sys.id;
            return (
              <button
                key={sys.id}
                type="button"
                data-firm-system={sys.id}
                aria-pressed={on}
                onClick={() => interaction.selectSystem(sys.id)}
                className={cn(
                  'pointer-events-auto rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                  on
                    ? 'border-[#c4a36a] bg-[#18120d] text-[#e0c48a]'
                    : 'border-[#e2d3c1] bg-white/70 text-ink hover:border-[#c4a36a]/70'
                )}
              >
                {sys.label}
              </button>
            );
          })}
        </div>

        <ul
          data-firm-priors=""
          className="flex flex-wrap gap-1.5"
          aria-label="Execution priors"
        >
          {FIRM_PRIORS.map((item) => {
            const on = interaction.prior === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  data-firm-prior={item.id}
                  aria-pressed={on}
                  onClick={() => interaction.selectPrior(item.id)}
                  className={cn(
                    'pointer-events-auto rounded-full border px-2.5 py-1 text-left transition-colors',
                    on
                      ? 'border-[#1f3f93] bg-[#1f3f93] text-white'
                      : 'border-[#e2d3c1] bg-white/70 text-ink hover:border-[#1f3f93]/40'
                  )}
                >
                  <span className="block text-[11px] font-medium leading-none">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] opacity-70">
                    {item.line}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p
              data-firm-insight=""
              className="max-w-md text-[13px] font-medium leading-snug text-ink"
            >
              {cue}
            </p>
            {priorLine && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#67584b]">
                Prior · {priorLine.name} · {priorLine.line}
              </p>
            )}
            {reduced && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#67584b]">
                Reduced motion · gate held
              </p>
            )}
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            role="toolbar"
            aria-label="Pathway portals"
          >
            {PORTALS.map((portal) => {
              const on = interaction.portal === portal.id;
              return (
                <button
                  key={portal.id}
                  type="button"
                  data-firm-portal={portal.id}
                  aria-pressed={on}
                  onClick={() => interaction.selectPortal(portal.id)}
                  className={cn(
                    'pointer-events-auto rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                    on
                      ? 'border-[#18120d] bg-[#18120d] text-[#f8f2e9]'
                      : 'border-[#e2d3c1] bg-white/80 text-ink hover:border-[#18120d]/50'
                  )}
                >
                  {portal.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
