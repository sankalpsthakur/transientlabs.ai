'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  FirmInteraction,
  FirmPortal,
  FirmPriorId,
  FirmStratum,
  FirmSystem,
} from './types';

export function useFirmInteraction(
  initialPortal: FirmPortal | null = null,
  onPortal?: (id: FirmPortal | null) => void
): FirmInteraction {
  const [portal, setPortal] = useState<FirmPortal | null>(initialPortal);
  const [stratum, setStratum] = useState<FirmStratum | null>(null);
  const [system, setSystem] = useState<FirmSystem | null>(null);
  const [prior, setPrior] = useState<FirmPriorId | null>(null);
  const [markArmed, setMarkArmed] = useState(false);

  const selectPortal = useCallback(
    (id: FirmPortal | null) => {
      setPortal((cur) => {
        const next = cur === id ? null : id;
        onPortal?.(next);
        return next;
      });
    },
    [onPortal]
  );

  const selectStratum = useCallback((id: FirmStratum | null) => {
    setStratum((cur) => (id !== null && cur === id ? null : id));
  }, []);

  const selectSystem = useCallback((id: FirmSystem | null) => {
    setSystem((cur) => (id !== null && cur === id ? null : id));
  }, []);

  const selectPrior = useCallback((id: FirmPriorId | null) => {
    setPrior((cur) => (id !== null && cur === id ? null : id));
  }, []);

  const armMark = useCallback((armed?: boolean) => {
    setMarkArmed((cur) => (armed === undefined ? !cur : armed));
  }, []);

  const reset = useCallback(() => {
    setPortal(null);
    setStratum(null);
    setSystem(null);
    setPrior(null);
    setMarkArmed(false);
    onPortal?.(null);
  }, [onPortal]);

  return useMemo(
    () => ({
      portal,
      stratum,
      system,
      prior,
      markArmed,
      selectPortal,
      selectStratum,
      selectSystem,
      selectPrior,
      armMark,
      reset,
    }),
    [
      portal,
      stratum,
      system,
      prior,
      markArmed,
      selectPortal,
      selectStratum,
      selectSystem,
      selectPrior,
      armMark,
      reset,
    ]
  );
}
