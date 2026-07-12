'use client';

import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import type { Object3D } from 'three';

export interface GltfAssetProps {
  /** Public path e.g. /stack/models/satellite-bus.gltf */
  url: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** When true, skip network and render null (procedural owns the frame) */
  disabled?: boolean;
}

function GltfMesh({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: Omit<GltfAssetProps, 'disabled'>) {
  const gltf = useGLTF(url);
  const cloned = useMemo(() => {
    const root = gltf.scene.clone(true) as Object3D;
    return root;
  }, [gltf.scene]);

  return (
    <primitive
      object={cloned}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

/**
 * glTF/Draco-ready asset mount (drei useGLTF).
 * Place Blender exports at the same public paths; placeholders ship for CI.
 */
export function GltfAsset({ disabled, ...props }: GltfAssetProps) {
  if (disabled || !props.url) return null;

  return (
    <Suspense fallback={null}>
      <GltfMesh {...props} />
    </Suspense>
  );
}

export function preloadGltf(url: string) {
  if (typeof window === 'undefined') return;
  try {
    useGLTF.preload(url);
  } catch {
    // ignore
  }
}
