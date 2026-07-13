/**
 * The Physical Stack — content & narrative spine
 *
 * Camera path (scroll = continuous zoom, not pagination):
 *   Orbit (satellites) → Campus (data centers) → Core (nuclear)
 *   → Cell (batteries) → Street (autonomous vehicles)
 *
 * Canonical public host: stack.transientlabs.ai
 * (alias: deepdive.transientlabs.ai → same experience)
 */

export type ModuleId =
  | "satellites"
  | "data-centers"
  | "nuclear"
  | "batteries"
  | "autonomous-vehicles";

export interface MechanismBeat {
  title: string;
  body: string;
}

export interface StackModule {
  id: ModuleId;
  slug: string;
  order: number;
  cameraLabel: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  hookStat: string;
  hookLabel: string;
  thesis: string;
  mechanism: MechanismBeat[];
  scale: {
    claim: string;
    comparator: string;
    detail: string;
  };
  stakes: {
    title: string;
    body: string;
    tension: string;
  };
  color: string;
  accent: string;
}

export const STACK_HOST = "stack.transientlabs.ai";
export const STACK_ALIAS_HOST = "deepdive.transientlabs.ai";
export const STACK_PATH = "/stack";

export const narrative = {
  title: "The Physical Stack",
  eyebrow: "Infrastructure megatrends",
  tagline:
    "Five bets. One story. The atoms being poured to power an AI-and-electrification century.",
  thesis:
    "Software scaled on someone else's servers. The next century scales on steel, silicon, concrete, copper, and orbit. These are not separate industries — they are one physical stack.",
  cameraPath:
    "Start in orbit. Descend through campus power. Enter the reactor core. Assemble the cell. Land on the street.",
  scrollHint: "Scroll to descend",
  skipLabel: "Jump to module",
} as const;

export const modules: StackModule[] = [
  {
    id: "satellites",
    slug: "satellites",
    order: 0,
    cameraLabel: "Orbit",
    title: "LEO Constellations",
    shortTitle: "Satellites",
    subtitle: "Starlink-type low-Earth-orbit mesh",
    hookStat: "7,000+",
    hookLabel: "active Starlink sats in LEO — and climbing",
    thesis:
      "The network is no longer a tower on a hill. It is a moving shell of routers 550 km above you, replenished every few years.",
    mechanism: [
      {
        title: "Shells, not birds",
        body: "Thousands of satellites occupy altitude bands (shells). Coverage is a statistical property of density + inclination, not a single bird overhead.",
      },
      {
        title: "Phased-array steers beams",
        body: "Ground terminals electronically steer without moving parts. Beams hand off as satellites race across the sky at ~27,000 km/h.",
      },
      {
        title: "Laser inter-sat links",
        body: "Optical crosslinks turn the constellation into a spaceborne backbone — traffic can hop sat-to-sat without touching a ground gateway.",
      },
      {
        title: "Launch cadence is the product",
        body: "Reusability collapsed cost-to-orbit. The competitive moat is replenishment rate: how fast you can fill and replace a shell.",
      },
    ],
    scale: {
      claim: "A full mega-constellation is a city of computers in free-fall",
      comparator: "vs. a few hundred GEO sats that covered the 20th century",
      detail:
        "LEO latency drops toward fiber-like numbers (~20–40 ms) because light travels less distance than bouncing off a GEO sat 36,000 km up.",
    },
    stakes: {
      title: "Spectrum, debris, and gateways",
      body: "The bottleneck is not just rockets — it is spectrum coordination, collision avoidance, and landing rights for gateways on the ground.",
      tension:
        "Whoever owns dense LEO capacity owns a second internet layer for AI edge, defense, and regions fiber never reached.",
    },
    color: "#0B1220",
    accent: "#7EA2FF",
  },
  {
    id: "data-centers",
    slug: "data-centers",
    order: 1,
    cameraLabel: "Campus",
    title: "Hyperscale Data Centers",
    shortTitle: "Data Centers",
    subtitle: "AI training & inference campuses",
    hookStat: "100+ MW",
    hookLabel: "per campus — some AI builds push toward gigawatt scale",
    thesis:
      "A modern AI campus is not a building with servers. It is a power plant that happens to compute — electricity in, tokens out, heat rejected at industrial scale.",
    mechanism: [
      {
        title: "Racks as thermal machines",
        body: "GPU racks draw 40–120+ kW each. The design problem is power delivery + heat extraction before it is FLOPS.",
      },
      {
        title: "Liquid cooling takes over",
        body: "Air hits a wall. Direct-to-chip liquid and rear-door heat exchangers move heat into facility water loops, then to chillers or free cooling.",
      },
      {
        title: "PUE is the scoreboard",
        body: "Power Usage Effectiveness tracks overhead. Best campuses approach ~1.1; every tenth of a point is megawatts of non-compute waste.",
      },
      {
        title: "Interconnect is the new chassis",
        body: "Training clusters live or die on NVLink / InfiniBand / Ethernet fabrics. The network is as capital-intensive as the GPUs.",
      },
    ],
    scale: {
      claim: "One hyperscale campus can draw like a small city",
      comparator: "≈ tens of thousands of homes continuous load",
      detail:
        "Site selection is now a three-variable optimization: cheap firm power, fiber routes, and water/permitting — not cheap land.",
    },
    stakes: {
      title: "Grid interconnection queues",
      body: "The constraint shifted from GPUs to substations and generation. Multi-year interconnection wait times now gate AI capacity.",
      tension:
        "Whoever secures power + land + fiber first locks in a decade of training and inference advantage.",
    },
    color: "#12100E",
    accent: "#E8A87C",
  },
  {
    id: "nuclear",
    slug: "nuclear",
    order: 2,
    cameraLabel: "Core",
    title: "Nuclear / SMR Reactors",
    shortTitle: "Nuclear",
    subtitle: "Firm carbon-free baseload for the AI grid",
    hookStat: "24/7",
    hookLabel: "firm power — the attribute intermittent renewables cannot fake alone",
    thesis:
      "AI and electrification need always-on megawatts. Small modular reactors aim to industrialize nuclear the way factories industrialized everything else: repeatable units, not one-off cathedrals.",
    mechanism: [
      {
        title: "Fission → heat → steam → electrons",
        body: "Neutrons split heavy nuclei; heat raises steam (or drives advanced coolants); turbines spin generators. The physics has not changed — the packaging has.",
      },
      {
        title: "Containment layers",
        body: "Fuel cladding, reactor vessel, containment building. Defense-in-depth is the design language: multiple independent barriers to release.",
      },
      {
        title: "SMR = factory modules",
        body: "50–300 MWe units built in factories, shipped, and stacked. The bet is learning curves and parallel construction vs. decade-long mega-projects.",
      },
      {
        title: "Load-follow & co-location",
        body: "New designs target co-location with data centers and industrial heat loads — nuclear as a private baseload peer, not only a utility asset.",
      },
    ],
    scale: {
      claim: "One SMR footprint can be a fraction of a gigawatt plant",
      comparator: "same firm output, modularized site plan",
      detail:
        "Traditional plants are 1+ GWe civil works. SMRs trade unit size for repetition — the scale play is manufacturing volume.",
    },
    stakes: {
      title: "Licensing, fuel, and first-of-a-kind cost",
      body: "Regulatory pathways and HALEU fuel supply are as decisive as reactor physics. FOAK projects absorb cost overruns; NOAK units need the learning curve to stick.",
      tension:
        "If SMRs clear the first commercial hump, they become the only scalable firm zero-carbon option that matches AI load shapes.",
    },
    color: "#0E1412",
    accent: "#5CE1A8",
  },
  {
    id: "batteries",
    slug: "batteries",
    order: 3,
    cameraLabel: "Cell",
    title: "Battery Gigafactories",
    shortTitle: "Batteries",
    subtitle: "Cells → modules → packs → grid storage",
    hookStat: "GWh",
    hookLabel: "annual cell output per plant — the unit that replaced 'factory'",
    thesis:
      "Electrification is a materials-and-manufacturing problem wearing a product costume. The gigafactory is the industrial form factor that made lithium-ion a commodity curve.",
    mechanism: [
      {
        title: "Anode · separator · cathode",
        body: "A cell is a controlled electrochemical sandwich. Lithium ions shuttle between electrodes through a separator soaked in electrolyte.",
      },
      {
        title: "Jelly-roll / stack → cell",
        body: "Electrodes are wound or stacked, sealed, filled, formed. Formation cycling is slow capital — time in chamber, not just line speed.",
      },
      {
        title: "Cell → module → pack",
        body: "Mechanical structure, thermal management, and BMS turn chemistry into a product that survives vibration, crash, and abuse.",
      },
      {
        title: "Learning curves compound",
        body: "Every doubling of cumulative production historically crushed $/kWh. Process yield and cathode chemistry dominate the next leg.",
      },
    ],
    scale: {
      claim: "A gigafactory is a city block of dry rooms and precision coating",
      comparator: "output measured in GWh/year, not units/hour alone",
      detail:
        "Electrode coating width, calendar speed, and formation capacity set the real throughput ceiling — not just headcount.",
    },
    stakes: {
      title: "Critical minerals & geographic concentration",
      body: "Lithium, nickel, graphite, and refining capacity are geopolitically concentrated. Factory location is a supply-chain strategy, not a real-estate one.",
      tension:
        "Whoever owns cell capacity + mineral offtake owns the rate limit on EVs, grid storage, and mobile robotics.",
    },
    color: "#14110C",
    accent: "#F0C75E",
  },
  {
    id: "autonomous-vehicles",
    slug: "autonomous-vehicles",
    order: 4,
    cameraLabel: "Street",
    title: "Autonomous Vehicles",
    shortTitle: "Autonomy",
    subtitle: "Sensor stacks, maps, and edge cases",
    hookStat: "360°",
    hookLabel: "multi-modal sensing — the car as a mobile robot",
    thesis:
      "Autonomy is not 'better cruise control.' It is a robotics stack — perception, prediction, planning, control — deployed on public roads where the long tail is the product.",
    mechanism: [
      {
        title: "Sensor suite",
        body: "Cameras for semantics, radar for velocity through weather, lidar for dense geometry. Fusion is the hard part — not any single modality.",
      },
      {
        title: "What the car sees",
        body: "Point clouds and segmentation frames become object tracks. The model predicts where agents go next, not just what they are now.",
      },
      {
        title: "Planner under constraints",
        body: "A decision stack chooses trajectories under traffic rules, comfort, and risk bounds. Edge cases are where policy meets physics.",
      },
      {
        title: "Fleet learning loop",
        body: "Miles driven feed rare-event mining. The moat is data + simulation + validation infrastructure as much as the on-car model.",
      },
    ],
    scale: {
      claim: "Robotaxi fleets turn cities into continuous validation labs",
      comparator: "billions of simulated miles + millions of real ones",
      detail:
        "The cost curve bends when one remote operator can supervise many vehicles — utilization beats unit hardware cost.",
    },
    stakes: {
      title: "Liability, regulation, and the long tail",
      body: "The technical demo is not the business. Insurance, municipal access, and rare-event safety cases decide who scales beyond geofences.",
      tension:
        "Autonomy is where the physical stack meets human streets — the last mile of the AI century is still asphalt.",
    },
    color: "#100E12",
    accent: "#C4A1FF",
  },
];

export function getModule(slug: string): StackModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModuleById(id: ModuleId): StackModule {
  const mod = modules.find((m) => m.id === id);
  if (!mod) throw new Error(`Unknown module: ${id}`);
  return mod;
}

export const moduleNav = modules.map((m) => ({
  id: m.id,
  slug: m.slug,
  label: m.shortTitle,
  cameraLabel: m.cameraLabel,
  href: `${STACK_PATH}/${m.slug}`,
  accent: m.accent,
}));
