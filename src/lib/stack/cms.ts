/**
 * Lightweight CMS layer for Physical Stack.
 * Reads content/stack/cms.json at build time — edit without rewriting components.
 */

import cmsJson from '../../../content/stack/cms.json';
import type { ModuleId } from './content';
import { modules as codeModules, narrative as codeNarrative } from './content';

export interface StackCmsModule {
  hookStat: string;
  hookLabel: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface StackCms {
  version: number;
  updatedAt: string;
  site: {
    title: string;
    eyebrow: string;
    tagline: string;
    host: string;
  };
  modules: Record<ModuleId, StackCmsModule>;
}

export const stackCms = cmsJson as StackCms;

/** Merge CMS overrides onto code modules (CMS wins for hook/title fields). */
export function getStackModules() {
  return codeModules
    .filter((m) => stackCms.modules[m.id]?.enabled !== false)
    .map((m) => {
      const override = stackCms.modules[m.id];
      if (!override) return m;
      return {
        ...m,
        title: override.title || m.title,
        subtitle: override.subtitle || m.subtitle,
        hookStat: override.hookStat || m.hookStat,
        hookLabel: override.hookLabel || m.hookLabel,
      };
    });
}

export function getStackNarrative() {
  return {
    ...codeNarrative,
    title: stackCms.site.title || codeNarrative.title,
    eyebrow: stackCms.site.eyebrow || codeNarrative.eyebrow,
    tagline: stackCms.site.tagline || codeNarrative.tagline,
  };
}
