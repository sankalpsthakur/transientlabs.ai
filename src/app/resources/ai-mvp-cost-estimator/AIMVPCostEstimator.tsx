'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2, ChevronRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type ProductType = 'chatbot' | 'pipeline' | 'dashboard' | 'agent' | 'other';
type Feature =
  | 'llm'
  | 'rag'
  | 'auth'
  | 'payments'
  | 'admin'
  | 'api'
  | 'mobile'
  | 'realtime';
type TeamSituation = 'none' | 'small' | 'full' | 'exploring';
type Timeline = 'asap' | 'one_three' | 'three_six' | 'planning';

interface FormData {
  productType: ProductType | null;
  features: Set<Feature>;
  team: TeamSituation | null;
  timeline: Timeline | null;
}

interface Estimate {
  inHouse: number;
  freelancer: number;
  sprint: number;
  totalHours: number;
  calendarWeeks: number;
  savingsVsHire: number;
  weeksFaster: number;
}

/* ─────────────────────────────────────────────────────────────
   Calculation Engine
───────────────────────────────────────────────────────────── */
const BASE_HOURS: Record<ProductType, number> = {
  chatbot: 280,
  pipeline: 240,
  dashboard: 200,
  agent: 380,
  other: 280,
};

const FEATURE_HOURS: Record<Feature, number> = {
  llm: 40,
  rag: 60,
  auth: 25,
  payments: 35,
  admin: 30,
  api: 20,
  mobile: 80,
  realtime: 40,
};

const TEAM_MULTIPLIER: Record<TeamSituation, number> = {
  none: 1.4,
  small: 1.0,
  full: 0.95,
  exploring: 1.2,
};

const TIMELINE_MULTIPLIER: Record<Timeline, number> = {
  asap: 1.3,
  one_three: 1.0,
  three_six: 0.9,
  planning: 1.0,
};

function calcEstimate(data: FormData): Estimate {
  const { productType, features, team, timeline } = data;
  if (!productType || !team || !timeline) {
    return {
      inHouse: 0,
      freelancer: 0,
      sprint: 4999,
      totalHours: 0,
      calendarWeeks: 0,
      savingsVsHire: 0,
      weeksFaster: 0,
    };
  }

  const featureHours = Array.from(features).reduce((acc, f) => acc + FEATURE_HOURS[f], 0);
  const rawHours =
    (BASE_HOURS[productType] + featureHours) *
    TEAM_MULTIPLIER[team] *
    TIMELINE_MULTIPLIER[timeline];
  const totalHours = Math.round(rawHours);

  // Freelancer: senior AI freelancer blended rate $160/hr
  const freelancer = Math.round((totalHours * 160) / 100) * 100;

  // In-house: hiring lag (12 weeks) + dev time at 35 hrs/week productive
  const devWeeks = Math.ceil(totalHours / 35);
  const hiringWeeks = 12; // 3-month average time-to-hire
  const calendarWeeks = devWeeks + hiringWeeks;
  const calendarMonths = Math.ceil(calendarWeeks / 4.33);
  // $35k/month fully-loaded senior AI engineer + $42k recruiting/onboarding
  const inHouse = Math.round((calendarMonths * 35_000 + 42_000) / 1000) * 1000;

  const sprint = 4999;
  const savingsVsHire = inHouse - sprint;
  const weeksFaster = Math.max(0, calendarWeeks - 3);

  return { inHouse, freelancer, sprint, totalHours, calendarWeeks, savingsVsHire, weeksFaster };
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

// Animated step wrapper
function StepPanel({
  children,
  visible,
}: {
  children: React.ReactNode;
  visible: boolean;
}) {
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

// Selection card (single-select)
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
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-ink/40 bg-white',
      ].join(' ')}
    >
      {emoji && <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <span
          className={`font-mono font-semibold text-sm block ${
            selected ? 'text-accent' : 'text-ink'
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-ink-muted mt-0.5 block">{sublabel}</span>
        )}
      </div>
      <div
        className={[
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
          selected
            ? 'border-accent bg-accent'
            : 'border-border group-hover:border-ink/40',
        ].join(' ')}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}

// Checkbox card (multi-select)
function CheckCard({
  label,
  sublabel,
  emoji,
  checked,
  onChange,
}: {
  label: string;
  sublabel?: string;
  emoji?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      type="button"
      className={[
        'w-full text-left px-4 py-3.5 border-2 transition-all duration-200 flex items-center gap-3 group',
        checked
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-ink/40 bg-white',
      ].join(' ')}
    >
      {emoji && <span className="text-lg flex-shrink-0">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <span
          className={`font-mono font-semibold text-sm ${
            checked ? 'text-accent' : 'text-ink'
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="block text-xs text-ink-muted mt-0.5">{sublabel}</span>
        )}
      </div>
      <div
        className={[
          'w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all',
          checked
            ? 'border-accent bg-accent'
            : 'border-border group-hover:border-ink/40',
        ].join(' ')}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}

// Progress indicator
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-ink-muted uppercase tracking-widest">
          Step {step} of {total}
        </span>
        <span className="font-mono text-xs text-ink-muted">{pct}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2 mt-3">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={[
              'flex-1 h-1 rounded-full transition-all duration-300',
              i + 1 < step
                ? 'bg-accent'
                : i + 1 === step
                  ? 'bg-accent/60'
                  : 'bg-border',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

// Bar chart for results
function ResultBar({
  label,
  value,
  maxValue,
  color,
  highlight,
  badge,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  highlight?: boolean;
  badge?: string;
}) {
  const pct = Math.max(4, Math.round((value / maxValue) * 100));
  return (
    <div
      className={`p-4 border-2 ${
        highlight ? 'border-accent bg-accent/5' : 'border-border bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest font-semibold ${
              highlight ? 'text-accent' : 'text-ink-muted'
            }`}
          >
            {label}
          </span>
          {badge && (
            <span className="ml-2 inline-block bg-accent text-white font-mono text-xs px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
        <span
          className={`font-mono font-bold text-lg ${
            highlight ? 'text-accent' : 'text-ink'
          }`}
        >
          {fmt(value)}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Results View
───────────────────────────────────────────────────────────── */
function ResultsView({
  estimate,
  formData,
}: {
  estimate: Estimate;
  formData: FormData;
}) {
  const {
    inHouse,
    freelancer,
    sprint,
    totalHours,
    calendarWeeks,
    savingsVsHire,
    weeksFaster,
  } = estimate;
  const maxVal = Math.max(inHouse, freelancer, sprint) * 1.05;

  const productLabels: Record<string, string> = {
    chatbot: 'Chatbot / Copilot',
    pipeline: 'Data Pipeline',
    dashboard: 'Dashboard / Analytics',
    agent: 'Agent System',
    other: 'Custom AI Product',
  };

  const productLabel = formData.productType
    ? productLabels[formData.productType]
    : 'AI Product';
  const featureCount = formData.features.size;

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
        {/* Summary header */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
            Your Estimate
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink mb-2">
            {productLabel}
            {featureCount > 0 && (
              <span className="font-normal text-ink-muted">
                {' '}
                + {featureCount} feature{featureCount !== 1 ? 's' : ''}
              </span>
            )}
          </h2>
          <p className="text-ink-muted text-sm">
            Based on ~
            <strong className="text-ink">{totalHours.toLocaleString()} development hours</strong>{' '}
            and ~<strong className="text-ink">{calendarWeeks} calendar weeks</strong> for
            in-house hiring.
          </p>
        </div>

        {/* Bar chart comparison */}
        <div className="space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted">
            Cost Comparison
          </h3>

          <ResultBar
            label="Hire In-House"
            value={inHouse}
            maxValue={maxVal}
            color="bg-gray-700"
            badge={`~${calendarWeeks}wk`}
          />
          <div className="pl-4 -mt-1 mb-1">
            <p className="text-xs text-ink-muted leading-relaxed">
              Includes salary ($35k/mo fully loaded), benefits, recruiting ($42k) &amp;{' '}
              {Math.min(12, calendarWeeks)}-week hiring lag before a single line of code
              gets written.
            </p>
          </div>

          <ResultBar
            label="Senior Freelancers"
            value={freelancer}
            maxValue={maxVal}
            color="bg-gray-400"
            badge={`~${Math.ceil(totalHours / 40)}wk`}
          />
          <div className="pl-4 -mt-1 mb-1">
            <p className="text-xs text-ink-muted leading-relaxed">
              Blended rate of $160/hr for senior AI engineers. Quality varies; vetting takes
              2–4 weeks.
            </p>
          </div>

          <ResultBar
            label="Transient Labs Sprint"
            value={sprint}
            maxValue={maxVal}
            color="bg-accent"
            highlight
            badge="3 weeks"
          />
          <div className="pl-4 -mt-1">
            <p className="text-xs text-ink-muted leading-relaxed">
              Fixed price. Dedicated team. Full-stack AI MVP shipped in 3 weeks or your
              money back.
            </p>
          </div>
        </div>

        {/* Savings callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-ink p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">
              Save vs. Hiring
            </p>
            <p className="font-mono text-2xl font-bold text-ink">{fmt(savingsVsHire)}</p>
            <p className="text-xs text-ink-muted mt-1">compared to building in-house</p>
          </div>
          <div className="border-2 border-ink p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">
              Ship Faster By
            </p>
            <p className="font-mono text-2xl font-bold text-ink">{weeksFaster} weeks</p>
            <p className="text-xs text-ink-muted mt-1">
              vs. recruiting &amp; building in-house
            </p>
          </div>
        </div>

        {/* What's included */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-5">
            What&apos;s In the Transient Labs Sprint
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Production-ready Next.js + AI stack',
              'LLM integration (OpenAI, Anthropic, or Gemini)',
              'RAG pipeline if needed',
              'Auth, database & API setup',
              'Deployment to Vercel / AWS',
              'Figma → code (or we design it)',
              'Async daily updates & check-ins',
              '2-week bug-fix window post-launch',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-ink bg-ink p-8 sm:p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">
            Next Step
          </p>
          <h3 className="font-mono text-2xl font-bold text-paper mb-3">
            Book a 15-Min Scope Call
          </h3>
          <p className="text-paper/70 mb-6 text-sm leading-relaxed max-w-sm mx-auto">
            We&apos;ll review your specific requirements, confirm the 3-week timeline, and give
            you a precise quote — no obligation, no sales pressure.
          </p>
          <a
            href="https://cal.com/100x/scope-call"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('cta_click', {
                location: 'cost_estimator_results',
                label: 'book_scope_call',
              })
            }
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-mono text-sm font-semibold transition-all hover:bg-accent-hover"
          >
            Book Free Scope Call
            <ChevronRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-paper/40 font-mono">
            $4,999 fixed price · 3-week delivery · No surprise costs
          </p>
        </div>

        {/* Footer / restart */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-ink-muted">
            Estimates are approximate and based on market averages (early 2025).
          </p>
          <a
            href="/resources/ai-mvp-cost-estimator"
            className="font-mono text-xs text-ink-muted hover:text-ink transition-colors underline underline-offset-2"
          >
            Start over
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Interactive Component
───────────────────────────────────────────────────────────── */
export function AIMVPCostEstimator() {
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'form' | 'email' | 'results'>('form');
  const [formData, setFormData] = useState<FormData>({
    productType: null,
    features: new Set(),
    team: null,
    timeline: null,
  });
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [emailError, setEmailError] = useState('');
  const formStartedRef = useRef(false);
  const storageKey = 'lead_magnet_unlocked_ai-mvp-cost-estimator';
  const magnetName = 'ai-mvp-cost-estimator';
  const TOTAL_STEPS = 4;

  useEffect(() => {
    trackEvent('lead_magnet_view', { magnet_name: magnetName });
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(storageKey);
      if (unlocked === 'true') {
        setPhase('results');
      }
    }
  }, []);

  const handleFormStart = useCallback(() => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('lead_magnet_form_start', { magnet_name: magnetName });
    }
  }, []);

  const setProductType = (type: ProductType) => {
    handleFormStart();
    setFormData((f) => ({ ...f, productType: type }));
  };

  const toggleFeature = (feature: Feature) => {
    handleFormStart();
    setFormData((f) => {
      const next = new Set(f.features);
      if (next.has(feature)) next.delete(feature);
      else next.add(feature);
      return { ...f, features: next };
    });
  };

  const setTeam = (team: TeamSituation) => {
    handleFormStart();
    setFormData((f) => ({ ...f, team }));
  };

  const setTimeline = (timeline: Timeline) => {
    handleFormStart();
    setFormData((f) => ({ ...f, timeline }));
  };

  const canAdvance = () => {
    if (step === 1) return formData.productType !== null;
    if (step === 2) return true; // features optional
    if (step === 3) return formData.team !== null;
    if (step === 4) return formData.timeline !== null;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setPhase('email');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleEmailFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('lead_magnet_form_start', { magnet_name: magnetName });
    }
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
        throw new Error(
          (data as { error?: string }).error || 'Something went wrong.',
        );
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, 'true');
      }
      setEmailStatus('success');
      setPhase('results');
    } catch (err) {
      setEmailStatus('error');
      setEmailError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  const estimate = calcEstimate(formData);

  /* ── Render ── */
  return (
    <div>
      {/* ── FORM PHASE ── */}
      {phase === 'form' && (
        <div>
          <ProgressBar step={step} total={TOTAL_STEPS} />

          <div className="relative min-h-[380px]">
            {/* Step 1 */}
            <StepPanel visible={step === 1}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">
                What type of AI product are you building?
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                Pick the one that best describes your vision.
              </p>
              <div className="space-y-3">
                <SelectCard
                  emoji="💬"
                  label="Chatbot / Copilot"
                  sublabel="AI assistant, chat interface, or productivity tool"
                  selected={formData.productType === 'chatbot'}
                  onClick={() => setProductType('chatbot')}
                />
                <SelectCard
                  emoji="⚙️"
                  label="Data Pipeline"
                  sublabel="ETL, document processing, or automated workflows"
                  selected={formData.productType === 'pipeline'}
                  onClick={() => setProductType('pipeline')}
                />
                <SelectCard
                  emoji="📊"
                  label="Dashboard / Analytics"
                  sublabel="Reporting, insights, or BI with AI capabilities"
                  selected={formData.productType === 'dashboard'}
                  onClick={() => setProductType('dashboard')}
                />
                <SelectCard
                  emoji="🤖"
                  label="Agent System"
                  sublabel="Autonomous agents, multi-step AI workflows, tool-use"
                  selected={formData.productType === 'agent'}
                  onClick={() => setProductType('agent')}
                />
                <SelectCard
                  emoji="✨"
                  label="Other / Not sure yet"
                  sublabel="We'll figure it out together"
                  selected={formData.productType === 'other'}
                  onClick={() => setProductType('other')}
                />
              </div>
            </StepPanel>

            {/* Step 2 */}
            <StepPanel visible={step === 2}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">
                What key features do you need?
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                Select all that apply. Skip if unsure — you can always add later.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <CheckCard
                  emoji="🧠"
                  label="LLM Integration"
                  sublabel="GPT-4, Claude, Gemini etc."
                  checked={formData.features.has('llm')}
                  onChange={() => toggleFeature('llm')}
                />
                <CheckCard
                  emoji="🔍"
                  label="RAG / Search"
                  sublabel="Docs, knowledge bases, semantic search"
                  checked={formData.features.has('rag')}
                  onChange={() => toggleFeature('rag')}
                />
                <CheckCard
                  emoji="👤"
                  label="Auth / Users"
                  sublabel="Login, roles, permissions"
                  checked={formData.features.has('auth')}
                  onChange={() => toggleFeature('auth')}
                />
                <CheckCard
                  emoji="💳"
                  label="Payments"
                  sublabel="Subscriptions or one-time purchases"
                  checked={formData.features.has('payments')}
                  onChange={() => toggleFeature('payments')}
                />
                <CheckCard
                  emoji="🛠️"
                  label="Admin Dashboard"
                  sublabel="Internal tools, CMS, moderation"
                  checked={formData.features.has('admin')}
                  onChange={() => toggleFeature('admin')}
                />
                <CheckCard
                  emoji="🔌"
                  label="API / Integrations"
                  sublabel="Webhooks, REST or third-party APIs"
                  checked={formData.features.has('api')}
                  onChange={() => toggleFeature('api')}
                />
                <CheckCard
                  emoji="📱"
                  label="Mobile App"
                  sublabel="iOS / Android native or hybrid"
                  checked={formData.features.has('mobile')}
                  onChange={() => toggleFeature('mobile')}
                />
                <CheckCard
                  emoji="⚡"
                  label="Real-time"
                  sublabel="Live updates, streaming, websockets"
                  checked={formData.features.has('realtime')}
                  onChange={() => toggleFeature('realtime')}
                />
              </div>
            </StepPanel>

            {/* Step 3 */}
            <StepPanel visible={step === 3}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">
                What&apos;s your current team situation?
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                This helps us calibrate the in-house cost comparison.
              </p>
              <div className="space-y-3">
                <SelectCard
                  emoji="🚫"
                  label="No technical team"
                  sublabel="I'd need to hire everything from scratch"
                  selected={formData.team === 'none'}
                  onClick={() => setTeam('none')}
                />
                <SelectCard
                  emoji="👥"
                  label="1–2 developers"
                  sublabel="Small team, but missing AI/ML expertise"
                  selected={formData.team === 'small'}
                  onClick={() => setTeam('small')}
                />
                <SelectCard
                  emoji="🏢"
                  label="Full team, but no AI expertise"
                  sublabel="Engineers on board, just lacking LLM/AI skills"
                  selected={formData.team === 'full'}
                  onClick={() => setTeam('full')}
                />
                <SelectCard
                  emoji="🔭"
                  label="Just exploring options"
                  sublabel="Still in discovery / research phase"
                  selected={formData.team === 'exploring'}
                  onClick={() => setTeam('exploring')}
                />
              </div>
            </StepPanel>

            {/* Step 4 */}
            <StepPanel visible={step === 4}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">
                What&apos;s your target timeline?
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                Urgency affects cost — especially for in-house hiring.
              </p>
              <div className="space-y-3">
                <SelectCard
                  emoji="🔥"
                  label="ASAP — I need this yesterday"
                  sublabel="Under 4 weeks, urgent market window"
                  selected={formData.timeline === 'asap'}
                  onClick={() => setTimeline('asap')}
                />
                <SelectCard
                  emoji="📅"
                  label="1–3 months"
                  sublabel="Near-term, need to move quickly"
                  selected={formData.timeline === 'one_three'}
                  onClick={() => setTimeline('one_three')}
                />
                <SelectCard
                  emoji="🗓️"
                  label="3–6 months"
                  sublabel="Medium-term, have some runway"
                  selected={formData.timeline === 'three_six'}
                  onClick={() => setTimeline('three_six')}
                />
                <SelectCard
                  emoji="💭"
                  label="Just planning — no firm date"
                  sublabel="Early stage, researching my options"
                  selected={formData.timeline === 'planning'}
                  onClick={() => setTimeline('planning')}
                />
              </div>
            </StepPanel>
          </div>

          {/* Navigation */}
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
              {step === TOTAL_STEPS ? 'See My Estimate' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── EMAIL GATE PHASE ── */}
      {phase === 'email' && (
        <div>
          {/* Teaser / blurred preview */}
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">
              Your Estimate Is Ready
            </p>
            <div className="space-y-3">
              {[
                { label: 'Hire In-House', value: '████████████ $XXX,XXX' },
                { label: 'Freelancers', value: '███████ $XX,XXX' },
                { label: 'Transient Labs Sprint', value: '█ $4,999', accent: true },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between p-3 border ${
                    accent ? 'border-accent/30 bg-accent/5' : 'border-border'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold ${
                      accent ? 'text-accent' : 'text-ink-muted'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`font-mono text-sm tracking-widest select-none ${
                      accent ? 'text-accent font-bold' : 'text-ink-muted/60'
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email form */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
              Unlock Your Estimate — Free
            </p>
            <h2 className="font-mono text-2xl font-bold text-ink mb-3">
              Enter your email to see the full breakdown
            </h2>
            <p className="text-ink-muted mb-6 text-sm leading-relaxed">
              We&apos;ll show you the real numbers — salary, benefits, recruiting, and ramp time
              vs. freelancers vs. our fixed-price sprint.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleEmailFocus}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white border border-border text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-colors hover:bg-ink/80 disabled:opacity-60 disabled:pointer-events-none"
              >
                {emailStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Show My Estimate
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {emailStatus === 'error' && (
              <p className="mt-3 text-sm text-red-600">{emailError}</p>
            )}

            <p className="mt-3 text-xs text-ink-muted">
              No spam. Unsubscribe any time. We respect your privacy.
            </p>
          </div>

          {/* Back to form */}
          <button
            type="button"
            onClick={() => {
              setPhase('form');
              setStep(4);
            }}
            className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to questions
          </button>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && (
        <ResultsView estimate={estimate} formData={formData} />
      )}
    </div>
  );
}
