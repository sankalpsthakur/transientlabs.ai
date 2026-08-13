'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  HISTORIAN_SEED,
  KEYBOARD_HELP,
  MALFORMED_SP,
  SOP_PHASES,
  UDT_MEMBERS,
} from './data';
import {
  MODE_SPECS,
  NAMED_PERSON,
  PACK_SP_PATH,
  canPromote,
  modeLabel,
  type Mode,
  type PlantAction,
  type PlantState,
  type SelectedNode,
} from './model';

export interface OverlayProps {
  state: PlantState;
  dispatch: (action: PlantAction) => void;
  accent?: string;
  reduced?: boolean;
  stageLabel: string;
  /** Document flow under the SVG fallback. Overlay mode sits on the WebGL stage. */
  flow?: boolean;
  diagram?: ReactNode;
}

function Panel({
  title,
  children,
  className,
  testId,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <section
      data-testid={testId}
      className={cn(
        'rounded-xl border border-[#e2d3c1] bg-[#f8f2e9]/92 p-3 shadow-[0_12px_40px_-28px_rgba(24,18,13,0.55)] backdrop-blur-sm',
        className,
      )}
    >
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5E34]">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function formatValue(value: number | boolean | string, unit: string): string {
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') {
    const n = Number.isInteger(value) ? String(value) : value.toFixed(1);
    return unit ? `${n} ${unit}` : n;
  }
  return value;
}

function Inspector({ state }: { state: PlantState }) {
  const node = state.selected;
  if (!node) {
    return (
      <p className="text-xs leading-relaxed text-ink-muted">
        Click a layer, the SIS island, or the edge crate. Keyboard {KEYBOARD_HELP}.
      </p>
    );
  }

  if (node === 'sis') {
    return (
      <div data-testid="sis-inspector" data-write-path-sis="false" className="space-y-2">
        <p className="text-sm font-semibold tracking-tight text-[#D55E00]">
          NO WRITE PATH
        </p>
        <p className="text-xs leading-relaxed text-ink-light">
          Independent logic solver, I/O, power, and cabling. Ignition holds a
          read-only mirror for display and proof-test scheduling. Bypass, inhibit,
          reset, and acknowledge stay on the SIS engineering station.
        </p>
        <ul className="space-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#D55E00]">
          <li>R2 · physically separate</li>
          <li>Inbound conduit · none</li>
          <li>Digital privileges · zero</li>
        </ul>
      </div>
    );
  }

  if (node === 'edge') {
    return (
      <p className="text-xs leading-relaxed text-ink-light">
        {state.edgeAlive
          ? 'Ignition Edge + Transient crate on the line IPC. Stateless, hot-restartable. Killing it is a SAT test — L0/L1 must not twitch.'
          : 'Crate is gone. Press, oven, and pack values are unchanged. Restore the crate, then re-arm. The system will not promote itself.'}
      </p>
    );
  }

  if (node === 'cloud') {
    return (
      <p className="text-xs leading-relaxed text-ink-light">
        Ranked SOP variants only. Latency 1–15 min. Produces nothing executable.
        An unsigned cloud write cannot move a valve.
      </p>
    );
  }

  if (node === 'clamp') {
    return (
      <p className="text-xs leading-relaxed text-ink-light">
        Four independent PLC filters. Ignition may display them. It may not edit
        bands at runtime. Malformed setpoints die here.
      </p>
    );
  }

  const copy: Record<Exclude<SelectedNode, null | 'sis' | 'edge' | 'cloud' | 'clamp'>, string> = {
    field: 'Press (cyclic), cure oven (continuous), pack + vision (discrete), energy meter. Capacity expansion is a second pack cell, not a greenfield H₂ island.',
    plc: 'Every loop under ~30 s executes here. Nothing on the WAN is inside a regulatory loop.',
    gateway: 'Ignition Gateway: UDT provider, alarm pipeline, Tag History, Perspective/Vision sessions.',
    clients: 'Perspective for new sets, Vision where the hall already has it. Presents and logs. Does not decide.',
    historian: 'Immutable rows, source-time indexed. Late arrivals ordered, never dropped. L3/L4 never query the PLC.',
    dmz: 'Outbound TLS. Inbound: whitelisted analogue tags + signed token. Rate limited. Fully logged.',
    erp: 'Transactional. Consumes ISA-95 objects. If ERP can be triggered more than once a minute by plant behaviour, aggregate in MES first.',
    sop: 'Authority is created here — not in the cloud. Reject / modify / defer are first-class outcomes.',
  };

  return <p className="text-xs leading-relaxed text-ink-light">{copy[node]}</p>;
}

export function Overlay({
  state,
  dispatch,
  reduced = false,
  stageLabel,
  flow = false,
  diagram,
}: OverlayProps) {
  const promote = canPromote(state);
  const tags = Object.values(state.tags);
  const spark = state.commandArmed
    ? HISTORIAN_SEED.map((v, i) => (i > 8 ? 70 + (i - 8) : v))
    : HISTORIAN_SEED;
  const sparkMax = Math.max(...spark);
  const sparkMin = Math.min(...spark);

  return (
    <div
      className={cn(
        'z-10 flex flex-col justify-between gap-3 p-3 sm:p-4',
        flow
          ? 'relative'
          : 'pointer-events-none absolute inset-0',
      )}
    >
      <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
        <div className="rounded-lg border border-[#e2d3c1] bg-[#f8f2e9]/90 px-3 py-2 backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1F3F93]">
            Offering 03 · SCADA + Ignition
          </p>
          <p className="mt-1 text-sm font-semibold tracking-tight text-ink">
            North Cell · discrete / hybrid
          </p>
          <p className="font-mono text-[10px] text-ink-muted">{stageLabel}</p>
        </div>
        <div
          data-testid="mode-value"
          data-mode={state.mode}
          className="rounded-lg border border-ink/15 bg-ink px-3 py-2 text-paper"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
            Operating mode
          </p>
          <p className="text-sm font-semibold tabular-nums">{modeLabel(state.mode)}</p>
        </div>
      </div>

      {diagram}

      <div
        className={cn(
          'pointer-events-auto grid min-h-0 gap-3',
          !flow && 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]',
        )}
      >
        {!flow && <div className="hidden min-h-[8rem] lg:block" aria-hidden />}

        <div className="flex max-h-[min(62vh,640px)] flex-col gap-2 overflow-auto pr-0.5">
          <Panel title="Mode 0–4 · monotonic down" testId="mode-ladder">
            <div className="grid grid-cols-5 gap-1">
              {MODE_SPECS.map((spec) => {
                const active = state.mode === spec.id;
                const climb = spec.id < state.mode;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    data-mode={spec.id}
                    data-testid={`mode-${spec.id}`}
                    aria-pressed={active}
                    onClick={() => dispatch({ type: 'REQUEST_MODE', mode: spec.id as Mode })}
                    className={cn(
                      'rounded-md border px-1 py-1.5 text-left transition-colors',
                      active
                        ? 'border-ink bg-ink text-paper'
                        : climb
                          ? 'border-dashed border-[#cdb8a0] bg-transparent text-ink-muted'
                          : 'border-[#e2d3c1] bg-white text-ink',
                    )}
                  >
                    <span className="block font-mono text-[10px] tabular-nums">{spec.id}</span>
                    <span className="block text-[10px] leading-tight">{spec.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                data-testid="rearm"
                disabled={!promote.ok}
                onClick={() => dispatch({ type: 'REARM' })}
                className="rounded-full border border-ink px-3 py-1 text-[11px] font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Re-arm
              </button>
              <span className="self-center text-[10px] leading-snug text-ink-muted">
                {state.rearmRequired ? promote.reason : 'No silent promotion.'}
              </span>
            </div>
          </Panel>

          <Panel title="Inspector" testId="inspector">
            <Inspector state={state} />
          </Panel>

          <Panel title="Tag browser · illustrative UDTs" testId="tag-browser">
            <ul className="space-y-2">
              {UDT_MEMBERS.map((group) => (
                <li key={group.udt}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1F3F93]">
                    {group.cell} · {group.udt}
                  </p>
                  <ul className="mt-1 divide-y divide-[#eadfce]">
                    {tags
                      .filter((tag) => tag.udt === group.udt)
                      .map((tag) => (
                        <li
                          key={tag.path}
                          data-tag={tag.path}
                          data-sis-mirror={tag.sisMirror || undefined}
                          className="flex items-baseline justify-between gap-2 py-1"
                        >
                          <span className="min-w-0 truncate text-[11px] text-ink-light">
                            {tag.label}
                            {tag.sisMirror && (
                              <span className="ml-1 font-mono text-[9px] uppercase text-[#D55E00]">
                                read-only
                              </span>
                            )}
                            {tag.leased && (
                              <span className="ml-1 font-mono text-[9px] uppercase text-[#8B5E34]">
                                leased
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink">
                            {formatValue(tag.value, tag.unit)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
            <svg
              viewBox={`0 0 ${spark.length - 1} 24`}
              className="mt-2 h-8 w-full text-[#1F3F93]"
              aria-label="Historian sparkline for Pack_03 requested speed"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                points={spark
                  .map((v, i) => {
                    const y = 22 - ((v - sparkMin) / Math.max(1, sparkMax - sparkMin)) * 20;
                    return `${i},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">
              Historian · Pack_03.RequestedSpd_pct · source-time
            </p>
          </Panel>

          <Panel title="Alarm pipeline" testId="alarm-panel">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">
              Detect → classify → suppress → present → ack
            </p>
            <ul className="space-y-1">
              {state.alarms.map((alarm) => (
                <li
                  key={alarm.id}
                  data-alarm-state={alarm.state}
                  className="flex items-start justify-between gap-2 border-t border-[#eadfce] pt-1 first:border-t-0 first:pt-0"
                >
                  <span className="text-[11px] leading-snug text-ink-light">{alarm.text}</span>
                  <span
                    className={cn(
                      'shrink-0 font-mono text-[9px] uppercase tracking-[0.12em]',
                      alarm.state === 'alarm' && 'text-[#D55E00]',
                      alarm.state === 'advisory' && 'text-[#8B5E34]',
                      alarm.state === 'suppressed' && 'text-[#0072B2]',
                      alarm.state === 'normal' && 'text-[#2C5A3A]',
                    )}
                  >
                    {alarm.state}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Clamp filters · SAT" testId="clamp-filters">
            <ul className="grid grid-cols-2 gap-1 text-[11px] text-ink-light">
              {(
                [
                  ['min/max', '40–92 %'],
                  ['rate-of-change', '≤ 5 %/s'],
                  ['plausibility', 'vs measured PV'],
                  ['lease timer', 'TTL 5–30 min'],
                ] as const
              ).map(([name, band]) => (
                <li key={name} className="rounded-md border border-[#eadfce] bg-white/70 px-2 py-1">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#8B5E34]">
                    {name}
                  </span>
                  {band}
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-testid="malformed-sp"
              onClick={() =>
                dispatch({
                  type: state.malformedVisible ? 'HIDE_MALFORMED' : 'SHOW_MALFORMED',
                })
              }
              className="mt-2 rounded-full border border-[#8B5E34] px-3 py-1 text-[11px] text-[#8B5E34]"
            >
              Inject malformed SP {MALFORMED_SP.requested}%
            </button>
            {state.malformedVisible && (
              <ul className="mt-2 space-y-1 text-[11px] text-[#D55E00]">
                {MALFORMED_SP.reasons.map((row) => (
                  <li key={row.filter}>
                    <span className="font-mono uppercase">{row.filter}</span> · reject · {row.text}
                  </li>
                ))}
                <li className="text-ink">Loop unchanged · audit written · no actuator move.</li>
              </ul>
            )}
          </Panel>

          <Panel title="SOP lifecycle" testId="sop-gate">
            <p className="text-xs font-medium text-ink">{state.sop.title}</p>
            <p className="mt-1 text-[11px] text-ink-muted">{state.sop.rationale}</p>
            <ol className="mt-2 flex flex-wrap gap-1">
              {SOP_PHASES.map((phase) => (
                <li
                  key={phase}
                  data-sop-phase={phase}
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]',
                    state.sop.phase === phase
                      ? 'bg-ink text-paper'
                      : 'bg-white text-ink-muted',
                  )}
                >
                  {phase}
                </li>
              ))}
              {(state.sop.phase === 'rejected' || state.sop.phase === 'reverted') && (
                <li className="rounded-full bg-[#D55E00] px-2 py-0.5 font-mono text-[9px] uppercase text-white">
                  {state.sop.phase}
                </li>
              )}
            </ol>
            <p className="mt-2 font-mono text-[10px] text-ink-muted">
              {state.sop.token
                ? `Token ${state.sop.token} · ${state.sop.approver}`
                : `Awaiting ${NAMED_PERSON}`}
            </p>
            <p className="mt-1 font-mono text-[10px] tabular-nums text-ink-muted">
              {PACK_SP_PATH.split('/').slice(-1)[0]} ={' '}
              {String(state.tags[PACK_SP_PATH]?.value)} %
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                data-testid="approve-sop"
                onClick={() => dispatch({ type: 'APPROVE_SOP' })}
                className="rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-paper"
              >
                Approve SOP
              </button>
              <button
                type="button"
                data-testid="reject-sop"
                onClick={() => dispatch({ type: 'REJECT_SOP' })}
                className="rounded-full border border-[#e2d3c1] px-3 py-1 text-[11px] text-ink"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET_SOP' })}
                className="rounded-full border border-transparent px-2 py-1 text-[11px] text-ink-muted"
              >
                Reset
              </button>
            </div>
          </Panel>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              data-testid="kill-edge"
              onClick={() => dispatch({ type: 'KILL_EDGE' })}
              className="pointer-events-auto rounded-full border border-[#0072B2] bg-white px-3 py-1.5 text-[11px] font-medium text-[#0072B2]"
            >
              Kill edge crate
            </button>
            <button
              type="button"
              data-testid="restore-edge"
              onClick={() => dispatch({ type: 'RESTORE_EDGE' })}
              className="pointer-events-auto rounded-full border border-[#e2d3c1] bg-white px-3 py-1.5 text-[11px] text-ink"
            >
              Restore crate
            </button>
            <button
              type="button"
              data-testid="sis-select"
              onClick={() => dispatch({ type: 'SELECT', node: 'sis' })}
              className="pointer-events-auto rounded-full border border-[#D55E00] bg-white px-3 py-1.5 text-[11px] font-medium text-[#D55E00]"
            >
              Inspect SIS
            </button>
          </div>
        </div>
      </div>

      <p className="pointer-events-none font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
        {reduced ? 'Reduced motion · SVG stage' : KEYBOARD_HELP}
        {' · '}Audit from offering 4 feeds this tag list and clamp bands.
      </p>
    </div>
  );
}
