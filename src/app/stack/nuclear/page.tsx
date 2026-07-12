import { ModuleDeepDive } from '@/components/stack/ModuleDeepDive';
import { getModule } from '@/lib/stack/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const mod = getModule('nuclear');

export const metadata: Metadata = {
  title: mod?.title ?? 'Nuclear / SMR',
  description: mod?.thesis,
};

export default function NuclearPage() {
  if (!mod) notFound();
  return <ModuleDeepDive module={mod} />;
}
