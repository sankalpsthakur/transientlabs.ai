import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const folder = path.dirname(fileURLToPath(import.meta.url));
const sources = { 69: '69-pde', 70: '70-norm-bench', 71: '71-scaling-comparator', 72: '72-pressure-flow-cell', 73: '73-vortex-viewer', 74: '74-similarity-microscope', 75: '75-residual-force-bench', 76: '76-taylor-comparator', 77: '77-orientation-register', 78: '78-prime-power-plotter', 79: '79-finite-field-counter', 80: '80-direction-resolver', 81: '81-karatsuba-recombiner', 82: '82-sensitivity-bench', 83: '83-wave-packet-recorder', 84: '84-polar-profile-comparator', 85: '85-spherical-survey-comparator', 86: '86-branching-path-counter', 87: '87-phase-mixing-register' };

export async function buildStandalone(episode) {
  const source = sources[episode.episode_number];
  if (!source) throw new Error(`No prepared standalone source for episode ${episode.episode_number}`);
  const dir = path.join(folder, 'standalone', source);
  execFileSync(process.execPath, ['build.mjs'], { cwd: dir });
  let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
  const bundled = await build({ entryPoints: [path.join(dir, 'runtime.mjs')], bundle: true,
    write: false, format: 'iife', platform: 'browser', target: ['es2020'], minify: true });
  const runtime = bundled.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(episode.title)} · interactive working principle</title>`)
    .replace('<link rel="stylesheet" href="./style.css">', `<style>${css}\nmain{width:calc(100% - 28px);margin:20px auto 28px}header{justify-content:flex-end;margin-bottom:18px}</style>`)
    .replace(/<a class="brand"[\s\S]*?<\/a>/, '')
    .replace(/<div class="kicker">.*?<\/div>/, `<div class="kicker">Fig ${episode.episode_number} · Working principle</div>`)
    .replace(/<footer>[\s\S]*?<\/footer>/, '<footer><p class="attribution">Apparatus drawing uses <a href="https://github.com/wheresryan22/anatomy" target="_blank" rel="noopener">Anatomy by Ryan</a>, MIT licence. <a href="/episode-visuals/anatomy/LICENSE" target="_blank" rel="noopener">Licence</a></p></footer>')
    .replace('<script type="module" src="./runtime.mjs"></script>', () => `<script>${runtime}</script>`);
  const bridge = `<script>(()=>{const main=document.querySelector('main');const notify=()=>{const style=getComputedStyle(main);const height=main.getBoundingClientRect().height+parseFloat(style.marginTop)+parseFloat(style.marginBottom);parent.postMessage({type:'deep-end-visual-height',episode:${episode.episode_number},height:Math.ceil(height)},'*');};new ResizeObserver(notify).observe(main);notify();})();</script>`;
  if (html.includes('LOCAL COMPANION') || html.includes('website deployment waits') || html.includes('src="./runtime.mjs"')) throw new Error('Standalone template was not fully adapted');
  return html.replace('</body>', bridge + '</body>');
}
