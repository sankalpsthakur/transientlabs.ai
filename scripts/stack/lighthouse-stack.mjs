#!/usr/bin/env node
/**
 * Lighthouse audit for /stack (desktop + mobile form factors).
 * Requires: npm i -D lighthouse chrome-launcher (or use npx)
 * Usage:
 *   npm run build && npm run start &
 *   node scripts/stack/lighthouse-stack.mjs http://localhost:3000/stack
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000/stack';
const outDir = path.join(__dirname, '../../docs/stack');

async function run() {
  let lighthouse;
  let chromeLauncher;
  try {
    lighthouse = (await import('lighthouse')).default;
    chromeLauncher = await import('chrome-launcher');
  } catch {
    console.error(
      'Missing lighthouse/chrome-launcher. Install:\n  npm i -D lighthouse chrome-launcher'
    );
    // Write a stub report with manual checklist
    writeManualReport(url);
    process.exit(0);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const results = [];

  for (const formFactor of ['desktop', 'mobile']) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor,
      screenEmulation:
        formFactor === 'mobile'
          ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 }
          : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
    };
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    const lhr = runnerResult.lhr;
    const scores = {
      formFactor,
      performance: lhr.categories.performance?.score,
      accessibility: lhr.categories.accessibility?.score,
      bestPractices: lhr.categories['best-practices']?.score,
      seo: lhr.categories.seo?.score,
      fcp: lhr.audits['first-contentful-paint']?.numericValue,
      lcp: lhr.audits['largest-contentful-paint']?.numericValue,
      tbt: lhr.audits['total-blocking-time']?.numericValue,
      cls: lhr.audits['cumulative-layout-shift']?.numericValue,
      tti: lhr.audits.interactive?.numericValue,
    };
    results.push(scores);
    fs.writeFileSync(
      path.join(outDir, `lighthouse-${formFactor}.json`),
      JSON.stringify(lhr, null, 2)
    );
  }

  writeSummary(url, results);
  console.log('Wrote docs/stack/PERFORMANCE.md');
}

function writeManualReport(target) {
  fs.mkdirSync(outDir, { recursive: true });
  const md = `# Physical Stack — Performance & QA report

**Target:** \`${target}\`  
**Generated:** ${new Date().toISOString()}  
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

\`\`\`bash
npm i -D lighthouse chrome-launcher
npm run build && npm run start
node scripts/stack/lighthouse-stack.mjs http://localhost:3000/stack
\`\`\`

## Engineering mitigations already in code

- \`StackCanvas\` mounts only near viewport; unmounts when far
- Device tier caps DPR (1 / 1.5 / 2)
- GSAP ScrollTrigger scrub + Lenis bridge
- Procedural geometry default; glTF opt-in via \`NEXT_PUBLIC_STACK_USE_GLTF\`
- \`prefers-reduced-motion\` freezes micro stages
- Scale ladder HUD is DOM (no extra WebGL)

## Android mid-tier checklist

1. Cold load \`/stack\` on 4GB Android (Chrome)
2. Confirm first paint of hero copy without white screen hang
3. Scroll through Orbit → Street; no multi-second jank freezes
4. Jump nav skips theatre
5. Open standalone \`/stack/nuclear\` deep link
6. Enable reduced motion OS setting — still readable
`;
  fs.writeFileSync(path.join(outDir, 'PERFORMANCE.md'), md);
  console.log('Wrote docs/stack/PERFORMANCE.md (manual checklist)');
}

function writeSummary(target, results) {
  const lines = [
    `# Physical Stack — Performance & QA report`,
    '',
    `**Target:** \`${target}\``,
    `**Generated:** ${new Date().toISOString()}`,
    '',
    '## Lighthouse scores',
    '',
    '| Form factor | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | TTI |',
    '|-------------|------|------|----|-----|-----|-----|-----|-----|-----|',
  ];
  for (const r of results) {
    const pct = (s) => (s == null ? '—' : Math.round(s * 100));
    const ms = (n) => (n == null ? '—' : `${Math.round(n)}ms`);
    lines.push(
      `| ${r.formFactor} | ${pct(r.performance)} | ${pct(r.accessibility)} | ${pct(r.bestPractices)} | ${pct(r.seo)} | ${ms(r.fcp)} | ${ms(r.lcp)} | ${ms(r.tbt)} | ${r.cls?.toFixed?.(3) ?? '—'} | ${ms(r.tti)} |`
    );
  }
  lines.push(
    '',
    '## Budget gate',
    '',
    '| Metric | Budget | Result |',
    '|--------|--------|--------|',
    '| TTI mobile | < 3000ms | see table |',
    '| LCP mobile | < 2500ms (good) | see table |',
    '',
    'Raw JSON: `docs/stack/lighthouse-desktop.json`, `docs/stack/lighthouse-mobile.json`',
    '',
    '## Android mid-tier QA',
    '',
    'See checklist in prior manual template — re-run on physical device after score gate.',
    ''
  );
  fs.writeFileSync(path.join(outDir, 'PERFORMANCE.md'), lines.join('\n'));
}

run().catch((e) => {
  console.error(e);
  writeManualReport(url);
});
