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
                    <div className="max-w-2xl mb-10">
                        <FadeIn>
                            <p className="text-sm text-ink-muted mb-4">Selected Work</p>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                                Case studies
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <p className="mt-4 text-ink-light leading-relaxed">
                                Five recent production builds — real screens, not mockups.
                            </p>
                        </FadeIn>
                    </div>

                    {/* ── Interactive Showcase ── */}
                    <OptionB />
                </Container>
            </Section>
        </>
    );
}
