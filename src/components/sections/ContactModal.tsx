'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { trackEvent } from '@/lib/analytics';

const services = [
  ['delivery-sprint', '6-week Product & Automation Sprint'],
  ['industrial-energy-automation', 'Industrial Energy & Automation'],
  ['soc2-readiness', 'SOC 2 Readiness'],
  ['fractional-cto', 'Fractional CTO'],
  ['custom-scope', 'Custom Scope'],
] as const;

type FormData = {
  name: string;
  email: string;
  company: string;
  service: string;
  brief: string;
  honeypot: string;
};

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  service: '',
  brief: '',
  honeypot: '',
};

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formStartedRef = useRef(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.honeypot) return setStatus('success');
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, timestamp: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error();
      trackEvent('form_submit', { form_name: 'contact', service: formData.service });
      trackEvent('generate_lead', { method: 'contact_form', service: formData.service });
      setStatus('success');
      setFormData(initialFormData);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Email hello@transientlabs.ai and we will reply within one business day.');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8 md:p-10">
        {status === 'success' ? (
          <div className="py-10 text-center" aria-live="polite">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-ink">Request received</h2>
            <p className="mx-auto mb-7 max-w-md text-ink-light">
              We will reply within one business day with fit, next steps, and the right scope.
            </p>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <div className="mb-7 pr-10">
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.24em] text-ink-muted">Start with the decision</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Request a focused scoping call</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-light">
                Five fields. No sales maze. We will confirm fit, inputs, and the next available slot.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              onFocus={() => {
                if (!formStartedRef.current) {
                  formStartedRef.current = true;
                  trackEvent('form_start', { form_name: 'contact' });
                }
              }}
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-ink-muted">
                  Name <span className="text-accent">*</span>
                  <input required name="name" value={formData.name} onChange={handleChange} autoComplete="name" className="mt-1.5 min-h-12 w-full border border-border bg-white px-4 text-ink outline-none transition-colors focus:border-ink" />
                </label>
                <label className="text-sm text-ink-muted">
                  Work email <span className="text-accent">*</span>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" className="mt-1.5 min-h-12 w-full border border-border bg-white px-4 text-ink outline-none transition-colors focus:border-ink" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-ink-muted">
                  Company
                  <input name="company" value={formData.company} onChange={handleChange} autoComplete="organization" className="mt-1.5 min-h-12 w-full border border-border bg-white px-4 text-ink outline-none transition-colors focus:border-ink" />
                </label>
                <label className="text-sm text-ink-muted">
                  Engagement <span className="text-accent">*</span>
                  <select required name="service" value={formData.service} onChange={handleChange} className="mt-1.5 min-h-12 w-full border border-border bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-ink">
                    <option value="">Choose one</option>
                    {services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>

              <label className="block text-sm text-ink-muted">
                What needs to change? <span className="text-accent">*</span>
                <textarea required name="brief" value={formData.brief} onChange={handleChange} rows={4} placeholder="Current state, target outcome, and any hard deadline." className="mt-1.5 w-full resize-y border border-border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted/50 focus:border-ink" />
              </label>

              <input name="honeypot" value={formData.honeypot} onChange={handleChange} className="absolute -left-[9999px] opacity-0" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {status === 'error' ? <p className="text-sm text-red-700" role="alert">{errorMessage}</p> : null}

              <Button type="submit" variant="primary" size="lg" className="group w-full" disabled={status === 'loading'}>
                {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : <>Request a call<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </Button>
              <p className="text-center text-xs text-ink-muted">No spam. We reply within one business day.</p>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
