/**
 * Full scale continuum for The Physical Stack.
 * Each module must dramatize MACRO → … → MICRO with shapes in space + labels.
 *
 * Convention for scroll progress within a module sticky stage:
 *   0.00–0.20  widest / establishing
 *   0.20–0.45  system / assembly
 *   0.45–0.70  component / mechanism
 *   0.70–0.90  micro / material / computational grain
 *   0.90–1.00  hold on deepest grain + stakes callback
 */

import type { ModuleId } from './content';

export type ScaleOrder =
  | 'planetary'
  | 'orbital'
  | 'regional'
  | 'campus'
  | 'building'
  | 'room'
  | 'rack'
  | 'device'
  | 'module'
  | 'component'
  | 'chip'
  | 'cell'
  | 'molecular'
  | 'atomic'
  | 'nuclear'
  | 'subatomic'
  | 'bit'
  | 'photon'
  | 'signal';

export interface ScaleRung {
  id: string;
  /** Human scale name shown in HUD */
  label: string;
  /** Scientific / engineering scale note */
  scaleNote: string;
  /** Approximate SI order of magnitude (meters) for the characteristic length */
  lengthM: number;
  order: ScaleOrder;
  /** Short spatial relation: how this shape sits relative to the prior rung */
  relation: string;
  /** What the viewer should understand at this zoom */
  caption: string;
  /** Inclusive progress range [start, end] within module 0–1 */
  progress: [number, number];
}

export const scaleLadders: Record<ModuleId, ScaleRung[]> = {
  satellites: [
    {
      id: 'sat-constellation',
      label: 'Constellation',
      scaleNote: '10³–10⁴ km shell diameter',
      lengthM: 1e7,
      order: 'orbital',
      relation: 'Thousands of free-fall routers form altitude bands around Earth',
      caption: 'Coverage is a property of shell density, not a single bird overhead.',
      progress: [0.0, 0.18],
    },
    {
      id: 'sat-shell',
      label: 'Orbital shell',
      scaleNote: '~340–1,200 km altitude bands',
      lengthM: 5e5,
      order: 'orbital',
      relation: 'Shells stack as concentric free-fall highways',
      caption: 'Inclination + altitude set which latitudes see continuous sky time.',
      progress: [0.12, 0.32],
    },
    {
      id: 'sat-vehicle',
      label: 'Satellite bus',
      scaleNote: 'meters — flat-panel bus + solar',
      lengthM: 3,
      order: 'device',
      relation: 'One node in the mesh; thrusters keep station',
      caption: 'Mass, power, and link budget dominate design more than raw compute.',
      progress: [0.28, 0.48],
    },
    {
      id: 'sat-array',
      label: 'Phased array',
      scaleNote: 'centimeters — antenna elements',
      lengthM: 0.05,
      order: 'component',
      relation: 'Hundreds of elements form steerable beams without gimbals',
      caption: 'Phase shifts steer RF energy toward a moving ground terminal.',
      progress: [0.45, 0.65],
    },
    {
      id: 'sat-photon',
      label: 'RF / optical link',
      scaleNote: 'photons & symbols — GHz / laser',
      lengthM: 1e-1,
      order: 'photon',
      relation: 'Bits ride electromagnetic waves between nodes',
      caption: 'Laser crosslinks hop packets sat-to-sat; RF last-mile hits the dish.',
      progress: [0.62, 0.82],
    },
    {
      id: 'sat-bit',
      label: 'Bit stream',
      scaleNote: 'symbols → packets → IP',
      lengthM: 1e-15,
      order: 'bit',
      relation: 'Physical layer symbols become network packets in silicon',
      caption: 'The product is latency and capacity — measured in bits, paid for in orbit.',
      progress: [0.78, 1.0],
    },
  ],

  'data-centers': [
    {
      id: 'dc-campus',
      label: 'Campus',
      scaleNote: '10²–10³ m footprint',
      lengthM: 5e2,
      order: 'campus',
      relation: 'Halls, substations, and cooling yards as one thermal machine',
      caption: 'A hyperscale site is a power plant that happens to compute.',
      progress: [0.0, 0.16],
    },
    {
      id: 'dc-hall',
      label: 'Server hall',
      scaleNote: 'tens of meters — hot/cold aisles',
      lengthM: 4e1,
      order: 'room',
      relation: 'Rows of racks form fluid and electrical manifolds',
      caption: 'Aisle geometry is thermodynamics, not interior design.',
      progress: [0.12, 0.3],
    },
    {
      id: 'dc-rack',
      label: 'GPU rack',
      scaleNote: '2 m chassis · 40–120+ kW',
      lengthM: 2,
      order: 'rack',
      relation: 'Racks are the unit of power delivery and heat rejection',
      caption: 'Before FLOPS, the problem is copper, busbars, and coolant.',
      progress: [0.26, 0.44],
    },
    {
      id: 'dc-gpu',
      label: 'Accelerator',
      scaleNote: 'centimeters — HBM + die package',
      lengthM: 0.05,
      order: 'device',
      relation: 'One GPU is a silicon city bonded to memory stacks',
      caption: 'Interconnect fabric (NVLink / IB) is as capital-heavy as the chips.',
      progress: [0.4, 0.58],
    },
    {
      id: 'dc-die',
      label: 'Die / transistor',
      scaleNote: 'nanometers — logic gates',
      lengthM: 5e-9,
      order: 'chip',
      relation: 'Billions of switches flip on a few cm² of silicon',
      caption: 'Process nodes define density; yield and packaging define supply.',
      progress: [0.55, 0.75],
    },
    {
      id: 'dc-bit',
      label: 'Bit / token',
      scaleNote: 'logical unit of information',
      lengthM: 1e-15,
      order: 'bit',
      relation: 'Gate states become activations, then tokens out the network',
      caption: 'Electricity in → bits manipulated → heat out. That is the campus.',
      progress: [0.72, 1.0],
    },
  ],

  nuclear: [
    {
      id: 'nuc-site',
      label: 'Plant / SMR pad',
      scaleNote: '10²–10³ m civil works',
      lengthM: 3e2,
      order: 'campus',
      relation: 'Containment sits on a civil pad sized for safety and heat rejection',
      caption: 'SMRs shrink the pad; physics of fission does not shrink.',
      progress: [0.0, 0.15],
    },
    {
      id: 'nuc-containment',
      label: 'Containment',
      scaleNote: 'tens of meters — outer barrier',
      lengthM: 3e1,
      order: 'building',
      relation: 'First visible defense-in-depth shell',
      caption: 'Multiple independent barriers, not a single wall of hope.',
      progress: [0.1, 0.28],
    },
    {
      id: 'nuc-vessel',
      label: 'Pressure vessel',
      scaleNote: 'meters — steel boundary',
      lengthM: 4,
      order: 'device',
      relation: 'Holds coolant and core under controlled pressure',
      caption: 'Vessel integrity is a multi-decade materials problem.',
      progress: [0.24, 0.42],
    },
    {
      id: 'nuc-assembly',
      label: 'Fuel assembly',
      scaleNote: 'meters tall · cm lattice pitch',
      lengthM: 4,
      order: 'module',
      relation: 'Bundles of fuel rods form the critical geometry',
      caption: 'Geometry + enrichment set whether a chain reaction is controlled.',
      progress: [0.38, 0.55],
    },
    {
      id: 'nuc-pellet',
      label: 'Fuel pellet',
      scaleNote: 'centimeters — UO₂ ceramic',
      lengthM: 0.01,
      order: 'component',
      relation: 'Pellets stack inside cladding tubes',
      caption: 'Ceramic fuel stores energy density unmatched by chemical stores.',
      progress: [0.52, 0.68],
    },
    {
      id: 'nuc-nucleus',
      label: 'Fission event',
      scaleNote: 'femtometers — nucleus',
      lengthM: 1e-14,
      order: 'nuclear',
      relation: 'A neutron splits a heavy nucleus; fragments + neutrons + heat',
      caption: 'Mass defect becomes kinetic energy of fragments — heat at industrial scale.',
      progress: [0.65, 0.85],
    },
    {
      id: 'nuc-neutron',
      label: 'Neutron economy',
      scaleNote: 'subatomic transport',
      lengthM: 1e-15,
      order: 'subatomic',
      relation: 'Neutrons moderate, absorb, or induce the next fission',
      caption: 'Control rods and coolant tune the neutron budget — the live safety loop.',
      progress: [0.8, 1.0],
    },
  ],

  batteries: [
    {
      id: 'bat-factory',
      label: 'Gigafactory',
      scaleNote: '10²–10³ m dry rooms & lines',
      lengthM: 5e2,
      order: 'campus',
      relation: 'Coating, winding, formation as continuous process cities',
      caption: 'Output is measured in GWh/year — the industrial unit of electrification.',
      progress: [0.0, 0.14],
    },
    {
      id: 'bat-pack',
      label: 'Pack',
      scaleNote: 'meters — structure + BMS + cooling',
      lengthM: 1.5,
      order: 'device',
      relation: 'Modules bolted into a crash-safe thermal system',
      caption: 'The pack is a product; the cell is a chemistry.',
      progress: [0.1, 0.28],
    },
    {
      id: 'bat-module',
      label: 'Module',
      scaleNote: 'tens of cm — cell array',
      lengthM: 0.4,
      order: 'module',
      relation: 'Cells paralleled/series for voltage and capacity',
      caption: 'Mechanical + electrical hierarchy multiplies cell yield into vehicle range.',
      progress: [0.24, 0.4],
    },
    {
      id: 'bat-cell',
      label: 'Cell',
      scaleNote: 'cm — can / pouch / prismatic',
      lengthM: 0.07,
      order: 'cell',
      relation: 'Sealed electrochemical reactor with two electrodes',
      caption: 'Form factor is packaging; the sandwich is the engine.',
      progress: [0.36, 0.52],
    },
    {
      id: 'bat-electrode',
      label: 'Electrode stack',
      scaleNote: 'µm coatings on foil',
      lengthM: 5e-5,
      order: 'component',
      relation: 'Anode | separator | cathode — the controlled sandwich',
      caption: 'Coating thickness and porosity set rate capability and energy density.',
      progress: [0.48, 0.66],
    },
    {
      id: 'bat-ion',
      label: 'Li⁺ shuttle',
      scaleNote: 'ångströms — ion hops',
      lengthM: 1e-10,
      order: 'atomic',
      relation: 'Lithium ions move through electrolyte and host lattices',
      caption: 'Charge is electrons in the circuit; energy is ions in the solid.',
      progress: [0.62, 0.82],
    },
    {
      id: 'bat-lattice',
      label: 'Crystal host',
      scaleNote: 'atomic lattice sites',
      lengthM: 3e-10,
      order: 'atomic',
      relation: 'Cathode/anode crystal frameworks host intercalated Li',
      caption: 'Lattice stability over thousands of cycles is the cost curve’s quiet boss.',
      progress: [0.78, 1.0],
    },
  ],

  'autonomous-vehicles': [
    {
      id: 'av-street',
      label: 'Street scene',
      scaleNote: '10¹–10² m operational design domain',
      lengthM: 8e1,
      order: 'regional',
      relation: 'Vehicle is one agent among humans, signals, weather',
      caption: 'Autonomy is robotics on public roads — the long tail is the product.',
      progress: [0.0, 0.14],
    },
    {
      id: 'av-vehicle',
      label: 'Vehicle body',
      scaleNote: 'meters — mobile robot chassis',
      lengthM: 4.5,
      order: 'device',
      relation: 'Actuators + compute + sensors as one closed loop',
      caption: 'Hardware is necessary; validation infrastructure is the moat.',
      progress: [0.1, 0.28],
    },
    {
      id: 'av-sensor',
      label: 'Sensor suite',
      scaleNote: 'cm modules on body',
      lengthM: 0.15,
      order: 'component',
      relation: 'Lidar, cameras, radar fuse heterogeneous views of the same world',
      caption: 'No single modality is enough; fusion is the hard part.',
      progress: [0.24, 0.44],
    },
    {
      id: 'av-ray',
      label: 'Ray / return',
      scaleNote: 'photons & mmWave',
      lengthM: 1e-3,
      order: 'photon',
      relation: 'Each scan is a fan of measurements sampling geometry and velocity',
      caption: 'Physics first: time-of-flight, Doppler, and image formation.',
      progress: [0.4, 0.58],
    },
    {
      id: 'av-pixel',
      label: 'Pixel / point',
      scaleNote: 'discrete samples',
      lengthM: 1e-5,
      order: 'bit',
      relation: 'Raw tensors: images, point clouds, radar cubes',
      caption: 'Perception turns samples into tracks — objects with velocity.',
      progress: [0.54, 0.72],
    },
    {
      id: 'av-feature',
      label: 'Feature / intent',
      scaleNote: 'latent space',
      lengthM: 1e-15,
      order: 'bit',
      relation: 'Networks compress scenes into predicted futures',
      caption: 'Prediction is not detection: where agents go next is the product.',
      progress: [0.68, 0.86],
    },
    {
      id: 'av-act',
      label: 'Control bit',
      scaleNote: 'torque / brake commands',
      lengthM: 1e-3,
      order: 'signal',
      relation: 'Planner outputs become actuator setpoints under safety bounds',
      caption: 'Bits become motion. Liability begins where prediction meets asphalt.',
      progress: [0.82, 1.0],
    },
  ],
};

export function activeRung(moduleId: ModuleId, progress: number): ScaleRung {
  const ladder = scaleLadders[moduleId];
  let best = ladder[0];
  for (const rung of ladder) {
    const [a, b] = rung.progress;
    if (progress >= a && progress <= b) best = rung;
    else if (progress > b) best = rung;
  }
  return best;
}

/** Format length for HUD */
export function formatLengthM(m: number): string {
  if (m >= 1e6) return `${(m / 1e6).toFixed(0)} Mm`;
  if (m >= 1e3) return `${(m / 1e3).toFixed(0)} km`;
  if (m >= 1) return `${m.toPrecision(2)} m`;
  if (m >= 1e-2) return `${(m * 1e2).toPrecision(2)} cm`;
  if (m >= 1e-3) return `${(m * 1e3).toPrecision(2)} mm`;
  if (m >= 1e-6) return `${(m * 1e6).toPrecision(2)} µm`;
  if (m >= 1e-9) return `${(m * 1e9).toPrecision(2)} nm`;
  if (m >= 1e-12) return `${(m * 1e12).toPrecision(2)} pm`;
  return `${m.toExponential(0)} m`;
}
