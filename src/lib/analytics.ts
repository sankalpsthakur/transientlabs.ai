/**
 * Centralized GA4 event tracking utility.
 * All event names and shapes are documented in docs/GA4_EVENTS.md
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}
