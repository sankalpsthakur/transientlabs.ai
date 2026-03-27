'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface BlogReadTrackerProps {
  pageType: 'blog' | 'glossary' | 'compare';
  slug: string;
  wordCount?: number;
}

/**
 * Fires a `blog_read` GA4 event after 30 seconds of engagement.
 * Mounts as a client component inside server-rendered article layouts.
 */
export function BlogReadTracker({ pageType, slug, wordCount }: BlogReadTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
    const timer = setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        trackEvent('blog_read', { page_type: pageType, slug, word_count: wordCount });
      }
    }, 30_000);

    return () => clearTimeout(timer);
  }, [pageType, slug, wordCount]);

  return null;
}
