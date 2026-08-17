import type { FirmPortal, FirmPriorId, FirmStratum, FirmSystem } from './types';

/** Paper / ink language — HeroWorkflow canvas law. */
export const FIRM_COLORS = {
  paper: '#F8F2E9',
  paperAlt: '#FBF7F0',
  ink: '#18120D',
  slate: '#6F5D4C',
  signal: '#1F3F93',
  signalSoft: '#7EA2FF',
  ledger: '#8B5E34',
  forest: '#2C5A3A',
  gold: '#C4A36A',
  goldSoft: '#E0C48A',
} as const;

export const FIRM_INSIGHT =
  'The gap is not another tool. It is control, evals, and evidence you can inspect.';

// Framed by the operating problem, not by revenue band or capex moment. The
// "₹100–2,000 Cr promoter, capacity is expanding" cut was rejected: it sorted
// buyers by size instead of by whether their control path is actually broken.
export const FIRM_ICP = {
  eyebrow: 'Who this is for',
  title: 'Manufacturers running a broken control path',
  range: 'Plant · ledger · evidence',
  triggers: ['Control gap', 'Manual close', 'Unproven evidence'],
  line: 'Operators whose floor, ledger, and evidence are each governed by a different system — and by nobody in between.',
} as const;

export const STRATA: Array<{
  id: FirmStratum;
  label: 'MAP' | 'RULES' | 'ACTIONS' | 'TRACE';
  sub: string;
}> = [
  { id: 'map', label: 'MAP', sub: 'owners · states · handoffs' },
  { id: 'rules', label: 'RULES', sub: 'approvals · exceptions' },
  { id: 'actions', label: 'ACTIONS', sub: 'touchpoints · gates' },
  { id: 'trace', label: 'TRACE', sub: 'docs · timestamps' },
];

export const SYSTEMS: Array<{
  id: FirmSystem;
  label: string;
  full: string;
}> = [
  { id: 'erp', label: 'ERP', full: 'ERP / finance' },
  { id: 'crm', label: 'CRM', full: 'CRM / sales' },
  { id: 'mes', label: 'MES', full: 'MES / production' },
  { id: 'qms', label: 'QMS', full: 'QMS / quality' },
  { id: 'email', label: 'Email', full: 'Email and files' },
];

export const PORTALS: Array<{
  id: FirmPortal;
  label: string;
  cue: string;
  hrefHint: string;
}> = [
  {
    id: 'plant',
    label: 'Plant',
    cue: 'Cloud proposes. A named person opens the clamp. SIS never waits.',
    hrefHint: 'Plant Loop · visual handoff',
  },
  {
    id: 'finance',
    label: 'Finance',
    cue: 'Match tiers do the volume. Agents propose. The controller posts.',
    hrefHint: 'Finance Workflows · visual handoff',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    cue: 'If a stage is unlit, the tonne does not exist.',
    hrefHint: 'Evidence Lens · visual handoff',
  },
];

export const SEALS = [
  { id: 'soc2', label: 'SOC2', sub: 'SOC2 / GDPR practices' },
  { id: 'pq', label: 'PQ', sub: 'Post-quantum packets' },
  { id: 'trace', label: 'TRACE', sub: 'Replayable control' },
] as const;

export const FIRM_PRIORS: Array<{
  id: FirmPriorId;
  name: string;
  line: string;
}> = [
  { id: 'synapse', name: 'Synapse', line: 'LOI · edge vision' },
  { id: 'visusta', name: 'Visusta', line: 'Product handover' },
  { id: 'renewcred', name: 'RenewCred / WasteX', line: 'Evidence ops' },
  { id: 'climitra', name: 'Climitra', line: 'dMRV · carbon ops' },
  { id: 'hygenco', name: 'Hygenco', line: 'Electrolyser plant' },
  { id: 'emtribe', name: 'Emtribe', line: 'ESG unification' },
  { id: 'finance', name: 'Multi-agent finance', line: 'Match tiers · close' },
];

export const RING_OMEGA = [0.07, 0.11, 0.16] as const;
export const RING_OFFSET_X = [-0.52, 0, 0.52] as const;
export const RING_RADIUS = 1.28;
export const RING_TUBE = [0.03, 0.026, 0.022] as const;
export const RING_OPACITY = [0.28, 0.58, 0.92] as const;

export const CHIP_ORBIT_R = 2.28;
export const PORTAL_ORBIT_R = 3.22;

export const DEFAULT_ACCENT = FIRM_COLORS.signal;
