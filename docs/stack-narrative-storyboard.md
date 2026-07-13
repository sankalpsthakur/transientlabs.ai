# The Physical Stack — Narrative / UX Storyboard

**Status:** Phase 0 locked for build  
**Canonical URL:** `https://stack.transientlabs.ai` (path: `/stack`)  
**Alias:** `deepdive.transientlabs.ai` → redirects to stack host  
**Thesis:** Five infrastructure bets are one physical stack powering the AI-and-electrification century.

---

## Camera path (scroll = continuous zoom)

| Order | Camera label | Module | Spatial move |
|------:|--------------|--------|--------------|
| 0 | Orbit | LEO Constellations | From space, shells populate |
| 1 | Campus | Hyperscale Data Centers | Descend to earth / open roof |
| 2 | Core | Nuclear / SMR | Enter reactor, peel layers |
| 3 | Cell | Battery Gigafactories | Assemble cell → pack → curve |
| 4 | Street | Autonomous Vehicles | Sensor stack + perception |

Section breaks are soft fades between sticky stages — never hard cut pagination.

---

## Beat map (per module)

Each module sticky stage (~2.5–3 viewport heights on desktop):

1. **Hook** (0–15% scroll) — stat locks in
2. **Mechanism** (15–55%) — 3–5 explanatory beats + scrubbed diagram
3. **Scale** (55–75%) — comparator visualization
4. **Stakes** (75–100%) — bottleneck / geopolitics / cost tension

---

## Experience principles (enforced in code)

1. Scroll maps to transform continuous values (Framer Motion + Lenis)
2. Progressive reveal; SVG diagrams first (WebGL optional later)
3. Module jump nav + deep-link routes (`/stack/[module]`)
4. `prefers-reduced-motion` → static keyframe with same information
5. Device tier hook ready for future video/Lottie fallbacks

---

## Subdomain decision

| Option | Pros | Cons |
|--------|------|------|
| `deepdive.transientlabs.ai` | Descriptive | Long, generic |
| **`stack.transientlabs.ai`** ★ | Short, matches title, brandable | Needs DNS |
| `infra.transientlabs.ai` | Clear sector | Less distinctive |
| Path only `/stack` | Zero DNS | Weaker share surface |

**Recommendation:** ship path `/stack` immediately; point **`stack.transientlabs.ai`** at the same Vercel project. Keep `deepdive` as temporary redirect alias.
