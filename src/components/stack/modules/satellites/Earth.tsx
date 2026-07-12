'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

const EARTH_RADIUS = 1.35;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.8);
    float core = smoothstep(0.15, 0.85, fresnel);
    float alpha = core * uIntensity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/** Procedural continent mask — soft bands, not cartographic accuracy. */
function createEarthTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean base
  const ocean = ctx.createLinearGradient(0, 0, size, size);
  ocean.addColorStop(0, '#0a1628');
  ocean.addColorStop(0.45, '#0c1c34');
  ocean.addColorStop(1, '#081020');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, size, size);

  // Continent blobs — muted teal-blue landmasses
  const lands: Array<[number, number, number, number]> = [
    [0.18, 0.32, 0.14, 0.22],
    [0.42, 0.28, 0.12, 0.18],
    [0.58, 0.42, 0.16, 0.12],
    [0.72, 0.35, 0.1, 0.2],
    [0.28, 0.58, 0.18, 0.14],
    [0.55, 0.62, 0.14, 0.16],
    [0.78, 0.55, 0.12, 0.1],
    [0.12, 0.72, 0.1, 0.12],
    [0.88, 0.22, 0.08, 0.14],
  ];

  for (const [cx, cy, rx, ry] of lands) {
    const g = ctx.createRadialGradient(
      cx * size,
      cy * size,
      0,
      cx * size,
      cy * size,
      Math.max(rx, ry) * size
    );
    g.addColorStop(0, 'rgba(42, 78, 92, 0.95)');
    g.addColorStop(0.55, 'rgba(28, 58, 72, 0.75)');
    g.addColorStop(1, 'rgba(12, 28, 48, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx * size, cy * size, rx * size, ry * size, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar caps
  const poleN = ctx.createLinearGradient(0, 0, 0, size * 0.12);
  poleN.addColorStop(0, 'rgba(180, 200, 220, 0.35)');
  poleN.addColorStop(1, 'rgba(180, 200, 220, 0)');
  ctx.fillStyle = poleN;
  ctx.fillRect(0, 0, size, size * 0.12);

  const poleS = ctx.createLinearGradient(0, size, 0, size * 0.88);
  poleS.addColorStop(0, 'rgba(180, 200, 220, 0.3)');
  poleS.addColorStop(1, 'rgba(180, 200, 220, 0)');
  ctx.fillStyle = poleS;
  ctx.fillRect(0, size * 0.88, size, size * 0.12);

  // Subtle cloud streaks
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 18; i++) {
    const y = (i / 18) * size + Math.sin(i * 2.1) * 8;
    ctx.fillStyle = '#c8d8f0';
    ctx.fillRect(0, y, size, 2 + (i % 3));
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function createNightLightsTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Speckled city lights on night side
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.4 + Math.random() * 1.6;
    const a = 0.15 + Math.random() * 0.55;
    ctx.fillStyle = `rgba(255, 220, 160, ${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dense clusters
  const clusters = [
    [0.22, 0.38],
    [0.48, 0.32],
    [0.65, 0.45],
    [0.78, 0.36],
    [0.3, 0.62],
  ];
  for (const [cx, cy] of clusters) {
    for (let i = 0; i < 40; i++) {
      const x = (cx + (Math.random() - 0.5) * 0.08) * size;
      const y = (cy + (Math.random() - 0.5) * 0.06) * size;
      ctx.fillStyle = `rgba(255, 210, 140, ${0.3 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

interface EarthProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

export function Earth({ progress, accent = '#7EA2FF', reduced = false }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);
  const atmoMat = useRef<THREE.ShaderMaterial>(null);

  const dayMap = useMemo(() => createEarthTexture(512), []);
  const nightMap = useMemo(() => createNightLightsTexture(512), []);

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(accent).multiplyScalar(0.85).lerp(new THREE.Color('#6eb8ff'), 0.4) },
      uIntensity: { value: 0.72 },
    }),
    [accent]
  );

  useFrame((_, delta) => {
    const raw = progress.get();
    // Macro stages only; freeze spin feel when reduced (bus frame)
    const p = reduced ? 0.28 : Math.min(raw, 0.45);
    const spin = reduced ? 0.24 : p * 0.9 + delta * 0.04;
    if (earthRef.current) {
      earthRef.current.rotation.y = spin;
    }
    if (nightRef.current) {
      nightRef.current.rotation.y = spin;
    }
    if (atmoMat.current) {
      // Atmosphere brightens slightly as we zoom toward coverage
      atmoMat.current.uniforms.uIntensity.value = 0.55 + p * 0.35;
    }
  });

  return (
    <group>
      {/* Core planet */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />
        <meshStandardMaterial
          map={dayMap}
          roughness={0.82}
          metalness={0.12}
          color="#c8d4e8"
          emissive="#0a1528"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Night-side city lights (additive soft layer) */}
      <mesh ref={nightRef} scale={1.002}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 32]} />
        <meshBasicMaterial
          map={nightMap}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Limb glow / atmosphere shell */}
      <mesh scale={1.08}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 32]} />
        <shaderMaterial
          ref={atmoMat}
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmoUniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Thin outer halo */}
      <mesh scale={1.14}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 24]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export { EARTH_RADIUS };
