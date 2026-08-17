import type {
  BatchCollar,
  DmrvStageId,
  DmrvTier,
  MonitoringPoint,
  StageDefinition,
  TierDefinition,
} from './types';

/** Homepage paper tokens — do not neon these. */
export const PAPER = '#F8F2E9';
export const PAPER_WARM = '#EFE4D5';
export const INK = '#18120D';
export const INK_MUTED = '#67584B';
export const SIGNAL = '#1F3F93';
export const LEDGER = '#8B5E34';
export const FOREST = '#2C5A3A';
export const EVIDENCE = '#3D5C4A';
export const STEEL = '#6B6358';
export const STEEL_DARK = '#3A342C';
export const CHAR = '#2A221C';
export const BORDER = '#E2D3C1';

/** Deck: "If a stage is unlit, the tonne does not exist." (landing-scope lock line) */
export const INSIGHT =
  'If a stage is unlit, the tonne does not exist.';

/** Deck slide 7 — feedstock carbon split. Range only; do not invent a point estimate. */
export const YIELD_CARBON_RANGE = {
  min: 40,
  max: 60,
  unit: '%',
  subject: 'of feedstock carbon ends up in stable biochar',
} as const;

/** Deck slide 7 — renewable-powered plant vs fossil pyrolysis energy. */
export const RENEWABLE_CREDIT_UPLIFT = {
  min: 20,
  max: 30,
  unit: '%',
  subject: 'more credits per tonne of feedstock when pyrolysis energy is renewable',
} as const;

/** Deck slides 2, 5, 10 — permanence liability horizon. */
export const PERMANENCE_YEARS = 100;

/** Deck slide 2 / 3 — removal credit price band. */
export const CDR_PRICE = {
  min: 50,
  max: 300,
  medianMin: 120,
  medianMax: 180,
  unit: '€/tCO₂e',
} as const;

export const STAGE_ORDER = [
  'design',
  'integrate',
  'track',
  'verify',
  'defend',
  'retire',
] as const satisfies readonly DmrvStageId[];

/** Journey is strictly sequential. Skipping is the deck's "most expensive mistake". */
export const CAN_SKIP_STAGES = false;

export const STAGES: readonly StageDefinition[] = [
  {
    id: 'design',
    index: 0,
    numeral: '01',
    title: 'Design',
    deckTitle: 'Project design',
    kicker: 'Baseline · additionality · permanence',
    body: 'A project only generates credits for carbon that would not have been sequestered anyway. Methodology choice locks the baseline, the additionality proof, and the permanence protocol.',
    key: 'Three pillars before a sensor is wired.',
  },
  {
    id: 'integrate',
    index: 1,
    numeral: '02',
    title: 'Integrate',
    deckTitle: 'Sensor integration',
    kicker: 'Sensors · PLC · monitoring',
    body: 'Registries no longer accept annual reports. Sensor data is the proof; PLC or logger integration is the audit trail.',
    key: 'Five monitoring points. Density is the tier.',
  },
  {
    id: 'track',
    index: 2,
    numeral: '03',
    title: 'Track',
    deckTitle: 'Batch tracking',
    kicker: 'Feedstock → pyrolysis → storage',
    body: 'Every tonne must be traceable from feedstock through pyrolysis to storage, with metadata locked at each stage. Every batch is a legal and financial unit.',
    key: 'Four lock collars. Yield is 40–60%.',
  },
  {
    id: 'verify',
    index: 3,
    numeral: '04',
    title: 'Verify',
    deckTitle: 'Third-party validation',
    kicker: 'Auditor · registry submission',
    body: 'A third-party auditor validates baseline, additionality, and permanence methodology. Registry submission leads to issuance.',
    key: 'Agentic QA reviews continuity before the auditor does.',
  },
  {
    id: 'defend',
    index: 4,
    numeral: '05',
    title: 'Defend',
    deckTitle: 'Permanence defense',
    kicker: '100-year liability · ICVCM rigor',
    body: 'Permanence is your liability. Soil incubation, stability metrics, and storage protocols must show the char remains stable for 100+ years.',
    key: 'The liability torus is the claim.',
  },
  {
    id: 'retire',
    index: 5,
    numeral: '06',
    title: 'Retire',
    deckTitle: 'Batch retirement',
    kicker: 'Registry lock · customer reporting',
    body: 'The registry locks batch metadata. The customer receives a batch-level certificate with full traceability — CSRD and SBTi reporting included. Retirement starts their compliance story.',
    key: 'A punch, not a glow. Locked metadata, not a PDF.',
  },
];

export const TIERS: readonly TierDefinition[] = [
  {
    id: 'low',
    key: '1',
    title: 'Low',
    subtitle: 'Artisanal · periodic',
    plantChange:
      'Clip a weigh pad and a photo protocol at intake. Hang a batch book. The kiln itself is unchanged.',
    agentLayer:
      'Human checklist. Periodic weigh, photo, and ledger scan. No continuous trail for an agent to QA.',
    evidence:
      'Sparse: weigh ticket + photo + batch book. Enough to start; not enough for a continuity audit.',
    rejection:
      'Annual or campaign records leave data gaps. Registries no longer treat that as proof.',
    cost: 'Cheap. Sparse. Campaign-paced.',
    bom: [
      'Platform scale (periodic weigh)',
      'Camera / phone (photo protocol)',
      'Batch book (paper, later scanned)',
      'Optional handheld moisture meter',
    ],
  },
  {
    id: 'mid',
    key: '2',
    title: 'Mid',
    subtitle: 'Kiln sensors · PLC-lite',
    plantChange:
      'Thermowell in the drum. Logger cabinet on the pad. QR or barcode on bags. Three live points: intake, reactor, output.',
    agentLayer:
      'Logger ingest on a schedule. Agents flag missing hours and broken batch IDs before the auditor arrives.',
    evidence:
      'Kiln sensors + batch IDs + PLC-lite / SD logger. Interval record, not a continuous authority path.',
    rejection:
      'Fewer gaps than a book, still interval risk. Missing hours are visible — and rejectable.',
    cost: 'Logger capex. Interval labor.',
    bom: [
      'Intake hopper scale + moisture probe',
      'Type-K thermocouple well in kiln',
      'Residence-time logger',
      'Output scale',
      'QR / barcode on bags',
      'PLC-lite / SD datalogger cabinet',
    ],
  },
  {
    id: 'high',
    key: '3',
    title: 'High',
    subtitle: 'Continuous PLC / edge',
    plantChange:
      'Edge crate. Five sensor loops. SOP terminal. Registry conduit. Lineage collars. Permanence cell on the pad.',
    agentLayer:
      'Continuous edge. Agentic QA on continuity. SOP gate: a named person opens; site systems enforce. Portable evidence folio to the registry.',
    evidence:
      'Continuous PLC/edge. Five monitoring points. Full lineage. Permanence liability. Retirement lock.',
    rejection:
      'PLC edge: no manual entry, no data gaps, no audit risk — the trail the buyer now demands.',
    cost: 'Edge + loops. Continuous, not campaign.',
    bom: [
      'All mid instruments, running continuous',
      'Gas composition (O₂ / CO / CO₂)',
      'Pressure transducer on the reactor',
      'Storage T / RH / O₂',
      'Soil-incubation logger',
      'Edge runtime crate + PLC tags',
      'SOP gate terminal',
      'Registry conduit (telemetry out only)',
    ],
  },
];

/** Deck slide 8 — five pyrolysis monitoring points. */
export const MONITORING_POINTS: readonly MonitoringPoint[] = [
  {
    id: 'intake',
    index: 1,
    label: 'Feedstock intake',
    measures: 'Moisture, carbon content, source',
    deck: 'Logged at scale.',
    position: [-1.42, 0.62, 0.18],
    cadence: { low: 'periodic', mid: 'logged', high: 'continuous' },
  },
  {
    id: 'reactor',
    index: 2,
    label: 'Pyrolysis reactor',
    measures: 'Temperature, residence time, pressure, gas',
    deck: 'Sensor-logged continuously (high) or by logger (mid).',
    position: [0.02, 0.58, 0.42],
    cadence: { low: 'absent', mid: 'logged', high: 'continuous' },
  },
  {
    id: 'output',
    index: 3,
    label: 'Biochar output',
    measures: 'Yield, carbon fraction, contamination',
    deck: 'Lab-tested per batch.',
    position: [1.12, 0.18, 0.16],
    cadence: { low: 'periodic', mid: 'logged', high: 'continuous' },
  },
  {
    id: 'storage',
    index: 4,
    label: 'Storage conditions',
    measures: 'Temperature, humidity, oxygen exclusion',
    deck: 'Monitored continuously at high tech.',
    position: [1.62, 0.28, 0.52],
    cadence: { low: 'absent', mid: 'absent', high: 'continuous' },
  },
  {
    id: 'permanence',
    index: 5,
    label: 'Permanence testing',
    measures: 'Soil incubation, stability, long-term plan',
    deck: 'Supports the 100-year durability claim.',
    position: [2.02, 0.22, -0.08],
    cadence: { low: 'absent', mid: 'absent', high: 'continuous' },
  },
];

/** Deck slide 9 — four lock collars / batch IDs. */
export const BATCH_COLLARS: readonly BatchCollar[] = [
  {
    id: 'feedstock',
    short: 'FS',
    label: 'Feedstock batch ID',
    locksAt: 'track',
    sampleId: 'FS-2026-08-0142',
    fields: ['Source', 'Carbon content', 'Moisture', 'Intake date'],
  },
  {
    id: 'pyrolysis',
    short: 'PY',
    label: 'Pyrolysis batch ID',
    locksAt: 'track',
    sampleId: 'PY-2026-08-0142',
    fields: ['Reactor conditions', 'Yield', 'Carbon fraction', 'Production date'],
  },
  {
    id: 'storage',
    short: 'ST',
    label: 'Storage batch ID',
    locksAt: 'defend',
    sampleId: 'ST-2026-08-0142',
    fields: ['Location', 'Conditions', 'Permanence tests', 'Storage date'],
  },
  {
    id: 'retirement',
    short: 'RT',
    label: 'Retirement batch ID',
    locksAt: 'retire',
    sampleId: 'RT-2026-08-0142',
    fields: ['Buyer', 'Retirement date', 'Registry confirmation', 'Customer report'],
  },
];

export const METHODOLOGIES = [
  { id: 'verra', name: 'Verra VCS', governs: 'Most mature, highest scrutiny' },
  { id: 'gold', name: 'Gold Standard CDR', governs: 'Premium buyers, permanence focus' },
  { id: 'puro', name: 'Puro Registry', governs: 'Blockchain-native, real-time batch tracking' },
  { id: 'icvcm', name: 'ICVCM', governs: 'Core Carbon Principles alignment' },
] as const;

export const DESIGN_PILLARS = [
  {
    id: 'baseline',
    title: 'Baseline',
    body: 'What happens to feedstock without pyrolysis — decomposition, landfill, or combustion? Quantify the counterfactual release.',
  },
  {
    id: 'additionality',
    title: 'Additionality',
    body: 'Why does the project exist only because of credit revenue? Financial, regulatory, or technological barriers, documented.',
  },
  {
    id: 'permanence',
    title: 'Permanence',
    body: 'Stability in soil for 100+ years. Soil testing, storage conditions, and a monitoring plan — specified up front.',
  },
] as const;

export const COUNTERFACTUALS = [
  { id: 'decomposition', label: 'Decomposition' },
  { id: 'landfill', label: 'Landfill' },
  { id: 'combustion', label: 'Combustion' },
] as const;

export const RETIREMENT_STEPS = [
  { id: 'select', label: 'Batch selection', body: 'Buyer selects specific batches for retirement.' },
  { id: 'lock', label: 'Registry lock', body: 'Registry locks feedstock, pyrolysis, storage, and permanence metadata.' },
  { id: 'certificate', label: 'Certificate & reporting', body: 'Batch-level certificate. CSRD / SBTi carry the same IDs.' },
] as const;

export const QUALITY_TESTS = [
  'Additionality',
  'Permanence',
  'No double counting',
  'Robust quantification',
] as const;

export function stageById(id: DmrvStageId): StageDefinition {
  return STAGES[STAGE_ORDER.indexOf(id)]!;
}

export function stageIndexFromProgress(progress: number): number {
  if (progress >= 1) return 5;
  if (progress <= 0) return 0;
  return Math.min(5, Math.floor(progress * 6));
}

export function isCollarLocked(
  collar: BatchCollar,
  stageIndex: number,
  maxReached: number
): boolean {
  const lockIndex = STAGE_ORDER.indexOf(collar.locksAt);
  return maxReached >= lockIndex && stageIndex >= lockIndex;
}

export function pointLive(point: MonitoringPoint, tier: DmrvTier): boolean {
  return point.cadence[tier] !== 'absent';
}

export function livePointCount(tier: DmrvTier): number {
  return MONITORING_POINTS.filter((p) => pointLive(p, tier)).length;
}

export function tierById(id: DmrvTier): TierDefinition {
  return TIERS.find((t) => t.id === id)!;
}

/** Sequential gate. Returns the index if legal, otherwise null. */
export function nextAllowedStage(
  maxReached: number,
  requested: number
): number | null {
  if (requested < 0 || requested > STAGE_ORDER.length - 1) return null;
  if (!CAN_SKIP_STAGES && requested > maxReached + 1) return null;
  return requested;
}
