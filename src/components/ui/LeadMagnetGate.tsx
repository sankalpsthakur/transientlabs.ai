'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface LeadMagnetGateProps {
  title: string;
  description: string;
  magnetName: string;
  downloadUrl: string;
  previewContent?: React.ReactNode;
}

/**
 * Email-gate component for lead magnets.
 * - Shows preview content + email form.
 * - On submit fires GA4 funnel events and reveals download.
 * - Remembers returning visitors via localStorage.
 */
export function LeadMagnetGate({
  title,
  description,
  magnetName,
  downloadUrl,
  previewContent,
}: LeadMagnetGateProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);
  const formStartedRef = useRef(false);
  const storageKey = `lead_magnet_unlocked_${magnetName.replace(/\s+/g, '_').toLowerCase()}`;

  // Fire lead_magnet_view on mount and check localStorage
  useEffect(() => {
    trackEvent('lead_magnet_view', { magnet_name: magnetName });
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem(storageKey);
      if (unlocked === 'true') {
        setAlreadyUnlocked(true);
        setStatus('success');
      }
    }
  }, [magnetName, storageKey]);

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent('lead_magnet_form_start', { magnet_name: magnetName });
      trackEvent('form_start', { form_name: 'lead_magnet', magnet_name: magnetName });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    trackEvent('lead_magnet_submit', { magnet_name: magnetName });
    trackEvent('form_submit', { form_name: 'lead_magnet', magnet_name: magnetName });

    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), magnetName }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      trackEvent('lead_magnet_download', {
        magnet_name: magnetName,
        magnet_type: 'pdf',
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, 'true');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const handleDownloadClick = () => {
    trackEvent('lead_magnet_download', { magnet_name: magnetName, magnet_type: 'pdf' });
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10 text-center">
        <div className="w-14 h-14 bg-ink text-paper rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h2 className="font-mono text-2xl font-bold text-ink mb-3">{title}</h2>
        <p className="text-ink-muted mb-6">
          {alreadyUnlocked
            ? "Welcome back! Your download is ready."
            : "You're all set. Your download is ready."}
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDownloadClick}
          className="inline-flex items-center gap-2 rounded-none bg-ink px-8 py-4 font-mono text-sm font-semibold text-paper transition-colors hover:bg-ink/80"
        >
          Download Now
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Preview / teaser content */}
      {previewContent && (
        <div className="relative">
          {previewContent}
          {/* Fade-out overlay to signal more content behind gate */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
        </div>
      )}

      {/* Email gate card */}
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
          Free Access
        </p>
        <h2 className="font-mono text-2xl font-bold text-ink mb-3">{title}</h2>
        <p className="text-ink-muted mb-6">{description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-white border border-border text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-sm font-semibold transition-colors hover:bg-ink/80 disabled:opacity-60 disabled:pointer-events-none"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Get Free Access
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
        )}

        <p className="mt-3 text-xs text-ink-muted">
          No spam. Unsubscribe any time. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
