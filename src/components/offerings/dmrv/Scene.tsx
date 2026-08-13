'use client';

import { ContactShadows, Edges, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, PerspectiveCamera } from 'three';
import { BatchLineage } from './BatchLineage';
import { EvidenceRings } from './EvidenceRings';
import { Kiln } from './Kiln';
import { MicroZoom } from './MicroZoom';
import { Sensors } from './Sensors';
import {
  DESIGN_PILLARS,
  FOREST,
  INK,
  LEDGER,
  METHODOLOGIES,
  PAPER_WARM,
  SIGNAL,
} from './model';
import { lerp } from './math';
import type { DmrvTier } from './types';

const CAMERA_KEYS = [
  { pos: [3.35, 1.65, 3.85] as const, look: [-0.55, 0.2, -0.15] as const, fov: 36 },
  { pos: [1.55, 1.2, 2.75] as const, look: [0.05, 0.22, 0] as const, fov: 34 },
  { pos: [0.45, 0.95, 2.4] as const, look: [0.35, 0.08, 0.05] as const, fov: 32 },
  { pos: [1.25, 1.4, 2.2] as const, look: [0.1, 0.28, 0.15] as const, fov: 33 },
  { pos: [2.25, 1.22, 1.9] as const, look: [1.55, 0.12, 0.1] as const, fov: 30 },
  { pos: [2.15, 0.82, 1.55] as const, look: [1.45, 0.18, 0.4] as const, fov: 28 },
];

export function Scene({
  tier,
  stageIndex,
  maxReached,
  reduced,
}: {
  tier: DmrvTier;
  stageIndex: number;
  maxReached: number;
  reduced: boolean;
}) {
  const { invalidate } = useThree();
  const world = useRef<Group>(null);
  const look = useRef({ x: 0, y: 0.15, z: 0 });
  const pillars = useRef<Group>(null);
  const auditor = useRef<Group>(null);

  useFrame((state) => {
    const key = CAMERA_KEYS[stageIndex] ?? CAMERA_KEYS[0];
    const cam = state.camera as PerspectiveCamera;
    const t = state.clock.elapsedTime;

    cam.position.x = lerp(cam.position.x, key.pos[0], 0.08);
    cam.position.y = lerp(cam.position.y, key.pos[1], 0.08);
    cam.position.z = lerp(cam.position.z, key.pos[2], 0.08);
    look.current.x = lerp(look.current.x, key.look[0], 0.08);
    look.current.y = lerp(look.current.y, key.look[1], 0.08);
    look.current.z = lerp(look.current.z, key.look[2], 0.08);
    cam.lookAt(look.current.x, look.current.y, look.current.z);
    if (Math.abs(cam.fov - key.fov) > 0.08) {
      cam.fov = lerp(cam.fov, key.fov, 0.08);
      cam.updateProjectionMatrix();
    }

    // No idle sway. The camera moves when the stage changes; between stages the
    // scene holds still so it reads as a diagram, not an ornament.

    if (pillars.current) {
      pillars.current.visible = stageIndex <= 1;
      const s = stageIndex === 0 ? 1 : 0.55;
      pillars.current.scale.setScalar(lerp(pillars.current.scale.x || 1, s, 0.1));
    }
    if (auditor.current) {
      auditor.current.visible = stageIndex === 3 || (stageIndex === 4 && maxReached >= 3);
    }

    invalidate();
  });

  const pillarItems = useMemo(() => DESIGN_PILLARS, []);

  return (
    <>
      <hemisphereLight args={['#F8F2E9', '#C4B49A', 0.55]} />
      <ambientLight intensity={0.62} color="#F8F2E9" />
      <directionalLight position={[5.5, 7.2, 4]} intensity={0.58} color="#FFF8EE" />
      <directionalLight position={[-3.5, 2.2, -2.4]} intensity={0.22} color="#8B5E34" />

      <group ref={world}>
        <Kiln stageIndex={stageIndex} reduced={reduced} />
        <EvidenceRings stageIndex={stageIndex} maxReached={maxReached} />
        <Sensors tier={tier} stageIndex={stageIndex} reduced={reduced} />
        <BatchLineage stageIndex={stageIndex} maxReached={maxReached} />
        <MicroZoom
          stageIndex={stageIndex}
          maxReached={maxReached}
          reduced={reduced}
        />

        <group ref={pillars} position={[-2.15, 0.15, 0.35]}>
          {pillarItems.map((pillar, i) => (
            <group key={pillar.id} position={[0, 0.05, (i - 1) * 0.42]}>
              <mesh>
                <boxGeometry args={[0.08, 0.42, 0.34]} />
                <meshStandardMaterial
                  color={PAPER_WARM}
                  roughness={0.82}
                  metalness={0.04}
                />
                <Edges threshold={14} color={i === 2 ? FOREST : INK} />
              </mesh>
              <Text
                position={[0.06, 0.02, 0]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.045}
                color={INK}
                anchorX="center"
              >
                {pillar.title}
              </Text>
            </group>
          ))}
        </group>

        <group ref={auditor} position={[0.15, 0.55, 0.95]}>
          <mesh>
            <boxGeometry args={[0.72, 0.42, 0.04]} />
            <meshStandardMaterial
              color={PAPER_WARM}
              roughness={0.76}
              metalness={0.05}
            />
            <Edges threshold={14} color={SIGNAL} />
          </mesh>
          <Text position={[0, 0.1, 0.03]} fontSize={0.045} color={SIGNAL} anchorX="center">
            THIRD-PARTY
          </Text>
          <Text position={[0, 0.0, 0.03]} fontSize={0.032} color={INK} anchorX="center">
            baseline · additionality · permanence
          </Text>
          <Text position={[0, -0.1, 0.03]} fontSize={0.03} color={LEDGER} anchorX="center">
            {tier === 'high' ? 'continuity complete' : 'gaps under review'}
          </Text>
        </group>

        {stageIndex === 0 &&
          METHODOLOGIES.map((method, i) => (
            <Text
              key={method.id}
              position={[-2.05, -0.42, 0.85 - i * 0.18]}
              fontSize={0.04}
              color={INK}
              anchorX="left"
            >
              {method.name}
            </Text>
          ))}
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <circleGeometry args={[4.2, 48]} />
        <meshStandardMaterial
          color="#F4EEE4"
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <ContactShadows
        position={[0, -0.7, 0]}
        opacity={0.18}
        scale={12}
        blur={2.6}
        far={6}
        color="#18120D"
      />
    </>
  );
}
