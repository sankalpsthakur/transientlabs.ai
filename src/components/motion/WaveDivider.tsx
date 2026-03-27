'use client';

import { useReducedMotion } from 'framer-motion';

type WaveDividerVariant = 'default' | 'accent' | 'subtle';

interface WaveDividerProps {
  variant?: WaveDividerVariant;
  className?: string;
}

const variantColors: Record<WaveDividerVariant, string> = {
  accent: '#0066ff',
  subtle: '#d4d4d4',
  default: '#0a0a0a',
};

export function WaveDivider({ variant = 'default', className = '' }: WaveDividerProps) {
  const prefersReducedMotion = useReducedMotion();
  const color = variantColors[variant];

  if (prefersReducedMotion) {
    return (
      <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
        <svg viewBox="0 0 1200 24" className="w-full h-6" preserveAspectRatio="none">
          <line x1="0" y1="12" x2="1200" y2="12" stroke={color} strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
    );
  }

  // Sine wave path
  const wavePath =
    'M0,12 C50,4 100,20 150,12 C200,4 250,20 300,12 C350,4 400,20 450,12 C500,4 550,20 600,12 C650,4 700,20 750,12 C800,4 850,20 900,12 C950,4 1000,20 1050,12 C1100,4 1150,20 1200,12';

  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 24" className="w-full h-6" preserveAspectRatio="none">
        {/* Wave path with dashed stroke animation */}
        <path
          d={wavePath}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="8 6"
          className="noodle-dash"
        />

        {/* Traveling particle 1 */}
        <circle r="2" fill={color} opacity="0.6">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path={wavePath}
            keySplines="0.22 1 0.36 1"
            keyTimes="0;1"
            calcMode="spline"
          />
        </circle>

        {/* Traveling particle 2 (offset) */}
        <circle r="1.5" fill={color} opacity="0.4">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            begin="-2s"
            path={wavePath}
            keySplines="0.22 1 0.36 1"
            keyTimes="0;1"
            calcMode="spline"
          />
        </circle>
      </svg>
    </div>
  );
}
