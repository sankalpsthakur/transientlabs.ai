'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import type { Group, MeshStandardMaterial } from 'three';

export interface VehicleProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/**
 * Elegant low-poly autonomous vehicle silhouette — dark premium shell,
 * subtle cabin glass, machined undercarriage. Scroll fades body in early.
 */
export function Vehicle({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: VehicleProps) {
  const group = useRef<Group>(null);
  const bodyMat = useRef<MeshStandardMaterial>(null);
  const glassMat = useRef<MeshStandardMaterial>(null);

  const wheelPositions = useMemo(
    () =>
      [
        [-0.72, 0.18, 0.52],
        [0.72, 0.18, 0.52],
        [-0.72, 0.18, -0.55],
        [0.72, 0.18, -0.55],
      ] as const,
    []
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const p = reduced ? 1 : progress.get();
    const appear = reduced ? 1 : smoothstep(0.0, 0.18, p);
    g.scale.setScalar(0.92 + appear * 0.08);
    if (bodyMat.current) {
      bodyMat.current.opacity = 0.15 + appear * 0.85;
      bodyMat.current.emissiveIntensity = 0.04 + appear * 0.06;
    }
    if (glassMat.current) {
      glassMat.current.opacity = appear * 0.42;
    }
    // subtle idle breathe when assembled
    if (!reduced && p > 0.2) {
      g.position.y = Math.sin(performance.now() * 0.0012) * 0.012;
    } else {
      g.position.y = 0;
    }
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Main lower body */}
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <boxGeometry args={[1.55, 0.28, 2.35]} />
        <meshStandardMaterial
          ref={bodyMat}
          color="#1a1620"
          metalness={0.72}
          roughness={0.28}
          emissive={accent}
          emissiveIntensity={0.05}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Side sculpt / rocker panels */}
      <mesh position={[0.78, 0.28, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.08, 0.18, 2.1]} />
        <meshStandardMaterial
          color="#121018"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[-0.78, 0.28, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.08, 0.18, 2.1]} />
        <meshStandardMaterial
          color="#121018"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>

      {/* Cabin / greenhouse */}
      <mesh position={[0, 0.62, -0.08]}>
        <boxGeometry args={[1.28, 0.38, 1.35]} />
        <meshStandardMaterial
          color="#14101a"
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>

      {/* Windshield (front) */}
      <mesh position={[0, 0.62, 0.58]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.18, 0.32, 0.06]} />
        <meshStandardMaterial
          ref={glassMat}
          color="#7EA2FF"
          metalness={0.15}
          roughness={0.08}
          transparent
          opacity={0.4}
          emissive="#7EA2FF"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Rear glass */}
      <mesh position={[0, 0.62, -0.72]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[1.15, 0.28, 0.05]} />
        <meshStandardMaterial
          color="#6a90e8"
          metalness={0.15}
          roughness={0.1}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Hood slope */}
      <mesh position={[0, 0.48, 0.85]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.42, 0.1, 0.55]} />
        <meshStandardMaterial
          color="#18141f"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Rear deck */}
      <mesh position={[0, 0.48, -0.95]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.42]} />
        <meshStandardMaterial
          color="#18141f"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Front bumper bar with accent edge */}
      <mesh position={[0, 0.22, 1.18]}>
        <boxGeometry args={[1.48, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#0e0c12"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.28, 1.22]}>
        <boxGeometry args={[0.9, 0.02, 0.04]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.55}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Rear light bar */}
      <mesh position={[0, 0.38, -1.2]}>
        <boxGeometry args={[1.1, 0.04, 0.04]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Roof sensor pad (mount plate) */}
      <mesh position={[0, 0.84, -0.05]}>
        <cylinderGeometry args={[0.22, 0.26, 0.04, 16]} />
        <meshStandardMaterial
          color="#0c0a10"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <group key={i} position={[pos[0], pos[1], pos[2]]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 18]} />
            <meshStandardMaterial
              color="#0a090c"
              metalness={0.4}
              roughness={0.55}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.17, 12]} />
            <meshStandardMaterial
              color="#2a2434"
              metalness={0.85}
              roughness={0.2}
              emissive={accent}
              emissiveIntensity={0.08}
            />
          </mesh>
        </group>
      ))}

      {/* Ground contact shadow disc (cheap) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.35, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
