'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Points } from 'three';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  AdditiveBlending,
} from 'three';

export interface ParticlesProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  fixedProgress?: number;
  /** Particle count — keep low for GPU budget */
  count?: number;
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
 * Soft heat / activity field around the revealed core.
 * Active during assembly phase; hands off to MicroZoom neutron transport.
 */
export function Particles({
  progress,
  accent = '#5CE1A8',
  reduced = false,
  fixedProgress,
  count = 96,
}: ParticlesProps) {
  const pointsRef = useRef<Points>(null);

  const { geometry, base, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const baseArr = new Float32Array(count * 3);
    const phaseArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Fibonacci-ish sphere shell with slight thickness
      const u = (i + 0.5) / count;
      const phi = Math.acos(1 - 2 * u);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.55 + (i % 5) * 0.08;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.85;
      const z = r * Math.sin(phi) * Math.sin(theta);

      baseArr[i * 3] = x;
      baseArr[i * 3 + 1] = y;
      baseArr[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      phaseArr[i] = (i * 0.37) % 1;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));

    return { geometry: geo, base: baseArr, phases: phaseArr };
  }, [count]);

  const color = useMemo(() => new Color(accent), [accent]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const p = fixedProgress != null ? fixedProgress : progress.get();
    // Core activity during peel/assembly; exit before pellet/fission grain
    const field =
      smoothstep(0.35, 0.52, p) * (1 - smoothstep(0.54, 0.66, p));
    const expand = lerp(1, 1.35, smoothstep(0.4, 0.55, p));

    const pos = pts.geometry.attributes.position as BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = reduced ? 0 : state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const phase = phases[i];
      const spin = reduced ? 0 : t * (0.15 + phase * 0.1) * field;
      const bx = base[ix];
      const by = base[ix + 1];
      const bz = base[ix + 2];

      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      const rx = bx * cos - bz * sin;
      const rz = bx * sin + bz * cos;
      const breathe = reduced
        ? 0
        : Math.sin(t * 1.2 + phase * Math.PI * 2) * 0.03 * field;

      arr[ix] = rx * (expand + breathe);
      arr[ix + 1] = by * (expand + breathe * 0.5);
      arr[ix + 2] = rz * (expand + breathe);
    }
    pos.needsUpdate = true;

    const mat = pts.material as unknown as {
      opacity: number;
      size: number;
    };
    mat.opacity = field * 0.75;
    mat.size = lerp(0.018, 0.028, field);

    pts.visible = field > 0.02;
    pts.rotation.y = reduced ? 0 : t * 0.08 * field;
  });

  return (
    <points ref={pointsRef} geometry={geometry} position={[0, 0.05, 0]}>
      <pointsMaterial
        color={color}
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
