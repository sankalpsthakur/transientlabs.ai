import Link from 'next/link';
import type { Metadata } from "next";
import { LeadMagnetGate } from "@/components/ui/LeadMagnetGate";
import { Check, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "ESG Compliance Checklist — Free 25-Item Guide | Transient Labs",
  description:
    "Download the free ESG Compliance Checklist for founders in regulated industries. 25 items covering environmental reporting, social governance, and AI ethics.",
};

const allChecklist = [
  // Environmental (visible)
  { id: 1, category: "Environmental", text: "Carbon footprint baseline measured and reported", visible: true },
  { id: 2, category: "Environmental", text: "Cloud infrastructure optimised for energy efficiency (e.g., region selection, spot instances)", visible: true },
  { id: 3, category: "Environmental", text: "Scope 1 & 2 emissions disclosed in investor reports", visible: true },
  { id: 4, category: "Environmental", text: "Supplier sustainability criteria defined", visible: true },
  { id: 5, category: "Environmental", text: "Net-zero or offset commitments documented", visible: true },
  // Social (partially visible)
  { id: 6, category: "Social", text: "Diverse hiring pipeline metrics tracked quarterly", visible: false },
  { id: 7, category: "Social", text: "Pay equity audit completed annually", visible: false },
  { id: 8, category: "Social", text: "Employee wellbeing programme in place", visible: false },
  { id: 9, category: "Social", text: "Community impact initiatives documented", visible: false },
  { id: 10, category: "Social", text: "Supply chain human rights due diligence conducted", visible: false },
  // Governance
  { id: 11, category: "Governance", text: "Board composition includes independent directors", visible: false },
  { id: 12, category: "Governance", text: "Whistleblower policy published and accessible", visible: false },
  { id: 13, category: "Governance", text: "Anti-bribery and corruption policy in place", visible: false },
  { id: 14, category: "Governance", text: "Data privacy policy aligned to GDPR / PDPA", visible: false },
  { id: 15, category: "Governance", text: "Annual ESG report published publicly", visible: false },
  // AI Ethics
  { id: 16, category: "AI Ethics", text: "AI model bias audit completed before launch", visible: false },
  { id: 17, category: "AI Ethics", text: "Explainability documentation for high-stakes AI decisions", visible: false },
  { id: 18, category: "AI Ethics", text: "Human-in-the-loop review for sensitive AI outputs", visible: false },
  { id: 19, category: "AI Ethics", text: "AI training data provenance documented", visible: false },
  { id: 20, category: "AI Ethics", text: "Model drift monitoring in production", visible: false },
  // Regulatory
  { id: 21, category: "Regulatory", text: "EU AI Act risk classification assessed", visible: false },
  { id: 22, category: "Regulatory", text: "SOC 2 Type II certification in progress or completed", visible: false },
  { id: 23, category: "Regulatory", text: "ISO 27001 aligned security policies documented", visible: false },
  { id: 24, category: "Regulatory", text: "Incident response plan tested in last 12 months", visible: false },
  { id: 25, category: "Regulatory", text: "Third-party penetration test completed annually", visible: false },
];

const visibleItems = allChecklist.filter((i) => i.visible);

const previewContent = (
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
        Free 25-Item Checklist
      </span>
      <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-4">
        ESG Compliance Checklist
      </h1>
      <p className="text-lg text-ink-muted">
        25 actionable items for founders building in regulated industries.
        Covers Environmental, Social, Governance, AI Ethics, and Regulatory compliance.
      </p>
    </div>

    {/* Visible items preview */}
    <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-sm uppercase tracking-widest text-ink-muted">
          Preview — 5 of 25 Items
        </h2>
        <span className="text-xs text-ink-muted font-mono">Environmental</span>
      </div>
      <ul className="space-y-4">
        {visibleItems.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-ink-muted" />
            </div>
            <div>
              <p className="text-sm text-ink">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Locked items teaser */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        {["Social", "Governance", "AI Ethics", "Regulatory"].map((cat) => (
          <div key={cat} className="flex items-center gap-3 opacity-40">
            <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center flex-shrink-0">
              <Lock className="w-3 h-3 text-ink-muted" />
            </div>
            <span className="text-sm text-ink-muted font-mono">{cat} — 5 items</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ESGChecklistPage() {
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
            <li className="text-ink">ESG Checklist</li>
          </ol>
        </nav>

        <LeadMagnetGate
          title="Get the Complete 25-Item Checklist — Free"
          description="Enter your email to unlock all 25 items across Environmental, Social, Governance, AI Ethics, and Regulatory compliance. Plus tips on how to action each one."
          magnetName="esg-checklist"
          downloadUrl="https://100xai.engineering/downloads/esg-compliance-checklist.pdf"
          previewContent={previewContent}
        />
      </main>
    </div>
  );
}
