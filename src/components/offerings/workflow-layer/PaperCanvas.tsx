'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { useInViewMount } from '@/components/stack/webgl';
import { PAPER } from './model';

export function PaperCanvas({
  children,
  className,
  camera = { position: [3.6, 2.2, 4.6], fov: 34 },
  reduced = false,
}: {
  children: ReactNode;
  className?: string;
  camera?: { position?: [number, number, number]; fov?: number };
  reduced?: boolean;
}) {
  const { ref, mounted } = useInViewMount('220px 0px');
  const tier = useDeviceTier();
  const high = tier === 'high';

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-paper',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 58% at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 72%)',
        }}
        aria-hidden
      />
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            loading floor
          </span>
        </div>
      )}
      {mounted && (
        <Canvas
          dpr={[1, high && !reduced ? 1.5 : 1.15]}
          frameloop={reduced ? 'demand' : 'always'}
          gl={{
            antialias: high && !reduced,
            alpha: true,
            powerPreference: high ? 'high-performance' : 'default',
          }}
          camera={{
            position: camera.position ?? [3.6, 2.2, 4.6],
            fov: camera.fov ?? 34,
            near: 0.05,
            far: 80,
          }}
          style={{ width: '100%', height: '100%', background: 'transparent', touchAction: 'none' }}
        >
          <color attach="background" args={[PAPER]} />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
