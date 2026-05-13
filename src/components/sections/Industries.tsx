'use client';

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Cpu, Factory, FlaskConical, PhoneCall, Rocket, Route } from "lucide-react";

const contexts = [
    {
        name: "Field work",
        detail: "Capture, approvals, photos, location, and exception handling where the work actually happens.",
        icon: Route,
        image: "/images/industries/field-work.png",
        imageAlt: "Field operator using a rugged tablet beside outdoor equipment",
    },
    {
        name: "Test stands",
        detail: "Telemetry, run logs, anomaly review, and evidence trails for engineering teams.",
        icon: FlaskConical,
        image: "/images/industries/test-stands.png",
        imageAlt: "Engineering test stand with machinery, sensors, and live telemetry screens",
    },
    {
        name: "Dealer calls",
        detail: "Service queues, warranty signals, CRM follow-up, and operator-facing summaries.",
        icon: PhoneCall,
        image: "/images/industries/dealer-calls.png",
        imageAlt: "Service desk operator managing dealer calls and warranty queues",
    },
    {
        name: "Production floors",
        detail: "Station views, shift handoffs, quality checks, and manager dashboards.",
        icon: Factory,
        image: "/images/industries/production-floors.png",
        imageAlt: "Production floor with operators, stations, and dashboard monitors",
    },
    {
        name: "Launch reviews",
        detail: "Supplier traceability, readiness checklists, signed actions, and review packets.",
        icon: Rocket,
        image: "/images/industries/launch-reviews.png",
        imageAlt: "Hard-tech launch review room with engineering drawings and readiness dashboards",
    },
    {
        name: "SaaS runtimes",
        detail: "Agents, evals, observability, roles, billing, and production-grade app architecture.",
        icon: Cpu,
        image: "/images/industries/saas-runtimes.png",
        imageAlt: "Operations room monitoring SaaS runtime dashboards and agent traces",
    },
];

export function Industries() {
    return (
        <Section id="industries" className="border-y border-border bg-paper-warm/45">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                    <FadeIn>
                        <div>
                            <p className="text-sm text-ink-muted">Industries we work with</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                                Built close to the work.
                            </h2>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.08}>
                        <p className="max-w-2xl text-base leading-7 text-ink-light lg:justify-self-end">
                            Field work, test stands, dealer calls, production floors, launch reviews, and SaaS runtimes all have different truths.
                        </p>
                    </FadeIn>
                </div>

                <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
                    {contexts.map((context) => {
                        const Icon = context.icon;
                        return (
                            <StaggerItem key={context.name}>
                                <article className="group h-full overflow-hidden rounded-[1.5rem] border border-border bg-white/75 shadow-[0_18px_48px_-38px_rgba(84,69,56,0.34)]">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                                        <Image
                                            src={context.image}
                                            alt={context.imageAlt}
                                            fill
                                            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 45vw, 92vw"
                                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                                        />
                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,13,0)_45%,rgba(24,18,13,0.32)_100%)]" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-semibold tracking-tight text-ink">{context.name}</h3>
                                                <p className="mt-3 text-sm leading-6 text-ink-light">{context.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </Container>
        </Section>
    );
}
