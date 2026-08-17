import type { Metadata } from 'next';
import { OfferingsBench } from './OfferingsBench';

export const metadata: Metadata = {
  title: 'Offerings bench | Transient Labs',
  description:
    'Interactive production benches for energy audit, Ignition/SCADA, governed workflows, biochar DMRV, and the firm nucleus.',
  robots: { index: false, follow: false },
};

export default function OfferingsPage() {
  return <OfferingsBench />;
}
