'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";

interface Stat {
  value: string;
  label: string;
  claim: string;
  source: string;
  sourceUrl: string;
  sourceShort: string;
}

const stats: Stat[] = [
  {
    value: "$1.8T",
    label: "AI Market by 2030",
    claim: "Global AI market projected to reach $1.8 trillion by 2030, growing at 37% CAGR.",
    source: "Gartner AI Market Forecast 2024",
    sourceUrl: "https://www.gartner.com/en/newsroom/press-releases/2024-05-13-gartner-predicts-ai-augmentation-will-generate-2-point-9-trillion-in-business-value-by-2021",
    sourceShort: "Gartner",
  },
  {
    value: "77%",
    label: "of Enterprises Adopting AI",
    claim: "77% of enterprise organizations are either using or exploring AI, with generative AI adoption accelerating sharply.",
    source: "McKinsey Global Survey on AI Adoption 2024",
    sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
    sourceShort: "McKinsey",
  },
  {
    value: "90%",
    label: "of Startups Fail",
    claim: "90% of startups fail — most due to building products the market doesn't want, not running out of money.",
    source: "CB Insights: The Top 12 Reasons Startups Fail",
    sourceUrl: "https://www.cbinsights.com/research/report/startup-failure-reasons-top/",
    sourceShort: "CB Insights",
  },
  {
    value: "2×",
    label: "Faster with AI-Accelerated Dev",
    claim: "Teams using AI-assisted tools ship features up to 2× faster and with measurably fewer defects.",
    source: "Stanford HAI AI Index Report 2024",
    sourceUrl: "https://aiindex.stanford.edu/report/",
    sourceShort: "Stanford HAI",
  },
];

export function MarketStats() {
  return (
    <Section id="market-stats" className="bg-paper py-16 md:py-20">
      <Container>
        <div className="max-w-2xl mb-12">
          <FadeIn>
            <p className="text-sm text-ink-muted mb-4 font-mono uppercase tracking-wider">
              The Opportunity
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-4">
              AI is the fastest-growing market in tech
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-ink-light leading-relaxed">
              The window to ship first is closing. Here&apos;s the data that
              founders and investors are acting on.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <FadeIn key={idx} delay={idx * 0.08}>
              <div className="border border-border rounded-lg p-6 bg-paper-warm hover:border-accent/40 transition-colors duration-200 h-full flex flex-col">
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-signal mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-3">
                  {stat.label}
                </div>
                <p className="text-sm text-ink-light leading-relaxed flex-grow mb-4">
                  {stat.claim}
                </p>
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-accent transition-colors duration-150 group mt-auto"
                  aria-label={"Source: " + stat.source}
                >
                  <span className="text-accent/60 group-hover:text-accent transition-colors">[</span>
                  <span className="font-semibold text-ink-muted group-hover:text-accent transition-colors">
                    {stat.sourceShort}
                  </span>
                  <span className="text-accent/60 group-hover:text-accent transition-colors">]</span>
                  <svg
                    className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span className="sr-only">{stat.source}</span>
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="mt-8 text-xs text-ink-muted font-mono leading-relaxed border-t border-border pt-6">
            Additional reading:{" "}
            <a
              href="https://hbr.org/2022/05/why-startups-fail"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Harvard Business Review — &ldquo;Why Startups Fail&rdquo;
            </a>{" "}
            &middot;{" "}
            <a
              href="https://aiindex.stanford.edu/report/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Stanford HAI 2024 AI Index Report
            </a>
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}
