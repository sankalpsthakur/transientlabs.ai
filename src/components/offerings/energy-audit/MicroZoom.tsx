'use client';

import { cn } from '@/lib/utils';
import {
  HANDOFF,
  METERS,
  PAYBACK,
  hotspotById,
  opportunityFor,
  sopFor,
  type HotspotId,
  type StageId,
  type TagKind,
} from './playbook';

export interface MicroZoomProps {
  stage: StageId;
  hotspot: HotspotId;
  accent?: string;
  reduced?: boolean;
}

const KIND_LABEL: Record<TagKind, string> = {
  existing: 'in hand',
  proposed: 'proposed',
  virtual: 'virtual',
};

function ClampGauge({
  min,
  max,
  nominal,
  unit,
  accent,
}: {
  min: number;
  max: number;
  nominal: number;
  unit: string;
  accent: string;
}) {
  const pad = (max - min) * 0.18;
  const lo = min - pad;
  const hi = max + pad;
  const t = (v: number) => ((v - lo) / (hi - lo)) * 220 + 160;
  const start = t(min);
  const end = t(max);
  const needle = t(nominal);
  const polar = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [80 + r * Math.cos(a), 86 + r * Math.sin(a)];
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = polar(from, r);
    const [x2, y2] = polar(to, r);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const [nx, ny] = polar(needle, 48);

  return (
    <svg viewBox="0 0 160 120" className="w-full" aria-hidden>
      <path d={arc(160, 380, 54)} fill="none" stroke="#e2d3c1" strokeWidth="8" strokeLinecap="round" />
      <path d={arc(start, end, 54)} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
      <circle cx="80" cy="86" r="4" fill="#18120d" />
      <line x1="80" y1="86" x2={nx} y2={ny} stroke="#18120d" strokeWidth="1.6" />
      <text x="80" y="64" textAnchor="middle" fill="#18120d" fontSize="13" fontFamily="ui-monospace, monospace">
        {nominal}
      </text>
      <text x="80" y="112" textAnchor="middle" fill="#67584b" fontSize="9" fontFamily="ui-monospace, monospace">
        {min} — {max} {unit}
      </text>
    </svg>
  );
}

function Stamp({ children, tone = 'ink' }: { children: string; tone?: 'ink' | 'forest' | 'ledger' }) {
  const color = tone === 'forest' ? '#2C5A3A' : tone === 'ledger' ? '#8B5E34' : '#18120d';
  return (
    <span
      className="inline-flex rotate-[-6deg] rounded-sm border-2 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]"
      style={{ borderColor: color, color }}
    >
      {children}
    </span>
  );
}

export function MicroZoom({ stage, hotspot, accent = '#1F3F93', reduced = false }: MicroZoomProps) {
  const asset = hotspotById(hotspot);
  const opp = opportunityFor(hotspot);
  const sop = sopFor(hotspot);
  const clamp = asset.clamp;

  return (
    <aside
      data-microzoom
      aria-label={`${asset.name} extract`}
      className={cn(
        'relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.4rem] border border-border bg-[#fffaf3] shadow-[0_24px_60px_-36px_rgba(24,18,13,0.55)]',
        reduced && 'shadow-none'
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{asset.uns}</p>
          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-ink">{asset.name}</h3>
          <p className="mt-0.5 font-mono text-[10px] text-ink-muted">{asset.duty}</p>
        </div>
        <Stamp tone="ink">{asset.owner}</Stamp>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {stage === 'bills' && (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-ink-muted">
              Site meters first. This load is visible only where a feeder or fiscal meter already exists.
            </p>
            <ul className="space-y-1.5">
              {METERS.filter((m) =>
                asset.id === 'compressor'
                  ? m.commodity === 'electricity' || m.commodity === 'air'
                  : asset.id === 'kiln'
                    ? m.commodity === 'gas' || m.commodity === 'thermal' || m.id === 'm-tx-a'
                    : asset.id === 'hvac'
                      ? m.id === 'm-tx-b'
                      : m.id === 'm-tx-b'
              ).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-2 border-t border-border/80 pt-1.5 font-mono text-[11px]"
                >
                  <span className="text-ink">{m.name}</span>
                  <span style={{ color: m.status === 'gap' ? '#8B5E34' : '#2C5A3A' }}>
                    {m.status === 'gap' ? 'gap' : m.interval}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stage === 'hotspots' && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-ink">{asset.lossMode}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-paper-warm/60 p-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Share</p>
                <p className="mt-1 font-mono text-xl tabular-nums text-ink">{asset.sharePct}%</p>
              </div>
              <div className="rounded-lg border border-border bg-paper-warm/60 p-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Area</p>
                <p className="mt-1 text-sm font-semibold text-ink">{asset.area}</p>
              </div>
            </div>
          </div>
        )}

        {stage === 'opportunities' && (
          <article className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                {opp.id}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {opp.confidence} confidence
              </span>
            </div>
            <h4 className="text-base font-semibold text-ink">{opp.title}</h4>
            <p className="text-sm leading-relaxed text-ink-muted">{opp.mechanism}</p>
            <dl className="space-y-2 border-t border-border pt-2 font-mono text-[11px] leading-relaxed">
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink-muted">Evidence</dt>
                <dd className="text-ink">{opp.evidence}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink-muted">Assumption</dt>
                <dd className="text-ink">{opp.assumption}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink-muted">Dependency</dt>
                <dd className="text-ink">{opp.dependency}</dd>
              </div>
            </dl>
            <p className="font-mono text-[11px] text-ink-muted">
              ${opp.bandUsdYr[0] / 1000}–{opp.bandUsdYr[1] / 1000}k/yr · {opp.paybackMonths[0]}–{opp.paybackMonths[1]} mo · {PAYBACK.label}
            </p>
          </article>
        )}

        {stage === 'tags' && (
          <ul className="space-y-2">
            {asset.tags.map((tag) => (
              <li
                key={tag.path}
                data-tag={tag.path}
                className="rounded-lg border border-border bg-gradient-to-br from-white to-[#f4eadb] px-2.5 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <code className="truncate font-mono text-[11px] text-ink">{tag.path}</code>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    {KIND_LABEL[tag.kind]}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] text-ink-muted">
                  <span>{tag.desc}</span>
                  <span className="font-mono text-ink">{tag.unit}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {stage === 'clamps' && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">{clamp.id}</p>
            <ClampGauge
              min={clamp.min}
              max={clamp.max}
              nominal={clamp.nominal}
              unit={clamp.unit}
              accent={accent}
            />
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
              <div>
                <dt className="text-ink-muted">RoC</dt>
                <dd>
                  {clamp.rocPerMin} {clamp.unit}/min
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Lease</dt>
                <dd>{clamp.leaseMin} min</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Write</dt>
                <dd>analogue SP only</dd>
              </div>
              <div>
                <dt className="text-ink-muted">On tag</dt>
                <dd className="truncate">{clamp.tagPath}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{clamp.note}</p>
          </div>
        )}

        {stage === 'sops' && (
          <article className="relative">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                {sop.id}
              </p>
              <Stamp tone="ledger">proposed · not armed</Stamp>
            </div>
            <h4 className="text-base font-semibold text-ink">{sop.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{sop.intent}</p>
            <ol className="mt-3 space-y-1.5 border-t border-dashed border-border pt-3">
              {sop.steps.map((step, i) => (
                <li key={step} className="flex gap-2 text-sm leading-relaxed text-ink">
                  <span className="font-mono text-[10px] text-ink-muted">0{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              Approver · {sop.approver}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{sop.sisNote}</p>
          </article>
        )}

        {stage === 'handoff' && (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-ink bg-paper-warm/70 p-3">
              <div className="flex items-start justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Packet</p>
                <Stamp tone="forest">observe only</Stamp>
              </div>
              <p className="mt-2 text-base font-semibold leading-tight text-ink">{HANDOFF.destination}</p>
              <p className="mt-1 font-mono text-[11px] text-ink-muted">Write path · {HANDOFF.writePath}</p>
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-ink">
              {HANDOFF.contains.map((item) => (
                <li key={item} className="border-t border-border/80 pt-1.5">
                  ↳ {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-ink-muted">{HANDOFF.assertion}</p>
          </div>
        )}
      </div>

      <footer
        data-ea-plate
        className="border-t border-border bg-[#f6eee3] px-4 py-2.5"
        aria-label={`${asset.name} proposed tags, clamp band, and owner`}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
          Extract · {asset.owner}
        </p>
        <ul className="mt-1.5 space-y-0.5">
          {asset.tags
            .filter((tag) => tag.kind === 'proposed')
            .map((tag) => (
              <li key={tag.path} className="flex items-baseline justify-between gap-2 font-mono text-[10px]">
                <span className="truncate text-ink">{tag.path}</span>
                <span className="shrink-0 text-ink-muted">{tag.unit}</span>
              </li>
            ))}
        </ul>
        <p className="mt-1.5 font-mono text-[10px] text-ink">
          Clamp {clamp.min}–{clamp.max} {clamp.unit}
          <span className="text-ink-muted"> · {PAYBACK.label}</span>
        </p>
      </footer>
    </aside>
  );
}
