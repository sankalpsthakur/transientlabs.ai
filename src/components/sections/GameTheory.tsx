'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/Motion';
import { PayoffMatrix } from '@/components/motion/PayoffMatrix';
import { BudgetSimulator } from '@/components/motion/BudgetSimulator';
import { TrustGame } from '@/components/motion/TrustGame';
import { StackelbergDiagram } from '@/components/motion/StackelbergDiagram';

const demos = [
  {
    level: 'L0',
    title: 'Payoff Matrix',
    subtitle: 'The Rational Agent',
    description: 'Change the payoffs. Watch the equilibrium shift.',
    Component: PayoffMatrix,
  },
  {
    level: 'L3',
    title: 'Budget Wars',
    subtitle: 'Intra-Firm Dynamics',
    description: 'Switch allocation policies. See who games the system.',
    Component: BudgetSimulator,
  },
  {
    level: 'L5',
    title: 'Trust Game',
    subtitle: 'Human x AI Equilibria',
    description: 'Toggle observability. Watch trust compound or collapse.',
    Component: TrustGame,
  },
  {
    level: 'L6',
    title: 'Stackelberg Hierarchy',
    subtitle: 'The Autonomous Enterprise',
    description: 'Expand each layer. See who governs whom.',
    Component: StackelbergDiagram,
  },
];

function DemoCard({ level, title, subtitle, description, Component }: typeof demos[number]) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#161616] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300">
            {level}
          </span>
          <span className="text-[11px] font-semibold text-white/90">{title}</span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/25">
          {subtitle}
        </span>
      </div>

      {/* Description */}
      <div className="border-b border-white/5 bg-white/[0.02] px-4 py-2">
        <p className="text-[11px] text-white/40">{description}</p>
      </div>

      {/* Interactive */}
      <div className="flex-1 p-4">
        <Component />
      </div>

      {/* Noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}

export function GameTheory() {
  return (
    <Section
      id="game-theory"
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#110d09_0%,#0e0b0a_100%)] py-20 text-paper md:scroll-mt-28 md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute left-[-10rem] top-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_68%)] blur-3xl" />
      <div className="absolute right-[-8rem] bottom-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.08),transparent_68%)] blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="mb-14 max-w-3xl lg:mb-16">
          <FadeIn>
            <p className="mb-4 text-sm font-mono uppercase tracking-[0.28em] text-indigo-300">
              Equilibrium Design
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="mb-5 text-3xl font-semibold tracking-tight text-paper md:text-[3.6rem] md:leading-[0.92]">
              We design the game. <br />
              <span className="text-paper/52">Not just the agents.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="max-w-[38rem] text-base leading-relaxed text-paper/72 md:text-[1.05rem]">
              Every production multi-agent system is a game — agents with objectives, constraints, and incentives. We architect the equilibrium so the system converges to the right outcome by construction.
            </p>
          </FadeIn>
        </div>

        {/* Demo grid */}
        <Stagger
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          staggerDelay={0.1}
        >
          {demos.map((demo) => (
            <StaggerItem key={demo.level}>
              <DemoCard {...demo} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Closing */}
        <FadeIn delay={0.3}>
          <div className="mt-14 flex flex-col items-center gap-3 text-center lg:mt-16">
            <p className="max-w-xl text-sm leading-relaxed text-paper/52">
              Nash equilibria, Stackelberg hierarchies, and observable payoffs are not academic abstractions.
              They are the engineering primitives behind agent systems that hold up under pressure.
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
