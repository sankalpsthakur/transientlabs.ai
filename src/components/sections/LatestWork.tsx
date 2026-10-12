'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Headphones } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FadeIn } from '@/components/ui/Motion';
import { trackEvent } from '@/lib/analytics';

export type PodcastSummary = { episodeCount: number; companionCount: number; cover: string };

const publicWork = [
    { name: 'gridload-compact', label: 'COMPACT AI · LOAD FORECASTING', description: 'Small quantile forecasting models with an ONNX service, frozen configurations, and published evaluation logs.', limit: 'Archive evaluation; no official ranking claimed.', href: 'https://github.com/sankalpsthakur/gridload-compact' },
    { name: '3W held-out-well', label: 'INDUSTRIAL AI · EVALUATION', description: 'A benchmark protocol that separates wells, publishes its split rules, and makes scoring inspectable.', limit: 'Research protocol; a path to evaluate before deployment.', href: 'https://github.com/sankalpsthakur/3w-held-out-well' },
];

export function LatestWork({ podcast }: { podcast: PodcastSummary }) {
    return (
        <Section id="latest-work" className="scroll-mt-24 border-b border-border bg-paper-alt" aria-labelledby="latest-work-title">
            <Container>
                <FadeIn>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Recently from the lab</p>
                    <h2 id="latest-work-title" className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Work you can inspect.</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-ink-light">Explore the engineering, read the evidence, and see how we approach a system before starting your own.</p>
                </FadeIn>
                <FadeIn delay={0.06}>
                    <article className="mt-10 grid overflow-hidden border border-ink/15 bg-ink text-paper md:grid-cols-[1fr_0.48fr]">
                        <div className="p-6 sm:p-9 lg:p-12">
                            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60"><Headphones className="h-4 w-4" /> The Deep End · With Sankalp Thakur</p>
                            <h3 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Go deep.<br />Then see how it works.</h3>
                            <p className="mt-5 max-w-xl text-sm leading-7 text-paper/75 sm:text-base">Engineering, industrial systems, AI, and mathematics—explained through long-form episodes and interactive working principles.</p>
                            <dl className="mt-7 flex flex-wrap gap-8 border-t border-paper/15 pt-5">
                                <div><dd className="text-3xl font-semibold tabular-nums">{podcast.episodeCount}</dd><dt className="mt-1 text-xs text-paper/60">Published episodes</dt></div>
                                <div><dd className="text-3xl font-semibold tabular-nums">{podcast.companionCount}</dd><dt className="mt-1 text-xs text-paper/60">Interactive explainers</dt></div>
                            </dl>
                            <Link href="/the-deep-end" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-paper px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper" onClick={() => trackEvent('cta_click', { cta_text: 'Explore the podcast', cta_location: 'latest_work' })}>Explore the podcast <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        <div className="relative min-h-64 border-t border-paper/15 md:border-t-0 md:border-l">
                            <Image src={podcast.cover} alt="The Deep End episode artwork: EUV lithography" fill sizes="(min-width: 768px) 32vw, 100vw" className="bg-[#101216] object-contain" />
                        </div>
                    </article>
                </FadeIn>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {publicWork.map(work => <article key={work.name} className="flex flex-col border border-border bg-paper p-6 sm:p-8">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">{work.label}</p>
                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{work.name}</h3>
                        <p className="mt-3 flex-grow text-sm leading-7 text-ink-light">{work.description}</p>
                        <p className="mt-4 text-xs leading-5 text-ink-muted">{work.limit}</p>
                        <a href={work.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:underline" onClick={() => trackEvent('outbound_click', { destination: work.name, url: work.href, location: 'latest_work' })}>Read the project <ArrowUpRight className="h-4 w-4" /><span className="sr-only">: {work.name} (opens in a new tab)</span></a>
                    </article>)}
                </div>
            </Container>
        </Section>
    );
}
