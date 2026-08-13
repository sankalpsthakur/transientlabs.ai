'use client';

import { ContactShadows, Edges } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useInViewMount } from '@/components/stack/webgl';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, PerspectiveCamera } from 'three';
import { Color } from 'three';
import type { HotspotId, StageId } from './playbook';

const PAPER = '#F8F2E9';
const WARM = '#EFE4D5';
const INK = '#18120D';

export interface SceneProps {
  progress?: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  stage: StageId;
  hotspot: HotspotId;
  enabled: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CAM: Record<StageId, [number, number, number]> = {
  bills: [7.4, 8.2, 7.6],
  hotspots: [6.2, 6.8, 6.4],
  opportunities: [5.6, 6.2, 6.0],
  tags: [4.6, 4.8, 5.2],
  clamps: [3.9, 4.2, 4.6],
  sops: [4.2, 4.6, 4.8],
  handoff: [6.8, 6.4, 5.2],
};

const LOOK: Record<HotspotId, [number, number, number]> = {
  compressor: [-2.6, 0.2, 1.1],
  kiln: [0.3, 0.25, -1.3],
  hvac: [3.1, 0.55, -1.5],
  line: [0.7, 0.1, 1.5],
};

function Block({
  pos,
  size,
  selected,
  accent,
  id,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  selected: boolean;
  accent: string;
  id: string;
}) {
  const ref = useRef<Mesh>(null);
  const restY = pos[1];

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const target = selected ? restY + 0.12 : restY;
    mesh.position.y = lerp(mesh.position.y, target, Math.min(1, dt * 6));
  });

  return (
    <mesh ref={ref} position={pos} castShadow receiveShadow userData={{ id }}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={selected ? '#e7dcc8' : WARM}
        emissive={selected ? accent : '#000000'}
        emissiveIntensity={selected ? 0.16 : 0}
        roughness={0.72}
        metalness={0.04}
      />
      <Edges threshold={18} color={selected ? accent : INK} />
    </mesh>
  );
}

function PlantGroup({
  hotspot,
  stage,
  accent,
  reduced,
}: {
  hotspot: HotspotId;
  stage: StageId;
  accent: string;
  reduced: boolean;
}) {
  const root = useRef<Group>(null);
  const accentColor = useMemo(() => new Color(accent), [accent]);

  // Work may orbit. Authority (the plant) does not travel — and no longer sways
  // either: the idle rotation made a plant drawing read as an ornament.

  const showGateway = stage === 'handoff' || stage === 'sops';

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={PAPER} roughness={0.95} metalness={0} />
      </mesh>
      <gridHelper args={[14, 28, '#cdb8a0', '#e2d3c1']} position={[0, 0.01, 0]} />

      {/* Incoming yard */}
      <Block
        id="incoming"
        pos={[-4.4, 0.22, -2.4]}
        size={[1.4, 0.44, 1.2]}
        selected={stage === 'bills'}
        accent={accent}
      />

      <Block
        id="compressor"
        pos={[-2.7, 0.42, 1.15]}
        size={[2.4, 0.84, 1.7]}
        selected={hotspot === 'compressor'}
        accent={accent}
      />
      <Block
        id="kiln"
        pos={[0.35, 0.36, -1.35]}
        size={[4.6, 0.72, 1.2]}
        selected={hotspot === 'kiln'}
        accent={accent}
      />
      <Block
        id="hvac"
        pos={[3.15, 0.78, -1.45]}
        size={[1.5, 0.58, 1.05]}
        selected={hotspot === 'hvac'}
        accent={accent}
      />
      <Block
        id="line"
        pos={[0.75, 0.16, 1.55]}
        size={[3.7, 0.32, 1.45]}
        selected={hotspot === 'line'}
        accent={accent}
      />

      {showGateway && (
        <mesh position={[4.35, 0.55, 2.15]} castShadow>
          <boxGeometry args={[0.55, 1.1, 0.45]} />
          <meshStandardMaterial
            color="#d8c4a6"
            emissive={accentColor}
            emissiveIntensity={0.22}
            roughness={0.45}
            metalness={0.12}
          />
          <Edges threshold={15} color={accent} />
        </mesh>
      )}
    </group>
  );
}

function Rig({
  stage,
  hotspot,
  reduced,
}: {
  stage: StageId;
  hotspot: HotspotId;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const look = useRef<[number, number, number]>([0, 0.2, 0]);

  useFrame((_, dt) => {
    const cam = camera as PerspectiveCamera;
    if (reduced) {
      cam.position.set(5.8, 6.2, 6.0);
      cam.lookAt(0, 0.2, 0);
      if (Math.abs(cam.fov - 34) > 0.2) {
        cam.fov = 34;
        cam.updateProjectionMatrix();
      }
      return;
    }
    const [tx, ty, tz] = CAM[stage];
    const k = Math.min(1, dt * 3.2);
    cam.position.x = lerp(cam.position.x, tx, k);
    cam.position.y = lerp(cam.position.y, ty, k);
    cam.position.z = lerp(cam.position.z, tz, k);
    const target = LOOK[hotspot];
    look.current[0] = lerp(look.current[0], target[0] * 0.35, k);
    look.current[1] = lerp(look.current[1], target[1], k);
    look.current[2] = lerp(look.current[2], target[2] * 0.35, k);
    cam.lookAt(look.current[0], look.current[1], look.current[2]);
    const fov = stage === 'clamps' || stage === 'tags' ? 30 : 34;
    cam.fov = lerp(cam.fov, fov, k);
    cam.updateProjectionMatrix();
  });

  return null;
}

/**
 * Paper-and-ink plant massing. Decorative depth under the SVG drawing.
 * One WebGL context. No bloom. Disabled on low / reduced tiers.
 */
export function Scene({
  accent = '#1F3F93',
  reduced = false,
  stage,
  hotspot,
  enabled,
}: SceneProps) {
  const { ref, mounted } = useInViewMount('160px 0px');
  const tier = useDeviceTier();
  const live = enabled && mounted && !reduced && tier === 'high';

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-ea-webgl={live ? 'on' : 'off'}
    >
      {live && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop="always"
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [6.2, 6.8, 6.4], fov: 34, near: 0.1, far: 80 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <color attach="background" args={[PAPER]} />
          <hemisphereLight args={['#fffaf3', '#c4b49a', 0.85]} />
          <directionalLight position={[6, 10, 4]} intensity={0.85} castShadow />
          <PlantGroup hotspot={hotspot} stage={stage} accent={accent} reduced={reduced} />
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.18}
            scale={16}
            blur={2.4}
            far={6}
            color="#18120d"
          />
          <Rig stage={stage} hotspot={hotspot} reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}
