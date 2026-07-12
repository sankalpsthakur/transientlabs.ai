'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial } from 'three';

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

export interface CellLayersProps {
  progress: MotionValue<number>;
  accent?: string;
}

/**
 * Flat electrode sandwich: anode · separator · cathode.
 * Scale ladder: Electrode stack 0.48–0.66; cutaway thickness emphasized
 * before handing off to Li⁺ micro-zoom.
 */
export function CellLayers({
  progress,
  accent = '#F0C75E',
}: CellLayersProps) {
  const root = useRef<Group>(null);
  const anodeRef = useRef<Mesh>(null);
  const sepRef = useRef<Mesh>(null);
  const cathodeRef = useRef<Mesh>(null);
  const cutPlane = useRef<Mesh>(null);

  const materials = useMemo(
    () => ({
      anode: { color: '#2a3340', roughness: 0.88, metalness: 0.12 },
      separator: {
        color: '#e8eef5',
        roughness: 0.35,
        metalness: 0.02,
        baseOpacity: 0.55,
      },
      cathode: { color: accent, roughness: 0.32, metalness: 0.78 },
    }),
    [accent]
  );

  useFrame(() => {
    const p = progress.get();

    const enter = smoothstep(0.46, 0.56, p);
    const hold = 1 - smoothstep(0.64, 0.74, p);
    const vis = enter * hold;

    const anodeT = smoothstep(0.46, 0.54, p);
    const sepT = smoothstep(0.5, 0.58, p);
    const cathT = smoothstep(0.54, 0.62, p);
    // Thickness emphasis — plates spread slightly then compress for cutaway read
    const thickness = smoothstep(0.52, 0.66, p);

    if (anodeRef.current) {
      anodeRef.current.position.y = lerp(0.55, lerp(0.2, 0.28, thickness), anodeT);
      anodeRef.current.position.x = lerp(-0.08, 0, anodeT);
      anodeRef.current.scale.y = lerp(1, 1.35, thickness);
      const mat = anodeRef.current.material as MeshStandardMaterial;
      mat.opacity = anodeT * vis;
      anodeRef.current.visible = mat.opacity > 0.01;
    }

    if (sepRef.current) {
      sepRef.current.position.y = lerp(0.42, 0.02, sepT);
      sepRef.current.scale.y = lerp(1, 1.5, thickness);
      const mat = sepRef.current.material as MeshPhysicalMaterial;
      mat.opacity = sepT * vis * materials.separator.baseOpacity;
      sepRef.current.visible = mat.opacity > 0.01;
    }

    if (cathodeRef.current) {
      cathodeRef.current.position.y = lerp(0.3, lerp(-0.16, -0.24, thickness), cathT);
      cathodeRef.current.position.x = lerp(0.08, 0, cathT);
      cathodeRef.current.scale.y = lerp(1, 1.35, thickness);
      const mat = cathodeRef.current.material as MeshStandardMaterial;
      mat.opacity = cathT * vis;
      cathodeRef.current.visible = mat.opacity > 0.01;
    }

    if (cutPlane.current) {
      const cT = thickness * vis;
      const mat = cutPlane.current.material as MeshStandardMaterial;
      mat.opacity = cT * 0.25;
      cutPlane.current.visible = cT > 0.02;
      cutPlane.current.scale.z = lerp(0.6, 1.1, thickness);
    }

    if (root.current) {
      const assembled = Math.min(anodeT, sepT, cathT);
      root.current.scale.setScalar(
        lerp(0.96, 1.08, assembled) * lerp(1, 1.2, thickness)
      );
      root.current.rotation.x = lerp(0.35, 0.08, assembled + thickness * 0.4);
      root.current.rotation.y = lerp(-0.35, -0.12, assembled);
      root.current.visible = vis > 0.01;
    }
  });

  const plateW = 1.55;
  const plateD = 1.05;

  return (
    <group ref={root} position={[0, 0.1, 0]}>
      {/* Anode — matte graphite */}
      <mesh ref={anodeRef} castShadow receiveShadow>
        <boxGeometry args={[plateW, 0.09, plateD]} />
        <meshStandardMaterial
          color={materials.anode.color}
          roughness={materials.anode.roughness}
          metalness={materials.anode.metalness}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Separator — translucent polymer film */}
      <mesh ref={sepRef} castShadow>
        <boxGeometry args={[plateW * 0.98, 0.035, plateD * 0.98]} />
        <meshPhysicalMaterial
          color={materials.separator.color}
          roughness={materials.separator.roughness}
          metalness={materials.separator.metalness}
          transparent
          opacity={0}
          transmission={0.35}
          thickness={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Cathode — metallic foil / NMC cast */}
      <mesh ref={cathodeRef} castShadow receiveShadow>
        <boxGeometry args={[plateW, 0.09, plateD]} />
        <meshStandardMaterial
          color={materials.cathode.color}
          roughness={materials.cathode.roughness}
          metalness={materials.cathode.metalness}
          emissive={materials.cathode.color}
          emissiveIntensity={0.06}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Soft cutaway edge light — thickness read */}
      <mesh ref={cutPlane} position={[plateW * 0.48, 0.02, 0]} rotation={[0, 0, 0.02]}>
        <boxGeometry args={[0.012, 0.55, plateD * 0.95]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.4}
          metalness={0.7}
          emissive={accent}
          emissiveIntensity={0.35}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
