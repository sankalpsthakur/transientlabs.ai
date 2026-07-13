'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { Group, InstancedMesh } from 'three';

export interface PerceptionOverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

const SEG_GREEN = '#5EB478';
const SEG_BLUE = '#5080C8';
const SEG_AMBER = '#C8A050';

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

const POINT_COUNT = 96;

/**
 * Floating "what the car sees" panel — sparse point cloud + segmentation boxes.
 * Appears mid-late scroll (perception phase).
 */
export function PerceptionOverlay({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: PerceptionOverlayProps) {
  const root = useRef<Group>(null);
  const pointsMesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const pointData = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; c: number }[] =
      [];
    for (let i = 0; i < POINT_COUNT; i++) {
      // Pseudo-structured scene: ground band + vertical clusters (agents)
      const lane = i % 3;
      const depth = (i / POINT_COUNT) * 1.1 - 0.15;
      const side = (lane - 1) * 0.28 + (Math.sin(i * 1.7) * 0.06);
      const elev =
        i % 11 === 0
          ? 0.15 + (i % 5) * 0.04
          : i % 7 === 0
            ? 0.22
            : Math.abs(Math.sin(i * 0.4)) * 0.05;
      arr.push({
        x: side,
        y: elev,
        z: depth,
        s: 0.012 + (i % 4) * 0.004,
        c: i % 11 === 0 ? 1 : i % 7 === 0 ? 2 : 0,
      });
    }
    return arr;
  }, []);

  const palette = useMemo(
    () => [new THREE.Color(accent), new THREE.Color(SEG_GREEN), new THREE.Color(SEG_BLUE)],
    [accent]
  );

  const agentBox = useMemo(() => new THREE.BoxGeometry(0.22, 0.32, 0.18), []);
  const vehicleBox = useMemo(() => new THREE.BoxGeometry(0.28, 0.22, 0.35), []);

  useFrame((state) => {
    const p = reduced ? 0.72 : progress.get();
    // Bridge sensor → pixel; yield to MicroZoom feature/control
    const appear = reduced
      ? 0.85
      : smoothstep(0.48, 0.62, p) * (1 - smoothstep(0.72, 0.84, p));
    const t = state.clock.elapsedTime;

    if (root.current) {
      root.current.visible = appear > 0.02;
      root.current.scale.setScalar(0.85 + appear * 0.15);
      // gentle float
      root.current.position.y = 0.55 + Math.sin(t * 0.9) * 0.025 * appear;
      root.current.rotation.y = -0.25 + Math.sin(t * 0.35) * 0.03;
      // fade via traverse of basic materials is heavy — use scale + position slide-in
      root.current.position.x = lerp(2.4, 1.55, appear);
    }

    const im = pointsMesh.current;
    if (im) {
      for (let i = 0; i < POINT_COUNT; i++) {
        const pt = pointData[i];
        // reveal points front-to-back with progress
        const reveal = clamp01((appear - i / POINT_COUNT * 0.35) / 0.65);
        const pulse = 1 + Math.sin(t * 2.5 + i * 0.15) * 0.08 * appear;
        dummy.position.set(pt.x, pt.y, pt.z);
        dummy.scale.setScalar(pt.s * reveal * pulse * 18);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
        color.copy(palette[pt.c]);
        im.setColorAt(i, color);
      }
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={root} position={[1.55, 0.55, 0.2]} rotation={[0, -0.25, 0]}>
      {/* Panel frame */}
      <mesh position={[0, 0.05, -0.02]}>
        <boxGeometry args={[1.15, 0.95, 0.03]} />
        <meshStandardMaterial
          color="#0a080c"
          metalness={0.4}
          roughness={0.45}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Accent border */}
      <mesh position={[0, 0.05, -0.005]}>
        <boxGeometry args={[1.18, 0.98, 0.01]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point cloud volume */}
      <group position={[0, -0.05, 0.08]}>
        <instancedMesh
          ref={pointsMesh}
          args={[undefined, undefined, POINT_COUNT]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        {/* Segmentation boxes — agents / vehicle / road patch */}
        <mesh position={[-0.22, 0.12, 0.35]}>
          <boxGeometry args={[0.22, 0.32, 0.18]} />
          <meshBasicMaterial
            color={SEG_GREEN}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0.28, 0.08, 0.15]}>
          <boxGeometry args={[0.28, 0.22, 0.35]} />
          <meshBasicMaterial
            color={SEG_BLUE}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0.02, -0.12, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.7]} />
          <meshBasicMaterial
            color={SEG_AMBER}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Wireframe outlines for technical read */}
        <lineSegments position={[-0.22, 0.12, 0.35]}>
          <edgesGeometry args={[agentBox]} />
          <lineBasicMaterial color={SEG_GREEN} transparent opacity={0.7} />
        </lineSegments>
        <lineSegments position={[0.28, 0.08, 0.15]}>
          <edgesGeometry args={[vehicleBox]} />
          <lineBasicMaterial color={SEG_BLUE} transparent opacity={0.7} />
        </lineSegments>
      </group>

      <Text
        position={[0, -0.52, 0.04]}
        fontSize={0.065}
        color="rgba(255,255,255,0.55)"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        what the car sees
      </Text>

      {/* Optional HTML chip — crisp type for HUD feel */}
      <Html
        position={[0.42, 0.42, 0.05]}
        center
        distanceFactor={4.5}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
          style={{
            color: accent,
            borderColor: `${accent}55`,
            background: 'rgba(8,6,12,0.85)',
            whiteSpace: 'nowrap',
          }}
        >
          fusion · tracks
        </div>
      </Html>
    </group>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
