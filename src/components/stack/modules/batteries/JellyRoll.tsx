'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export interface JellyRollProps {
  progress: MotionValue<number>;
  accent?: string;
}

const LAYER_COUNT = 5;
const CAN_HEIGHT = 1.35;
const CAN_RADIUS = 0.42;

/**
 * Wound cylindrical cell: concentric electrode layers + can shell.
 * Scale ladder: Cell rung 0.36–0.52; exits into electrode stack zoom.
 */
export function JellyRoll({
  progress,
  accent = '#F0C75E',
}: JellyRollProps) {
  const root = useRef<Group>(null);
  const layerMeshes = useRef<(Mesh | null)[]>([]);
  const canRef = useRef<Mesh>(null);
  const capTop = useRef<Mesh>(null);
  const capBot = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const terminalRef = useRef<Mesh>(null);

  const layerRadii = useMemo(() => {
    const base = 0.12;
    const step = 0.048;
    return Array.from({ length: LAYER_COUNT }, (_, i) => base + i * step);
  }, []);

  const layerColors = useMemo(
    () => [
      '#2a3340', // graphite
      '#dfe6ee', // separator
      accent, // cathode foil
      '#3a4554', // anode
      '#c9a84a', // outer foil
    ],
    [accent]
  );

  useFrame((state) => {
    const p = progress.get();

    const enter = smoothstep(0.34, 0.48, p);
    const hold = 1 - smoothstep(0.5, 0.62, p);
    const visible = enter * hold;
    const wind = smoothstep(0.34, 0.52, p);

    if (root.current) {
      root.current.visible = visible > 0.01;
      root.current.rotation.x = lerp(Math.PI / 2, 0.15, wind);
      root.current.rotation.z = lerp(0.2, 0, wind);
      root.current.position.y = lerp(-0.05, 0.05, wind);
      root.current.scale.setScalar(lerp(0.55, 1, enter) * lerp(1, 0.4, 1 - hold));
      root.current.rotation.y =
        wind * Math.PI * 0.85 + state.clock.elapsedTime * 0.12 * visible;
    }

    layerMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const delay = i / LAYER_COUNT;
      const layerT = smoothstep(delay * 0.35, 0.55 + delay * 0.15, wind);
      const scaleXZ = lerp(0.4, 1, layerT);
      mesh.scale.set(scaleXZ, layerT, scaleXZ);
      const mat = mesh.material as MeshStandardMaterial;
      mat.opacity = layerT * visible * (i % 2 === 1 ? 0.65 : 0.92);
    });

    const canT = smoothstep(0.42, 0.52, p) * hold;
    const shell = [canRef, capTop, capBot, coreRef, terminalRef];
    for (const ref of shell) {
      if (!ref.current) continue;
      const mat = ref.current.material as MeshStandardMaterial;
      mat.opacity = canT * (ref === canRef ? 0.88 : 0.95);
      ref.current.visible = canT > 0.02;
    }
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      {layerRadii.map((r, i) => (
        <mesh
          key={i}
          ref={(m) => {
            layerMeshes.current[i] = m;
          }}
          castShadow
          rotation={[0, (i * Math.PI) / 7, 0]}
        >
          <cylinderGeometry args={[r, r, CAN_HEIGHT * 0.88, 32, 1, true]} />
          <meshStandardMaterial
            color={layerColors[i]}
            roughness={i % 2 === 0 ? 0.75 : 0.3}
            metalness={i % 2 === 0 ? 0.15 : 0.7}
            side={THREE.DoubleSide}
            transparent
            opacity={0}
            depthWrite={false}
            emissive={i === 2 || i === 4 ? accent : '#000000'}
            emissiveIntensity={i === 2 || i === 4 ? 0.08 : 0}
          />
        </mesh>
      ))}

      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.06, 0.06, CAN_HEIGHT * 0.7, 12]} />
        <meshStandardMaterial
          color="#8a9098"
          roughness={0.4}
          metalness={0.85}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={canRef} castShadow>
        <cylinderGeometry
          args={[CAN_RADIUS, CAN_RADIUS, CAN_HEIGHT, 40, 1, true]}
        />
        <meshStandardMaterial
          color="#6d727a"
          roughness={0.28}
          metalness={0.9}
          side={THREE.DoubleSide}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={capTop} position={[0, CAN_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[CAN_RADIUS * 1.01, CAN_RADIUS * 1.01, 0.06, 40]} />
        <meshStandardMaterial
          color="#9aa0a8"
          roughness={0.25}
          metalness={0.92}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={capBot} position={[0, -CAN_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[CAN_RADIUS * 1.01, CAN_RADIUS * 1.01, 0.06, 40]} />
        <meshStandardMaterial
          color="#5c6168"
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={terminalRef} position={[0, CAN_HEIGHT / 2 + 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.08, 16]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.35}
          metalness={0.8}
          emissive={accent}
          emissiveIntensity={0.15}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
