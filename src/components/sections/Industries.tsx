'use client';

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Cpu, Factory, Gauge, Leaf, ShoppingCart, Wrench } from "lucide-react";

const contexts = [
    {
        name: "Biochar",
        signal: "Kiln batches, buyer evidence, carbon receipts.",
        detail: "MRV, feedstock intake, batch evidence, buyer workflows, and carbon-credit reporting.",
        icon: Leaf,
        image: "/images/industries/field-work.png",
        imageAlt: "Biochar kiln batches with buyer evidence and carbon receipts",
    },
    {
        name: "Submersible pumps",
        signal: "Dealer queues and field service made visible.",
        detail: "Dealer operations, service telemetry, warranty intelligence, and field-team dashboards.",
        icon: Gauge,
        image: "/images/industries/test-stands.png",
        imageAlt: "Submersible pump cutaway with telemetry and warranty queue",
    },
    {
        name: "Retail",
        signal: "Demand signals instead of stale reports.",
        detail: "Inventory copilots, CRM automation, demand signals, and store-level operating views.",
        icon: ShoppingCart,
        image: "/images/industries/dealer-calls.png",
        imageAlt: "Retail aisle with demand signal and inventory command overlay",
    },
    {
        name: "Hardware programs",
        signal: "BOM changes, routings, and station work made executable.",
        detail: "Forge-style systems for EBOM-to-MBOM handoff, ECO review, supplier impact, routing release, line readiness, traveler signoff, and signed audit trails.",
        icon: Wrench,
        image: "/images/industries/launch-reviews.png",
        imageAlt: "Hard-tech test stand with BOM, routing, supplier impact, and line-readiness evidence",
    },
    {
        name: "Industrial teams",
        signal: "Plant-floor exceptions with owners attached.",
        detail: "Ops dashboards, audit trails, maintenance workflows, and manager-facing control planes.",
        icon: Factory,
        image: "/images/industries/production-floors.png",
        imageAlt: "Industrial plant floor with exception queues and operations control",
    },
    {
        name: "AI-native SaaS",
        signal: "Agentic products with runtime truth built in.",
        detail: "Agents, RAG, evals, observability, billing, roles, and production app architecture.",
        icon: Cpu,
        image: "/images/industries/saas-runtimes.png",
        imageAlt: "AI SaaS control plane with agents, retrieval, evals, and traces",
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
                            Biochar kilns, pump dealerships, retail aisles, hardware programs, plant floors, and AI SaaS runtimes all have different truths.
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
                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,13,0.12)_0%,rgba(24,18,13,0.18)_38%,rgba(24,18,13,0.74)_100%)]" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">Operating context</p>
                                            <h3 className="mt-2 text-xl font-semibold tracking-tight">{context.name}</h3>
                                            <p className="mt-2 max-w-[24rem] text-sm leading-5 text-white/86">{context.signal}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="text-sm leading-6 text-ink-light">{context.detail}</p>
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
