'use client';

import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, Object3D, Vector3 } from 'three';
import type { Group, InstancedMesh } from 'three';
import {
  CHAR,
  FINANCE_WORKFLOWS,
  GOLD,
  INK,
  LEDGER,
  MATCH_TIERS,
  PAPER,
  PAPER_WARM,
  STEEL,
  selectionKey,
} from './model';
import { ChipLabel, GoldArch, HitGroup, PaperBox } from './primitives';
import type { FinanceMatch, WorkflowApi } from './types';

function ringPoints(radius: number, count = 64) {
  const pts: Vector3[] = [];
  for (let i = 0; i <= count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts.push(new Vector3(Math.cos(a) * radius, 0.02, Math.sin(a) * radius));
  }
  return pts;
}

function tokenColor(match: FinanceMatch, gold: Color, ledger: Color, ink: Color) {
  if (match.status === 'broken') return ink;
  if (match.status === 'posted') return gold;
  if (match.tier === 'T4') return ink;
  return ledger;
}

export function FinanceOrrery({ api, reduced }: { api: WorkflowApi; reduced: boolean }) {
  const work = useRef<Group>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const gold = useMemo(() => new Color(GOLD), []);
  const ledger = useMemo(() => new Color(LEDGER), []);
  const ink = useMemo(() => new Color(INK), []);
  const inst = useRef<InstancedMesh>(null);

  const orbiters = useMemo(
    () => api.matches.filter((m) => m.status !== 'broken'),
    [api.matches]
  );
  const breaks = useMemo(
    () => api.matches.filter((m) => m.status === 'broken'),
    [api.matches]
  );

  const rings = useMemo(
    () => MATCH_TIERS.map((t) => ({ ...t, pts: ringPoints(t.radius) })),
    []
  );

  useLayoutEffect(() => {
    const mesh = inst.current;
    if (!mesh) return;
    orbiters.forEach((m, i) => {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tokenColor(m, gold, ledger, ink));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy, gold, ink, ledger, orbiters]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    if (work.current && !reduced) {
      work.current.rotation.y = t * 0.16;
    }
    const mesh = inst.current;
    if (!mesh) return;
    orbiters.forEach((m, i) => {
      const spec = MATCH_TIERS.find((x) => x.id === m.tier) ?? MATCH_TIERS[0]!;
      const speed = m.tier === 'T1' ? 0.55 : m.tier === 'T2' ? 0.38 : m.tier === 'T3' ? 0.24 : 0.12;
      const a = t * speed + i * 0.7;
      dummy.position.set(Math.cos(a) * spec.radius, 0.08, Math.sin(a) * spec.radius);
      dummy.scale.setScalar(m.status === 'posted' ? 1.15 : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tokenColor(m, gold, ledger, ink));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  const selected = selectionKey(api.selection);

  return (
    <group>
      {/* Authority stays still — ERP slab + GL gate */}
      <group>
        <HitGroup
          selected={selected === 'gl'}
          onSelect={() => api.select(api.selection?.kind === 'gl' ? null : { kind: 'gl' })}
        >
          <group position={[0, 0.02, 0.42]}>
            <PaperBox args={[1.15, 0.22, 0.72]} color={PAPER} edge={selected === 'gl' ? GOLD : INK} />
            <group position={[0, 0.22, 0.42]} rotation={[0, 0, 0]} scale={0.55}>
              <GoldArch selected={selected === 'gl'} width={0.9} height={0.7} />
            </group>
            <ChipLabel position={[0, 0.62, 0.2]} accent selected={selected === 'gl'}>
              GL gate · still
            </ChipLabel>
          </group>
        </HitGroup>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.82, 0.16, 0.55]} />
          <meshStandardMaterial color={PAPER_WARM} roughness={0.5} metalness={0.06} />
        </mesh>
        <ChipLabel position={[0, 0.38, -0.05]}>ERP stays</ChipLabel>
      </group>

      {/* Work may orbit */}
      <group ref={work}>
        {rings.map((ring) => {
          const key = `tier:${ring.id}`;
          const on = selected === key;
          return (
            <HitGroup
              key={ring.id}
              selected={on}
              onSelect={() => api.select(on ? null : { kind: 'tier', id: ring.id })}
            >
              <Line
                points={ring.pts}
                color={on ? GOLD : ring.id === 'T4' ? INK : LEDGER}
                lineWidth={on ? 1.6 : 1}
                transparent
                opacity={on ? 0.85 : 0.42}
              />
              <ChipLabel
                position={[0, 0.12, ring.radius]}
                accent={ring.id === 'T4'}
                selected={on}
              >
                {ring.id} · {ring.title}
              </ChipLabel>
            </HitGroup>
          );
        })}

        <instancedMesh ref={inst} args={[undefined, undefined, Math.max(orbiters.length, 1)]}>
          <boxGeometry args={[0.09, 0.05, 0.06]} />
          <meshStandardMaterial color={LEDGER} roughness={0.4} metalness={0.12} />
        </instancedMesh>
      </group>

      {/* Clickable orbiters (invisible larger hits, world-space at rest pose) */}
      {orbiters.map((m, i) => {
        const spec = MATCH_TIERS.find((x) => x.id === m.tier) ?? MATCH_TIERS[0]!;
        const a = i * 0.7;
        const key = `match:${m.id}`;
        const on = selected === key;
        return (
          <HitGroup
            key={m.id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'match', id: m.id })}
          >
            <mesh position={[Math.cos(a) * spec.radius, 0.16, Math.sin(a) * spec.radius]} visible={on}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.2} />
            </mesh>
            {on && (
              <ChipLabel
                position={[Math.cos(a) * spec.radius, 0.32, Math.sin(a) * spec.radius]}
                selected
              >
                {m.id} · {m.amount}
              </ChipLabel>
            )}
          </HitGroup>
        );
      })}

      {/* Four workflows — compass, not spinning with work */}
      {FINANCE_WORKFLOWS.map((wf) => {
        const r = 2.15;
        const x = Math.cos(wf.angle) * r;
        const z = Math.sin(wf.angle) * r;
        const key = `workflow:${wf.id}`;
        const on = selected === key;
        return (
          <HitGroup
            key={wf.id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'workflow', id: wf.id })}
          >
            <group position={[x, 0.28, z]}>
              <PaperBox
                args={[0.72, 0.16, 0.48]}
                color={PAPER}
                edge={on ? GOLD : LEDGER}
                emissive={on ? GOLD : '#000'}
                emissiveIntensity={on ? 0.08 : 0}
              />
              <ChipLabel position={[0, 0.22, 0]} selected={on}>
                {wf.title}
              </ChipLabel>
            </group>
          </HitGroup>
        );
      })}

      {/* Breaks leave the ecliptic and hang on an aging filament */}
      {breaks.map((m, i) => {
        const spec = MATCH_TIERS.find((x) => x.id === m.tier) ?? MATCH_TIERS[2]!;
        const a = 0.55 + i * 0.7;
        const x = Math.cos(a) * spec.radius * 0.72;
        const z = Math.sin(a) * spec.radius * 0.72;
        const y = 0.72 + m.agingDays * 0.12;
        const key = `break:${m.id}`;
        const on = selected === key;
        return (
          <HitGroup
            key={m.id}
            selected={on}
            onSelect={() => api.select(on ? null : { kind: 'break', id: m.id })}
          >
            <group>
              <Line
                points={[new Vector3(x, 0.04, z), new Vector3(x, y, z)]}
                color={on ? GOLD : STEEL}
                lineWidth={1}
                transparent
                opacity={0.55}
              />
              <mesh position={[x, y, z]}>
                <boxGeometry args={[0.16, 0.07, 0.1]} />
                <meshStandardMaterial
                  color={PAPER}
                  emissive={on ? GOLD : CHAR}
                  emissiveIntensity={on ? 0.18 : 0.04}
                />
              </mesh>
              <ChipLabel position={[x, y + 0.16, z]} selected={on}>
                {m.id} · {m.agingDays}d
              </ChipLabel>
            </group>
          </HitGroup>
        );
      })}

      {/* Evidence folio — readable after a human transit */}
      <HitGroup
        selected={selected === 'evidence'}
        onSelect={() => api.select(api.selection?.kind === 'evidence' ? null : { kind: 'evidence' })}
      >
        <group position={[1.55, 0.08, 0.05]} rotation={[0, -0.4, 0]}>
          <PaperBox
            args={[0.72, 0.04, 0.5]}
            color={PAPER}
            edge={selected === 'evidence' ? GOLD : INK}
          />
          <mesh position={[0, 0.04, 0]} rotation={[-0.08, 0.1, 0.04]}>
            <boxGeometry args={[0.68, 0.02, 0.46]} />
            <meshStandardMaterial color={PAPER_WARM} roughness={0.55} />
          </mesh>
          {['SRC', 'TIER', 'OWN', 'TIME', 'CRIT'].map((field, i) => (
            <mesh key={field} position={[-0.22 + i * 0.11, 0.07, 0.08]}>
              <boxGeometry args={[0.08, 0.012, 0.18]} />
              <meshStandardMaterial color={i === 2 ? GOLD : STEEL} />
            </mesh>
          ))}
          <ChipLabel position={[0, 0.28, 0]} selected={selected === 'evidence'}>
            Evidence pack
          </ChipLabel>
        </group>
      </HitGroup>
    </group>
  );
}
