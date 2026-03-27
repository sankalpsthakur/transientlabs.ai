'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { m } from 'framer-motion';

interface ScrollVideoProps {
  /** Video source URL */
  src: string;
  /** Optional CSS class names */
  className?: string;
  /** Total number of frames in the video sequence (default: 100) */
  frameCount?: number;
  /** Frames per second for playback calculation (default: 30) */
  fps?: number;
  /** Optional custom scroll container ref */
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

/**
 * ScrollVideo - A component for scroll-synced video playback.
 * 
 * Maps scroll progress to video currentTime for smooth scrubbed animation.
 * Optimized with requestAnimationFrame, intersection observer, and smooth interpolation.
 * 
 * Inspired by Shopify's Winter '26 edition scroll experiences.
 */
export function ScrollVideo({
  src,
  className = '',
  frameCount = 100,
  fps = 30,
  scrollContainerRef,
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isInViewRef = useRef<boolean>(true);
  const tickRef = useRef<(() => void) | null>(null);
  
  // Loading states
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [_duration, setDuration] = useState(0);

  // Track viewport visibility with Intersection Observer via Framer Motion
  const isInView = useInView(containerRef, { 
    amount: 0.1,
    once: false 
  });

  // Sync ref with state for RAF access
  useEffect(() => {
    isInViewRef.current = isInView;
    
    // Pause video when out of viewport
    const video = videoRef.current;
    if (video) {
      if (!isInView && !video.paused) {
        video.pause();
      }
    }
  }, [isInView]);

  // Calculate scroll progress using Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  // Apply smooth spring interpolation for buttery smooth scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform scroll progress (0-1) to video currentTime
  const calculatedDuration = frameCount / fps;
  const targetTime = useTransform(smoothProgress, [0, 1], [0, calculatedDuration]);

  // RAF loop for smooth video scrubbing (avoid self-referential callback warnings)
  useEffect(() => {
    tickRef.current = () => {
      const video = videoRef.current;

      if (video && isInViewRef.current) {
        const currentTargetTime = targetTime.get();
        targetTimeRef.current = currentTargetTime;

        const timeDiff = Math.abs(video.currentTime - currentTargetTime);
        if (timeDiff > 0.01 && video.readyState >= 2) {
          video.currentTime = currentTargetTime;
        }
      }

      rafRef.current = requestAnimationFrame(() => tickRef.current?.());
    };
  }, [targetTime]);

  // Start RAF loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => tickRef.current?.());
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      // If video has actual duration, prefer it over calculated
      if (video.duration > 0) {
        targetTimeRef.current = 0;
      }
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
    setIsLoaded(true);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleError = useCallback(() => {
    setIsBuffering(false);
    setIsLoaded(false);
    console.error('ScrollVideo: Error loading video:', src);
  }, [src]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <m.div
              className="w-8 h-8 border-2 border-neutral-400 border-t-neutral-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="text-xs text-neutral-500 uppercase tracking-wider">
              Loading
            </span>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {isLoaded && isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <m.div
            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}

export default ScrollVideo;
