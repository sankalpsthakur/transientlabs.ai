import { ModuleDeepDive } from '@/components/stack/ModuleDeepDive';
import { getModule } from '@/lib/stack/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const mod = getModule('data-centers');

export const metadata: Metadata = {
  title: mod?.title ?? 'Hyperscale Data Centers',
  description: mod?.thesis,
};

export default function DataCentersPage() {
  if (!mod) notFound();
  return <ModuleDeepDive module={mod} />;
}
