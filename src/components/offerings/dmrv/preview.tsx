'use client';

import { ModuleExperience } from './index';

/** Drop onto any client page to preview the offering in isolation. */
export function DmrvPreview() {
  return (
    <div className="min-h-screen bg-paper p-4 md:p-8">
      <ModuleExperience />
    </div>
  );
}
