'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import type { Group, PerspectiveCamera } from 'three';
import { DepthRig } from '@/components/stack/webgl';
import { Campus } from './Campus';
import { Racks } from './Racks';
import { PowerFlow } from './PowerFlow';
import { HERO_RACK, MicroZoom } from './MicroZoom';

export interface SceneProps {
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

/** Reduced-motion freeze: GPU package + lit die keyframe */
const REDUCED_P = 0.62;

/**
 * Scroll-driven camera + composition for the hyperscale campus continuum.
 *
 * Timeline (aligned to scaleLadders['data-centers']):
 *  0.00–0.16  Campus massing (high three-quarter)
 *  0.12–0.30  Server hall — roof peel, aisle dolly
 *  0.26–0.44  GPU rack — emphasize hero chassis
 *  0.40–0.58  Accelerator — package + HBM
 *  0.55–0.75  Die / transistor — gate grain
 *  0.72–1.00  Bit / token stream + heat residual
 */
export function Scene({
  progress,
  accent = '#E8A87C',
  reduced = false,
}: SceneProps) {
  const root = useRef<Group>(null);
  const macro = useRef<Group>(null);

  useFrame(({ camera }) => {
    const p = reduced ? REDUCED_P : progress.get();
    const cam = camera as PerspectiveCamera;

    // Keyframes: campus → hall → rack → accelerator → die → bits
    // Positions track toward HERO_RACK then hold intimate micro framing
    const hx = HERO_RACK[0];
    const hy = HERO_RACK[1];
    const hz = HERO_RACK[2];

    const keys = {
      // Stay clear of StackCanvas near=0.1 at micro keyframes
      x: [5.4, 4.0, 1.35, hx + 0.32, hx + 0.18, hx + 0.28],
      y: [3.9, 2.85, 1.55, hy + 0.28, hy + 0.16, hy + 0.24],
      z: [5.8, 4.4, 2.55, hz + 0.58, hz + 0.36, hz + 0.52],
      lookX: [0, 0.05, hx * 0.6, hx, hx + 0.02, hx + 0.06],
      lookY: [0.5, 0.7, hy, hy + 0.02, hy + 0.04, hy + 0.1],
      lookZ: [0, 0, hz * 0.5, hz, hz, hz + 0.08],
      fov: [42, 36, 32, 28, 24, 27],
    };

    // Continuous camera parameter u ∈ [0, 5]
    // 0.00–0.16 → campus→hall
    // 0.16–0.35 → hall→rack
    // 0.35–0.50 → rack→gpu
    // 0.50–0.65 → gpu→die
    // 0.65–0.85 → die→bits
    // 0.85–1.00 → hold bits
    let u: number;
    if (p <= 0.16) {
      u = smoothstep(0.0, 0.16, p);
    } else if (p <= 0.35) {
      u = 1 + smoothstep(0.16, 0.35, p);
    } else if (p <= 0.5) {
      u = 2 + smoothstep(0.35, 0.5, p);
    } else if (p <= 0.65) {
      u = 3 + smoothstep(0.5, 0.65, p);
    } else if (p <= 0.85) {
      u = 4 + smoothstep(0.65, 0.85, p);
    } else {
      u = 5;
    }

    const i0 = Math.min(4, Math.floor(u));
    const i1 = Math.min(5, i0 + 1);
    const f = u - i0;

    const px = lerp(keys.x[i0], keys.x[i1], f);
    const py = lerp(keys.y[i0], keys.y[i1], f);
    const pz = lerp(keys.z[i0], keys.z[i1], f);
    const lx = lerp(keys.lookX[i0], keys.lookX[i1], f);
    const ly = lerp(keys.lookY[i0], keys.lookY[i1], f);
    const lz = lerp(keys.lookZ[i0], keys.lookZ[i1], f);
    const fov = lerp(keys.fov[i0], keys.fov[i1], f);

    cam.position.set(px, py, pz);
    cam.lookAt(lx, ly, lz);
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // Macro hall yields the frame as we enter accelerator / die
    const macroFade = reduced ? 0.08 : 1 - smoothstep(0.4, 0.56, p);
    const macroG = macro.current;
    if (macroG) {
      macroG.visible = macroFade > 0.03;
      // Soft scale-out so the GPU package owns the frame (no material thrash)
      const sc = lerp(1, 0.88, 1 - macroFade);
      macroG.scale.setScalar(sc);
    }

    if (root.current) {
      root.current.rotation.y = reduced
        ? 0.02
        : Math.sin(p * Math.PI) * 0.035 * (1 - smoothstep(0.45, 0.65, p));
    }
  });

  return (
    <>
      <DepthRig
        progress={progress}
        accent={accent}
        mood="industrial"
        reduced={reduced}
        dust={reduced ? 70 : 200}
      />
      <pointLight
        position={[0, 1.4, 0.5]}
        intensity={0.55}
        color="#6ec8ff"
        distance={8}
      />
      <pointLight
        position={[-2, 2.2, 2]}
        intensity={0.65}
        color={accent}
        distance={10}
      />
      {/* Micro-scale key light locked to hero rack */}
      <pointLight
        position={[HERO_RACK[0] + 0.2, HERO_RACK[1] + 0.35, HERO_RACK[2] + 0.35]}
        intensity={0.85}
        color="#a8d4ff"
        distance={2.2}
      />

      <group ref={root}>
        <group ref={macro}>
          <Campus progress={progress} accent={accent} reduced={reduced} />
          <Racks progress={progress} accent={accent} reduced={reduced} />
          <PowerFlow progress={progress} accent={accent} reduced={reduced} />
        </group>
        <MicroZoom
          progress={progress}
          accent={accent}
          reduced={reduced}
          focus={HERO_RACK}
        />
      </group>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.42}
        scale={12}
        blur={2.4}
        far={6}
        color="#000000"
        frames={1}
      />
    </>
  );
}
