'use client';

import { m, type TargetAndTransition, useReducedMotion } from 'framer-motion';
import {
  Activity,
  Cloud,
  Gauge,
  LayoutDashboard,
  Lock,
  Plug,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCog,
  Workflow,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type CapabilityIconId =
  | 'docs'
  | 'action'
  | 'quality'
  | 'cost'
  | 'apps'
  | 'auth'
  | 'billing'
  | 'dashboard'
  | 'deploy'
  | 'security'
  | 'monitor'
  | 'integrations';

const icons: Record<CapabilityIconId, React.ComponentType<{ className?: string }>> = {
  docs: Sparkles,
  action: Workflow,
  quality: Gauge,
  cost: Activity,
  apps: Zap,
  auth: UserCog,
  billing: Rocket,
  dashboard: LayoutDashboard,
  deploy: Cloud,
  security: ShieldCheck,
  monitor: Activity,
  integrations: Plug,
};

const motions: Record<CapabilityIconId, TargetAndTransition> = {
  docs: { rotate: [0, 8, 0] },
  action: { rotate: [0, -8, 0] },
  quality: { scale: [1, 1.06, 1] },
  cost: { opacity: [0.7, 1, 0.7] },
  apps: { rotate: [0, 10, 0] },
  auth: { rotate: [0, -10, 0] },
  billing: { y: [0, -2, 0] },
  dashboard: { scale: [1, 1.04, 1] },
  deploy: { rotate: [0, 8, 0] },
  security: { scale: [1, 1.06, 1] },
  monitor: { opacity: [0.6, 1, 0.6] },
  integrations: { x: [0, 2, 0] },
};

export function CapabilityIcon({
  id,
  className,
  title,
}: {
  id: CapabilityIconId;
  title: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const Icon = icons[id] ?? Lock;
  const anim = motions[id] ?? { opacity: [0.75, 1, 0.75] };

  return (
    <m.div
      className={cn(
        'w-9 h-9 rounded-xl border border-white/10 bg-black/30',
        'flex items-center justify-center',
        className
      )}
      initial={false}
      animate={reduced ? undefined : anim}
      transition={{ duration: 2.0, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
      title={title}
    >
      <Icon className="w-4 h-4 text-white/70" />
    </m.div>
  );
}
