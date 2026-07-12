/**
 * glTF registry for Physical Stack.
 * Placeholders ship in public/stack/models; swap for Blender Draco builds in place.
 */

import type { ModuleId } from './content';

export interface StackModelEntry {
  id: string;
  module: ModuleId;
  path: string;
  /** When true, prefer procedural scene; still loadable for preview */
  placeholder: boolean;
  description: string;
}

export const stackModels: Record<ModuleId, StackModelEntry> = {
  satellites: {
    id: 'SatelliteBus',
    module: 'satellites',
    path: '/stack/models/satellite-bus.gltf',
    placeholder: true,
    description: 'LEO satellite bus massing (flat panel)',
  },
  'data-centers': {
    id: 'GpuPackage',
    module: 'data-centers',
    path: '/stack/models/gpu-package.gltf',
    placeholder: true,
    description: 'Accelerator package + HBM silhouette',
  },
  nuclear: {
    id: 'ReactorVessel',
    module: 'nuclear',
    path: '/stack/models/reactor-vessel.gltf',
    placeholder: true,
    description: 'Pressure vessel / SMR can',
  },
  batteries: {
    id: 'BatteryCell',
    module: 'batteries',
    path: '/stack/models/battery-cell.gltf',
    placeholder: true,
    description: 'Cylindrical cell can',
  },
  'autonomous-vehicles': {
    id: 'VehicleBody',
    module: 'autonomous-vehicles',
    path: '/stack/models/vehicle-body.gltf',
    placeholder: true,
    description: 'Vehicle body massing',
  },
};

/** Feature flag: load glTF alongside procedural when asset exists */
export const USE_GLTF =
  process.env.NEXT_PUBLIC_STACK_USE_GLTF === '1' ||
  process.env.NEXT_PUBLIC_STACK_USE_GLTF === 'true';
