'use client';

import { FadeIn } from "@/components/ui/Motion";
import { PersonalizationDiagram } from "@/components/motion/PersonalizationDiagram";

const personalization = {
    title: "Adaptive Personalization",
};

export function PersonalizationBlock() {
    return (
        <FadeIn>
            <div className="border-t border-border pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <p className="text-xs text-ink-muted uppercase tracking-wide mb-2">Advanced</p>
                        <h3 className="text-xl font-semibold text-ink mb-4">{personalization.title}</h3>
                        <p className="text-ink-light leading-relaxed">
                            Beyond generic RAG. We build systems that learn user preferences and adapt behavior
                            without retraining or prompt bloat.
                        </p>
                    </div>
                    <div>
                        <PersonalizationDiagram />
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

