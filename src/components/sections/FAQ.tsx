"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useContactModal } from "@/lib/contact-modal-context";
import { FAQS as faqs } from "@/lib/faq";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { open } = useContactModal();

  return (
    <Section id="faq" className="scroll-mt-20 bg-paper md:scroll-mt-28">
      <Container width="reading">
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
                  "card-hover relative pl-4 -ml-4 transition-colors duration-300",
                  "before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-transparent before:transition-colors before:duration-300",
                  openIndex === idx
                    ? "bg-paper-warm/60 before:bg-accent"
                    : "hover:bg-paper-warm/30",
                )}
              >
                <button
                  className="w-full py-6 flex items-center justify-between text-left group"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-ink font-medium pr-8 group-hover:text-ink-light transition-colors">
                    {item.q}
                  </span>
                  <m.div
                    animate={{ rotate: openIndex === idx ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-shrink-0"
                  >
                    <Plus className="w-5 h-5 text-ink-muted transition-colors group-hover:text-ink" />
                  </m.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <m.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
              <Button variant="primary" size="sm" onClick={() => open()}>
                Book a working session
              </Button>
              <a
                href="mailto:hello@transientlabs.ai"
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
