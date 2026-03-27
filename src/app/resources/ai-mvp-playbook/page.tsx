import Link from 'next/link';
import type { Metadata } from "next";
import { LeadMagnetGate } from "@/components/ui/LeadMagnetGate";

export const metadata: Metadata = {
  title: "AI MVP Playbook — Free 25-Page Guide | Transient Labs",
  description:
    "Download the free AI MVP Playbook: everything founders need to go from idea to shipped AI product in 3 weeks. Architecture, stack, LLM patterns, and launch checklist.",
};

const tableOfContents = [
  { num: "01", title: "Why AI MVPs Are Different", desc: "The unique constraints and opportunities of shipping with LLMs" },
  { num: "02", title: "Scoping Your AI Product", desc: "How to define a 3-week deliverable that actually ships" },
  { num: "03", title: "Choosing Your Stack", desc: "Next.js, Supabase, OpenAI, Anthropic — when to use what" },
  { num: "04", title: "LLM Integration Patterns", desc: "RAG, function calling, agents, and guardrails" },
  { num: "05", title: "Building the Data Layer", desc: "Vector databases, embeddings, and real-time pipelines" },
  { num: "06", title: "AI Evaluation & Quality", desc: "How to measure and iterate on LLM outputs" },
  { num: "07", title: "Week-by-Week Sprint Plan", desc: "Exact milestones for a 3-week AI MVP sprint" },
  { num: "08", title: "Launch & Post-Launch", desc: "Monitoring, bug-fix window, and scaling considerations" },
];

const firstSectionPreview = (
  <div className="rounded-2xl border border-border bg-white p-8 sm:p-10 mb-2">
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-ink-muted">Chapter 01</span>
      <span className="h-px flex-1 bg-border" />
    </div>
    <h2 className="font-mono text-2xl font-bold text-ink mb-4">
      Why AI MVPs Are Different
    </h2>
    <p className="text-ink-light leading-relaxed mb-4">
      Building an AI product is not the same as building a conventional web app. The outputs
      are probabilistic, the UX patterns are still being invented, and the infrastructure is
      evolving at a pace that makes last year&apos;s best practice feel dated.
    </p>
    <p className="text-ink-light leading-relaxed mb-4">
      In our experience shipping 15+ AI products across fintech, healthtech, and SaaS,
      we&apos;ve identified three core constraints that define an AI MVP:
    </p>
    <ul className="space-y-3 text-ink-light">
      <li className="flex gap-3">
        <span className="font-mono text-accent font-bold flex-shrink-0">1.</span>
        <span><strong className="text-ink">Latency is UX.</strong> Every 100ms added by your LLM call is felt by the user. Streaming is non-negotiable for chat-like interfaces.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent font-bold flex-shrink-0">2.</span>
        <span><strong className="text-ink">Evaluation before iteration.</strong> Without evals, you&apos;re flying blind. Ship a lightweight eval harness on day one.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent font-bold flex-shrink-0">3.</span>
        <span><strong className="text-ink">Guardrails are a feature.</strong> Users will try to break your system. Plan for it in week one, not week eight.</span>
      </li>
    </ul>
  </div>
);

const previewContent = (
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
        Free 25-Page Playbook
      </span>
      <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-4">
        AI MVP Playbook
      </h1>
      <p className="text-lg text-ink-muted">
        Everything you need to go from idea to shipped AI product in 3 weeks.
        Architecture decisions, stack picks, LLM integration patterns, and a
        week-by-week sprint plan.
      </p>
    </div>

    {/* Table of contents */}
    <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
      <h2 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-6">
        What&apos;s Inside
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tableOfContents.map((item) => (
          <div key={item.num} className="flex gap-4">
            <span className="font-mono text-xs text-accent font-bold mt-0.5 flex-shrink-0 w-6">
              {item.num}
            </span>
            <div>
              <p className="font-mono font-semibold text-ink text-sm">{item.title}</p>
              <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* First section preview */}
    {firstSectionPreview}
  </div>
);

export default function AIPlaybookPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-1 text-sm text-ink-muted">
            <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li><a href="/resources" className="hover:text-ink transition-colors">Resources</a></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li className="text-ink">AI MVP Playbook</li>
          </ol>
        </nav>

        <LeadMagnetGate
          title="Get the Full 25-Page Playbook — Free"
          description="Enter your email and we'll unlock the complete playbook including all 8 chapters, the sprint template, and our LLM evaluation framework."
          magnetName="ai-mvp-playbook"
          downloadUrl="https://100xai.engineering/downloads/ai-mvp-playbook.pdf"
          previewContent={previewContent}
        />
      </main>
    </div>
  );
}
