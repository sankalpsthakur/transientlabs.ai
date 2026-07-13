/**
 * Deeper narrative strata — spatial relations + "what's underneath" notes.
 * Surfaced as progressive reveals in ModuleSection.
 */

import type { ModuleId } from './content';

export interface DepthStratum {
  layer: string;
  /** What you see at this depth */
  see: string;
  /** What sits above / around it in space */
  relation: string;
  /** Why this layer matters */
  why: string;
}

export const depthStrata: Record<ModuleId, DepthStratum[]> = {
  satellites: [
    {
      layer: 'Shell geometry',
      see: 'Thousands of co-orbiting nodes as a statistical surface',
      relation: 'Altitude bands stack like nested free-fall highways',
      why: 'Coverage is density × inclination, not a single bird overhead',
    },
    {
      layer: 'Bus & power',
      see: 'Flat-panel mass, solar wings, thruster budget',
      relation: 'Each sat is a power-limited computer with a radio face',
      why: 'Mass and watts set how long the shell can be sustained',
    },
    {
      layer: 'Aperture physics',
      see: 'Phased-array elements forming steerable beams',
      relation: 'Elements are centimeters; beams are continental',
      why: 'No gimbals — phase shift is the mechanical freedom',
    },
    {
      layer: 'Carrier → symbol',
      see: 'RF/optical energy becoming packet symbols',
      relation: 'Photons on the link become bits in silicon',
      why: 'Latency is light-time + processing — orbit is the geometry of delay',
    },
  ],
  'data-centers': [
    {
      layer: 'Campus as plant',
      see: 'Substations, halls, cooling yards as one thermal machine',
      relation: 'Megawatts enter at the fence; heat leaves through chillers',
      why: 'Interconnection queues now gate AI capacity more than GPUs',
    },
    {
      layer: 'Aisle thermodynamics',
      see: 'Hot/cold corridors, liquid loops, rack as a furnace',
      relation: 'Power density collapses air cooling; liquid becomes structure',
      why: 'PUE is the scoreboard for overhead that is not compute',
    },
    {
      layer: 'Package & fabric',
      see: 'HBM stacks bonded to accelerator silicon',
      relation: 'NVLink/IB are capital peers of the chips themselves',
      why: 'Training clusters are networks that happen to contain GPUs',
    },
    {
      layer: 'Gate → token',
      see: 'Nanometer switches flipping into model activations',
      relation: 'Electricity becomes information; information becomes heat',
      why: 'Every token out is a physical path of joules through silicon',
    },
  ],
  nuclear: [
    {
      layer: 'Civil boundary',
      see: 'Pad, containment, defense-in-depth shells',
      relation: 'SMR shrinks the pad; safety language stays multi-barrier',
      why: 'Licensing and site are as hard as reactor physics',
    },
    {
      layer: 'Vessel & lattice',
      see: 'Pressure boundary around fuel geometry',
      relation: 'Rod pitch and enrichment set criticality margins',
      why: 'Controlled chain reaction is a geometry problem first',
    },
    {
      layer: 'Pellet chemistry',
      see: 'Ceramic UO₂ energy density in centimeters',
      relation: 'Pellets stack inside cladding; cladding is the first barrier',
      why: 'Mass defect of fission dwarfs chemical energy density',
    },
    {
      layer: 'Neutron economy',
      see: 'Neutrons moderate, absorb, or induce the next fission',
      relation: 'Control rods and coolant tune the live safety loop',
      why: 'Firm megawatts for AI are a neutron budget made industrial',
    },
  ],
  batteries: [
    {
      layer: 'Factory throughput',
      see: 'Coating lines, formation, GWh/year as the unit',
      relation: 'Dry rooms and calendars are the real bottlenecks',
      why: 'Electrification rate-limits on process yield, not slogans',
    },
    {
      layer: 'Pack hierarchy',
      see: 'Cell → module → pack structure + BMS + cooling',
      relation: 'Mechanics and thermal paths multiply cell chemistry into range',
      why: 'The pack is the product; the cell is the chemistry engine',
    },
    {
      layer: 'Electrode stack',
      see: 'Anode | separator | cathode at micron coatings',
      relation: 'Porosity and thickness set rate vs energy',
      why: 'Coating uniformity is the silent cost-curve driver',
    },
    {
      layer: 'Ion & lattice',
      see: 'Li⁺ hops through electrolyte into crystal host sites',
      relation: 'Electrons in the circuit; ions in the solid store the energy',
      why: 'Lattice stability over cycles is what the learning curve pays for',
    },
  ],
  'autonomous-vehicles': [
    {
      layer: 'Operational domain',
      see: 'Street scene with agents, weather, rules',
      relation: 'The robot shares space with non-cooperative humans',
      why: 'The long tail of edge cases is the actual product',
    },
    {
      layer: 'Sensor geometry',
      see: 'Lidar, cameras, radar as fused viewpoints',
      relation: 'Modalities disagree; fusion is the hard system',
      why: 'No single sensor owns night, rain, and semantics',
    },
    {
      layer: 'Sample → track',
      see: 'Rays, pixels, points becoming object tracks',
      relation: 'Physics of TOF/Doppler underwrite the tensors',
      why: 'Perception without prediction is still a rear-view mirror',
    },
    {
      layer: 'Intent → control',
      see: 'Latent futures collapsing into actuator setpoints',
      relation: 'Bits become torque; liability begins on asphalt',
      why: 'Autonomy is where the physical stack meets public streets',
    },
  ],
};
