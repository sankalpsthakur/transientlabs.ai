/**
 * Offering 4 — Energy audit playbook (illustrative reference plant).
 * Source of truth for the folio UI and docs/decks/gaps/04-energy-audit.md.
 * Every kWh, dollar, and month on this page is labelled illustrative.
 */

export type StageId =
  | 'bills'
  | 'hotspots'
  | 'opportunities'
  | 'tags'
  | 'clamps'
  | 'sops'
  | 'handoff';

export type HotspotId = 'compressor' | 'kiln' | 'hvac' | 'line';

export type TagKind = 'existing' | 'proposed' | 'virtual';
export type Confidence = 'low' | 'medium' | 'high';

export interface Stage {
  id: StageId;
  index: number;
  code: string;
  label: string;
  rail: string;
  intent: string;
}

export interface TagSpec {
  path: string;
  desc: string;
  unit: string;
  kind: TagKind;
  source: string;
  scan: string;
  owner: string;
}

export interface ClampBand {
  id: string;
  tagPath: string;
  pv: string;
  unit: string;
  min: number;
  max: number;
  nominal: number;
  rocPerMin: number;
  leaseMin: number;
  plausibility: [number, number];
  write: 'analogue-sp' | 'none';
  note: string;
}

export interface Opportunity {
  id: string;
  hotspot: HotspotId;
  title: string;
  mechanism: string;
  evidence: string;
  assumption: string;
  dependency: string;
  confidence: Confidence;
  owner: string;
  /** Illustrative annual operating opportunity, site-dependent. */
  bandUsdYr: [number, number];
  /** Illustrative simple payback once measured. */
  paybackMonths: [number, number];
}

export interface SopDraft {
  id: string;
  hotspot: HotspotId;
  title: string;
  intent: string;
  preconditions: string[];
  steps: string[];
  clampId: string;
  approver: string;
  revert: string;
  sisNote: string;
  state: 'proposed';
}

export interface Hotspot {
  id: HotspotId;
  name: string;
  short: string;
  area: string;
  uns: string;
  duty: string;
  owner: string;
  lossMode: string;
  /** Share of illustrative site energy. */
  sharePct: number;
  /** SVG plan position, percent. */
  x: number;
  y: number;
  tags: TagSpec[];
  clamp: ClampBand;
  opportunityId: string;
  sopId: string;
}

export interface Meter {
  id: string;
  name: string;
  commodity: 'electricity' | 'gas' | 'air' | 'thermal';
  interval: string;
  status: 'in-hand' | 'gap';
  covers: string;
}

export interface Deliverable {
  id: string;
  title: string;
  feeds: string;
}

export const PLANT = {
  code: 'PLB',
  name: 'Reference Plant B',
  kind: 'Mid-size process + discrete hybrid (ceramics / heat-treat + assembly)',
  anonymous: true,
  illustrative: true,
  annualMwh: 18400,
  annualGasGj: 42000,
  peakMw: 3.2,
  tariff: 'ToU + monthly demand',
  incoming: '11 kV · 2 × 1 600 kVA',
} as const;

export const ENGAGEMENT = {
  name: 'Energy audit → Ignition handoff',
  priceUsd: 40000,
  weeks: 4,
  deckPriceUsd: 30000,
  // Retained as reference data only — nothing on the site renders a fee any more.
  // The deck discrepancy is still open and still worth fixing.
  priceNote:
    'The site no longer publishes a fee. Internally the engagement is $40,000; Transient Labs Deck slide 08 still prints $30,000 — treat the deck as stale until revised.',
} as const;

export const METHOD_WEEKS = [
  {
    week: 1,
    title: 'Baseline the site',
    work: 'Confirm the energy and control boundary. Ingest 12 months of bills, interval data, and the equipment list. Walk the process with operators. Name the decision owner.',
    artifact: 'Boundary memo · meter inventory · walkdown notes',
  },
  {
    week: 2,
    title: 'Trace loss and control',
    work: 'Close a production-normalised energy balance. Separate operating variance from design loss. Map every major load to a sensing, historian, and control gap.',
    artifact: 'Energy balance · variance log · sensing-gap map',
  },
  {
    week: 3,
    title: 'Design the interventions',
    work: 'Model opportunities with explicit assumptions. Draft analogue clamp envelopes from HAZOP-shaped limits. Write first advisory SOP variants. No live writes.',
    artifact: 'Opportunity models · clamp table · SOP drafts',
  },
  {
    week: 4,
    title: 'Make the roadmap investable',
    work: 'Rank by confidence, effort, dependency, and operational value. Package the tag dictionary, clamp bands, and SOP drafts as the Ignition observe-only packet.',
    artifact: 'Decision pack · Ignition handoff',
  },
] as const;

export const STAGES: Stage[] = [
  {
    id: 'bills',
    index: 0,
    code: '01',
    label: 'Bills / meters',
    rail: 'Bills',
    intent: 'Close the site energy picture from tariffs, interval data, and the gaps between them.',
  },
  {
    id: 'hotspots',
    index: 1,
    code: '02',
    label: 'Hotspot map',
    rail: 'Map',
    intent: 'Pin the four loads that dominate variance — compressor, kiln, HVAC, line.',
  },
  {
    id: 'opportunities',
    index: 2,
    code: '03',
    label: 'Opportunity register',
    rail: 'Register',
    intent: 'Every opportunity carries evidence, an assumption, a dependency, a confidence, and an owner.',
  },
  {
    id: 'tags',
    index: 3,
    code: '04',
    label: 'Tag list',
    rail: 'Tags',
    intent: 'Translate each hotspot into a Sparkplug-ready UNS path, unit, and source.',
  },
  {
    id: 'clamps',
    index: 4,
    code: '05',
    label: 'Clamp bands',
    rail: 'Clamps',
    intent: 'HAZOP-shaped analogue envelopes for the PLC. Min, max, rate, lease. No discrete writes.',
  },
  {
    id: 'sops',
    index: 5,
    code: '06',
    label: 'Advisory SOP draft',
    rail: 'SOPs',
    intent: 'Pre-engineered variants. Proposed, not armed. A named person would approve later.',
  },
  {
    id: 'handoff',
    index: 6,
    code: '07',
    label: 'Handoff to Ignition',
    rail: 'Ignition',
    intent: 'Observe-and-buffer packet for offering 3. Cloud still proposes. SIS still has no write path.',
  },
];

export const METERS: Meter[] = [
  {
    id: 'm-in-e',
    name: 'Utility incoming (electric)',
    commodity: 'electricity',
    interval: '15 min',
    status: 'in-hand',
    covers: 'Site import · 11 kV',
  },
  {
    id: 'm-tx-a',
    name: 'TX-A 1 600 kVA LV',
    commodity: 'electricity',
    interval: '15 min',
    status: 'in-hand',
    covers: 'MCC-1 kiln + utilities',
  },
  {
    id: 'm-tx-b',
    name: 'TX-B 1 600 kVA LV',
    commodity: 'electricity',
    interval: '15 min',
    status: 'in-hand',
    covers: 'MCC-2 assembly + HVAC',
  },
  {
    id: 'm-gas',
    name: 'Gas skid fiscal',
    commodity: 'gas',
    interval: 'hourly',
    status: 'in-hand',
    covers: 'Site gas · no kiln split',
  },
  {
    id: 'm-ca',
    name: 'Compressed-air flow',
    commodity: 'air',
    interval: '—',
    status: 'gap',
    covers: 'Header not metered',
  },
  {
    id: 'm-k3',
    name: 'Kiln zone 3 thermal',
    commodity: 'thermal',
    interval: '—',
    status: 'gap',
    covers: 'Boost + damper unallocated',
  },
];

export const DELIVERABLES: Deliverable[] = [
  { id: 'd1', title: 'Energy baseline folio', feeds: 'Site decision model' },
  { id: 'd2', title: 'Annotated hotspot map', feeds: 'Ignition Perspective areas' },
  { id: 'd3', title: 'Opportunity register', feeds: 'Roadmap + M&V plan' },
  { id: 'd4', title: 'Tag dictionary (UNS / Sparkplug)', feeds: 'Ignition tag provider' },
  { id: 'd5', title: 'Clamp-band table', feeds: 'PLC clamp layer (offering 3)' },
  { id: 'd6', title: 'Advisory SOP drafts', feeds: 'SOP library (proposed only)' },
  { id: 'd7', title: 'Ignition observe-only packet', feeds: 'Offering 3 kickoff' },
];

const compressorTags: TagSpec[] = [
  {
    path: 'PLB/UTIL/CA/C1/kW',
    desc: 'C1 shaft electrical power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-1 feeder CT',
    scan: '1 s',
    owner: 'Utilities',
  },
  {
    path: 'PLB/UTIL/CA/C2/kW',
    desc: 'C2 shaft electrical power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-1 feeder CT',
    scan: '1 s',
    owner: 'Utilities',
  },
  {
    path: 'PLB/UTIL/CA/C3/kW',
    desc: 'C3 shaft electrical power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-1 feeder CT',
    scan: '1 s',
    owner: 'Utilities',
  },
  {
    path: 'PLB/UTIL/CA/HDR/P',
    desc: 'Wet-header pressure',
    unit: 'bar(g)',
    kind: 'existing',
    source: 'Local PT, not historised',
    scan: '1 s',
    owner: 'Utilities',
  },
  {
    path: 'PLB/UTIL/CA/HDR/F',
    desc: 'Header mass flow',
    unit: 'Nm³/h',
    kind: 'proposed',
    source: 'New thermal mass meter',
    scan: '1 s',
    owner: 'Utilities',
  },
  {
    path: 'PLB/UTIL/CA/HDR/SP',
    desc: 'Leased header pressure request',
    unit: 'bar(g)',
    kind: 'proposed',
    source: 'PLC analogue request tag',
    scan: '1 s',
    owner: 'Utilities supervisor',
  },
  {
    path: 'PLB/UTIL/CA/HDR/SEC',
    desc: 'Specific power (virtual)',
    unit: 'kWh/Nm³',
    kind: 'virtual',
    source: 'kW / F · quality-gated',
    scan: '10 s',
    owner: 'Utilities',
  },
];

const kilnTags: TagSpec[] = [
  {
    path: 'PLB/KILN/Z1/T',
    desc: 'Zone 1 control temperature',
    unit: '°C',
    kind: 'existing',
    source: 'Kiln PLC',
    scan: '500 ms',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z2/T',
    desc: 'Zone 2 control temperature',
    unit: '°C',
    kind: 'existing',
    source: 'Kiln PLC',
    scan: '500 ms',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z3/T',
    desc: 'Zone 3 control temperature',
    unit: '°C',
    kind: 'existing',
    source: 'Kiln PLC · not fiscal',
    scan: '500 ms',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z3/GAS',
    desc: 'Zone 3 gas flow',
    unit: 'Nm³/h',
    kind: 'proposed',
    source: 'New orifice + DP',
    scan: '1 s',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z3/kW',
    desc: 'Zone 3 electric boost',
    unit: 'kW',
    kind: 'proposed',
    source: 'MCC-1 dedicated CT',
    scan: '1 s',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z3/DMP',
    desc: 'Damper position',
    unit: '%',
    kind: 'existing',
    source: 'Kiln PLC',
    scan: '500 ms',
    owner: 'Process',
  },
  {
    path: 'PLB/KILN/Z3/SP',
    desc: 'Leased zone-3 temperature request',
    unit: '°C',
    kind: 'proposed',
    source: 'PLC analogue request tag',
    scan: '1 s',
    owner: 'Kiln technician',
  },
];

const hvacTags: TagSpec[] = [
  {
    path: 'PLB/HVAC/AHU1/kW',
    desc: 'AHU-1 supply fan power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-2 VFD',
    scan: '1 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU2/kW',
    desc: 'AHU-2 supply fan power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-2 VFD',
    scan: '1 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU1/SAT',
    desc: 'AHU-1 supply-air temperature',
    unit: '°C',
    kind: 'existing',
    source: 'BMS',
    scan: '5 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU1/OAT',
    desc: 'Outside air temperature',
    unit: '°C',
    kind: 'existing',
    source: 'BMS',
    scan: '30 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU1/OAH',
    desc: 'Outside air enthalpy',
    unit: 'kJ/kg',
    kind: 'virtual',
    source: 'OAT + humidity',
    scan: '30 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU1/OCC',
    desc: 'Assembly occupancy proxy',
    unit: 'bool',
    kind: 'proposed',
    source: 'Line run + badge count',
    scan: '60 s',
    owner: 'Facilities',
  },
  {
    path: 'PLB/HVAC/AHU1/SP',
    desc: 'Leased SAT request',
    unit: '°C',
    kind: 'proposed',
    source: 'BMS analogue request',
    scan: '5 s',
    owner: 'Facilities lead',
  },
];

const lineTags: TagSpec[] = [
  {
    path: 'PLB/ASM/L2/STATE',
    desc: 'Line 2 run / idle / down',
    unit: 'enum',
    kind: 'existing',
    source: 'Line PLC',
    scan: '200 ms',
    owner: 'Production',
  },
  {
    path: 'PLB/ASM/L2/CONV/kW',
    desc: 'Conveyor bank power',
    unit: 'kW',
    kind: 'existing',
    source: 'MCC-2',
    scan: '1 s',
    owner: 'Production',
  },
  {
    path: 'PLB/ASM/L2/OVN/T',
    desc: 'Cure-oven temperature',
    unit: '°C',
    kind: 'existing',
    source: 'Oven PLC',
    scan: '1 s',
    owner: 'Production',
  },
  {
    path: 'PLB/ASM/L2/OVN/kW',
    desc: 'Cure-oven electrical load',
    unit: 'kW',
    kind: 'proposed',
    source: 'Dedicated CT',
    scan: '1 s',
    owner: 'Production',
  },
  {
    path: 'PLB/ASM/L2/OVN/SP',
    desc: 'Leased oven temperature request',
    unit: '°C',
    kind: 'proposed',
    source: 'PLC analogue request tag',
    scan: '1 s',
    owner: 'Production supervisor',
  },
  {
    path: 'PLB/ASM/L2/IDLE_MIN',
    desc: 'Minutes in idle-loaded state',
    unit: 'min',
    kind: 'virtual',
    source: 'STATE + CONV/kW',
    scan: '10 s',
    owner: 'Production',
  },
];

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'compressor',
    name: 'Compressor hall',
    short: 'Air',
    area: 'Utilities',
    uns: 'PLB/UTIL/CA',
    duty: '3 × 132 kW rotary screw · 7.5 bar wet header',
    owner: 'Utilities supervisor',
    lossMode: 'Blow-off at night · C3 base-loaded · unmetered leaks',
    sharePct: 18,
    x: 20.5,
    y: 64,
    tags: compressorTags,
    clamp: {
      id: 'CL-CA-HDR',
      tagPath: 'PLB/UTIL/CA/HDR/SP',
      pv: 'Header pressure',
      unit: 'bar(g)',
      min: 6.6,
      max: 7.8,
      nominal: 7.0,
      rocPerMin: 0.15,
      leaseMin: 20,
      plausibility: [0, 16],
      write: 'analogue-sp',
      note: 'PLC clamp only. Cloud never starts or stops a motor.',
    },
    opportunityId: 'OPP-CA-01',
    sopId: 'SOP-EA-014',
  },
  {
    id: 'kiln',
    name: 'Tunnel kiln',
    short: 'Kiln',
    area: 'Process',
    uns: 'PLB/KILN',
    duty: 'Gas + electric boost · 1 180 °C · four zones',
    owner: 'Kiln technician',
    lossMode: 'Damper hunting · zone 3 unmetered · over-fire after SKU change',
    sharePct: 34,
    x: 51,
    y: 31,
    tags: kilnTags,
    clamp: {
      id: 'CL-KILN-Z3',
      tagPath: 'PLB/KILN/Z3/SP',
      pv: 'Zone 3 temperature',
      unit: '°C',
      min: 1140,
      max: 1195,
      nominal: 1180,
      rocPerMin: 4,
      leaseMin: 30,
      plausibility: [200, 1300],
      write: 'analogue-sp',
      note: 'Envelope from OEM curve + process HAZOP. No mode change, no trip reset.',
    },
    opportunityId: 'OPP-KILN-01',
    sopId: 'SOP-EA-022',
  },
  {
    id: 'hvac',
    name: 'Make-up air / HVAC',
    short: 'HVAC',
    area: 'Facilities',
    uns: 'PLB/HVAC',
    duty: 'AHU-1 + AHU-2 · paint and assembly pressurisation',
    owner: 'Facilities lead',
    lossMode: 'Enthalpy ignored · unoccupied over-pressure · no occupancy proxy',
    sharePct: 11,
    x: 78.5,
    y: 27,
    tags: hvacTags,
    clamp: {
      id: 'CL-HVAC-SAT',
      tagPath: 'PLB/HVAC/AHU1/SP',
      pv: 'Supply-air temperature',
      unit: '°C',
      min: 18,
      max: 24,
      nominal: 20,
      rocPerMin: 0.5,
      leaseMin: 15,
      plausibility: [5, 40],
      write: 'analogue-sp',
      note: 'Comfort and paint-booth spec still win. Occupied band is tighter than unoccupied.',
    },
    opportunityId: 'OPP-HVAC-01',
    sopId: 'SOP-EA-031',
  },
  {
    id: 'line',
    name: 'Assembly line 2',
    short: 'Line',
    area: 'Assembly',
    uns: 'PLB/ASM/L2',
    duty: '48-station discrete line · cure oven + idle-loaded conveyors',
    owner: 'Production supervisor',
    lossMode: 'Oven held hot between shifts · conveyors idle-loaded',
    sharePct: 8,
    x: 58,
    y: 71,
    tags: lineTags,
    clamp: {
      id: 'CL-L2-OVN',
      tagPath: 'PLB/ASM/L2/OVN/SP',
      pv: 'Cure-oven temperature',
      unit: '°C',
      min: 165,
      max: 185,
      nominal: 175,
      rocPerMin: 2,
      leaseMin: 20,
      plausibility: [20, 250],
      write: 'analogue-sp',
      note: 'Hold-band only. Start / stop of the oven stays a local sequence after a signed SOP.',
    },
    opportunityId: 'OPP-L2-01',
    sopId: 'SOP-EA-044',
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'OPP-CA-01',
    hotspot: 'compressor',
    title: 'Header pressure + leak + lead-lag',
    mechanism: 'Cut night blow-off, park C3, find leaks once flow exists.',
    evidence: 'C1–C3 kW vs production hours · night kW stays high with no air users',
    assumption: 'Leak survey recovers 12–18% of generated air. Header can sit at 7.0 bar.',
    dependency: 'Proposed header flow meter · leak survey window',
    confidence: 'high',
    owner: 'Utilities supervisor',
    bandUsdYr: [62000, 140000],
    paybackMonths: [3, 8],
  },
  {
    id: 'OPP-KILN-01',
    hotspot: 'kiln',
    title: 'Zone-3 settle after SKU change',
    mechanism: 'Stop damper hunting and over-fire once zone 3 is fiscal.',
    evidence: 'Z3 T oscillation ±18 °C for 40 min after changeover · gas skid not split',
    assumption: 'Settle SOP saves 4–7% of kiln gas on changeover days.',
    dependency: 'Zone-3 gas + boost meters · OEM damper curve',
    confidence: 'medium',
    owner: 'Kiln technician',
    bandUsdYr: [80000, 190000],
    paybackMonths: [6, 14],
  },
  {
    id: 'OPP-HVAC-01',
    hotspot: 'hvac',
    title: 'Unoccupied setback + enthalpy',
    mechanism: 'Drop SAT and outside-air fraction when the line is idle.',
    evidence: 'AHU kW flat across second shift · OAT already on BMS',
    assumption: 'Paint booth still meets pressure spec at the unoccupied SAT.',
    dependency: 'Occupancy proxy tag · booth pressure check',
    confidence: 'medium',
    owner: 'Facilities lead',
    bandUsdYr: [24000, 52000],
    paybackMonths: [5, 11],
  },
  {
    id: 'OPP-L2-01',
    hotspot: 'line',
    title: 'Idle-cutoff + oven hold',
    mechanism: 'Park conveyors and drop the oven to a clamped hold between shifts.',
    evidence: 'Line STATE=idle while CONV/kW and oven stay at run load',
    assumption: 'Hold at 165 °C re-enters spec inside the morning ramp budget.',
    dependency: 'Dedicated oven CT · production supervisor sign-off',
    confidence: 'high',
    owner: 'Production supervisor',
    bandUsdYr: [14000, 38000],
    paybackMonths: [4, 9],
  },
];

export const SOPS: SopDraft[] = [
  {
    id: 'SOP-EA-014',
    hotspot: 'compressor',
    title: 'Night compressor lead-lag',
    intent: 'Hold the wet header at 7.0 bar(g) and park C3 when night air demand is proven low.',
    preconditions: [
      'PLB/UTIL/CA/HDR/P quality = good',
      'Night production air users < 30% of day peak (or HDR/F in-hand)',
      'C1 available as lead',
    ],
    steps: [
      'Shift lead reviews night load against the last seven like-nights.',
      'Write leased SP 7.0 bar(g) into HDR/SP — inside CL-CA-HDR.',
      'Local PLC sequence parks C3; C2 remains lag. No cloud motor command.',
      'If header < 6.7 bar(g) for 90 s, revert to 7.5 bar local baseline.',
    ],
    clampId: 'CL-CA-HDR',
    approver: 'Shift lead · utilities',
    revert: 'Lease expiry · header low · production call · any SIS/BPCS alarm',
    sisNote: 'SIS has no role and no write path. Motors stay on the BPCS sequence.',
    state: 'proposed',
  },
  {
    id: 'SOP-EA-022',
    hotspot: 'kiln',
    title: 'Kiln damper settle after SKU change',
    intent: 'Hold zone 3 inside 1 170–1 185 °C for one lease after a product change, then release to local cascade.',
    preconditions: [
      'Changeover complete and first car in Z3',
      'Z3/T quality = good',
      'OEM damper not in manual',
    ],
    steps: [
      'Kiln technician confirms SKU recipe and damper not in hand.',
      'Write leased SP 1 180 °C into Z3/SP — inside CL-KILN-Z3.',
      'Watch damper travel; if travel > 30% in 5 min, abort and revert.',
      'On lease end, release to local cascade. Log actual vs predicted gas.',
    ],
    clampId: 'CL-KILN-Z3',
    approver: 'Kiln technician',
    revert: 'RoC > 4 °C/min · damper travel abort · any kiln interlock',
    sisNote: 'Kiln fire and gas-train SIS stay independent. This SOP never touches a trip or reset.',
    state: 'proposed',
  },
  {
    id: 'SOP-EA-031',
    hotspot: 'hvac',
    title: 'HVAC unoccupied setback',
    intent: 'Raise SAT toward 23 °C and cut outside-air fraction when assembly is unoccupied.',
    preconditions: [
      'PLB/HVAC/AHU1/OCC = unoccupied for 20 min',
      'Paint-booth ΔP inside spec',
      'OAT quality = good',
    ],
    steps: [
      'Facilities lead confirms no booth work ticket is open.',
      'Write leased SAT 23 °C into AHU1/SP — inside CL-HVAC-SAT.',
      'BMS applies the unoccupied outside-air minimum. No fan stop from this SOP.',
      'Any booth ΔP alarm reverts SAT to 20 °C immediately.',
    ],
    clampId: 'CL-HVAC-SAT',
    approver: 'Facilities lead',
    revert: 'Occupancy returns · booth ΔP alarm · lease expiry',
    sisNote: 'No SIS, life-safety, or smoke-control function is in this write path.',
    state: 'proposed',
  },
  {
    id: 'SOP-EA-044',
    hotspot: 'line',
    title: 'Line 2 idle-cutoff between shifts',
    intent: 'Drop the cure oven to a 165 °C hold and park idle-loaded conveyors between shifts.',
    preconditions: [
      'L2/STATE = idle ≥ 15 min',
      'No WIP inside the oven',
      'Morning ramp budget ≥ 25 min',
    ],
    steps: [
      'Production supervisor confirms the last pallet has cleared the oven.',
      'Write leased SP 165 °C into OVN/SP — inside CL-L2-OVN.',
      'Local sequence parks conveyor bank. Cloud does not write a discrete stop.',
      'Thirty minutes before next shift, release to 175 °C local baseline.',
    ],
    clampId: 'CL-L2-OVN',
    approver: 'Production supervisor',
    revert: 'WIP detected · temperature < 160 °C · supervisor override',
    sisNote: 'Oven over-temperature trip is SIS/BPCS and is not writable from this SOP.',
    state: 'proposed',
  },
];

export const PAYBACK = {
  label: 'illustrative',
  auditUsd: 40000,
  opportunityBandUsdYr: [180000, 420000] as [number, number],
  auditPaybackIfCompressorValidates: 'inside one tariff quarter',
  ignitionTrancheUsd: [80000, 160000] as [number, number],
  combinedMonths: [8, 18] as [number, number],
  disclaimer:
    'Illustrative. Savings are not claimed before site measurement. Bands come from the four modelled opportunities on Reference Plant B and will be replaced by M&V.',
} as const;

export const HANDOFF = {
  destination: 'Offering 3 · Ignition / SCADA foundation',
  writePath: 'none',
  mode: 'observe + buffer',
  contains: [
    'UNS / Sparkplug tag dictionary',
    'Historian gap list',
    'Clamp-band table (spec, not loaded)',
    'Four advisory SOP drafts (proposed)',
    'Named owners and approver roles',
    'DMZ note: no downward conduit in this phase',
  ],
  ignition: {
    gateway: 'Central Ignition Gateway (L2, on-prem)',
    edge: 'Edge I/O on the compressor and kiln PLCs',
    perspective: 'Area pages for UTIL / KILN / HVAC / ASM',
    historian: 'Tag provider → store-and-forward 72 h',
  },
  assertion:
    'The cloud proposes. A named competent person approves. Site systems enforce limits. Safety systems override.',
} as const;

export const HOTSPOT_ORDER: HotspotId[] = ['compressor', 'kiln', 'hvac', 'line'];

const STAGE_SPAN = 1 / STAGES.length;

export function stageFromProgress(progress: number): StageId {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const i = Math.min(STAGES.length - 1, Math.floor(p / STAGE_SPAN + 1e-9));
  return STAGES[i].id;
}

export function progressForStage(id: StageId): number {
  const i = STAGES.findIndex((s) => s.id === id);
  return (i + 0.5) / STAGES.length;
}

export function hotspotById(id: HotspotId): Hotspot {
  const found = HOTSPOTS.find((h) => h.id === id);
  if (!found) throw new Error(`Unknown hotspot: ${id}`);
  return found;
}

export function opportunityFor(id: HotspotId): Opportunity {
  const hot = hotspotById(id);
  const found = OPPORTUNITIES.find((o) => o.id === hot.opportunityId);
  if (!found) throw new Error(`Missing opportunity for ${id}`);
  return found;
}

export function sopFor(id: HotspotId): SopDraft {
  const hot = hotspotById(id);
  const found = SOPS.find((s) => s.id === hot.sopId);
  if (!found) throw new Error(`Missing SOP for ${id}`);
  return found;
}

export function tagCounts() {
  const tags = HOTSPOTS.flatMap((h) => h.tags);
  return {
    total: tags.length,
    existing: tags.filter((t) => t.kind === 'existing').length,
    proposed: tags.filter((t) => t.kind === 'proposed').length,
    virtual: tags.filter((t) => t.kind === 'virtual').length,
  };
}

export function paybackChip(stage: StageId, hotspot: HotspotId): { value: string; caption: string } {
  const opp = opportunityFor(hotspot);
  switch (stage) {
    case 'bills':
      // Was the engagement fee. Fees are quoted in the working session, not
      // merchandised on the page; the opportunity band below is analysis, and stays.
      return { value: `${ENGAGEMENT.weeks}-week audit`, caption: 'illustrative · scope, not a savings claim' };
    case 'hotspots':
      return { value: '71% of site energy', caption: 'illustrative · four pinned loads' };
    case 'opportunities':
      return {
        value: `$${(PAYBACK.opportunityBandUsdYr[0] / 1000).toFixed(0)}–${PAYBACK.opportunityBandUsdYr[1] / 1000}k/yr`,
        caption: 'illustrative opportunity band · pending M&V',
      };
    case 'tags': {
      const c = tagCounts();
      return { value: `${c.total} tags · ${c.proposed} proposed`, caption: 'illustrative dictionary · Plant B' };
    }
    case 'clamps':
      return { value: `${hotspotById(hotspot).clamp.min}–${hotspotById(hotspot).clamp.max}`, caption: `illustrative · ${hotspotById(hotspot).clamp.unit}` };
    case 'sops':
      return { value: `${opp.paybackMonths[0]}–${opp.paybackMonths[1]} mo`, caption: 'illustrative SOP payback · if validated' };
    case 'handoff':
      return {
        value: `${PAYBACK.combinedMonths[0]}–${PAYBACK.combinedMonths[1]} mo`,
        caption: 'illustrative control-path payback after first validated SOP',
      };
  }
}

export const playbook = {
  plant: PLANT,
  engagement: ENGAGEMENT,
  method: METHOD_WEEKS,
  stages: STAGES,
  meters: METERS,
  deliverables: DELIVERABLES,
  hotspots: HOTSPOTS,
  opportunities: OPPORTUNITIES,
  sops: SOPS,
  payback: PAYBACK,
  handoff: HANDOFF,
} as const;
