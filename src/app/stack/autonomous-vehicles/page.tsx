import { ModuleDeepDive } from '@/components/stack/ModuleDeepDive';
import { getModule } from '@/lib/stack/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const mod = getModule('autonomous-vehicles');

export const metadata: Metadata = {
  title: mod?.title ?? 'Autonomous Vehicles',
  description: mod?.thesis,
};

export default function AutonomousVehiclesPage() {
  if (!mod) notFound();
  return <ModuleDeepDive module={mod} />;
}
