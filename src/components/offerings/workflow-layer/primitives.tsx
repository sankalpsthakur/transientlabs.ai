'use client';

import { Edges, Html } from '@react-three/drei';
import { useState, type ReactNode } from 'react';
import { BORDER, GOLD, INK, PAPER, PAPER_WARM } from './model';

export function HitGroup({
  onSelect,
  selected,
  children,
  disabled = false,
}: {
  onSelect: () => void;
  selected?: boolean;
  children: ReactNode;
  disabled?: boolean;
}) {
  const [hot, setHot] = useState(false);
  return (
    <group
      onClick={(event) => {
        if (disabled) return;
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={(event) => {
        if (disabled) return;
        event.stopPropagation();
        setHot(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHot(false);
        document.body.style.cursor = '';
      }}
    >
      <group scale={hot || selected ? 1.035 : 1}>{children}</group>
    </group>
  );
}

export function PaperBox({
  args,
  color = PAPER,
  edge = INK,
  roughness = 0.52,
  metalness = 0.06,
  emissive = '#000000',
  emissiveIntensity = 0,
  opacity = 1,
}: {
  args: [number, number, number];
  color?: string;
  edge?: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
}) {
  return (
    <mesh castShadow={false} receiveShadow={false}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={opacity < 0.99}
        opacity={opacity}
      />
      <Edges threshold={18} color={edge} />
    </mesh>
  );
}

export function ChipLabel({
  children,
  accent = false,
  selected = false,
  position,
}: {
  children: ReactNode;
  accent?: boolean;
  selected?: boolean;
  position: [number, number, number];
}) {
  return (
    <Html position={position} center zIndexRange={[12, 0]} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
          border: `1px solid ${selected ? GOLD : accent ? `${GOLD}99` : BORDER}`,
          background: selected ? 'rgba(196,161,90,0.18)' : 'rgba(248,242,233,0.9)',
          color: selected || accent ? GOLD : INK,
          fontWeight: selected || accent ? 600 : 500,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          boxShadow: '0 8px 18px -14px rgba(24,18,13,0.55)',
        }}
      >
        {children}
      </div>
    </Html>
  );
}

export function GoldArch({
  width = 0.72,
  height = 0.85,
  thick = 0.055,
  selected = false,
}: {
  width?: number;
  height?: number;
  thick?: number;
  selected?: boolean;
}) {
  const emis = selected ? 0.22 : 0.08;
  return (
    <group>
      <mesh position={[-width / 2, height / 2 - 0.06, 0]}>
        <boxGeometry args={[thick, height, thick]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.58}
          roughness={0.32}
          emissive={GOLD}
          emissiveIntensity={emis}
        />
        <Edges color={INK} threshold={20} />
      </mesh>
      <mesh position={[width / 2, height / 2 - 0.06, 0]}>
        <boxGeometry args={[thick, height, thick]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.58}
          roughness={0.32}
          emissive={GOLD}
          emissiveIntensity={emis}
        />
        <Edges color={INK} threshold={20} />
      </mesh>
      <mesh position={[0, height - 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[width / 2, thick * 0.72, 10, 20, Math.PI]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.62}
          roughness={0.28}
          emissive={GOLD}
          emissiveIntensity={emis}
        />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[width + 0.18, 0.04, 0.22]} />
        <meshStandardMaterial color={PAPER_WARM} roughness={0.6} metalness={0.04} />
        <Edges color={INK} />
      </mesh>
    </group>
  );
}

export function CartridgeMesh({
  phaseTint,
  selected,
}: {
  phaseTint: string;
  selected?: boolean;
}) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.28, 0.07, 0.16]} />
        <meshStandardMaterial
          color={PAPER}
          roughness={0.48}
          metalness={0.05}
          emissive={phaseTint}
          emissiveIntensity={selected ? 0.18 : 0.05}
        />
        <Edges color={phaseTint} threshold={15} />
      </mesh>
      <mesh position={[0.1, 0.045, 0]}>
        <boxGeometry args={[0.06, 0.012, 0.12]} />
        <meshStandardMaterial color={phaseTint} roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function PaperGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color={PAPER} roughness={0.94} metalness={0} />
      </mesh>
      {[-6, -3, 0, 3, 6].map((x) => (
        <mesh key={`gx-${x}`} position={[x, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 14]} />
          <meshStandardMaterial color={BORDER} roughness={1} />
        </mesh>
      ))}
      {[-4, -2, 0, 2, 4].map((z) => (
        <mesh key={`gz-${z}`} position={[0, -0.07, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 0.012]} />
          <meshStandardMaterial color={BORDER} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
