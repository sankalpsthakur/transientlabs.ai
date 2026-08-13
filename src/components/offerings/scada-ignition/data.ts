import type { Alarm, PlantTag } from './model';
import { INITIAL_FIELD_SNAPSHOT } from './model';

export const PLANT_NAME = 'North Cell';
export const PLANT_KIND = 'Mid-size discrete / hybrid · capacity expansion';

export interface TopologyNode {
  id:
    | 'field'
    | 'plc'
    | 'clamp'
    | 'edge'
    | 'gateway'
    | 'clients'
    | 'historian'
    | 'dmz'
    | 'erp'
    | 'sis'
    | 'sop'
    | 'cloud';
  level: string;
  title: string;
  subtitle: string;
  rate: string;
  ignition?: string;
}

export const TOPOLOGY: TopologyNode[] = [
  {
    id: 'field',
    level: 'L0',
    title: 'Field',
    subtitle: 'Press · cure oven · pack · meters',
    rate: 'sub-ms',
  },
  {
    id: 'plc',
    level: 'L1',
    title: 'PLC / DCS',
    subtitle: 'Regulatory loops · interlocks',
    rate: '10–100 ms',
  },
  {
    id: 'clamp',
    level: 'L1',
    title: 'Clamp',
    subtitle: 'Min/max · RoC · plausibility · lease',
    rate: 'scan',
  },
  {
    id: 'edge',
    level: 'L2',
    title: 'Ignition Edge',
    subtitle: 'Line IPC · store-and-forward · disposable crate',
    rate: '≤ 1 s',
    ignition: 'Edge',
  },
  {
    id: 'gateway',
    level: 'L2',
    title: 'Ignition Gateway',
    subtitle: 'UDTs · tag provider · alarm pipeline',
    rate: '100 ms–1 s',
    ignition: 'Gateway',
  },
  {
    id: 'clients',
    level: 'L2',
    title: 'Perspective / Vision',
    subtitle: 'Presents and logs. Does not decide.',
    rate: 'operator',
    ignition: 'Clients',
  },
  {
    id: 'historian',
    level: 'L2',
    title: 'Historian',
    subtitle: 'Source-time index · late arrivals ordered',
    rate: '≤ 60 s query',
    ignition: 'Tag History',
  },
  {
    id: 'dmz',
    level: 'L3.5',
    title: 'Industrial DMZ',
    subtitle: 'Broker · reverse proxy · diode · PKI',
    rate: '≤ 10 s',
  },
  {
    id: 'sop',
    level: 'L3',
    title: 'SOP gate',
    subtitle: 'Named person · e-signature · token',
    rate: 'minutes',
  },
  {
    id: 'erp',
    level: 'L4',
    title: 'ERP / MES objects',
    subtitle: 'ISA-95. Never a tag.',
    rate: 'hours–days',
  },
  {
    id: 'cloud',
    level: 'L4+',
    title: 'Cloud advisory',
    subtitle: 'Ranked SOP variants. Nothing executable.',
    rate: '1–15 min',
  },
  {
    id: 'sis',
    level: 'SIS',
    title: 'SIS · IEC 61511',
    subtitle: 'Independent solver. Read-only mirror out.',
    rate: 'independent',
  },
];

export const UDT_MEMBERS: { udt: string; cell: string; members: string[] }[] = [
  {
    udt: 'PressCell',
    cell: 'Press_01',
    members: ['CycleTime_s', 'Tonnage_kN', 'MoldTemp_C'],
  },
  {
    udt: 'CureOven',
    cell: 'Oven_02',
    members: ['Zone1_C', 'Zone2_C', 'BeltSpd_mmin'],
  },
  {
    udt: 'PackCell',
    cell: 'Pack_03',
    members: ['Cases_hr', 'Reject_pct', 'VisionOK', 'RequestedSpd_pct'],
  },
  {
    udt: 'EnergyMeter',
    cell: 'Energy',
    members: ['kW', 'kWh_shift', 'PF'],
  },
  {
    udt: 'SisMirror',
    cell: 'SIS',
    members: ['Trip', 'LEL_pct', 'EStop', 'ProofTestDue'],
  },
];

function num(path: string): number {
  const v = INITIAL_FIELD_SNAPSHOT[path];
  return typeof v === 'number' ? v : 0;
}

function flag(path: string): boolean {
  return Boolean(INITIAL_FIELD_SNAPSHOT[path]);
}

export function buildTags(): Record<string, PlantTag> {
  const tags: PlantTag[] = [
    {
      path: 'Site/NorthCell/Press_01/CycleTime_s',
      udt: 'PressCell',
      cell: 'Press_01',
      label: 'Cycle time',
      unit: 's',
      value: num('Site/NorthCell/Press_01/CycleTime_s'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Press_01/Tonnage_kN',
      udt: 'PressCell',
      cell: 'Press_01',
      label: 'Tonnage',
      unit: 'kN',
      value: num('Site/NorthCell/Press_01/Tonnage_kN'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Press_01/MoldTemp_C',
      udt: 'PressCell',
      cell: 'Press_01',
      label: 'Mold temp',
      unit: '°C',
      value: num('Site/NorthCell/Press_01/MoldTemp_C'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Oven_02/Zone1_C',
      udt: 'CureOven',
      cell: 'Oven_02',
      label: 'Zone 1',
      unit: '°C',
      value: num('Site/NorthCell/Oven_02/Zone1_C'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Oven_02/Zone2_C',
      udt: 'CureOven',
      cell: 'Oven_02',
      label: 'Zone 2',
      unit: '°C',
      value: num('Site/NorthCell/Oven_02/Zone2_C'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Oven_02/BeltSpd_mmin',
      udt: 'CureOven',
      cell: 'Oven_02',
      label: 'Belt speed',
      unit: 'm/min',
      value: num('Site/NorthCell/Oven_02/BeltSpd_mmin'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Pack_03/Cases_hr',
      udt: 'PackCell',
      cell: 'Pack_03',
      label: 'Cases / hour',
      unit: '/h',
      value: num('Site/NorthCell/Pack_03/Cases_hr'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Pack_03/Reject_pct',
      udt: 'PackCell',
      cell: 'Pack_03',
      label: 'Reject',
      unit: '%',
      value: num('Site/NorthCell/Pack_03/Reject_pct'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Pack_03/VisionOK',
      udt: 'PackCell',
      cell: 'Pack_03',
      label: 'Vision OK',
      unit: '',
      value: flag('Site/NorthCell/Pack_03/VisionOK'),
      quality: 'good',
      writable: false,
      discrete: true,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Pack_03/RequestedSpd_pct',
      udt: 'PackCell',
      cell: 'Pack_03',
      label: 'Requested speed',
      unit: '%',
      value: num('Site/NorthCell/Pack_03/RequestedSpd_pct'),
      quality: 'good',
      writable: true,
      discrete: false,
      sisMirror: false,
      leased: true,
      clamp: { min: 40, max: 92, rocPerSec: 5 },
    },
    {
      path: 'Site/NorthCell/Energy/kW',
      udt: 'EnergyMeter',
      cell: 'Energy',
      label: 'Demand',
      unit: 'kW',
      value: num('Site/NorthCell/Energy/kW'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Energy/kWh_shift',
      udt: 'EnergyMeter',
      cell: 'Energy',
      label: 'Shift energy',
      unit: 'kWh',
      value: num('Site/NorthCell/Energy/kWh_shift'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/Energy/PF',
      udt: 'EnergyMeter',
      cell: 'Energy',
      label: 'Power factor',
      unit: '',
      value: num('Site/NorthCell/Energy/PF'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: false,
      leased: false,
    },
    {
      path: 'Site/NorthCell/SIS/Trip',
      udt: 'SisMirror',
      cell: 'SIS',
      label: 'Trip',
      unit: '',
      value: flag('Site/NorthCell/SIS/Trip'),
      quality: 'good',
      writable: false,
      discrete: true,
      sisMirror: true,
      leased: false,
    },
    {
      path: 'Site/NorthCell/SIS/LEL_pct',
      udt: 'SisMirror',
      cell: 'SIS',
      label: 'LEL (mirror)',
      unit: '%',
      value: num('Site/NorthCell/SIS/LEL_pct'),
      quality: 'good',
      writable: false,
      discrete: false,
      sisMirror: true,
      leased: false,
    },
    {
      path: 'Site/NorthCell/SIS/EStop',
      udt: 'SisMirror',
      cell: 'SIS',
      label: 'E-stop',
      unit: '',
      value: flag('Site/NorthCell/SIS/EStop'),
      quality: 'good',
      writable: false,
      discrete: true,
      sisMirror: true,
      leased: false,
    },
    {
      path: 'Site/NorthCell/SIS/ProofTestDue',
      udt: 'SisMirror',
      cell: 'SIS',
      label: 'Proof-test due',
      unit: '',
      value: flag('Site/NorthCell/SIS/ProofTestDue'),
      quality: 'good',
      writable: false,
      discrete: true,
      sisMirror: true,
      leased: false,
    },
  ];

  return Object.fromEntries(tags.map((tag) => [tag.path, tag]));
}

export const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'a-oven-hi',
    tag: 'Site/NorthCell/Oven_02/Zone2_C',
    state: 'advisory',
    text: 'Zone 2 approaching HI band · actionable · no flood',
    actionable: true,
  },
  {
    id: 'a-pf',
    tag: 'Site/NorthCell/Energy/PF',
    state: 'normal',
    text: 'Power factor inside contracted window',
    actionable: false,
  },
  {
    id: 'a-vision',
    tag: 'Site/NorthCell/Pack_03/VisionOK',
    state: 'normal',
    text: 'Vision last-fail aged out',
    actionable: false,
  },
  {
    id: 'a-twin',
    tag: 'twin.validity',
    state: 'suppressed',
    text: 'Twin in-domain · no model-unavailable advisory',
    actionable: false,
  },
];

export const HISTORIAN_SEED: number[] = [61, 61, 62, 62, 63, 62, 62, 61, 62, 62, 63, 62];

export const SOP_PHASES = [
  'proposed',
  'screened',
  'pending',
  'approved',
  'armed',
  'executing',
  'verified',
] as const;

export const MALFORMED_SP = {
  requested: 142,
  reasons: [
    { filter: 'min/max', text: '142% outside 40–92% band' },
    { filter: 'rate-of-change', text: 'Δ 80 %/s exceeds 5 %/s' },
    { filter: 'plausibility', text: 'Implausible vs measured 62%' },
    { filter: 'lease', text: 'No signed SOP token on the lease' },
  ],
} as const;

export const KEYBOARD_HELP =
  '0–4 degrade mode · R re-arm · A approve SOP · K kill edge · S SIS inspector · Esc clear';
