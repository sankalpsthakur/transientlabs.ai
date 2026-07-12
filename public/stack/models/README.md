# Physical Stack — 3D asset pipeline

## Production path (Blender → site)

1. **Model** in Blender at real-ish proportions (Y-up or convert on export).
2. **Export** glTF 2.0 binary (`.glb`) with:
   - Applied scale
   - Mesh optimization (decimate high-poly CAD first)
   - Embedded or separate textures as needed
3. **Compress** with [glTF-Transform](https://gltf-transform.dev/):

```bash
npx @gltf-transform/cli optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp
# Prefer KTX2 for PBR maps when available:
# npx @gltf-transform/cli etc1s input.glb output.glb
```

4. Drop into this folder using **stable filenames** from `manifest.json`.
5. Set `"placeholder": false` in the manifest entry (or regenerate via CI).

## Budgets (per module)

| Metric | Target |
|--------|--------|
| Triangles (active LOD0) | ≤ 80k |
| GPU texture memory | ≤ 16 MB KTX2/WebP |
| glTF download (gzip) | ≤ 1.5 MB |
| Materials | metal/rough preferred; avoid heavy transmission |

## Runtime

- Loader: `src/components/stack/webgl/GltfAsset.tsx` (`useGLTF` + Suspense)
- Lazy mount: only when `StackCanvas` is near viewport
- Fallback: procedural scenes remain the default when asset missing or `placeholder: true` and `preferProcedural` is set

## Filenames

| File | Module |
|------|--------|
| `satellite-bus.gltf` | satellites |
| `gpu-package.gltf` | data-centers |
| `reactor-vessel.gltf` | nuclear |
| `battery-cell.gltf` | batteries |
| `vehicle-body.gltf` | autonomous-vehicles |

Regenerate placeholders:

```bash
node scripts/stack/export-placeholder-gltf.mjs
```
