import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStandalone } from './build-standalone.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(root,'public/episode-visuals');
const source=path.join(root,'scripts/podcast/fragments');
const episodes=JSON.parse(fs.readFileSync(path.join(out,'episodes.json'),'utf8')).filter(e=>e.has_visual!==false);
const css=fs.readFileSync(path.join(out,'anatomy/iso.css'),'utf8')+'\n'+fs.readFileSync(path.join(out,'visual.css'),'utf8');
const helpers=fs.readFileSync(path.join(out,'visual-helpers.js'),'utf8');
const runtime=fs.readFileSync(path.join(out,'visual-runtime.js'),'utf8');
const groups={engineering:[5,7,14,16,30,35,37,38,39,41,43,44,45,46],computing:[1,3,4,9,10,11,12,27,28,29,31,32,33,34,36],mathematics:[6,8,15,17,18,19,20,21,22,23,24,25,26]};
const reused={2:'euv',40:'temperature',42:'actuator'};
const kit=fs.readFileSync(path.join(out,'anatomy/iso-kit.mjs'),'utf8').replace(/^export /gm,'')+'\nwindow.Anatomy={fitProjection,depthOf,iso,slabOf,cylinder,solidSvg,lineSvg,pathOf,dotsSvg,extrude,knurl};';
const depthOrder=fs.existsSync(path.join(out,'apparatus-depth-order.js'))?fs.readFileSync(path.join(out,'apparatus-depth-order.js'),'utf8'):'';
const machines=fs.readFileSync(path.join(out,'anatomy-mechanisms.js'),'utf8');
const sourceLinks={
  2:[['Berkeley Lab · EUV resist physics','https://cxro.lbl.gov/capabilities/resist-fundamentals']],
  40:[['NIST · platinum resistance thermometers','https://www.nist.gov/pml/sensor-science/thermodynamic-metrology/mercury-thermometer-alternatives/mercury-thermometer-1'],['NIST · thermocouples','https://www.nist.gov/pml/sensor-science/thermodynamic-metrology/mercury-thermometer-alternatives/mercury-thermometer-5']],
  42:[['Festo · pneumatic cylinders','https://www.festo.com/gb/en/c/products/actuators/pneumatic-cylinders-id_pim135'],['Rexroth · electromechanical cylinders','https://dc-mkt-prod.cloud.bosch.tech/xc/en/products/product-groups/linear-motion-technology/topics/electromechanical-cylinders/']],
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeScript=s=>s.replace(/<\/script/gi,'<\\/script');
const document=(episode,body)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(episode.title)} · interactive working principle</title><style>${css}</style></head><body>${body}</body></html>`;
const heightScript=episode=>`<script>(()=>{const notify=()=>parent.postMessage({type:'deep-end-visual-height',episode:${episode},height:Math.ceil(document.body.getBoundingClientRect().height)},'*');new ResizeObserver(notify).observe(document.body);notify();})();</script>`;
const selectedArg=process.argv.find(arg=>arg.startsWith('--episode='));
const selected=selectedArg?Number(selectedArg.split('=')[1]):null;
if(selectedArg && !episodes.some(e=>e.episode_number===selected)) throw new Error('Selected episode must be prepared');
for(const episode of episodes){
  if(selected!==null && episode.episode_number!==selected) continue;
  const id=episode.episode_number;let body;
  if(id<=68 && process.argv.includes('--only-new')) continue;
  if(id>=69){
    const filename=String(id).padStart(2,'0')+'-'+episode.slug+'.html';
    fs.writeFileSync(path.join(out,filename),await buildStandalone(episode));
    continue;
  }
  if(reused[id]){
    body=fs.readFileSync(path.join(source,reused[id]+'.html'),'utf8');
    body+=`<div class="sources">${sourceLinks[id].map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join('')}</div>`+heightScript(id);
  }else{
    const group=Object.entries(groups).find(([,ids])=>ids.includes(id))?.[0];
    const models=fs.readFileSync(path.join(out,id>=47?'facility-models.js':id===13?'estimation-model.js':group+'-models.js'),'utf8');
    const apparatus=id>=47?`<script>${safeScript(kit)}</script><script>${safeScript(depthOrder)}</script><script>${safeScript(machines)}</script>`:'';
    body=`<main class="iso" id="deep-end-model" data-episode="${id}"><p class="eyebrow">Fig ${String(id).padStart(2,'0')} · Working principle</p><h2 data-title></h2><p class="hint">Change a control to see the mechanism respond. Arrow keys work on sliders.</p><div class="controls" data-controls></div><div class="figure-frame"><svg class="scene" role="img" aria-label="Interactive scientific working principle"></svg><div class="readout" data-readout></div></div><p class="summary" data-summary></p><div class="sources" data-sources></div></main><script>${safeScript(helpers)}</script>${apparatus}<script>${safeScript(models)}</script><script>${safeScript(runtime)}</script>`;
  }
  const filename=String(id).padStart(2,'0')+'-'+episode.slug+'.html';
  fs.writeFileSync(path.join(out,filename),document(episode,body));
}
const gallery=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Deep End Era · Interactive episode companions</title><style>${css}body{max-width:1040px;margin:auto;padding:32px 20px}h1{font-size:clamp(28px,5vw,45px);line-height:1.1;letter-spacing:-.04em;margin:8px 0 28px}.catalogue{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin:22px 0}.catalogue a{display:flex;gap:12px;align-items:center;text-decoration:none;padding:12px 0;border-top:1px solid var(--border);font-size:13px}.catalogue span{color:var(--viz-series-1);font-variant-numeric:tabular-nums}.gallery-controls{display:grid;gap:10px;margin-bottom:18px}iframe{width:100%;border:1px solid var(--border);display:block}.subtle{color:var(--muted-foreground)}</style></head><body><p class="eyebrow">A Transient Labs production</p><h1>Deep End Era.<br>See the ideas work.</h1><div class="gallery-controls"><label for="episode">${episodes.length} episode companions</label><select id="episode">${episodes.map(e=>`<option value="${e.episode_number}">${String(e.episode_number).padStart(2,'0')} · ${esc(e.title)}</option>`).join('')}</select></div><iframe id="visual" title="Interactive episode companion" height="650" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe><div class="sources"><a id="listen" target="_blank" rel="noopener noreferrer">Episode page ↗</a><a href="https://anchor.fm/s/11859e110/podcast/rss">Canonical podcast feed ↗</a></div><div class="catalogue">${episodes.map(e=>`<a href="${String(e.episode_number).padStart(2,'0')}-${esc(e.slug)}.html"><span>${String(e.episode_number).padStart(2,'0')}</span>${esc(e.title)}</a>`).join('')}</div><script>const episodes=${JSON.stringify(episodes).replace(/</g,'\\u003c')};const pick=document.getElementById('episode'),frame=document.getElementById('visual'),listen=document.getElementById('listen');function show(){const e=episodes.find(e=>e.episode_number===+pick.value);frame.src=String(e.episode_number).padStart(2,'0')+'-'+e.slug+'.html';frame.title='Explore '+e.title;listen.href='https://transientlabs.ai/the-deep-end/'+e.slug;history.replaceState(null,'','#episode-'+e.episode_number);}pick.addEventListener('change',show);window.addEventListener('message',event=>{if(event.source!==frame.contentWindow||event.data?.type!=='deep-end-visual-height'||event.data?.episode!==+pick.value)return;const h=Number(event.data.height);if(Number.isFinite(h))frame.height=Math.max(380,Math.min(2000,h+2));});const initial=+location.hash.replace('#episode-','');if(episodes.some(e=>e.episode_number===initial))pick.value=initial;show();</script></body></html>`;
fs.writeFileSync(path.join(out,'index.html'),gallery);
const documents=Object.fromEntries(episodes.map(e=>[e.episode_number,fs.readFileSync(path.join(out,String(e.episode_number).padStart(2,'0')+'-'+e.slug+'.html'),'utf8')]));
const portable=gallery.replace("frame.src=String(e.episode_number).padStart(2,'0')+'-'+e.slug+'.html';",'frame.srcdoc=documents[e.episode_number];')
  .replace('<script>const episodes=', '<script>const documents='+JSON.stringify(documents).replace(/</g,'\\u003c')+';const episodes=');
fs.writeFileSync(path.join(out,'deep-end-episode-companions.html'),portable);
console.log('Built '+episodes.length+' self-contained episode visuals, a catalogue and a portable single-file preview.');
