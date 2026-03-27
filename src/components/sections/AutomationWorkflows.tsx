'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";
import { WorkflowScrollGallery } from "@/components/sections/showcase/WorkflowScrollGallery";
import { openClawWorkflowTemplates } from "@/components/sections/showcase/openclawWorkflows";

export function AutomationWorkflows() {
    return (
        <div id="automation">
            <Section className="bg-paper">
                <Container>
                    <div className="max-w-2xl mb-16">
                        <FadeIn>
                            <p className="text-sm text-ink-muted mb-4">Workflow Automation</p>
                        </FadeIn>
                        <FadeIn delay={0.08}>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                                Automation that shows up on your P&amp;L
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.16}>
                            <p className="text-ink-light leading-relaxed mt-4">
                                We build end-to-end workflow automation across six domains — content, sales, support, finance, incidents, and onboarding.
                                Each system runs as a persistent agent on your infrastructure with memory across tasks, role-based policy, and measurable impact from week one.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-5">
                            <FadeIn>
                                <h3 className="text-xl font-medium text-ink">Workflows with receipts</h3>
                                <p className="text-sm text-ink-muted leading-relaxed mt-3">
                                    Every workflow below has a dollar figure attached. Not projections — measured outcomes from teams that replaced manual handoffs with deterministic playbooks.
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <div className="mt-8 grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-2xl md:text-3xl font-semibold text-ink">$210K</div>
                                        <div className="text-xs text-ink-muted">pipeline influenced</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-semibold text-ink">45%</div>
                                        <div className="text-xs text-ink-muted">faster first response</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-semibold text-ink">99.7%</div>
                                        <div className="text-xs text-ink-muted">recon match rate</div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="lg:col-span-7">
                            <FadeIn direction="right" delay={0.15}>
                                <p className="text-xs text-ink-muted uppercase tracking-widest mb-4 text-center">
                                    Scroll to see each system ↓
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </Container>
            </Section>

            <WorkflowScrollGallery workflows={openClawWorkflowTemplates} />
        </div>
    );
}
