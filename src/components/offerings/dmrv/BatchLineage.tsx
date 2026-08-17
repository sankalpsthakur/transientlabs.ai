'use client';

import { Edges, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { BATCH_COLLARS, INK, LEDGER, STEEL, STEEL_DARK } from './model';
import { isCollarLocked } from './model';
import { lerp, smoothstep } from './math';

const COLLAR_X = [-0.92, -0.12, 0.68, 1.42];

export function BatchLineage({
  stageIndex,
  maxReached,
}: {
  stageIndex: number;
  maxReached: number;
}) {
  const groups = useRef<Array<Group | null>>([]);
  const mats = useRef<Array<MeshStandardMaterial | null>>([]);

  useFrame(() => {
    const track = smoothstep(1.1, 2.2, stageIndex);
    BATCH_COLLARS.forEach((collar, i) => {
      const g = groups.current[i];
      const mat = mats.current[i];
      const locked = isCollarLocked(collar, stageIndex, maxReached);
      if (g) {
        g.visible = track > 0.05;
        const s = lerp(0.4, 1, track);
        g.scale.setScalar(s);
      }
      if (mat) {
        mat.opacity = locked ? 0.95 : 0.35;
        mat.emissiveIntensity = locked ? 0.16 : 0.02;
      }
    });
  });

  return (
    <group>
      <group position={[0, 0.22, 0]} rotation={[0, 0, -0.06]}>
        {BATCH_COLLARS.map((collar, i) => (
          <group
            key={collar.id}
            ref={(el) => {
              groups.current[i] = el;
            }}
            position={[COLLAR_X[i], 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <mesh>
              <torusGeometry args={[0.455, 0.028, 8, 20]} />
              <meshStandardMaterial
                ref={(el) => {
                  mats.current[i] = el;
                }}
                color={LEDGER}
                emissive={LEDGER}
                emissiveIntensity={0.04}
                roughness={0.42}
                metalness={0.55}
                transparent
                opacity={0.4}
              />
              <Edges threshold={20} color={INK} />
            </mesh>
            <Text
              position={[0.62, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
              fontSize={0.07}
              color={INK}
              anchorX="center"
              anchorY="middle"
            >
              {collar.short}
            </Text>
          </group>
        ))}
      </group>
      <group position={[1.62, 0.02, 0.52]}>
        <mesh>
          <boxGeometry args={[0.38, 0.28, 0.32]} />
          <meshStandardMaterial
            color={STEEL_DARK}
            roughness={0.6}
            metalness={0.25}
          />
          <Edges threshold={16} color={INK} />
        </mesh>
      </group>
      <group position={[2.02, 0.08, -0.08]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.22, 12]} />
          <meshStandardMaterial
            color={STEEL}
            roughness={0.35}
            metalness={0.45}
            transparent
            opacity={0.85}
          />
          <Edges threshold={18} color={INK} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.078, 0.078, 0.08, 12]} />
          <meshStandardMaterial color="#5a4636" roughness={0.9} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}
