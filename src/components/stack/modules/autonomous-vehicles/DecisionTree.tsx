'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

export interface DecisionTreeProps {
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

const NODES = [
  { id: 'predict', label: 'PREDICT', pos: [0, 0.35, 0] as const },
  { id: 'plan', label: 'PLAN', pos: [-0.55, -0.15, 0] as const },
  { id: 'act', label: 'ACT', pos: [0.55, -0.15, 0] as const },
] as const;

/**
 * Late-progress decision stack: predict → plan → act branching near the vehicle.
 */
export function DecisionTree({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: DecisionTreeProps) {
  const root = useRef<Group>(null);
  const nodeMeshes = useRef<(Mesh | null)[]>([]);
  const pulseRefs = useRef<(Mesh | null)[]>([]);

  const edges = useMemo(
    () => [
      {
        points: [
          new THREE.Vector3(0, 0.35, 0),
          new THREE.Vector3(-0.55, -0.15, 0),
        ],
      },
      {
        points: [
          new THREE.Vector3(0, 0.35, 0),
          new THREE.Vector3(0.55, -0.15, 0),
        ],
      },
    ],
    []
  );

  useFrame((state) => {
    const p = reduced ? 0.78 : progress.get();
    // Soft predict→plan→act under feature phase; yield to control-bit glow
    const appear = reduced
      ? 0.55
      : smoothstep(0.7, 0.8, p) * (1 - smoothstep(0.88, 0.97, p));
    const t = state.clock.elapsedTime;

    if (root.current) {
      root.current.visible = appear > 0.02;
      root.current.position.y = -1.05 + (1 - appear) * 0.35;
      root.current.scale.setScalar(0.75 + appear * 0.25);
    }

    NODES.forEach((_, i) => {
      const mesh = nodeMeshes.current[i];
      const pulse = pulseRefs.current[i];
      const phase = smoothstep(0, 1, appear - i * 0.12);
      if (mesh) {
        mesh.scale.setScalar(0.5 + phase * 0.5);
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.35 + phase * 0.45 + Math.sin(t * 2.5 + i) * 0.08;
        mat.opacity = 0.3 + phase * 0.7;
      }
      if (pulse) {
        const s = 1 + Math.sin(t * 2.2 + i * 1.1) * 0.15 * phase;
        pulse.scale.setScalar(s);
        const mat = pulse.material as THREE.MeshBasicMaterial;
        mat.opacity = phase * 0.25 * (0.6 + 0.4 * Math.sin(t * 3 + i));
      }
    });
  });

  return (
    <group ref={root} position={[0, -1.05, 0]}>
      {edges.map((e, i) => (
        <Line
          key={i}
          points={e.points}
          color={accent}
          lineWidth={1.5}
          transparent
          opacity={0.55}
        />
      ))}

      {NODES.map((node, i) => (
        <group key={node.id} position={[...node.pos]}>
          <mesh
            ref={(el) => {
              nodeMeshes.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color={i === 0 ? accent : '#1a1424'}
              emissive={accent}
              emissiveIntensity={0.5}
              metalness={0.4}
              roughness={0.35}
              transparent
              opacity={1}
            />
          </mesh>
          <mesh
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshBasicMaterial
              color={accent}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.07}
            color="rgba(255,255,255,0.55)"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.003}
            outlineColor="#000000"
          >
            {node.label}
          </Text>
        </group>
      ))}

      <Text
        position={[0, -0.48, 0]}
        fontSize={0.055}
        color="rgba(255,255,255,0.35)"
        anchorX="center"
        anchorY="middle"
      >
        predict → plan → act
      </Text>
    </group>
  );
}
