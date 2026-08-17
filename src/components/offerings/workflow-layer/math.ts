export function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export type Vec3 = [number, number, number];

export type CamKey = {
  p: number;
  pos: Vec3;
  look: Vec3;
  fov: number;
};

export function sampleCamera(
  keys: readonly CamKey[],
  p: number
): { pos: Vec3; look: Vec3; fov: number } {
  if (keys.length === 0) {
    return { pos: [0, 1, 4], look: [0, 0, 0], fov: 36 };
  }
  const first = keys[0]!;
  if (p <= first.p) return { pos: first.pos, look: first.look, fov: first.fov };
  const last = keys[keys.length - 1]!;
  if (p >= last.p) return { pos: last.pos, look: last.look, fov: last.fov };
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1]!.p < p) i += 1;
  const a = keys[i]!;
  const b = keys[i + 1]!;
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
  a: { pos: Vec3; look: Vec3; fov: number },
  b: { pos: Vec3; look: Vec3; fov: number },
  t: number
) {
  const k = smoothstep(0, 1, t);
  return {
    pos: [
      lerp(a.pos[0], b.pos[0], k),
      lerp(a.pos[1], b.pos[1], k),
      lerp(a.pos[2], b.pos[2], k),
    ] as Vec3,
    look: [
      lerp(a.look[0], b.look[0], k),
      lerp(a.look[1], b.look[1], k),
      lerp(a.look[2], b.look[2], k),
    ] as Vec3,
    fov: lerp(a.fov, b.fov, k),
  };
}

/** Production: site ziggurat → L3 terrace → gold gate → cartridge → bay/QA → SIS. */
export const PRODUCTION_CAM: readonly CamKey[] = [
  { p: 0, pos: [5.1, 3.35, 5.6], look: [0.2, 0.35, 0.1], fov: 38 },
  { p: 0.16, pos: [3.45, 2.35, 4.35], look: [0.15, 0.28, 0.05], fov: 34 },
  { p: 0.36, pos: [1.15, 1.42, 2.75], look: [-0.35, 0.48, 0.02], fov: 30 },
  { p: 0.54, pos: [0.22, 0.92, 1.85], look: [0.05, 0.38, 0.08], fov: 26 },
  { p: 0.74, pos: [2.05, 1.18, 2.35], look: [1.85, 0.32, 0.45], fov: 28 },
  { p: 1, pos: [-1.05, 1.48, 2.55], look: [-2.25, 0.42, -0.85], fov: 30 },
];

/** Finance: four workflows → orrery → break filament → evidence → still GL. */
export const FINANCE_CAM: readonly CamKey[] = [
  { p: 0, pos: [3.6, 2.55, 3.85], look: [0, 0.12, 0], fov: 38 },
  { p: 0.22, pos: [2.15, 1.85, 2.65], look: [0, 0.08, 0], fov: 32 },
  { p: 0.48, pos: [1.55, 1.55, 1.55], look: [0.85, 0.72, 0.15], fov: 28 },
  { p: 0.72, pos: [1.85, 0.95, 1.85], look: [1.35, 0.22, 0.05], fov: 26 },
  { p: 1, pos: [0.15, 0.72, 1.85], look: [0, 0.12, 0.35], fov: 24 },
];

/** Commercial: system orbit → control slab → CRM rail → MRP peg → trail. */
export const COMMERCIAL_CAM: readonly CamKey[] = [
  { p: 0, pos: [3.45, 2.25, 3.65], look: [0, 0.22, 0], fov: 38 },
  { p: 0.22, pos: [1.85, 1.45, 2.55], look: [0, 0.28, 0], fov: 32 },
  { p: 0.48, pos: [0.35, 1.15, 2.85], look: [0.15, 0.18, 1.25], fov: 28 },
  { p: 0.72, pos: [-1.55, 1.25, 2.15], look: [-1.65, 0.22, 0.15], fov: 28 },
  { p: 1, pos: [1.85, 0.95, 1.55], look: [1.65, 0.28, 0.85], fov: 26 },
];

export const PRODUCTION_LOOKUPS: Record<string, { pos: Vec3; look: Vec3; fov: number }> = {
  gate: { pos: [0.85, 1.28, 2.35], look: [-0.4, 0.52, 0], fov: 28 },
  sis: { pos: [-1.15, 1.42, 2.25], look: [-2.35, 0.4, -1.05], fov: 30 },
  mes: { pos: [0.95, 1.15, 1.65], look: [0.45, 0.48, -0.55], fov: 28 },
  qa: { pos: [1.85, 1.05, 2.45], look: [1.55, 0.32, 1.12], fov: 28 },
  press: { pos: [1.55, 1.12, 2.15], look: [1.15, 0.28, 0.55], fov: 28 },
  oven: { pos: [2.05, 1.12, 2.15], look: [1.82, 0.28, 0.55], fov: 28 },
  pack: { pos: [2.55, 1.12, 2.15], look: [2.48, 0.28, 0.55], fov: 28 },
  vision: { pos: [2.95, 1.12, 2.15], look: [3.12, 0.28, 0.55], fov: 28 },
};

export const FINANCE_LOOKUPS: Record<string, { pos: Vec3; look: Vec3; fov: number }> = {
  gl: { pos: [0.05, 0.78, 1.95], look: [0, 0.12, 0.42], fov: 24 },
  evidence: { pos: [1.95, 0.92, 1.75], look: [1.45, 0.2, 0.05], fov: 26 },
  T1: { pos: [1.55, 1.35, 1.85], look: [0, 0.05, 0], fov: 30 },
  T2: { pos: [1.85, 1.55, 2.05], look: [0, 0.05, 0], fov: 32 },
  T3: { pos: [2.15, 1.75, 2.25], look: [0, 0.05, 0], fov: 34 },
  T4: { pos: [2.45, 1.95, 2.45], look: [0, 0.05, 0], fov: 36 },
};

export const COMMERCIAL_LOOKUPS: Record<string, { pos: Vec3; look: Vec3; fov: number }> = {
  map: { pos: [1.35, 1.15, 2.15], look: [0, 0.42, 0], fov: 28 },
  rules: { pos: [1.35, 1.05, 2.15], look: [0, 0.22, 0], fov: 28 },
  actions: { pos: [1.35, 0.95, 2.15], look: [0, 0.02, 0], fov: 28 },
  trace: { pos: [1.35, 0.85, 2.15], look: [0, -0.18, 0], fov: 28 },
  ghost: { pos: [2.15, 1.05, 1.85], look: [1.85, 0.28, 0.95], fov: 28 },
};
