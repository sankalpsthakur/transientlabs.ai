#!/usr/bin/env node
/**
 * Generates production-shaped placeholder glTF 2.0 assets for Physical Stack.
 * Replace these with Blender → Draco exports using the same filenames.
 *
 * Usage: node scripts/stack/export-placeholder-gltf.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../../public/stack/models');

function meshPrimitive(positions, indices, name, color = [0.5, 0.55, 0.65, 1]) {
  const posBytes = new Float32Array(positions);
  const idxBytes = new Uint16Array(indices);
  return { posBytes, idxBytes, name, color };
}

function box(sx = 1, sy = 1, sz = 1) {
  const x = sx / 2;
  const y = sy / 2;
  const z = sz / 2;
  const positions = [
    -x, -y, z, x, -y, z, x, y, z, -x, y, z,
    -x, -y, -z, -x, y, -z, x, y, -z, x, -y, -z,
    -x, y, -z, -x, y, z, x, y, z, x, y, -z,
    -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,
    x, -y, -z, x, y, -z, x, y, z, x, -y, z,
    -x, -y, -z, -x, -y, z, -x, y, z, -x, y, -z,
  ];
  const indices = [];
  for (let f = 0; f < 6; f++) {
    const o = f * 4;
    indices.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }
  return { positions, indices };
}

function cylinder(r = 0.5, h = 1, seg = 16) {
  const positions = [];
  const indices = [];
  // side
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    positions.push(x, -h / 2, z, x, h / 2, z);
  }
  for (let i = 0; i < seg; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
  return { positions, indices };
}

function buildGltf(mesh, extras = {}) {
  const { positions, indices } = mesh;
  const pos = new Float32Array(positions);
  const idx = new Uint16Array(indices);

  // pad index buffer to 4-byte alignment
  const idxByteLength = idx.byteLength;
  const idxPadded = Math.ceil(idxByteLength / 4) * 4;
  const bin = new ArrayBuffer(pos.byteLength + idxPadded);
  const view = new DataView(bin);
  new Uint8Array(bin, 0, pos.byteLength).set(new Uint8Array(pos.buffer));
  new Uint8Array(bin, pos.byteLength, idx.byteLength).set(new Uint8Array(idx.buffer));

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < pos.length; i += 3) {
    minX = Math.min(minX, pos[i]);
    minY = Math.min(minY, pos[i + 1]);
    minZ = Math.min(minZ, pos[i + 2]);
    maxX = Math.max(maxX, pos[i]);
    maxY = Math.max(maxY, pos[i + 1]);
    maxZ = Math.max(maxZ, pos[i + 2]);
  }

  const gltf = {
    asset: {
      version: '2.0',
      generator: 'transient-stack-placeholder',
      extras: {
        note: 'Placeholder — replace with Blender Draco export',
        pipeline: 'Blender → glTF 2.0 → gltf-transform draco + ktx2',
        ...extras,
      },
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: extras.name || 'Asset' }],
    meshes: [
      {
        name: extras.name || 'Asset',
        primitives: [
          {
            attributes: { POSITION: 1 },
            indices: 0,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        name: 'Default',
        pbrMetallicRoughness: {
          baseColorFactor: extras.color || [0.55, 0.6, 0.7, 1],
          metallicFactor: 0.35,
          roughnessFactor: 0.45,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5123,
        count: indices.length,
        type: 'SCALAR',
      },
      {
        bufferView: 1,
        componentType: 5126,
        count: positions.length / 3,
        type: 'VEC3',
        max: [maxX, maxY, maxZ],
        min: [minX, minY, minZ],
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: pos.byteLength,
        byteLength: idxByteLength,
        target: 34963,
      },
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: pos.byteLength,
        target: 34962,
      },
    ],
    buffers: [
      {
        byteLength: bin.byteLength,
        uri: `data:application/octet-stream;base64,${Buffer.from(bin).toString('base64')}`,
      },
    ],
  };

  return gltf;
}

const assets = [
  {
    file: 'satellite-bus.gltf',
    mesh: box(1.6, 0.12, 1.0),
    extras: { name: 'SatelliteBus', module: 'satellites', color: [0.45, 0.55, 0.85, 1] },
  },
  {
    file: 'gpu-package.gltf',
    mesh: box(1.2, 0.18, 1.0),
    extras: { name: 'GpuPackage', module: 'data-centers', color: [0.9, 0.65, 0.45, 1] },
  },
  {
    file: 'reactor-vessel.gltf',
    mesh: cylinder(0.7, 1.6, 24),
    extras: { name: 'ReactorVessel', module: 'nuclear', color: [0.35, 0.85, 0.6, 1] },
  },
  {
    file: 'battery-cell.gltf',
    mesh: cylinder(0.28, 1.1, 20),
    extras: { name: 'BatteryCell', module: 'batteries', color: [0.95, 0.78, 0.35, 1] },
  },
  {
    file: 'vehicle-body.gltf',
    mesh: box(2.2, 0.55, 1.0),
    extras: { name: 'VehicleBody', module: 'autonomous-vehicles', color: [0.75, 0.6, 0.95, 1] },
  },
];

fs.mkdirSync(outDir, { recursive: true });

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  compression: 'none (placeholder) — use Draco in production',
  budget: {
    maxTrianglesPerModule: 80000,
    texture: 'KTX2 preferred',
  },
  assets: [],
};

for (const a of assets) {
  const gltf = buildGltf(a.mesh, a.extras);
  const out = path.join(outDir, a.file);
  fs.writeFileSync(out, JSON.stringify(gltf));
  const bytes = fs.statSync(out).size;
  manifest.assets.push({
    id: a.extras.name,
    module: a.extras.module,
    path: `/stack/models/${a.file}`,
    bytes,
    placeholder: true,
  });
  console.log(`wrote ${a.file} (${bytes} bytes)`);
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`manifest → ${path.join(outDir, 'manifest.json')}`);
