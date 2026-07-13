# Physical Stack — Performance & QA report

**Target:** `http://localhost:3000/stack`  
**Generated:** 2026-07-12T23:00:57.691Z  
**Status:** Manual checklist (Lighthouse CLI not installed)

## Budget (from SOW §5)

| Metric | Budget |
|--------|--------|
| TTI mid-tier mobile | < 3s |
| Scroll | 60fps desktop |
| Low-end | degraded-but-functional (SVG / reduced) |
| Reduced motion | static keyframes with same info |

## Device matrix (manual)

| Device | Status | Notes |
|--------|--------|-------|
| Desktop Chrome | ☐ | Scroll scrub, all 5 modules |
| Desktop Safari | ☐ | Lenis + WebGL |
| iPhone mid-tier Safari | ☐ | DPR tier, lazy canvas |
| Android mid-tier Chrome | ☐ | **Primary mobile QA target** |
| prefers-reduced-motion | ☐ | Scale ladder + static freeze |

## How to run automated Lighthouse

```bash
npm i -D lighthouse chrome-launcher
npm run build && npm run start
node scripts/stack/lighthouse-stack.mjs http://localhost:3000/stack
```

## Engineering mitigations already in code

- `StackCanvas` mounts only near viewport; unmounts when far
- Device tier caps DPR (1 / 1.5 / 2)
- GSAP ScrollTrigger scrub + Lenis bridge
- Procedural geometry default; glTF opt-in via `NEXT_PUBLIC_STACK_USE_GLTF`
- `prefers-reduced-motion` freezes micro stages
- Scale ladder HUD is DOM (no extra WebGL)

## Android mid-tier checklist

1. Cold load `/stack` on 4GB Android (Chrome)
2. Confirm first paint of hero copy without white screen hang
3. Scroll through Orbit → Street; no multi-second jank freezes
4. Jump nav skips theatre
5. Open standalone `/stack/nuclear` deep link
6. Enable reduced motion OS setting — still readable
