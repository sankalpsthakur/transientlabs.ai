'use client';

import { ContactShadows } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { PerspectiveCamera } from 'three';
import { DepthRig } from '@/components/stack/webgl';
import { ReactorLayers } from './ReactorLayers';
import { Particles } from './Particles';
import { FootprintCompare } from './FootprintCompare';
import { Overlay3D } from './Overlay';
import { MicroZoom } from './MicroZoom';

export interface SceneProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  /** When set, scrub is frozen (reduced motion) */
  fixedProgress?: number;
  particleCount?: number;
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Nuclear / SMR R3F scene — full scale continuum:
 * pad → containment → vessel → assembly → pellet → fission → neutron economy.
 * Camera dolly continues into core grain; soft instrument lighting.
 */
export function Scene({
  progress,
  accent = '#5CE1A8',
  reduced = false,
  fixedProgress,
  particleCount = 96,
}: SceneProps) {
  const { camera } = useThree();
  const lookY = useRef(0.05);

  useFrame(() => {
    const p = fixedProgress != null ? fixedProgress : progress.get();
    const cam = camera as PerspectiveCamera;

    // Keyframe stages matching scaleLadders.nuclear
    // 0 pad · 1 containment/vessel · 2 assembly · 3 pellet · 4 fission · 5 neutron
    const tPad = smoothstep(0.0, 0.12, p);
    const tShell = smoothstep(0.12, 0.36, p);
    const tAsm = smoothstep(0.36, 0.52, p);
    const tPellet = smoothstep(0.52, 0.66, p);
    const tFission = smoothstep(0.66, 0.82, p);
    const tNeutron = smoothstep(0.82, 0.98, p);

    // Continuous stage index 0→5
    const stage =
      tNeutron > 0.001
        ? 4 + tNeutron
        : tFission > 0.001
          ? 3 + tFission
          : tPellet > 0.001
            ? 2 + tPellet
            : tAsm > 0.001
              ? 1 + tAsm
              : tShell > 0.001
                ? 0.5 + tShell * 0.5
                : tPad * 0.5;

    // Camera keyframes: pad establish → peel approach → assembly dive → pellet → fission → economy
    const keys = {
      x: [4.2, 3.2, 1.95, 0.95, 0.7, 0.85],
      y: [2.2, 1.55, 0.95, 0.38, 0.22, 0.28],
      z: [7.2, 5.0, 3.2, 1.65, 1.25, 1.45],
      lookY: [-0.2, 0.05, 0.08, 0.04, 0.05, 0.04],
      fov: [40, 34, 30, 26, 22, 24],
    };

    // Map stage onto 0..5 keyframe span
    const mapped =
      stage < 0.5
        ? stage * 2 // 0–0.5 → keys 0–1 (pad→shell)
        : 1 + (stage - 0.5); // 0.5–5 → keys 1–5.5 capped

    const i0 = Math.min(4, Math.floor(mapped));
    const i1 = Math.min(5, i0 + 1);
    const f = mapped - i0;

    const tx = lerp(keys.x[i0], keys.x[i1], f);
    const ty = lerp(keys.y[i0], keys.y[i1], f);
    const tz = lerp(keys.z[i0], keys.z[i1], f);
    const ly = lerp(keys.lookY[i0], keys.lookY[i1], f);
    const fov = lerp(keys.fov[i0], keys.fov[i1], f);

    if (reduced) {
      // Freeze mid assembly / early fission grain
      cam.position.set(1.15, 0.5, 2.0);
      cam.lookAt(0, 0.05, 0);
      if (Math.abs(cam.fov - 30) > 0.05) {
        cam.fov = 30;
        cam.updateProjectionMatrix();
      }
      return;
    }

    cam.position.x = lerp(cam.position.x, tx, 0.14);
    cam.position.y = lerp(cam.position.y, ty, 0.14);
    cam.position.z = lerp(cam.position.z, tz, 0.14);
    lookY.current = lerp(lookY.current, ly, 0.14);
    cam.lookAt(0, lookY.current, 0);

    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return (
    <>
      <DepthRig
        progress={progress}
        accent={accent}
        mood="energy"
        reduced={reduced}
        dust={reduced ? 70 : 200}
      />
      <pointLight
        position={[0, 0.2, 0.4]}
        intensity={0.75}
        color={accent}
        distance={6}
        decay={2}
      />

      <FootprintCompare
        progress={progress}
        accent={accent}
        reduced={reduced}
        fixedProgress={fixedProgress}
      >
        <ReactorLayers
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={fixedProgress}
        />
        <Particles
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={fixedProgress}
          count={particleCount}
        />
        <Overlay3D
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={fixedProgress}
        />
        <MicroZoom
          progress={progress}
          accent={accent}
          reduced={reduced}
          fixedProgress={fixedProgress}
        />
      </FootprintCompare>

      <ContactShadows
        position={[0, -1.38, 0]}
        opacity={0.35}
        scale={10}
        blur={2.4}
        far={5}
        color="#000000"
      />
    </>
  );
}
