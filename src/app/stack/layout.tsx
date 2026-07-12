import type { Metadata } from 'next';
import { narrative, STACK_HOST } from '@/lib/stack/content';
import { siteBrand } from '@/lib/site-brand';

export const metadata: Metadata = {
  title: {
    default: `${narrative.title} — Infrastructure Megatrends`,
    template: `%s · ${narrative.title}`,
  },
  description: narrative.tagline,
  alternates: {
    canonical: `https://${STACK_HOST}`,
  },
  openGraph: {
    title: narrative.title,
    description: narrative.tagline,
    url: `https://${STACK_HOST}`,
    siteName: siteBrand.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: narrative.title,
    description: narrative.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Immersive experience owns its chrome (no site Header/Footer).
  return (
    <div className="stack-root dark" data-experience="physical-stack">
      {children}
    </div>
  );
}
