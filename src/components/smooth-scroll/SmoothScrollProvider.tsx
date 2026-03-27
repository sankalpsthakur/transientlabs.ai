'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Lenis from 'lenis';
import { useScroll, useSpring, MotionValue, useMotionValue } from 'framer-motion';

type LenisOptions = ConstructorParameters<typeof Lenis>[0];

// Context type
interface SmoothScrollContextType {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      easing?: (t: number) => number;
      immediate?: boolean;
    }
  ) => void;
}

// Create context with default values
const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scrollY: { get: () => 0, set: () => {}, on: () => () => {} } as unknown as MotionValue<number>,
  scrollYProgress: { get: () => 0, set: () => {}, on: () => () => {} } as unknown as MotionValue<number>,
  scrollVelocity: { get: () => 0, set: () => {}, on: () => () => {} } as unknown as MotionValue<number>,
  scrollTo: () => {},
});

// Custom easing function
const defaultEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  options?: Partial<LenisOptions>;
}

export function SmoothScrollProvider({
  children,
  options = {},
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Framer Motion scroll values
  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useMotionValue(0);

  // Smooth the velocity for smoother animations
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Initialize Lenis
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: defaultEasing,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      ...options,
    });

    lenisRef.current = lenisInstance;

    // Animation frame loop
    let active = true;
    function raf(time: number) {
      if (!active) return;
      lenisInstance.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Sync Lenis scroll with Framer Motion
    lenisInstance.on('scroll', ({ scroll, progress, velocity }: Lenis) => {
      // Update Framer Motion scroll values based on Lenis
      scrollY.set(scroll);
      scrollYProgress.set(progress);
      scrollVelocity.set(velocity);
    });

    // Cleanup
    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, [options, scrollY, scrollYProgress, scrollVelocity]);

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      scrollToOptions?: {
        offset?: number;
        duration?: number;
        easing?: (t: number) => number;
        immediate?: boolean;
      }
    ) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, scrollToOptions);
        return;
      }

      // Fallback for when Lenis is not available
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  const contextValue: SmoothScrollContextType = {
    scrollY,
    scrollYProgress,
    scrollVelocity: smoothVelocity,
    scrollTo,
  };

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

// Custom hook to access smooth scroll context
export function useSmoothScroll(): SmoothScrollContextType {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error(
      'useSmoothScroll must be used within a SmoothScrollProvider'
    );
  }

  return context;
}

// Additional utility hook for Lenis scrollTo
export function useScrollTo() {
  return useSmoothScroll().scrollTo;
}

export default SmoothScrollProvider;
