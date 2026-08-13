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
                            <p className="text-sm text-ink-muted mb-4">Proof · Selected engagements</p>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                                Five systems we put into production.
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <p className="mt-4 text-ink-light leading-relaxed">
                                Across Evidence Lens and Plant Loop. Numbers are measured where we have them
                                and marked illustrative where we do not.
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
