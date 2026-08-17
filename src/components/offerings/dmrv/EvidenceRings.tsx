'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { MeshStandardMaterial } from 'three';
import { Color } from 'three';
import { FOREST, INK, LEDGER, STAGE_ORDER } from './model';
import type { DmrvStageId } from './types';
import { lerp } from './math';

const RING_X = [-1.18, -0.58, 0.02, 0.58, 1.12, 1.62];

export function EvidenceRings({
  stageIndex,
  maxReached,
}: {
  stageIndex: number;
  maxReached: number;
}) {
  const mats = useRef<Array<MeshStandardMaterial | null>>([]);
  const ink = useMemo(() => new Color(INK), []);
  const forest = useMemo(() => new Color(FOREST), []);
  const ledger = useMemo(() => new Color(LEDGER), []);

  useFrame(() => {
    STAGE_ORDER.forEach((_, i) => {
      const mat = mats.current[i];
      if (!mat) return;
      const lit = maxReached >= i;
      const current = stageIndex === i;
      const amt = lit ? (current ? 1 : 0.72) : 0.12;
      mat.opacity = lerp(mat.opacity, amt, 0.12);
      mat.emissiveIntensity = current ? 0.18 : lit ? 0.06 : 0;
      mat.color.lerp(current ? ledger : lit ? forest : ink, 0.12);
      mat.emissive.lerp(current ? ledger : forest, 0.12);
    });
  });

  return (
    <group position={[0, 0.22, 0]} rotation={[0, 0, -0.06]}>
      {STAGE_ORDER.map((id: DmrvStageId, i) => (
        <mesh
          key={id}
          position={[RING_X[i], 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <torusGeometry
            args={[0.58 + i * 0.012, i === stageIndex ? 0.018 : 0.01, 10, 40]}
          />
          <meshStandardMaterial
            ref={(el) => {
              mats.current[i] = el;
            }}
            color={INK}
            transparent
            opacity={0.12}
            roughness={0.45}
            metalness={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.006, 8, 36]} />
        <meshStandardMaterial
          color={INK}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
