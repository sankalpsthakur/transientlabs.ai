import { StackExperience } from '@/components/stack/StackExperience';
import { narrative } from '@/lib/stack/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${narrative.title} — Five Infrastructure Megatrends`,
  description: narrative.thesis,
};

export default function StackPage() {
  return <StackExperience />;
}
