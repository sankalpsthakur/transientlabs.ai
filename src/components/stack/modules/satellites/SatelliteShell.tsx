'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { EARTH_RADIUS } from './Earth';

export interface ShellConfig {
  /** Orbital radius multiplier over Earth */
  radiusMul: number;
  /** Orbit inclination (radians) */
  inclination: number;
  count: number;
  /** Progress window [start, end] for populating this shell */
  populateRange: [number, number];
  /** Elliptical eccentricity of the visual shell */
  eccentricity?: number;
}

interface SatelliteShellProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  config: ShellConfig;
  /** Optional continuous orbital drift when not reduced */
  driftSpeed?: number;
  /** When true, densifies mid-shell focus stage (0.12–0.32) */
  focusShell?: boolean;
}

const _obj = new THREE.Object3D();
const _color = new THREE.Color();

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * One LEO shell: dashed orbital ring + InstancedMesh satellite bodies.
 * Visibility of instances is scrubbed by scroll progress.
 */
export function SatelliteShell({
  progress,
  accent = '#7EA2FF',
  reduced = false,
  config,
  driftSpeed = 0.08,
  focusShell = false,
}: SatelliteShellProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(0);
  const lastVisibleRef = useRef(-1);

  const { radiusMul, inclination, count, populateRange, eccentricity = 0.08 } = config;
  const orbitR = EARTH_RADIUS * radiusMul;

  const { positions, baseScales } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const baseScales: number[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2 + seeded(i, 1) * 0.15;
      const e = eccentricity;
      const r = orbitR * (1 + e * Math.cos(t));
      // Slight out-of-plane jitter for shell thickness
      const yJitter = (seeded(i, 2) - 0.5) * 0.06 * orbitR;
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r * (1 - e * 0.35);
      positions.push(new THREE.Vector3(x, yJitter, z));
      baseScales.push(0.7 + seeded(i, 3) * 0.55);
    }
    return { positions, baseScales };
  }, [count, orbitR, eccentricity]);

  const ringLine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const r = orbitR * (1 + eccentricity * Math.cos(t));
      pts.push(
        new THREE.Vector3(
          Math.cos(t) * r,
          0,
          Math.sin(t) * r * (1 - eccentricity * 0.35)
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geo, mat);
  }, [orbitR, eccentricity, accent]);

  // Dispose ring resources on unmount
  useLayoutEffect(() => {
    return () => {
      ringLine.geometry.dispose();
      (ringLine.material as THREE.Material).dispose();
    };
  }, [ringLine]);

  // Initialize instance matrices once
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      _obj.position.copy(positions[i]);
      // Point roughly toward Earth (inward)
      _obj.lookAt(0, 0, 0);
      _obj.rotateX(Math.PI / 2);
      const s = baseScales[i] * 0.028;
      _obj.scale.set(s * 1.6, s * 0.45, s);
      _obj.updateMatrix();
      mesh.setMatrixAt(i, _obj.matrix);
      _color.set(accent);
      mesh.setColorAt(i, _color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    // Start hidden
    mesh.count = 0;
  }, [positions, baseScales, count, accent]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const raw = progress.get();
    const p = reduced ? 0.55 : raw;

    const [p0, p1] = populateRange;
    const local = THREE.MathUtils.clamp((p - p0) / Math.max(p1 - p0, 0.001), 0, 1);
    // Ease-out population
    const eased = 1 - Math.pow(1 - local, 2.2);

    // Focus shell densifies during orbital-shell rung; others thin slightly
    const focusBoost =
      focusShell && !reduced
        ? 1 + smoothstep(0.1, 0.22, raw) * 0.15 * (1 - smoothstep(0.3, 0.42, raw))
        : 1;
    // Fade shells as camera dives into bus
    const microFade = reduced ? 0.15 : 1 - smoothstep(0.28, 0.46, p);
    const pop = eased * microFade;

    const visible = Math.floor(
      THREE.MathUtils.clamp(pop * focusBoost, 0, 1) * count
    );
    mesh.count = visible;
    group.visible = visible > 0 || pop > 0.02;

    // Scale instances slightly larger on focus shell for density read (throttled)
    if (focusShell && visible > 0 && !reduced) {
      const densify =
        smoothstep(0.12, 0.28, raw) * (1 - smoothstep(0.3, 0.42, raw));
      // Recompute when population changes or densify is active mid-band
      if (densify > 0.05 && (visible !== lastVisibleRef.current || densify > 0.2)) {
        for (let i = 0; i < visible; i++) {
          _obj.position.copy(positions[i]);
          _obj.lookAt(0, 0, 0);
          _obj.rotateX(Math.PI / 2);
          const s = baseScales[i] * 0.028 * (1 + densify * 0.35);
          _obj.scale.set(s * 1.6, s * 0.45, s);
          _obj.updateMatrix();
          mesh.setMatrixAt(i, _obj.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    // Ring opacity via material
    const ringMat = ringLine.material as THREE.LineBasicMaterial;
    const ringBoost = focusShell ? 1.25 : 1;
    ringMat.opacity = (0.08 + eased * 0.42) * microFade * ringBoost;

    // Subtle orbital drift (disabled when reduced)
    if (!reduced) {
      phaseRef.current += delta * driftSpeed;
      group.rotation.y = phaseRef.current;
    } else {
      // Progress-only yaw so scrub still feels intentional
      group.rotation.y = p * 0.35;
    }

    // Brighten leading edge only when population changes (avoid per-frame color churn)
    if (mesh.instanceColor && visible !== lastVisibleRef.current) {
      lastVisibleRef.current = visible;
      for (let i = 0; i < visible; i++) {
        const age = visible <= 1 ? 1 : i / (visible - 1);
        const flash = i >= visible - 3 ? 1.35 : 1;
        _color.set(accent).multiplyScalar(0.75 + age * 0.35 * flash);
        mesh.setColorAt(i, _color);
      }
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[inclination, 0, inclination * 0.35]}>
      {/* Orbital guide ring (THREE.Line via primitive — avoids R3F/SVG line clash) */}
      <primitive object={ringLine} />

      {/* Satellite bodies — flat box = solar-panel silhouette at distance */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.85}
          roughness={0.35}
          metalness={0.65}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

/** Three production shells matching Starlink-style altitude bands (visual, not to scale). */
export const DEFAULT_SHELLS: ShellConfig[] = [
  {
    radiusMul: 1.28,
    inclination: 0.42,
    count: 110,
    populateRange: [0.04, 0.28],
    eccentricity: 0.06,
  },
  {
    radiusMul: 1.48,
    inclination: -0.28,
    count: 90,
    populateRange: [0.12, 0.36],
    eccentricity: 0.09,
  },
  {
    radiusMul: 1.72,
    inclination: 0.55,
    count: 70,
    populateRange: [0.2, 0.42],
    eccentricity: 0.05,
  },
];
