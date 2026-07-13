import { ModuleDeepDive } from '@/components/stack/ModuleDeepDive';
import { getModule } from '@/lib/stack/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const mod = getModule('batteries');

export const metadata: Metadata = {
  title: mod?.title ?? 'Battery Gigafactories',
  description: mod?.thesis,
};

export default function BatteriesPage() {
  if (!mod) notFound();
  return <ModuleDeepDive module={mod} />;
}
