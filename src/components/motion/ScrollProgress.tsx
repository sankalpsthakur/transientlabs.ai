'use client';

import { useEffect, useState } from 'react';
import { m, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Global scroll progress indicator (top bar)
export function ScrollProgressBar({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <m.div
      className={cn(
        'fixed top-0 left-0 right-0 h-0.5 bg-ink origin-left z-50',
        className
      )}
      style={{ scaleX }}
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
          <m.div
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-300',
              activeSection === index
                ? 'bg-ink'
                : 'bg-gray-300 group-hover:bg-gray-400'
            )}
            animate={{
              scale: activeSection === index ? 1.5 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
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
