export interface OpenClawWorkflowTemplate {
    label: string;
    category: string;
    title: string;
    description: string;
    impactLabel: string;
    impactValue: string;
    impactMetric: string;
    proof: string;
    steps: string[];
    integrations: string[];
    accent: string;
    image?: string;
}

export const openClawWorkflowTemplates: OpenClawWorkflowTemplate[] = [
    {
        label: "Content to Revenue Spine",
        category: "Content & Growth",
        title: "Publish → Promote → Convert",
        description:
            "A centralized control plane tracks content, generates channel variants, and routes high-intent traffic into CRM qualification with consistent brand tone.",
        impactLabel: "Financial impact",
        impactValue: "$210K annualized pipeline",
        impactMetric: "22% jump in sales-qualified leads, 11 hours reclaimed weekly",
        proof: "Commonly proven in content teams where manual post-publishing handoffs were still causing delayed follow-up.",
        steps: [
            "Collect article metadata from Notion",
            "Run playbook through the command plane",
            "Generate channel variants and queue web/social/email distribution",
            "Track engagement, sync to CRM, and auto-create follow-up tasks",
        ],
        integrations: ["Notion", "Agent Gateway", "HubSpot", "Gmail", "Telegram", "Google Analytics"],
        accent: "#2a2f47",
        image: "/images/workflow-content-revenue.png",
    },
    {
        label: "Support Triage Copilot",
        category: "Customer Support",
        title: "Inbox and Chat → Resolution in context",
        description:
            "Incoming support requests are captured, classified, and routed with urgency-aware escalation while preserving every action in auditable logs.",
        impactLabel: "Financial impact",
        impactValue: "$125K support-cost efficiency",
        impactMetric: "45% faster first response, 32% less manual queue drift",
        proof: "Frequently adopted by operations teams replacing spreadsheets and manual routing with policy-driven orchestration.",
        steps: [
            "Capture tickets from Zendesk and Intercom webhooks",
            "Classify intent and priority via the agent gateway",
            "Draft response context and assign specialist queues",
            "Push outcomes back through Slack with SLA context and audit links",
        ],
        integrations: ["Zendesk", "Intercom", "Slack", "OpenAI", "Agent Gateway", "Airtable"],
        accent: "#2e2f1d",
        image: "/images/workflow-support-triage.png",
    },
    {
        label: "Lead Qualification Engine",
        category: "Sales",
        title: "Lead to demo in under 90 seconds",
        description:
            "Incoming leads are normalized, enriched, scored, and routed into a single, synchronized sales stack so sales teams can call before momentum drops.",
        impactLabel: "Financial impact",
        impactValue: "$270K+ influenced pipeline",
        impactMetric: "17% increase in booked demos, 28% higher lead quality score",
        proof: "Observed in teams where marketing and SDR systems were disconnected.",
        steps: [
            "Ingest forms, social, and ad leads",
            "Enrich firmographic and behavior signals",
            "Score using configurable business rules",
            "Create CRM opportunities and pre-fill qualification tasks",
        ],
        integrations: ["Typeform", "HubSpot", "Salesforce", "Cal.com", "Agent Gateway", "Clearbit"],
        accent: "#2f3047",
        image: "/images/workflow-lead-qualification.png",
    },
    {
        label: "Finance Reconciliation Guard",
        category: "Finance Ops",
        title: "Invoice and payment control loop",
        description:
            "Billing, payout, and bank feeds are reconciled continuously, then surfaced as exceptions with playbook-ready actions.",
        impactLabel: "Financial impact",
        impactValue: "$80K monthly working-capital recovery",
        impactMetric: "99.7% invoice-match consistency, 30% fewer manual audits",
        proof: "Most effective in teams where finance tooling lived in separate silos.",
        steps: [
            "Pull billing and bank statements hourly from trusted APIs",
            "Match invoices, payouts, and tax status using stable IDs",
            "Flag anomalies and unresolved references in a queue",
            "Escalate via Slack and log reconciliation notes for audit",
        ],
        integrations: ["Stripe", "QuickBooks", "Gusto", "Agent Gateway", "Slack", "Airtable"],
        accent: "#2a3b2d",
        image: "/images/workflow-finance-recon.png",
    },
    {
        label: "Ops Incident Orchestration",
        category: "Customer Operations",
        title: "Monitoring to status update loop",
        description:
            "Operational incidents from monitoring systems trigger coordinated actions across status pages, docs, and postmortem prep without manual command stitching.",
        impactLabel: "Financial impact",
        impactValue: "$95K in prevented churn risk",
        impactMetric: "38% reduction in MTTR, 24/7 audit trail coverage",
        proof: "Built for operations teams moving from ad-hoc chat triage to traceable runbooks.",
        steps: [
            "Ingest events from PagerDuty or Sentry",
            "Auto-assign severity and owner based on policy",
            "Update internal dashboards and customer status channels",
            "Generate postmortem summary and retrospective packet automatically",
        ],
        integrations: ["PagerDuty", "Slack", "StatusPage", "Notion", "Agent Gateway", "Google Drive"],
        accent: "#34324a",
        image: "/images/workflow-incident-ops.png",
    },
    {
        label: "People Ops Security Layer",
        category: "HR & Security",
        title: "Hire-to-enable checklist in 2 days",
        description:
            "Hiring and access workflows are standardized across payroll, IT, legal, and team communication, with approvals managed through policy controls.",
        impactLabel: "Financial impact",
        impactValue: "$60K annual productivity gain",
        impactMetric: "67% faster onboarding completion, reduced IT support churn",
        proof: "Especially effective for distributed teams with recurring manual setup of accounts, VPN, and access approvals.",
        steps: [
            "Collect profile and approval artifacts",
            "Provision apps, VPN, and workspace permissions through controlled runners",
            "Generate onboarding assets, role guides, and welcome channels",
            "Notify leadership and schedule retention touchpoints",
        ],
        integrations: ["Google Workspace", "Okta", "Agent Gateway", "Notion", "Slack", "Workday"],
        accent: "#2d3748",
        image: "/images/workflow-people-ops.png",
    },
];
