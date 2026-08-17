import type {
  Actor,
  ActionResult,
  BayId,
  BaySpec,
  CommercialDeal,
  ControlStratum,
  CrmStage,
  EvidencePack,
  FinanceMatch,
  FinanceWorkflowId,
  Lane,
  MatchTier,
  MrpNode,
  NamedPerson,
  Selection,
  SopPhase,
  SystemChip,
  WorkOrder,
} from './types';

/** Homepage paper tokens — gold is the gate, never neon. */
export const PAPER = '#F8F2E9';
export const PAPER_WARM = '#EFE4D5';
export const PAPER_DEEP = '#E4D4C0';
export const INK = '#18120D';
export const INK_MUTED = '#67584B';
export const GOLD = '#C4A15A';
export const GOLD_SOFT = '#D4B87A';
export const LEDGER = '#8B5E34';
export const SIGNAL = '#1F3F93';
export const FOREST = '#2C5A3A';
export const STEEL = '#6B6358';
export const STEEL_DARK = '#3A342C';
export const CHAR = '#2A221C';
export const BORDER = '#E2D3C1';
export const SIS_OXIDE = '#7A2E24';
export const EXCEPTION = '#A15A32';

export const INSIGHT: Record<Lane, string> = {
  production: 'Work moves. A gold gate decides. The red cabinet never takes an order.',
  finance: 'Match tiers do the volume. Agents propose. The controller posts.',
  commercial: 'Existing systems stay. Transient maps, rules, acts, and leaves a trail.',
};

export const LANE_ORDER = ['production', 'finance', 'commercial'] as const satisfies readonly Lane[];

export const NAMED: NamedPerson = {
  production: 'A. Rao · Shift Lead',
  finance: 'V. Mehta · Controller',
  commercial: 'P. Shah · Sales Ops',
};

export const CLOUD_ACTOR: Actor = {
  kind: 'cloud',
  named: false,
  name: 'Cloud',
};

export const PERSON: Record<Lane, Actor> = {
  production: { kind: 'person', named: true, name: NAMED.production },
  finance: { kind: 'person', named: true, name: NAMED.finance },
  commercial: { kind: 'person', named: true, name: NAMED.commercial },
};

export const SIS_ACTOR: Actor = { kind: 'sis', named: false, name: 'SIS' };
export const MES_ACTOR: Actor = { kind: 'mes', named: false, name: 'MES' };
export const QMS_ACTOR: Actor = { kind: 'qms', named: false, name: 'QMS' };
export const SYSTEM_ACTOR: Actor = { kind: 'system', named: false, name: 'Rules' };

export const SOP_FORWARD: readonly SopPhase[] = [
  'proposed',
  'screened',
  'pending',
  'approved',
  'armed',
  'executing',
  'verified',
];

export const SOP_TERMINAL: readonly SopPhase[] = ['verified', 'rejected', 'reverted'];

export const BAYS: readonly BaySpec[] = [
  {
    id: 'press',
    label: 'Press_01',
    cell: 'North Cell',
    kind: 'cyclic',
    metric: '18.4 s cycle · 1 820 kN',
    utilisation: 0.78,
    position: [1.18, 0.28, 0.58],
  },
  {
    id: 'oven',
    label: 'Oven_02',
    cell: 'North Cell',
    kind: 'continuous',
    metric: '168 °C zone 1 · 2.4 m/min',
    utilisation: 0.91,
    position: [1.88, 0.28, 0.58],
  },
  {
    id: 'pack',
    label: 'Pack_03',
    cell: 'North Cell',
    kind: 'discrete',
    metric: '640 cases/h · 0.8% reject',
    utilisation: 0.64,
    position: [2.58, 0.28, 0.58],
  },
  {
    id: 'vision',
    label: 'Vision_03',
    cell: 'North Cell',
    kind: 'discrete',
    metric: 'Vision OK · proof-test due',
    utilisation: 0.71,
    position: [3.28, 0.28, 0.58],
  },
];

export const MATCH_TIERS: readonly {
  id: MatchTier;
  title: string;
  rule: string;
  auto: boolean;
  share: number;
  radius: number;
}[] = [
  { id: 'T1', title: 'Exact', rule: 'Key, amount, and date match. No judgement.', auto: true, share: 0.62, radius: 0.62 },
  { id: 'T2', title: 'Tolerance', rule: 'Inside a signed band. Still a rule, not a person.', auto: true, share: 0.22, radius: 0.92 },
  { id: 'T3', title: 'Rules', rule: 'Deterministic playbook. Agent may rank; it does not decide.', auto: true, share: 0.08, radius: 1.22 },
  { id: 'T4', title: 'Agentic', rule: 'A person confirms. The model only proposes.', auto: false, share: 0.08, radius: 1.52 },
];

export const FINANCE_WORKFLOWS: readonly {
  id: FinanceWorkflowId;
  title: string;
  dek: string;
  angle: number;
}[] = [
  { id: 'recon', title: 'Recon', dek: 'Bank · sub-ledger · clearing', angle: -Math.PI / 2 },
  { id: 'ocr', title: 'OCR → ERP', dek: 'Line-item capture to the live book', angle: 0 },
  { id: 'tax-leases', title: 'Tax / leases', dek: 'Deferred tax · IFRS 16', angle: Math.PI / 2 },
  { id: 'mis', title: 'MIS', dek: 'Daily pack. Same IDs as the close.', angle: Math.PI },
];

export const SYSTEMS: readonly { id: SystemChip; label: string; stays: string }[] = [
  { id: 'erp', label: 'ERP', stays: 'Books, inventory, invoices stay where they are.' },
  { id: 'crm', label: 'CRM', stays: 'Pipeline and quotes stay. The gate is new.' },
  { id: 'mes', label: 'MES', stays: 'Order of record on the floor. Not replaced.' },
  { id: 'qms', label: 'QMS', stays: 'Stamps and NCRs stay. Transient only traces them.' },
  { id: 'email', label: 'Email', stays: 'Mail and files remain a source, never a system of record.' },
];

export const STRATA: readonly { id: ControlStratum; label: string; sub: string }[] = [
  { id: 'map', label: 'MAP', sub: 'owners · states · handoffs' },
  { id: 'rules', label: 'RULES', sub: 'approvals · exceptions' },
  { id: 'actions', label: 'ACTIONS', sub: 'touchpoints · gates' },
  { id: 'trace', label: 'TRACE', sub: 'source · owner · time · criteria' },
];

export const CRM_STAGES: readonly { id: CrmStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'quoted', label: 'Quoted' },
  { id: 'won', label: 'Won' },
  { id: 'booked', label: 'Booked' },
];

export const MRP_NODES: readonly { id: MrpNode; label: string }[] = [
  { id: 'demand', label: 'Demand' },
  { id: 'gross', label: 'Gross' },
  { id: 'net', label: 'Net' },
  { id: 'planned', label: 'Planned' },
  { id: 'shortage', label: 'Shortage' },
];

export const DEPTH_RUNGS: Record<Lane, readonly { at: number; label: string }[]> = {
  production: [
    { at: 0, label: 'ISA-95 site' },
    { at: 0.16, label: 'L3 terrace' },
    { at: 0.36, label: 'Gold SOP gate' },
    { at: 0.54, label: 'Cartridge states' },
    { at: 0.74, label: 'Bay · QA stamp' },
    { at: 1, label: 'Exception · SIS' },
  ],
  finance: [
    { at: 0, label: 'Four workflows' },
    { at: 0.22, label: 'T1–T4 orrery' },
    { at: 0.48, label: 'Break filament' },
    { at: 0.72, label: 'Evidence pack' },
    { at: 0.88, label: 'Still GL gate' },
  ],
  commercial: [
    { at: 0, label: 'Five systems' },
    { at: 0.22, label: 'Control slab' },
    { at: 0.48, label: 'CRM pipeline' },
    { at: 0.72, label: 'MRP peg' },
    { at: 1, label: 'Quote-to-cash trail' },
  ],
};

export const KEYMAP = {
  lanes: {
    '1': 'production',
    p: 'production',
    '2': 'finance',
    f: 'finance',
    '3': 'commercial',
    c: 'commercial',
  } as Record<string, Lane>,
} as const;

export const INITIAL_ORDERS: readonly WorkOrder[] = [
  {
    id: 'WO-4821',
    title: 'Press liner · RM-RESIN',
    bay: 'press',
    phase: 'proposed',
    sopVariant: 'PRESS/cycle-trim/v3',
    mesId: 'MES-NC-4821',
    qaStamp: null,
    dispatch: null,
    proposedBy: 'cloud',
    armedBy: null,
    exception: null,
  },
  {
    id: 'WO-4822',
    title: 'Cure zone hold · WIP-CURE',
    bay: 'oven',
    phase: 'screened',
    sopVariant: 'OVEN/zone-hold/v2',
    mesId: 'MES-NC-4822',
    qaStamp: null,
    dispatch: null,
    proposedBy: 'cloud',
    armedBy: null,
    exception: null,
  },
  {
    id: 'WO-4823',
    title: 'Case pack A · FG-CASE',
    bay: 'pack',
    phase: 'pending',
    sopVariant: 'PACK/spd-lease/v4',
    mesId: 'MES-NC-4823',
    qaStamp: null,
    dispatch: null,
    proposedBy: 'planner',
    armedBy: null,
    exception: null,
  },
  {
    id: 'WO-4824',
    title: 'Press swap · mold 14',
    bay: 'press',
    phase: 'approved',
    sopVariant: 'PRESS/mold-swap/v1',
    mesId: 'MES-NC-4824',
    qaStamp: null,
    dispatch: null,
    proposedBy: 'planner',
    armedBy: null,
    exception: null,
  },
  {
    id: 'WO-4825',
    title: 'Pack cell B · FG-CASE',
    bay: 'pack',
    phase: 'armed',
    sopVariant: 'PACK/spd-lease/v4',
    mesId: 'MES-NC-4825',
    qaStamp: null,
    dispatch: 'ready',
    proposedBy: 'planner',
    armedBy: NAMED.production,
    exception: null,
  },
  {
    id: 'WO-4826',
    title: 'Oven zone 2 · WIP-CURE',
    bay: 'oven',
    phase: 'executing',
    sopVariant: 'OVEN/zone-hold/v2',
    mesId: 'MES-NC-4826',
    qaStamp: null,
    dispatch: 'hold',
    proposedBy: 'planner',
    armedBy: NAMED.production,
    exception: null,
  },
  {
    id: 'WO-4827',
    title: 'Vision lot · FG-CASE',
    bay: 'vision',
    phase: 'verified',
    sopVariant: 'VIS/accept/v1',
    mesId: 'MES-NC-4827',
    qaStamp: 'QA-NC-4827-A1',
    dispatch: 'ship',
    proposedBy: 'planner',
    armedBy: NAMED.production,
    exception: null,
  },
  {
    id: 'WO-4828',
    title: 'Press over-tonnage reject',
    bay: 'press',
    phase: 'rejected',
    sopVariant: 'PRESS/cycle-trim/v3',
    mesId: 'MES-NC-4828',
    qaStamp: null,
    dispatch: 'exception',
    proposedBy: 'cloud',
    armedBy: null,
    exception: 'Gold SOP failed at screen. Tonnage band exceeded.',
  },
  {
    id: 'WO-4829',
    title: 'Pack lease expired',
    bay: 'pack',
    phase: 'reverted',
    sopVariant: 'PACK/spd-lease/v4',
    mesId: 'MES-NC-4829',
    qaStamp: null,
    dispatch: 'exception',
    proposedBy: 'cloud',
    armedBy: NAMED.production,
    exception: 'Lease timer elapsed. Site systems reverted to local baseline.',
  },
];

export const INITIAL_MATCHES: readonly FinanceMatch[] = [
  {
    id: 'M-1102',
    workflow: 'recon',
    tier: 'T1',
    amount: '₹ 14.20 L',
    description: 'HDFC 4411 · ERP cash',
    status: 'orbiting',
    agingDays: 0,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'HDFC MT940 + ERP GL 1620',
      tier: 'T1',
      owner: 'Rules',
      timestamp: '2026-08-13T06:12:00+05:30',
      criteria: 'Exact UTR + amount + value date',
    },
  },
  {
    id: 'M-1108',
    workflow: 'ocr',
    tier: 'T2',
    amount: '₹ 2.84 L',
    description: 'Vendor invoice · GST 2%',
    status: 'orbiting',
    agingDays: 0,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'Scan INV-88421',
      tier: 'T2',
      owner: 'Rules',
      timestamp: '2026-08-13T07:40:00+05:30',
      criteria: 'Amount within 0.5% GST rounding band',
    },
  },
  {
    id: 'M-1114',
    workflow: 'mis',
    tier: 'T3',
    amount: '₹ 61.00 L',
    description: 'Daily MIS · WIP roll-forward',
    status: 'orbiting',
    agingDays: 1,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'MES close + ERP sub-ledger',
      tier: 'T3',
      owner: 'Rules',
      timestamp: '2026-08-12T22:05:00+05:30',
      criteria: 'WIP identity + quantity rulebook v6',
    },
  },
  {
    id: 'BRK-091',
    workflow: 'recon',
    tier: 'T3',
    amount: '₹ 6.10 L',
    description: 'Bank vs ERP cash · uncleared',
    status: 'broken',
    agingDays: 4,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'HDFC 4411',
      tier: 'T3',
      owner: '',
      timestamp: '2026-08-09T18:00:00+05:30',
      criteria: 'Clearing-window rule failed after 3 days',
    },
  },
  {
    id: 'BRK-104',
    workflow: 'tax-leases',
    tier: 'T4',
    amount: '₹ 38.50 L',
    description: 'IFRS 16 modification',
    status: 'broken',
    agingDays: 1,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'Lease schedule L-17',
      tier: 'T4',
      owner: '',
      timestamp: '2026-08-12T11:20:00+05:30',
      criteria: 'Agent ranked three treatments. A person confirms.',
    },
  },
  {
    id: 'BRK-077',
    workflow: 'ocr',
    tier: 'T2',
    amount: '₹ 0.42 L',
    description: 'Freight line · OCR doubt',
    status: 'broken',
    agingDays: 0,
    personConfirmed: false,
    controllerNamed: false,
    posted: false,
    evidence: {
      source: 'Scan INV-88490',
      tier: 'T2',
      owner: 'Rules',
      timestamp: '2026-08-13T08:15:00+05:30',
      criteria: 'Line confidence 0.71 < 0.85 band',
    },
  },
];

export const INITIAL_DEALS: readonly CommercialDeal[] = [
  {
    id: 'D-204',
    title: 'Pack cell spare kit',
    crmStage: 'quoted',
    mrp: 'planned',
    channel: 'governed',
    owner: NAMED.commercial,
    quoteId: 'Q-1044',
    shortage: false,
    booked: false,
    evidence: {
      source: 'CRM Q-1044',
      tier: 'RULES',
      owner: NAMED.commercial,
      timestamp: '2026-08-13T09:10:00+05:30',
      criteria: 'Price list v9 + 14-day validity',
    },
  },
  {
    id: 'D-188',
    title: 'Oven zone retrofit',
    crmStage: 'won',
    mrp: 'shortage',
    channel: 'governed',
    owner: NAMED.commercial,
    quoteId: 'Q-1012',
    shortage: true,
    booked: false,
    evidence: {
      source: 'CRM Q-1012 + MRP peg',
      tier: 'RULES',
      owner: NAMED.commercial,
      timestamp: '2026-08-12T16:40:00+05:30',
      criteria: 'Won only after shortage flagged to planning',
    },
  },
  {
    id: 'D-173',
    title: 'Press liner rush',
    crmStage: 'qualified',
    mrp: 'demand',
    channel: 'whatsapp-excel',
    owner: 'whoever last typed',
    quoteId: 'WA-group/North Cell sales',
    shortage: false,
    booked: false,
    evidence: {
      source: 'plan_v17_final_REAL.xlsx',
      tier: '',
      owner: '',
      timestamp: '',
      criteria: '',
    },
  },
];

export function sopIndex(phase: SopPhase): number {
  return SOP_FORWARD.indexOf(phase);
}

export function isTerminal(phase: SopPhase): boolean {
  return SOP_TERMINAL.includes(phase);
}

export function cannotSkipSop(from: SopPhase, to: SopPhase): boolean {
  if (to === 'rejected' || to === 'reverted') return false;
  const a = sopIndex(from);
  const b = sopIndex(to);
  if (a < 0 || b < 0) return true;
  return b > a + 1;
}

export function actorMayWritePhase(to: SopPhase, actor: Actor): ActionResult {
  if (actor.kind === 'sis') {
    return { ok: false, reason: 'SIS has no write path.' };
  }
  if (actor.kind === 'cloud') {
    if (to === 'proposed') return { ok: true, reason: 'Cloud proposes.' };
    return { ok: false, reason: 'Cloud proposes. A named person arms. Cloud has no further write.' };
  }
  if (to === 'approved' || to === 'armed' || to === 'rejected') {
    if (actor.kind !== 'person' || !actor.named) {
      return { ok: false, reason: 'A named competent person must sign this gate.' };
    }
  }
  if (to === 'executing' && actor.kind !== 'mes' && actor.kind !== 'system' && actor.kind !== 'person') {
    return { ok: false, reason: 'MES is the order of record once the cartridge is armed.' };
  }
  if (to === 'verified' && actor.kind !== 'qms' && actor.kind !== 'person') {
    return { ok: false, reason: 'QA stamp is a QMS write, not a cloud write.' };
  }
  return { ok: true, reason: `${actor.name} may write ${to}.` };
}

export function canTransition(from: SopPhase, to: SopPhase, actor: Actor): ActionResult {
  if (from === to) return { ok: false, reason: `Already ${from}.` };
  if (isTerminal(from) && to !== from) {
    return { ok: false, reason: `Cartridge is ${from}. Terminal.` };
  }
  if (to === 'rejected') {
    if (from === 'verified' || from === 'reverted') {
      return { ok: false, reason: 'Cannot reject a finished or reverted cartridge.' };
    }
    return actorMayWritePhase(to, actor);
  }
  if (to === 'reverted') {
    if (from !== 'approved' && from !== 'armed' && from !== 'executing') {
      return { ok: false, reason: 'Only approved, armed, or executing cartridges revert.' };
    }
    if (actor.kind === 'sis') return { ok: false, reason: 'SIS has no write path.' };
    if (actor.kind === 'cloud') return { ok: false, reason: 'Cloud cannot revert a live order.' };
    return { ok: true, reason: 'Site systems revert to the last signed baseline.' };
  }
  if (cannotSkipSop(from, to)) {
    return { ok: false, reason: `Cannot skip. ${from} does not open ${to}.` };
  }
  const expected = SOP_FORWARD[sopIndex(from) + 1];
  if (expected !== to) {
    return { ok: false, reason: `Next legal state is ${expected}, not ${to}.` };
  }
  return actorMayWritePhase(to, actor);
}

export function transitionOrder(
  order: WorkOrder,
  to: SopPhase,
  actor: Actor
): { order: WorkOrder; result: ActionResult } {
  const result = canTransition(order.phase, to, actor);
  if (!result.ok) return { order, result };
  const next: WorkOrder = { ...order, phase: to };
  if (to === 'armed') {
    next.armedBy = actor.name;
    next.dispatch = next.dispatch ?? 'ready';
  }
  if (to === 'verified') {
    next.qaStamp = next.qaStamp ?? `QA-NC-${order.id.slice(3)}-A1`;
    next.dispatch = 'ship';
  }
  if (to === 'rejected' || to === 'reverted') {
    next.dispatch = 'exception';
    next.exception =
      next.exception ??
      (to === 'rejected' ? 'Named person rejected at the gold gate.' : 'Reverted to local baseline.');
  }
  return { order: next, result };
}

export function nextForwardPhase(phase: SopPhase): SopPhase | null {
  const i = sopIndex(phase);
  if (i < 0 || i >= SOP_FORWARD.length - 1) return null;
  return SOP_FORWARD[i + 1] ?? null;
}

export function prevForwardPhase(phase: SopPhase): SopPhase | null {
  const i = sopIndex(phase);
  if (i <= 0) return null;
  return SOP_FORWARD[i - 1] ?? null;
}

export function actorForAdvance(to: SopPhase, lanePerson: Actor): Actor {
  if (to === 'screened' || to === 'pending') return SYSTEM_ACTOR;
  if (to === 'approved' || to === 'armed') return lanePerson;
  if (to === 'executing') return MES_ACTOR;
  if (to === 'verified') return QMS_ACTOR;
  return lanePerson;
}

export function sisMayWrite(): false {
  return false;
}

export function cloudMayArm(): false {
  return false;
}

export function evidenceComplete(pack: Partial<EvidencePack>): pack is EvidencePack {
  return Boolean(pack.source && pack.tier && pack.owner && pack.timestamp && pack.criteria);
}

export function autoMatchRate(shares = MATCH_TIERS): number {
  return shares.filter((t) => t.auto).reduce((sum, t) => sum + t.share, 0);
}

export function canAutoMatch(tier: MatchTier): boolean {
  return tier === 'T1' || tier === 'T2' || tier === 'T3';
}

export function canConfirmMatch(match: FinanceMatch, actor: Actor): ActionResult {
  if (actor.kind === 'sis') return { ok: false, reason: 'SIS has no write path.' };
  if (match.status === 'posted') return { ok: false, reason: 'Already posted. The GL does not rewrite itself.' };
  if (match.tier === 'T4') {
    if (actor.kind !== 'person' || !actor.named) {
      return { ok: false, reason: 'T4 is agentic. A named person confirms.' };
    }
  }
  if (!canAutoMatch(match.tier) && (actor.kind !== 'person' || !actor.named)) {
    return { ok: false, reason: 'This tier cannot confirm itself.' };
  }
  return { ok: true, reason: match.tier === 'T4' ? `${actor.name} confirmed.` : 'Rules confirmed the match.' };
}

export function canPostToGl(match: FinanceMatch, actor: Actor): ActionResult {
  if (actor.kind === 'sis') return { ok: false, reason: 'SIS has no write path.' };
  if (actor.kind === 'cloud') {
    return { ok: false, reason: 'Nothing writes itself to the GL. A named controller posts.' };
  }
  if (actor.kind !== 'person' || !actor.named) {
    return { ok: false, reason: 'Nothing writes itself to the GL. A named controller posts.' };
  }
  if (match.posted) return { ok: false, reason: 'Already posted.' };
  if (match.status !== 'confirmed' && match.status !== 'held') {
    if (match.status === 'broken') {
      return { ok: false, reason: 'A break cannot post. Resolve the filament first.' };
    }
    return { ok: false, reason: 'Match must be confirmed before the controller posts.' };
  }
  if (match.tier === 'T4' && !match.personConfirmed) {
    return { ok: false, reason: 'T4 is agentic. A person confirms before the controller posts.' };
  }
  if (!evidenceComplete(match.evidence)) {
    return { ok: false, reason: 'Evidence pack incomplete. Source, tier, owner, timestamp, criteria.' };
  }
  return { ok: true, reason: `${actor.name} posted. Trail is replayable.` };
}

export function canBookOrder(deal: CommercialDeal, actor: Actor): ActionResult {
  if (actor.kind === 'sis') return { ok: false, reason: 'SIS has no write path.' };
  if (deal.channel === 'whatsapp-excel') {
    return {
      ok: false,
      reason: 'A WhatsApp group and a sheet cannot book the ERP. Convert to a governed trail first.',
    };
  }
  if (deal.booked) return { ok: false, reason: 'Already booked.' };
  if (deal.crmStage !== 'won') {
    return { ok: false, reason: 'Only a won quote books. The CRM does not invent an order.' };
  }
  if (deal.shortage) {
    return { ok: false, reason: 'MRP shortage is open. Planning signs before the book.' };
  }
  if (actor.kind !== 'person' || !actor.named) {
    return { ok: false, reason: 'A named owner books. Existing ERP stays; Transient only opens the gate.' };
  }
  if (!evidenceComplete(deal.evidence)) {
    return { ok: false, reason: 'Evidence pack incomplete. Source, tier, owner, timestamp, criteria.' };
  }
  return { ok: true, reason: `${actor.name} booked ${deal.quoteId} into the ERP that already exists.` };
}

export function convertDealToGoverned(deal: CommercialDeal, actor: Actor): ActionResult {
  if (deal.channel === 'governed') return { ok: false, reason: 'Already on the governed trail.' };
  if (actor.kind !== 'person' || !actor.named) {
    return { ok: false, reason: 'A named owner must lift the sheet into the map.' };
  }
  return { ok: true, reason: `${actor.name} mapped the sheet onto CRM + MRP + TRACE.` };
}

export function laneFromKey(key: string): Lane | null {
  const k = key.length === 1 ? key.toLowerCase() : key;
  return KEYMAP.lanes[k] ?? null;
}

export function bayById(id: BayId): BaySpec {
  return BAYS.find((b) => b.id === id)!;
}

export function nextBay(id: BayId): BayId {
  const i = BAYS.findIndex((b) => b.id === id);
  return BAYS[(i + 1) % BAYS.length]!.id;
}

export function nextTier(id: MatchTier): MatchTier {
  const order: MatchTier[] = ['T1', 'T2', 'T3', 'T4'];
  return order[(order.indexOf(id) + 1) % order.length]!;
}

export function nextWorkflow(id: FinanceWorkflowId): FinanceWorkflowId {
  const i = FINANCE_WORKFLOWS.findIndex((w) => w.id === id);
  return FINANCE_WORKFLOWS[(i + 1) % FINANCE_WORKFLOWS.length]!.id;
}

export function nextCrm(id: CrmStage): CrmStage {
  const i = CRM_STAGES.findIndex((s) => s.id === id);
  return CRM_STAGES[(i + 1) % CRM_STAGES.length]!.id;
}

export function nextMrp(id: MrpNode): MrpNode {
  const i = MRP_NODES.findIndex((s) => s.id === id);
  return MRP_NODES[(i + 1) % MRP_NODES.length]!.id;
}

export function nextSystem(id: SystemChip): SystemChip {
  const i = SYSTEMS.findIndex((s) => s.id === id);
  return SYSTEMS[(i + 1) % SYSTEMS.length]!.id;
}

export function nextStratum(id: ControlStratum): ControlStratum {
  const i = STRATA.findIndex((s) => s.id === id);
  return STRATA[(i + 1) % STRATA.length]!.id;
}

export function selectionKey(selection: Selection): string {
  if (!selection) return '';
  if ('id' in selection) return `${selection.kind}:${selection.id}`;
  return selection.kind;
}

export function depthRung(lane: Lane, depth: number): string {
  const rungs = DEPTH_RUNGS[lane];
  let current = rungs[0]!.label;
  for (const rung of rungs) {
    if (depth >= rung.at - 0.001) current = rung.label;
  }
  return current;
}

export function utilisationMean(bays: readonly BaySpec[] = BAYS): number {
  return bays.reduce((s, b) => s + b.utilisation, 0) / bays.length;
}

export function brokenMatches(matches: readonly FinanceMatch[]): FinanceMatch[] {
  return matches.filter((m) => m.status === 'broken');
}

export function exceptionOrders(orders: readonly WorkOrder[]): WorkOrder[] {
  return orders.filter((o) => o.phase === 'rejected' || o.phase === 'reverted');
}

export function waitingAtGate(orders: readonly WorkOrder[]): WorkOrder[] {
  return orders.filter((o) => o.phase === 'approved' || o.phase === 'pending');
}

export function phaseTint(phase: SopPhase): string {
  switch (phase) {
    case 'proposed':
    case 'screened':
      return STEEL;
    case 'pending':
      return LEDGER;
    case 'approved':
    case 'armed':
      return GOLD;
    case 'executing':
      return SIGNAL;
    case 'verified':
      return FOREST;
    case 'rejected':
    case 'reverted':
      return EXCEPTION;
    default:
      return INK;
  }
}

export const KEY_LEGEND: readonly { key: string; does: string }[] = [
  { key: '1 / P', does: 'Production floor' },
  { key: '2 / F', does: 'Finance orrery' },
  { key: '3 / C', does: 'Commercial desk' },
  { key: 'G', does: 'Gold SOP / GL gate' },
  { key: 'B', does: 'Cycle machine bays' },
  { key: 'X', does: 'Cycle breaks / exceptions' },
  { key: 'T', does: 'Cycle match tiers' },
  { key: 'S', does: 'SIS · no write path' },
  { key: 'E', does: 'Evidence pack' },
  { key: 'Enter / A', does: 'Named person arms / confirms / posts' },
  { key: 'R', does: 'Reject' },
  { key: 'V', does: 'Revert' },
  { key: 'Space / →', does: 'Advance legal state' },
  { key: '←', does: 'Step back one legal state' },
  { key: '[ ]', does: 'Camera depth' },
  { key: 'Esc', does: 'Clear selection' },
  { key: '?', does: 'Toggle this legend' },
];
