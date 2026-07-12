'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface StackGsapContextValue {
  lenis: Lenis | null;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

const StackGsapContext = createContext<StackGsapContextValue>({
  lenis: null,
  gsap,
  ScrollTrigger,
});

export function useStackGsap() {
  return useContext(StackGsapContext);
}

interface StackGsapProviderProps {
  children: ReactNode;
  /** Disable Lenis (e.g. reduced motion) */
  smooth?: boolean;
}

/**
 * Lenis + GSAP ScrollTrigger bridge for Physical Stack.
 * Keeps scrubbed timelines in sync with smooth scroll.
 */
export function StackGsapProvider({
  children,
  smooth = true,
}: StackGsapProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const enableSmooth = smooth && !prefersReduced;

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (enableSmooth) {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(ticker);
        lenis?.destroy();
        lenisRef.current = null;
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    // Native scroll still drives ScrollTrigger
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [smooth]);

  return (
    <StackGsapContext.Provider
      value={{
        lenis: lenisRef.current,
        gsap,
        ScrollTrigger,
      }}
    >
      {children}
    </StackGsapContext.Provider>
  );
}
