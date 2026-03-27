'use client';

import { m } from "framer-motion";
import { FadeIn, Stagger, StaggerItem, HoverScale } from "@/components/ui/Motion";
import { TechPatternVisual, type TechPatternType } from "@/components/motion/TechPatternVisual";
import { cn } from "@/lib/utils";

const technicalEdge = [
    {
        title: "Answers you can trust",
        visual: "citations" as TechPatternType,
        description: "AI that cites its sources and stays grounded in your data, dramatically reducing errors and hallucinations.",
        stats: "Accurate · Traceable · Reliable",
    },
    {
        title: "Quality you can measure",
        visual: "evals" as TechPatternType,
        description: "Automated testing ensures your AI maintains quality as you iterate and scale.",
        stats: "Tested · Measured · Improving",
    },
    {
        title: "Consistent, predictable outputs",
        visual: "structured" as TechPatternType,
        description: "Structured responses that integrate seamlessly with your systems—no surprises or broken interfaces.",
        stats: "Structured · Validated · Integrated",
    },
    {
        title: "Predictable costs",
        visual: "cost" as TechPatternType,
        description: "Smart optimization keeps your AI fast and your spending predictable, even as usage grows.",
        stats: "Optimized · Monitored · Controlled",
    },
    {
        title: "Full visibility",
        visual: "observability" as TechPatternType,
        description: "See exactly how your AI is performing with built-in monitoring and user feedback loops.",
        stats: "Tracked · Analyzed · Improved",
    },
    {
        title: "Workflows that work",
        visual: "workflows" as TechPatternType,
        description: "Multi-step AI processes that execute reliably, with proper error handling and recovery.",
        stats: "Reliable · Recoverable · Debuggable",
    },
];

export function TechnicalPatternsBlock() {
    return (
        <div className="mb-24">
            <FadeIn>
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-8">
                    Technical Patterns
                </p>
            </FadeIn>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                {technicalEdge.map((item) => (
                    <StaggerItem key={item.title} direction="scale">
                        <HoverScale scale={1.01} y={-4}>
                            <m.div
                                className={cn(
                                    "relative bg-white border border-border p-6 h-full transition-all duration-300 group",
                                    "outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                                )}
                                whileHover={{
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    borderColor: 'rgba(0,0,0,0.3)',
                                }}
                                tabIndex={0}
                                aria-label={`${item.title}. ${item.description} ${item.stats}`}
                            >
                                <h3 className="text-lg font-medium text-ink mb-3 group-hover:text-ink-light transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <div className="mt-4">
                                    <TechPatternVisual
                                        type={item.visual}
                                        ariaLabel={`${item.description} ${item.stats}`}
                                    />
                                </div>

                                <div
                                    role="tooltip"
                                    className={cn(
                                        "pointer-events-none absolute left-4 right-4 bottom-4",
                                        "rounded-lg border border-border bg-white px-3 py-2 shadow-lg",
                                        "text-xs text-ink-muted leading-relaxed",
                                        "opacity-0 translate-y-1 transition-all duration-200",
                                        "group-hover:opacity-100 group-hover:translate-y-0",
                                        "group-focus-within:opacity-100 group-focus-within:translate-y-0"
                                    )}
                                >
                                    {item.description}{' '}
                                    <span className="text-ink-muted/80">{item.stats}</span>
                                </div>
                            </m.div>
                        </HoverScale>
                    </StaggerItem>
                ))}
            </Stagger>
        </div>
    );
}

