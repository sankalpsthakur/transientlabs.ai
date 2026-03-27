# Transient Labs Brand Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved Transient Labs brand system as production-ready assets and integrate it into the Next.js website while cleaning transient screenshot artifacts from the repo workspace.

**Architecture:** Use static brand assets under `public/brand/` as the durable delivery set, backed by a small `site-brand` module for shared copy and asset paths plus thin React brand components for UI reuse. Update the shared header/footer, global metadata, homepage schema, and manifest to consume those assets, then verify with Playwright and conservative cleanup rules.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Playwright

---

## File Structure

**Create**
- `public/brand/lockup/transient-labs-lockup-light.svg`
- `public/brand/lockup/transient-labs-lockup-dark.svg`
- `public/brand/lockup/transient-labs-lockup-mono.svg`
- `public/brand/symbol/transient-labs-symbol-light.svg`
- `public/brand/symbol/transient-labs-symbol-dark.svg`
- `public/brand/symbol/transient-labs-symbol-mono.svg`
- `public/brand/wordmark/transient-labs-wordmark-light.svg`
- `public/brand/wordmark/transient-labs-wordmark-dark.svg`
- `public/brand/wordmark/transient-labs-wordmark-mono.svg`
- `public/brand/favicon/favicon.ico`
- `public/brand/favicon/apple-touch-icon.png`
- `public/brand/favicon/icon-16.png`
- `public/brand/favicon/icon-32.png`
- `public/brand/favicon/icon-192.png`
- `public/brand/favicon/icon-512.png`
- `public/brand/social/og-default.png`
- `public/brand/social/twitter-default.png`
- `src/lib/site-brand.ts`
- `src/components/brand/BrandLogo.tsx`
- `scripts/ci/check-brand-assets.mjs`
- `.github/workflows/brand-system.yml`
- `tests/brand-system.spec.ts`
- `.gitignore`

**Modify**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `public/site.webmanifest`

**Optional audit follow-up after main rollout is green**
- `src/app/blog/[slug]/page.tsx`
- `src/app/solutions/[slug]/page.tsx`
- `src/app/glossary/[term]/page.tsx`
- `src/app/compare/[slug]/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`

---

### Task 1: Lock Brand Copy and Shared Asset Registry

**Files:**
- Create: `src/lib/site-brand.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/brand-system.spec.ts`

- [ ] **Step 1: Write the failing Playwright test for global brand signals**

```ts
import { expect, test } from '@playwright/test';

test('site exposes the approved brand identity in primary surfaces', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByLabel(/transient labs logo/i).first()).toBeVisible();
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', /brand\/favicon|favicon\.ico/);
});
```

- [ ] **Step 2: Run the new test to confirm it fails against the current text-only branding**

Run: `npx playwright test tests/brand-system.spec.ts -g "site exposes the approved brand identity in primary surfaces"`

Expected: FAIL because there is no reusable logo with accessible labeling and the favicon/brand asset paths are not yet updated.

- [ ] **Step 3: Create the shared site-brand module**

Create `src/lib/site-brand.ts` with the approved values:

```ts
export const siteBrand = {
  name: 'Transient Labs',
  descriptor: 'Agentic Systems and Product Studio',
  tagline: 'Eternal Transience of Intelligence',
  siteUrl: 'https://100xai.engineering',
  assets: {
    lockupLight: '/brand/lockup/transient-labs-lockup-light.svg',
    lockupDark: '/brand/lockup/transient-labs-lockup-dark.svg',
    lockupMono: '/brand/lockup/transient-labs-lockup-mono.svg',
    symbolLight: '/brand/symbol/transient-labs-symbol-light.svg',
    symbolDark: '/brand/symbol/transient-labs-symbol-dark.svg',
    symbolMono: '/brand/symbol/transient-labs-symbol-mono.svg',
    wordmarkLight: '/brand/wordmark/transient-labs-wordmark-light.svg',
    favicon: '/brand/favicon/favicon.ico',
    appleTouchIcon: '/brand/favicon/apple-touch-icon.png',
    manifestIcon192: '/brand/favicon/icon-192.png',
    manifestIcon512: '/brand/favicon/icon-512.png',
    ogDefault: '/brand/social/og-default.png',
    twitterDefault: '/brand/social/twitter-default.png',
  },
} as const;
```

- [ ] **Step 4: Update layout metadata and homepage schema to read from the shared brand module**

Implementation requirements:
- replace direct string duplication in `src/app/layout.tsx`
- stop using `/images/hero-v4.png` as the global logo/OG stand-in
- update `src/app/page.tsx` JSON-LD `Organization.logo` to use the approved brand asset path

- [ ] **Step 5: Run the brand-system test again**

Run: `npx playwright test tests/brand-system.spec.ts -g "site exposes the approved brand identity in primary surfaces"`

Expected: Still FAIL or partially fail until the actual asset files and UI integration are added in later tasks.

- [ ] **Step 6: Commit the shared brand registry changes**

```bash
git add src/lib/site-brand.ts src/app/layout.tsx src/app/page.tsx tests/brand-system.spec.ts
git commit -m "feat: add site brand registry"
```

---

### Task 2: Create Durable Brand Assets and Thin UI Components

**Files:**
- Create: `public/brand/lockup/transient-labs-lockup-light.svg`
- Create: `public/brand/lockup/transient-labs-lockup-dark.svg`
- Create: `public/brand/lockup/transient-labs-lockup-mono.svg`
- Create: `public/brand/symbol/transient-labs-symbol-light.svg`
- Create: `public/brand/symbol/transient-labs-symbol-dark.svg`
- Create: `public/brand/symbol/transient-labs-symbol-mono.svg`
- Create: `public/brand/wordmark/transient-labs-wordmark-light.svg`
- Create: `public/brand/wordmark/transient-labs-wordmark-dark.svg`
- Create: `public/brand/wordmark/transient-labs-wordmark-mono.svg`
- Create: `src/components/brand/BrandLogo.tsx`
- Test: `tests/brand-system.spec.ts`

- [ ] **Step 1: Add a failing test for reusable logo rendering**

Extend `tests/brand-system.spec.ts`:

```ts
test('header and footer use labeled reusable brand assets', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const logos = page.getByLabel(/transient labs logo/i);
  await expect(logos).toHaveCount(2);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/brand-system.spec.ts -g "header and footer use labeled reusable brand assets"`

Expected: FAIL because header/footer still render plain text.

- [ ] **Step 3: Create the approved SVG asset family under `public/brand/`**

Requirements:
- Long Exposure symbol geometry only
- Precise grotesk wordmark
- Modular Inline as the primary lockup
- descriptor text exactly `Agentic Systems and Product Studio`
- light, dark, and mono variants

- [ ] **Step 4: Create the thin reusable brand component**

Create `src/components/brand/BrandLogo.tsx`:

```tsx
type BrandLogoVariant = 'lockup' | 'wordmark' | 'symbol';
type BrandLogoTone = 'light' | 'dark' | 'mono';

export function BrandLogo({
  variant = 'lockup',
  tone = 'light',
  className,
  alt = 'Transient Labs logo',
}: {
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  className?: string;
  alt?: string;
}) {
  // Map variant/tone to siteBrand asset paths and render a single accessible image.
}
```

- [ ] **Step 5: Re-run the reusable logo test**

Run: `npx playwright test tests/brand-system.spec.ts -g "header and footer use labeled reusable brand assets"`

Expected: Still FAIL until header/footer import the component in Task 3.

- [ ] **Step 6: Commit the asset family and component**

```bash
git add public/brand src/components/brand/BrandLogo.tsx tests/brand-system.spec.ts
git commit -m "feat: add transient labs brand assets"
```

---

### Task 3: Integrate the New Brand System into Shared Layout Surfaces

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/brand-system.spec.ts`

- [ ] **Step 1: Add failing assertions for the specific shared surfaces**

Extend `tests/brand-system.spec.ts`:

```ts
test('header uses a compact brand lockup without wrapping', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const headerLogo = page.locator('header').getByLabel(/transient labs logo/i);
  await expect(headerLogo).toBeVisible();
});

test('footer uses the approved brand lockup and tagline', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('footer')).toContainText('Eternal Transience of Intelligence');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx playwright test tests/brand-system.spec.ts -g "header uses a compact brand lockup without wrapping|footer uses the approved brand lockup and tagline"`

Expected: FAIL because the old text-only header/footer are still in place.

- [ ] **Step 3: Update the header to use the approved reusable brand component**

Implementation requirements:
- replace the plain `Transient Labs` text in `Header.tsx`
- keep click target simple and accessible
- use a compact logo treatment that does not break desktop or mobile layout
- preserve all current nav and menu behavior

- [ ] **Step 4: Update the footer to use the new lockup plus approved tagline**

Implementation requirements:
- replace the plain text brand block
- show `Eternal Transience of Intelligence`
- remove or rewrite stale prompt text that references the older brand framing where necessary
- maintain hierarchy of location, response-time, and AI-strip content

- [ ] **Step 5: Re-run the shared surface tests**

Run: `npx playwright test tests/brand-system.spec.ts -g "header uses a compact brand lockup without wrapping|footer uses the approved brand lockup and tagline"`

Expected: PASS

- [ ] **Step 6: Commit the shared layout integration**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx src/app/layout.tsx tests/brand-system.spec.ts
git commit -m "feat: integrate transient labs brand into shared layout"
```

---

### Task 4: Update Manifest, Favicon, and Social Preview Defaults

**Files:**
- Create: `public/brand/favicon/favicon.ico`
- Create: `public/brand/favicon/apple-touch-icon.png`
- Create: `public/brand/favicon/icon-16.png`
- Create: `public/brand/favicon/icon-32.png`
- Create: `public/brand/favicon/icon-192.png`
- Create: `public/brand/favicon/icon-512.png`
- Create: `public/brand/social/og-default.png`
- Create: `public/brand/social/twitter-default.png`
- Modify: `public/site.webmanifest`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/brand-system.spec.ts`

- [ ] **Step 1: Add failing metadata/manifest coverage**

Extend `tests/brand-system.spec.ts`:

```ts
test('manifest and metadata point to production brand assets', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /brand\/favicon\/apple-touch-icon\.png/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /brand\/social\/og-default\.png/);
});
```

- [ ] **Step 2: Run the test to confirm current failure**

Run: `npx playwright test tests/brand-system.spec.ts -g "manifest and metadata point to production brand assets"`

Expected: FAIL because `apple-touch-icon.png` is missing and global metadata still points to old assets.

- [ ] **Step 3: Generate or export the favicon/social asset set**

Requirements:
- favicon family from the standalone Long Exposure symbol
- `og-default.png` and `twitter-default.png` visually aligned with the approved identity
- store all files under `public/brand/`

- [ ] **Step 4: Update `public/site.webmanifest` to the new icon set and brand description**

Use:
- name: `Transient Labs`
- short name: `Transient`
- description: `Agentic Systems and Product Studio. Eternal Transience of Intelligence.`
- icons: 192 and 512 PNG entries from `public/brand/favicon/`
- background/theme colors aligned with the approved palette

- [ ] **Step 5: Update global metadata and homepage JSON-LD to use new paths**

Requirements:
- stop using `hero-v4.png` as a logo/preview fallback
- use `siteBrand.assets.ogDefault` and favicon paths
- keep `metadataBase` and title structure intact unless domain work is explicitly in scope

- [ ] **Step 6: Re-run the metadata test**

Run: `npx playwright test tests/brand-system.spec.ts -g "manifest and metadata point to production brand assets"`

Expected: PASS

- [ ] **Step 7: Commit the metadata and favicon rollout**

```bash
git add public/site.webmanifest public/brand src/app/layout.tsx src/app/page.tsx tests/brand-system.spec.ts
git commit -m "feat: ship transient labs metadata and favicon assets"
```

---

### Task 5: Add Final Brand-System Verification

**Files:**
- Modify: `tests/brand-system.spec.ts`

- [ ] **Step 1: Add one viewport-fit regression test**

```ts
test('header brand lockup stays within the desktop header bounds', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const header = page.locator('header');
  const logo = header.getByLabel(/transient labs logo/i);

  const headerBox = await header.boundingBox();
  const logoBox = await logo.boundingBox();

  expect(headerBox).not.toBeNull();
  expect(logoBox).not.toBeNull();
  expect(logoBox!.width).toBeLessThan(headerBox!.width / 2);
});
```

- [ ] **Step 2: Add one mobile fallback test**

```ts
test('mobile header still exposes the brand clearly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('header').getByLabel(/transient labs logo/i)).toBeVisible();
});
```

- [ ] **Step 3: Run the full brand test file**

Run: `npx playwright test tests/brand-system.spec.ts`

Expected: PASS

- [ ] **Step 4: Commit the final verification coverage**

```bash
git add tests/brand-system.spec.ts
git commit -m "test: add brand system verification coverage"
```

---

### Task 6: Add Ignore Rules and Remove Transient Screenshot Clutter

**Files:**
- Create: `.gitignore`
- Delete locally: root-level `advantage-*.png`
- Delete locally: root-level `agent-teams*.png`
- Delete locally: root-level `agentteams-*.png`
- Delete locally: root-level `case-studies-*.png`
- Delete locally: root-level `desktop-full-*.png`
- Delete locally: root-level `hero-*.png`
- Delete locally: root-level `operations-dashboard-*.png`
- Delete locally: root-level `painpoints-*.png`
- Delete locally: root-level `services-*.png`

- [ ] **Step 1: Write the ignore file**

Create `.gitignore` with at least:

```gitignore
.next/
.superpowers/
test-results/
tsconfig.tsbuildinfo
/advantage-*.png
/agent-teams*.png
/agentteams-*.png
/case-studies-*.png
/desktop-full-*.png
/hero-*.png
/operations-dashboard-*.png
/painpoints-*.png
/services-*.png
```

- [ ] **Step 2: Verify the deletion target list before removing files**

Run:

```bash
find . -maxdepth 1 -type f \( \
  -name 'advantage-*.png' -o \
  -name 'agent-teams*.png' -o \
  -name 'agentteams-*.png' -o \
  -name 'case-studies-*.png' -o \
  -name 'desktop-full-*.png' -o \
  -name 'hero-*.png' -o \
  -name 'operations-dashboard-*.png' -o \
  -name 'painpoints-*.png' -o \
  -name 'services-*.png' \
\) | sort
```

Expected: Only transient screenshot artifacts at repo root.

- [ ] **Step 3: Remove the transient screenshot artifacts locally**

Run:

```bash
find . -maxdepth 1 -type f \( \
  -name 'advantage-*.png' -o \
  -name 'agent-teams*.png' -o \
  -name 'agentteams-*.png' -o \
  -name 'case-studies-*.png' -o \
  -name 'desktop-full-*.png' -o \
  -name 'hero-*.png' -o \
  -name 'operations-dashboard-*.png' -o \
  -name 'painpoints-*.png' -o \
  -name 'services-*.png' \
\) -delete
```

- [ ] **Step 4: Confirm the files are gone and only production assets remain**

Run: `find . -maxdepth 1 -type f | sort`

Expected: Root no longer contains transient screenshot captures.

- [ ] **Step 5: Commit the ignore rules when the real repo root is available**

```bash
git add .gitignore
git commit -m "chore: ignore transient screenshot artifacts"
```

---

### Task 7: Production Verification

**Files:**
- Modify: any files above as needed based on verification findings

- [ ] **Step 1: Run the focused test file**

Run: `npx playwright test tests/brand-system.spec.ts`

Expected: PASS

- [ ] **Step 2: Run the existing visual regression specs**

Run: `npm test -- --project=chromium-desktop`

Expected: PASS or only unrelated pre-existing failures.

- [ ] **Step 3: Run a production build**

Run: `npm run build`

Expected: PASS with no missing asset-path or metadata errors.

- [ ] **Step 4: Manually inspect the homepage header/footer and browser metadata**

Check:
- header brand clarity on desktop and mobile
- footer lockup and tagline hierarchy
- favicon/apple touch icon references
- manifest output
- OG image/default social card path usage

- [ ] **Step 5: Commit the final production-readiness pass**

```bash
git add public/brand src/app src/components src/lib tests .gitignore public/site.webmanifest
git commit -m "feat: make transient labs brand system production-ready"
```

---

### Task 8: Bake Brand Verification into CI/CD

**Files:**
- Create: `scripts/ci/check-brand-assets.mjs`
- Create: `.github/workflows/brand-system.yml`
- Modify: `package.json` (optional, only if a dedicated `test:brand` script materially improves clarity)
- Test: `tests/brand-system.spec.ts`

- [ ] **Step 1: Write a deterministic asset inventory check**

Create `scripts/ci/check-brand-assets.mjs` that fails when required files are missing. The check should include at least:

```js
const required = [
  'public/brand/lockup/transient-labs-lockup-light.svg',
  'public/brand/lockup/transient-labs-lockup-dark.svg',
  'public/brand/lockup/transient-labs-lockup-mono.svg',
  'public/brand/symbol/transient-labs-symbol-light.svg',
  'public/brand/symbol/transient-labs-symbol-dark.svg',
  'public/brand/symbol/transient-labs-symbol-mono.svg',
  'public/brand/wordmark/transient-labs-wordmark-light.svg',
  'public/brand/favicon/favicon.ico',
  'public/brand/favicon/apple-touch-icon.png',
  'public/brand/favicon/icon-192.png',
  'public/brand/favicon/icon-512.png',
  'public/brand/social/og-default.png',
  'public/brand/social/twitter-default.png',
];
```

- [ ] **Step 2: Verify the asset inventory script fails before all assets exist**

Run: `node scripts/ci/check-brand-assets.mjs`

Expected: FAIL until the asset family is present.

- [ ] **Step 3: Create a GitHub Actions workflow for brand checks**

Create `.github/workflows/brand-system.yml` that:
- installs dependencies
- runs the asset inventory check
- runs `npx playwright test tests/brand-system.spec.ts`

Keep the workflow scoped to brand readiness. Do not turn it into a generic full-CI replacement.

- [ ] **Step 4: Re-run the asset inventory check locally**

Run: `node scripts/ci/check-brand-assets.mjs`

Expected: PASS once Task 2 and Task 4 assets exist.

- [ ] **Step 5: Re-run the brand Playwright file locally as the CI proxy**

Run: `npx playwright test tests/brand-system.spec.ts`

Expected: PASS

- [ ] **Step 6: Commit the CI/CD brand enforcement**

```bash
git add .github/workflows/brand-system.yml scripts/ci/check-brand-assets.mjs package.json tests/brand-system.spec.ts
git commit -m "ci: add brand system verification checks"
```
