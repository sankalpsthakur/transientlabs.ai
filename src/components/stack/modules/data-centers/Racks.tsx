'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import {
  Color,
  InstancedMesh,
  Object3D,
  type MeshStandardMaterial,
} from 'three';

export interface RacksProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const ROWS = 3;
const RACKS_PER_ROW = 6;
const BLADES_PER_RACK = 8;
const RACK_COUNT = ROWS * RACKS_PER_ROW;
const BLADE_COUNT = RACK_COUNT * BLADES_PER_RACK;

/** Matches MicroZoom HERO_RACK focus (row 1, col 2) */
const HERO_ROW = 1;
const HERO_COL = 2;

const dummy = new Object3D();
const coolColor = new Color('#6ec8ff');
const warmLed = new Color();

/**
 * Server hall: chassis + instanced emissive blade LEDs that power up with scroll.
 * Mid-scroll, hero rack scales up while neighbors dim for accelerator handoff.
 */
export function Racks({
  progress,
  accent = '#E8A87C',
  reduced = false,
}: RacksProps) {
  const chassisRef = useRef<InstancedMesh>(null);
  const bladeRef = useRef<InstancedMesh>(null);
  const bladeMat = useRef<MeshStandardMaterial>(null);
  const chassisPlaced = useRef(false);

  const rackPositions = useMemo(() => {
    const positions: {
      x: number;
      z: number;
      row: number;
      col: number;
      hero: boolean;
    }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < RACKS_PER_ROW; col++) {
        positions.push({
          x: -2.0 + col * 0.8,
          z: -0.9 + row * 0.85,
          row,
          col,
          hero: row === HERO_ROW && col === HERO_COL,
        });
      }
    }
    return positions;
  }, []);

  useLayoutEffect(() => {
    const chassis = chassisRef.current;
    if (!chassis || chassisPlaced.current) return;
    rackPositions.forEach((rack, i) => {
      dummy.position.set(rack.x, 0.55, rack.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      chassis.setMatrixAt(i, dummy.matrix);
    });
    chassis.instanceMatrix.needsUpdate = true;
    chassisPlaced.current = true;
  }, [rackPositions]);

  useFrame(() => {
    const blades = bladeRef.current;
    const chassis = chassisRef.current;
    if (!blades) return;

    // Reduced freezes at GPU+die; racks still fully powered under macro
    const p = reduced ? 0.42 : progress.get();
    const power = reduced ? 1 : smoothstep(0.26, 0.44, p);
    // Emphasize hero rack during GPU-rack rung; release as micro takes over
    const focus = reduced ? 0.55 : smoothstep(0.28, 0.4, p) * (1 - smoothstep(0.42, 0.52, p));

    if (chassis) {
      for (let r = 0; r < rackPositions.length; r++) {
        const rack = rackPositions[r];
        const heroBoost = rack.hero ? lerp(1, 1.08, focus) : lerp(1, 0.88, focus);
        dummy.position.set(rack.x, 0.55 * heroBoost + (rack.hero ? focus * 0.02 : 0), rack.z);
        dummy.scale.set(heroBoost, heroBoost, heroBoost);
        dummy.updateMatrix();
        chassis.setMatrixAt(r, dummy.matrix);
      }
      chassis.instanceMatrix.needsUpdate = true;
    }

    let bladeIdx = 0;
    for (let r = 0; r < rackPositions.length; r++) {
      const rack = rackPositions[r];
      const rowStagger = rack.row * 0.08 + rack.col * 0.02;
      const denom = Math.max(0.15, 1 - rowStagger);
      let localPower = Math.min(1, Math.max(0, (power - rowStagger) / denom));
      if (rack.hero) localPower = Math.min(1, localPower + focus * 0.35);
      else localPower *= lerp(1, 0.45, focus);

      const scaleY = rack.hero ? lerp(1, 1.08, focus) : lerp(1, 0.88, focus);

      for (let b = 0; b < BLADES_PER_RACK; b++) {
        const y = (0.18 + b * 0.095) * scaleY + (rack.hero ? focus * 0.02 : 0);
        const bladeStagger = b * 0.03;
        const on = Math.min(1, Math.max(0, localPower * 1.15 - bladeStagger));
        const visible = on > 0.02;
        const s = visible ? on * (rack.hero ? 1.05 : 1) : 0.001;

        dummy.position.set(rack.x, y, rack.z + 0.12);
        dummy.scale.set(s, s, 1);
        dummy.updateMatrix();
        blades.setMatrixAt(bladeIdx, dummy.matrix);

        const useCool = (rack.col + b) % 3 === 0;
        warmLed.set(accent);
        if (rack.hero && focus > 0.2) {
          warmLed.lerp(coolColor, 0.35 * focus);
        }
        blades.setColorAt(bladeIdx, useCool || rack.hero ? coolColor : warmLed);
        bladeIdx++;
      }
    }

    blades.instanceMatrix.needsUpdate = true;
    if (blades.instanceColor) blades.instanceColor.needsUpdate = true;

    if (bladeMat.current) {
      const shimmer = reduced ? 0 : Math.sin(performance.now() * 0.003) * 0.08;
      bladeMat.current.emissiveIntensity = 0.2 + power * 1.4 + shimmer * power;
      bladeMat.current.opacity = 0.35 + power * 0.65;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={chassisRef}
        args={[undefined, undefined, RACK_COUNT]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <boxGeometry args={[0.42, 1.0, 0.38]} />
        <meshStandardMaterial color="#0d0b09" roughness={0.55} metalness={0.45} />
      </instancedMesh>

      {rackPositions.map((rack, i) => (
        <mesh
          key={`bezel-${i}`}
          position={[rack.x, 0.55, rack.z + 0.195]}
          castShadow
        >
          <boxGeometry args={[0.44, 1.02, 0.03]} />
          <meshStandardMaterial
            color={rack.hero ? '#1a1614' : '#161210'}
            roughness={0.5}
            metalness={0.5}
            emissive={rack.hero ? accent : '#000000'}
            emissiveIntensity={rack.hero ? 0.12 : 0}
          />
        </mesh>
      ))}

      {rackPositions.map((rack, i) => (
        <mesh key={`rail-${i}`} position={[rack.x, 1.08, rack.z]}>
          <boxGeometry args={[0.44, 0.04, 0.4]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={rack.hero ? 0.35 : 0.15}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      ))}

      <instancedMesh
        ref={bladeRef}
        args={[undefined, undefined, BLADE_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.32, 0.05, 0.02]} />
        <meshStandardMaterial
          ref={bladeMat}
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </instancedMesh>

      {[-0.48, 0.38].map((z, i) => (
        <mesh key={`tray-${i}`} position={[0, 1.35, z]}>
          <boxGeometry args={[4.6, 0.04, 0.18]} />
          <meshStandardMaterial color="#1a1612" roughness={0.6} metalness={0.55} />
        </mesh>
      ))}
    </group>
  );
}
