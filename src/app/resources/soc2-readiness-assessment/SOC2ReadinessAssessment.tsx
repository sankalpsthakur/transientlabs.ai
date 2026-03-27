'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2, ChevronRight, Shield } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type CompanyStage = 'pre_seed' | 'seed' | 'series_a' | 'series_b_plus';
type SecurityPosture = 'none' | 'basic' | 'some' | 'mature';
type CloudProvider = 'aws' | 'gcp' | 'azure' | 'multi';
type TeamSize = '1_5' | '6_20' | '21_50' | '50_plus';
type TargetTimeline = 'asap' | '3_months' | '6_months' | '12_months';
type ComplianceDriver = 'enterprise_sales' | 'investor' | 'customer_demand' | 'regulatory';

interface FormData {
  stage: CompanyStage | null;
  posture: SecurityPosture | null;
  cloud: CloudProvider | null;
  teamSize: TeamSize | null;
  timeline: TargetTimeline | null;
  drivers: Set<ComplianceDriver>;
}

interface AssessmentResult {
  score: number;
  readinessLabel: string;
  estimatedTimeline: string;
  costDIY: number;
  costPlatform: number;
  cost100x: number;
  priorityActions: string[];
}

/* ─────────────────────────────────────────────────────────────
   Calculation Engine
───────────────────────────────────────────────────────────── */

const POSTURE_SCORE: Record<SecurityPosture, number> = {
  none: 0,
  basic: 20,
  some: 45,
  mature: 70,
};

const STAGE_SCORE: Record<CompanyStage, number> = {
  pre_seed: 5,
  seed: 10,
  series_a: 15,
  series_b_plus: 20,
};

const TEAM_SCORE: Record<TeamSize, number> = {
  '1_5': 0,
  '6_20': 3,
  '21_50': 6,
  '50_plus': 10,
};

function calcResult(data: FormData): AssessmentResult {
  const { stage, posture, teamSize, timeline, drivers } = data;

  const postureScore = posture ? POSTURE_SCORE[posture] : 0;
  const stageScore = stage ? STAGE_SCORE[stage] : 0;
  const teamScore = teamSize ? TEAM_SCORE[teamSize] : 0;
  const driverBonus = drivers.size > 0 ? Math.min(drivers.size * 2, 8) : 0;

  const rawScore = postureScore + stageScore + teamScore + driverBonus;
  const score = Math.min(100, rawScore);

  let readinessLabel: string;
  if (score < 20) readinessLabel = 'Not Ready';
  else if (score < 40) readinessLabel = 'Early Stage';
  else if (score < 60) readinessLabel = 'Developing';
  else if (score < 80) readinessLabel = 'Near Ready';
  else readinessLabel = 'Well Positioned';

  let baseWeeks = 0;
  if (posture === 'none') baseWeeks = 52;
  else if (posture === 'basic') baseWeeks = 36;
  else if (posture === 'some') baseWeeks = 20;
  else baseWeeks = 12;

  const tlMultiplier =
    timeline === 'asap' ? 0.8 :
    timeline === '3_months' ? 0.85 :
    timeline === '6_months' ? 1.0 : 1.1;

  const adjustedWeeks = Math.round(baseWeeks * tlMultiplier);
  const months = Math.round(adjustedWeeks / 4.33);
  const estimatedTimeline = `${months} month${months !== 1 ? 's' : ''}`;

  const costDIY = posture === 'none' ? 180000 : posture === 'basic' ? 120000 : posture === 'some' ? 75000 : 40000;
  const costPlatform = posture === 'none' ? 65000 : posture === 'basic' ? 45000 : posture === 'some' ? 30000 : 18000;
  const cost100x = posture === 'none' ? 28000 : posture === 'basic' ? 20000 : posture === 'some' ? 14000 : 9500;

  const actions: string[] = [];
  if (posture === 'none' || posture === 'basic') {
    actions.push('Establish a written Information Security Policy (ISP)');
    actions.push('Implement access control & least-privilege IAM across all systems');
  }
  if (posture === 'none') {
    actions.push('Deploy endpoint detection & response (EDR) on all company devices');
  }
  if (posture !== 'mature') {
    actions.push('Stand up a vulnerability management & patch cadence program');
    actions.push('Define and test an Incident Response Plan (IRP)');
  }
  if (drivers.has('enterprise_sales')) {
    actions.push('Prioritize vendor risk management questionnaire (VSRM) readiness');
  }
  if (drivers.has('investor')) {
    actions.push('Commission a gap assessment to baseline current security posture');
  }
  actions.push('Map data flows and classify sensitive data assets');
  actions.push('Configure logging, monitoring, and alerting (SIEM/CloudTrail/etc.)');
  actions.push('Schedule a SOC2 Type I audit engagement with a licensed CPA firm');

  return { score, readinessLabel, estimatedTimeline, costDIY, costPlatform, cost100x, priorityActions: actions.slice(0, 5) };
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

/* Sub-components */
function StepPanel({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <div style={{
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      pointerEvents: visible ? 'auto' : 'none',
      position: visible ? 'relative' : 'absolute',
      width: '100%',
    }}>
      {children}
    </div>
  );
}

function SelectCard({ label, sublabel, emoji, selected, onClick }: {
  label: string; sublabel?: string; emoji?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} type="button" className={[
      'w-full text-left px-5 py-4 border-2 transition-all duration-200 flex items-start gap-4 group',
      selected ? 'border-accent bg-accent/5' : 'border-border hover:border-ink/40 bg-white',
    ].join(' ')}>
      {emoji && <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <span className={`font-mono font-semibold text-sm block ${selected ? 'text-accent' : 'text-ink'}`}>{label}</span>
        {sublabel && <span className="text-xs text-ink-muted mt-0.5 block">{sublabel}</span>}
      </div>
      <div className={['w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all', selected ? 'border-accent bg-accent' : 'border-border group-hover:border-ink/40'].join(' ')}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}

function CheckCard({ label, sublabel, emoji, checked, onChange }: {
  label: string; sublabel?: string; emoji?: string; checked: boolean; onChange: () => void;
}) {
  return (
    <button onClick={onChange} type="button" className={[
      'w-full text-left px-4 py-3.5 border-2 transition-all duration-200 flex items-center gap-3 group',
      checked ? 'border-accent bg-accent/5' : 'border-border hover:border-ink/40 bg-white',
    ].join(' ')}>
      {emoji && <span className="text-lg flex-shrink-0">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <span className={`font-mono font-semibold text-sm ${checked ? 'text-accent' : 'text-ink'}`}>{label}</span>
        {sublabel && <span className="block text-xs text-ink-muted mt-0.5">{sublabel}</span>}
      </div>
      <div className={['w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all', checked ? 'border-accent bg-accent' : 'border-border group-hover:border-ink/40'].join(' ')}>
        {checked && <Check className="w-3 h-3 text-white" />}
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
          <div key={i} className={['flex-1 h-1 rounded-full transition-all duration-300', i + 1 < step ? 'bg-accent' : i + 1 === step ? 'bg-accent/60' : 'bg-border'].join(' ')} />
        ))}
      </div>
    </div>
  );
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const color = score < 20 ? 'text-red-500' : score < 40 ? 'text-orange-500' : score < 60 ? 'text-yellow-500' : score < 80 ? 'text-blue-500' : 'text-accent';
  const bgColor = score < 20 ? 'bg-red-500' : score < 40 ? 'bg-orange-500' : score < 60 ? 'bg-yellow-500' : score < 80 ? 'bg-blue-500' : 'bg-accent';
  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">Your Readiness Score</p>
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="w-32 h-32 rounded-full border-8 border-border flex items-center justify-center">
          <div className="text-center">
            <span className={`font-mono text-4xl font-bold ${color}`}>{score}</span>
            <span className="font-mono text-lg text-ink-muted">/100</span>
          </div>
        </div>
      </div>
      <div className="mb-3"><span className={`font-mono text-lg font-bold ${color}`}>{label}</span></div>
      <div className="h-3 bg-border rounded-full overflow-hidden max-w-xs mx-auto">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${bgColor}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function CostBar({ label, value, maxValue, color, highlight, badge }: {
  label: string; value: number; maxValue: number; color: string; highlight?: boolean; badge?: string;
}) {
  const pct = Math.max(4, Math.round((value / maxValue) * 100));
  return (
    <div className={`p-4 border-2 ${highlight ? 'border-accent bg-accent/5' : 'border-border bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className={`font-mono text-xs uppercase tracking-widest font-semibold ${highlight ? 'text-accent' : 'text-ink-muted'}`}>{label}</span>
          {badge && <span className="ml-2 inline-block bg-accent text-white font-mono text-xs px-2 py-0.5">{badge}</span>}
        </div>
        <span className={`font-mono font-bold text-lg ${highlight ? 'text-accent' : 'text-ink'}`}>{fmt(value)}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
        <div className={`h-full rounded-sm transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ResultsView({ result }: { result: AssessmentResult }) {
  const { score, readinessLabel, estimatedTimeline, costDIY, costPlatform, cost100x, priorityActions } = result;
  const maxCost = Math.max(costDIY, costPlatform, cost100x) * 1.05;
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .results-animate { animation: fadeInUp 0.4s ease both; }
      `}</style>
      <div className="results-animate space-y-8">
        <ScoreGauge score={score} label={readinessLabel} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-ink p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">Estimated Timeline</p>
            <p className="font-mono text-2xl font-bold text-ink">{estimatedTimeline}</p>
            <p className="text-xs text-ink-muted mt-1">to achieve SOC2 Type II</p>
          </div>
          <div className="border-2 border-accent p-5 bg-accent/5">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-1">With Transient Labs</p>
            <p className="font-mono text-2xl font-bold text-accent">8–12 weeks</p>
            <p className="text-xs text-ink-muted mt-1">accelerated program with expert guidance</p>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted">Cost Comparison</h3>
          <CostBar label="DIY (Internal Team)" value={costDIY} maxValue={maxCost} color="bg-gray-700" badge="slow" />
          <div className="pl-4 -mt-1 mb-1">
            <p className="text-xs text-ink-muted leading-relaxed">Includes internal security engineer salary, tooling procurement, audit prep, and CPA firm fees. High risk of scope creep.</p>
          </div>
          <CostBar label="Compliance Platform" value={costPlatform} maxValue={maxCost} color="bg-gray-400" badge="partial" />
          <div className="pl-4 -mt-1 mb-1">
            <p className="text-xs text-ink-muted leading-relaxed">Vanta/Drata/Secureframe subscription + your internal effort + audit fees. Still requires significant time investment.</p>
          </div>
          <CostBar label="Transient Labs SOC2 Program" value={cost100x} maxValue={maxCost} color="bg-accent" highlight badge="fastest" />
          <div className="pl-4 -mt-1">
            <p className="text-xs text-ink-muted leading-relaxed">End-to-end managed program. We handle policy writing, controls implementation, audit prep, and auditor coordination.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-5">Your Top 5 Priority Actions</h3>
          <div className="space-y-3">
            {priorityActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold">{i + 1}</div>
                <span className="text-sm text-ink leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-4">Learn More</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/solutions/security-soc2" className="inline-flex items-center gap-2 border-2 border-ink text-ink px-5 py-3 font-mono text-sm font-semibold hover:bg-ink hover:text-paper transition-all">
              <Shield className="w-4 h-4" />SOC2 Solutions<ChevronRight className="w-4 h-4" />
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 border-2 border-accent text-accent px-5 py-3 font-mono text-sm font-semibold hover:bg-accent hover:text-white transition-all">
              Talk to a SOC2 Expert<ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-ink bg-ink p-8 sm:p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">Next Step</p>
          <h3 className="font-mono text-2xl font-bold text-paper mb-3">Book a Free SOC2 Readiness Call</h3>
          <p className="text-paper/70 mb-6 text-sm leading-relaxed max-w-sm mx-auto">
            We&apos;ll review your specific situation, walk through the priority actions, and give you a clear path to SOC2 certification — no obligation.
          </p>
          <a href="/contact" onClick={() => trackEvent('cta_click', { location: 'soc2_assessment_results', label: 'book_readiness_call' })}
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-mono text-sm font-semibold transition-all hover:bg-accent-hover">
            Book Free Readiness Call<ChevronRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-paper/40 font-mono">No commitment · Expert guidance · Results-oriented</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-ink-muted">Estimates are approximate and based on industry averages (2025).</p>
          <a href="/resources/soc2-readiness-assessment" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors underline underline-offset-2">Start over</a>
        </div>
      </div>
    </div>
  );
}

function LeadMagnetGate({ result: _result, onUnlock }: { result: AssessmentResult; onUnlock: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const magnetName = 'soc2-readiness-assessment';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lead_magnet_unlocked_${magnetName}`, 'true');
      }
      setStatus('success');
      onUnlock();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Your Assessment Is Ready</p>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-border flex items-center justify-center bg-gray-50 flex-shrink-0">
            <span className="font-mono text-2xl font-bold text-ink-muted/40 select-none">??</span>
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-ink mb-1">Readiness Score: <span className="text-ink-muted/40">████</span></p>
            <p className="text-xs text-ink-muted">Timeline: <span className="text-ink-muted/40">████████</span></p>
            <p className="text-xs text-ink-muted">Estimated Cost: <span className="text-ink-muted/40">███████</span></p>
          </div>
        </div>
        <div className="space-y-2">
          {['DIY (Internal)', 'Compliance Platform', 'Transient Labs Program'].map((label, i) => (
            <div key={label} className={`flex items-center justify-between p-3 border ${i === 2 ? 'border-accent/30 bg-accent/5' : 'border-border'}`}>
              <span className={`font-mono text-xs font-semibold ${i === 2 ? 'text-accent' : 'text-ink-muted'}`}>{label}</span>
              <span className={`font-mono text-sm tracking-widest select-none ${i === 2 ? 'text-accent font-bold' : 'text-ink-muted/50'}`}>
                {i === 2 ? '████ Lowest' : '████████████'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Unlock Your Full Report — Free</p>
        <h2 className="font-mono text-2xl font-bold text-ink mb-3">Enter your email to see the full breakdown</h2>
        <p className="text-ink-muted mb-6 text-sm leading-relaxed">
          Get your readiness score, timeline estimate, cost comparison, and personalized top 5 actions to achieve SOC2 certification.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@company.com"
            className="flex-1 px-4 py-3 bg-white border border-border text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors" />
          <button type="submit" disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-colors hover:bg-ink/80 disabled:opacity-60 disabled:pointer-events-none">
            {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <>Show My Results <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        {status === 'error' && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}
        <p className="mt-3 text-xs text-ink-muted">No spam. Unsubscribe any time.</p>
      </div>
      <button type="button" onClick={() => window.location.reload()}
        className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-ink-muted hover:text-ink transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />Back to questions
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export function SOC2ReadinessAssessment() {
  const TOTAL_STEPS = 6;
  const magnetName = 'soc2-readiness-assessment';
  const storageKey = `lead_magnet_unlocked_${magnetName}`;

  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'form' | 'gate' | 'results'>('form');
  const [formData, setFormData] = useState<FormData>({
    stage: null, posture: null, cloud: null, teamSize: null, timeline: null, drivers: new Set(),
  });
  const formStartedRef = useRef(false);

  useEffect(() => {
    trackEvent('lead_magnet_view', { magnet_name: magnetName });
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true') {
      setPhase('results');
    }
  }, [storageKey]);

  const handleFormStart = useCallback(() => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('lead_magnet_form_start', { magnet_name: magnetName });
    }
  }, []);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    handleFormStart();
    setFormData((f) => ({ ...f, [key]: value }));
  };

  const toggleDriver = (driver: ComplianceDriver) => {
    handleFormStart();
    setFormData((f) => {
      const next = new Set(f.drivers);
      if (next.has(driver)) next.delete(driver); else next.add(driver);
      return { ...f, drivers: next };
    });
  };

  const canAdvance = () => {
    if (step === 1) return formData.stage !== null;
    if (step === 2) return formData.posture !== null;
    if (step === 3) return formData.cloud !== null;
    if (step === 4) return formData.teamSize !== null;
    if (step === 5) return formData.timeline !== null;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else setPhase('gate');
  };

  const result = calcResult(formData);

  return (
    <div>
      {phase === 'form' && (
        <div>
          <ProgressBar step={step} total={TOTAL_STEPS} />
          <div className="relative min-h-[400px]">
            <StepPanel visible={step === 1}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What stage is your company?</h2>
              <p className="text-sm text-ink-muted mb-6">This affects the complexity and urgency of your SOC2 journey.</p>
              <div className="space-y-3">
                <SelectCard emoji="🌱" label="Pre-seed" sublabel="Idea / prototype stage, no enterprise customers yet" selected={formData.stage === 'pre_seed'} onClick={() => setField('stage', 'pre_seed')} />
                <SelectCard emoji="🌿" label="Seed" sublabel="Early product, starting to talk to enterprise prospects" selected={formData.stage === 'seed'} onClick={() => setField('stage', 'seed')} />
                <SelectCard emoji="🚀" label="Series A" sublabel="Revenue, scaling, enterprise deals in pipeline" selected={formData.stage === 'series_a'} onClick={() => setField('stage', 'series_a')} />
                <SelectCard emoji="🏢" label="Series B+" sublabel="Established company, SOC2 blocking major contracts" selected={formData.stage === 'series_b_plus'} onClick={() => setField('stage', 'series_b_plus')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 2}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What&apos;s your current security posture?</h2>
              <p className="text-sm text-ink-muted mb-6">Be honest — this determines your baseline and timeline.</p>
              <div className="space-y-3">
                <SelectCard emoji="❌" label="None" sublabel="No formal security policies or controls in place" selected={formData.posture === 'none'} onClick={() => setField('posture', 'none')} />
                <SelectCard emoji="📄" label="Basic policies" sublabel="Have a few written policies but no enforcement or tooling" selected={formData.posture === 'basic'} onClick={() => setField('posture', 'basic')} />
                <SelectCard emoji="🔒" label="Some controls" sublabel="MFA, access controls, some logging — partially implemented" selected={formData.posture === 'some'} onClick={() => setField('posture', 'some')} />
                <SelectCard emoji="✅" label="Mature program" sublabel="Documented controls, regular audits, security culture exists" selected={formData.posture === 'mature'} onClick={() => setField('posture', 'mature')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 3}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">Which cloud provider do you primarily use?</h2>
              <p className="text-sm text-ink-muted mb-6">This shapes which native security controls we can leverage.</p>
              <div className="space-y-3">
                <SelectCard emoji="🟠" label="AWS" sublabel="Amazon Web Services — EC2, S3, RDS, Lambda, etc." selected={formData.cloud === 'aws'} onClick={() => setField('cloud', 'aws')} />
                <SelectCard emoji="🔵" label="GCP" sublabel="Google Cloud Platform — GKE, BigQuery, Cloud Run, etc." selected={formData.cloud === 'gcp'} onClick={() => setField('cloud', 'gcp')} />
                <SelectCard emoji="🟦" label="Azure" sublabel="Microsoft Azure — AKS, Azure SQL, Functions, etc." selected={formData.cloud === 'azure'} onClick={() => setField('cloud', 'azure')} />
                <SelectCard emoji="☁️" label="Multi-cloud" sublabel="Two or more cloud providers" selected={formData.cloud === 'multi'} onClick={() => setField('cloud', 'multi')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 4}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">How many people are on your team?</h2>
              <p className="text-sm text-ink-muted mb-6">Larger teams have more complex access control requirements.</p>
              <div className="space-y-3">
                <SelectCard emoji="👤" label="1–5 people" sublabel="Founder-led, very small team" selected={formData.teamSize === '1_5'} onClick={() => setField('teamSize', '1_5')} />
                <SelectCard emoji="👥" label="6–20 people" sublabel="Small startup with functional teams forming" selected={formData.teamSize === '6_20'} onClick={() => setField('teamSize', '6_20')} />
                <SelectCard emoji="🏬" label="21–50 people" sublabel="Growing company, multiple departments" selected={formData.teamSize === '21_50'} onClick={() => setField('teamSize', '21_50')} />
                <SelectCard emoji="🏙️" label="50+ people" sublabel="Scaled organization, complex access requirements" selected={formData.teamSize === '50_plus'} onClick={() => setField('teamSize', '50_plus')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 5}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What&apos;s your target timeline for SOC2?</h2>
              <p className="text-sm text-ink-muted mb-6">Urgency affects approach and cost.</p>
              <div className="space-y-3">
                <SelectCard emoji="🔥" label="ASAP" sublabel="Deal blocking right now — need cert urgently" selected={formData.timeline === 'asap'} onClick={() => setField('timeline', 'asap')} />
                <SelectCard emoji="📅" label="3 months" sublabel="Enterprise deals in pipeline, need to move fast" selected={formData.timeline === '3_months'} onClick={() => setField('timeline', '3_months')} />
                <SelectCard emoji="🗓️" label="6 months" sublabel="Planning ahead, want to be ready for next sales cycle" selected={formData.timeline === '6_months'} onClick={() => setField('timeline', '6_months')} />
                <SelectCard emoji="💭" label="12 months" sublabel="Long-term planning, no immediate pressure" selected={formData.timeline === '12_months'} onClick={() => setField('timeline', '12_months')} />
              </div>
            </StepPanel>

            <StepPanel visible={step === 6}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">Why do you need SOC2?</h2>
              <p className="text-sm text-ink-muted mb-6">Select all that apply — helps us prioritize the right controls.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <CheckCard emoji="💼" label="Enterprise sales" sublabel="Prospects require SOC2 to sign" checked={formData.drivers.has('enterprise_sales')} onChange={() => toggleDriver('enterprise_sales')} />
                <CheckCard emoji="💰" label="Investor requirement" sublabel="VC/PE due diligence requirement" checked={formData.drivers.has('investor')} onChange={() => toggleDriver('investor')} />
                <CheckCard emoji="🤝" label="Customer demand" sublabel="Existing customers requesting it" checked={formData.drivers.has('customer_demand')} onChange={() => toggleDriver('customer_demand')} />
                <CheckCard emoji="⚖️" label="Regulatory" sublabel="Industry regulation or compliance mandate" checked={formData.drivers.has('regulatory')} onChange={() => toggleDriver('regulatory')} />
              </div>
            </StepPanel>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button type="button" onClick={() => step > 1 && setStep((s) => s - 1)} disabled={step === 1}
              className="inline-flex items-center gap-2 font-mono text-sm text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            <button type="button" onClick={handleNext} disabled={!canAdvance()}
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-all hover:bg-ink/80 disabled:opacity-40 disabled:pointer-events-none">
              {step === TOTAL_STEPS ? 'See My Results' : 'Next'}<ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {phase === 'gate' && <LeadMagnetGate result={result} onUnlock={() => setPhase('results')} />}
      {phase === 'results' && <ResultsView result={result} />}
    </div>
  );
}
