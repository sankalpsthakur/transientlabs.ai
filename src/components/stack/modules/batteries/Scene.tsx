'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import { CellLayers } from './CellLayers';
import { JellyRoll } from './JellyRoll';
import { PackAssembly } from './PackAssembly';
import { MicroZoom } from './MicroZoom';

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

export interface BatteriesSceneProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  fixedProgress?: number;
  ionCount?: number;
}

/**
 * Full scale continuum camera + stage.
 *
 *  0.00–0.14  Gigafactory (wide line / pack proxy)
 *  0.10–0.28  Pack
 *  0.24–0.40  Module grid
 *  0.36–0.52  Cell / jelly-roll
 *  0.48–0.66  Electrode stack (dolly into thickness)
 *  0.62–0.82  Li⁺ shuttle
 *  0.78–1.00  Crystal host lattice
 */
export function BatteriesScene({
  progress,
  accent = '#F0C75E',
  reduced = false,
  fixedProgress,
  ionCount = 14,
}: BatteriesSceneProps) {
  const stage = useRef<Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p =
      fixedProgress != null
        ? fixedProgress
        : reduced
          ? 0.72
          : progress.get();

    const cam = camera as PerspectiveCamera;

    // Overlapping stage weights for multi-keyframe camera
    const tFactory = 1 - smoothstep(0.08, 0.18, p);
    const tPack = smoothstep(0.08, 0.18, p) * (1 - smoothstep(0.24, 0.34, p));
    const tModule = smoothstep(0.22, 0.32, p) * (1 - smoothstep(0.36, 0.46, p));
    const tCell = smoothstep(0.34, 0.46, p) * (1 - smoothstep(0.48, 0.58, p));
    const tElectrode = smoothstep(0.48, 0.6, p) * (1 - smoothstep(0.64, 0.74, p));
    const tIon = smoothstep(0.62, 0.74, p) * (1 - smoothstep(0.8, 0.9, p));
    const tLattice = smoothstep(0.78, 0.92, p);

    // Keyframe table: factory, pack, module, cell, electrode, ion, lattice
    const keys = {
      x: [3.6, 2.5, 2.0, 1.15, 0.85, 0.55, 0.42],
      y: [2.6, 1.9, 1.55, 0.95, 0.55, 0.28, 0.2],
      z: [5.4, 4.3, 3.6, 2.75, 1.95, 1.35, 1.05],
      lookY: [-0.15, -0.2, -0.12, 0.05, 0.08, 0.0, -0.05],
      fov: [42, 38, 36, 34, 30, 28, 26],
    };

    // Weighted blend across 7 stages
    const w = [
      Math.max(tFactory, 0.001 * (1 - p)),
      tPack,
      tModule,
      tCell,
      tElectrode,
      tIon,
      Math.max(tLattice, smoothstep(0.9, 1, p)),
    ];
    // Ensure coverage at boundaries
    if (p < 0.1) w[0] = Math.max(w[0], 1 - p * 8);
    if (p > 0.92) w[6] = Math.max(w[6], 1);

    let sum = 0;
    for (const v of w) sum += v;
    const inv = sum > 0 ? 1 / sum : 1;

    let camX = 0;
    let camY = 0;
    let camZ = 0;
    let lookY = 0;
    let fov = 0;
    for (let i = 0; i < 7; i++) {
      const wt = w[i] * inv;
      camX += keys.x[i] * wt;
      camY += keys.y[i] * wt;
      camZ += keys.z[i] * wt;
      lookY += keys.lookY[i] * wt;
      fov += keys.fov[i] * wt;
    }

    if (reduced) {
      // Mid-separator freeze framing for reduced motion
      cam.position.set(0.55, 0.28, 1.4);
      look.current.set(0, 0, 0);
      cam.lookAt(look.current);
      if (Math.abs(cam.fov - 28) > 0.05) {
        cam.fov = 28;
        cam.updateProjectionMatrix();
      }
    } else {
      const damp = 0.14;
      cam.position.x = lerp(cam.position.x, camX, damp);
      cam.position.y = lerp(cam.position.y, camY, damp);
      cam.position.z = lerp(cam.position.z, camZ, damp);
      look.current.set(0, lookY, 0);
      cam.lookAt(look.current);
      if (Math.abs(cam.fov - fov) > 0.08) {
        cam.fov = lerp(cam.fov, fov, damp);
        cam.updateProjectionMatrix();
      }
    }

    if (stage.current) {
      stage.current.rotation.y = reduced
        ? 0.12
        : lerp(-0.08, 0.22, smoothstep(0, 1, p));
    }

    if (keyLight.current) {
      keyLight.current.intensity = lerp(1.05, 1.35, smoothstep(0.5, 0.9, p));
    }
    if (rimLight.current) {
      // Gold energy intensifies into ion / lattice phases
      rimLight.current.intensity = lerp(
        0.3,
        1.25,
        smoothstep(0.55, 0.9, p)
      );
      rimLight.current.position.set(
        lerp(-1.5, 0.2, smoothstep(0.6, 0.9, p)),
        lerp(0.5, 0.15, smoothstep(0.6, 0.9, p)),
        lerp(2, 1.1, smoothstep(0.6, 0.9, p))
      );
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0907']} />
      <fog attach="fog" args={['#0a0907', 5, 16]} />

      <ambientLight intensity={0.28} color="#c8c4bc" />
      <directionalLight
        ref={keyLight}
        position={[4, 6, 3]}
        intensity={1.2}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.35}
        color="#8a9bb0"
      />
      <pointLight
        ref={rimLight}
        position={[-1.5, 0.5, 2]}
        intensity={0.4}
        color={accent}
        distance={8}
        decay={2}
      />

      <group ref={stage}>
        <PackAssembly progress={progress} accent={accent} />
        <JellyRoll progress={progress} accent={accent} />
        <CellLayers progress={progress} accent={accent} />
        <MicroZoom
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={fixedProgress}
          ionCount={ionCount}
        />
      </group>

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.45}
        scale={10}
        blur={2.6}
        far={4}
        color="#000000"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.16, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.5, 48]} />
        <meshStandardMaterial
          color="#100e0b"
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>
    </>
  );
}
