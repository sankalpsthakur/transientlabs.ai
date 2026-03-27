'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

type ProgressVideoStatus = 'idle' | 'loading' | 'ready' | 'error';

export function ProgressVideo({
  src,
  progress,
  durationSeconds,
  className,
  onStatusChange,
  muted = true,
}: {
  src: string;
  progress: MotionValue<number>; // 0..1
  durationSeconds: number;
  className?: string;
  onStatusChange?: (status: ProgressVideoStatus) => void;
  muted?: boolean;
}) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const [status, setStatus] = useState<ProgressVideoStatus>('idle');

  const clampedDuration = useMemo(() => Math.max(0.01, durationSeconds), [durationSeconds]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  useEffect(() => {
    if (reduced) return;

    const unsub = progress.on('change', (p) => {
      const clamped = Math.max(0, Math.min(1, p));
      targetTimeRef.current = clamped * clampedDuration;
    });
    return () => unsub();
  }, [progress, clampedDuration, reduced]);

  useEffect(() => {
    if (reduced) return;

    const tick = () => {
      const video = videoRef.current;
      if (video && status === 'ready' && video.readyState >= 2) {
        const diff = Math.abs(video.currentTime - targetTimeRef.current);
        if (diff > 0.01) video.currentTime = targetTimeRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reduced, status]);

  if (reduced) return null;

  return (
    <video
      ref={videoRef}
      src={src}
      muted={muted}
      playsInline
      preload="auto"
      className={className}
      onLoadStart={() => setStatus('loading')}
      onCanPlay={() => setStatus('ready')}
      onError={() => setStatus('error')}
    />
  );
}

