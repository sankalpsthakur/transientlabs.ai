'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface IndustryRotatorProps {
  words: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  className?: string;
  cursorClassName?: string;
}

export function IndustryRotator({
  words,
  typeMs = 70,
  deleteMs = 40,
  holdMs = 1500,
  className = '',
  cursorClassName = 'inline-block w-[0.08em] h-[0.95em] -mb-[0.05em] ml-[0.06em] bg-current align-baseline',
}: IndustryRotatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [wordIdx, setWordIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing');

  useEffect(() => {
    if (prefersReducedMotion) return;
    const current = words[wordIdx];
    let next: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (charCount < current.length) {
        next = setTimeout(() => setCharCount((c) => c + 1), typeMs);
      } else {
        next = setTimeout(() => setPhase('hold'), 0);
      }
    } else if (phase === 'hold') {
      next = setTimeout(() => setPhase('deleting'), holdMs);
    } else {
      if (charCount > 0) {
        next = setTimeout(() => setCharCount((c) => c - 1), deleteMs);
      } else {
        next = setTimeout(() => {
          setPhase('typing');
          setWordIdx((i) => (i + 1) % words.length);
        }, 200);
      }
    }
    return () => clearTimeout(next);
  }, [charCount, phase, wordIdx, words, typeMs, deleteMs, holdMs, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span data-testid="industry-rotator" className={className}>
        {words.join(', ')}
      </span>
    );
  }

  const visible = words[wordIdx].slice(0, charCount);

  return (
    <span data-testid="industry-rotator" className={className} aria-live="polite">
      <span>{visible}</span>
      <span
        data-testid="industry-cursor"
        aria-hidden="true"
        className={cursorClassName}
        style={{ animation: 'industry-cursor-blink 1s steps(2) infinite' }}
      />
      <style jsx>{`
        @keyframes industry-cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
