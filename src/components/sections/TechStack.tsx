'use client';

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

const capabilities = [
    {
        title: "AI Product Layer",
        description: "End-to-end AI integration from model selection to production guardrails",
        items: [
            "Claude/GPT/Gemini integration",
            "RAG (embeddings, chunking, re-ranking)",
            "Tool-calling workflows + function schemas",
            "Evals (regressions, red-team, golden sets)",
            "Guardrails + structured outputs",
            "Latency & cost controls (caching, budgets)",
        ],
    },
    {
        title: "Product Engineering",
        description: "Full-stack development with modern frameworks and scalable architecture",
        items: [
            "Next.js, React, Tailwind",
            "Supabase/Postgres data layer",
            "Auth, roles, and admin panels",
            "Stripe billing + subscriptions",
            "Mobile apps (React Native / Flutter)",
            "Dashboards and internal tools",
        ],
    },
    {
        title: "Delivery & Infra",
        description: "CI/CD, monitoring, and deployment pipelines for reliable releases",
        items: [
            "Docker, Kubernetes",
            "AWS, GCP, Azure",
            "Vercel deployments",
            "CI/CD and environments",
            "Data pipelines (ETL, webhooks)",
            "Observability, logs, and tracing",
            "Security reviews and hardening",
        ],
    },
];

export function TechStack() {
    const [activeTab, setActiveTab] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    // Reduced motion: show all 3 columns statically (original layout)
    if (prefersReducedMotion) {
        return (
            <Section id="capabilities" className="relative bg-ink text-paper py-16 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
                <Container className="relative">
                    <div className="max-w-2xl mb-16">
                        <p className="text-sm text-paper/60 mb-4">Capabilities</p>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-paper">
                            What we build with
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {capabilities.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-lg font-medium text-paper mb-6 pb-4 border-b border-paper/10">
                                    {category.title}
                                </h3>
                                <ul className="space-y-3">
                                    {category.items.map((item, i) => (
                                        <li key={i} className="text-sm text-paper/60">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>
        );
    }

    return (
        <Section id="capabilities" className="relative bg-ink text-paper py-16 md:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
            <Container className="relative">
                <div className="max-w-2xl mb-16">
                    <FadeIn>
                        <p className="text-sm text-paper/60 mb-4">Capabilities</p>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-paper">
                            What we build with
                        </h2>
                    </FadeIn>
                </div>

                {/* Tab buttons */}
                <FadeIn delay={0.15}>
                    <div className="flex flex-wrap gap-2 mb-10">
                        {capabilities.map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                                    activeTab === idx
                                        ? "bg-paper text-ink"
                                        : "text-paper/60 hover:text-paper"
                                )}
                            >
                                {category.title}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Chip content area */}
                <FadeIn delay={0.2}>
                    <div className="min-h-[120px]">
                        <AnimatePresence mode="wait">
                            <m.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <div className="inline-flex flex-wrap gap-2">
                                    {capabilities[activeTab].items.map((item, i) => (
                                        <m.span
                                            key={item}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: i * 0.04,
                                                duration: 0.3,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="border border-paper/20 px-3 py-1.5 text-sm text-paper/80 hover:bg-paper/10 hover:text-paper transition-colors cursor-default"
                                        >
                                            {item}
                                        </m.span>
                                    ))}
                                </div>
                                <p className="text-sm text-paper/50 mt-6 max-w-lg">
                                    {capabilities[activeTab].description}
                                </p>
                            </m.div>
                        </AnimatePresence>
                    </div>
                </FadeIn>
            </Container>
        </Section>
    );
}
