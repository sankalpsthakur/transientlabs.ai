'use client';

import { Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { Color } from 'three';
import {
  CHAR,
  COUNTERFACTUALS,
  FOREST,
  INK,
  PAPER_WARM,
  STEEL,
  STEEL_DARK,
} from './model';
import { lerp, smoothstep } from './math';

export function Kiln({
  stageIndex,
}: {
  stageIndex: number;
  reduced?: boolean;
}) {
  const slugRef = useRef<Group>(null);
  const ghostRef = useRef<Group>(null);
  const lostMat = useRef<MeshStandardMaterial>(null);
  const steel = useMemo(() => new Color(STEEL), []);
  const dark = useMemo(() => new Color(STEEL_DARK), []);
  const char = useMemo(() => new Color(CHAR), []);
  const forest = useMemo(() => new Color(FOREST), []);

  useFrame(() => {
    const yieldAmt = smoothstep(1.2, 2.1, stageIndex);
    const ghostAmt = 1 - smoothstep(0.15, 1.4, stageIndex);
    if (slugRef.current) {
      slugRef.current.scale.setScalar(lerp(0.72, 1, yieldAmt));
    }
    if (ghostRef.current) {
      ghostRef.current.visible = ghostAmt > 0.04;
      ghostRef.current.scale.setScalar(lerp(0.88, 1, ghostAmt));
    }
    if (lostMat.current) {
      lostMat.current.opacity = lerp(0.08, 0.28, yieldAmt);
    }
  });

  return (
    <group>
      {/* Drum — 16-facet rotary kiln along X, slight process tilt */}
      <group rotation={[0, 0, Math.PI / 2 - 0.06]} position={[0, 0.22, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.4, 2.36, 16]} />
          <meshStandardMaterial
            color={steel}
            roughness={0.46}
            metalness={0.58}
          />
          <Edges threshold={22} color={INK} />
        </mesh>
        {/* Insulation bands */}
        {[-0.72, 0, 0.72].map((x) => (
          <mesh key={x} position={[0, x, 0]}>
            <cylinderGeometry args={[0.445, 0.445, 0.1, 16]} />
            <meshStandardMaterial
              color={dark}
              roughness={0.52}
              metalness={0.48}
            />
          </mesh>
        ))}
        {/* Feed hood */}
        <mesh position={[0, -1.28, 0]}>
          <cylinderGeometry args={[0.48, 0.42, 0.28, 16]} />
          <meshStandardMaterial
            color={dark}
            roughness={0.44}
            metalness={0.6}
          />
          <Edges threshold={24} color={INK} />
        </mesh>
        {/* Discharge */}
        <mesh position={[0, 1.28, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.26, 16]} />
          <meshStandardMaterial
            color={steel}
            roughness={0.48}
            metalness={0.55}
          />
        </mesh>
        {/* Sight glass + thermowell boss */}
        <mesh position={[0.42, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
          <meshStandardMaterial color={dark} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0.48, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.04, 10]} />
          <meshStandardMaterial
            color={forest}
            roughness={0.25}
            metalness={0.2}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Flue stub */}
        <mesh position={[0, 0.08, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.22, 10]} />
          <meshStandardMaterial color={dark} roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Hopper */}
      <mesh position={[-1.38, 0.92, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.22, 0.08, 0.42, 6]} />
        <meshStandardMaterial color={dark} roughness={0.5} metalness={0.55} />
        <Edges threshold={20} color={INK} />
      </mesh>
      <mesh position={[-1.48, 1.18, 0]}>
        <boxGeometry args={[0.34, 0.08, 0.28]} />
        <meshStandardMaterial color={steel} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Saddles */}
      <mesh position={[-0.72, -0.42, 0]}>
        <boxGeometry args={[0.16, 0.42, 0.72]} />
        <meshStandardMaterial color={dark} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[0.72, -0.42, 0]}>
        <boxGeometry args={[0.16, 0.42, 0.72]} />
        <meshStandardMaterial color={dark} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.64, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.06, 0.9]} />
        <meshStandardMaterial
          color={PAPER_WARM}
          roughness={0.86}
          metalness={0.04}
        />
      </mesh>

      {/* Weigh pad at intake */}
      <mesh position={[-1.42, -0.58, 0.42]}>
        <boxGeometry args={[0.55, 0.05, 0.42]} />
        <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.62} />
        <Edges threshold={18} color={INK} />
      </mesh>

      {/* Char slug + lost fraction (not smoke) */}
      <group ref={slugRef} position={[1.18, -0.02, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.17, 0.34, 12]} />
          <meshStandardMaterial
            color={char}
            roughness={0.78}
            metalness={0.08}
            emissive={forest}
            emissiveIntensity={0.04}
          />
          <Edges threshold={20} color={FOREST} />
        </mesh>
        {/* Volatilized remainder as a wire mass — 40–60% stays */}
        <mesh position={[0.28, 0.08, 0]} rotation={[0.3, 0.4, 0.2]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            ref={lostMat}
            color={STEEL}
            roughness={0.7}
            metalness={0.1}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
          <Edges threshold={1} color={INK} />
        </mesh>
      </group>

      {/* Ghost counterfactual, off-axis */}
      <group ref={ghostRef} position={[-1.85, -0.15, -1.15]}>
        {COUNTERFACTUALS.map((item, i) => (
          <mesh
            key={item.id}
            position={[i * 0.42 - 0.42, 0.12 + (i % 2) * 0.05, 0]}
          >
            <boxGeometry args={[0.28, 0.22 + i * 0.04, 0.28]} />
            <meshStandardMaterial
              color={PAPER_WARM}
              roughness={0.9}
              metalness={0}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
            <Edges threshold={12} color={INK} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
