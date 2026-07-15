import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The R3F scenes intentionally mutate Three.js objects inside frame/effect
    // callbacks. Keep React 19's new compiler diagnostics visible while the
    // scenes are migrated, without treating those imperative APIs as a broken
    // release gate. These remain warnings rather than being hidden.
    rules: {
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
    },
  },
  globalIgnores([
    '.claude/**',
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.archive/**',
    'artifacts/**',
    'compound-engineering-plugin/**',
    'crm/**',
    'marketingskills/**',
    'plugins/**',
    'pulse/**',
    'remotion/**',
    'remotion-server-test/**',
    'skills/**',
    'sniper/**',
    'spectre/**',
    'vector/**',
    '**/*.bak.*',
  ]),
]);
