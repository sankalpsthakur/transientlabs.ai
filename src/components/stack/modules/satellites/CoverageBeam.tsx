'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { EARTH_RADIUS } from './Earth';

export interface BeamSpec {
  /** Azimuth around globe (radians) */
  azimuth: number;
  /** Polar offset from equator (radians) */
  elevation: number;
  /** Satellite altitude multiplier over Earth radius */
  altitudeMul: number;
  /** Cone base radius at surface */
  footprint: number;
  /** Progress window for beam opacity */
  appearRange: [number, number];
}

interface CoverageBeamProps {
  progress: MotionValue<number>;
  accent?: string;
  beams?: BeamSpec[];
}

const DEFAULT_BEAMS: BeamSpec[] = [
  {
    azimuth: 0.35,
    elevation: 0.22,
    altitudeMul: 1.48,
    footprint: 0.42,
    appearRange: [0.18, 0.36],
  },
  {
    azimuth: -0.85,
    elevation: -0.12,
    altitudeMul: 1.32,
    footprint: 0.32,
    appearRange: [0.22, 0.4],
  },
  {
    azimuth: 1.4,
    elevation: 0.08,
    altitudeMul: 1.58,
    footprint: 0.28,
    appearRange: [0.26, 0.42],
  },
];

function satPosition(spec: BeamSpec): THREE.Vector3 {
  const r = EARTH_RADIUS * spec.altitudeMul;
  const cosE = Math.cos(spec.elevation);
  return new THREE.Vector3(
    Math.cos(spec.azimuth) * cosE * r,
    Math.sin(spec.elevation) * r,
    Math.sin(spec.azimuth) * cosE * r
  );
}

function surfaceAim(spec: BeamSpec): THREE.Vector3 {
  // Aim slightly inward of nadir for a readable footprint on the limb
  const r = EARTH_RADIUS * 0.98;
  const cosE = Math.cos(spec.elevation * 0.7);
  return new THREE.Vector3(
    Math.cos(spec.azimuth) * cosE * r,
    Math.sin(spec.elevation * 0.7) * r,
    Math.sin(spec.azimuth) * cosE * r
  );
}

function SingleBeam({
  progress,
  accent,
  spec,
}: {
  progress: MotionValue<number>;
  accent: string;
  spec: BeamSpec;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const { height, quaternion, mid } = useMemo(() => {
    const from = satPosition(spec);
    const to = surfaceAim(spec);
    // Cone apex is +Y; we want apex at the satellite, base toward Earth
    const toSat = new THREE.Vector3().subVectors(from, to);
    const height = toSat.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), toSat.normalize());
    return { height, quaternion: quat, mid };
  }, [spec]);

  useFrame(() => {
    const p = progress.get();
    const [a0, a1] = spec.appearRange;
    const t = THREE.MathUtils.clamp((p - a0) / Math.max(a1 - a0, 0.001), 0, 1);
    // Beams peak mid-shell / early bus, then yield to MicroZoom link grain
    const microOut = 1 - THREE.MathUtils.clamp((p - 0.32) / 0.16, 0, 1);
    const eased = t * t * (3 - 2 * t) * microOut;
    if (matRef.current) {
      matRef.current.opacity = eased * 0.22;
    }
    if (ringMatRef.current) {
      ringMatRef.current.opacity = eased * 0.45;
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.85 + eased * 0.15);
      groupRef.current.visible = eased > 0.01;
    }
  });

  return (
    <group ref={groupRef} position={mid} quaternion={quaternion}>
      {/* Translucent coverage cone — apex at sat, base toward Earth */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[spec.footprint, height, 32, 1, true]} />
        <meshBasicMaterial
          ref={matRef}
          color={accent}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Footprint ring on / near surface */}
      <mesh
        position={[0, -height * 0.48, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[spec.footprint * 0.72, spec.footprint * 1.02, 48]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={accent}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * 1–3 translucent coverage cones from LEO sats to surface.
 * Opacity scrubbed entirely by scroll progress.
 */
export function CoverageBeam({
  progress,
  accent = '#7EA2FF',
  beams = DEFAULT_BEAMS,
}: CoverageBeamProps) {
  return (
    <group>
      {beams.map((spec, i) => (
        <SingleBeam key={i} progress={progress} accent={accent} spec={spec} />
      ))}
    </group>
  );
}
