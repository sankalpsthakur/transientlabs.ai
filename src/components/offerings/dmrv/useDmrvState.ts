'use client';

import { motionValue, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  nextAllowedStage,
  STAGE_ORDER,
  STAGES,
  stageIndexFromProgress,
} from './model';
import type { DmrvStageId, DmrvTier } from './types';

export interface DmrvState {
  tier: DmrvTier;
  setTier: (tier: DmrvTier) => void;
  stageIndex: number;
  stageId: DmrvStageId;
  maxReached: number;
  requestStage: (index: number) => boolean;
  canEnter: (index: number) => boolean;
  blockedMessage: string | null;
}

export function useDmrvState(progress?: MotionValue<number>): DmrvState {
  const [tier, setTier] = useState<DmrvTier>('mid');
  const initialIndex = progress ? stageIndexFromProgress(progress.get()) : 0;
  const [stageIndex, setStageIndex] = useState(initialIndex);
  const [maxReached, setMaxReached] = useState(initialIndex);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const overrideRef = useRef(false);
  const lastProgressRef = useRef<number | null>(null);

  const canEnter = useCallback(
    (index: number) => nextAllowedStage(maxReached, index) != null,
    [maxReached]
  );

  const requestStage = useCallback(
    (index: number) => {
      if (nextAllowedStage(maxReached, index) == null) {
        const nextOpen = STAGES[Math.min(5, maxReached + 1)];
        setBlockedMessage(
          `Cannot skip. Open ${nextOpen?.title ?? 'the next stage'} first — skipping is the most expensive mistake.`
        );
        return false;
      }
      setBlockedMessage(null);
      overrideRef.current = true;
      setStageIndex(index);
      setMaxReached((current) => Math.max(current, index));
      return true;
    },
    [maxReached]
  );

  const applyProgress = useCallback((value: number) => {
    const idx = stageIndexFromProgress(value);
    const prev = lastProgressRef.current;
    lastProgressRef.current = value;
    setMaxReached((current) => Math.max(current, idx));
    if (
      overrideRef.current &&
      prev != null &&
      Math.abs(value - prev) > 0.08
    ) {
      overrideRef.current = false;
    }
    if (!overrideRef.current) {
      setStageIndex(idx);
    }
  }, []);

  useMotionValueEvent(progress ?? IDLE_PROGRESS, 'change', (value) => {
    if (!progress) return;
    applyProgress(value);
  });

  useEffect(() => {
    if (!blockedMessage) return;
    const id = window.setTimeout(() => setBlockedMessage(null), 3200);
    return () => window.clearTimeout(id);
  }, [blockedMessage]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      if (event.key === '1') {
        event.preventDefault();
        setTier('low');
        return;
      }
      if (event.key === '2') {
        event.preventDefault();
        setTier('mid');
        return;
      }
      if (event.key === '3') {
        event.preventDefault();
        setTier('high');
        return;
      }
      if (event.key === 'ArrowRight' || event.key === ']') {
        event.preventDefault();
        requestStage(stageIndex + 1);
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === '[') {
        event.preventDefault();
        requestStage(stageIndex - 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestStage, stageIndex]);

  const stageId = STAGE_ORDER[stageIndex] ?? 'design';

  return useMemo(
    () => ({
      tier,
      setTier,
      stageIndex,
      stageId,
      maxReached,
      requestStage,
      canEnter,
      blockedMessage,
    }),
    [
      tier,
      stageIndex,
      stageId,
      maxReached,
      requestStage,
      canEnter,
      blockedMessage,
    ]
  );
}

/** Framer requires a MotionValue when the hook is called unconditionally. */
const IDLE_PROGRESS = motionValue(0);


