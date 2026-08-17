'use client';

import type { ReactNode } from 'react';
import {
  BAYS,
  FINANCE_WORKFLOWS,
  GOLD,
  INK,
  MATCH_TIERS,
  PAPER_WARM,
  STRATA,
  SYSTEMS,
  phaseTint,
  selectionKey,
} from './model';
import type { WorkflowApi } from './types';

function Hit({
  on,
  selected,
  children,
}: {
  on: () => void;
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      onClick={on}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          on();
        }
      }}
      style={{ cursor: 'pointer' }}
      opacity={selected ? 1 : 0.92}
    >
      {children}
    </g>
  );
}

function ProductionSvg({ api }: { api: WorkflowApi }) {
  const sel = selectionKey(api.selection);
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" aria-hidden={false}>
      <rect width="640" height="360" fill={PAPER_WARM} />
      <text x="24" y="28" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="11" letterSpacing="1.6">
        ISA-95 L3 · NORTH CELL
      </text>
      <rect x="40" y="48" width="560" height="250" rx="10" fill="#F8F2E9" stroke="#E2D3C1" />
      <text x="52" y="68" fill="#67584B" fontFamily="ui-monospace, Menlo, monospace" fontSize="9">
        L4 ERP stays
      </text>
      <Hit on={() => api.select({ kind: 'gate' })} selected={sel === 'gate'}>
        <path d="M150 210 V140 A40 40 0 0 1 230 140 V210" fill="none" stroke={GOLD} strokeWidth={sel === 'gate' ? 6 : 4} />
        <text x="190" y="232" textAnchor="middle" fill={GOLD} fontFamily="ui-monospace, Menlo, monospace" fontSize="10">
          GOLD SOP
        </text>
      </Hit>
      {BAYS.map((bay, i) => {
        const x = 300 + i * 72;
        const on = sel === `bay:${bay.id}`;
        return (
          <Hit key={bay.id} on={() => api.select({ kind: 'bay', id: bay.id })} selected={on}>
            <rect x={x} y="150" width="60" height="48" rx="6" fill="#EFE4D5" stroke={on ? GOLD : INK} />
            <text x={x + 30} y="178" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="8">
              {bay.label}
            </text>
          </Hit>
        );
      })}
      <Hit on={() => api.select({ kind: 'mes' })} selected={sel === 'mes'}>
        <rect x="240" y="92" width="52" height="70" rx="4" fill="#3A342C" stroke={sel === 'mes' ? GOLD : INK} />
        <text x="266" y="176" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="8">
          MES
        </text>
      </Hit>
      <Hit on={() => api.select({ kind: 'qa' })} selected={sel === 'qa'}>
        <circle cx="360" cy="250" r="16" fill={GOLD} />
        <text x="360" y="276" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="8">
          QA
        </text>
      </Hit>
      <Hit on={() => api.select({ kind: 'sis' })} selected={sel === 'sis'}>
        <rect x="48" y="230" width="44" height="56" rx="3" fill="#2A221C" stroke="#7A2E24" />
        <text x="70" y="304" textAnchor="middle" fill="#7A2E24" fontFamily="ui-monospace, Menlo, monospace" fontSize="8">
          SIS
        </text>
      </Hit>
      {api.orders.slice(0, 7).map((o, i) => {
        const on = sel === `cartridge:${o.id}` || sel === `exception:${o.id}`;
        const x = 70 + i * 72;
        return (
          <Hit
            key={o.id}
            on={() =>
              api.select(
                o.phase === 'rejected' || o.phase === 'reverted'
                  ? { kind: 'exception', id: o.id }
                  : { kind: 'cartridge', id: o.id }
              )
            }
            selected={on}
          >
            <rect x={x} y="318" width="64" height="16" rx="3" fill="#F8F2E9" stroke={on ? GOLD : phaseTint(o.phase)} />
            <text x={x + 32} y="329" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="7">
              {o.id.slice(3)} {o.phase.slice(0, 3)}
            </text>
          </Hit>
        );
      })}
    </svg>
  );
}

function FinanceSvg({ api }: { api: WorkflowApi }) {
  const sel = selectionKey(api.selection);
  const cx = 320;
  const cy = 175;
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full">
      <rect width="640" height="360" fill={PAPER_WARM} />
      <text x="24" y="28" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="11" letterSpacing="1.6">
        MATCH TIERS · STILL GL
      </text>
      {MATCH_TIERS.map((t) => {
        const on = sel === `tier:${t.id}`;
        return (
          <Hit key={t.id} on={() => api.select({ kind: 'tier', id: t.id })} selected={on}>
            <circle
              cx={cx}
              cy={cy}
              r={t.radius * 70}
              fill="none"
              stroke={on ? GOLD : t.id === 'T4' ? INK : '#8B5E34'}
              strokeWidth={on ? 2.4 : 1.2}
            />
            <text
              x={cx}
              y={cy + t.radius * 70 + 4}
              textAnchor="middle"
              fill={on ? GOLD : INK}
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="9"
            >
              {t.id}
            </text>
          </Hit>
        );
      })}
      <Hit on={() => api.select({ kind: 'gl' })} selected={sel === 'gl'}>
        <rect x="286" y="154" width="68" height="28" rx="6" fill="#F8F2E9" stroke={sel === 'gl' ? GOLD : INK} />
        <text x="320" y="172" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="10">
          GL GATE
        </text>
      </Hit>
      {FINANCE_WORKFLOWS.map((wf, i) => {
        const pos = [
          [320, 48],
          [560, 175],
          [320, 310],
          [80, 175],
        ][i]!;
        const on = sel === `workflow:${wf.id}`;
        return (
          <Hit key={wf.id} on={() => api.select({ kind: 'workflow', id: wf.id })} selected={on}>
            <rect x={pos[0] - 46} y={pos[1] - 12} width="92" height="24" rx="6" fill="#F8F2E9" stroke={on ? GOLD : '#8B5E34'} />
            <text x={pos[0]} y={pos[1] + 4} textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="9">
              {wf.title}
            </text>
          </Hit>
        );
      })}
      {api.matches
        .filter((m) => m.status === 'broken')
        .map((m, i) => {
          const on = sel === `break:${m.id}`;
          const x = 500;
          const y = 70 + i * 42;
          return (
            <Hit key={m.id} on={() => api.select({ kind: 'break', id: m.id })} selected={on}>
              <line x1="430" y1="175" x2={x} y2={y} stroke={on ? GOLD : '#6B6358'} strokeDasharray="3 3" />
              <rect x={x} y={y - 10} width="86" height="20" rx="4" fill="#F8F2E9" stroke={on ? GOLD : INK} />
              <text x={x + 43} y={y + 4} textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="8">
                {m.id}
              </text>
            </Hit>
          );
        })}
    </svg>
  );
}

function CommercialSvg({ api }: { api: WorkflowApi }) {
  const sel = selectionKey(api.selection);
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full">
      <rect width="640" height="360" fill={PAPER_WARM} />
      <text x="24" y="28" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="11" letterSpacing="1.6">
        EXISTING SYSTEMS STAY
      </text>
      {STRATA.map((st, i) => {
        const on = sel === `stratum:${st.id}`;
        return (
          <Hit key={st.id} on={() => api.select({ kind: 'stratum', id: st.id })} selected={on}>
            <rect x="230" y={70 + i * 36} width="180" height="28" rx="4" fill={i === 3 ? '#2A221C' : '#F8F2E9'} stroke={on ? GOLD : INK} />
            <text
              x="320"
              y={88 + i * 36}
              textAnchor="middle"
              fill={i === 3 ? '#F8F2E9' : INK}
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="11"
            >
              {st.label}
            </text>
          </Hit>
        );
      })}
      {SYSTEMS.map((sys, i) => {
        const on = sel === `system:${sys.id}`;
        const x = 40 + (i % 3) * 90;
        const y = 70 + Math.floor(i / 3) * 46;
        return (
          <Hit key={sys.id} on={() => api.select({ kind: 'system', id: sys.id })} selected={on}>
            <rect x={x} y={y} width="80" height="28" rx="6" fill="#F8F2E9" stroke={on ? GOLD : '#6B6358'} />
            <text x={x + 40} y={y + 18} textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="10">
              {sys.label}
            </text>
          </Hit>
        );
      })}
      <Hit on={() => api.select({ kind: 'ghost' })} selected={sel === 'ghost'}>
        <rect x="450" y="90" width="150" height="90" rx="6" fill="#EFE4D5" stroke={sel === 'ghost' ? GOLD : '#6B6358'} transform="rotate(-6 525 135)" />
        <line x1="460" y1="170" x2="590" y2="100" stroke={GOLD} strokeWidth="2" />
        <text x="525" y="200" textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="9">
          EXCEL · WHATSAPP
        </text>
      </Hit>
      {api.deals.map((d, i) => {
        const on = sel === `deal:${d.id}`;
        return (
          <Hit key={d.id} on={() => api.select({ kind: 'deal', id: d.id })} selected={on}>
            <rect x="450" y={230 + i * 32} width="150" height="24" rx="4" fill="#F8F2E9" stroke={on ? GOLD : INK} />
            <text x="525" y={246 + i * 32} textAnchor="middle" fill={INK} fontFamily="ui-monospace, Menlo, monospace" fontSize="9">
              {d.id} · {d.crmStage}
            </text>
          </Hit>
        );
      })}
    </svg>
  );
}

export function Fallback({ api }: { api: WorkflowApi }) {
  return (
    <div
      className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-paper"
      data-reduced-stage="svg"
    >
      {api.lane === 'production' && <ProductionSvg api={api} />}
      {api.lane === 'finance' && <FinanceSvg api={api} />}
      {api.lane === 'commercial' && <CommercialSvg api={api} />}
    </div>
  );
}
