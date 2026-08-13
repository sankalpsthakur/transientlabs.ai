'use client';

import {
  MONITORING_POINTS,
  pointLive,
  STAGES,
} from './model';
import type { DmrvStageId, DmrvTier } from './types';

export function Overlay({
  tier,
  stageId,
  stageIndex,
}: {
  tier: DmrvTier;
  stageId: DmrvStageId;
  stageIndex: number;
}) {
  const stage = STAGES[stageIndex] ?? STAGES[0];
  const live = MONITORING_POINTS.filter((point) => pointLive(point, tier));

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4">
      <div className="self-start rounded-md border border-border bg-paper/85 px-2.5 py-1.5 backdrop-blur-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Stage {stage.numeral} · {stage.deckTitle}
        </p>
        <p className="mt-0.5 max-w-[16rem] text-[12px] leading-snug text-ink">
          {stage.key}
        </p>
      </div>

      {(stageId === 'integrate' || stageId === 'track') && (
        <ul className="self-end space-y-1">
          {live.map((point) => (
            <li
              key={point.id}
              className="rounded-md border border-border bg-paper/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink backdrop-blur-sm"
            >
              <span className="mr-1.5 text-ink-muted">{point.index}</span>
              {point.label}
              <span className="ml-2 normal-case tracking-normal text-ink-muted">
                {point.cadence[tier]}
              </span>
            </li>
          ))}
        </ul>
      )}
      {stageId === 'design' && (
        <p className="self-end max-w-[14rem] rounded-md border border-border bg-paper/85 px-2 py-1.5 text-[11px] leading-snug text-ink backdrop-blur-sm">
          Ghost mass off-axis is the counterfactual — decomposition, landfill, combustion.
        </p>
      )}
      {stageId === 'verify' && (
        <p className="self-end max-w-[14rem] rounded-md border border-border bg-paper/85 px-2 py-1.5 text-[11px] leading-snug text-ink backdrop-blur-sm">
          {tier === 'high'
            ? 'Agentic QA: continuity complete. Portable folio ready for the auditor.'
            : 'Gaps stay visible. Annual books do not survive this plate.'}
        </p>
      )}
      {stageId === 'defend' && (
        <p className="self-end max-w-[14rem] rounded-md border border-border bg-paper/85 px-2 py-1.5 font-mono text-[11px] text-ink backdrop-blur-sm">
          Permanence is your liability · 100+ years
        </p>
      )}
      {stageId === 'retire' && (
        <p className="self-end max-w-[14rem] rounded-md border border-border bg-paper/85 px-2 py-1.5 text-[11px] leading-snug text-ink backdrop-blur-sm">
          Punch, not a glow. Locked metadata — not a PDF icon.
        </p>
      )}
    </div>
  );
}
