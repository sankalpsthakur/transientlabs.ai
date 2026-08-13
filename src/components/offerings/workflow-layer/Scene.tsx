'use client';

import { ContactShadows } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { PerspectiveCamera } from 'three';
import { CommercialDesk } from './CommercialDesk';
import { FinanceOrrery } from './FinanceOrrery';
import {
  COMMERCIAL_CAM,
  COMMERCIAL_LOOKUPS,
  FINANCE_CAM,
  FINANCE_LOOKUPS,
  PRODUCTION_CAM,
  PRODUCTION_LOOKUPS,
  lerp,
  mixCam,
  sampleCamera,
} from './math';
import { GOLD, PAPER_WARM } from './model';
import { PaperGround } from './primitives';
import { ProductionFloor } from './ProductionFloor';
import type { WorkflowApi } from './types';

export interface SceneProps {
  api: WorkflowApi;
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function lookupFor(api: WorkflowApi) {
  const sel = api.selection;
  if (!sel) return null;
  if (api.lane === 'production') {
    if (sel.kind === 'gate') return PRODUCTION_LOOKUPS.gate;
    if (sel.kind === 'sis') return PRODUCTION_LOOKUPS.sis;
    if (sel.kind === 'mes') return PRODUCTION_LOOKUPS.mes;
    if (sel.kind === 'qa') return PRODUCTION_LOOKUPS.qa;
    if (sel.kind === 'bay' || sel.kind === 'torus') return PRODUCTION_LOOKUPS[sel.id];
    if (sel.kind === 'exception') return PRODUCTION_LOOKUPS.sis;
  }
  if (api.lane === 'finance') {
    if (sel.kind === 'gl') return FINANCE_LOOKUPS.gl;
    if (sel.kind === 'evidence') return FINANCE_LOOKUPS.evidence;
    if (sel.kind === 'tier') return FINANCE_LOOKUPS[sel.id];
    if (sel.kind === 'break') return FINANCE_LOOKUPS.evidence;
  }
  if (api.lane === 'commercial') {
    if (sel.kind === 'stratum') return COMMERCIAL_LOOKUPS[sel.id];
    if (sel.kind === 'ghost' || sel.kind === 'deal') return COMMERCIAL_LOOKUPS.ghost;
  }
  return null;
}

function keysFor(lane: WorkflowApi['lane']) {
  if (lane === 'finance') return FINANCE_CAM;
  if (lane === 'commercial') return COMMERCIAL_CAM;
  return PRODUCTION_CAM;
}

export function Scene({ api, progress, accent = GOLD, reduced = false }: SceneProps) {
  const { camera } = useThree();
  const look = useRef({ x: 0.1, y: 0.3, z: 0 });

  useFrame(() => {
    const cam = camera as PerspectiveCamera;
    const p = api.depth || progress.get();
    const base = sampleCamera(keysFor(api.lane), p);
    const focus = lookupFor(api);
    const target = focus ? mixCam(base, focus, 0.62) : base;

    if (reduced) {
      cam.position.set(target.pos[0], target.pos[1], target.pos[2]);
      cam.lookAt(target.look[0], target.look[1], target.look[2]);
      if (Math.abs(cam.fov - target.fov) > 0.05) {
        cam.fov = target.fov;
        cam.updateProjectionMatrix();
      }
      return;
    }

    cam.position.x = lerp(cam.position.x, target.pos[0], 0.12);
    cam.position.y = lerp(cam.position.y, target.pos[1], 0.12);
    cam.position.z = lerp(cam.position.z, target.pos[2], 0.12);
    look.current.x = lerp(look.current.x, target.look[0], 0.12);
    look.current.y = lerp(look.current.y, target.look[1], 0.12);
    look.current.z = lerp(look.current.z, target.look[2], 0.12);
    cam.lookAt(look.current.x, look.current.y, look.current.z);
    if (Math.abs(cam.fov - target.fov) > 0.05) {
      cam.fov = target.fov;
      cam.updateProjectionMatrix();
    }
  });

  return (
    <>
      <hemisphereLight args={[PAPER_WARM, '#d7c6b0', 0.55]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[6.2, 8.2, 4.2]} intensity={0.58} color="#fff6ea" />
      <directionalLight position={[-4.2, 3.1, -2.4]} intensity={0.2} color={accent} />

      <PaperGround />

      {api.lane === 'production' && <ProductionFloor api={api} reduced={reduced} />}
      {api.lane === 'finance' && <FinanceOrrery api={api} reduced={reduced} />}
      {api.lane === 'commercial' && <CommercialDesk api={api} reduced={reduced} />}

      <ContactShadows
        position={[0, -0.07, 0]}
        opacity={0.18}
        scale={16}
        blur={2.6}
        far={6}
        color="#18120D"
      />
    </>
  );
}
