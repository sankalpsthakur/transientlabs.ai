export interface ProjectMetric {
  value: string;
  label: string;
  kind: 'measured' | 'illustrative';
  scope?: string;
}

export interface Project {
  label: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  blueprint: 'Evidence Lens' | 'Plant Loop';
  featured?: boolean;
  readTime?: string;
  metrics: [ProjectMetric, ProjectMetric];
  /** @deprecated Prefer metrics — kept for any leftover consumers */
  highlights?: string[];
  accent: string;
  href?: string;
}

export const projects: Project[] = [
  {
    label: 'Field MRV',
    src: '/images/industries/field-work.png',
    alt: 'Field operators capturing batch evidence for a biochar MRV workflow',
    category: 'Biochar / CDR',
    title: 'Batch Evidence Loop',
    summary: 'Field crews capture biomass-to-shipment evidence offline; the desk reviews an audit-grade chain.',
    description:
      'Field crews capture biomass-to-shipment evidence offline; the desk reviews an audit-grade chain instead of spreadsheet theatre.',
    blueprint: 'Evidence Lens',
    featured: true,
    readTime: '5 min',
    metrics: [
      {
        value: 'Offline → sync',
        label: 'Field PWA capture',
        kind: 'measured',
        scope: 'shipped field capture pattern',
      },
      {
        value: 'Biomass → credit',
        label: 'Evidence chain coverage',
        kind: 'measured',
        scope: 'process loop, not credit volume',
      },
    ],
    accent: '#1f3f2e',
  },
  {
    label: 'Carbon ops plane',
    src: '/images/workflow-command-layer.png',
    alt: 'Operator control plane spanning project origination through O&M',
    category: 'Carbon project ops',
    title: 'Project Control Spine',
    summary: 'Origination, EPCC, batch ops, supply, finance, and HSE on one control plane.',
    description:
      'Origination, EPCC, batch ops, supply, finance, and HSE sit on one control plane so carbon projects run like plants, not slide decks.',
    blueprint: 'Evidence Lens',
    readTime: '6 min',
    metrics: [
      {
        value: 'One spine',
        label: 'Full project lifecycle',
        kind: 'measured',
        scope: 'module coverage',
      },
      {
        value: 'Ops + HSE + finance',
        label: 'Operator shell',
        kind: 'measured',
        scope: 'architecture surface',
      },
    ],
    accent: '#243447',
  },
  {
    label: 'Plant Loop entry',
    src: '/images/industries/production-floors.png',
    alt: 'Industrial site energy and control assessment workspace',
    category: 'Industrial energy',
    title: 'Energy Measure Loop',
    summary: 'Site energy balance, ranked losses, and a governed control path — the four-week Plant Loop entry.',
    description:
      'Site energy balance, ranked losses, and a governed control path — the four-week Plant Loop entry, not a savings promise.',
    blueprint: 'Plant Loop',
    featured: true,
    readTime: '5 min',
    href: '/industrial-energy-automation',
    metrics: [
      {
        value: '4 weeks',
        label: 'Audit → roadmap',
        kind: 'measured',
        scope: 'Plant Loop entry sprint',
      },
      {
        value: 'Measure → verify',
        label: 'EnMS control loop',
        kind: 'illustrative',
        scope: 'demo EnMS site',
      },
    ],
    accent: '#111616',
  },
  {
    label: 'Closed-loop plant',
    src: '/images/industries/test-stands.png',
    alt: 'Edge sensing and dispatch pattern for a green hydrogen plant',
    category: 'Green hydrogen',
    title: 'Edge Dispatch Loop',
    summary: 'Edge sensing and electrolyzer dispatch under operator authority — client unnamed.',
    description:
      'Edge sensing and electrolyzer dispatch optimization under operator authority — closed-loop plant pattern from a green-H₂ site. Client unnamed.',
    blueprint: 'Plant Loop',
    readTime: '6 min',
    metrics: [
      {
        value: 'OT edge path',
        label: 'PLC / Modbus → historian',
        kind: 'measured',
        scope: 'field-derived pattern',
      },
      {
        value: 'Dispatch setpoints',
        label: 'Day / night switch points',
        kind: 'illustrative',
        scope: 'optimizer pattern',
      },
    ],
    accent: '#1a2a32',
  },
  {
    label: 'Corporate lane',
    src: '/images/case-scope3-dashboard.png',
    alt: 'Scope 1/2/3 carbon accounting and ESRS-ready reporting dashboard',
    category: 'Corporate ESG',
    title: 'Carbon Assurance Desk',
    summary: 'Supplier evidence, Scope rollups, and ESRS-ready exports beside project MRV.',
    description:
      'Supplier evidence, Scope rollups, and ESRS-ready exports for the corporate lane beside project-level MRV.',
    blueprint: 'Evidence Lens',
    readTime: '5 min',
    metrics: [
      {
        value: 'ESRS-ready',
        label: 'Export path',
        kind: 'measured',
        scope: 'toolkit + UI shipped',
      },
      {
        value: 'Demo ledger',
        label: 'Live rollups',
        kind: 'illustrative',
        scope: 'demo tenant',
      },
    ],
    accent: '#15283d',
  },
];
