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
  /** Cinematic frame: taller stage with depth vignette */
  cinematic?: boolean;
}

/**
 * Performance-first R3F canvas for Physical Stack modules.
 * - Mounts only near viewport
 * - Unmounts when scrolled far away
 * - DPR + frameloop tiered by device capability
 * - Cinematic mode: deeper frame + edge falloff for spatial depth
 */
export function StackCanvas({
  children,
  className,
  rootMargin = '280px 0px',
  camera = { position: [0, 0, 6], fov: 40 },
  maxDpr,
  cinematic = true,
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
        'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)]',
        cinematic
          ? 'aspect-[4/5] max-w-none min-h-[min(72vh,640px)] sm:aspect-[5/6] lg:aspect-square lg:min-h-[min(78vh,720px)]'
          : 'aspect-square max-w-lg',
        className
      )}
    >
      {/* Inner depth frame — false aperture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.55)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-2xl"
        style={{
          background:
            'radial-gradient(ellipse 75% 70% at 50% 42%, transparent 35%, rgba(0,0,0,0.45) 100%)',
        }}
        aria-hidden
      />

      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/25">
              loading depth
            </span>
          </div>
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
            position: camera.position ?? [0, 0.4, 7],
            fov: camera.fov ?? 38,
            near: 0.05,
            far: 400,
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
