'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2, ChevronRight, Server, Database, Code2, Globe, DollarSign } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type BuildType = 'chatbot' | 'document' | 'analytics' | 'workflow' | 'agent';
type DataSensitivity = 'public' | 'internal' | 'pii' | 'financial';
type Scale = 'mvp' | 'small' | 'medium' | 'large';
type Budget = 'micro' | 'starter' | 'growth' | 'scale';
type TeamExp = 'none' | 'some' | 'strong';

interface FormData {
  buildType: BuildType | null;
  dataSensitivity: DataSensitivity | null;
  scale: Scale | null;
  budget: Budget | null;
  teamExp: TeamExp | null;
}

interface StackRecommendation {
  llmProvider: { name: string; model: string; reason: string };
  framework: { name: string; reason: string };
  vectorDb: { name: string; reason: string };
  hosting: { name: string; reason: string };
  estimatedMonthlyCost: { low: number; high: number };
  warnings: string[];
  tags: string[];
}

/* ─────────────────────────────────────────────────────────────
   Recommendation Engine
───────────────────────────────────────────────────────────── */
function getRecommendation(data: FormData): StackRecommendation {
  const { buildType, dataSensitivity, scale, budget, teamExp } = data;

  // --- LLM Provider ---
  let llmProvider: StackRecommendation['llmProvider'];

  if (dataSensitivity === 'pii' || dataSensitivity === 'financial') {
    llmProvider = {
      name: 'Azure OpenAI',
      model: 'GPT-4o (Azure)',
      reason: 'HIPAA/SOC2 compliant deployment. Data stays in your Azure tenant with full audit logs.',
    };
  } else if (budget === 'micro') {
    llmProvider = {
      name: 'OpenAI',
      model: 'GPT-4o mini',
      reason: 'Best price-to-performance for early-stage. ~$0.15/1M input tokens.',
    };
  } else if (buildType === 'agent' || buildType === 'document') {
    llmProvider = {
      name: 'Anthropic',
      model: 'Claude 3.5 Sonnet',
      reason: 'Superior long-context reasoning, document analysis, and tool use. 200K token context window.',
    };
  } else if (budget === 'scale' && teamExp === 'strong') {
    llmProvider = {
      name: 'AWS Bedrock',
      model: 'Claude 3.5 + Titan',
      reason: 'Multi-model flexibility, enterprise SLAs, and native AWS ecosystem integration.',
    };
  } else {
    llmProvider = {
      name: 'OpenAI',
      model: 'GPT-4o',
      reason: 'Best-in-class quality and ecosystem. Largest community, best tooling support.',
    };
  }

  // --- Framework ---
  let framework: StackRecommendation['framework'];

  if (teamExp === 'none') {
    framework = {
      name: 'Vercel AI SDK',
      reason: 'Minimal setup, works out of the box with Next.js. Best for non-ML teams.',
    };
  } else if (buildType === 'agent' || buildType === 'workflow') {
    framework = {
      name: 'LangGraph',
      reason: 'Purpose-built for stateful agent workflows and multi-step orchestration with cycles.',
    };
  } else if (buildType === 'document') {
    framework = {
      name: 'LlamaIndex',
      reason: 'Best-in-class for RAG pipelines, document ingestion, and retrieval optimization.',
    };
  } else if (teamExp === 'strong') {
    framework = {
      name: 'LangChain + custom',
      reason: 'Maximum flexibility and control for teams with ML expertise.',
    };
  } else {
    framework = {
      name: 'LangChain',
      reason: 'Mature ecosystem, excellent abstractions, huge community, battle-tested.',
    };
  }

  // --- Vector DB ---
  let vectorDb: StackRecommendation['vectorDb'];

  if (buildType === 'analytics' && scale !== 'large') {
    vectorDb = {
      name: 'pgvector (Postgres)',
      reason: 'No separate service. Simplest path if you are already on Postgres.',
    };
  } else if (budget === 'micro' || scale === 'mvp') {
    vectorDb = {
      name: 'Chroma (local) or Pinecone free tier',
      reason: 'Zero cost to start. Easy migration path when you scale.',
    };
  } else if (scale === 'large' || budget === 'scale') {
    vectorDb = {
      name: 'Weaviate or Qdrant',
      reason: 'Open-source, self-hosted at scale. Sub-100ms latency at millions of vectors.',
    };
  } else if (dataSensitivity === 'pii' || dataSensitivity === 'financial') {
    vectorDb = {
      name: 'pgvector (Azure/AWS managed)',
      reason: 'Keeps all vector data in your compliant cloud environment.',
    };
  } else {
    vectorDb = {
      name: 'Pinecone',
      reason: 'Managed, production-ready, no infra to maintain. Generous free tier.',
    };
  }

  // --- Hosting ---
  let hosting: StackRecommendation['hosting'];

  if (scale === 'large' || budget === 'scale') {
    if (dataSensitivity === 'pii' || dataSensitivity === 'financial') {
      hosting = {
        name: 'AWS (ECS + RDS)',
        reason: 'Enterprise compliance, VPC isolation, SOC2/HIPAA controls. Full audit trail.',
      };
    } else {
      hosting = {
        name: 'GCP or AWS',
        reason: 'Auto-scaling, global CDN, and cost efficiency at 100K+ users.',
      };
    }
  } else if (teamExp === 'none' || scale === 'mvp') {
    hosting = {
      name: 'Vercel + Railway',
      reason: 'Deploy in minutes. No DevOps required. Scales automatically to your traffic.',
    };
  } else if (scale === 'medium') {
    hosting = {
      name: 'Railway or Fly.io',
      reason: 'Developer-friendly with more control than Vercel. Good price/scale ratio.',
    };
  } else {
    hosting = {
      name: 'Vercel (frontend) + Railway (backend)',
      reason: 'Best developer experience. Easy CI/CD and preview deployments.',
    };
  }

  // --- Cost estimate ---
  const costMap: Record<Budget, [number, number]> = {
    micro: [30, 95],
    starter: [150, 450],
    growth: [550, 1800],
    scale: [2200, 8000],
  };
  const [low, high] = budget ? costMap[budget] : [50, 200];

  // --- Warnings ---
  const warnings: string[] = [];

  if (dataSensitivity === 'pii') {
    warnings.push('Healthcare data requires a BAA (Business Associate Agreement) with your LLM provider. Azure OpenAI and AWS Bedrock both offer this. Standard OpenAI does not.');
  }
  if (dataSensitivity === 'financial') {
    warnings.push('Financial data requires SOC2 Type II compliance. Verify your chosen providers are certified before going live with real user data.');
  }
  if (budget === 'micro' && scale === 'large') {
    warnings.push('Budget vs. scale mismatch: serving 100K+ users on <$100/mo is not realistic. Plan for at least $2K+/mo at that scale.');
  }
  if (teamExp === 'none' && buildType === 'agent') {
    warnings.push('Custom agent systems have high operational complexity. Consider starting with a chatbot pattern and iterating toward agents once your team gains experience.');
  }

  // --- Tags ---
  const tags: string[] = [];
  if (dataSensitivity === 'pii' || dataSensitivity === 'financial') tags.push('Enterprise-grade');
  if (budget === 'micro' || scale === 'mvp') tags.push('Startup-friendly');
  if (teamExp === 'none') tags.push('Low-ops');
  if (buildType === 'agent' || buildType === 'workflow') tags.push('Agentic');
  if (scale === 'large') tags.push('Enterprise-scale');

  return {
    llmProvider,
    framework,
    vectorDb,
    hosting,
    estimatedMonthlyCost: { low, high },
    warnings,
    tags,
  };
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function fmtRange(low: number, high: number) {
  const f = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return `${f(low)} – ${f(high)}`;
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */
function StepPanel({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <div
      style={{
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        position: visible ? 'relative' : 'absolute',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

function SelectCard({
  label,
  sublabel,
  emoji,
  selected,
  onClick,
}: {
  label: string;
  sublabel?: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        'w-full text-left px-5 py-4 border-2 transition-all duration-200 flex items-start gap-4 group',
        selected ? 'border-accent bg-accent/5' : 'border-border hover:border-ink/40 bg-white',
      ].join(' ')}
    >
      {emoji && <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <span className={`font-mono font-semibold text-sm block ${selected ? 'text-accent' : 'text-ink'}`}>
          {label}
        </span>
        {sublabel && <span className="text-xs text-ink-muted mt-0.5 block">{sublabel}</span>}
      </div>
      <div
        className={[
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
          selected ? 'border-accent bg-accent' : 'border-border group-hover:border-ink/40',
        ].join(' ')}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-ink-muted uppercase tracking-widest">Step {step} of {total}</span>
        <span className="font-mono text-xs text-ink-muted">{pct}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all duration-500 ease-out rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex gap-2 mt-3">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={[
              'flex-1 h-1 rounded-full transition-all duration-300',
              i + 1 < step ? 'bg-accent' : i + 1 === step ? 'bg-accent/60' : 'bg-border',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

function StackCard({
  icon: Icon,
  category,
  name,
  model,
  reason,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  name: string;
  model?: string;
  reason: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-5 border-2 ${highlight ? 'border-accent bg-accent/5' : 'border-border bg-white'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-accent text-white' : 'bg-gray-100 text-ink'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className={`font-mono text-xs uppercase tracking-widest ${highlight ? 'text-accent' : 'text-ink-muted'}`}>{category}</p>
          <p className="font-mono font-bold text-ink text-base leading-tight">
            {name}
            {model && <span className="font-normal text-ink-muted text-sm"> · {model}</span>}
          </p>
        </div>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{reason}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Results View
───────────────────────────────────────────────────────────── */
function ResultsView({ rec, formData }: { rec: StackRecommendation; formData: FormData }) {
  const buildLabels: Record<BuildType, string> = {
    chatbot: 'Chatbot / Copilot',
    document: 'Document Processor',
    analytics: 'Analytics Dashboard',
    workflow: 'Workflow Automation',
    agent: 'Custom Agent System',
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .results-animate { animation: fadeInUp 0.4s ease both; }
      `}</style>
      <div className="results-animate space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Your Recommended Stack</p>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink mb-2">
            {formData.buildType ? buildLabels[formData.buildType] : 'Your AI Product'}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {rec.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs bg-ink text-paper px-2 py-1">{tag}</span>
            ))}
          </div>
        </div>

        {/* Stack cards */}
        <div>
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-4">Recommended Stack</h3>
          <div className="space-y-3">
            <StackCard icon={Code2} category="LLM Provider" name={rec.llmProvider.name} model={rec.llmProvider.model} reason={rec.llmProvider.reason} highlight />
            <StackCard icon={Server} category="Framework / SDK" name={rec.framework.name} reason={rec.framework.reason} />
            <StackCard icon={Database} category="Vector Database" name={rec.vectorDb.name} reason={rec.vectorDb.reason} />
            <StackCard icon={Globe} category="Hosting" name={rec.hosting.name} reason={rec.hosting.reason} />
          </div>
        </div>

        {/* Cost estimate */}
        <div className="border-2 border-ink p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-ink" />
            <p className="font-mono text-sm uppercase tracking-widest text-ink-muted">Estimated Monthly AI Infra Cost</p>
          </div>
          <p className="font-mono text-3xl font-bold text-ink">
            {fmtRange(rec.estimatedMonthlyCost.low, rec.estimatedMonthlyCost.high)}
            <span className="text-sm font-normal text-ink-muted ml-2">/mo</span>
          </p>
          <p className="text-xs text-ink-muted mt-2">Covers LLM API calls, vector DB, and hosting. Scales with usage.</p>
        </div>

        {/* Warnings */}
        {rec.warnings.length > 0 && (
          <div className="border-2 border-yellow-400 bg-yellow-50 p-5 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-yellow-700 mb-3">Things to Consider</p>
            {rec.warnings.map((w, i) => (
              <p key={i} className="text-sm text-yellow-800 leading-relaxed">{w}</p>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-ink bg-ink p-8 sm:p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">Skip the Setup</p>
          <h3 className="font-mono text-2xl font-bold text-paper mb-3">We&apos;ll Build It For You — In 3 Weeks</h3>
          <p className="text-paper/70 mb-6 text-sm leading-relaxed max-w-sm mx-auto">
            Transient Labs builds production-ready AI MVPs using exactly this stack. Fixed price, 3-week delivery, money-back guarantee.
          </p>
          <a
            href="https://cal.com/100x/scope-call"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'tech_stack_guide_results', label: 'book_scope_call' })}
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-mono text-sm font-semibold transition-all hover:bg-accent-hover"
          >
            Book Free Scope Call
            <ChevronRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-paper/40 font-mono">$4,999 fixed price · 3-week delivery · No surprise costs</p>
        </div>

        {/* Restart */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-ink-muted">Stack recommendations based on current best practices (early 2025).</p>
          <a href="/resources/ai-tech-stack-guide" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors underline underline-offset-2">
            Start over
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export function AITechStackGuide() {
  const TOTAL_STEPS = 5;
  const magnetName = 'ai-tech-stack-guide';
  const storageKey = `lead_magnet_unlocked_${magnetName}`;

  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'form' | 'email' | 'results'>('form');
  const [formData, setFormData] = useState<FormData>({
    buildType: null,
    dataSensitivity: null,
    scale: null,
    budget: null,
    teamExp: null,
  });
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');
  const formStartedRef = useRef(false);

  useEffect(() => {
    trackEvent('lead_magnet_view', { magnet_name: magnetName });
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(storageKey);
      if (unlocked === 'true') setPhase('results');
    }
  }, [storageKey]);

  const handleFormStart = useCallback(() => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('lead_magnet_form_start', { magnet_name: magnetName });
    }
  }, []);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    handleFormStart();
    setFormData((f) => ({ ...f, [key]: val }));
  }

  const canAdvance = () => {
    if (step === 1) return formData.buildType !== null;
    if (step === 2) return formData.dataSensitivity !== null;
    if (step === 3) return formData.scale !== null;
    if (step === 4) return formData.budget !== null;
    if (step === 5) return formData.teamExp !== null;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else setPhase('email');
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailStatus('loading');
    setEmailError('');
    trackEvent('lead_magnet_submit', { magnet_name: magnetName });

    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), magnetName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Something went wrong.');
      }
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, 'true');
      setEmailStatus('success');
      setPhase('results');
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const rec = getRecommendation(formData);

  return (
    <div>
      {/* ── FORM PHASE ── */}
      {phase === 'form' && (
        <div>
          <ProgressBar step={step} total={TOTAL_STEPS} />

          <div className="relative min-h-[380px]">
            <StepPanel visible={step === 1}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What are you building?</h2>
              <p className="text-sm text-ink-muted mb-6">Pick the closest match to your project.</p>
              <div className="space-y-3">
                <SelectCard emoji="💬" label="Chatbot / Copilot" sublabel="AI assistant, chat interface, or embedded copilot" selected={formData.buildType === 'chatbot'} onClick={() => set('buildType', 'chatbot')} />
                <SelectCard emoji="📄" label="Document Processor" sublabel="PDF extraction, Q&amp;A over docs, RAG pipeline" selected={formData.buildType === 'document'} onClick={() => set('buildType', 'document')} />
                <SelectCard emoji="📊" label="Analytics Dashboard" sublabel="AI-powered insights, reporting, or BI tool" selected={formData.buildType === 'analytics'} onClick={() => set('buildType', 'analytics')} />
                <SelectCard emoji="⚙️" label="Workflow Automation" sublabel="Multi-step AI pipelines, n8n-style automation" selected={formData.buildType === 'workflow'} onClick={() => set('buildType', 'workflow')} />
                <SelectCard emoji="🤖" label="Custom Agent" sublabel="Autonomous AI agent with tool use and memory" selected={formData.buildType === 'agent'} onClick={() => set('buildType', 'agent')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 2}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">How sensitive is your data?</h2>
              <p className="text-sm text-ink-muted mb-6">This determines which LLM providers are safe to use.</p>
              <div className="space-y-3">
                <SelectCard emoji="🌐" label="Public data" sublabel="No PII. Content is public or non-sensitive." selected={formData.dataSensitivity === 'public'} onClick={() => set('dataSensitivity', 'public')} />
                <SelectCard emoji="🏢" label="Internal business data" sublabel="Confidential but not regulated. Internal docs, CRM, etc." selected={formData.dataSensitivity === 'internal'} onClick={() => set('dataSensitivity', 'internal')} />
                <SelectCard emoji="🏥" label="PII / Healthcare" sublabel="Names, health records, personal info. HIPAA territory." selected={formData.dataSensitivity === 'pii'} onClick={() => set('dataSensitivity', 'pii')} />
                <SelectCard emoji="🏦" label="Financial / Regulated" sublabel="Payment data, financial records. SOC2/PCI compliance needed." selected={formData.dataSensitivity === 'financial'} onClick={() => set('dataSensitivity', 'financial')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 3}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">Target scale?</h2>
              <p className="text-sm text-ink-muted mb-6">Scale affects hosting and architecture choices.</p>
              <div className="space-y-3">
                <SelectCard emoji="🧪" label="MVP / Proof of concept" sublabel="Just testing the idea. A few internal users." selected={formData.scale === 'mvp'} onClick={() => set('scale', 'mvp')} />
                <SelectCard emoji="🌱" label="Small — under 1,000 users" sublabel="Early traction, growing audience." selected={formData.scale === 'small'} onClick={() => set('scale', 'small')} />
                <SelectCard emoji="🚀" label="Medium — 1K to 100K users" sublabel="Product-market fit stage, scaling up." selected={formData.scale === 'medium'} onClick={() => set('scale', 'medium')} />
                <SelectCard emoji="🏭" label="Large — 100K+ users" sublabel="Enterprise-grade. Needs serious infra." selected={formData.scale === 'large'} onClick={() => set('scale', 'large')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 4}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">Monthly AI infrastructure budget?</h2>
              <p className="text-sm text-ink-muted mb-6">Covers LLM API, vector DB, and hosting. Not your dev costs.</p>
              <div className="space-y-3">
                <SelectCard emoji="💸" label="Under $100 / month" sublabel="Bootstrapped. Optimize aggressively." selected={formData.budget === 'micro'} onClick={() => set('budget', 'micro')} />
                <SelectCard emoji="💳" label="$100 – $500 / month" sublabel="Early revenue or seed funding." selected={formData.budget === 'starter'} onClick={() => set('budget', 'starter')} />
                <SelectCard emoji="📈" label="$500 – $2,000 / month" sublabel="Growing product with real users." selected={formData.budget === 'growth'} onClick={() => set('budget', 'growth')} />
                <SelectCard emoji="🏦" label="$2,000+ / month" sublabel="Scale budget. Enterprise or Series A+." selected={formData.budget === 'scale'} onClick={() => set('budget', 'scale')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 5}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">Team AI experience?</h2>
              <p className="text-sm text-ink-muted mb-6">Determines how much abstraction and tooling you need.</p>
              <div className="space-y-3">
                <SelectCard emoji="🆕" label="None — new to AI" sublabel="No ML background. Need managed solutions." selected={formData.teamExp === 'none'} onClick={() => set('teamExp', 'none')} />
                <SelectCard emoji="🔧" label="Some — used AI APIs before" sublabel="Familiar with OpenAI/Anthropic. Some LangChain experience." selected={formData.teamExp === 'some'} onClick={() => set('teamExp', 'some')} />
                <SelectCard emoji="🎓" label="Strong — ML engineers on team" sublabel="Can fine-tune models, deploy custom infra, roll our own." selected={formData.teamExp === 'strong'} onClick={() => set('teamExp', 'strong')} />
              </div>
            </StepPanel>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center gap-2 font-mono text-sm text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-all hover:bg-ink/80 disabled:opacity-40 disabled:pointer-events-none"
            >
              {step === TOTAL_STEPS ? 'See My Stack' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── EMAIL GATE PHASE ── */}
      {phase === 'email' && (
        <div>
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Your Stack Is Ready</p>
            <div className="space-y-3">
              {[
                { label: 'LLM Provider', value: '████████████ ███ ██████' },
                { label: 'Framework / SDK', value: '██████████ ██████' },
                { label: 'Vector Database', value: '████████ ██████' },
                { label: 'Hosting', value: '████ + ███████' },
                { label: 'Est. Monthly Cost', value: '$███ – $████', accent: true },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between p-3 border ${accent ? 'border-accent/30 bg-accent/5' : 'border-border'}`}
                >
                  <span className={`font-mono text-xs font-semibold ${accent ? 'text-accent' : 'text-ink-muted'}`}>{label}</span>
                  <span className={`font-mono text-sm tracking-widest select-none ${accent ? 'text-accent font-bold' : 'text-ink-muted/60'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Unlock Your Stack — Free</p>
            <h2 className="font-mono text-2xl font-bold text-ink mb-3">Enter your email to see the full recommendation</h2>
            <p className="text-ink-muted mb-6 text-sm leading-relaxed">
              Get your personalized LLM provider, framework, vector DB, hosting, and estimated monthly cost — plus compliance warnings if relevant.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white border border-border text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-colors hover:bg-ink/80 disabled:opacity-60 disabled:pointer-events-none"
              >
                {emailStatus === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                ) : (
                  <>Show My Stack<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
            {emailStatus === 'error' && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
            <p className="mt-3 text-xs text-ink-muted">No spam. Unsubscribe any time. We respect your privacy.</p>
          </div>

          <button
            type="button"
            onClick={() => { setPhase('form'); setStep(5); }}
            className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to questions
          </button>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && <ResultsView rec={rec} formData={formData} />}
    </div>
  );
}
