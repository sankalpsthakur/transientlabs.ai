'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

export interface SensorsProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

const CAM_BLUE = '#7EA2FF';
const RADAR_GREEN = '#5CE1A8';

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpV3(
  out: THREE.Vector3,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number
) {
  out.set(
    lerp(from[0], to[0], t),
    lerp(from[1], to[1], t),
    lerp(from[2], to[2], t)
  );
}

const LIDAR_HOME = [0, 0.98, -0.05] as const;
const LIDAR_EXPLODED = [0, 2.15, -0.05] as const;

const CAMERAS = [
  {
    id: 'front',
    home: [0, 0.72, 1.05] as const,
    exploded: [0, 1.55, 1.6] as const,
    rot: [0, 0, 0] as const,
  },
  {
    id: 'fl',
    home: [-0.72, 0.7, 0.55] as const,
    exploded: [-1.45, 1.4, 0.7] as const,
    rot: [0, Math.PI * 0.35, 0] as const,
  },
  {
    id: 'fr',
    home: [0.72, 0.7, 0.55] as const,
    exploded: [1.45, 1.4, 0.7] as const,
    rot: [0, -Math.PI * 0.35, 0] as const,
  },
  {
    id: 'rear',
    home: [0, 0.72, -1.05] as const,
    exploded: [0, 1.5, -1.7] as const,
    rot: [0, Math.PI, 0] as const,
  },
] as const;

const RADARS = [
  {
    id: 'front-radar',
    home: [0, 0.35, 1.22] as const,
    exploded: [0, 0.9, 2.0] as const,
    rotY: 0,
  },
  {
    id: 'rear-radar',
    home: [0, 0.35, -1.22] as const,
    exploded: [0, 0.9, -2.0] as const,
    rotY: Math.PI,
  },
  {
    id: 'corner-l',
    home: [-0.78, 0.32, 1.0] as const,
    exploded: [-1.6, 0.75, 1.4] as const,
    rotY: Math.PI * 0.28,
  },
  {
    id: 'corner-r',
    home: [0.78, 0.32, 1.0] as const,
    exploded: [1.6, 0.75, 1.4] as const,
    rotY: -Math.PI * 0.28,
  },
] as const;

/**
 * Exploded multi-modal sensor suite: lidar dome, camera array, radar modules.
 * Assembles onto the body as scroll progress increases; frustums / scan active mid-progress.
 */
export function Sensors({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: SensorsProps) {
  const lidarRef = useRef<Group>(null);
  const lidarSweep = useRef<Mesh>(null);
  const lidarRing = useRef<Mesh>(null);
  const camRefs = useRef<(Group | null)[]>([]);
  const frustumRefs = useRef<(Mesh | null)[]>([]);
  const radarRefs = useRef<(Group | null)[]>([]);
  const lobeRefs = useRef<(Mesh | null)[]>([]);
  const labelGroup = useRef<Group>(null);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const p = reduced ? 1 : progress.get();
    const t = state.clock.elapsedTime;

    // Assembly phases — seated by sensor-suite rung; scan yields to MicroZoom rays
    const lidarT = reduced ? 1 : smoothstep(0.12, 0.34, p);
    const camT = reduced ? 1 : smoothstep(0.28, 0.48, p);
    const radarT = reduced ? 1 : smoothstep(0.36, 0.52, p);
    const scanT = reduced
      ? 0.4
      : smoothstep(0.4, 0.52, p) * (1 - smoothstep(0.55, 0.68, p));
    const labelT = reduced
      ? 1
      : smoothstep(0.2, 0.42, p) * (1 - smoothstep(0.5, 0.62, p));

    // LIDAR
    if (lidarRef.current) {
      lerpV3(tmp, LIDAR_EXPLODED, LIDAR_HOME, lidarT);
      lidarRef.current.position.copy(tmp);
      lidarRef.current.visible = lidarT > 0.02 || reduced;
      lidarRef.current.scale.setScalar(0.6 + lidarT * 0.4);
      // spin dome slightly once seated
      lidarRef.current.rotation.y = t * (0.35 + scanT * 1.8);
    }
    if (lidarSweep.current) {
      lidarSweep.current.rotation.y = t * 2.4;
      const mat = lidarSweep.current.material as THREE.MeshBasicMaterial;
      mat.opacity = scanT * 0.22;
      lidarSweep.current.visible = scanT > 0.05;
    }
    if (lidarRing.current) {
      const mat = lidarRing.current.material as THREE.MeshBasicMaterial;
      mat.opacity = scanT * 0.55;
      lidarRing.current.scale.setScalar(0.85 + Math.sin(t * 3) * 0.06 * scanT);
      lidarRing.current.visible = scanT > 0.05;
    }

    // CAMERAS
    CAMERAS.forEach((cam, i) => {
      const g = camRefs.current[i];
      if (!g) return;
      lerpV3(tmp, cam.exploded, cam.home, camT);
      g.position.copy(tmp);
      g.visible = camT > 0.02 || reduced;
      g.scale.setScalar(0.5 + camT * 0.5);
      const frustum = frustumRefs.current[i];
      if (frustum) {
        const mat = frustum.material as THREE.MeshBasicMaterial;
        mat.opacity = scanT * 0.14;
        frustum.visible = scanT > 0.08;
        frustum.scale.setScalar(0.7 + scanT * 0.45 + Math.sin(t * 2 + i) * 0.02);
      }
    });

    // RADAR
    RADARS.forEach((r, i) => {
      const g = radarRefs.current[i];
      if (!g) return;
      lerpV3(tmp, r.exploded, r.home, radarT);
      g.position.copy(tmp);
      g.visible = radarT > 0.02 || reduced;
      g.scale.setScalar(0.5 + radarT * 0.5);
      const lobe = lobeRefs.current[i];
      if (lobe) {
        const mat = lobe.material as THREE.MeshBasicMaterial;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 0.7);
        mat.opacity = scanT * 0.12 * (0.7 + pulse * 0.3);
        lobe.visible = scanT > 0.08;
        lobe.scale.setScalar(0.75 + scanT * 0.4 + pulse * 0.05);
      }
    });

    if (labelGroup.current) {
      labelGroup.current.visible = reduced || labelT > 0.4;
      const s = reduced ? 1 : labelT;
      labelGroup.current.scale.setScalar(0.85 + s * 0.15);
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* —— LIDAR —— */}
      <group ref={lidarRef} position={[...LIDAR_EXPLODED]}>
        {/* Dome housing */}
        <mesh>
          <sphereGeometry args={[0.14, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color={accent}
            metalness={0.35}
            roughness={0.25}
            emissive={accent}
            emissiveIntensity={0.45}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.06, 16]} />
          <meshStandardMaterial
            color="#1a1424"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Horizontal scan disc */}
        <mesh
          ref={lidarSweep}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 0]}
        >
          <ringGeometry args={[0.35, 1.35, 48, 1, 0, Math.PI * 0.55]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Full range ring */}
        <mesh
          ref={lidarRing}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
        >
          <ringGeometry args={[1.28, 1.34, 64]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* —— CAMERAS —— */}
      {CAMERAS.map((cam, i) => (
        <group
          key={cam.id}
          ref={(el) => {
            camRefs.current[i] = el;
          }}
          position={[...cam.exploded]}
          rotation={[cam.rot[0], cam.rot[1], cam.rot[2]]}
        >
          <mesh>
            <boxGeometry args={[0.12, 0.08, 0.1]} />
            <meshStandardMaterial
              color="#0e0c14"
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <cylinderGeometry args={[0.035, 0.04, 0.04, 12]} />
            <meshStandardMaterial
              color={CAM_BLUE}
              emissive={CAM_BLUE}
              emissiveIntensity={0.6}
              metalness={0.3}
              roughness={0.25}
            />
          </mesh>
          {/* Frustum (cone pointing +Z local) */}
          <mesh
            ref={(el) => {
              frustumRefs.current[i] = el;
            }}
            position={[0, 0, 0.45]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.28, 0.85, 4, 1, true]} />
            <meshBasicMaterial
              color={CAM_BLUE}
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* —— RADAR —— */}
      {RADARS.map((r, i) => (
        <group
          key={r.id}
          ref={(el) => {
            radarRefs.current[i] = el;
          }}
          position={[...r.exploded]}
          rotation={[0, r.rotY, 0]}
        >
          <mesh>
            <boxGeometry args={[0.16, 0.08, 0.06]} />
            <meshStandardMaterial
              color={RADAR_GREEN}
              emissive={RADAR_GREEN}
              emissiveIntensity={0.35}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
          {/* Radar lobe — flattened sphere segment */}
          <mesh
            ref={(el) => {
              lobeRefs.current[i] = el;
            }}
            position={[0, 0.05, 0.55]}
            scale={[1.1, 0.45, 1.4]}
          >
            <sphereGeometry
              args={[0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]}
            />
            <meshBasicMaterial
              color={RADAR_GREEN}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Labels — visible when assembled or reduced motion */}
      <group ref={labelGroup}>
        <Text
          position={[0, 1.35, -0.05]}
          fontSize={0.09}
          color={accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#000000"
        >
          LIDAR
        </Text>
        <Text
          position={[1.15, 0.95, 0.55]}
          fontSize={0.07}
          color={CAM_BLUE}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          CAMERAS
        </Text>
        <Text
          position={[-1.35, 0.55, 1.35]}
          fontSize={0.07}
          color={RADAR_GREEN}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          RADAR
        </Text>
      </group>
    </group>
  );
}
