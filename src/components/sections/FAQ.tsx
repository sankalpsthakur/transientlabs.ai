"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useContactModal } from "@/lib/contact-modal-context";

const faqs = [
  {
    q: "What's included in the $4,999 Sprint MVP?",
    a: "A fixed-scope MVP: UX flow, full-stack build (Next.js + Supabase), one core AI workflow (RAG/copilot/agent), QA, deployment, and handoff.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We work in weekly milestones with a demo every Friday, so you verify progress before we move forward. If something in the agreed scope is off, we fix it, and we include a post-launch bug-fix window.",
  },
  {
    q: "Can you build AI features into my MVP?",
    a: "Yes—RAG over docs, copilots inside your product, tool-calling agents, and voice prototypes. We ship with evals + guardrails so it's usable in production.",
  },
  {
    q: "How do you keep AI reliable (not a demo)?",
    a: "We use structured outputs, validation, regression evals, tracing, and fallbacks. Quality is measured and improves over time instead of drifting.",
  },
  {
    q: "Do you work with non-technical founders?",
    a: "Yes. We can take you from idea → scope → UX → build → launch, and set you up for iteration after the sprint.",
  },
  {
    q: "What happens after the sprint?",
    a: "You can run with the codebase, or keep us on as Fractional CTO ($9,999/mo) to lead the roadmap, hiring, and reliability as you scale.",
  },
  {
    q: "Who owns the IP?",
    a: "You do. You get the repo, keys, and deploy ownership.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { open } = useContactModal();

  return (
    <Section id="faq" className="bg-paper">
      <Container className="max-w-3xl">
        <div className="mb-16">
          <FadeIn>
            <p className="text-sm text-ink-muted mb-4">FAQ</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Common questions
            </h2>
          </FadeIn>
        </div>

        <Stagger className="divide-y divide-border border-t border-b border-border">
          {faqs.map((item, idx) => (
            <StaggerItem key={idx}>
              <div
                className={cn(
                  "card-hover border-accent-left pl-4 -ml-4 transition-colors duration-300",
                  openIndex === idx && "active bg-paper-warm/50",
                )}
              >
                <button
                  className="w-full py-6 flex items-center justify-between text-left group"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <span className="text-ink font-medium pr-8 group-hover:text-ink-light transition-colors">
                    {item.q}
                  </span>
                  <m.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openIndex === idx ? (
                      <Minus className="w-5 h-5 text-ink-muted flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-ink-muted flex-shrink-0" />
                    )}
                  </m.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-ink-light leading-relaxed">
                        {item.a}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn delay={0.2}>
          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-ink mb-1">
                Still have questions?
              </h3>
              <p className="text-sm text-ink-muted">We reply within 24 hours</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="primary" size="sm" onClick={open}>
                Request a Call
              </Button>
              <a
                href="mailto:admin@100xai.engineering"
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                or email us
              </a>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
