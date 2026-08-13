'use client';

import { m } from 'framer-motion';
import {
  BAYS,
  DEPTH_RUNGS,
  FINANCE_WORKFLOWS,
  GOLD,
  INSIGHT,
  KEY_LEGEND,
  LANE_ORDER,
  MATCH_TIERS,
  NAMED,
  STRATA,
  SYSTEMS,
  depthRung,
  evidenceComplete,
  selectionKey,
  waitingAtGate,
} from './model';
import type { Lane, Selection, WorkflowApi } from './types';

export interface OverlayProps {
  api: WorkflowApi;
  accent?: string;
  reduced?: boolean;
}

const LANE_LABEL: Record<Lane, string> = {
  production: 'Production',
  finance: 'Finance',
  commercial: 'Commercial',
};

function inspectorCopy(api: WorkflowApi): {
  kicker: string;
  title: string;
  body: string;
  meta: string[];
  action?: string;
} | null {
  const sel = api.selection;
  if (!sel) return null;

  if (sel.kind === 'gate') {
    const waiting = waitingAtGate(api.orders);
    return {
      kicker: 'Gold SOP gate',
      title: 'A named person arms. Cloud only proposes.',
      body: waiting.length
        ? `${waiting[0]!.id} is ${waiting[0]!.phase}. ${NAMED.production} can approve or arm. SIS is not on this path.`
        : 'No cartridge is waiting. Cloud may propose; it cannot open the arch.',
      meta: [`Owner · ${NAMED.production}`, `Waiting · ${waiting.length}`, 'SIS · no write'],
      action: waiting.length ? 'Arm / approve' : undefined,
    };
  }
  if (sel.kind === 'sis') {
    return {
      kicker: 'SIS island',
      title: 'No write path.',
      body: 'The red cabinet is offset on purpose. Dashed mirror only. Nothing from this layer — cloud, MES, or Transient — writes into SIS.',
      meta: ['Read-only mirror', 'No inbound conduit', 'Safety override is local'],
    };
  }
  if (sel.kind === 'bay' || sel.kind === 'torus') {
    const bay = BAYS.find((b) => b.id === sel.id)!;
    const live = api.orders.filter((o) => o.bay === bay.id);
    return {
      kicker: `${bay.cell} · ${bay.kind}`,
      title: bay.label,
      body: `${bay.metric}. Utilisation ${(bay.utilisation * 100).toFixed(0)}%. MES remains the order of record; this bay only executes an armed cartridge.`,
      meta: live.map((o) => `${o.id} · ${o.phase}`),
    };
  }
  if (sel.kind === 'cartridge' || sel.kind === 'exception') {
    const order = api.orders.find((o) => o.id === sel.id);
    if (!order) return null;
    return {
      kicker: `${order.mesId} · ${order.bay}`,
      title: `${order.id} · ${order.phase}`,
      body: order.exception ?? `${order.title}. SOP ${order.sopVariant}. ${order.armedBy ? `Armed by ${order.armedBy}.` : 'Not armed.'}`,
      meta: [
        `Proposed by · ${order.proposedBy}`,
        `QA · ${order.qaStamp ?? '—'}`,
        `Dispatch · ${order.dispatch ?? '—'}`,
      ],
      action: order.phase === 'approved' || order.phase === 'pending' ? 'Arm / approve' : 'Advance',
    };
  }
  if (sel.kind === 'mes') {
    return {
      kicker: 'ISA-95 L3',
      title: 'MES is the order of record.',
      body: 'Transient does not replace the MES. Armed cartridges become MES jobs. Cloud never writes a discrete output.',
      meta: api.orders.filter((o) => o.phase === 'executing' || o.phase === 'armed').map((o) => o.mesId),
    };
  }
  if (sel.kind === 'qa') {
    const stamped = api.orders.filter((o) => o.qaStamp);
    return {
      kicker: 'QMS',
      title: 'QA stamp is a punch, not a glow.',
      body: 'Verified means a stamp ID locked to the MES job. The cartridge does not verify itself.',
      meta: stamped.map((o) => o.qaStamp!),
    };
  }
  if (sel.kind === 'dispatch') {
    const rows = api.orders.filter((o) => o.dispatch === sel.id);
    return {
      kicker: 'Dispatch column',
      title: sel.id,
      body: rows.length ? `${rows.length} cartridge${rows.length === 1 ? '' : 's'} in this column.` : 'Empty column.',
      meta: rows.map((o) => `${o.id} · ${o.phase}`),
    };
  }
  if (sel.kind === 'gl') {
    return {
      kicker: 'Controller gate',
      title: 'Nothing writes itself to the GL.',
      body: `Match tiers do the volume — ≥${Math.round(0.92 * 100)}% auto daily. ${NAMED.finance} still posts. The ERP slab does not orbit.`,
      meta: ['T1 exact · T2 tolerance · T3 rules · T4 person', 'Evidence before post'],
      action: 'Post (named controller)',
    };
  }
  if (sel.kind === 'tier') {
    const tier = MATCH_TIERS.find((t) => t.id === sel.id)!;
    return {
      kicker: `${tier.id} · ${(tier.share * 100).toFixed(0)}% of volume`,
      title: tier.title,
      body: tier.rule,
      meta: [tier.auto ? 'May auto-match' : 'Must not auto-match', 'Cannot auto-post'],
    };
  }
  if (sel.kind === 'workflow') {
    const wf = FINANCE_WORKFLOWS.find((w) => w.id === sel.id)!;
    const rows = api.matches.filter((m) => m.workflow === wf.id);
    return {
      kicker: 'Finance workflow',
      title: wf.title,
      body: wf.dek,
      meta: rows.map((m) => `${m.id} · ${m.tier} · ${m.status}`),
    };
  }
  if (sel.kind === 'break' || sel.kind === 'match') {
    const match = api.matches.find((m) => m.id === sel.id);
    if (!match) return null;
    return {
      kicker: `${match.workflow} · ${match.tier}`,
      title: `${match.id} · ${match.amount}`,
      body: `${match.description}. ${match.status === 'broken' ? `Aging ${match.agingDays}d on the filament.` : `Status ${match.status}.`} ${match.posted ? 'Posted.' : 'Not on the GL.'}`,
      meta: [
        `Source · ${match.evidence.source ?? '—'}`,
        `Owner · ${match.evidence.owner || '—'}`,
        `Criteria · ${match.evidence.criteria ?? '—'}`,
        evidenceComplete(match.evidence) ? 'Pack complete' : 'Pack incomplete',
      ],
      action: match.status === 'broken' || match.status === 'orbiting' ? 'Confirm match' : 'Post to GL',
    };
  }
  if (sel.kind === 'evidence') {
    return {
      kicker: 'Evidence pack',
      title: 'Source · tier · owner · timestamp · criteria',
      body: 'No pack, no post. The folio only appears after a human transit — never as a glow on an agent guess.',
      meta: ['Required on every GL write', 'Replayable TRACE'],
    };
  }
  if (sel.kind === 'system') {
    const sys = SYSTEMS.find((s) => s.id === sel.id)!;
    return {
      kicker: 'Existing system',
      title: sys.label,
      body: sys.stays,
      meta: ['Transient is the control layer', 'No rip-and-replace'],
    };
  }
  if (sel.kind === 'stratum') {
    const st = STRATA.find((s) => s.id === sel.id)!;
    return {
      kicker: 'Control slab',
      title: st.label,
      body: `${st.sub}. Authority does not orbit. Work (CRM, MRP, mail) may.`,
      meta: ['MAP · RULES · ACTIONS · TRACE'],
    };
  }
  if (sel.kind === 'crm-stage') {
    const rows = api.deals.filter((d) => d.crmStage === sel.id);
    return {
      kicker: 'CRM pipeline',
      title: sel.id,
      body: 'The CRM you already paid for. Transient only maps owners, gates the book, and writes TRACE.',
      meta: rows.map((d) => `${d.id} · ${d.quoteId} · ${d.channel}`),
    };
  }
  if (sel.kind === 'mrp') {
    return {
      kicker: 'MRP peg',
      title: sel.id,
      body:
        sel.id === 'shortage'
          ? 'A shortage is a first-class stop. Won quotes do not book themselves past an open peg.'
          : 'Demand → gross → net → planned. The sheet is not the plan.',
      meta: api.deals.filter((d) => d.mrp === sel.id).map((d) => `${d.id} · ${d.title}`),
    };
  }
  if (sel.kind === 'ghost') {
    const ghost = api.deals.find((d) => d.channel === 'whatsapp-excel');
    return {
      kicker: 'Before',
      title: 'Excel + WhatsApp',
      body: ghost
        ? `${ghost.title} lives in ${ghost.quoteId}. Owner: ${ghost.owner}. That cannot book the ERP.`
        : 'The ghost is gone. The trail is governed.',
      meta: ['plan_v17_final_REAL.xlsx', 'Group · North Cell sales'],
      action: ghost ? 'Lift onto governed trail' : undefined,
    };
  }
  if (sel.kind === 'deal') {
    const deal = api.deals.find((d) => d.id === sel.id);
    if (!deal) return null;
    return {
      kicker: deal.channel === 'governed' ? 'Governed' : 'Ghost channel',
      title: `${deal.id} · ${deal.title}`,
      body: `${deal.quoteId}. ${deal.shortage ? 'MRP shortage open.' : 'Peg clear.'} ${deal.booked ? 'Booked.' : 'Not booked.'}`,
      meta: [
        `Owner · ${deal.owner}`,
        `CRM · ${deal.crmStage}`,
        `MRP · ${deal.mrp}`,
        evidenceComplete(deal.evidence) ? 'Pack complete' : 'Pack incomplete',
      ],
      action:
        deal.channel === 'whatsapp-excel'
          ? 'Lift onto governed trail'
          : deal.crmStage === 'won'
            ? 'Book into ERP'
            : 'Advance CRM',
    };
  }
  return null;
}

export function Overlay({ api, accent = GOLD, reduced = false }: OverlayProps) {
  const copy = inspectorCopy(api);
  const rung = depthRung(api.lane, api.depth);
  const ticks = DEPTH_RUNGS[api.lane];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="inline-flex rounded-md border bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70 backdrop-blur-sm sm:text-[11px]"
            style={{ borderColor: `${accent}66` }}
            data-depth-rung={rung}
          >
            {rung}
          </div>
          <p className="mt-2 max-w-sm text-[12px] leading-snug text-ink/75 sm:text-[13px]">
            {INSIGHT[api.lane]}
          </p>
        </div>

        <div
          className="pointer-events-auto flex rounded-full border border-border bg-paper/95 p-0.5 shadow-sm backdrop-blur-sm"
          role="tablist"
          aria-label="Workflow lane"
        >
          {LANE_ORDER.map((lane) => {
            const on = api.lane === lane;
            return (
              <button
                key={lane}
                type="button"
                role="tab"
                aria-selected={on}
                data-testid={`workflow-lane-${lane}`}
                onClick={() => api.setLane(lane)}
                className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] sm:px-3 sm:text-[11px]"
                style={{
                  background: on ? accent : 'transparent',
                  color: on ? '#18120D' : '#67584B',
                }}
              >
                {LANE_LABEL[lane]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              {reduced ? 'Still' : 'Depth'}
            </span>
            <div className="relative h-1 flex-1 max-w-[220px] rounded-full bg-border">
              <div
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                style={{ left: `${api.depth * 100}%`, background: accent }}
              />
            </div>
          </div>
          <div className="hidden flex-wrap gap-1.5 sm:flex">
            {ticks.map((tick) => (
              <button
                key={tick.label}
                type="button"
                className="pointer-events-auto rounded border border-border bg-paper/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted"
                onClick={() => api.setDepth(tick.at)}
              >
                {tick.label}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
            1 2 3 lanes · G gate · B bay · X break · Enter arms · ? keys
          </p>
        </div>

        {copy && (
          <aside
            className="pointer-events-auto w-[min(100%,18.5rem)] rounded-xl border border-border bg-paper/95 p-3 shadow-[0_18px_40px_-28px_rgba(24,18,13,0.7)] backdrop-blur-sm"
            data-testid="workflow-inspector"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
              {copy.kicker}
            </p>
            <h3 className="mt-1 font-sans text-[15px] leading-snug text-ink">{copy.title}</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink/75">{copy.body}</p>
            {copy.meta.length > 0 && (
              <ul className="mt-2 space-y-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
                {copy.meta.slice(0, 5).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {copy.action && (
                <button
                  type="button"
                  data-testid="workflow-arm"
                  onClick={() => api.arm()}
                  className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink"
                  style={{ background: accent }}
                >
                  {copy.action}
                </button>
              )}
              {api.lane === 'production' && (
                <>
                  <button
                    type="button"
                    onClick={() => api.reject()}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => api.revert()}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
                  >
                    Revert
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => api.select(null)}
                className="rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted"
              >
                Close
              </button>
            </div>
          </aside>
        )}
      </div>

      {api.notice && (
        <m.div
          role="status"
          aria-live="polite"
          data-testid="workflow-notice"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute bottom-20 left-1/2 z-20 w-[min(92%,28rem)] -translate-x-1/2 rounded-md border border-border bg-ink px-3 py-2 text-center font-mono text-[11px] tracking-wide text-paper"
        >
          {api.notice}
        </m.div>
      )}

      {api.helpOpen && (
        <div
          className="pointer-events-auto absolute inset-3 z-30 overflow-auto rounded-xl border border-border bg-paper/97 p-4 shadow-lg sm:inset-auto sm:bottom-16 sm:left-4 sm:w-80"
          data-testid="workflow-help"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
            Keyboard
          </p>
          <ul className="mt-2 space-y-1">
            {KEY_LEGEND.map((row) => (
              <li key={row.key} className="flex justify-between gap-3 text-[12px] text-ink">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  {row.key}
                </span>
                <span className="text-right">{row.does}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function selectionLabel(selection: Selection): string {
  return selectionKey(selection);
}
