'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type CompanySize = 'sme' | 'large' | 'listed';
type EURevenue = 'under40' | '40to150' | 'over150';
type Industry = 'tech' | 'financial' | 'manufacturing' | 'healthcare' | 'other';
type ESGReporting = 'none' | 'voluntary' | 'partial' | 'full';
type DataMaturity = 'manual' | 'some_automation' | 'integrated';

interface FormData {
  companySize: CompanySize | null;
  euRevenue: EURevenue | null;
  industry: Industry | null;
  esgReporting: ESGReporting | null;
  dataMaturity: DataMaturity | null;
}

interface CSRDResult {
  applicability: 'required_now' | 'required_2026' | 'likely_exempt';
  readinessScore: number;
  gaps: string[];
  timeline: string;
  costs: {
    inHouse: { low: number; high: number };
    consultant: { low: number; high: number };
    withUs: number;
  };
}

function calcResult(data: FormData): CSRDResult {
  const { companySize, euRevenue, industry, esgReporting, dataMaturity } = data;

  let applicability: CSRDResult['applicability'] = 'likely_exempt';
  if (companySize === 'listed') {
    applicability = 'required_now';
  } else if (companySize === 'large') {
    applicability = euRevenue === 'under40' ? 'required_2026' : euRevenue === '40to150' ? 'required_2026' : 'required_now';
  } else {
    applicability = euRevenue === 'over150' ? 'required_2026' : 'likely_exempt';
  }

  let score = 100;
  const esgPenalty: Record<ESGReporting, number> = { none: 40, voluntary: 20, partial: 10, full: 0 };
  score -= esgPenalty[esgReporting ?? 'none'];
  const dataPenalty: Record<DataMaturity, number> = { manual: 30, some_automation: 15, integrated: 0 };
  score -= dataPenalty[dataMaturity ?? 'manual'];
  if (industry === 'financial' || industry === 'manufacturing') score -= 10;
  else if (industry === 'healthcare') score -= 5;
  if (companySize === 'listed') score += 5;
  score = Math.min(100, Math.max(0, score));

  const gaps: string[] = [];
  if (esgReporting === 'none') gaps.push('No ESG reporting baseline — need materiality assessment and ESRS scoping');
  if (esgReporting === 'voluntary') gaps.push('Voluntary reporting lacks CSRD-required ESRS structure and assurance readiness');
  if (esgReporting === 'partial') gaps.push('Partial CSRD coverage — likely missing Scope 3 emissions and social/governance metrics');
  if (dataMaturity === 'manual') gaps.push('Manual data collection cannot scale to CSRD volume — automation required');
  if (dataMaturity === 'some_automation') gaps.push('Partial automation needs integration to ensure audit-trail and data lineage');
  if (industry === 'financial') gaps.push('Financial sector: SFDR/Taxonomy alignment and PAI indicators add reporting complexity');
  if (industry === 'manufacturing') gaps.push('Manufacturing: Scope 3 supply chain emissions tracking is a major data gap');
  if (companySize === 'listed') gaps.push('Listed companies face immediate limited assurance requirements — engage auditors now');
  gaps.push('Double materiality assessment (impact + financial) is mandatory and often underestimated');
  gaps.push('ESRS taxonomy tagging for digital XBRL reporting needs specialist tooling');
  const topGaps = gaps.slice(0, 5);

  let timeline = '18–24 months with dedicated effort';
  if (applicability === 'required_now') {
    timeline = score >= 60 ? '6–12 months to achieve audit-ready compliance' : '12–18 months — significant foundational work needed urgently';
  } else if (applicability === 'required_2026') {
    timeline = score >= 60 ? '12–18 months to prepare comfortably before 2026 deadline' : '18–24 months — start immediately to avoid last-minute scramble';
  } else {
    timeline = 'Monitor regulation changes; voluntary preparation recommended within 24 months';
  }

  const inHouseBase = companySize === 'listed' ? { low: 450_000, high: 800_000 } : companySize === 'large' ? { low: 250_000, high: 500_000 } : { low: 120_000, high: 280_000 };
  const consultantBase = companySize === 'listed' ? { low: 200_000, high: 400_000 } : companySize === 'large' ? { low: 100_000, high: 220_000 } : { low: 60_000, high: 130_000 };
  const dataMultiplier = dataMaturity === 'manual' ? 1.4 : dataMaturity === 'some_automation' ? 1.15 : 1.0;

  return {
    applicability,
    readinessScore: score,
    gaps: topGaps,
    timeline,
    costs: {
      inHouse: { low: Math.round((inHouseBase.low * dataMultiplier) / 1000) * 1000, high: Math.round((inHouseBase.high * dataMultiplier) / 1000) * 1000 },
      consultant: { low: Math.round((consultantBase.low * dataMultiplier) / 1000) * 1000, high: Math.round((consultantBase.high * dataMultiplier) / 1000) * 1000 },
      withUs: 4999,
    },
  };
}

function fmtEUR(n: number) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function StepPanel({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <div style={{ transition: 'opacity 0.35s ease, transform 0.35s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', pointerEvents: visible ? 'auto' : 'none', position: visible ? 'relative' : 'absolute', width: '100%' }}>
      {children}
    </div>
  );
}

function SelectCard({ label, sublabel, emoji, selected, onClick }: { label: string; sublabel?: string; emoji?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" className={['w-full text-left px-5 py-4 border-2 transition-all duration-200 flex items-start gap-4 group', selected ? 'border-accent bg-accent/5' : 'border-border hover:border-ink/40 bg-white'].join(' ')}>
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

function ReadinessGauge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-amber-500' : 'text-red-500';
  const strokeColor = score >= 70 ? '#16a34a' : score >= 40 ? '#f59e0b' : '#ef4444';
  const bgBar = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const label = score >= 70 ? 'Good foundation' : score >= 40 ? 'Work needed' : 'High risk';
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="12" stroke={strokeColor} strokeDasharray={`${(score / 100) * 251.2} 251.2`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono text-xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <div>
        <p className={`font-mono text-sm font-semibold ${color}`}>{label}</p>
        <p className="text-xs text-ink-muted mt-1">Readiness score out of 100</p>
        <div className={`h-2 w-32 bg-gray-100 rounded-full mt-2 overflow-hidden`}>
          <div className={`h-full rounded-full ${bgBar} transition-all duration-700`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

function ResultsView({ result }: { result: CSRDResult }) {
  const { applicability, readinessScore, gaps, timeline, costs } = result;

  const cfgMap = {
    required_now: { label: 'CSRD Required Now', sublabel: 'Your company falls under current CSRD obligations. Immediate action required.', borderCls: 'border-red-300 bg-red-50', badgeCls: 'bg-red-500 text-white', Icon: AlertTriangle },
    required_2026: { label: 'CSRD Required from 2026', sublabel: 'Prepare now — mandatory reporting starts for your company in 2026.', borderCls: 'border-amber-300 bg-amber-50', badgeCls: 'bg-amber-500 text-white', Icon: Clock },
    likely_exempt: { label: 'Likely Exempt (for now)', sublabel: 'Current thresholds may not apply, but regulations are evolving — proactive preparation is smart.', borderCls: 'border-green-300 bg-green-50', badgeCls: 'bg-green-500 text-white', Icon: Check },
  };
  const cfg = cfgMap[applicability];
  const maxCost = Math.max(costs.inHouse.high, costs.consultant.high);

  return (
    <div className="space-y-8">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.results-animate{animation:fadeInUp 0.4s ease both}`}</style>
      <div className="results-animate space-y-8">

        {/* Applicability */}
        <div className={`border-2 p-6 ${cfg.borderCls}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.badgeCls}`}>
              <cfg.Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">CSRD Applicability</p>
              <h2 className="font-mono text-xl font-bold text-ink">{cfg.label}</h2>
              <p className="text-sm text-ink-muted mt-1">{cfg.sublabel}</p>
            </div>
          </div>
        </div>

        {/* Readiness Score */}
        <div className="border-2 border-border bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Your Readiness Score</p>
          <ReadinessGauge score={readinessScore} />
        </div>

        {/* Gaps */}
        <div className="border-2 border-border bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Top 5 Gaps to Address</p>
          <div className="space-y-3">
            {gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold text-accent">{i + 1}</span>
                </div>
                <p className="text-sm text-ink leading-relaxed">{gap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-2 border-border bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">Estimated Timeline to Compliance</p>
              <p className="font-mono text-lg font-bold text-ink">{timeline}</p>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted">Cost Comparison</h3>
          <div className="p-4 border-2 border-border bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-ink-muted">Build In-House</span>
              <span className="font-mono font-bold text-lg text-ink">{fmtEUR(costs.inHouse.low)} – {fmtEUR(costs.inHouse.high)}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-full bg-gray-700 rounded-sm" style={{ width: `${(costs.inHouse.high / maxCost) * 100}%` }} />
            </div>
            <p className="text-xs text-ink-muted mt-2">Hiring sustainability officers, ESG software licences, auditor fees, and 18–24 months of internal effort.</p>
          </div>
          <div className="p-4 border-2 border-border bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-ink-muted">Big 4 / Consultants</span>
              <span className="font-mono font-bold text-lg text-ink">{fmtEUR(costs.consultant.low)} – {fmtEUR(costs.consultant.high)}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-full bg-gray-400 rounded-sm" style={{ width: `${(costs.consultant.high / maxCost) * 100}%` }} />
            </div>
            <p className="text-xs text-ink-muted mt-2">Typical Big 4 or specialist ESG consultancy engagement. Implementation still largely on you.</p>
          </div>
          <div className="p-4 border-2 border-accent bg-accent/5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-accent">Transient Labs ESG Sprint</span>
                <span className="ml-2 inline-block bg-accent text-white font-mono text-xs px-2 py-0.5">3 weeks</span>
              </div>
              <span className="font-mono font-bold text-lg text-accent">{fmtEUR(costs.withUs)}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-full bg-accent rounded-sm" style={{ width: `${(costs.withUs / maxCost) * 100}%` }} />
            </div>
            <p className="text-xs text-ink-muted mt-2">AI-powered CSRD data pipeline, automated ESRS reporting, audit-trail system. Fixed price, 3-week delivery.</p>
          </div>
        </div>

        {/* Savings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-ink p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">Save vs. Consultants</p>
            <p className="font-mono text-2xl font-bold text-ink">{fmtEUR(costs.consultant.low - costs.withUs)} – {fmtEUR(costs.consultant.high - costs.withUs)}</p>
            <p className="text-xs text-ink-muted mt-1">compared to a typical consulting engagement</p>
          </div>
          <div className="border-2 border-ink p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-1">Delivered In</p>
            <p className="font-mono text-2xl font-bold text-ink">3 weeks</p>
            <p className="text-xs text-ink-muted mt-1">vs. 18–24 months building in-house</p>
          </div>
        </div>

        {/* What's included */}
        <div className="border-2 border-border bg-white p-6 sm:p-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-ink-muted mb-5">What&apos;s In the Transient Labs ESG Sprint</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Automated ESRS data collection pipeline', 'Scope 1, 2 & 3 emissions tracking', 'Double materiality assessment framework', 'XBRL-ready report generation', 'Audit trail & data lineage logging', 'ESG dashboard with real-time metrics', 'Integration with your existing systems', '2-week post-launch support window'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div className="border-2 border-border bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Learn More</p>
          <div className="space-y-2">
            {[
              { href: '/solutions/esg-compliance', label: 'ESG Compliance Solutions — How we automate CSRD reporting' },
              { href: '/resources/esg-checklist', label: 'Free ESG Compliance Checklist — 25-item pre-submission checklist' },
              { href: '/blog/csrd-explained', label: 'CSRD Explained — What founders need to know in 2025' },
              { href: '/blog/esg-reporting-automation', label: 'How to Automate ESG Reporting with AI' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="flex items-center gap-2 text-sm text-accent hover:underline">
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-2 border-ink bg-ink p-8 sm:p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">Next Step</p>
          <h3 className="font-mono text-2xl font-bold text-paper mb-3">Get Your CSRD Compliance Plan</h3>
          <p className="text-paper/70 mb-6 text-sm leading-relaxed max-w-sm mx-auto">We&apos;ll audit your data infrastructure, map your ESRS obligations, and give you a precise scope — no obligation.</p>
          <a href="https://cal.com/100x/scope-call" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'csrd_calculator_results', label: 'book_scope_call' })} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-mono text-sm font-semibold transition-all hover:bg-accent-hover">
            Book Free CSRD Scope Call
            <ChevronRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-paper/40 font-mono">€4,999 fixed price · 3-week delivery · No surprise costs</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-ink-muted">Estimates based on market data and CSRD thresholds as of 2025. Not legal advice.</p>
          <a href="/resources/csrd-readiness-calculator" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors underline underline-offset-2">Start over</a>
        </div>
      </div>
    </div>
  );
}

export function CSRDReadinessCalculator() {
  const TOTAL_STEPS = 5;
  const magnetName = 'csrd-readiness-calculator';
  const storageKey = `lead_magnet_unlocked_${magnetName}`;

  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'form' | 'email' | 'results'>('form');
  const [formData, setFormData] = useState<FormData>({
    companySize: null, euRevenue: null, industry: null, esgReporting: null, dataMaturity: null,
  });
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');
  const formStartedRef = useRef(false);

  useEffect(() => {
    trackEvent('lead_magnet_view', { magnet_name: magnetName });
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(storageKey) === 'true') setPhase('results');
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

  const canAdvance = () => {
    if (step === 1) return formData.companySize !== null;
    if (step === 2) return formData.euRevenue !== null;
    if (step === 3) return formData.industry !== null;
    if (step === 4) return formData.esgReporting !== null;
    if (step === 5) return formData.dataMaturity !== null;
    return false;
  };

  const handleNext = () => { if (step < TOTAL_STEPS) setStep((s) => s + 1); else setPhase('email'); };
  const handleBack = () => { if (step > 1) setStep((s) => s - 1); };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailStatus('loading');
    setEmailError('');
    trackEvent('lead_magnet_submit', { magnet_name: magnetName });
    try {
      const res = await fetch('/api/lead-magnet', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), magnetName }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error((d as { error?: string }).error || 'Something went wrong.'); }
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, 'true');
      setEmailStatus('success');
      setPhase('results');
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const result = calcResult(formData);

  return (
    <div>
      {phase === 'form' && (
        <div>
          <ProgressBar step={step} total={TOTAL_STEPS} />
          <div className="relative min-h-[380px]">
            <StepPanel visible={step === 1}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What is your company size?</h2>
              <p className="text-sm text-ink-muted mb-6">CSRD thresholds are based on employee count and financials.</p>
              <div className="space-y-3">
                <SelectCard emoji="🏢" label="SME — under 250 employees" sublabel="Small or medium-sized enterprise" selected={formData.companySize === 'sme'} onClick={() => setField('companySize', 'sme')} />
                <SelectCard emoji="🏭" label="Large company — over 250 employees" sublabel="Exceeds SME threshold; CSRD likely applies" selected={formData.companySize === 'large'} onClick={() => setField('companySize', 'large')} />
                <SelectCard emoji="📈" label="Listed company (any size)" sublabel="Traded on EU-regulated market" selected={formData.companySize === 'listed'} onClick={() => setField('companySize', 'listed')} />
              </div>
            </StepPanel>
            <StepPanel visible={step === 2}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What is your annual EU net turnover?</h2>
              <p className="text-sm text-ink-muted mb-6">Revenue from EU operations determines applicability thresholds.</p>
              <div className="space-y-3">
                <SelectCard emoji="💶" label="Under €40 million" sublabel="Below the lower CSRD revenue threshold" selected={formData.euRevenue === 'under40'} onClick={() => setField('euRevenue', 'under40')} />
                <SelectCard emoji="💰" label="€40M – €150 million" sublabel="Within the mid-range threshold band" selected={formData.euRevenue === '40to150'} onClick={() => setField('euRevenue', '40to150')} />
                <SelectCard emoji="🏦" label="Over €150 million" sublabel="Exceeds the upper CSRD revenue threshold" selected={formData.euRevenue === 'over150'} onClick={() => setField('euRevenue', 'over150')} />
              </div>
            </StepPanel>
            <StepPanel visible={step === 3}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What is your primary industry?</h2>
              <p className="text-sm text-ink-muted mb-6">Sector affects which ESRS standards apply and reporting complexity.</p>
              <div className="space-y-3">
                <SelectCard emoji="💻" label="Tech / SaaS" sublabel="Software, digital services, cloud products" selected={formData.industry === 'tech'} onClick={() => setField('industry', 'tech')} />
                <SelectCard emoji="🏦" label="Financial Services" sublabel="Banks, insurers, asset managers — SFDR overlap" selected={formData.industry === 'financial'} onClick={() => setField('industry', 'financial')} />
                <SelectCard emoji="🏗️" label="Manufacturing" sublabel="Physical goods, supply chain, Scope 3 complexity" selected={formData.industry === 'manufacturing'} onClick={() => setField('industry', 'manufacturing')} />
                <SelectCard emoji="🏥" label="Healthcare" sublabel="Medical devices, pharma, health services" selected={formData.industry === 'healthcare'} onClick={() => setField('industry', 'healthcare')} />
                <SelectCard emoji="✨" label="Other" sublabel="Retail, logistics, professional services, etc." selected={formData.industry === 'other'} onClick={() => setField('industry', 'other')} />
              </div>
            </StepPanel>
            <StepPanel visible={step === 4}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">What is your current ESG reporting status?</h2>
              <p className="text-sm text-ink-muted mb-6">Your existing baseline determines how much work lies ahead.</p>
              <div className="space-y-3">
                <SelectCard emoji="❌" label="None — we don't report ESG currently" sublabel="Starting from scratch; highest gap to close" selected={formData.esgReporting === 'none'} onClick={() => setField('esgReporting', 'none')} />
                <SelectCard emoji="📋" label="Voluntary / informal reporting" sublabel="GRI, CDP, or internal ESG summaries; not CSRD-structured" selected={formData.esgReporting === 'voluntary'} onClick={() => setField('esgReporting', 'voluntary')} />
                <SelectCard emoji="🔄" label="Partial CSRD alignment" sublabel="Some ESRS metrics covered; gaps remain" selected={formData.esgReporting === 'partial'} onClick={() => setField('esgReporting', 'partial')} />
                <SelectCard emoji="✅" label="Full CSRD / ESRS reporting" sublabel="Already aligned; seeking efficiency and automation" selected={formData.esgReporting === 'full'} onClick={() => setField('esgReporting', 'full')} />
              </div>
            </StepPanel>
            <StepPanel visible={step === 5}>
              <h2 className="font-mono text-xl font-bold text-ink mb-2">How mature is your ESG data collection?</h2>
              <p className="text-sm text-ink-muted mb-6">Data infrastructure is often the biggest CSRD bottleneck.</p>
              <div className="space-y-3">
                <SelectCard emoji="📊" label="Manual spreadsheets" sublabel="Data scattered across Excel, emails, and shared drives" selected={formData.dataMaturity === 'manual'} onClick={() => setField('dataMaturity', 'manual')} />
                <SelectCard emoji="⚙️" label="Some automation" sublabel="Basic tools or scripts; still manual in key areas" selected={formData.dataMaturity === 'some_automation'} onClick={() => setField('dataMaturity', 'some_automation')} />
                <SelectCard emoji="🔗" label="Integrated systems" sublabel="ESG data flows from source systems; good audit trail" selected={formData.dataMaturity === 'integrated'} onClick={() => setField('dataMaturity', 'integrated')} />
              </div>
            </StepPanel>
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button type="button" onClick={handleBack} disabled={step === 1} className="inline-flex items-center gap-2 font-mono text-sm text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            <button type="button" onClick={handleNext} disabled={!canAdvance()} className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-all hover:bg-ink/80 disabled:opacity-40 disabled:pointer-events-none">
              {step === TOTAL_STEPS ? 'See My Results' : 'Next'}<ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {phase === 'email' && (
        <div>
          <div className="border-2 border-border bg-white p-6 sm:p-8 mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Your Results Are Ready</p>
            <div className="space-y-3">
              {[{ label: 'CSRD Applicability', value: '████████████', accent: false }, { label: 'Readiness Score', value: '██ / 100', accent: false }, { label: 'Transient Labs ESG Sprint', value: '€4,999 · 3 weeks', accent: true }].map(({ label, value, accent }) => (
                <div key={label} className={`flex items-center justify-between p-3 border ${accent ? 'border-accent/30 bg-accent/5' : 'border-border'}`}>
                  <span className={`font-mono text-xs font-semibold ${accent ? 'text-accent' : 'text-ink-muted'}`}>{label}</span>
                  <span className={`font-mono text-sm tracking-widest select-none ${accent ? 'text-accent font-bold' : 'text-ink-muted/60'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-accent/20 bg-accent/5 p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Unlock Your Results — Free</p>
            <h2 className="font-mono text-2xl font-bold text-ink mb-3">Enter your email to see your full CSRD assessment</h2>
            <p className="text-ink-muted mb-6 text-sm leading-relaxed">Get your applicability ruling, readiness score, top gaps, timeline, and cost breakdown — personalised to your answers.</p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@company.com" className="flex-1 px-4 py-3 bg-white border border-border text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors" />
              <button type="submit" disabled={emailStatus === 'loading'} className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-colors hover:bg-ink/80 disabled:opacity-60 disabled:pointer-events-none">
                {emailStatus === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <>Show My Results<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            {emailStatus === 'error' && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
            <p className="mt-3 text-xs text-ink-muted">No spam. Unsubscribe any time. We respect your privacy.</p>
          </div>
          <button type="button" onClick={() => { setPhase('form'); setStep(5); }} className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Back to questions
          </button>
        </div>
      )}

      {phase === 'results' && <ResultsView result={result} />}
    </div>
  );
}
