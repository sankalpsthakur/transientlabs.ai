'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMotionValue } from 'framer-motion';
import { ModuleExperience as DmrvExperience } from '@/components/offerings/dmrv';
import { EnergyAuditPreview } from '@/components/offerings/energy-audit';
import { FirmPreview } from '@/components/offerings/firm';
import { ModuleExperience as ScadaExperience } from '@/components/offerings/scada-ignition';
import { ModuleExperience as WorkflowExperience } from '@/components/offerings/workflow-layer';

const TABS = [
  { id: 'audit', label: '04 · Energy audit', href: '#audit' },
  { id: 'scada', label: '03 · SCADA / Ignition', href: '#scada' },
  { id: 'workflow', label: '02 · Workflow layer', href: '#workflow' },
  { id: 'dmrv', label: '01 · Biochar DMRV', href: '#dmrv' },
  { id: 'firm', label: '05 · Firm + priors', href: '#firm' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function ScadaPreview() {
  const progress = useMotionValue(0.42);
  return <ScadaExperience progress={progress} />;
}

export function OfferingsBench() {
  const [tab, setTab] = useState<TabId>('audit');
  const heading = useMemo(() => TABS.find((item) => item.id === tab)?.label ?? '', [tab]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-border bg-paper-warm/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              Transient Labs · offering bench
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Production visual depth
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-light">
              Energy audit feeds Ignition. Ignition feeds the workflow layer. DMRV is the optional evidence vertical.
              The firm nucleus is why a promoter takes the call. Work may orbit. Authority does not.
            </p>
          </div>
          <Link href="/" className="text-sm font-medium text-ink hover:text-accent">
            ← Site
          </Link>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4 sm:px-6" aria-label="Offerings">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                tab === item.id ? 'border-ink bg-ink text-paper' : 'border-border bg-white text-ink-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">{heading}</p>

        {tab === 'audit' ? <EnergyAuditPreview /> : null}
        {tab === 'scada' ? <ScadaPreview /> : null}
        {tab === 'workflow' ? <WorkflowExperience /> : null}
        {tab === 'dmrv' ? <DmrvExperience /> : null}
        {tab === 'firm' ? <FirmPreview controls /> : null}
      </main>
    </div>
  );
}
