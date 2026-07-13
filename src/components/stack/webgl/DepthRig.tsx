'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

export interface DepthRigProps {
  progress?: MotionValue<number>;
  accent?: string;
  /** Scene mood */
  mood?: 'space' | 'industrial' | 'energy' | 'lab' | 'night';
  reduced?: boolean;
  /** Extra near-field dust count */
  dust?: number;
}

const MOOD: Record<
  NonNullable<DepthRigProps['mood']>,
  { fog: string; fogDensity: number; amb: string; rim: string; ground: string }
> = {
  space: {
    fog: '#03060d',
    fogDensity: 0.022,
    amb: '#0a1220',
    rim: '#7ea2ff',
    ground: '#050810',
  },
  industrial: {
    fog: '#0c0a08',
    fogDensity: 0.028,
    amb: '#1a1410',
    rim: '#e8a87c',
    ground: '#0a0806',
  },
  energy: {
    fog: '#060b09',
    fogDensity: 0.024,
    amb: '#0c1612',
    rim: '#5ce1a8',
    ground: '#050807',
  },
  lab: {
    fog: '#0a0906',
    fogDensity: 0.026,
    amb: '#16120a',
    rim: '#f0c75e',
    ground: '#080704',
  },
  night: {
    fog: '#060508',
    fogDensity: 0.03,
    amb: '#120e16',
    rim: '#c4a1ff',
    ground: '#050408',
  },
};

/**
 * Shared cinematic depth: multi-distance dust, ground recede, volumetric-ish fog cue,
 * parallax light drift. Drop into every module Scene for consistent "world" depth.
 */
export function DepthRig({
  progress,
  accent,
  mood = 'space',
  reduced = false,
  dust = 180,
}: DepthRigProps) {
  const theme = MOOD[mood];
  const rim = accent || theme.rim;
  const dustRef = useRef<THREE.Points>(null);
  const farDustRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const nearDust = useMemo(() => {
    const n = reduced ? Math.floor(dust * 0.4) : dust;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [dust, reduced]);

  const farDust = useMemo(() => {
    const n = reduced ? 40 : 90;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = -8 - Math.random() * 24;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [reduced]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress?.get() ?? 0;

    if (dustRef.current && !reduced) {
      dustRef.current.rotation.y = t * 0.015 + p * 0.08;
      dustRef.current.position.z = p * 0.6;
      const mat = dustRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.22 + p * 0.12;
    }
    if (farDustRef.current && !reduced) {
      farDustRef.current.rotation.y = t * 0.006;
      farDustRef.current.position.z = -2 + p * 1.2;
    }
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.2) * 1.2;
      lightRef.current.position.y = 1.2 + Math.cos(t * 0.15) * 0.4;
      lightRef.current.intensity = 0.25 + p * 0.35;
    }
  });

  return (
    <group>
      <color attach="background" args={[theme.fog]} />
      <fogExp2 attach="fog" args={[theme.fog, theme.fogDensity]} />

      <ambientLight intensity={0.18} color={theme.amb} />
      <hemisphereLight args={[rim, theme.ground, 0.35]} />
      <directionalLight position={[5, 6, 4]} intensity={0.55} color="#f2f4f8" />
      <directionalLight position={[-4, 2, -3]} intensity={0.2} color={rim} />
      <pointLight
        ref={lightRef}
        position={[1.2, 1.4, 2]}
        intensity={0.3}
        color={rim}
        distance={14}
        decay={2}
      />

      {/* Far receding ground disc — horizon cue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <circleGeometry args={[18, 48]} />
        <meshStandardMaterial
          color={theme.ground}
          metalness={0.1}
          roughness={0.95}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.58, 0]}>
        <ringGeometry args={[4, 14, 48]} />
        <meshBasicMaterial
          color={rim}
          transparent
          opacity={0.04}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Near dust (parallax layer) */}
      <points ref={dustRef} geometry={nearDust} frustumCulled={false}>
        <pointsMaterial
          size={0.028}
          color={rim}
          transparent
          opacity={0.28}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      {/* Far dust (deeper plane) */}
      <points ref={farDustRef} geometry={farDust} frustumCulled={false}>
        <pointsMaterial
          size={0.05}
          color="#a8b4c8"
          transparent
          opacity={0.18}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
