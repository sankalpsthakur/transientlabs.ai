'use client';

import Image from "next/image";

import { Button } from "@/components/ui/Button";
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
        icon: "/images/service-cto-v4.png",
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
        title: "Production-Grade MVP",
        label: "Sprint",
        duration: "3 weeks",
        price: "$4,999",
        description: "Ship a product-ready MVP with full-stack architecture, AI guardrails, and automated testing.",
        icon: "/images/service-sprint-v4.png",
        highlights: [
            "Product spec and UX flow",
            "Build, evals, and guardrails",
            "Launch, handoff, bug-fix window",
        ],
        note: "Limited slots. Fixed scope, fixed price.",
        featured: true,
        whoItsFor: "Solo founders and early teams shipping v1",
        nextStep: "We scope your MVP on a 20-min call",
    },
    {
        title: "Security Assessment",
        label: "Assessment",
        duration: "1 week",
        price: "$2,499",
        description: "VAPT and security architecture review with a prioritized remediation roadmap.",
        icon: "/images/service-sprint-v4.png",
        highlights: [
            "VAPT and architecture review",
            "Prioritized remediation roadmap",
            "Investor-ready summary",
        ],
        note: "Upgrade to full SOC2 certification from $49,999.",
        whoItsFor: "Pre-Series A teams entering enterprise",
        nextStep: "Free 15-min security review on the first call",
        ctaLabel: "Book Security Assessment",
    },
    {
        title: "Custom Scope",
        label: "Custom",
        duration: "Scoped",
        price: "Let’s talk",
        description: "Multi-role AI workflows, complex integrations, mobile, or enterprise requirements.",
        icon: "/images/service-agentic-v4.png",
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
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
                    <div className="lg:sticky lg:top-28">
                        <FadeIn>
                            <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
                                Services
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.08}>
                            <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                                Simple pricing, framed for real decisions
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.14}>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-light">
                                Fixed scope when the work is bounded. Retainer when leadership matters. Custom scope when the brief needs room.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="mt-8 rounded-[2rem] border border-border/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(10,10,10,0.06)] backdrop-blur-sm">
                                <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                    At a glance
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    {services.map((service) => (
                                        <div
                                            key={service.title}
                                            className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                                                service.featured
                                                    ? "border-ink/20 bg-paper-warm/80"
                                                    : "border-border/70 bg-white hover:border-ink/15"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                    {service.label}
                                                </p>
                                                <p className="font-mono text-xs text-ink-muted">
                                                    {service.duration}
                                                </p>
                                            </div>
                                            <div className="mt-3 flex items-end justify-between gap-3">
                                                <p className="text-lg font-semibold tracking-tight text-ink">
                                                    {service.price}
                                                </p>
                                                <p className="text-xs text-ink-muted text-right">
                                                    {service.whoItsFor}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="lg:pt-3">
                        <Stagger
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2"
                            staggerDelay={0.07}
                        >
                            {services.map((service) => (
                                <StaggerItem key={service.title}>
                                    <article
                                        className={`group flex h-full flex-col overflow-hidden rounded-[1.85rem] border bg-white/82 shadow-[0_10px_30px_rgba(10,10,10,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_22px_55px_rgba(10,10,10,0.1)] ${
                                            service.featured
                                                ? "border-ink/20 bg-[linear-gradient(180deg,#fffdf8_0%,#fff7ef_100%)]"
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

                                        <div className="relative border-b border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(237,230,221,0.85))] px-5 py-6 md:px-6">
                                            <div
                                                aria-hidden="true"
                                                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.55),transparent_45%)]"
                                            />
                                            <div className="relative flex h-28 items-center justify-center">
                                                <Image
                                                    src={service.icon}
                                                    alt={service.title}
                                                    width={112}
                                                    height={112}
                                                    className="h-24 w-24 object-contain drop-shadow-[0_24px_40px_rgba(10,10,10,0.18)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-2deg] md:h-28 md:w-28"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col px-5 py-4 md:px-6">
                                            <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                Proof artifacts
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

                                            <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-paper/45 p-4">
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
                                                className="group flex w-full items-center justify-between rounded-full border border-ink bg-ink px-4 py-3 text-left text-xs font-mono uppercase tracking-[0.26em] text-white transition-all duration-300 hover:bg-ink-light"
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

                <FadeIn delay={0.3}>
                    <div className="mt-16 text-center">
                        <Button variant="primary" size="lg" onClick={open}>
                            Request a Call
                        </Button>
                    </div>
                </FadeIn>
            </Container>
        </Section>
    );
}
