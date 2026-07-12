'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInViewMount } from './useInViewMount';
import { useDeviceTier } from '../hooks/useDeviceTier';

export interface StackCanvasProps {
  children: ReactNode;
  className?: string;
  /** Extra root margin before mount (px) */
  rootMargin?: string;
  /** Camera defaults */
  camera?: { position?: [number, number, number]; fov?: number };
  /** Force dpr cap */
  maxDpr?: number;
}

/**
 * Performance-first R3F canvas for Physical Stack modules.
 * - Mounts only near viewport
 * - Unmounts when scrolled far away
 * - DPR + frameloop tiered by device capability
 */
export function StackCanvas({
  children,
  className,
  rootMargin = '200px 0px',
  camera = { position: [0, 0, 6], fov: 40 },
  maxDpr,
}: StackCanvasProps) {
  const { ref, mounted } = useInViewMount(rootMargin);
  const tier = useDeviceTier();

  const dpr: [number, number] =
    maxDpr != null
      ? [1, maxDpr]
      : tier === 'low'
        ? [1, 1]
        : tier === 'medium'
          ? [1, 1.5]
          : [1, 2];

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/40',
        className
      )}
    >
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
        </div>
      )}
      {mounted && (
        <Canvas
          dpr={dpr}
          gl={{
            antialias: tier !== 'low',
            alpha: true,
            powerPreference: tier === 'high' ? 'high-performance' : 'default',
          }}
          camera={{
            position: camera.position ?? [0, 0, 6],
            fov: camera.fov ?? 40,
            near: 0.1,
            far: 200,
          }}
          frameloop={tier === 'low' ? 'demand' : 'always'}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
