'use client';

import { IndustryRotator } from '@/components/motion/IndustryRotator';
import { INDUSTRY_NAMES } from '@/lib/industries';

export function IndustryShowcase() {
    return (
        <section
            data-testid="industry-showcase"
            aria-label="Industries we build for"
            className="relative w-full bg-paper py-14 sm:py-20 md:py-24 lg:py-28 overflow-hidden"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted sm:text-xs">
                    Built for
                </p>
                <h2
                    data-testid="industry-showcase-headline"
                    className="mt-4 font-semibold tracking-[-0.04em] leading-[1] text-ink text-[clamp(2.25rem,8vw,5rem)] sm:mt-6"
                >
                    <IndustryRotator
                        words={[...INDUSTRY_NAMES]}
                        className="text-accent"
                        cursorClassName="inline-block w-[0.06em] h-[0.85em] -mb-[0.05em] ml-[0.05em] bg-current align-baseline"
                    />
                </h2>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
        </section>
    );
}
