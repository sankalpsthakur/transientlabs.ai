'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { Earth } from './Earth';
import { SatelliteShell, DEFAULT_SHELLS } from './SatelliteShell';
import { CoverageBeam } from './CoverageBeam';
import { MicroZoom, HERO_SAT_POS } from './MicroZoom';

interface SceneProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Piecewise camera keyframes across the full macro → bit continuum. */
type CamKey = {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

const CAM_KEYS: CamKey[] = [
  // Constellation establish
  { p: 0.0, pos: [0.15, 1.55, 6.2], look: [0, -0.05, 0], fov: 38 },
  // Orbital shell focus
  { p: 0.18, pos: [0.55, 1.15, 4.85], look: [0.35, 0.08, 0.15], fov: 36 },
  // Approach hero sat
  { p: 0.32, pos: [1.2, 0.55, 2.65], look: [1.7, 0.3, 0.5], fov: 34 },
  // Satellite bus three-quarter
  { p: 0.45, pos: [2.15, 0.55, 1.35], look: [...HERO_SAT_POS], fov: 32 },
  // Phased array face fill
  { p: 0.58, pos: [1.85, 0.32, 1.35], look: [1.85, 0.32, 0.72], fov: 28 },
  // RF / optical link along beam toward peer
  { p: 0.74, pos: [1.95, 0.4, 0.95], look: [2.35, 0.42, 1.55], fov: 30 },
  // Bit stream grain — ride the link
  { p: 1.0, pos: [2.15, 0.42, 1.25], look: [2.55, 0.44, 1.85], fov: 26 },
];

function sampleCamera(p: number): {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
} {
  const keys = CAM_KEYS;
  if (p <= keys[0].p) {
    return { pos: keys[0].pos, look: keys[0].look, fov: keys[0].fov };
  }
  if (p >= keys[keys.length - 1].p) {
    const k = keys[keys.length - 1];
    return { pos: k.pos, look: k.look, fov: k.fov };
  }
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].p < p) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = smoothstep(a.p, b.p, p);
  return {
    pos: [
      lerp(a.pos[0], b.pos[0], t),
      lerp(a.pos[1], b.pos[1], t),
      lerp(a.pos[2], b.pos[2], t),
    ],
    look: [
      lerp(a.look[0], b.look[0], t),
      lerp(a.look[1], b.look[1], t),
      lerp(a.look[2], b.look[2], t),
    ],
    fov: lerp(a.fov, b.fov, t),
  };
}

/** Sparse starfield as a single points cloud — cheap depth cue. */
function Starfield({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 18 + Math.random() * 22;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        size={0.035}
        color="#b8c8e8"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Scroll-driven LEO constellation → bus → array → link → bit continuum.
 * Camera dollies through all scale rungs; MicroZoom owns deep grain.
 */
export function Scene({
  progress,
  accent = '#7EA2FF',
  reduced = false,
}: SceneProps) {
  const macroRootRef = useRef<THREE.Group>(null);
  const macroRef = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const lookTarget = useRef(new THREE.Vector3());

  // Space backdrop — avoid default three.js grey void
  useEffect(() => {
    const prevBg = scene.background;
    const prevFog = scene.fog;
    scene.background = new THREE.Color('#03060d');
    scene.fog = new THREE.FogExp2('#03060d', 0.018);
    return () => {
      scene.background = prevBg;
      scene.fog = prevFog;
    };
  }, [scene]);

  useFrame(() => {
    const raw = progress.get();
    // Freeze at bus+array mid-deep frame for reduced motion
    const p = reduced ? 0.55 : raw;

    const sample = sampleCamera(p);
    camera.position.set(sample.pos[0], sample.pos[1], sample.pos[2]);
    lookTarget.current.set(sample.look[0], sample.look[1], sample.look[2]);
    camera.lookAt(lookTarget.current);

    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - sample.fov) > 0.04) {
      persp.fov = sample.fov;
      persp.updateProjectionMatrix();
    }

    // Macro world: full presence early, fades as we dive into the bus
    const macroFade = reduced ? 0.1 : 1 - smoothstep(0.28, 0.48, p);
    if (macroRef.current) {
      macroRef.current.visible = macroFade > 0.02;
      // Scale + slight pull so dive feels continuous without z-fighting
      const s = 0.55 + macroFade * 0.45;
      macroRef.current.scale.setScalar(s);
      macroRef.current.position.y = lerp(0, -0.35, 1 - macroFade);
    }

    // Macro yaw only while orbital; settles before bus so MicroZoom stays world-stable
    if (macroRootRef.current) {
      const macroT = reduced ? 0 : 1 - smoothstep(0.22, 0.4, p);
      macroRootRef.current.rotation.y =
        lerp(0.12, 0.85, Math.min(p, 0.28) / 0.28) * macroT;
      macroRootRef.current.rotation.x = lerp(0.16, 0.05, smoothstep(0, 0.4, p)) * macroT;
    }

    // Pull fog closer during micro so stars don't compete
    const fog = scene.fog as THREE.FogExp2 | null;
    if (fog && fog.isFogExp2) {
      fog.density = lerp(0.018, 0.045, smoothstep(0.35, 0.85, p));
    }
  });

  return (
    <>
      {/* Cinematic lighting stack */}
      <ambientLight intensity={0.18} color="#6a7a9a" />
      <directionalLight
        position={[4.5, 2.8, 3.2]}
        intensity={1.35}
        color="#fff4e8"
      />
      <directionalLight
        position={[-3.5, -1.2, -2.5]}
        intensity={0.35}
        color="#4a6ab0"
      />
      <pointLight
        position={[0, 0, 3.5]}
        intensity={0.25}
        color={accent}
        distance={12}
      />
      {/* Local key for hero bus as we dive */}
      <pointLight
        position={[
          HERO_SAT_POS[0] + 0.4,
          HERO_SAT_POS[1] + 0.5,
          HERO_SAT_POS[2] + 0.6,
        ]}
        intensity={0.65}
        color="#fff2e0"
        distance={4}
      />
      <pointLight
        position={[HERO_SAT_POS[0], HERO_SAT_POS[1], HERO_SAT_POS[2] + 0.3]}
        intensity={0.4}
        color={accent}
        distance={2.5}
      />

      <Starfield count={reduced ? 280 : 520} />

      {/* Macro: Earth + shells + coverage — rotates then settles; fades on bus dive */}
      <group ref={macroRootRef}>
        <group ref={macroRef}>
          <Earth progress={progress} accent={accent} reduced={reduced} />

          {DEFAULT_SHELLS.map((shell, i) => (
            <SatelliteShell
              key={i}
              progress={progress}
              accent={accent}
              reduced={reduced}
              config={shell}
              driftSpeed={0.05 + i * 0.025}
              focusShell={i === 0}
            />
          ))}

          <CoverageBeam progress={progress} accent={accent} />
        </group>
      </group>

      {/* Micro continuum in stable world space (camera keyframes target this) */}
      <MicroZoom
        progress={progress}
        accent={accent}
        reduced={reduced}
        position={HERO_SAT_POS}
      />
    </>
  );
}
