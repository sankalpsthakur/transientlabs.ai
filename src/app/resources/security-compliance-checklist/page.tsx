import Link from 'next/link';
import type { Metadata } from "next";
import { LeadMagnetGate } from "@/components/ui/LeadMagnetGate";
import { Check, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Compliance Checklist — Free 30-Item Guide | Transient Labs",
  description:
    "Download the free Security Compliance Checklist for Series A startups. 30 items covering infrastructure security, application security, access control, monitoring, and compliance documentation.",
  alternates: {
    canonical: "https://transientlabs.ai/resources/security-compliance-checklist",
  },
  openGraph: {
    title: "Security Compliance Checklist — Free 30-Item Guide | Transient Labs",
    description:
      "30 actionable security items for founders preparing for SOC 2 or enterprise sales. Infrastructure, AppSec, access control, incident response, and compliance docs.",
    url: "https://transientlabs.ai/resources/security-compliance-checklist",
    siteName: "Transient Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Compliance Checklist — Free 30-Item Guide",
    description:
      "30 actionable security items for founders preparing for SOC 2 or enterprise sales.",
  },
};

const allChecklist = [
  // Infrastructure Security (first 8 items)
  { id: 1, category: "Infrastructure Security", text: "Multi-factor authentication (MFA) enforced across all admin and cloud accounts", visible: true },
  { id: 2, category: "Infrastructure Security", text: "Data encrypted at rest using AES-256 for all databases and storage volumes", visible: true },
  { id: 3, category: "Infrastructure Security", text: "Data encrypted in transit with TLS 1.2+ enforced across all endpoints", visible: true },
  { id: 4, category: "Infrastructure Security", text: "Network segmentation implemented — production isolated from staging and dev", visible: true },
  { id: 5, category: "Infrastructure Security", text: "Secrets managed via a vault (AWS Secrets Manager, HashiCorp Vault) — no hardcoded credentials", visible: true },
  { id: 6, category: "Infrastructure Security", text: "Container images scanned for CVEs before deployment (Trivy, Snyk, or equivalent)", visible: true },
  { id: 7, category: "Infrastructure Security", text: "Web Application Firewall (WAF) deployed in front of all public-facing services", visible: true },
  { id: 8, category: "Infrastructure Security", text: "DDoS protection enabled (Cloudflare, AWS Shield, or equivalent)", visible: true },
  // Application Security (first 2 visible to reach 10 total)
  { id: 9, category: "Application Security", text: "Automated backup verification tested monthly — restore drills documented", visible: true },
  { id: 10, category: "Application Security", text: "OWASP Top 10 vulnerabilities addressed and tracked in your backlog", visible: true },
  // Rest gated
  { id: 11, category: "Application Security", text: "Dependency scanning automated in CI/CD pipeline (Dependabot, Renovate, or Snyk)", visible: false },
  { id: 12, category: "Application Security", text: "SAST (static analysis) and DAST (dynamic analysis) integrated into release pipeline", visible: false },
  { id: 13, category: "Application Security", text: "API authentication uses short-lived tokens or OAuth 2.0 — no long-lived API keys in production", visible: false },
  { id: 14, category: "Application Security", text: "Input validation and output encoding enforced at all trust boundaries", visible: false },
  { id: 15, category: "Application Security", text: "Rate limiting applied to all public APIs and authentication endpoints", visible: false },
  { id: 16, category: "Application Security", text: "Content Security Policy (CSP) headers configured and tested via security headers scan", visible: false },
  // Access Control
  { id: 17, category: "Access Control", text: "Role-Based Access Control (RBAC) enforced — least privilege by default for all IAM roles", visible: false },
  { id: 18, category: "Access Control", text: "Principle of least privilege audited quarterly — unused permissions revoked", visible: false },
  { id: 19, category: "Access Control", text: "SSH keys rotated every 90 days — old keys revoked immediately on rotation", visible: false },
  { id: 20, category: "Access Control", text: "Service accounts inventoried and audited — no shared credentials between services", visible: false },
  { id: 21, category: "Access Control", text: "Offboarding automation removes all access within 24 hours of employee departure", visible: false },
  // Monitoring & Incident Response
  { id: 22, category: "Monitoring & Incident Response", text: "Centralised logging with tamper-evident log storage retained for 90+ days", visible: false },
  { id: 23, category: "Monitoring & Incident Response", text: "SIEM or security alerting configured with tuned rules to reduce alert fatigue", visible: false },
  { id: 24, category: "Monitoring & Incident Response", text: "Alert runbooks documented for top 10 most common security events", visible: false },
  { id: 25, category: "Monitoring & Incident Response", text: "Incident response plan documented, distributed to team, and reviewed annually", visible: false },
  { id: 26, category: "Monitoring & Incident Response", text: "Post-mortem process defined — blameless reviews conducted after every P1/P2 incident", visible: false },
  // Compliance & Documentation
  { id: 27, category: "Compliance & Documentation", text: "Security policies (acceptable use, password, data handling) written and signed by all employees", visible: false },
  { id: 28, category: "Compliance & Documentation", text: "Annual risk assessment conducted — risks scored, owners assigned, mitigations tracked", visible: false },
  { id: 29, category: "Compliance & Documentation", text: "Vendor security review process documented — critical vendors assessed annually", visible: false },
  { id: 30, category: "Compliance & Documentation", text: "Data classification policy defined (public / internal / confidential / restricted) with handling rules", visible: false },
  { id: 31, category: "Compliance & Documentation", text: "Business continuity plan (BCP) and disaster recovery (DR) plan tested in last 12 months", visible: false },
];

const visibleItems = allChecklist.filter((i) => i.visible);

const previewContent = (
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
        Free 30-Item Checklist
      </span>
      <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-4">
        Security Compliance Checklist
      </h1>
      <p className="text-lg text-ink-muted">
        30 actionable security controls for founders preparing for SOC 2, enterprise sales, or
        Series A due diligence. Covers infrastructure, application security, access control,
        incident response, and compliance documentation.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/solutions/security-soc2"
          className="font-mono text-xs text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          SOC 2 Automation →
        </Link>
        <Link
          href="/blog/vapt-automation-workflows"
          className="font-mono text-xs text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          VAPT Automation Workflows →
        </Link>
        <Link
          href="/blog/security-checklist-series-a-startups"
          className="font-mono text-xs text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          Security for Series A Startups →
        </Link>
      </div>
    </div>

    {/* Visible items preview */}
    <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-sm uppercase tracking-widest text-ink-muted">
          Preview — 10 of 30 Items
        </h2>
        <span className="text-xs text-ink-muted font-mono">Infrastructure + AppSec</span>
      </div>
      <ul className="space-y-4">
        {visibleItems.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-ink-muted" />
            </div>
            <div>
              <span className="font-mono text-xs text-accent/70 block mb-0.5">{item.category}</span>
              <p className="text-sm text-ink">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Locked items teaser */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        {[
          "Application Security — 5 items",
          "Access Control — 5 items",
          "Monitoring & Incident Response — 5 items",
          "Compliance & Documentation — 5 items",
        ].map((label) => (
          <div key={label} className="flex items-center gap-3 opacity-40">
            <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center flex-shrink-0">
              <Lock className="w-3 h-3 text-ink-muted" />
            </div>
            <span className="text-sm text-ink-muted font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function SecurityComplianceChecklistPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-1 text-sm text-ink-muted">
            <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li><Link href="/resources" className="hover:text-ink transition-colors">Resources</Link></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li className="text-ink">Security Compliance Checklist</li>
          </ol>
        </nav>

        <LeadMagnetGate
          title="Get the Complete 30-Item Security Checklist — Free"
          description="Enter your email to unlock all 30 controls across Infrastructure Security, Application Security, Access Control, Monitoring & Incident Response, and Compliance Documentation."
          magnetName="security-compliance-checklist"
          downloadUrl="https://transientlabs.ai/downloads/security-compliance-checklist.pdf"
          previewContent={previewContent}
        />
      </main>
    </div>
  );
}
