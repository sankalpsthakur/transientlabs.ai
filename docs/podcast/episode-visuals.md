# Deep End Era episode companions

The current local catalogue contains96 numbered episode pages and70 distinct interactive companions. Episodes71–96 have their approved covers and notes but their26 companions remain unprepared; this is not a complete96-visual release. Each page has its approved dedicated cover, source synopsis, listening links, available chapter notes, five Sankalp creator links and the Claude Opus / Edge TTS disclosure as the final paragraph. All original68 metadata records and standalone drawings remain unchanged against36973dea. Existing canonical episode slugs and podcast GUIDs are preserved. No podcast audio or public feed was changed.

The show page offers a70-companion selector, with one active iframe, beside the96-episode catalogue. It starts with the supplied photon-level EUV explainer. Only prepared episode pages open a companion after the introduction and listening links; unprepared pages do not request missing assets or advertise a companion. Native controls have labels, visible keyboard focus and touch-sized targets. Guided sequences require a Play action, stop when hidden or off screen, and are disabled under reduced motion. The iframe has script access but no same-origin access; height messages are accepted only from that iframe and the selected episode and are bounded.

## Sources and design

The creator-supplied `deep-end-episode-visuals.zip` was recovered from the original conversation's normal artifact download. SHA-256: `81cd9e75fa420eb4793a3d4712ee351125ea86d27d9c55d3382998197be069f3`. The package contained 65 files, including 46 companion pages and their source models. Its stale integration patch was reviewed; its audio-player expansion and 46-episode catalogue were excluded. Source models 1–46 were retained, including the photon, temperature and actuator previews.

Episodes 47–68 add 22 topic-specific isometric apparatus views using [Anatomy](https://github.com/wheresryan22/anatomy), MIT licensed by Ryan. The maintained kit copies carry that licence in `public/episode-visuals/anatomy/LICENSE`. These views explain a bounded working principle rather than an entire plant: Faraday gas production, ammonia recycle, PV temperature response, equilibrium enrichment, turret rotation, interface handover, downwind layout, parallel fire-water continuity, combined relief sources, slug inventory, Stokes settling, staged dehydration, vapour routing, ideal-gas compression, separate barrier evidence, centrifugal acceleration, air storage, first-order deaeration, screen blockage, diesel autonomy, first-order mixed-reactor removal and a refrigeration work bound.

Each model states its invented parameters, units, assumptions and omissions and links to primary sources. Apparatus outlines are schematic. They are educational figures, not equipment drawings, plant operating instructions or compliance calculations. Fluid overlays, engraved marks and symbolic particles are distinguished from rigid solids in the geometry checks. The original 68 companions use the site's dark theme. The two new companions also offer a light theme. No WebGL layer is included.

The new69 Field Plotter and70 Three-ruler Signal Bench retain the separately verified source modules from the publishing workspace. Their model, scene and runtime hashes are recorded in `standalone-companion-source-preservation.json`. Both have76 actual solids, their own bounded mathematical models, primary references and optional light themes. The original69 checks cover216 exact Fourier states and26 geometry poses;70 covers276 independent norm-integral cases and its static geometry. Those unchanged checks were retained rather than rerun. The wrapper removes draft wording and duplicate creator headers, retains MIT attribution, bundles the browser modules into an inline IIFE for the opaque-origin sandbox, and reports content height including collapsed page margins. No iframe permission was widened.

## Rebuilding and checking

From the repository root:

```sh
node scripts/podcast/verify-apparatus.mjs --full
node scripts/podcast/build-visuals.mjs
node scripts/podcast/verify-visuals.mjs
npm run build
```

The apparatus audit generates the painter-order keys used by the live renderer. It checks all 23 turret headings, all six handover pin states, all three flare-source counts and the remaining invariant rigid apparatus: 51 states across 22 models. Its report is `docs/podcast/apparatus-verification.json`. The model check covers all 68 standalone pages, 1,884 combinations of controls and widths, independent equation/limiting-case checks and all available prerendered episode routes. It does not substitute for browser QA.

`verify-visuals.mjs` remains explicitly scoped to the original68 models. For new standalone wrappers, `node scripts/podcast/build-visuals.mjs --only-new` regenerates only69+ and the companion galleries while retaining all68 earlier HTML files. `build-standalone.mjs` uses the repository's existing esbuild installation. Production builds consume committed prepared assets. Standalone source builders create ignored intermediate templates inside `scripts/podcast/standalone/`.

The integration summary is `outputs/evidence/anatomy96-integration-qa-summary.json`. Current integration evidence lives in the publishing workspace at `outputs/evidence/anatomy96-local-page-audit.json` and the `anatomy96-integrated69-*` / `anatomy96-integrated70-*` files. All96 actual local HTTP pages pass title, canonical, creator-link, final-disclosure and appropriate companion-presence checks. All28 new covers match approved originals byte for byte, and all96 GUIDs are unique. Production build and targeted lint pass. Native keyboard and model controls, manual Play/Pause, parent-page offscreen pause, child-frame reduced-motion still controls, both themes and390px layouts were checked. Dynamic outputs retain aria-live off. A missing48px of page margins in the new wrappers' height reporting was corrected; expanded phone explanations now fit without internal or horizontal overflow. These are representative integration checks, not exhaustive control combinations, devices, measured frame rates or public deployment proof.

`prepare-catalogue.py` is the offline catalogue preparation step. It requires the approved source snapshot and cover manifests in the publishing workspace's adjacent `outputs` folder; production builds use the committed prepared catalogue and assets. Do not fetch an arbitrary newer feed or change GUIDs in this step.

Browser evidence is maintained in the publishing workspace at `outputs/evidence/anatomy-68`. It distinguishes native-control interaction, responsive layout, actual screenshots, reduced-motion behaviour, console outcomes, SVG line endpoints and HTTP/asset readbacks. The line-end check uses the Anatomy algorithm through the authorized browser's developer tools with its style/overlay mutations removed; the website itself is unchanged by the inspection. Captures and local tests are not proof of a production deployment.

## Release condition

This implementation remains local on `codex/deep-end-anatomy-68` until the creator's prior condition is satisfied: authoritative public propagation of the approved podcast catalogue across all intended active destinations. Amazon is deferred and Acast paused. Host publication and import receipts do not satisfy that condition. Follow the existing repository publication workflow after the propagation ledger permits release, and verify the real public deployment, its episode pages, interactive controls, assets and screenshots before calling the website update live.

Before that release, complete all26 remaining companions and enable their catalogue flags, then validate the complete96-companion set. Passing96 page metadata does not establish96 prepared visuals. Current local work is neither pushed nor deployed.
