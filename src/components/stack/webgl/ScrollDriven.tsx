'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group } from 'three';

export interface ScrollDrivenProps {
  progress: MotionValue<number>;
  children: ReactNode;
  /** Map progress → rotation Y (radians) */
  rotateY?: [number, number];
  /** Map progress → position Z */
  positionZ?: [number, number];
  /** Map progress → scale */
  scale?: [number, number];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Applies scroll progress to a group every frame without React re-renders.
 */
export function ScrollDriven({
  progress,
  children,
  rotateY = [0, 0],
  positionZ = [0, 0],
  scale = [1, 1],
}: ScrollDrivenProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const p = progress.get();
    g.rotation.y = lerp(rotateY[0], rotateY[1], p);
    g.position.z = lerp(positionZ[0], positionZ[1], p);
    const s = lerp(scale[0], scale[1], p);
    g.scale.setScalar(s);
  });

  return <group ref={ref}>{children}</group>;
}
