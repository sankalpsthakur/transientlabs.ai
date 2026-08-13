'use client';

import { Line } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import type { Group } from 'three';
import {
  CHAR,
  CRM_STAGES,
  GOLD,
  INK,
  MRP_NODES,
  PAPER,
  PAPER_DEEP,
  PAPER_WARM,
  STEEL,
  STRATA,
  SYSTEMS,
  selectionKey,
} from './model';
import { ChipLabel, HitGroup, PaperBox } from './primitives';
import type { WorkflowApi } from './types';

export function CommercialDesk({ api }: { api: WorkflowApi; reduced: boolean }) {
  const chips = useRef<Group>(null);
  const selected = selectionKey(api.selection);

  // The chip cluster used to spin forever. A stack of systems is not a carousel;
  // it now sits at a fixed three-quarter angle so labels stay readable.

  const crmLine = useMemo(() => {
    return CRM_STAGES.map((_, i) => new Vector3(-1.2 + i * 0.6, 0.02, 1.42));
  }, []);

  const mrpLine = useMemo(() => {
    return MRP_NODES.map((_, i) => new Vector3(-2.15, 0.02, -0.85 + i * 0.42));
  }, []);

  return (
    <group>
      {/* Authority does not orbit — MAP / RULES / ACTIONS / TRACE slab */}
      <group>
        {STRATA.map((stratum, i) => {
          const key = `stratum:${stratum.id}`;
          const on = selected === key;
          return (
            <HitGroup
              key={stratum.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'stratum', id: stratum.id })}
            >
              <group position={[0, 0.42 - i * 0.22, 0]}>
                <PaperBox
                  args={[1.55, 0.18, 0.72]}
                  color={i === 3 ? CHAR : PAPER}
                  edge={on ? GOLD : INK}
                  metalness={i === 3 ? 0.18 : 0.05}
                  emissive={on ? GOLD : '#000'}
                  emissiveIntensity={on ? 0.1 : 0}
                />
                <ChipLabel position={[0.95, 0, 0]} selected={on} accent={stratum.id === 'actions'}>
                  {stratum.label}
                </ChipLabel>
              </group>
            </HitGroup>
          );
        })}
        <ChipLabel position={[0, 0.78, 0]} accent>
          Control layer
        </ChipLabel>
      </group>

      {/* Existing systems stay — they may orbit */}
      <group ref={chips}>
        {SYSTEMS.map((sys, i) => {
          const a = (i / SYSTEMS.length) * Math.PI * 2 - Math.PI / 2;
          const r = 2.15;
          const key = `system:${sys.id}`;
          const on = selected === key;
          return (
            <HitGroup
              key={sys.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'system', id: sys.id })}
            >
              <group position={[Math.cos(a) * r, 0.28, Math.sin(a) * r]}>
                <PaperBox
                  args={[0.58, 0.16, 0.38]}
                  color={PAPER}
                  edge={on ? GOLD : STEEL}
                  emissive={on ? GOLD : '#000'}
                  emissiveIntensity={on ? 0.1 : 0}
                />
                <ChipLabel position={[0, 0.2, 0]} selected={on}>
                  {sys.label}
                </ChipLabel>
                <Line
                  points={[new Vector3(0, 0, 0), new Vector3(-Math.cos(a) * 0.85, 0.05, -Math.sin(a) * 0.85)]}
                  color={GOLD}
                  transparent
                  opacity={0.35}
                />
              </group>
            </HitGroup>
          );
        })}
      </group>

      {/* CRM pipeline */}
      <group>
        <Line points={crmLine} color={STEEL} transparent opacity={0.45} />
        {CRM_STAGES.map((stage, i) => {
          const key = `crm-stage:${stage.id}`;
          const on = selected === key;
          const deal = api.deals.find((d) => d.crmStage === stage.id);
          return (
            <HitGroup
              key={stage.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'crm-stage', id: stage.id })}
            >
              <group position={[-1.2 + i * 0.6, 0.12, 1.42]}>
                <mesh>
                  <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
                  <meshStandardMaterial
                    color={on || deal ? GOLD : PAPER_DEEP}
                    metalness={0.2}
                    roughness={0.4}
                  />
                </mesh>
                <ChipLabel position={[0, 0.22, 0]} selected={on}>
                  {stage.label}
                </ChipLabel>
              </group>
            </HitGroup>
          );
        })}
      </group>

      {/* MRP peg / shortage net */}
      <group>
        <Line points={mrpLine} color={STEEL} transparent opacity={0.4} />
        {MRP_NODES.map((node, i) => {
          const key = `mrp:${node.id}`;
          const on = selected === key;
          const hot = node.id === 'shortage' && api.deals.some((d) => d.shortage);
          return (
            <HitGroup
              key={node.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'mrp', id: node.id })}
            >
              <group position={[-2.15, 0.14, -0.85 + i * 0.42]}>
                <PaperBox
                  args={[0.42, 0.12, 0.28]}
                  color={hot ? PAPER_WARM : PAPER}
                  edge={on || hot ? GOLD : INK}
                />
                <ChipLabel position={[0, 0.2, 0]} selected={on} accent={hot}>
                  {node.label}
                </ChipLabel>
              </group>
            </HitGroup>
          );
        })}
      </group>

      {/* Deals */}
      {api.deals.map((deal, i) => {
        const key = `deal:${deal.id}`;
        const on = selected === key;
        const x = deal.channel === 'whatsapp-excel' ? 1.85 : 0.85;
        return (
          <HitGroup
            key={deal.id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'deal', id: deal.id })}
          >
            <group position={[x, 0.18 + i * 0.02, 0.85 - i * 0.18]}>
              <PaperBox
                args={[0.55, 0.07, 0.28]}
                color={PAPER}
                edge={on ? GOLD : deal.channel === 'whatsapp-excel' ? STEEL : GOLD}
              />
              {on && (
                <ChipLabel position={[0, 0.18, 0]} selected>
                  {deal.id} · {deal.quoteId}
                </ChipLabel>
              )}
            </group>
          </HitGroup>
        );
      })}

      {/* WhatsApp + Excel ghost */}
      <HitGroup
        selected={selected === 'ghost'}
        onSelect={() => api.select(api.selection?.kind === 'ghost' ? null : { kind: 'ghost' })}
      >
        <group position={[1.95, 0.22, 0.95]} rotation={[0.1, -0.45, 0.08]}>
          <PaperBox
            args={[0.85, 0.02, 0.62]}
            color={PAPER_WARM}
            edge={selected === 'ghost' ? GOLD : STEEL}
            opacity={0.72}
          />
          {[0.12, 0, -0.12].map((y) => (
            <mesh key={y} position={[0, 0.02, y]}>
              <boxGeometry args={[0.62, 0.004, 0.018]} />
              <meshStandardMaterial color={STEEL} transparent opacity={0.45} />
            </mesh>
          ))}
          <mesh position={[0, 0.03, 0]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[0.9, 0.008, 0.012]} />
            <meshStandardMaterial color={GOLD} />
          </mesh>
          <ChipLabel position={[0, 0.28, 0]} selected={selected === 'ghost'}>
            Excel · WhatsApp ghost
          </ChipLabel>
        </group>
      </HitGroup>
    </group>
  );
}
