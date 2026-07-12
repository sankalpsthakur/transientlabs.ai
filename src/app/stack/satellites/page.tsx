import { ModuleDeepDive } from '@/components/stack/ModuleDeepDive';
import { getModule } from '@/lib/stack/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const mod = getModule('satellites');

export const metadata: Metadata = {
  title: mod?.title ?? 'LEO Constellations',
  description: mod?.thesis,
};

export default function SatellitesPage() {
  if (!mod) notFound();
  return <ModuleDeepDive module={mod} />;
}
