import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as K from './anatomy-audit/iso-kit.mjs';
import * as A from './anatomy-audit/audit.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dir=path.join(root,'public/episode-visuals');
const window={Anatomy:K,DeepEndModels:{}};
for(const name of ['anatomy-mechanisms.js','facility-models.js'])vm.runInNewContext(fs.readFileSync(path.join(dir,name),'utf8'),{window});
const focused=Number(process.argv.find(a=>a.startsWith('--episode='))?.split('=')[1]);
const evidencePath=path.join(root,'docs/podcast/apparatus-verification.json');
const prior=focused&&fs.existsSync(evidencePath)?JSON.parse(fs.readFileSync(evidencePath,'utf8')).results.filter(e=>e.episode!==focused):[];
const results=[...prior],orders=focused?JSON.parse(fs.readFileSync(path.join(dir,'apparatus-depth-order.js'),'utf8').replace(/^window.DeepEndDepthOrder=/,'').replace(/;\s*$/,'')):{};
for(const id of focused?[focused]:Array.from({length:22},(_,i)=>47+i)){
 const m=window.DeepEndModels[id];const state=Object.fromEntries(m.controls.map(c=>[c.key,c.value]));
 const variants=m.kind==='turret'?Array.from({length:23},(_,i)=>({heading:i*15})):m.kind==='handover'?Array.from({length:6},(_,i)=>({checked:i})):m.kind==='flare'?Array.from({length:3},(_,i)=>({trains:i+1})): [{}];
 orders[m.kind]={};
 for(const variant of variants){
 const current={...state,...variant};
 const key=m.kind==='turret'?String(current.heading):m.kind==='handover'?String(current.checked):m.kind==='flare'?String(current.trains):'default';
 const result=m.draw({W:736},current);const s=window.DeepEndMachines.inspect(m.kind,736,{...current,...result.pose});const R=A.recorder(s.P);
 for(const item of s.items){
  const q=item.shape;if(!q||q.fluid)continue;
  const ground=q.type==='cylinder'&&q.z===-12;const meta={name:item.name,ground};
  const solid=q.type==='slab'?A.slab(q.plan,q.z,q.h,meta,4):q.type==='cylinder'?A.cylinder(q.x,q.y,q.r,q.z,q.h,meta):A.extruded(q.pts,q.z,q.h,meta);
  R.put({name:item.name,at:item.at,key:item.key,svg:item.svg,shapes:[R.solid(solid)]});
 }
 const support=A.supports(R.solids,R.tubes);
 const full=process.argv.includes('--full');
 const audit=full?A.audit(R,s.P):null;
 const failures=audit?A.failures(audit):support.loose.length+support.hanging.length+support.sunk.length;
 if(full)orders[m.kind][key]=Object.fromEntries(R.items.map(i=>[i.name,i.key]));
 results.push({episode:id,kind:m.kind,variant:key,state:current,scope:full?'FULL_RIGID_APPARATUS_REST_POSE':'RIGID_SUPPORT_AND_INTERSECTION_REST_POSE',failures,excluded:'Fluid inventory layers and non-material dots/engraved markings are not rigid bodies.',support,audit});
 console.log(id,m.kind,key,failures?'FAIL':'PASS',failures);
 if(failures)process.exitCode=1;
 }
 if(process.argv.includes('--prototype'))break;
}
fs.mkdirSync(path.join(root,'docs/podcast'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/podcast/apparatus-verification.json'),JSON.stringify({scope:'Rigid apparatus: all turret headings, handover pin states and flare source counts; other geometry is invariant under controls. Fluid overlays and line-end/browser checks are separate.',results},null,2)+'\n');
if(process.argv.includes('--full')&&!process.exitCode)fs.writeFileSync(path.join(dir,'apparatus-depth-order.js'),'window.DeepEndDepthOrder='+JSON.stringify(orders)+';\n');
