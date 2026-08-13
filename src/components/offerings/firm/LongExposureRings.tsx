'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import {
  FIRM_COLORS,
  RING_OFFSET_X,
  RING_OMEGA,
  RING_OPACITY,
  RING_RADIUS,
  RING_TUBE,
} from './constants';
import type { FirmInteraction } from './types';

interface LongExposureRingsProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  interaction: FirmInteraction;
}

const TILT = [0.08, -0.04, 0.11] as const;

/**
 * Long Exposure as a physical object: three same-radius ring states
 * offset along X, different ω — smear, not motion-blur noise.
 * They pierce the still control slab. Final state is the clearest ring.
 */
export function LongExposureRings({
  progress,
  accent = FIRM_COLORS.signal,
  reduced = false,
  interaction,
}: LongExposureRingsProps) {
  const group = useRef<THREE.Group>(null);
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const phase = useRef([0.15, 0.6, 1.1]);
  const colors = useMemo(
    () => [
      new THREE.Color(FIRM_COLORS.ink),
      new THREE.Color(accent),
      new THREE.Color(FIRM_COLORS.ink),
    ],
    [accent]
  );

  useFrame((_, delta) => {
    const p = reduced ? 0.55 : progress.get();
    const boost = interaction.markArmed ? 3.4 : 1;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (!reduced) {
        phase.current[i] += delta * RING_OMEGA[i] * boost;
      }
      mesh.rotation.z = phase.current[i];
      mesh.rotation.y = TILT[i] + Math.sin(phase.current[i] * 0.35) * 0.03;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const arrive = 0.55 + p * 0.45;
      mat.opacity = RING_OPACITY[i] * arrive * (interaction.markArmed ? 0.95 : 1);
      mat.emissiveIntensity = (i === 1 ? 0.28 : 0.06) * (interaction.markArmed ? 1.6 : 1);
    });
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        interaction.armMark();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    >
      {RING_OFFSET_X.map((x, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[x, 0.06, 0]}
          rotation={[0.12 + TILT[i], 0.08 * i, 0]}
        >
          <torusGeometry args={[RING_RADIUS, RING_TUBE[i], 14, 80]} />
          <meshStandardMaterial
            color={colors[i]}
            roughness={0.38}
            metalness={0.22}
            emissive={i === 1 ? accent : FIRM_COLORS.ink}
            emissiveIntensity={i === 1 ? 0.28 : 0.06}
            transparent
            opacity={RING_OPACITY[i]}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
