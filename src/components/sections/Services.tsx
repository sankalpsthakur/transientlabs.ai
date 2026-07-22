'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { useContactModal } from "@/lib/contact-modal-context";

const services = [
    {
        title: "Fractional CTO",
        label: "Retainer",
        duration: "Monthly",
        price: "$9,999/mo",
        description: "Senior technical leadership for AI products: architecture, roadmap, hiring, and reliability.",
        highlights: [
            "Architecture and roadmap",
            "Evals, guardrails, cost control",
            "Infra, security, reviews",
        ],
        note: "For teams that need a driver.",
        whoItsFor: "Funded teams scaling AI products",
        nextStep: "Free architecture review on the first call",
    },
    {
        title: "Product & Automation Sprint",
        label: "Sprint",
        duration: "6 weeks",
        price: "$15,000",
        description: "Ship a production-ready product or automation workflow with full-stack architecture, AI guardrails, and automated testing.",
        highlights: [
            "Product spec and workflow design",
            "Build, evals, and guardrails",
            "Launch, handoff, bug-fix window",
        ],
        note: "Limited slots. Fixed scope, fixed price.",
        featured: true,
        whoItsFor: "Teams shipping a bounded product or workflow",
        nextStep: "We scope the six-week delivery on a 20-min call",
    },
    {
        title: "SOC 2 Readiness",
        label: "Compliance",
        duration: "Fixed scope",
        price: "$3,000",
        description: "A focused SOC 2 readiness assessment with control gaps, evidence requirements, and a prioritized remediation roadmap.",
        highlights: [
            "Control and architecture review",
            "Evidence requirements",
            "Prioritized remediation roadmap",
        ],
        note: "Auditor and compliance-platform fees are separate.",
        whoItsFor: "Pre-Series A teams entering enterprise",
        nextStep: "Free 15-min readiness review on the first call",
        ctaLabel: "Book SOC 2 Readiness",
    },
    {
        title: "Industrial Energy Audit & Automation",
        label: "Industrial sprint",
        duration: "4 weeks",
        price: "$40,000",
        description: "One combined engagement covering the energy audit, industrial automation assessment and design, and an actionable innovation roadmap.",
        highlights: [
            "Energy baseline and opportunity audit",
            "Automation assessment and design",
            "Four-week innovation roadmap",
        ],
        note: "One fixed scope across energy, automation, and roadmap.",
        whoItsFor: "Industrial operators and energy-intensive sites",
        nextStep: "We confirm site boundaries and data access on the first call",
        ctaLabel: "Scope Industrial Sprint",
    },
    {
        title: "Custom Scope",
        label: "Custom",
        duration: "Scoped",
        price: "Let’s talk",
        description: "Multi-role AI workflows, complex integrations, mobile, or enterprise requirements.",
        highlights: [
            "Scoped roadmap and milestones",
            "APIs, tools, integrations",
            "Deployment options and support",
        ],
        note: "We’ll quote after a short call.",
        whoItsFor: "Enterprises and complex builds",
        nextStep: "Free discovery call — no commitment",
    },
];

export function Services() {
    const { open } = useContactModal();

    return (
        <Section
            id="services"
            className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f1e6_0%,#f3eadf_100%)]"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_32%),radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.55),transparent_24%)]"
            />

            <Container className="relative">
                <div>
                    <div className="mb-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <FadeIn>
                            <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
                                Services
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.08}>
                            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                                Simple pricing, framed for real decisions
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.14}>
                            <p className="max-w-xl text-base leading-relaxed text-ink-light lg:justify-self-end">
                                Fixed scope when the work is bounded. Retainer when leadership matters. Custom scope when the brief needs room.
                            </p>
                        </FadeIn>

                    </div>

                    <div>
                        <Stagger
                            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3"
                            staggerDelay={0.07}
                        >
                            {services.map((service) => (
                                <StaggerItem key={service.title} className="min-w-[84vw] snap-start md:min-w-0">
                                    <article
                                        className={`group flex h-full flex-col overflow-hidden rounded-[1.85rem] border bg-white/82 shadow-[0_10px_30px_rgba(10,10,10,0.05)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_22px_55px_rgba(10,10,10,0.1)] ${
                                            service.featured
                                                ? "border-ink/20 bg-[linear-gradient(180deg,#fffdf8_0%,#fff7ef_100%)] hover:ring-2 hover:ring-accent/30 hover:ring-offset-2 hover:ring-offset-paper"
                                                : "border-border/80"
                                        }`}
                                    >
                                        <div className="border-b border-border/70 px-5 pt-5 pb-4 md:px-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.32em] text-ink-muted">
                                                        {service.label}
                                                    </p>
                                                    <h3 className="mt-2 text-[1.9rem] leading-[1.03] font-semibold tracking-tight text-ink">
                                                        {service.title}
                                                    </h3>
                                                </div>
                                                {service.featured ? (
                                                    <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white">
                                                        Most requested
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="mt-5 flex items-end justify-between gap-4">
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                        Investment
                                                    </div>
                                                    <div className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                                                        {service.price}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                        Tempo
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium text-ink">
                                                        {service.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-light">
                                                {service.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-1 flex-col px-5 py-4 md:px-6">
                                            <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                What you get
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {service.highlights.map((item) => (
                                                    <div
                                                        key={item}
                                                        className="rounded-full border border-border bg-paper-warm/70 px-3 py-2 text-[13px] leading-tight text-ink transition-colors duration-300 group-hover:border-ink/15 group-hover:bg-white"
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 rounded-[1.1rem] border border-border/70 bg-paper/45 p-3">
                                                <p className="text-xs uppercase tracking-[0.26em] text-ink-muted">
                                                    Best for
                                                </p>
                                                <p className="mt-2 text-sm leading-relaxed text-ink-light">
                                                    {service.whoItsFor}
                                                </p>
                                            </div>
                                            <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.24em] text-ink-muted">
                                                {service.note}
                                            </p>
                                        </div>

                                        <div className="mt-auto border-t border-border/70 bg-paper-warm/55 px-5 py-4 md:px-6">
                                            <button
                                                type="button"
                                                onClick={open}
                                                className="group flex min-h-11 w-full items-center justify-between rounded-full border border-ink bg-ink px-4 py-3 text-left text-xs font-mono uppercase tracking-[0.26em] text-white transition-colors duration-300 hover:bg-ink-light"
                                            >
                                                <span>{service.ctaLabel ?? "Request a call"}</span>
                                                <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-0.5">
                                                    ›
                                                </span>
                                            </button>
                                            <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                                                {service.nextStep}
                                            </p>
                                        </div>
                                    </article>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>


            </Container>
        </Section>
    );
}
