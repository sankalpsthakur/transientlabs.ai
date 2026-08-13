'use client';

import { cn } from '@/lib/utils';
import {
  ENGAGEMENT,
  PAYBACK,
  STAGES,
  paybackChip,
  type HotspotId,
  type StageId,
} from './playbook';

export interface OverlayProps {
  stage: StageId;
  hotspot: HotspotId;
  accent?: string;
  reduced?: boolean;
  onStage: (id: StageId) => void;
}

export function Overlay({
  stage,
  hotspot,
  accent = '#1F3F93',
  reduced = false,
  onStage,
}: OverlayProps) {
  const current = STAGES.find((s) => s.id === stage)!;
  const chip = paybackChip(stage, hotspot);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-md border border-ink/15 bg-paper/88 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
            Folio EA-04 · feeds 03
          </div>
          <div
            className="rounded-md border bg-paper/88 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted backdrop-blur-sm sm:text-[11px]"
            style={{ borderColor: `${accent}33` }}
            data-ea-stage-chip
          >
            Stage {current.code} · {current.label}
            {reduced ? ' · freeze' : ''}
          </div>
        </div>

        <div
          data-payback
          className="pointer-events-none rounded-md border bg-paper/92 px-2.5 py-1.5 text-right backdrop-blur-sm"
          style={{ borderColor: `${accent}55` }}
          aria-label={`${chip.value}. ${chip.caption}`}
        >
          <div className="font-mono text-[11px] font-semibold tabular-nums sm:text-sm" style={{ color: accent }}>
            {chip.value}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">{chip.caption}</div>
        </div>
      </div>

      <div className="pointer-events-auto">
        <div
          role="tablist"
          aria-label="Audit stages"
          className="flex gap-0.5 overflow-x-auto rounded-xl border border-border bg-paper/90 p-1 shadow-[0_-12px_40px_-24px_rgba(24,18,13,0.5)] backdrop-blur-md"
        >
          {STAGES.map((s) => {
            const active = s.id === stage;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-stage={s.id}
                onClick={() => onStage(s.id)}
                className={cn(
                  'min-h-10 min-w-[3.4rem] flex-1 rounded-lg px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors sm:min-w-0 sm:text-[10px]',
                  active ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-paper-warm hover:text-ink'
                )}
              >
                <span className="block opacity-50">{s.code}</span>
                <span className="block">{s.rail}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 max-w-xl font-mono text-[10px] leading-relaxed tracking-wide text-ink-muted sm:text-[11px]">
          {current.intent} {ENGAGEMENT.weeks}-week Sprint · {PAYBACK.label}.
        </p>
      </div>
    </div>
  );
}
