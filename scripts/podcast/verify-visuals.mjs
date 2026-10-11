import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dir=path.join(root,'public/episode-visuals');
const ctx=vm.createContext({window:{}});
const kit=fs.readFileSync(path.join(dir,'anatomy/iso-kit.mjs'),'utf8').replace(/^export /gm,'')+'\nwindow.Anatomy={fitProjection,depthOf,iso,slabOf,cylinder,solidSvg,lineSvg,pathOf,dotsSvg,extrude,knurl};';
vm.runInContext(kit,ctx);
vm.runInContext(fs.readFileSync(path.join(dir,'anatomy-mechanisms.js'),'utf8'),ctx);
for(const file of ['visual-helpers.js','computing-models.js','engineering-models.js','mathematics-models.js','estimation-model.js']) vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),ctx,{filename:file});
vm.runInContext(fs.readFileSync(path.join(dir,'facility-models.js'),'utf8'),ctx);
export const models=ctx.window.DeepEndModels;
export const helpers=ctx.window.DeepEndHelpers;
export const episodes=JSON.parse(fs.readFileSync(path.join(dir,'episodes.json'),'utf8'));
const defaults=m=>Object.fromEntries(m.controls.map(c=>[c.key,c.value]));
const combinations=m=>m.controls.reduce((states,c)=>states.flatMap(s=>(c.type==='select'?c.options.map(o=>o.value):[...new Set([c.min,c.value,c.max])]).map(v=>({...s,[c.key]:v}))),[{}]);
let renders=0;
assert.equal(episodes.length,68);
assert.equal(new Set(episodes.map(e=>e.slug)).size,68);
assert.deepEqual(episodes.map(e=>e.episode_number),Array.from({length:68},(_,i)=>i+1));
for(const episode of episodes){
  const id=episode.episode_number;
  const filename=String(id).padStart(2,'0')+'-'+episode.slug+'.html';
  const html=fs.readFileSync(path.join(dir,filename),'utf8');
  assert.ok(html.startsWith('<!doctype html>'));
  for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1],{filename});
  if([2,40,42].includes(id)) continue;
  const model=models[id];assert.ok(model,`Missing episode ${id}`);
  assert.ok(model.sources.length);
  model.sources.forEach(s=>assert.equal(new URL(s.url).protocol,'https:'));
  for(const W of [280,390,736,1000]) for(const state of combinations(model)){
    const base=helpers(W),checked={...base};
    for(const name of ['rect','circle']) checked[name]=(...args)=>{
      const dims=name==='rect'?args.slice(2,4):[args[2]];
      assert.ok(dims.every(x=>Number.isFinite(x)&&x>=0),`Invalid ${name} in episode ${id}`);
      return base[name](...args);
    };
    const result=model.draw(checked,state);
    assert.ok(result.svg.length&&result.readout.length&&result.summary.length,`Empty episode ${id}`);
    assert.ok(!/NaN|Infinity|undefined/.test(result.svg+result.readout),`Invalid output episode ${id}`);
    assert.ok(model.controls.every(c=>c.type==='select'?c.options.some(o=>o.value===state[c.key]):state[c.key]>=c.min&&state[c.key]<=c.max),`Control range episode ${id}`);
    for(const attr of result.svg.matchAll(/\s(?:x|cx|y|cy|r|width|height)="([^"]+)"/g)) assert.ok(Number.isFinite(Number(attr[1])));
    renders++;
  }
}
const render=(id,s)=>models[id].draw(helpers(736),{...defaults(models[id]),...s});
// Independent checks of mechanisms that can otherwise render plausible but wrong results.
assert.match(render(13,{measurement:35,noise:8}).readout,/42\.5%.*50%/);
assert.match(render(13,{measurement:35,noise:1}).readout,/35\.2%.*98%/);
assert.match(render(1,{reachable:2}).readout,/need 3/);
assert.match(render(1,{reachable:3}).readout,/majority committed/);
assert.match(render(4,{stride:'1',offset:'0'}).readout,/128 useful bytes \/ 128 transferred/);
assert.match(render(4,{stride:'8',offset:'0'}).readout,/128 useful bytes \/ 1024 transferred/);
assert.match(render(6,{error:'z1'}).readout,/undetected phase error/);
for(let a=0;a<3;a++)for(let b=0;b<5;b++){
  const out=render(17,{r3:a,r5:b});const n=Number(out.readout.match(/x = (\d+)/)[1]);assert.equal(n%3,a);assert.equal(n%5,b);
}
for(const bridge of [0,.3,1,3]){
  const lambda=Number(render(8,{bridge}).readout.match(/λ₂ = ([\d.]+)/)[1]);assert.ok(Math.abs(lambda-(1+bridge-Math.sqrt(1+bridge*bridge)))<.001);
}
assert.match(render(33,{votes:5,faults:2}).readout,/only A reaches quorum/);
assert.match(render(33,{votes:5,faults:3}).readout,/conflicting certificates possible/);
assert.match(render(38,{pressure:50,wall:8}).readout,/93\.8 MPa.*46\.9 MPa/);
assert.match(render(39,{speed:1.5}).readout,/15\.0 bar/);
assert.match(render(41,{velocity:0}).readout,/Δt 0\.000 μs/);
assert.match(render(36,{term:'wrong',step:3}).readout,/Type mismatch/);
assert.match(render(36,{term:'missing',step:3}).readout,/Missing proof/);
const heat0=Number(render(46,{fouling:0}).readout.match(/duty = ([\d.]+)/)[1]);
const heat1=Number(render(46,{fouling:1}).readout.match(/duty = ([\d.]+)/)[1]);
assert.ok(heat1<heat0);
// Independent equations and limiting cases for the added 22 mechanisms.
assert.match(render(47,{current:100,voltage:2}).readout,/0\.0038 kg\/h.*200 W/);
assert.match(render(48,{conversion:20,passes:2}).readout,/36\.0%.*64\.0%/);
assert.match(render(49,{sun:1000,temperature:25}).readout,/440 W/);
assert.match(render(50,{alpha:1,contacts:8}).readout,/0\.200/);
assert.match(render(54,{flow:60,route:'both'}).readout,/1\.70 m\/s/);
assert.match(render(54,{flow:60,route:'one'}).readout,/3\.40 m\/s/);
assert.match(render(56,{slug:10,time:10}).readout,/Stored liquid 0 m³/);
assert.match(render(57,{diameter:40,time:0}).readout,/travel 0\.0 mm/);
assert.match(render(58,{contacts:2,fraction:50}).readout,/25\.0%/);
assert.match(render(62,{velocity:5,radius:50}).readout,/500 m\/s²/);
assert.match(render(63,{volume:4,demand:3}).readout,/12\.0 m³.*4\.0 min/);
assert.match(render(64,{contacts:0,equilibrium:.5}).readout,/8\.00 mg\/L/);
assert.match(render(65,{blocked:50,flow:1.5}).readout,/0\.300 m\/s/);
assert.match(render(66,{fuel:600,burn:40}).readout,/510 L.*12\.8 h/);
assert.match(render(67,{time:5,rate:.2}).readout,/150 mg\/L/);
assert.match(render(68,{cold:150,ambient:300}).readout,/COP 1\.000.*100\.0 kW/);
const mechanismInventory=episodes.filter(e=>e.episode_number>=47).map(e=>{
  const model=models[e.episode_number],scene=ctx.window.DeepEndMachines.inspect(model.kind,736,{...defaults(model),...model.draw(helpers(736),defaults(model)).pose});
  return {episode:e.episode_number,kind:model.kind,solids:scene.parts,svgBytes:scene.svg.length};
});
assert.equal(new Set(mechanismInventory.map(e=>e.kind)).size,22);
fs.writeFileSync(path.join(dir,'mechanism-inventory.json'),JSON.stringify(mechanismInventory,null,2)+'\n');
const routesPath=path.join(root,'.next/prerender-manifest.json');
if(fs.existsSync(routesPath)){
  const routes=JSON.parse(fs.readFileSync(routesPath,'utf8')).routes;
  for(const e of episodes) assert.ok(routes['/the-deep-end/'+e.slug],`Missing prerendered episode ${e.episode_number}`);
}
fs.mkdirSync(path.join(root,'docs/podcast'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/podcast/model-verification.json'),JSON.stringify({episodes:68,modelControlWidthRenders:renders,independentChecks:'PASS',prerenderedRoutes:fs.existsSync(routesPath)?'PASS':'NOT_BUILT',browserChecks:'SEPARATE',geometryAudit:'SEPARATE',mechanismInventory},null,2)+'\n');
console.log(`Verified 68 standalone pages, ${renders} model/control/width renders, independent mechanism checks, and all available prerendered routes.`);
