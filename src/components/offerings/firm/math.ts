import * as THREE from 'three';
import type { FirmPortal } from './types';

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

type CamKey = {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

/** Macro establish → orbit settle → slab intimacy. Authority stays planted. */
export const CAM_KEYS: CamKey[] = [
  { p: 0, pos: [3.55, 2.35, 4.35], look: [0, 0.08, 0], fov: 40 },
  { p: 0.18, pos: [2.7, 1.95, 3.55], look: [0, 0.06, 0], fov: 36 },
  { p: 0.4, pos: [1.85, 1.55, 2.85], look: [0.05, 0.08, 0], fov: 32 },
  { p: 0.64, pos: [0.85, 1.22, 2.15], look: [0, 0.1, 0.04], fov: 28 },
  { p: 0.86, pos: [0.28, 1.02, 1.62], look: [0, 0.12, 0], fov: 25 },
  { p: 1, pos: [0.08, 0.94, 1.38], look: [0, 0.14, 0], fov: 24 },
];

export const PORTAL_CAM: Record<
  FirmPortal,
  { pos: [number, number, number]; look: [number, number, number]; fov: number }
> = {
  plant: { pos: [2.15, 1.35, 2.55], look: [-2.4, 0.18, 1.55], fov: 30 },
  finance: { pos: [-1.55, 1.4, 2.85], look: [2.55, 0.16, 1.35], fov: 30 },
  evidence: { pos: [0.15, 1.85, 3.15], look: [0.05, 0.22, -2.85], fov: 32 },
};

export function sampleCamera(p: number): {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
} {
  const keys = CAM_KEYS;
  if (p <= keys[0].p) {
    return { pos: keys[0].pos, look: keys[0].look, fov: keys[0].fov };
  }
  const last = keys[keys.length - 1];
  if (p >= last.p) {
    return { pos: last.pos, look: last.look, fov: last.fov };
  }
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].p < p) i += 1;
  const a = keys[i];
  const b = keys[i + 1];
  const t = smoothstep(a.p, b.p, p);
  return {
    pos: [
      lerp(a.pos[0], b.pos[0], t),
      lerp(a.pos[1], b.pos[1], t),
      lerp(a.pos[2], b.pos[2], t),
    ],
    look: [
      lerp(a.look[0], b.look[0], t),
      lerp(a.look[1], b.look[1], t),
      lerp(a.look[2], b.look[2], t),
    ],
    fov: lerp(a.fov, b.fov, t),
  };
}

export function mixCam(
  a: { pos: [number, number, number]; look: [number, number, number]; fov: number },
  b: { pos: [number, number, number]; look: [number, number, number]; fov: number },
  t: number
) {
  const k = smoothstep(0, 1, t);
  return {
    pos: [
      lerp(a.pos[0], b.pos[0], k),
      lerp(a.pos[1], b.pos[1], k),
      lerp(a.pos[2], b.pos[2], k),
    ] as [number, number, number],
    look: [
      lerp(a.look[0], b.look[0], k),
      lerp(a.look[1], b.look[1], k),
      lerp(a.look[2], b.look[2], k),
    ] as [number, number, number],
    fov: lerp(a.fov, b.fov, k),
  };
}

export function portalWorld(i: number, radius: number): THREE.Vector3 {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
  return new THREE.Vector3(Math.cos(a) * radius, 0.18, Math.sin(a) * radius);
}
