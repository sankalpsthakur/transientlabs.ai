'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";
import { OptionB } from "./showcase/OptionB";

export function CaseStudies() {
    return (
        <>
            {/* ── Intro Section ── */}
            <Section id="work" className="bg-paper">
                <Container>
                    <div className="max-w-2xl mb-16">
                        <FadeIn>
                            <p className="text-sm text-ink-muted mb-4">Selected Work</p>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                                Case studies
                            </h2>
                        </FadeIn>
                    </div>

                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-5">
                                <FadeIn>
                                    <p className="text-xs text-ink-muted uppercase tracking-widest mb-3">
                                        Agentic Agency
                                    </p>
                                </FadeIn>
                                <FadeIn delay={0.08}>
                                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-4">
                                        Plugins + skills that deploy swarms across departments.
                                    </h3>
                                </FadeIn>
                                <FadeIn delay={0.12}>
                                    <p className="text-ink-light leading-relaxed">
                                        In the last 2 months, we turned workflows into reusable skills and packaged them as plugins.
                                        That&apos;s how we run delivery, content, QA, and outbound as coordinated teams of agents.
                                    </p>
                                </FadeIn>

                                <FadeIn delay={0.16}>
                                    <div className="mt-8 grid grid-cols-3 gap-6">
                                        <div>
                                            <div className="text-2xl md:text-3xl font-semibold text-ink">$20k</div>
                                            <div className="text-xs text-ink-muted">last 2 months</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl md:text-3xl font-semibold text-ink">67+</div>
                                            <div className="text-xs text-ink-muted">skills shipped</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl md:text-3xl font-semibold text-ink">4+</div>
                                            <div className="text-xs text-ink-muted">departments</div>
                                        </div>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={0.2}>
                                    <div className="mt-8">
                                        <a
                                            href="https://github.com/sankalpsthakur/plugins"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink border border-border px-4 py-3 hover:border-ink-muted hover:bg-paper-warm transition-colors"
                                        >
                                            GitHub repo <span className="text-base leading-none">›</span>
                                        </a>
                                    </div>
                                </FadeIn>
                            </div>

                            <div className="lg:col-span-7">
                                <FadeIn direction="right" delay={0.15}>
                                    <div className="rounded-2xl border border-border bg-white/60 px-5 py-5 text-left shadow-[0_18px_50px_-34px_rgba(84,69,56,0.32)] backdrop-blur-sm lg:ml-auto lg:max-w-md">
                                        <p className="text-xs text-ink-muted uppercase tracking-widest mb-2">
                                            Product gallery
                                        </p>
                                        <p className="text-sm leading-relaxed text-ink-light">
                                            Five recent builds are presented below as an interactive board rather than a long scroll rail.
                                            Each case opens into a larger mounted view with real screenshot detail.
                                        </p>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                    {/* ── Interactive Showcase ── */}
                    <div className="mt-14 md:mt-18">
                        <OptionB />
                    </div>
                </Container>
            </Section>
        </>
    );
}
