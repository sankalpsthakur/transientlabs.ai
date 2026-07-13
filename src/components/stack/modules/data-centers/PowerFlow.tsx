'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import {
  Color,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Points,
  type PointsMaterial,
} from 'three';

export interface PowerFlowProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const POWER_COUNT = 64;
const HEAT_COUNT = 72;

/**
 * Animated power-in (cyan/green) and heat-out (warm accent) particle flows.
 * Pure buffer attributes — no per-particle React nodes.
 */
export function PowerFlow({
  progress,
  accent = '#E8A87C',
  reduced = false,
}: PowerFlowProps) {
  const powerRef = useRef<Points>(null);
  const heatRef = useRef<Points>(null);
  const powerMat = useRef<PointsMaterial>(null);
  const heatMat = useRef<PointsMaterial>(null);

  const powerSeeds = useMemo(() => {
    const seeds = new Float32Array(POWER_COUNT);
    for (let i = 0; i < POWER_COUNT; i++) seeds[i] = Math.random();
    return seeds;
  }, []);

  const heatSeeds = useMemo(() => {
    const seeds = new Float32Array(HEAT_COUNT * 3);
    for (let i = 0; i < HEAT_COUNT; i++) {
      seeds[i * 3] = (Math.random() - 0.5) * 3.6;
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = -0.9 + Math.floor(i / 24) * 0.85;
    }
    return seeds;
  }, []);

  const powerGeo = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(POWER_COUNT * 3);
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    return geo;
  }, []);

  const heatGeo = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(HEAT_COUNT * 3);
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    return geo;
  }, []);

  const accentColor = useMemo(() => new Color(accent), [accent]);

  useFrame((state) => {
    // Reduced freezes on GPU+die; keep flows soft under macro
    const p = reduced ? 0.42 : progress.get();
    const powerOn = reduced ? 0.85 : smoothstep(0.26, 0.44, p) * (1 - smoothstep(0.48, 0.58, p));
    const heatOn = reduced ? 0.55 : smoothstep(0.36, 0.52, p) * (1 - smoothstep(0.55, 0.68, p));
    const t = state.clock.elapsedTime;

    const powerPts = powerRef.current;
    if (powerPts) {
      const pos = powerPts.geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < POWER_COUNT; i++) {
        const seed = powerSeeds[i];
        const u = ((t * 0.22 + seed) % 1 + 1) % 1;
        let x: number;
        let y: number;
        let z: number;
        if (u < 0.35) {
          const s = u / 0.35;
          x = -3.3 + s * 0.9;
          y = 0.45 + Math.sin(s * Math.PI) * 0.15;
          z = 0.5 + (seed - 0.5) * 0.4;
        } else if (u < 0.55) {
          const s = (u - 0.35) / 0.2;
          x = -2.4 + s * 0.3;
          y = 0.55;
          const aisle = Math.floor(seed * 3);
          z = 0.5 + s * (-0.9 + aisle * 0.85 - 0.5);
        } else {
          const s = (u - 0.55) / 0.45;
          const aisle = Math.floor(seed * 3);
          x = -2.0 + s * 4.0;
          y = 0.35 + (seed % 0.3);
          z = -0.9 + aisle * 0.85 + (seed - 0.5) * 0.15;
        }
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      powerPts.visible = powerOn > 0.02;
      if (powerMat.current) powerMat.current.opacity = powerOn * 0.9;
    }

    const heatPts = heatRef.current;
    if (heatPts) {
      const pos = heatPts.geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < HEAT_COUNT; i++) {
        const sx = heatSeeds[i * 3];
        const phase = heatSeeds[i * 3 + 1];
        const sz = heatSeeds[i * 3 + 2];
        const u = ((t * 0.18 + phase) % 1 + 1) % 1;
        let x = sx;
        let y: number;
        let z = sz;
        if (u < 0.45) {
          const s = u / 0.45;
          y = 1.05 + s * 0.55;
          x = sx + Math.sin(t + phase * 6) * 0.04;
        } else {
          const s = (u - 0.45) / 0.55;
          y = 1.6 + s * 1.4;
          x = sx + s * 0.35 * (sx >= 0 ? 1 : -1);
          z = sz - s * 0.8;
        }
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      heatPts.visible = heatOn > 0.02;
      if (heatMat.current) {
        heatMat.current.opacity = heatOn * 0.85;
        heatMat.current.color.copy(accentColor);
      }
    }
  });

  return (
    <group>
      {/* Power busbar */}
      <mesh position={[-2.85, 0.45, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
        <meshStandardMaterial
          color="#5CE1A8"
          emissive="#5CE1A8"
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.7}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[-2.35, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial
          color="#3a8f6e"
          emissive="#5CE1A8"
          emissiveIntensity={0.25}
          roughness={0.4}
          metalness={0.65}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Heat riser tubes */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh key={`riser-${i}`} position={[x, 1.45, -1.35]}>
          <cylinderGeometry args={[0.035, 0.04, 0.7, 8]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.55}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      <points ref={powerRef} geometry={powerGeo} frustumCulled={false}>
        <pointsMaterial
          ref={powerMat}
          color="#5CE1A8"
          size={0.055}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <points ref={heatRef} geometry={heatGeo} frustumCulled={false}>
        <pointsMaterial
          ref={heatMat}
          color={accent}
          size={0.06}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
