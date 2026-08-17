/**
 * Homepage FAQ. Single source for both the rendered accordion and the FAQPage
 * JSON-LD — they drifted into two unrelated question sets once already, and
 * schema that does not mirror visible content is a structured-data violation.
 *
 * Six questions. No prices: fees are quoted in the working session.
 */

export type FaqEntry = { q: string; a: string };

export const FAQS: readonly FaqEntry[] = [
    {
        q: 'What are Plant Loop, Finance Workflows, and Evidence Lens?',
        a: 'Plant Loop is autonomous plant operations, from energy audit through to governed PLC/SCADA/MES control. Finance Workflows is a controlled layer around the ERP and bank feeds you already run: reconciliation, line-item accounting, tax and leases, MIS. Evidence Lens is field MRV through to credit-grade buyer assurance. All three start with a bounded Sprint.',
    },
    {
        q: 'What is included in the Plant Loop Sprint?',
        a: 'Four weeks covering the site energy baseline, opportunity register, automation architecture, safety and operator-control boundaries, and a sequenced roadmap ending in a written go / no-go. Hardware procurement and installation are quoted separately, after the assessment.',
    },
    {
        q: 'What plant data do you need for an energy audit?',
        a: 'Utility bills, interval or meter data where it exists, equipment schedules, production volumes, operating hours, and a site walkthrough. We confirm the exact data boundary before kickoff and work around reasonable gaps with the assumptions written down.',
    },
    {
        q: 'How do you keep AI reliable rather than a demo?',
        a: 'Structured outputs, validation, regression evals, tracing, and fallbacks. Quality is measured, so it improves instead of drifting. The same discipline covers RAG over your documents, copilots inside the product, and tool-calling agents.',
    },
    {
        q: 'What happens after the Sprint?',
        a: 'Every Sprint ends in a written go / no-go, so continuing is a decision rather than a default. During the work we run weekly milestones with a demo every Friday: if something inside the agreed scope is off we fix it, and there is a post-launch bug-fix window. Afterwards you can run with the codebase, or keep us on to lead the roadmap, hiring, and reliability as you scale.',
    },
    {
        q: 'Who owns the IP?',
        a: 'You do. You get the repo, the keys, and deploy ownership.',
    },
];
