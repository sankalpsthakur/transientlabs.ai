'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import {
  BAYS,
  CHAR,
  GOLD,
  INK,
  PAPER,
  PAPER_DEEP,
  PAPER_WARM,
  SIS_OXIDE,
  STEEL,
  STEEL_DARK,
  exceptionOrders,
  phaseTint,
  selectionKey,
} from './model';
import { CartridgeMesh, ChipLabel, GoldArch, HitGroup, PaperBox } from './primitives';
import type { WorkflowApi } from './types';

function phaseAlong(phase: string): number {
  switch (phase) {
    case 'proposed':
      return 0;
    case 'screened':
      return 0.12;
    case 'pending':
      return 0.28;
    case 'approved':
      return 0.42;
    case 'armed':
      return 0.58;
    case 'executing':
      return 0.78;
    case 'verified':
      return 1;
    default:
      return 0.08;
  }
}

export function ProductionFloor({ api }: { api: WorkflowApi; reduced: boolean }) {
  const root = useRef<Group>(null);
  const stamp = useRef<Group>(null);
  const torus = useRef<Group>(null);

  const path = useMemo(
    () =>
      [
        [-1.55, 0.22, -0.15],
        [-0.95, 0.22, -0.02],
        [-0.38, 0.34, 0.02],
        [0.42, 0.28, -0.35],
        [1.85, 0.26, 0.58],
        [3.55, 0.26, 0.15],
      ] as [number, number, number][],
    []
  );

  useFrame(() => {
    // Idle sway and the perpetual utilisation-torus spin are gone. The only motion
    // left is the QA stamp dipping when QA is actually selected — state, not decor.
    if (stamp.current) {
      const punching = api.selection?.kind === 'qa';
      stamp.current.position.y = 0.62 - (punching ? 0.05 : 0);
    }
  });

  const selected = selectionKey(api.selection);
  const exceptions = exceptionOrders(api.orders);

  return (
    <group ref={root}>
      {/* ISA-95 ziggurat: L2 ghost · L3 live terrace · L4 ERP ghost */}
      <group position={[0.6, 0, 0.1]}>
        <group position={[0, -0.28, 0]}>
          <PaperBox args={[8.6, 0.1, 4.6]} color={STEEL_DARK} edge={INK} opacity={0.28} />
          <ChipLabel position={[-3.6, 0.18, 1.8]}>L2 · SCADA ghost</ChipLabel>
        </group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.2, 0.14, 4.2]} />
          <meshStandardMaterial color={PAPER_WARM} roughness={0.62} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.072, 0]}>
          <boxGeometry args={[8.05, 0.008, 4.05]} />
          <meshStandardMaterial color={PAPER} roughness={0.7} />
        </mesh>
        <group position={[-0.2, 1.82, -0.2]}>
          <PaperBox args={[1.85, 0.18, 1.15]} color={PAPER} edge={STEEL} opacity={0.55} />
          <ChipLabel position={[0, 0.22, 0]}>L4 · ERP stays</ChipLabel>
        </group>
      </group>

      <ChipLabel position={[-2.4, 0.28, 1.7]} accent>
        ISA-95 L3 floor
      </ChipLabel>

      {/* Magazine */}
      <group position={[-1.7, 0.16, -0.15]}>
        <PaperBox args={[0.55, 0.18, 0.42]} color={PAPER_DEEP} />
        {api.orders
          .filter((o) => o.phase === 'proposed' || o.phase === 'screened')
          .slice(0, 3)
          .map((o, i) => (
            <mesh key={o.id} position={[0, 0.14 + i * 0.08, 0]}>
              <boxGeometry args={[0.42, 0.05, 0.22]} />
              <meshStandardMaterial color={PAPER} emissive={phaseTint(o.phase)} emissiveIntensity={0.04} />
            </mesh>
          ))}
        <ChipLabel position={[0, 0.42, 0.05]}>Magazine</ChipLabel>
      </group>

      {/* Gold SOP gate */}
      <HitGroup
        selected={selected === 'gate'}
        onSelect={() => api.select(api.selection?.kind === 'gate' ? null : { kind: 'gate' })}
      >
        <group position={[-0.38, 0.14, 0.02]}>
          <GoldArch selected={selected === 'gate'} />
          <ChipLabel position={[0, 1.02, 0]} accent selected={selected === 'gate'}>
            Gold SOP gate
          </ChipLabel>
        </group>
      </HitGroup>

      {/* MES order of record */}
      <HitGroup
        selected={selected === 'mes'}
        onSelect={() => api.select(api.selection?.kind === 'mes' ? null : { kind: 'mes' })}
      >
        <group position={[0.48, 0.38, -0.62]}>
          <PaperBox
            args={[0.55, 0.72, 0.32]}
            color={STEEL_DARK}
            edge={selected === 'mes' ? GOLD : INK}
            metalness={0.28}
          />
          {[0.18, 0, -0.18].map((y) => (
            <mesh key={y} position={[0.28, y, 0]}>
              <boxGeometry args={[0.02, 0.08, 0.22]} />
              <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.15} />
            </mesh>
          ))}
          <ChipLabel position={[0, 0.5, 0.2]} selected={selected === 'mes'}>
            MES · order of record
          </ChipLabel>
        </group>
      </HitGroup>

      {/* Machine bays */}
      {BAYS.map((bay) => {
        const key = `bay:${bay.id}`;
        const on = selected === key || selected === `torus:${bay.id}`;
        return (
          <HitGroup
            key={bay.id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'bay', id: bay.id })}
          >
            <group position={bay.position}>
              <PaperBox
                args={bay.kind === 'continuous' ? [0.58, 0.38, 0.48] : [0.5, 0.32, 0.42]}
                color={PAPER_DEEP}
                edge={on ? GOLD : INK}
              />
              <mesh position={[0, 0.24, 0]}>
                <boxGeometry args={[0.22, 0.1, 0.22]} />
                <meshStandardMaterial
                  color={on ? GOLD : STEEL}
                  metalness={0.35}
                  roughness={0.4}
                  emissive={on ? GOLD : '#000'}
                  emissiveIntensity={on ? 0.12 : 0}
                />
              </mesh>
              <ChipLabel position={[0, 0.48, 0]} selected={on}>
                {bay.label}
              </ChipLabel>
            </group>
          </HitGroup>
        );
      })}

      {/* Utilisation torus */}
      <group ref={torus} position={[2.2, 1.28, 0.55]}>
        {BAYS.map((bay, i) => {
          const start = (i / 4) * Math.PI * 2;
          const key = `torus:${bay.id}`;
          const on = selected === key || selected === `bay:${bay.id}`;
          return (
            <HitGroup
              key={bay.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'torus', id: bay.id })}
            >
              <mesh rotation={[Math.PI / 2, 0, start]}>
                <torusGeometry args={[0.62, 0.035, 8, 16, (Math.PI * 2 * bay.utilisation) / 4]} />
                <meshStandardMaterial
                  color={on ? GOLD : i % 2 === 0 ? STEEL : GOLD}
                  metalness={0.4}
                  roughness={0.35}
                  emissive={on ? GOLD : '#000'}
                  emissiveIntensity={on ? 0.16 : 0}
                />
              </mesh>
            </HitGroup>
          );
        })}
        <ChipLabel position={[0, 0.22, 0]} accent>
          Utilisation
        </ChipLabel>
      </group>

      {/* QA stamp */}
      <HitGroup
        selected={selected === 'qa'}
        onSelect={() => api.select(api.selection?.kind === 'qa' ? null : { kind: 'qa' })}
      >
        <group position={[1.55, 0.14, 1.18]}>
          <PaperBox args={[0.42, 0.1, 0.42]} color={PAPER_DEEP} />
          <group ref={stamp} position={[0, 0.62, 0]}>
            <PaperBox args={[0.16, 0.28, 0.16]} color={STEEL} metalness={0.4} />
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.06, 16]} />
              <meshStandardMaterial
                color={GOLD}
                metalness={0.55}
                roughness={0.3}
                emissive={GOLD}
                emissiveIntensity={selected === 'qa' ? 0.2 : 0.06}
              />
            </mesh>
          </group>
          <ChipLabel position={[0, 0.82, 0]} selected={selected === 'qa'}>
            QA stamp
          </ChipLabel>
        </group>
      </HitGroup>

      {/* Dispatch columns */}
      {(
        [
          ['ready', 0.45],
          ['hold', -0.05],
          ['ship', -0.55],
          ['exception', -1.05],
        ] as const
      ).map(([id, z]) => {
        const key = `dispatch:${id}`;
        const on = selected === key;
        const count = api.orders.filter((o) => o.dispatch === id).length;
        return (
          <HitGroup
            key={id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'dispatch', id })}
          >
            <group position={[3.62, 0.18, z]}>
              <PaperBox
                args={[0.28, 0.12 + count * 0.1, 0.32]}
                color={id === 'exception' ? '#E8D2C4' : PAPER}
                edge={on ? GOLD : INK}
              />
              <ChipLabel position={[0, 0.38 + count * 0.05, 0]} selected={on}>
                {id}
              </ChipLabel>
            </group>
          </HitGroup>
        );
      })}

      {/* Exception lane */}
      <group position={[-1.15, 0.1, -1.35]}>
        <PaperBox args={[3.4, 0.06, 0.55]} color="#E8D2C4" edge={SIS_OXIDE} />
        {exceptions.map((o, i) => {
          const key = `exception:${o.id}`;
          const on = selected === key;
          return (
            <HitGroup
              key={o.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'exception', id: o.id })}
            >
              <group position={[-1.1 + i * 0.7, 0.1, 0]}>
                <CartridgeMesh phaseTint={phaseTint(o.phase)} selected={on} />
              </group>
            </HitGroup>
          );
        })}
        <ChipLabel position={[0, 0.32, 0]}>Exception lane</ChipLabel>
      </group>

      {/* SIS — offset, no inbound write */}
      <HitGroup
        selected={selected === 'sis'}
        onSelect={() => api.select(api.selection?.kind === 'sis' ? null : { kind: 'sis' })}
      >
        <group position={[-2.65, 0.42, -1.15]}>
          <PaperBox
            args={[0.48, 0.72, 0.36]}
            color={CHAR}
            edge={selected === 'sis' ? SIS_OXIDE : INK}
            metalness={0.22}
          />
          <mesh position={[0.26, 0.12, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.2]} />
            <meshStandardMaterial color={SIS_OXIDE} emissive={SIS_OXIDE} emissiveIntensity={0.25} />
          </mesh>
          {/* dashed read-only mirror — no write line */}
          {[-0.2, 0, 0.2, 0.4].map((x) => (
            <mesh key={x} position={[0.42 + x, 0.22, 0.55]}>
              <boxGeometry args={[0.08, 0.012, 0.012]} />
              <meshStandardMaterial color={STEEL} />
            </mesh>
          ))}
          <ChipLabel position={[0, 0.52, 0.22]} selected={selected === 'sis'}>
            SIS · no write
          </ChipLabel>
        </group>
      </HitGroup>

      {/* Traveling cartridges */}
      {api.orders
        .filter((o) => o.phase !== 'rejected' && o.phase !== 'reverted')
        .map((o) => {
          const u = phaseAlong(o.phase);
          const i0 = Math.min(path.length - 2, Math.floor(u * (path.length - 1)));
          const i1 = i0 + 1;
          const f = u * (path.length - 1) - i0;
          const a = path[i0]!;
          const b = path[i1]!;
          const x = a[0] + (b[0] - a[0]) * f;
          const y = a[1] + (b[1] - a[1]) * f;
          const z = a[2] + (b[2] - a[2]) * f;
          const bay = BAYS.find((bay) => bay.id === o.bay);
          const atBay = o.phase === 'executing' || o.phase === 'armed';
          const px = atBay && bay ? bay.position[0] : x;
          const py = atBay && bay ? 0.52 : y;
          const pz = atBay && bay ? bay.position[2] : z;
          const key = `cartridge:${o.id}`;
          const on = selected === key;
          return (
            <HitGroup
              key={o.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'cartridge', id: o.id })}
            >
              <group position={[px, py, pz]}>
                <CartridgeMesh phaseTint={phaseTint(o.phase)} selected={on} />
                {on && (
                  <ChipLabel position={[0, 0.18, 0]} selected>
                    {o.id} · {o.phase}
                  </ChipLabel>
                )}
                {on && api.depth > 0.5 && (
                  <ChipLabel position={[0, -0.16, 0]}>
                    {o.sopVariant}
                    {o.armedBy ? ` · ${o.armedBy}` : ''}
                    {o.qaStamp ? ` · ${o.qaStamp}` : ''}
                  </ChipLabel>
                )}
              </group>
            </HitGroup>
          );
        })}
    </group>
  );
}
