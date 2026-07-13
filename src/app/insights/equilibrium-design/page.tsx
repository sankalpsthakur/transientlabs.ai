import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameTheory } from '@/components/sections/GameTheory';

export const metadata: Metadata = {
  title: 'Equilibrium Design for Agentic Systems | Transient Labs',
  description: 'Interactive technical notes on payoff design, budget allocation, observability, trust, and governance in multi-agent systems.',
};

export default function EquilibriumDesignPage() {
  return (
    <main className="min-h-screen bg-[#110d09] text-paper">
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-paper/60 transition-colors hover:text-paper">
          <ArrowLeft className="h-4 w-4" /> Back to Transient Labs
        </Link>
      </div>
      <GameTheory />
    </main>
  );
}
