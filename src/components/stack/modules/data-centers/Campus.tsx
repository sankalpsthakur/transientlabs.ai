'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, MeshStandardMaterial } from 'three';

export interface CampusProps {
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

/**
 * Low-poly hyperscale hall: shell, floor, structural bays, peel-away roof.
 */
export function Campus({
  progress,
  accent = '#E8A87C',
  reduced = false,
}: CampusProps) {
  const roofRef = useRef<Group>(null);

  useFrame(() => {
    // Reduced freezes on GPU+die; roof stays open under macro
    const p = reduced ? 0.42 : progress.get();
    const roofOpen = reduced ? 1 : smoothstep(0.1, 0.3, p);

    const roof = roofRef.current;
    if (!roof) return;

    roof.position.y = lerp(1.12, 2.35, roofOpen);
    roof.position.z = lerp(0, -0.35, roofOpen);
    roof.rotation.x = lerp(0, -0.55, roofOpen);

    const opacity = lerp(1, 0.08, roofOpen);
    roof.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const m of mats) {
        const mat = m as MeshStandardMaterial;
        if ('opacity' in mat) {
          mat.transparent = true;
          mat.opacity = opacity;
          mat.depthWrite = opacity > 0.5;
        }
      }
    });
  });

  const wallColor = '#1c1814';
  const floorColor = '#0c0a08';
  const trimColor = '#2e261f';
  const glassColor = '#151a22';

  return (
    <group>
      {/* Ground pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#0a0908" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Concrete apron ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <ringGeometry args={[3.4, 4.1, 48]} />
        <meshStandardMaterial color="#14110e" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Floor slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.06, 3.2]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Cold / hot aisle floor strips */}
      {Array.from({ length: 5 }, (_, i) => {
        const z = -1.2 + i * 0.6;
        return (
          <mesh
            key={`aisle-${i}`}
            position={[0, 0.055, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[4.6, 0.04]} />
            <meshBasicMaterial
              color={accent}
              transparent
              opacity={0.06 + (i % 2) * 0.04}
            />
          </mesh>
        );
      })}

      {/* Back wall */}
      <mesh position={[0, 0.95, -1.58]} castShadow receiveShadow>
        <boxGeometry args={[5.1, 1.9, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.75} metalness={0.2} />
      </mesh>
      {/* Front wall (lower lip — cutaway) */}
      <mesh position={[0, 0.35, 1.58]} castShadow receiveShadow>
        <boxGeometry args={[5.1, 0.7, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.75} metalness={0.2} />
      </mesh>
      {/* Front upper rail */}
      <mesh position={[0, 1.55, 1.58]} castShadow>
        <boxGeometry args={[5.1, 0.18, 0.1]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} metalness={0.35} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-2.55, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 1.9, 3.28]} />
        <meshStandardMaterial color={wallColor} roughness={0.75} metalness={0.2} />
      </mesh>
      {/* Right wall */}
      <mesh position={[2.55, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 1.9, 3.28]} />
        <meshStandardMaterial color={wallColor} roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Structural columns */}
      {[
        [-2.2, -1.3],
        [2.2, -1.3],
        [-2.2, 1.3],
        [2.2, 1.3],
        [0, -1.3],
        [0, 1.3],
      ].map(([x, z], i) => (
        <mesh key={`col-${i}`} position={[x, 0.95, z]} castShadow>
          <boxGeometry args={[0.12, 1.85, 0.12]} />
          <meshStandardMaterial color={trimColor} roughness={0.55} metalness={0.4} />
        </mesh>
      ))}

      {/* Mech penthouse / chiller annex */}
      <mesh position={[3.35, 0.55, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.1, 1.6]} />
        <meshStandardMaterial color="#181410" roughness={0.7} metalness={0.25} />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={`louver-${i}`} position={[3.92, 0.35 + i * 0.22, -0.4]}>
          <boxGeometry args={[0.04, 0.06, 1.35]} />
          <meshStandardMaterial color="#2a2420" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Substation / power block */}
      <mesh position={[-3.3, 0.4, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.8, 1.2]} />
        <meshStandardMaterial color="#16120f" roughness={0.65} metalness={0.35} />
      </mesh>
      <mesh position={[-3.3, 0.85, 0.5]}>
        <boxGeometry args={[0.55, 0.12, 0.55]} />
        <meshStandardMaterial
          color="#5CE1A8"
          emissive="#5CE1A8"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Accent rim strip */}
      <mesh position={[0, 1.88, -1.52]}>
        <boxGeometry args={[5.0, 0.03, 0.04]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      {/* Cool glass window band */}
      <mesh position={[0, 1.15, -1.51]}>
        <boxGeometry args={[4.4, 0.35, 0.03]} />
        <meshStandardMaterial
          color={glassColor}
          emissive="#1a3040"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Roof assembly — peels open with scroll */}
      <group ref={roofRef} position={[0, 1.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 0.1, 3.35]} />
          <meshStandardMaterial color="#221c17" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[5.25, 0.04, 3.4]} />
          <meshStandardMaterial color={trimColor} roughness={0.55} metalness={0.45} />
        </mesh>
        {[-1.4, 0, 1.4].map((x, i) => (
          <group key={`hvac-${i}`} position={[x, 0.18, -0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.28, 0.55]} />
              <meshStandardMaterial color="#1a1612" roughness={0.6} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.12, 12]} />
              <meshStandardMaterial color="#2a2420" roughness={0.5} metalness={0.55} />
            </mesh>
          </group>
        ))}
      </group>

      <ScaleComparator progress={progress} reduced={reduced} />
    </group>
  );
}

function ScaleComparator({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame(() => {
    // Stadium ghost only during campus/hall establish — micro scales own late scroll
    const p = reduced ? 0.2 : progress.get();
    const t = reduced
      ? 0
      : smoothstep(0.05, 0.14, p) * (1 - smoothstep(0.22, 0.34, p));
    const g = group.current;
    if (!g) return;
    g.visible = t > 0.02;
    g.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const m of mats) {
        if (m && 'opacity' in m) {
          const mat = m as { opacity: number; transparent: boolean };
          mat.transparent = true;
          mat.opacity = t * 0.4;
        }
      }
    });
  });

  return (
    <group ref={group} position={[0, 0.02, 0]}>
      {/* Stadium oval ghost */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.55, 0.014, 6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.45, 3.52, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
      {/* City-block footprint ghost */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[7.2, 0.02, 5.0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
