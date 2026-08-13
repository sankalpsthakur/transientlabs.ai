'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInViewMount } from '@/components/stack/webgl';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';

interface FirmCanvasProps {
  children: ReactNode;
  className?: string;
  reduced?: boolean;
  fullBleed?: boolean;
}

/**
 * Paper canvas — HeroWorkflow law: demand loop, dpr [1, 1.5], no bloom.
 * Mounts only near viewport. Unmounts offscreen.
 */
export function FirmCanvas({
  children,
  className,
  reduced = false,
  fullBleed = false,
}: FirmCanvasProps) {
  const { ref, mounted } = useInViewMount('240px 0px');
  const tier = useDeviceTier();
  const dpr: [number, number] = reduced || tier === 'low' ? [1, 1] : [1, 1.5];

  return (
    <div
      ref={ref}
      data-firm-canvas=""
      data-full-bleed={fullBleed || undefined}
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[1.75rem] border border-[#e2d3c1] bg-[#f8f2e9]',
        fullBleed && 'lg:rounded-none lg:border-0',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 62% at 50% 44%, transparent 38%, rgba(24,18,13,0.08) 100%)',
        }}
        aria-hidden
      />
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#67584b]">
            loading nucleus
          </span>
        </div>
      )}
      {mounted && (
        <Canvas
          dpr={dpr}
          frameloop="demand"
          gl={{
            antialias: !reduced && tier !== 'low',
            alpha: true,
            powerPreference: tier === 'high' ? 'high-performance' : 'default',
          }}
          camera={{ position: [3.55, 2.35, 4.35], fov: 40, near: 0.05, far: 80 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
