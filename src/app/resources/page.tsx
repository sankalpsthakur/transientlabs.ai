import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, CheckSquare, Calculator, Shield, Layers, ClipboardCheck, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Resources | Transient Labs",
  description:
    "Free guides, playbooks, tools and checklists for founders building AI products. Includes the AI MVP Cost Estimator, AI MVP Playbook, ESG Compliance Checklist, SOC2 Assessment, AI Tech Stack Guide, Security Checklist, and CSRD Calculator.",
};

const resources = [
  {
    href: "/resources/ai-mvp-cost-estimator",
    icon: Calculator,
    tag: "Interactive Tool",
    title: "AI MVP Cost Estimator",
    description:
      "Answer 4 quick questions and get a real cost breakdown — in-house hiring vs. freelancers vs. our 3-week sprint. See exactly how much you'd save.",
    cta: "Get your free estimate",
    highlight: true,
  },
  {
    href: "/resources/ai-mvp-playbook",
    icon: FileText,
    tag: "Playbook",
    title: "AI MVP Playbook",
    description:
      "25 pages covering everything you need to go from idea to shipped AI product in 3 weeks. Architecture, stack decisions, LLM integration patterns, and launch checklist.",
    cta: "Get the free playbook",
    highlight: false,
  },
  {
    href: "/resources/esg-checklist",
    icon: CheckSquare,
    tag: "Checklist",
    title: "ESG Compliance Checklist",
    description:
      "25-item checklist for founders building in regulated industries. Covers environmental reporting, social governance, and AI ethics requirements.",
    cta: "Get the free checklist",
    highlight: false,
  },
  {
    href: "/resources/soc2-readiness-assessment",
    icon: Shield,
    tag: "Interactive Tool",
    title: "SOC2 Readiness Assessment",
    description:
      "Answer 6 questions and get your SOC2 readiness score, estimated timeline, and priority actions.",
    cta: "Check your readiness",
    highlight: false,
  },
  {
    href: "/resources/ai-tech-stack-guide",
    icon: Layers,
    tag: "Interactive Tool",
    title: "AI Tech Stack Decision Guide",
    description:
      "Get a personalized tech stack recommendation based on your product type, scale, and budget.",
    cta: "Get your recommendation",
    highlight: false,
  },
  {
    href: "/resources/security-compliance-checklist",
    icon: ClipboardCheck,
    tag: "Checklist",
    title: "Security Compliance Checklist",
    description:
      "30-item security checklist covering infrastructure, application, access control, monitoring, and compliance.",
    cta: "Get the free checklist",
    highlight: false,
  },
  {
    href: "/resources/csrd-readiness-calculator",
    icon: BarChart3,
    tag: "Interactive Tool",
    title: "CSRD Readiness Calculator",
    description:
      "Check if CSRD applies to you and get a readiness score with prioritized action items.",
    cta: "Check your CSRD status",
    highlight: false,
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Page header */}
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
            Free Resources
          </span>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
            Build smarter,{" "}
            <span className="text-accent">ship faster</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl">
            Practical guides and tools for founders building AI-powered products.
            No fluff — just the frameworks we use ourselves.
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map(({ href, icon: Icon, tag, title, description, cta, highlight }) => (
            <Link
              key={href}
              href={href}
              className={[
                "group block rounded-2xl border p-8 hover:shadow-md transition-all duration-200",
                highlight
                  ? "border-accent/30 bg-accent/5 hover:border-accent/60"
                  : "border-border bg-white hover:border-accent/40",
              ].join(" ")}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={[
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  highlight ? "bg-accent text-white" : "bg-accent/10",
                ].join(" ")}>
                  <Icon className={`w-5 h-5 ${highlight ? "text-white" : "text-accent"}`} />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent mt-2.5">
                  {tag}
                </span>
              </div>
              <h2 className="font-mono text-xl font-bold text-ink mb-3 group-hover:text-accent transition-colors">
                {title}
              </h2>
              <p className="text-ink-muted text-sm leading-relaxed mb-6">
                {description}
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-accent">
                {cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-border pt-12 text-center">
          <p className="text-ink-muted mb-6">
            Building something complex? We offer free scoping calls for founders.
          </p>
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 font-mono text-sm font-semibold hover:bg-ink/80 transition-colors"
          >
            Book a Free Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
