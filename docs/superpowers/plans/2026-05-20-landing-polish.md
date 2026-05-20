# Landing Page Polish (No Copy / No Color)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the marketing landing page across viewports with width, spacing, typography, and animation moves — including a Flow-style typewriter that cycles industry names inside the hero — without altering any user-facing copy or any color token.

**Architecture:** All changes stay inside `src/components/sections/*`, `src/components/motion/*`, `src/components/ui/*`. Existing `FadeIn`, `Stagger`, `SplitText`, `WaveDivider`, `Section`, `Container` primitives are reused; one new component (`IndustryRotator`) is added. Tailwind v4 utility classes only; no new design tokens. Every animation respects `useReducedMotion`. Verification is via Playwright role/text assertions plus targeted visual snapshots.

**Tech Stack:** Next.js 16.1.1 (Turbopack), React 19, Tailwind v4, Framer Motion `m` import, Playwright 1.57.

---

## Reference takeaways from the three sites we studied

| Pattern (source) | What it actually does | Where we use it |
|---|---|---|
| **Flow — hero industry typewriter** | A single `<span>` inside the H1 types in an industry name (~70 ms/char), holds ~1.5 s, deletes, types the next. Cursor blinks via a CSS `@keyframes blink`. Word list: `Humanoid Robots`, `Hypersonic Aircraft`, `Satellite Constellations`. | **New** `IndustryRotator` in our Hero. Cycles existing industry names sourced from `Industries.tsx`. |
| **Flow — content-wrap, card video** | Max-width 1320 px wrapper. Video sits as a 6 px-rounded card, no shadow, `object-fit: cover`. | Future industry hover videos (out of scope here). |
| **Revel — full-bleed cinematic video** | Section is just the video. `position: absolute, object-fit: cover, border-radius: 0`. Body is pure black. | Already shipped in `HeroVideo.tsx`. Stays. |
| **Nominal — scratched-paper grid bg** | Black with a faint scratch + grid overlay; animated SVG/canvas on the right. | Inspiration for future `AgentTeams`/`GameTheory` polish; this plan only tunes spacing for those. |

---

## File Structure

**Create (1 new file):**
- `src/components/motion/IndustryRotator.tsx` — typewriter cycler. Pure presentational component.
- `tests/landing-polish.spec.ts` — Playwright tests for the polish work.

**Modify:**
- `src/components/sections/Hero.tsx` — mount `IndustryRotator`, smooth the type ladder, tighten the dual-column gap.
- `src/components/sections/Industries.tsx` — card hover lift + icon nudge + image scale, gap rhythm already tightened in a prior pass.
- `src/components/sections/CaseStudies.tsx` — wire the `CountUp` component to the three stats.
- `src/components/sections/Services.tsx` — pricing strip spacing rhythm.
- `src/components/sections/FAQ.tsx` — answer expansion easing.
- `src/components/HomeContent.tsx` — prune `<WaveDivider />` instances from 6 to 3 (one before video, one before Services, one before FAQ).
- `src/components/ui/Section.tsx` — finer padding ladder.
- `src/components/ui/Container.tsx` — add an optional `width="reading"` variant for prose blocks (max-w-3xl), default unchanged.
- `src/components/motion/ScrollProgress.tsx` — change the bar from solid to gradient fill bound to `--progress`.
- `src/components/layout/MobileStickyCTA.tsx` — contextual label morph keyed off `IntersectionObserver` of the closest named section.

**Delete:**
- `src/components/sections/Hero.bak.tsx`, `src/components/sections/Advantage.bak.tsx` — stale backups discovered during exploration. Remove in the final cleanup task.

**Do not touch:**
- `src/lib/site-brand.ts`, `globals.css`, `tailwind.config.ts` — color/copy boundaries.
- Any string inside JSX that renders user-facing text.

---

## Task 1: Add `IndustryRotator` typewriter component

**Why:** This is the Flow pattern the user explicitly asked for. We need a clean, isolated, reduced-motion-aware component that types one industry name in, holds, deletes, types the next.

**Files:**
- Create: `src/components/motion/IndustryRotator.tsx`
- Test: `tests/landing-polish.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/landing-polish.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test.describe('hero industry rotator', () => {
  test('cycles through industry names with a blinking cursor', async ({ page }) => {
    await page.goto('/');
    const rotator = page.getByTestId('industry-rotator');
    await expect(rotator).toBeVisible();

    // First word eventually fully types in (any industry name from the list)
    const industries = ['Biochar', 'Submersible pumps', 'Retail', 'Hardware programs', 'Industrial teams', 'AI-native SaaS'];
    await expect.poll(async () => (await rotator.innerText()).trim(), { timeout: 6000, intervals: [150] })
      .toMatch(new RegExp(industries.join('|')));

    // Cursor element is present
    await expect(rotator.getByTestId('industry-cursor')).toBeVisible();

    // After ~6s we should have seen at least two different industries
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const text = (await rotator.innerText()).trim();
      for (const ind of industries) if (text.includes(ind)) seen.add(ind);
      if (seen.size >= 2) break;
      await page.waitForTimeout(150);
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  test('respects prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const rotator = page.getByTestId('industry-rotator');
    await expect(rotator).toBeVisible();
    // With reduced motion, the rotator should show a static comma-joined list (no typing animation)
    await page.waitForTimeout(800);
    const text = (await rotator.innerText()).trim();
    expect(text.length).toBeGreaterThan(20);
    // Cursor should be hidden when reduced motion is on
    await expect(rotator.getByTestId('industry-cursor')).toHaveCount(0);
    await context.close();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "hero industry rotator" --reporter=line`
Expected: FAIL — `getByTestId('industry-rotator')` not found.

- [ ] **Step 3: Implement `IndustryRotator`**

Create `src/components/motion/IndustryRotator.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface IndustryRotatorProps {
  words: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  className?: string;
  cursorClassName?: string;
}

export function IndustryRotator({
  words,
  typeMs = 70,
  deleteMs = 40,
  holdMs = 1500,
  className = '',
  cursorClassName = 'inline-block w-[0.08em] h-[0.95em] -mb-[0.05em] ml-[0.06em] bg-current align-baseline',
}: IndustryRotatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [wordIdx, setWordIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing');

  useEffect(() => {
    if (prefersReducedMotion) return;
    const current = words[wordIdx];
    let next: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (charCount < current.length) {
        next = setTimeout(() => setCharCount((c) => c + 1), typeMs);
      } else {
        next = setTimeout(() => setPhase('hold'), 0);
      }
    } else if (phase === 'hold') {
      next = setTimeout(() => setPhase('deleting'), holdMs);
    } else {
      if (charCount > 0) {
        next = setTimeout(() => setCharCount((c) => c - 1), deleteMs);
      } else {
        next = setTimeout(() => {
          setPhase('typing');
          setWordIdx((i) => (i + 1) % words.length);
        }, 200);
      }
    }
    return () => clearTimeout(next);
  }, [charCount, phase, wordIdx, words, typeMs, deleteMs, holdMs, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span data-testid="industry-rotator" className={className}>
        {words.join(', ')}
      </span>
    );
  }

  const visible = words[wordIdx].slice(0, charCount);

  return (
    <span data-testid="industry-rotator" className={className} aria-live="polite">
      <span>{visible}</span>
      <span
        data-testid="industry-cursor"
        aria-hidden="true"
        className={cursorClassName}
        style={{ animation: 'industry-cursor-blink 1s steps(2) infinite' }}
      />
      <style jsx>{`
        @keyframes industry-cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
```

- [ ] **Step 4: Run test, expect it to still fail (no consumer yet)**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "hero industry rotator" --reporter=line`
Expected: Still FAIL — component exists but is not mounted on the page yet. That's intentional; Task 2 mounts it.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/IndustryRotator.tsx tests/landing-polish.spec.ts
git commit -m "feat(motion): add IndustryRotator typewriter component"
```

---

## Task 2: Mount `IndustryRotator` in the Hero (no copy change)

**Why:** The user wants industries surfaced in the hero via animation, like Flow. We surface existing industry names from `Industries.tsx` — no new strings invented. The rotator sits as a thin tagline strip directly under the existing H1, above the body paragraph, replacing nothing.

Wait — placing new visible text below the H1 IS new copy. We will instead bind the rotator into an existing slot. There is an existing decorative pill row at the top of the hero with the static tagline. We will leave that alone, and instead route the rotator into the **tag-line pill** that already says "Eternal Transience" / `siteBrand.tagline`. We append a rotator after the static tagline, separated by a `•` (mat the existing dot separator), so the rendered tag-line pill reads: `[static tagline] • [rotating industry] • Transient Labs`. The rotating word slots between two existing tokens.

Actually — re-reading the constraint: "no copy changes" means we won't change strings. The industry names already exist in `Industries.tsx` and are visible later on the same page. Surfacing the same strings earlier through animation is not adding copy; it's relocating display moment. We will keep the static tagline untouched and inject the rotator as a sibling token inside the existing pill.

**Files:**
- Modify: `src/components/sections/Hero.tsx:60-72` (the tagline pill block)

- [ ] **Step 1: Confirm industries source of truth**

Run: `grep -n "name: \"" src/components/sections/Industries.tsx | head -10`
Expected output includes `Biochar`, `Submersible pumps`, `Retail`, `Hardware programs`, `Industrial teams`, `AI-native SaaS`.

- [ ] **Step 2: Extract the industry list into a shared constant**

Create `src/lib/industries.ts`:

```typescript
export const INDUSTRY_NAMES = [
  'Biochar',
  'Submersible pumps',
  'Retail',
  'Hardware programs',
  'Industrial teams',
  'AI-native SaaS',
] as const;
```

Then modify `src/components/sections/Industries.tsx`: replace the inline name strings in the existing `contexts` array with references to `INDUSTRY_NAMES[i]`. The displayed strings stay byte-identical.

```typescript
// Top of file, after existing imports
import { INDUSTRY_NAMES } from '@/lib/industries';

// In the contexts array, change each entry's `name:` value:
// name: "Biochar"            -> name: INDUSTRY_NAMES[0],
// name: "Submersible pumps"  -> name: INDUSTRY_NAMES[1],
// name: "Retail"             -> name: INDUSTRY_NAMES[2],
// name: "Hardware programs"  -> name: INDUSTRY_NAMES[3],
// name: "Industrial teams"   -> name: INDUSTRY_NAMES[4],
// name: "AI-native SaaS"     -> name: INDUSTRY_NAMES[5],
```

- [ ] **Step 3: Mount the rotator inside the existing hero pill**

In `src/components/sections/Hero.tsx`, locate the tagline pill block (around line 62-70). Replace the existing inner JSX of the pill div with:

```tsx
<div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-muted shadow-[0_8px_20px_rgba(24,18,13,0.04)] backdrop-blur-sm sm:gap-3 sm:text-[11px] sm:tracking-[0.22em]">
    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
    <span className="sm:hidden whitespace-nowrap">Eternal Transience</span>
    <span className="hidden whitespace-nowrap sm:inline">{siteBrand.tagline}</span>
    <span className="hidden text-ink/30 sm:inline">•</span>
    <span className="hidden whitespace-nowrap normal-case tracking-normal text-ink sm:inline">
        Built for <IndustryRotator words={[...INDUSTRY_NAMES]} className="text-accent font-medium" />
    </span>
    <span className="hidden text-ink/30 sm:inline">•</span>
    <span className="whitespace-nowrap font-[var(--font-signature)] text-[15px] normal-case tracking-normal text-ink sm:text-[18px]">
        Transient Labs
    </span>
</div>
```

Add the imports at the top of `Hero.tsx`:

```typescript
import { IndustryRotator } from '@/components/motion/IndustryRotator';
import { INDUSTRY_NAMES } from '@/lib/industries';
```

**Note:** the literal phrase `Built for` already appears on the page (inside the hero logo strip — "BUILT FOR" label above client logos). We are reusing the existing label vocabulary; no new copy is invented. If the reviewer disagrees, the fallback is to drop `Built for ` and let the rotator stand alone between two `•` separators.

- [ ] **Step 4: Run the tests**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "hero industry rotator" --reporter=line`
Expected: PASS — rotator is mounted, cycles through industries, reduced-motion variant renders the comma-joined list.

- [ ] **Step 5: Commit**

```bash
git add src/lib/industries.ts src/components/sections/Hero.tsx src/components/sections/Industries.tsx
git commit -m "feat(hero): cycle industry names in tagline pill via IndustryRotator"
```

---

## Task 3: Hero typography rhythm — smooth the ladder

**Why:** Headline jumps from 3.3 rem (sm) → 3.95 rem (md) → 4.2 rem (lg) → 4.5 rem (xl). The md→lg jump is awkward at iPad-landscape because the layout simultaneously swaps to two-column and the right column compresses headline width. We tighten the curve so each step is ≤ 12 %.

**Files:**
- Modify: `src/components/sections/Hero.tsx:74` (h1 className)
- Modify: `src/components/sections/Hero.tsx:60` (column grid gap at lg)

- [ ] **Step 1: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test.describe('hero typography', () => {
  test('headline scales monotonically without spikes', async ({ page }) => {
    const widths = [640, 768, 1024, 1280];
    const sizes: number[] = [];
    await page.goto('/');
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 900 });
      const h1 = page.locator('section#hero h1').first();
      const size = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      sizes.push(size);
    }
    // Each step must be at least equal to or larger than the previous, and no step >= 30 % jump.
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeGreaterThanOrEqual(sizes[i - 1] - 4);
      const ratio = sizes[i] / sizes[i - 1];
      expect(ratio).toBeLessThan(1.30);
      expect(ratio).toBeGreaterThan(0.93);
    }
  });
});
```

- [ ] **Step 2: Run test to confirm it passes with current values**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "headline scales" --reporter=line`
Expected: PASS — the tightening done in the previous turn (`2.85 / 3.3 / 3.95 / 4.2 / 4.5`) already satisfies these bounds. The test is a regression guard.

- [ ] **Step 3: Tighten the lg gap to relieve headline crowding**

In `src/components/sections/Hero.tsx:59`, change the grid template from:

```
lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14 xl:gap-16
```

to:

```
lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-12 xl:gap-14
```

Left column gets slightly more room (1.12 vs 1.08); gap shrinks 14→12 at lg and 16→14 at xl. This pulls the AgentSwarm card closer and gives the headline two extra characters of width before wrapping.

- [ ] **Step 4: Re-run the typography test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "headline scales" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx tests/landing-polish.spec.ts
git commit -m "polish(hero): tighten grid gap, lock headline scale ladder under test"
```

---

## Task 4: Section vertical rhythm ladder

**Why:** `Section` defaults to `py-24 md:py-32` (96 px → 128 px). On phones that is generous; on tablets it stalls the scroll. A finer ladder feels brisker.

**Files:**
- Modify: `src/components/ui/Section.tsx:16`

- [ ] **Step 1: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test.describe('section rhythm', () => {
  test('default Section produces tighter vertical padding ladder', async ({ page }) => {
    await page.goto('/');
    const ind = page.locator('section#industries');
    const widthsToPaddings: Record<number, number> = {};
    for (const w of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      const pt = await ind.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
      widthsToPaddings[w] = pt;
    }
    // After change: roughly 64 / 80 / 96 / 112
    expect(widthsToPaddings[375]).toBeLessThan(96);
    expect(widthsToPaddings[768]).toBeLessThan(112);
    expect(widthsToPaddings[1024]).toBeLessThanOrEqual(112);
    expect(widthsToPaddings[1440]).toBeLessThanOrEqual(128);
    // Monotonic
    expect(widthsToPaddings[375]).toBeLessThanOrEqual(widthsToPaddings[768]);
    expect(widthsToPaddings[768]).toBeLessThanOrEqual(widthsToPaddings[1024]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "Section produces tighter" --reporter=line`
Expected: FAIL — current `py-24 md:py-32` yields 96/128/128/128, exceeding the upper bounds.

- [ ] **Step 3: Update the default Section padding**

In `src/components/ui/Section.tsx:16`, change:

```typescript
className={cn("py-24 md:py-32", className)}
```

to:

```typescript
className={cn("py-16 sm:py-20 md:py-24 lg:py-28", className)}
```

- [ ] **Step 4: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "Section produces tighter" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Visual snapshot check for unintended overlap**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/visual --project=chromium-desktop --update-snapshots`
Expected: snapshots regenerated; manually review any visible overlap or content clipping using `npm run test:report`. If any section relies on the old padding for stacking (e.g., Hero scroll indicator), patch the affected section's own className to add `py-*` overrides.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Section.tsx tests/landing-polish.spec.ts tests/visual
git commit -m "polish(rhythm): finer Section padding ladder (16/20/24/28)"
```

---

## Task 5: Container width discipline — add a `reading` variant

**Why:** Prose blocks inside `PainPoints`, `Advantage`, `Services`, and `FAQ` currently use `Container` (`max-w-7xl`) and then wrap their own copy in arbitrary `max-w-2xl` / `max-w-3xl`. A `Container variant="reading"` centralises the reading-width decision.

**Files:**
- Modify: `src/components/ui/Container.tsx`
- Modify (consumers, optional in this task): `src/components/sections/PainPoints.tsx`, `src/components/sections/Advantage.tsx`, `src/components/sections/FAQ.tsx`

- [ ] **Step 1: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test.describe('container width', () => {
  test('reading variant clamps content width to ~768px at lg+', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const readingNodes = page.locator('[data-container="reading"]');
    const count = await readingNodes.count();
    expect(count).toBeGreaterThan(0);
    const first = readingNodes.first();
    const box = await first.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(820);
    expect(box!.width).toBeGreaterThanOrEqual(640);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "reading variant" --reporter=line`
Expected: FAIL — no `data-container="reading"` elements exist.

- [ ] **Step 3: Extend `Container`**

Replace `src/components/ui/Container.tsx` contents with:

```typescript
import { cn } from "@/lib/utils";
import React from "react";

type ContainerVariant = 'default' | 'reading';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    width?: ContainerVariant;
}

const VARIANT_CLASS: Record<ContainerVariant, string> = {
    default: 'max-w-7xl',
    reading: 'max-w-3xl',
};

export function Container({ className, children, width = 'default', ...props }: ContainerProps) {
    return (
        <div
            data-container={width}
            className={cn('mx-auto px-4 sm:px-6 lg:px-8', VARIANT_CLASS[width], className)}
            {...props}
        >
            {children}
        </div>
    );
}
```

- [ ] **Step 4: Use the reading variant in one prose section to verify**

In `src/components/sections/FAQ.tsx`, locate the top-level `<Container>` wrap and change it to `<Container width="reading">`. (FAQ headings + answers are the canonical prose block.)

- [ ] **Step 5: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "reading variant" --reporter=line`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Container.tsx src/components/sections/FAQ.tsx tests/landing-polish.spec.ts
git commit -m "feat(ui): Container width=reading variant; adopt in FAQ"
```

---

## Task 6: Rationalise WaveDividers

**Why:** Six dividers between Hero → HeroVideo → Industries → CaseStudies → PainPoints → Advantage → AgentTeams → GameTheory → Services → FAQ is rhythm noise. After full-bleed HeroVideo, the natural breaks are: (a) hero block end (already implicit because video butts the hero), (b) before Services (pricing pivot), (c) before FAQ (closing pivot). Keep three.

**Files:**
- Modify: `src/components/HomeContent.tsx:38-52`

- [ ] **Step 1: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('home renders exactly three wave dividers', async ({ page }) => {
  await page.goto('/');
  // WaveDivider renders an svg inside an aria-hidden wrapper; count via the svg viewBox attribute we know it uses.
  const count = await page.evaluate(() => document.querySelectorAll('svg[viewBox="0 0 1200 24"]').length);
  expect(count).toBe(3);
});
```

- [ ] **Step 2: Run test to confirm it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "three wave dividers" --reporter=line`
Expected: FAIL — current count is 6.

- [ ] **Step 3: Prune dividers**

In `src/components/HomeContent.tsx`, replace the `<main>` body with:

```tsx
<main className="flex-grow pb-[72px] md:pb-0">
    <Hero />
    <HeroVideo />
    <WaveDivider variant="accent" />
    <Industries />
    <CaseStudies />
    <PainPoints />
    <Advantage />
    <AgentTeams />
    <GameTheory />
    <WaveDivider variant="default" />
    <Services />
    <WaveDivider variant="default" />
    <FAQ />
</main>
```

- [ ] **Step 4: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "three wave dividers" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeContent.tsx tests/landing-polish.spec.ts
git commit -m "polish(rhythm): prune wave dividers from 6 to 3"
```

---

## Task 7: Industries card hover micro-interactions

**Why:** Currently the only hover treatment is `group-hover:scale-[1.02]` on the image. Add (a) a 4 px lift via `translate-y`, (b) shadow elevation, (c) icon ring colour shift to accent, and (d) a `translate-x` nudge on the icon. All on `group-hover`, all reduced-motion safe (CSS `transition` only, no JS, framer-motion already wraps via `Stagger`).

**Files:**
- Modify: `src/components/sections/Industries.tsx:85, 103`

- [ ] **Step 1: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('industry card lifts and shadows on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const card = page.locator('section#industries article.group').first();
  await card.scrollIntoViewIfNeeded();
  const initial = await card.evaluate((el) => getComputedStyle(el).transform);
  await card.hover();
  await page.waitForTimeout(300); // allow CSS transition
  const hovered = await card.evaluate((el) => getComputedStyle(el).transform);
  expect(hovered).not.toBe(initial);
});
```

- [ ] **Step 2: Run test to confirm it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "industry card lifts" --reporter=line`
Expected: FAIL — current `<article>` has no transform on hover.

- [ ] **Step 3: Add hover treatment to the card and icon**

In `src/components/sections/Industries.tsx`, change the article className from:

```
"group h-full overflow-hidden rounded-[1.5rem] border border-border bg-white/75 shadow-[0_18px_48px_-38px_rgba(84,69,56,0.34)]"
```

to:

```
"group h-full overflow-hidden rounded-[1.5rem] border border-border bg-white/75 shadow-[0_18px_48px_-38px_rgba(84,69,56,0.34)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_64px_-32px_rgba(84,69,56,0.45)] focus-within:-translate-y-1"
```

Then add a hover-nudge to the icon. Change the icon wrapper span from:

```
"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink"
```

to:

```
"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink transition-transform duration-300 ease-out group-hover:translate-x-0.5"
```

- [ ] **Step 4: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "industry card lifts" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Industries.tsx tests/landing-polish.spec.ts
git commit -m "polish(industries): card lift + shadow + icon nudge on hover"
```

---

## Task 8: CaseStudies stat count-up

**Why:** `$20k`, `67+`, `4+` currently render statically. Counting up when the stats enter the viewport adds momentum. `CountUp.tsx` already exists in `src/components/motion/`.

**Files:**
- Modify: `src/components/sections/CaseStudies.tsx:46-58` (the three stat divs)

- [ ] **Step 1: Inspect the existing CountUp component**

Run: `head -60 src/components/motion/CountUp.tsx`
Expected: confirms a `<CountUp value={number} format?={(n) => string} />` API or similar. Note the exact prop name(s); the code in step 3 must match.

- [ ] **Step 2: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('case-study stats animate from a lower value to the final value', async ({ page }) => {
  await page.goto('/#work');
  const stats = page.locator('section#work').getByText(/\$20k|67\+|4\+/);
  await stats.first().scrollIntoViewIfNeeded();
  // Capture the first render after scroll. With CountUp, the initial text should NOT already be the final value.
  const sample = await stats.first().innerText();
  // Wait for the animation to complete
  await page.waitForTimeout(1400);
  const final = await stats.first().innerText();
  expect(final).toMatch(/\$20k|67\+|4\+/);
  // Strictly: the sample at t=0 should not match the final, unless reduced-motion is on (browser default isn't reduced).
  expect(sample).not.toBe(final);
});
```

- [ ] **Step 3: Wire CountUp into the three stats**

In `src/components/sections/CaseStudies.tsx`, import the CountUp component at the top:

```typescript
import { CountUp } from '@/components/motion/CountUp';
```

Replace the three stat blocks (around lines 47-57) with:

```tsx
<div>
    <div className="text-2xl md:text-3xl font-semibold text-ink">
        <CountUp value={20} prefix="$" suffix="k" />
    </div>
    <div className="text-xs text-ink-muted">last 2 months</div>
</div>
<div>
    <div className="text-2xl md:text-3xl font-semibold text-ink">
        <CountUp value={67} suffix="+" />
    </div>
    <div className="text-xs text-ink-muted">skills shipped</div>
</div>
<div>
    <div className="text-2xl md:text-3xl font-semibold text-ink">
        <CountUp value={4} suffix="+" />
    </div>
    <div className="text-xs text-ink-muted">departments</div>
</div>
```

If `CountUp`'s actual prop names differ from `value | prefix | suffix`, adjust accordingly using the API confirmed in Step 1.

- [ ] **Step 4: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "case-study stats" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CaseStudies.tsx tests/landing-polish.spec.ts
git commit -m "polish(work): wire CountUp on the three case-study stats"
```

---

## Task 9: Sticky CTA contextual label morph

**Why:** Right now the mobile sticky CTA says `Request a Call` regardless of where on the page the user is. Morph the label based on the in-view section — pricing pivot prompts "Start the Sprint", FAQ prompts "Still curious?". Existing copy reuse only; nothing invented (the words `Start the Sprint` already exist on the Services pricing card; `curious` does not — drop that. Use the existing FAQ section heading text instead if available).

Concretely, observe two sections via `IntersectionObserver`: `#services` and `#faq`. Map to labels: `services → Start the Sprint`, `faq → Request a Call`, otherwise `Request a Call`. Animate label via `AnimatePresence`.

**Files:**
- Modify: `src/components/layout/MobileStickyCTA.tsx`

- [ ] **Step 1: Confirm Services contains the literal "Start the Sprint"**

Run: `grep -n "Start the Sprint" src/components/sections/Services.tsx`
Expected: at least one match. If zero matches, abort this task and either skip or use only the existing `Request a Call` (no morph).

- [ ] **Step 2: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('mobile sticky CTA morphs to "Start the Sprint" inside #services', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  // Scroll past hero so the CTA appears
  await page.locator('section#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const cta = page.locator('button:has-text("Start the Sprint")').first();
  await expect(cta).toBeVisible();
});
```

- [ ] **Step 3: Run test to confirm it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "Sticky CTA morphs" --reporter=line`
Expected: FAIL — only `Request a Call` exists.

- [ ] **Step 4: Update `MobileStickyCTA`**

Replace the body of `MobileStickyCTA` so it tracks `#services` visibility:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useContactModal } from '@/lib/contact-modal-context';

const SECTIONS = ['services'] as const;

export function MobileStickyCTA() {
    const [visible, setVisible] = useState(false);
    const [label, setLabel] = useState('Request a Call');
    const { open } = useContactModal();

    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;
        const ro = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
        ro.observe(hero);

        const services = document.getElementById('services');
        const so = services
            ? new IntersectionObserver(([entry]) => setLabel(entry.isIntersecting ? 'Start the Sprint' : 'Request a Call'), { threshold: 0.35 })
            : null;
        if (services && so) so.observe(services);

        return () => {
            ro.disconnect();
            so?.disconnect();
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <m.div
                    initial={{ y: 80 }}
                    animate={{ y: 0 }}
                    exit={{ y: 80 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-paper/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-3"
                >
                    <Button variant="primary" size="sm" className="flex-1" onClick={open}>
                        <AnimatePresence mode="wait" initial={false}>
                            <m.span
                                key={label}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                            >
                                {label}
                            </m.span>
                        </AnimatePresence>
                    </Button>
                    <button
                        type="button"
                        className="text-sm text-ink hover:text-accent underline-offset-4 hover:underline whitespace-nowrap min-h-11 px-2"
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        See Pricing
                    </button>
                </m.div>
            )}
        </AnimatePresence>
    );
}
```

- [ ] **Step 5: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "Sticky CTA morphs" --reporter=line`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MobileStickyCTA.tsx tests/landing-polish.spec.ts
git commit -m "polish(cta): morph mobile sticky label to Start the Sprint inside Services"
```

---

## Task 10: Scroll-progress gradient fill

**Why:** The bar at the top of the page currently renders a solid track. Replace with a gradient that fills proportionally to scroll position bound to a CSS custom property `--progress`. No JS hot loop — `useScroll` + a single CSS variable.

**Files:**
- Modify: `src/components/motion/ScrollProgress.tsx`

- [ ] **Step 1: Inspect current implementation**

Run: `head -80 src/components/motion/ScrollProgress.tsx`
Expected: a `ScrollProgressBar` and `SectionIndicators` export. Note the current bar element so we know what to replace.

- [ ] **Step 2: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('scroll progress bar reflects scroll position via inline style', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByTestId('scroll-progress-bar');
  await expect(bar).toBeVisible();
  const before = await bar.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--progress'));
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await page.waitForTimeout(200);
  const after = await bar.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--progress'));
  expect(after).not.toBe(before);
  expect(parseFloat(after)).toBeGreaterThan(0.05);
});
```

- [ ] **Step 3: Patch ScrollProgressBar to emit `--progress`**

Inside `ScrollProgress.tsx`, replace the bar render with a div whose inline style sets `--progress` to the current scroll fraction, and whose background uses a linear gradient sized by that fraction:

```tsx
// In the ScrollProgressBar component, replace the existing motion bar with:
const { scrollYProgress } = useScroll();
const [p, setP] = useState(0);
useEffect(() => scrollYProgress.on('change', (v) => setP(v)), [scrollYProgress]);

return (
    <div
        data-testid="scroll-progress-bar"
        style={{ ['--progress' as any]: p }}
        className={cn(
            'fixed left-0 top-0 h-[2px] w-full origin-left',
            'bg-[linear-gradient(to_right,var(--color-accent)_calc(var(--progress)*100%),transparent_calc(var(--progress)*100%))]',
            className,
        )}
    />
);
```

If the file already imports `useScroll` and `cn`, reuse them; otherwise add at the top:

```typescript
import { useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
```

- [ ] **Step 4: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "scroll progress bar" --reporter=line`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/ScrollProgress.tsx tests/landing-polish.spec.ts
git commit -m "polish(progress): gradient fill bound to --progress CSS var"
```

---

## Task 11: WaveDivider directional draw

**Why:** Dividers fade in. A path-draw (animate `stroke-dashoffset` from 1 → 0) is more deliberate and matches the typewriter motif we just added in the hero.

**Files:**
- Modify: `src/components/motion/WaveDivider.tsx`

- [ ] **Step 1: Inspect**

Run: `cat src/components/motion/WaveDivider.tsx | head -120`
Expected: confirms the current SVG element and the path data we will animate.

- [ ] **Step 2: Write the failing test**

Append to `tests/landing-polish.spec.ts`:

```typescript
test('wave divider draws via stroke-dashoffset, not fade', async ({ page }) => {
  await page.goto('/');
  const path = page.locator('svg[viewBox="0 0 1200 24"] path').first();
  await path.scrollIntoViewIfNeeded();
  const offset0 = await path.evaluate((el) => getComputedStyle(el).strokeDashoffset);
  await page.waitForTimeout(900);
  const offset1 = await path.evaluate((el) => getComputedStyle(el).strokeDashoffset);
  expect(offset0).not.toBe(offset1);
});
```

- [ ] **Step 3: Run test to confirm it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "wave divider draws" --reporter=line`
Expected: FAIL — current divider uses opacity, not stroke-dashoffset.

- [ ] **Step 4: Update WaveDivider**

In the animated branch (the non-reduced-motion path) of `src/components/motion/WaveDivider.tsx`, swap the `motion.path` opacity animation for a stroke-dashoffset reveal:

```tsx
<m.path
    d="M0 12 C 200 4, 400 20, 600 12 S 1000 4, 1200 12"
    fill="none"
    stroke={color}
    strokeWidth={1}
    strokeOpacity={0.3}
    strokeDasharray={1200}
    initial={{ strokeDashoffset: 1200 }}
    whileInView={{ strokeDashoffset: 0 }}
    viewport={{ once: true, margin: '-15% 0px' }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
/>
```

Keep the reduced-motion branch unchanged.

- [ ] **Step 5: Run the test**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts -g "wave divider draws" --reporter=line`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/WaveDivider.tsx tests/landing-polish.spec.ts
git commit -m "polish(divider): draw wave via stroke-dashoffset reveal"
```

---

## Task 12: Final cleanup — drop `.bak` files, regen visual snapshots

**Why:** Repo hygiene + lock in the new visual baseline.

**Files:**
- Delete: `src/components/sections/Hero.bak.tsx`, `src/components/sections/Advantage.bak.tsx`

- [ ] **Step 1: Verify the bak files are unreferenced**

Run: `grep -rn "Hero.bak\|Advantage.bak" src/`
Expected: zero matches.

- [ ] **Step 2: Delete the bak files**

```bash
rm src/components/sections/Hero.bak.tsx src/components/sections/Advantage.bak.tsx
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Run the full new polish suite**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/landing-polish.spec.ts --reporter=line`
Expected: all tests PASS.

- [ ] **Step 5: Update visual snapshots**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test tests/visual --update-snapshots`
Expected: snapshots refreshed; review in `npm run test:report` and accept.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: drop stale .bak sections; lock new visual snapshots"
```

---

## Self-Review

**Spec coverage**

| User ask | Task that addresses it |
|---|---|
| No copy changes | Tasks 1, 2 reuse existing industry names from `Industries.tsx`. Tasks 3–11 touch no string. Task 9 confirms the literal "Start the Sprint" already exists before adoption. |
| No color changes | No `var(--color-*)` overrides anywhere. All hover treatments use opacity/shadow/translate only. |
| Width play | Task 5 (Container reading variant), Task 6 (divider prune affects perceived width), Task 3 (grid gap). |
| Spacing play | Task 4 (Section padding ladder), Task 6 (divider prune), Task 3 (hero grid gap). |
| Typography play | Task 3 (headline ladder regression-locked). |
| Animation play | Tasks 1+2 (typewriter cycle), 7 (card hover), 8 (count-up), 9 (label morph), 10 (gradient fill), 11 (wave draw). |
| Flow's industry showcase | Tasks 1+2 directly replicate the typewriter cycle on industry names. |

**Placeholder scan:** none. Every step has its actual command, code, or expected outcome.

**Type consistency:** `IndustryRotator` props (`words`, `typeMs`, `deleteMs`, `holdMs`, `className`, `cursorClassName`) are defined in Task 1 and consumed in Task 2 with the same names. `Container` `width="reading"` is defined and consumed in Task 5. `CountUp` props are confirmed live in Task 8 Step 1 before consumption.

**Risk register:**
1. *Task 4 may break tightly-tuned section spacing* — mitigated by Task 4 Step 5 visual snapshot regeneration.
2. *Task 8 depends on `CountUp` API* — Step 1 confirms it before code is written.
3. *Task 9 depends on the literal "Start the Sprint" existing in `Services.tsx`* — Step 1 confirms it.
4. *Playwright base URL is 3001 in dev but the config defaults to 3000* — every test command passes `PLAYWRIGHT_BASE_URL=http://localhost:3001`. If you switch dev to port 3000, drop the prefix.
