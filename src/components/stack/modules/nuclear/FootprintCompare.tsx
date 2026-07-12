'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, Mesh, MeshStandardMaterial, LineSegments } from 'three';
import {
  Color,
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
} from 'three';

export interface FootprintCompareProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  fixedProgress?: number;
  children: ReactNode;
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

function buildDashedRect(width: number, depth: number, y: number) {
  const hw = width / 2;
  const hd = depth / 2;
  const segs = 14;
  const pts: number[] = [];

  const pushDash = (x0: number, z0: number, x1: number, z1: number) => {
    for (let i = 0; i < segs; i++) {
      if (i % 2 === 1) continue;
      const t0 = i / segs;
      const t1 = Math.min(1, (i + 1) / segs);
      pts.push(
        lerp(x0, x1, t0),
        y,
        lerp(z0, z1, t0),
        lerp(x0, x1, t1),
        y,
        lerp(z0, z1, t1)
      );
    }
  };

  pushDash(-hw, -hd, hw, -hd);
  pushDash(hw, -hd, hw, hd);
  pushDash(hw, hd, -hw, hd);
  pushDash(-hw, hd, -hw, -hd);

  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pts, 3));
  return geo;
}

/**
 * Establishing pad: GW-scale ghost footprint vs SMR pad (progress 0.00–0.18).
 * Fades as camera peels into containment — continuum continues into the core.
 * Does not shrink the reactor late (micro zoom owns 0.5–1.0).
 */
export function FootprintCompare({
  progress,
  accent = '#5CE1A8',
  fixedProgress,
  children,
}: FootprintCompareProps) {
  const reactorScaleRef = useRef<Group>(null);
  const padGroupRef = useRef<Group>(null);
  const padFillRef = useRef<Mesh>(null);
  const smrPadRef = useRef<Mesh>(null);
  const outlineRef = useRef<LineSegments>(null);

  const accentColor = useMemo(() => new Color(accent), [accent]);
  const ghostColor = useMemo(() => new Color('#c8d4ce'), []);

  const outlineGeo = useMemo(
    () => buildDashedRect(5.2, 4.4, -1.35),
    []
  );
  const outlineMat = useMemo(
    () =>
      new LineBasicMaterial({
        color: ghostColor,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [ghostColor]
  );

  useEffect(
    () => () => {
      outlineGeo.dispose();
      outlineMat.dispose();
    },
    [outlineGeo, outlineMat]
  );

  useFrame(() => {
    const p = fixedProgress != null ? fixedProgress : progress.get();

    // Pad establishing shot early in continuum
    const padIn = smoothstep(0.0, 0.06, p);
    const padOut = 1 - smoothstep(0.12, 0.22, p);
    const padT = padIn * padOut;

    // Soft settle of reactor onto pad at start (no late shrink)
    const settle = smoothstep(0.0, 0.14, p);

    if (reactorScaleRef.current) {
      const s = lerp(0.92, 1, settle);
      reactorScaleRef.current.scale.setScalar(s);
      reactorScaleRef.current.position.y = lerp(-0.08, 0, settle);
    }

    if (padGroupRef.current) {
      padGroupRef.current.visible = padT > 0.01;
    }

    if (padFillRef.current) {
      const mat = padFillRef.current.material as MeshStandardMaterial;
      mat.opacity = padT * 0.12;
    }
    if (smrPadRef.current) {
      const mat = smrPadRef.current.material as MeshStandardMaterial;
      mat.opacity = padT * 0.45;
      // SMR pad reads smaller against GW ghost outline
      const padS = lerp(0.38, 0.42, settle);
      smrPadRef.current.scale.set(padS / 0.4, 1, padS / 0.4);
    }
    if (outlineRef.current) {
      (outlineRef.current.material as LineBasicMaterial).opacity = padT * 0.55;
    }
  });

  return (
    <group>
      <group ref={reactorScaleRef}>{children}</group>

      <group ref={padGroupRef}>
        <mesh
          ref={padFillRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.36, 0]}
        >
          <planeGeometry args={[5.2, 4.4]} />
          <meshStandardMaterial
            color={ghostColor}
            transparent
            opacity={0}
            depthWrite={false}
            metalness={0}
            roughness={1}
          />
        </mesh>

        <lineSegments
          ref={outlineRef}
          geometry={outlineGeo}
          material={outlineMat}
        />

        <mesh
          ref={smrPadRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.34, 0]}
        >
          <planeGeometry args={[1.6, 1.35]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.28}
            transparent
            opacity={0}
            depthWrite={false}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
