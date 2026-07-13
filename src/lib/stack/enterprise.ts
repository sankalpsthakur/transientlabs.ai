import type { ModuleId } from './content';

export type EnterpriseBrief = {
  audience: string;
  decision: string;
  operatingModel: string[];
  artifacts: string[];
  diligence: string[];
  boundary: string;
};

export const enterpriseBriefs: Partial<Record<ModuleId, EnterpriseBrief>> = {
  satellites: {
    audience: 'Connectivity operators · edge platforms · infrastructure investors',
    decision: 'Where does orbital capacity create a defensible service once spectrum, gateways, terminal economics, and replenishment are treated as one system?',
    operatingModel: [
      'Constellation density and coverage geometry',
      'Gateway, spectrum, and landing-right constraints',
      'Terminal economics and service-level design',
      'Replenishment cadence and debris exposure',
    ],
    artifacts: [
      'Coverage and dependency map',
      'Ground-segment architecture',
      'Constraint and counterparty register',
      'Scenario model with explicit assumptions',
    ],
    diligence: [
      'Which service depends on density rather than a single asset?',
      'Where does traffic touch a regulated ground boundary?',
      'What fails when launch cadence or spectrum access changes?',
    ],
    boundary: 'This deep dive is a systems brief, not spectrum, orbital-safety, or investment advice. Deployment decisions require jurisdiction-specific engineering and regulatory diligence.',
  },
  'data-centers': {
    audience: 'AI infrastructure teams · campus developers · energy and grid partners',
    decision: 'Can the site secure firm power, cooling, fiber, and an interconnection path before compute demand outruns the physical campus?',
    operatingModel: [
      'Firm-power and interconnection sequence',
      'Rack density, liquid loops, and heat rejection',
      'Network fabric and failure-domain design',
      'Capacity phasing, telemetry, and operating ownership',
    ],
    artifacts: [
      'Power-to-rack capacity model',
      'Thermal and water boundary map',
      'Campus dependency architecture',
      'Phased commissioning roadmap',
    ],
    diligence: [
      'What is the first binding constraint: grid, cooling, fiber, or permits?',
      'Which load can be phased without stranding infrastructure?',
      'How are thermal, electrical, and compute incidents isolated?',
    ],
    boundary: 'Illustrative architecture only. Final campus design requires utility studies, OEM specifications, local permitting, environmental review, and stamped engineering.',
  },
  nuclear: {
    audience: 'Industrial energy buyers · data-center developers · advanced-energy teams',
    decision: 'Which load, site, licensing path, fuel assumption, and delivery model make firm nuclear power an executable program rather than a capacity placeholder?',
    operatingModel: [
      'Load shape and co-location boundary',
      'Licensing, fuel, and vendor dependencies',
      'Construction sequence and first-of-a-kind risk',
      'Grid interface, heat use, and operating authority',
    ],
    artifacts: [
      'Program dependency map',
      'Load and site boundary brief',
      'Risk-gated development roadmap',
      'Decision register with evidence owners',
    ],
    diligence: [
      'Which assumption depends on a regulator, fuel supplier, or OEM?',
      'What is the safe and commercial boundary of co-location?',
      'Which milestone converts the program from option to commitment?',
    ],
    boundary: 'This is not reactor design, licensing advice, or a safety case. Nuclear programs require qualified vendors, regulators, owner-operators, and jurisdiction-specific engineering.',
  },
};
