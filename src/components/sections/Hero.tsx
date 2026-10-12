'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Headphones } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/Motion';
import { useContactModal } from '@/lib/contact-modal-context';
import { trackEvent } from '@/lib/analytics';

const collaborators = [
    { name: 'Climitra', src: '/images/logos/climitra.svg' },
    { name: 'Visusta', src: '/images/logos/visusta.png' },
    { name: 'Alan Scott Automation', src: '/images/logos/automation-logo.svg' },
    { name: 'Satwik Himalayan Products', src: '/images/logos/satwik-logo.svg' },
];

export function Hero() {
    const { open } = useContactModal();
    return (
        <section id="hero" className="relative overflow-hidden border-b border-border bg-paper pt-32 pb-14 sm:pt-40 sm:pb-20">
            <Container>
                <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                    <FadeIn>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">AI products · Workflow automation · Industrial systems</p>
                        <h1 className="mt-5 max-w-[15ch] text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-6xl xl:text-[4.4rem]">
                            Ship AI systems<br />your team can<br /><span className="text-accent">rely on.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-ink-light sm:text-lg">
                            Turn a manual workflow or product idea into a working system. A senior engineering team takes it from scope and integrations to testing, deployment, and handoff.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-4">
                            <Button size="lg" onClick={() => { trackEvent('cta_click', { cta_text: 'Scope my project', cta_location: 'hero' }); open(); }}>
                                Scope my project <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Link href="#latest-work" className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline" onClick={() => trackEvent('cta_click', { cta_text: 'See the work', cta_location: 'hero' })}>
                                See the work <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-ink-muted">Start with a focused scoping call. No commitment. Fees and scope agreed before build.</p>
                        <Link href="/the-deep-end" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-accent/25 text-sm text-accent transition-colors hover:text-ink" onClick={() => trackEvent('nav_click', { destination: 'Podcast', href: '/the-deep-end', location: 'hero' })}>
                            <Headphones className="h-4 w-4" /> Listen to The Deep End <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </FadeIn>
                    <FadeIn delay={0.08} className="lg:pt-8">
                        <aside className="border border-ink/15 bg-paper-alt p-6 sm:p-8" aria-label="What a delivery sprint includes">
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">A bounded build. A clear handoff.</p>
                            <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">Six weeks.<br />One agreed scope.</p>
                            <ul className="mt-6 space-y-4 border-y border-border py-6">
                                {['A working product or workflow', 'Integrations, evals, and cost controls', 'Your code, keys, and deployment'].map(item => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-light"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" />{item}</li>)}
                            </ul>
                            <p className="mt-5 text-sm leading-6 text-ink-muted">For plant and energy teams: a separate four-week assessment establishes the baseline, automation boundaries, and next steps.</p>
                            <Link href="/industrial-energy-automation" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:underline">Explore industrial engagement <ArrowRight className="h-4 w-4" /></Link>
                        </aside>
                    </FadeIn>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-border pt-7 sm:mt-14">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Selected collaborations</p>
                    {collaborators.map(logo => <Image key={logo.name} src={logo.src} alt={logo.name} width={130} height={32} sizes="130px" className="h-7 w-auto max-w-[130px] object-contain brightness-0 opacity-60" />)}
                </div>
            </Container>
        </section>
    );
}
