import * as K from './kit/iso-kit.mjs';
import {DEFAULT,sample} from './model.mjs';
export const WIDTH=736,HEIGHT=420;
export const PLATE={x:-150,y:-78,w:300,d:158,r:8};
export const P=K.fitProjection(K.boxCorners(PLATE,-6,42),WIDTH,HEIGHT,{pad:28,azimuth:42,elevation:36});
const at=q=>K.iso(q,P),L=(d,tone='lo',free)=>K.lineSvg(d,{tone,free});
const D=(qs,tone='mid',size=.5)=>K.dotsSvg(qs.map(at),{tone,size});
const centres={norm:-78,velocity:-10};
export function needle(key,fraction){const x=centres[key],a=(-.75+1.5*fraction)*Math.PI;const path=K.lineOnTop([x,42],[x+13*Math.sin(a),42-13*Math.cos(a)],17.1,P);return L(path,key==='norm'?'hi':'mid','end')+D([[x,42,17.1]],'hi',1);}
export function knobPointer(f){const a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([94,45],[94+9*Math.sin(a),45-9*Math.cos(a)],23,P),'mid','end')+D([[94,45,23]],'mid',.7);}
function part(name,shape,tone='mid',details='',moving=false){const centre=shape.type==='slab'?[shape.plan.x+shape.plan.w/2,shape.plan.y+shape.plan.d/2,shape.z+shape.h/2]:[shape.x,shape.y,shape.z+shape.h/2];const paths=shape.type==='slab'?K.slabOf(shape.plan,shape.z,shape.h,P,8):K.cylinder(shape.x,shape.y,shape.r,shape.z,shape.h,P,64);return{name,shape,at:centre,moving,svg:K.solidSvg(paths,{tone,crease:'faint',inner:details})};}
export function scene(state=DEFAULT){const items=[],m=sample(state);const slab=(name,plan,z,h,tone='mid',details='',moving=false)=>items.push(part(name,{type:'slab',plan,z,h},tone,details,moving));const cyl=(name,x,y,r,z,h,tone='mid',details='',ground=false,moving=false)=>items.push(part(name,{type:'cylinder',x,y,r,z,h,ground},tone,details,moving));
 for(const[i,[x,y]]of K.corners(PLATE,18).entries()){cyl('foot-pad-'+i,x,y,7,-6,2,'lo','',true);cyl('foot-post-'+i,x,y,5,-4,4);}
 slab('bench',PLATE,0,8,'mid',L(K.planOutline(K.insetPlan(PLATE,5),8,P),'faint'));
 for(const[i,[x,y]]of K.corners(PLATE,9).entries())cyl('bench-screw-'+i,x,y,2,8,.9,'mid',L(K.lineOnTop([x-2,y],[x+2,y],8.9,P),'lo'));
 for(const[i,y]of [-46,-10].entries())slab('guide-rail-'+i,{x:-124,y,w:248,d:8,r:1},8,5,'mid',L(K.planOutline({x:-122,y:y+1,w:244,d:6,r:.5},13,P),'faint'));
 for(const[i,x]of [-130,124].entries()){slab('end-stop-'+i,{x,y:-49,w:6,d:50,r:1},8,7);for(const[j,y]of [-42,-6].entries())cyl('stop-screw-'+i+'-'+j,x+3,y,1.2,15,.5,'mid',L(K.lineOnTop([x+1.8,y],[x+4.2,y],15.5,P),'lo'));}
 const ruler={x:-118,y:-63,w:240,d:7,r:.7};const ticks=K.topTicks(-114,118,4,5,-62.3,8.7,[2,4.3],P);slab('ruler-strip',ruler,8,.7,'lo',L(K.planOutline(K.insetPlan(ruler,.7),8.7,P),'faint')+L(ticks.minor,'lo')+L(ticks.major,'mid'));
 for(const[key,x,moving]of [['fixed',-114,false],['sliding',-104+m.gap,true]]){
  for(const[i,y]of [-46,-10].entries())slab(key+'-bearing-'+i,{x,y,w:10,d:8,r:.6},13,2,'mid','',moving);
  const body={x,y:-46,w:10,d:44,r:.6};slab(key+'-jaw',body,15,22,'mid',L(K.planOutline(K.insetPlan(body,1.5),37,P),'faint')+L(K.sideSeam(body,24,P,8),'lo'),moving);
  for(const[i,y]of [-41,-7].entries())cyl(key+'-jaw-screw-'+i,x+5,y,1.1,37,.5,'mid',L(K.lineOnTop([x+3.9,y],[x+6.1,y],37.5,P),'lo'),false,moving);
 }
 for(const[key,x]of Object.entries(centres)){
  cyl(key+'-meter-flange',x,42,26,8,1,'lo');cyl(key+'-meter-body',x,42,22,9,6,'mid',L(K.knurl(x,42,22,9,15,64,P,0),'faint'));
  const ticks=K.radialTicks(x,42,16,20,5,17,[1.6,3.3],P,-.75*Math.PI,1.5*Math.PI);cyl(key+'-meter-face',x,42,19,15,2,'mid',L(K.ring(x,42,16,17,P),'lo')+L(ticks.minor,'lo')+L(ticks.major,'mid')+`<g id="needle-${key}">${needle(key,key==='norm'?m.normFraction:m.velocityFraction)}</g>`);cyl(key+'-meter-spindle',x,42,1.3,17,.5);
  for(const[i,dx]of [-24,24].entries())cyl(key+'-meter-screw-'+i,x+dx,42,1.4,9,.5,'mid',L(K.lineOnTop([x+dx-1.4,42],[x+dx+1.4,42],9.5,P),'lo'));
 }
 cyl('zoom-knob-seat',94,45,14,8,2,'lo');cyl('zoom-knob-shaft',94,45,3.3,10,3);cyl('zoom-knob-grip',94,45,11,13,10,'mid',L(K.knurl(94,45,11,13,23,56,P,0),'lo')+`<g id="knob-pointer">${knobPointer(m.zoomFraction)}</g>`);
 for(const[i,x]of [46,64,82].entries()){slab('preset-base-'+i,{x,y:12,w:12,d:10,r:1},8,1.5,'lo');slab('preset-cap-'+i,{x:x+1,y:13,w:10,d:8,r:.7},9.5,2,'mid',L(K.planOutline({x:x+2,y:14,w:8,d:6,r:.4},11.5,P),'faint'));}
 for(const[i,x]of [46,64].entries()){slab('dimension-base-'+i,{x,y:43,w:13,d:11,r:1},8,1.5,'lo');slab('dimension-cap-'+i,{x:x+1,y:44,w:11,d:9,r:.7},9.5,2,'mid',L(K.planOutline({x:x+2,y:45,w:9,d:7,r:.4},11.5,P),'faint'));}
 for(const[i,x]of [45,60,75].entries()){cyl('indicator-seat-'+i,x,66,2.5,8,1,'lo');cyl('indicator-lens-'+i,x,66,1.8,9,1.2);}
 const badge={x:-112,y:72,w:223,d:5,r:.6};slab('id-plate',badge,8,.7,'lo',L(K.planOutline(K.insetPlan(badge,.7),8.7,P),'faint')+K.faceTextSvg(K.topMatrix([0,75.5],8.7,P),'SC / 71',{size:2.7,tone:'mid'}));for(const[i,x]of [-108,107].entries())cyl('id-screw-'+i,x,74.5,.8,8.7,.3);
 return{items,m,P};}
export function groupMarkup(items,order){return [...items].sort((a,b)=>order[a.name]-order[b.name]).map(i=>`<g id="${i.name}" data-part="${i.name}"${i.moving?' data-moving="true"':''}>${i.svg}</g>`).join('');}
export const figureMarkup=(items,order)=>K.figureSvg({width:WIDTH,height:HEIGHT,label:'A precision caliper and two calibrated gauges. Zoom shrinks the real jaw gap while velocity grows; the selected norm follows its exact scaling power.',body:groupMarkup(items,order)});
export const slideTransform=lambda=>K.translateAlong(P,[48/lambda-48,0,0]);
