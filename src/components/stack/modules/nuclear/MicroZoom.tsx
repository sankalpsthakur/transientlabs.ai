'use client';

import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, Points } from 'three';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Line,
  LineBasicMaterial,
  MeshStandardMaterial,
} from 'three';

export interface MicroZoomProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  fixedProgress?: number;
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Precomputed neutron transport path samples (moderation / absorption / fission seed) */
function buildNeutronPaths() {
  type Path = {
    kind: 'moderate' | 'absorb' | 'fission';
    pts: Float32Array;
  };
  const paths: Path[] = [];

  const pushPath = (
    kind: Path['kind'],
    start: [number, number, number],
    end: [number, number, number],
    segs: number,
    wobble: number
  ) => {
    const pts = new Float32Array((segs + 1) * 3);
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      // Slowing: path length stretches as energy drops (moderation visual)
      const ease =
        kind === 'moderate' ? t * t * (3 - 2 * t) : kind === 'absorb' ? t * t : t;
      const ix = i * 3;
      const noise =
        kind === 'moderate'
          ? Math.sin(t * Math.PI * 3.2 + wobble) * 0.12 * (1 - t * 0.4)
          : Math.sin(t * Math.PI * 1.4 + wobble) * 0.04;
      pts[ix] = lerp(start[0], end[0], ease) + noise;
      pts[ix + 1] = lerp(start[1], end[1], ease) + noise * 0.6;
      pts[ix + 2] = lerp(start[2], end[2], ease) - noise * 0.35;
    }
    paths.push({ kind, pts });
  };

  // Moderating paths — zig into coolant / graphite-like medium
  pushPath('moderate', [0.05, 0.02, 0.08], [-0.55, -0.2, 0.35], 18, 0.2);
  pushPath('moderate', [-0.04, 0.06, -0.05], [0.48, -0.28, -0.4], 16, 1.1);
  pushPath('moderate', [0.08, -0.05, 0.02], [0.15, -0.45, 0.5], 14, 2.0);
  pushPath('moderate', [-0.1, 0.0, 0.12], [-0.4, 0.35, -0.35], 15, 2.7);

  // Control-rod absorption sinks (vertical rod at +x)
  pushPath('absorb', [0.12, 0.1, -0.08], [0.62, 0.35, 0.05], 10, 0.4);
  pushPath('absorb', [-0.05, 0.15, 0.1], [0.58, -0.15, -0.08], 12, 1.5);
  pushPath('absorb', [0.02, -0.12, 0.05], [0.6, 0.05, 0.12], 11, 3.1);

  // Fission seeds — trajectories that re-enter a secondary nucleus
  pushPath('fission', [0.06, 0.04, 0.0], [-0.35, 0.25, -0.2], 12, 0.8);
  pushPath('fission', [-0.02, -0.06, 0.04], [0.3, 0.3, 0.28], 11, 1.9);
  pushPath('fission', [0.1, 0.0, -0.1], [-0.2, -0.3, 0.22], 13, 2.4);

  return paths;
}

/**
 * Micro continuum: fuel pellet → schematic fission event → neutron economy.
 * Scientific-instrument aesthetic; scroll-scrubbed, no React re-renders in frame.
 */
export function MicroZoom({
  progress,
  accent = '#5CE1A8',
  reduced = false,
  fixedProgress,
}: MicroZoomProps) {
  const rootRef = useRef<Group>(null);
  const pelletRef = useRef<Group>(null);
  const pelletMatRef = useRef<MeshStandardMaterial>(null);
  const pelletCapMatRef = useRef<MeshStandardMaterial>(null);
  const pelletCapBotMatRef = useRef<MeshStandardMaterial>(null);
  const claddingMatRef = useRef<MeshStandardMaterial>(null);
  const tickMatRef = useRef<MeshStandardMaterial>(null);

  const fissionRef = useRef<Group>(null);
  const nucleusRef = useRef<Mesh>(null);
  const fragARef = useRef<Mesh>(null);
  const fragBRef = useRef<Mesh>(null);
  const fissionNeutronsRef = useRef<Points>(null);

  const economyRef = useRef<Group>(null);
  const controlRodRef = useRef<Mesh>(null);
  const controlRodMatRef = useRef<MeshStandardMaterial>(null);
  const economyPointsRef = useRef<Points>(null);

  const accentColor = useMemo(() => new Color(accent), [accent]);
  const ceramic = useMemo(() => new Color('#3d4a44'), []);
  const fragmentCool = useMemo(() => new Color('#8fd4b8'), []);
  const fragmentWarm = useMemo(() => new Color('#c8efd9'), []);
  const absorbColor = useMemo(() => new Color('#6a8f7e'), []);

  const neutronPaths = useMemo(() => buildNeutronPaths(), []);

  const pathGeos = useMemo(
    () =>
      neutronPaths.map((path) => {
        const geo = new BufferGeometry();
        geo.setAttribute('position', new BufferAttribute(path.pts, 3));
        return geo;
      }),
    [neutronPaths]
  );

  const pathMats = useMemo(() => {
    return neutronPaths.map((path) => {
      const color =
        path.kind === 'absorb'
          ? absorbColor
          : path.kind === 'fission'
            ? accentColor
            : new Color('#a8dcc8');
      return new LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      });
    });
  }, [neutronPaths, accentColor, absorbColor]);

  const pathLines = useMemo(
    () => pathGeos.map((geo, i) => new Line(geo, pathMats[i])),
    [pathGeos, pathMats]
  );

  // Fission spray points (fixed directions, animated radius in frame)
  const fissionGeo = useMemo(() => {
    const n = 28;
    const positions = new Float32Array(n * 3);
    const dirs = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n;
      const phi = Math.acos(1 - 2 * u);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      dirs[i * 3] = x;
      dirs[i * 3 + 1] = y;
      dirs[i * 3 + 2] = z;
      positions[i * 3] = x * 0.05;
      positions[i * 3 + 1] = y * 0.05;
      positions[i * 3 + 2] = z * 0.05;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    (geo as BufferGeometry & { userData: { dirs: Float32Array } }).userData = {
      dirs,
    };
    return geo;
  }, []);

  // Economy free neutrons (slow drift markers along field)
  const economyGeo = useMemo(() => {
    const n = 36;
    const positions = new Float32Array(n * 3);
    const base = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 0.15 + (i % 5) * 0.08;
      const x = Math.cos(a) * r;
      const y = ((i % 7) - 3) * 0.06;
      const z = Math.sin(a * 1.3) * r * 0.85;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    (geo as BufferGeometry & { userData: { base: Float32Array } }).userData = {
      base,
    };
    return geo;
  }, []);

  const secondaryNucleusMatRef = useRef<MeshStandardMaterial>(null);

  useEffect(
    () => () => {
      pathGeos.forEach((g) => g.dispose());
      pathMats.forEach((m) => m.dispose());
      fissionGeo.dispose();
      economyGeo.dispose();
    },
    [pathGeos, pathMats, fissionGeo, economyGeo]
  );

  useFrame((state) => {
    const p = fixedProgress != null ? fixedProgress : progress.get();
    const t = reduced ? 0 : state.clock.elapsedTime;

    // Stage windows (aligned with scaleLadders.nuclear)
    const pelletEnter = smoothstep(0.5, 0.58, p);
    const pelletHold = 1 - smoothstep(0.64, 0.72, p);
    const pelletVis = pelletEnter * pelletHold;

    const fissionEnter = smoothstep(0.64, 0.72, p);
    // Fission visible 0.65–0.88 with soft handoff into neutron economy
    const fissionAmt =
      smoothstep(0.65, 0.74, p) * (1 - smoothstep(0.86, 0.96, p));
    const split = smoothstep(0.68, 0.8, p);

    const economyAmt = smoothstep(0.78, 0.88, p);

    const anyMicro = pelletVis > 0.01 || fissionAmt > 0.01 || economyAmt > 0.01;
    if (rootRef.current) {
      rootRef.current.visible = anyMicro;
    }

    // —— Pellet extract (ceramic cylinder from rod scale) ——
    if (pelletRef.current) {
      pelletRef.current.visible = pelletVis > 0.01;
      const s = lerp(0.15, 1, pelletEnter) * lerp(1, 0.35, 1 - pelletHold);
      pelletRef.current.scale.setScalar(s);
      // Extract upward/out from assembly lattice position
      pelletRef.current.position.set(
        lerp(0.1, 0, pelletEnter),
        lerp(-0.05, 0.02, pelletEnter),
        lerp(0.1, 0, pelletEnter)
      );
      if (!reduced) {
        pelletRef.current.rotation.y = t * 0.25 * pelletVis;
      }
    }
    if (pelletMatRef.current) {
      pelletMatRef.current.opacity = pelletVis * 0.95;
      pelletMatRef.current.emissiveIntensity =
        lerp(0.08, 0.35, pelletEnter) * pelletVis;
    }
    if (pelletCapMatRef.current) {
      pelletCapMatRef.current.opacity = pelletVis * 0.9;
    }
    if (pelletCapBotMatRef.current) {
      pelletCapBotMatRef.current.opacity = pelletVis * 0.85;
    }
    if (tickMatRef.current) {
      tickMatRef.current.opacity = pelletVis * 0.7;
    }
    if (claddingMatRef.current) {
      // Ghost cladding tube fades as pellet isolates
      claddingMatRef.current.opacity =
        pelletVis * lerp(0.55, 0.08, pelletEnter);
    }

    // —— Fission schematic: heavy nucleus → two fragments + neutron spray ——
    if (fissionRef.current) {
      fissionRef.current.visible = fissionAmt > 0.02;
      fissionRef.current.scale.setScalar(lerp(0.6, 1.05, fissionEnter));
    }

    if (nucleusRef.current) {
      const mat = nucleusRef.current.material as MeshStandardMaterial;
      // Parent nucleus fades as it "splits"
      mat.opacity = fissionAmt * (1 - split * 0.92);
      mat.emissiveIntensity = lerp(0.4, 1.1, fissionAmt) * (1 - split * 0.5);
      const ns = lerp(1, 0.35, split);
      nucleusRef.current.scale.setScalar(ns);
    }

    if (fragARef.current && fragBRef.current) {
      const sep = lerp(0, 0.42, split);
      const lift = lerp(0, 0.08, split);
      fragARef.current.position.set(-sep, lift * 0.6, sep * 0.25);
      fragBRef.current.position.set(sep * 0.95, -lift, -sep * 0.2);
      const fs = lerp(0.2, 1, split);
      fragARef.current.scale.setScalar(fs);
      fragBRef.current.scale.setScalar(fs * 0.88);
      const ma = fragARef.current.material as MeshStandardMaterial;
      const mb = fragBRef.current.material as MeshStandardMaterial;
      ma.opacity = fissionAmt * split * 0.95;
      mb.opacity = fissionAmt * split * 0.95;
      ma.emissiveIntensity = 0.55 * fissionAmt;
      mb.emissiveIntensity = 0.7 * fissionAmt;
    }

    // Neutron spray from fission vertex
    if (fissionNeutronsRef.current) {
      const pts = fissionNeutronsRef.current;
      pts.visible = fissionAmt * split > 0.05;
      const pos = pts.geometry.attributes.position as BufferAttribute;
      const arr = pos.array as Float32Array;
      const dirs = (fissionGeo as BufferGeometry & { userData: { dirs: Float32Array } })
        .userData.dirs;
      const n = dirs.length / 3;
      const radius = lerp(0.06, 0.55, split) * (1 + (reduced ? 0 : Math.sin(t * 1.4) * 0.03));
      for (let i = 0; i < n; i++) {
        const ix = i * 3;
        // Prefer equatorial sprays (educational, not isotropic boom)
        const bias = 0.55 + 0.45 * (1 - Math.abs(dirs[ix + 1]));
        arr[ix] = dirs[ix] * radius * bias;
        arr[ix + 1] = dirs[ix + 1] * radius * 0.65;
        arr[ix + 2] = dirs[ix + 2] * radius * bias;
      }
      pos.needsUpdate = true;
      const mat = pts.material as unknown as { opacity: number; size: number };
      mat.opacity = fissionAmt * split * 0.9;
      mat.size = lerp(0.02, 0.036, split);
    }

    // —— Neutron economy: paths + control rod sink + free neutrons ——
    if (economyRef.current) {
      economyRef.current.visible = economyAmt > 0.02;
    }

    pathMats.forEach((mat, i) => {
      const kind = neutronPaths[i].kind;
      const base =
        kind === 'absorb'
          ? economyAmt * 0.85
          : kind === 'fission'
            ? economyAmt * 0.75
            : economyAmt * 0.55;
      // Stagger path draw-on
      const delay = (i / pathMats.length) * 0.12;
      const draw = smoothstep(0.8 + delay, 0.9 + delay * 0.5, p);
      mat.opacity = base * draw;
    });

    if (controlRodRef.current && controlRodMatRef.current) {
      // Rod inserts as absorption cue strengthens
      const insert = smoothstep(0.82, 0.95, p);
      controlRodRef.current.position.y = lerp(0.55, 0.05, insert);
      controlRodMatRef.current.opacity = economyAmt * lerp(0.35, 0.85, insert);
      controlRodMatRef.current.emissiveIntensity = lerp(0.15, 0.45, insert) * economyAmt;
    }

    if (secondaryNucleusMatRef.current) {
      secondaryNucleusMatRef.current.opacity = economyAmt * 0.55;
      secondaryNucleusMatRef.current.emissiveIntensity =
        economyAmt * (0.35 + (reduced ? 0 : Math.sin(t * 2.1) * 0.12));
    }

    if (economyPointsRef.current) {
      const pts = economyPointsRef.current;
      pts.visible = economyAmt > 0.05;
      const pos = pts.geometry.attributes.position as BufferAttribute;
      const arr = pos.array as Float32Array;
      const base = (economyGeo as BufferGeometry & { userData: { base: Float32Array } })
        .userData.base;
      const n = base.length / 3;
      for (let i = 0; i < n; i++) {
        const ix = i * 3;
        const phase = i * 0.41;
        const drift = reduced ? 0 : t * (0.12 + (i % 4) * 0.03);
        // Mild orbital + damp near control rod (absorb cue)
        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];
        const spin = Math.sin(drift + phase) * 0.04 * economyAmt;
        let x = bx + spin;
        let y = by + Math.cos(drift * 0.7 + phase) * 0.03;
        let z = bz - spin * 0.5;
        // Pull a subset toward control rod at x≈0.6
        if (i % 3 === 0) {
          const pull = economyAmt * smoothstep(0.84, 0.98, p);
          x = lerp(x, 0.58, pull * 0.65);
          y = lerp(y, 0.05, pull * 0.4);
          z = lerp(z, 0.02, pull * 0.5);
        }
        arr[ix] = x;
        arr[ix + 1] = y;
        arr[ix + 2] = z;
      }
      pos.needsUpdate = true;
      const mat = pts.material as unknown as { opacity: number; size: number };
      mat.opacity = economyAmt * 0.8;
      mat.size = 0.028;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.05, 0]}>
      {/* —— Fuel pellet (UO₂ ceramic cylinder + ghost cladding) —— */}
      <group ref={pelletRef}>
        {/* Ghost cladding tube */}
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.95, 20, 1, true]} />
          <meshStandardMaterial
            ref={claddingMatRef}
            color="#6d7a74"
            emissive={accentColor}
            emissiveIntensity={0.06}
            metalness={0.75}
            roughness={0.28}
            transparent
            opacity={0}
            depthWrite={false}
            side={DoubleSide}
          />
          <Edges threshold={24} color={accent} />
        </mesh>
        {/* Pellet body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.38, 24]} />
          <meshStandardMaterial
            ref={pelletMatRef}
            color={ceramic}
            emissive={accentColor}
            emissiveIntensity={0.2}
            metalness={0.18}
            roughness={0.55}
            transparent
            opacity={0}
            toneMapped={false}
          />
          <Edges threshold={20} color="#9aefc8" />
        </mesh>
        {/* Pellet end faces */}
        <mesh position={[0, 0.19, 0]}>
          <circleGeometry args={[0.16, 24]} />
          <meshStandardMaterial
            ref={pelletCapMatRef}
            color={ceramic}
            emissive={accentColor}
            emissiveIntensity={0.15}
            metalness={0.15}
            roughness={0.5}
            transparent
            opacity={0}
            side={DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.19, 0]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.16, 24]} />
          <meshStandardMaterial
            ref={pelletCapBotMatRef}
            color={ceramic}
            emissive={accentColor}
            emissiveIntensity={0.1}
            metalness={0.15}
            roughness={0.5}
            transparent
            opacity={0}
            side={DoubleSide}
          />
        </mesh>
        {/* Instrument tick mark on pellet */}
        <mesh position={[0.165, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.36, 0.006, 0.006]} />
          <meshStandardMaterial
            ref={tickMatRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* —— Fission event schematic —— */}
      <group ref={fissionRef}>
        {/* Parent heavy nucleus */}
        <mesh ref={nucleusRef}>
          <sphereGeometry args={[0.18, 24, 18]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.4}
            transparent
            opacity={0}
            toneMapped={false}
          />
          <Edges threshold={28} color="#c8ffe0" />
        </mesh>

        {/* Fission fragment A */}
        <mesh ref={fragARef}>
          <sphereGeometry args={[0.11, 18, 14]} />
          <meshStandardMaterial
            color={fragmentCool}
            emissive={fragmentCool}
            emissiveIntensity={0.5}
            metalness={0.15}
            roughness={0.45}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>

        {/* Fission fragment B (slightly smaller / elongated cue via scale) */}
        <mesh ref={fragBRef}>
          <sphereGeometry args={[0.095, 16, 12]} />
          <meshStandardMaterial
            color={fragmentWarm}
            emissive={accentColor}
            emissiveIntensity={0.55}
            metalness={0.12}
            roughness={0.48}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>

        {/* Neutron spray */}
        <points ref={fissionNeutronsRef} geometry={fissionGeo}>
          <pointsMaterial
            color={accentColor}
            size={0.028}
            sizeAttenuation
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>

      {/* —— Neutron economy field —— */}
      <group ref={economyRef}>
        {/* Control rod (absorb sink) */}
        <mesh ref={controlRodRef} position={[0.6, 0.55, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.95, 12]} />
          <meshStandardMaterial
            ref={controlRodMatRef}
            color="#2a3530"
            emissive={absorbColor}
            emissiveIntensity={0.25}
            metalness={0.55}
            roughness={0.4}
            transparent
            opacity={0}
          />
          <Edges threshold={22} color="#7a9a8c" />
        </mesh>

        {/* Secondary nucleus (next fission candidate) */}
        <mesh position={[-0.35, 0.22, -0.18]}>
          <sphereGeometry args={[0.09, 16, 12]} />
          <meshStandardMaterial
            ref={secondaryNucleusMatRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.45}
            metalness={0.15}
            roughness={0.45}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>

        {/* Transport paths as subatomic trajectories */}
        {pathLines.map((ln, i) => (
          <primitive key={i} object={ln} />
        ))}

        {/* Free neutrons as subatomic transport markers */}
        <points ref={economyPointsRef} geometry={economyGeo}>
          <pointsMaterial
            color={accentColor}
            size={0.026}
            sizeAttenuation
            transparent
            opacity={0}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  );
}
