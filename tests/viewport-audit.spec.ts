import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const VIEWPORTS: Array<{ name: string; w: number; h: number }> = [
    { name: '360x800',   w: 360,  h: 800  },
    { name: '390x844',   w: 390,  h: 844  },
    { name: '414x896',   w: 414,  h: 896  },
    { name: '768x1024',  w: 768,  h: 1024 },
    { name: '1024x768',  w: 1024, h: 768  },
    { name: '1280x800',  w: 1280, h: 800  },
    { name: '1440x900',  w: 1440, h: 900  },
    { name: '1920x1080', w: 1920, h: 1080 },
];

const OUT_DIR = path.join(process.cwd(), 'test-results/viewport-audit');

test.describe.configure({ mode: 'serial' });

test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
});

for (const vp of VIEWPORTS) {
    test(`audit @ ${vp.name}`, async ({ page }) => {
        const issues: string[] = [];
        const warnings: string[] = [];

        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(900);

        // 1. Real horizontal overflow (the only "overflow" that actually matters).
        const overflow = await page.evaluate(() => {
            const doc = document.documentElement;
            return { scroll: doc.scrollWidth, client: doc.clientWidth, body: document.body.scrollWidth };
        });
        if (overflow.scroll > overflow.client + 1) {
            issues.push(`HORIZONTAL_OVERFLOW: scrollWidth=${overflow.scroll}, clientWidth=${overflow.client}`);
        }

        // 2. Hero primary CTA — try several selectors, accept any.
        const ctaCandidates = [
            'section#hero button:has-text("Request a Call")',
            'section#hero >> text=Request a Call',
            'header button:has-text("Request a Call")',
            'button:has-text("Request a Call")',
        ];
        let ctaFound = false;
        let ctaBox: { x: number; y: number; width: number; height: number } | null = null;
        for (const sel of ctaCandidates) {
            const el = page.locator(sel).first();
            try {
                if (await el.isVisible({ timeout: 800 })) {
                    ctaFound = true;
                    ctaBox = await el.boundingBox();
                    break;
                }
            } catch { /* try next */ }
        }
        if (!ctaFound) {
            issues.push('CTA_REQUEST_A_CALL_NOT_VISIBLE');
        } else if (ctaBox && (ctaBox.x < 0 || ctaBox.x + ctaBox.width > vp.w + 2)) {
            issues.push(`CTA_CLIPPED_X: box=${JSON.stringify(ctaBox)} vp=${vp.w}`);
        }

        // 3. Studio reel video must be visible + full bleed.
        const heroVideo = page.locator('section[aria-label*="motion"] video').first();
        try {
            await expect(heroVideo).toBeVisible({ timeout: 4000 });
            const vb = await heroVideo.boundingBox();
            if (!vb || vb.width < vp.w - 4) {
                issues.push(`VIDEO_NOT_FULL_WIDTH: width=${vb?.width}, vp=${vp.w}`);
            }
            // Aspect ratio sanity — 2.17:1 cinematic. At any viewport it should be at least 1.5:1.
            if (vb && vb.height > 0) {
                const ratio = vb.width / vb.height;
                if (ratio < 1.4 || ratio > 4.0) {
                    warnings.push(`VIDEO_ASPECT_OUTLIER: ${ratio.toFixed(2)}:1 (w=${vb.width} h=${vb.height})`);
                }
            }
        } catch {
            issues.push('VIDEO_NOT_FOUND');
        }

        // 4. Mobile sticky CTA — should appear at <md (768px) after hero is scrolled past.
        if (vp.w < 768) {
            await page.evaluate(() => window.scrollTo(0, Math.max(window.innerHeight, document.body.scrollHeight / 3)));
            await page.waitForTimeout(700);
            const sticky = page.locator('div.fixed.bottom-0').filter({ has: page.locator('button') });
            const visible = await sticky.first().isVisible({ timeout: 2000 }).catch(() => false);
            if (!visible) {
                issues.push('STICKY_CTA_NOT_VISIBLE_ON_MOBILE');
            } else {
                const sb = await sticky.first().boundingBox();
                if (sb && (sb.x < -1 || sb.x + sb.width > vp.w + 2)) {
                    issues.push(`STICKY_CTA_CLIPPED_X: ${JSON.stringify(sb)}`);
                }
            }
        }

        // 5. Industries cards count.
        const cardCount = await page.locator('section#industries article').count();
        if (cardCount !== 6) {
            issues.push(`INDUSTRY_CARDS_WRONG_COUNT: ${cardCount}`);
        }

        // 6. Hero h1 has body and isn't clipped.
        const h1 = page.locator('section#hero h1').first();
        const h1Box = await h1.boundingBox();
        if (!h1Box || h1Box.width < 100 || h1Box.height < 30) {
            issues.push(`HERO_H1_CLIPPED: ${JSON.stringify(h1Box)}`);
        }

        // 7. Rotator pill fits its container at this width.
        const rotator = page.locator('[data-testid="industry-rotator"]').first();
        const rotatorVisible = await rotator.isVisible().catch(() => false);
        if (rotatorVisible) {
            const rb = await rotator.boundingBox();
            if (rb && (rb.x < 0 || rb.x + rb.width > vp.w + 2)) {
                issues.push(`ROTATOR_CLIPPED: right=${rb ? rb.x + rb.width : '?'} vp=${vp.w}`);
            }
        } else if (vp.w >= 640) {
            // Rotator is `sm:inline` only — hidden below 640. Above 640 it should be visible.
            warnings.push('ROTATOR_HIDDEN_AT_GTE_SM');
        }

        // 8. Header brand mark visible.
        const brand = page.locator('header a:has-text("Transient Labs")').first();
        const brandVisible = await brand.isVisible().catch(() => false);
        if (!brandVisible) {
            warnings.push('HEADER_BRAND_HIDDEN');
        }

        // 9. IndustryShowcase band is visible, sits between Hero and HeroVideo, and is "big enough".
        const showcase = page.locator('[data-testid="industry-showcase"]').first();
        const showcaseVisible = await showcase.isVisible({ timeout: 3000 }).catch(() => false);
        if (!showcaseVisible) {
            issues.push('INDUSTRY_SHOWCASE_NOT_VISIBLE');
        } else {
            const sb = await showcase.boundingBox();
            const heroBox = await page.locator('section#hero').first().boundingBox();
            const videoSection = await page.locator('section[aria-label*="motion"]').first().boundingBox();
            if (sb && heroBox && sb.y + 4 < heroBox.y + heroBox.height) {
                issues.push(`SHOWCASE_BEFORE_HERO_END: showcase.y=${sb.y} hero.bottom=${heroBox.y + heroBox.height}`);
            }
            if (sb && videoSection && sb.y > videoSection.y + 2) {
                issues.push(`SHOWCASE_AFTER_VIDEO_START: showcase.y=${sb.y} video.y=${videoSection.y}`);
            }
            const headline = page.locator('[data-testid="industry-showcase-headline"]').first();
            if (await headline.isVisible().catch(() => false)) {
                const fontPx = await headline.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
                const minExpected = vp.w >= 768 ? 48 : 36;
                if (fontPx < minExpected - 1) {
                    issues.push(`SHOWCASE_HEADLINE_TOO_SMALL: ${fontPx}px (expected >= ${minExpected}px at viewport ${vp.w})`);
                }
            } else {
                issues.push('SHOWCASE_HEADLINE_MISSING');
            }
            if (sb && (sb.x < -1 || sb.x + sb.width > vp.w + 2)) {
                issues.push(`SHOWCASE_CLIPPED_X: ${JSON.stringify(sb)}`);
            }
        }

        // Per-section visual captures. Each is one viewport tall.
        const sections = [
            { name: 'hero', selector: 'section#hero' },
            { name: 'showcase', selector: '[data-testid="industry-showcase"]' },
            { name: 'video', selector: 'section[aria-label*="motion"]' },
            { name: 'industries', selector: 'section#industries' },
            { name: 'work', selector: 'section#work' },
            { name: 'services', selector: 'section#services' },
        ];
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        for (const s of sections) {
            const el = page.locator(s.selector).first();
            const present = (await el.count()) > 0;
            if (!present) continue;
            await el.scrollIntoViewIfNeeded();
            await page.waitForTimeout(400);
            try {
                await page.screenshot({
                    path: path.join(OUT_DIR, `${vp.name}-${s.name}.jpg`),
                    fullPage: false,
                    type: 'jpeg',
                    quality: 78,
                });
            } catch (e) {
                warnings.push(`SCREENSHOT_FAIL_${s.name}: ${(e as Error).message.slice(0, 80)}`);
            }
        }
        // Above-the-fold (top of page).
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        await page.screenshot({
            path: path.join(OUT_DIR, `${vp.name}-top.jpg`),
            fullPage: false,
            type: 'jpeg',
            quality: 78,
        });

        fs.writeFileSync(
            path.join(OUT_DIR, `${vp.name}.json`),
            JSON.stringify({ viewport: vp, issues, warnings, overflow }, null, 2),
        );

        // Soft-assert — collect issues but do not abort the suite.
        // Hard fail only if there's a real horizontal overflow or video missing.
        const hardFails = issues.filter((i) => i.startsWith('HORIZONTAL_OVERFLOW') || i.startsWith('VIDEO_NOT_FOUND') || i.startsWith('VIDEO_NOT_FULL_WIDTH'));
        if (hardFails.length > 0) {
            // Re-throw so CI catches the worst issues, but file the full list.
            throw new Error(`HARD viewport issues @ ${vp.name}:\n  - ${hardFails.join('\n  - ')}\nAll issues: ${JSON.stringify(issues)}`);
        }
        if (issues.length > 0) {
            console.log(`SOFT issues @ ${vp.name}:`, issues);
        }
        if (warnings.length > 0) {
            console.log(`Warnings @ ${vp.name}:`, warnings);
        }
    });
}

test('audit summary', async () => {
    const summary: Record<string, { issues: string[]; warnings: string[] }> = {};
    for (const vp of VIEWPORTS) {
        const jsonPath = path.join(OUT_DIR, `${vp.name}.json`);
        if (fs.existsSync(jsonPath)) {
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            summary[vp.name] = { issues: data.issues || [], warnings: data.warnings || [] };
        }
    }
    fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log('\n=== VIEWPORT AUDIT SUMMARY ===');
    for (const [name, { issues, warnings }] of Object.entries(summary)) {
        const status = issues.length === 0 ? '✓' : '✗';
        console.log(`${status} ${name}: ${issues.length} issues, ${warnings.length} warnings`);
        for (const i of issues) console.log(`    - ${i}`);
        for (const w of warnings) console.log(`    ~ ${w}`);
    }
});
