# Deep End Era episode companions

The prepared catalogue contains 68 numbered episode pages and 68 distinct interactive companions. Each page has its approved dedicated cover, source synopsis, listening links, available chapter notes, five Sankalp creator links and the Claude Opus / Edge TTS disclosure as the final paragraph. Existing canonical episode slugs and podcast GUIDs are preserved. No podcast audio or public feed was changed.

The show page offers a 68-episode selector, with one active iframe. It starts with the supplied photon-level EUV explainer. The individual episode pages open their own companion after the introduction and listening links. Native controls have labels, visible keyboard focus and touch-sized targets. Guided sequences require a Play action, stop when hidden or off screen, and are disabled under reduced motion. The iframe has script access but no same-origin access; height messages are accepted only from that iframe and the selected episode and are bounded.

## Sources and design

The creator-supplied `deep-end-episode-visuals.zip` was recovered from the original conversation's normal artifact download. SHA-256: `81cd9e75fa420eb4793a3d4712ee351125ea86d27d9c55d3382998197be069f3`. The package contained 65 files, including 46 companion pages and their source models. Its stale integration patch was reviewed; its audio-player expansion and 46-episode catalogue were excluded. Source models 1–46 were retained, including the photon, temperature and actuator previews.

Episodes 47–68 add 22 topic-specific isometric apparatus views using [Anatomy](https://github.com/wheresryan22/anatomy), MIT licensed by Ryan. The maintained kit copies carry that licence in `public/episode-visuals/anatomy/LICENSE`. These views explain a bounded working principle rather than an entire plant: Faraday gas production, ammonia recycle, PV temperature response, equilibrium enrichment, turret rotation, interface handover, downwind layout, parallel fire-water continuity, combined relief sources, slug inventory, Stokes settling, staged dehydration, vapour routing, ideal-gas compression, separate barrier evidence, centrifugal acceleration, air storage, first-order deaeration, screen blockage, diesel autonomy, first-order mixed-reactor removal and a refrigeration work bound.

Each model states its invented parameters, units, assumptions and omissions and links to primary sources. Apparatus outlines are schematic. They are educational figures, not equipment drawings, plant operating instructions or compliance calculations. Fluid overlays, engraved marks and symbolic particles are distinguished from rigid solids in the geometry checks. The website's dark theme is the shipped treatment; no light theme or WebGL layer is included.

## Rebuilding and checking

From the repository root:

```sh
node scripts/podcast/verify-apparatus.mjs --full
node scripts/podcast/build-visuals.mjs
node scripts/podcast/verify-visuals.mjs
npm run build
```

The apparatus audit generates the painter-order keys used by the live renderer. It checks all 23 turret headings, all six handover pin states, all three flare-source counts and the remaining invariant rigid apparatus: 51 states across 22 models. Its report is `docs/podcast/apparatus-verification.json`. The model check covers all 68 standalone pages, 1,884 combinations of controls and widths, independent equation/limiting-case checks and all available prerendered episode routes. It does not substitute for browser QA.

`prepare-catalogue.py` is the offline catalogue preparation step. It requires the approved source snapshot and cover manifests in the publishing workspace's adjacent `outputs` folder; production builds use the committed prepared catalogue and assets. Do not fetch an arbitrary newer feed or change GUIDs in this step.

Browser evidence is maintained in the publishing workspace at `outputs/evidence/anatomy-68`. It distinguishes native-control interaction, responsive layout, actual screenshots, reduced-motion behaviour, console outcomes, SVG line endpoints and HTTP/asset readbacks. The line-end check uses the Anatomy algorithm through the authorized browser's developer tools with its style/overlay mutations removed; the website itself is unchanged by the inspection. Captures and local tests are not proof of a production deployment.

## Release condition

This implementation remains local on `codex/deep-end-anatomy-68` until the creator's prior condition is satisfied: authoritative public propagation of the approved podcast catalogue across all intended active destinations. Amazon is deferred and Acast paused. Host publication and import receipts do not satisfy that condition. Follow the existing repository publication workflow after the propagation ledger permits release, and verify the real public deployment, its episode pages, interactive controls, assets and screenshots before calling the website update live.
