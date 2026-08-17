/**
 * The engagement catalog. Every engagement starts as a bounded Sprint, so this
 * is the only place sprint names, ids, and shapes are defined — the Services
 * grid, the contact modal, and the buyer paths all read from here.
 *
 * Deliberately no prices. Fees are quoted in the working session, not merchandised
 * on the page.
 */

export type Sprint = {
    id: string;
    /** Which operating pathway this sprint is the entry to. */
    lane: string;
    title: string;
    /** How long the bounded engagement runs. */
    tempo: string;
    /** One sentence. If it needs two, the sprint is not scoped tightly enough. */
    summary: string;
    /** What lands on the table at the end. Three, no more. */
    leaveBehind: readonly [string, string, string];
    bestFor: string;
    /** Primary catalog paths lead; Studio is secondary. */
    primary: boolean;
};

export const SPRINTS: readonly Sprint[] = [
    {
        id: 'plant-loop-sprint',
        lane: 'Plant Loop',
        title: 'Plant Loop Sprint',
        tempo: '4 weeks',
        summary:
            'Site-bounded energy and automation assessment: baseline, control path, safety boundaries, and a written go / no-go.',
        leaveBehind: [
            'Energy baseline and opportunity register',
            'Automation architecture and control boundaries',
            'Sequenced roadmap with a go / no-go',
        ],
        bestFor: 'Operators running energy-intensive sites',
        primary: true,
    },
    {
        id: 'finance-workflow-sprint',
        lane: 'Finance Workflows',
        title: 'Finance Workflow Sprint',
        tempo: '4 weeks',
        summary:
            'Map one close process — reconciliation, line-item accounting, tax and leases, or MIS — and leave the automation path around the ERP you already run.',
        leaveBehind: [
            'Process map and decision rights',
            'Match tiers, exceptions, and human gates',
            'Pilot / no-pilot recommendation',
        ],
        bestFor: 'CFOs and controllers under close-cycle pressure',
        primary: true,
    },
    {
        id: 'evidence-lens-sprint',
        lane: 'Evidence Lens',
        title: 'Evidence Lens Sprint',
        tempo: 'Scoped',
        summary:
            'Take field MRV from kiln batches, feedstock, and site data through to evidence a buyer will actually accept.',
        leaveBehind: [
            'MRV and batch evidence workflow',
            'Buyer assurance and reporting shape',
            'Regulatory obligation tracking',
        ],
        bestFor: 'Decarb operators and regulated manufacturers',
        primary: true,
    },
    {
        id: 'studio-sprint',
        lane: 'Studio · secondary',
        title: 'Studio Sprint',
        tempo: '6 weeks',
        summary:
            'Ship one bounded product or automation workflow — full-stack build, evals, guardrails, handoff.',
        leaveBehind: [
            'Workflow and interface design',
            'Build with evals and guardrails',
            'Launch, handoff, bug-fix window',
        ],
        bestFor: 'Teams shipping a single bounded workflow',
        primary: false,
    },
];

/** Options for the contact modal's engagement select. */
export const SPRINT_OPTIONS: readonly (readonly [string, string])[] = [
    ...SPRINTS.map((sprint) => [sprint.id, sprint.title] as const),
    ['not-sure', 'Not sure — need fit advice'] as const,
];

export const SPRINT_IDS = {
    plantLoop: 'plant-loop-sprint',
    financeWorkflow: 'finance-workflow-sprint',
    evidenceLens: 'evidence-lens-sprint',
    studio: 'studio-sprint',
    notSure: 'not-sure',
} as const;
