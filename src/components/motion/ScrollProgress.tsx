'use client';

import { useEffect, useState } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Global scroll progress indicator (top bar)
export function ScrollProgressBar({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const [p, setP] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => scrollYProgress.on('change', (v) => setP(v)), [scrollYProgress]);

  if (prefersReducedMotion) return null;

  return (
    <div
      data-testid="scroll-progress-bar"
      style={{ ['--progress' as any]: p }}
      className={cn(
        'fixed left-0 top-0 h-[2px] w-full origin-left',
        'bg-[linear-gradient(to_right,var(--color-accent)_calc(var(--progress)*100%),transparent_calc(var(--progress)*100%))]',
        className,
      )}
    />
  );
}

// Section indicators (right edge dots)
interface SectionIndicatorProps {
  sections: string[];
  className?: string;
}

export function SectionIndicators({ sections, className }: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId, index) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '-20% 0px -40% 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, prefersReducedMotion]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  if (prefersReducedMotion) return null;

  return (
    <div
      className={cn(
        'fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3',
        className
      )}
    >
      {sections.map((section, index) => (
        <button
          key={section}
          onClick={() => scrollToSection(index)}
          className="group relative p-2"
          aria-label={`Scroll to ${section}`}
        >
          {/* The active dot used to scale to 1.5x. Colour carries the state now;
              geometry stays put so the rail does not twitch as you scroll. */}
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors duration-150 ease-out',
              activeSection === index
                ? 'bg-ink'
                : 'bg-ink/20 group-hover:bg-ink/40'
            )}
          />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-ink text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}

// Smooth scroll to section hook
export function useSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return scrollTo;
}
