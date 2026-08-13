'use client';

import { Edges, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { Color, DoubleSide } from 'three';
import {
  BATCH_COLLARS,
  CHAR,
  FOREST,
  INK,
  LEDGER,
  PAPER_WARM,
  PERMANENCE_YEARS,
  STEEL_DARK,
  YIELD_CARBON_RANGE,
} from './model';
import { lerp, smoothstep } from './math';

/**
 * Instrument grain: yield assay → 100y liability torus → retirement punch.
 * Mutated in useFrame — no React re-renders on the clock.
 */
export function MicroZoom({
  stageIndex,
  maxReached,
  reduced,
}: {
  stageIndex: number;
  maxReached: number;
  reduced: boolean;
}) {
  const yieldRef = useRef<Group>(null);
  const torusRef = useRef<Group>(null);
  const certRef = useRef<Group>(null);
  const punchRef = useRef<MeshStandardMaterial>(null);
  const bandMat = useRef<MeshStandardMaterial>(null);
  const forest = useMemo(() => new Color(FOREST), []);
  const ledger = useMemo(() => new Color(LEDGER), []);
  const ticks = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i + 1) * 10),
    []
  );

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const yieldVis =
      smoothstep(1.6, 2.2, stageIndex) * (1 - smoothstep(3.4, 4.1, stageIndex));
    const defendVis =
      smoothstep(3.6, 4.2, stageIndex) * (1 - smoothstep(4.75, 5.2, stageIndex));
    const retireVis = smoothstep(4.7, 5.15, stageIndex);

    if (yieldRef.current) {
      yieldRef.current.visible = yieldVis > 0.03;
      const s = lerp(0.35, 1, yieldVis);
      yieldRef.current.scale.setScalar(s);
      yieldRef.current.position.set(
        lerp(1.18, 0.15, yieldVis),
        lerp(-0.02, 0.12, yieldVis),
        lerp(0.02, 0.35, yieldVis)
      );
      if (!reduced) yieldRef.current.rotation.y = t * 0.12 * yieldVis;
    }
    if (bandMat.current) {
      bandMat.current.opacity = yieldVis * 0.92;
      bandMat.current.emissiveIntensity = 0.2 * yieldVis;
    }

    if (torusRef.current) {
      torusRef.current.visible = defendVis > 0.03 || (maxReached >= 4 && retireVis < 0.4);
      const hold = Math.max(defendVis, maxReached >= 4 ? 0.35 : 0);
      torusRef.current.scale.setScalar(lerp(0.4, 1, hold));
      torusRef.current.position.set(1.95, 0.15, 0.05);
      if (!reduced) torusRef.current.rotation.z = t * 0.05;
    }

    if (certRef.current) {
      certRef.current.visible = retireVis > 0.04;
      certRef.current.scale.setScalar(lerp(0.4, 1, retireVis));
      certRef.current.position.set(1.55, 0.22, 0.55);
    }
    if (punchRef.current) {
      punchRef.current.opacity = retireVis * 0.95;
    }
  });

  return (
    <group>
      {/* Yield assay — 40–60% stable band, remainder as ghost mass */}
      <group ref={yieldRef}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.48, 20]} />
          <meshStandardMaterial
            color={CHAR}
            roughness={0.72}
            metalness={0.08}
          />
          <Edges threshold={18} color={INK} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.226, 0.226, 0.22, 20]} />
          <meshStandardMaterial
            ref={bandMat}
            color={forest}
            emissive={forest}
            emissiveIntensity={0.15}
            transparent
            opacity={0}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>
        {[-0.12, 0.12].map((y) => (
          <mesh key={y} position={[0.228, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.012, 0.04, 0.012]} />
            <meshStandardMaterial color={LEDGER} />
          </mesh>
        ))}
        <Text
          position={[0, -0.38, 0]}
          fontSize={0.055}
          color={INK}
          anchorX="center"
        >
          {`${YIELD_CARBON_RANGE.min}–${YIELD_CARBON_RANGE.max}% C`}
        </Text>
      </group>

      {/* 100-year liability torus */}
      <group ref={torusRef}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.52, 0.018, 10, 48]} />
          <meshStandardMaterial
            color={ledger}
            emissive={ledger}
            emissiveIntensity={0.12}
            roughness={0.4}
            metalness={0.35}
          />
          <Edges threshold={22} color={INK} />
        </mesh>
        {ticks.map((year, i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          return (
            <mesh
              key={year}
              position={[Math.cos(a) * 0.52, 0.02, Math.sin(a) * 0.52]}
            >
              <boxGeometry args={[0.012, 0.04, 0.012]} />
              <meshStandardMaterial color={INK} />
            </mesh>
          );
        })}
        <Text position={[0, 0.12, 0]} fontSize={0.08} color={INK} anchorX="center">
          {`${PERMANENCE_YEARS}y`}
        </Text>
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.045}
          color={INK}
          anchorX="center"
        >
          liability
        </Text>
      </group>

      {/* Retirement certificate — locked metadata, punched */}
      <group ref={certRef}>
        <mesh>
          <boxGeometry args={[0.72, 0.5, 0.03]} />
          <meshStandardMaterial
            color={PAPER_WARM}
            roughness={0.78}
            metalness={0.05}
          />
          <Edges threshold={12} color={INK} />
        </mesh>
        {BATCH_COLLARS.map((collar, i) => (
          <Text
            key={collar.id}
            position={[-0.28, 0.16 - i * 0.09, 0.02]}
            fontSize={0.038}
            color={INK}
            anchorX="left"
          >
            {`${collar.short}  ${collar.sampleId}`}
          </Text>
        ))}
        <mesh position={[0.26, 0.12, 0.02]}>
          <ringGeometry args={[0.055, 0.078, 20]} />
          <meshStandardMaterial
            ref={punchRef}
            color={INK}
            side={DoubleSide}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh position={[0.26, 0.12, 0.018]}>
          <circleGeometry args={[0.05, 20]} />
          <meshStandardMaterial
            color={STEEL_DARK}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        <Text
          position={[0.26, -0.14, 0.02]}
          fontSize={0.032}
          color={LEDGER}
          anchorX="center"
        >
          RETIRED
        </Text>
      </group>
    </group>
  );
}
