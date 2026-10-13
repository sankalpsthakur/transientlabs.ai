import * as K from './kit/iso-kit.mjs';
import {DEFAULT,sample} from './model.mjs';
export const WIDTH=736,HEIGHT=430,PLATE={x:-172,y:-110,w:344,d:228,r:8};
export const P=K.fitProjection(K.boxCorners(PLATE,-6,50),WIDTH,HEIGHT,{pad:24,azimuth:40,elevation:48});
const at=q=>K.iso(q,P),L=(d,t='lo',free)=>K.lineSvg(d,{tone:t,free}),D=(q,t='mid',size=.5)=>K.dotsSvg(q.map(at),{tone:t,size});
export const planePoint=(x,y)=>at([-86+63*x,-18-63*y,16.1]);
export const directionPoint=m=>at([94+39*m.directionX,-24-39*m.directionY,21.1]);
export function planeMarkup(m){const o=planePoint(0,0),q=planePoint(m.x,m.y),from=planePoint(-m.u,-m.v),to=planePoint(m.u,m.v);return `<path d="${K.pathOf([from,to])}" class="direction-guide"/><circle cx="${o[0]}" cy="${o[1]}" r="2.8" class="origin-mark"/><circle id="base-marker" cx="${q[0]}" cy="${q[1]}" r="4" class="selected-point"/>`;}
export function directionMarkup(m){const q=directionPoint(m);return `<circle id="direction-marker" cx="${q[0]}" cy="${q[1]}" r="4.2" class="selected-point"/><path d="${K.pathOf([at([94,-24,21.1]),q])}" class="direction-guide"/>`;}
const meters={radius:-103,angle:-36},knobs={radius:64,angle:122};
export function needle(key,f){const x=meters[key],a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([x,85],[x+16*Math.sin(a),85-16*Math.cos(a)],20.1,P),'hi','end')+D([[x,85,20.1]],'hi',1);}
export function pointer(key,f){const x=knobs[key],a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([x,85],[x+8*Math.sin(a),85-8*Math.cos(a)],24,P),'mid','end')+D([[x,85,24]],'mid',.7);}
function part(name,q,tone='mid',inner=''){const paths=q.type==='slab'?K.slabOf(q.plan,q.z,q.h,P,8):K.cylinder(q.x,q.y,q.r,q.z,q.h,P,64),centre=q.type==='slab'?[q.plan.x+q.plan.w/2,q.plan.y+q.plan.d/2,q.z+q.h/2]:[q.x,q.y,q.z+q.h/2];return{name,shape:q,at:centre,svg:K.solidSvg(paths,{tone,crease:'faint',inner})};}
export function scene(state=DEFAULT){
  const items=[],m=sample(state),slab=(n,p,z,h,t='mid',i='')=>items.push(part(n,{type:'slab',plan:p,z,h},t,i)),cyl=(n,x,y,r,z,h,t='mid',i='',ground=false)=>items.push(part(n,{type:'cylinder',x,y,r,z,h,ground},t,i));
  for(const[i,[x,y]]of K.corners(PLATE,18).entries()){cyl('foot-pad-'+i,x,y,7,-6,2,'lo','',true);cyl('foot-post-'+i,x,y,5,-4,4);}
  slab('bench',PLATE,0,8,'mid',L(K.planOutline(K.insetPlan(PLATE,5),8,P),'faint'));
  for(const[i,[x,y]]of K.corners(PLATE,9).entries())cyl('bench-screw-'+i,x,y,2,8,.9,'mid',L(K.lineOnTop([x-2,y],[x+2,y],8.9,P),'lo'));
  for(const[i,x]of[-157,-28].entries())slab('window-support-'+i,{x,y:-86,w:13,d:136,r:1},8,6);
  const win={x:-155,y:-87,w:138,d:138,r:1},bed={x:-158,y:-90,w:144,d:144,r:2};
  let grid='';for(let i=-4;i<=4;i++){const v=i/4;grid+=`<path d="${K.pathOf([planePoint(-1,v),planePoint(1,v)])}" class="position-grid"/><path d="${K.pathOf([planePoint(v,-1),planePoint(v,1)])}" class="position-grid"/>`;}
  slab('position-bed',bed,14,2,'lo',`<defs><clipPath id="position-window"><path d="${K.planOutline(win,16.1,P)}"/></clipPath></defs><path d="${K.planOutline(win,16.1,P)}" class="wave-ground"/><g clip-path="url(#position-window)">${grid}<g id="plane-points">${planeMarkup(m)}</g></g>`);
  for(const[i,y]of[-90,52].entries())slab('window-rim-long-'+i,{x:-158,y,w:144,d:2,r:.5},16,2,'mid',L(K.planOutline({x:-157,y:y+.5,w:142,d:1,r:.2},18,P),'faint'));
  for(const[i,x]of[-158,-16].entries())slab('window-rim-end-'+i,{x,y:-88,w:2,d:140,r:.5},16,2);
  for(const[i,[x,y]]of[-148,-122,-96,-70,-44,-24].flatMap(x=>[[x,-89],[x,53]]).entries())cyl('window-screw-'+i,x,y,.9,18,.5,'mid',L(K.lineOnTop([x-.9,y],[x+.9,y],18.5,P),'lo'));
  cyl('direction-flange',94,-24,62,8,2,'lo');
  cyl('direction-body',94,-24,56,10,7,'mid',L(K.knurl(94,-24,56,10,17,96,P,0),'faint'));
  const ticks=K.radialTicks(94,-24,49,72,6,21,[2,4],P);
  cyl('direction-face',94,-24,51,17,4,'mid',L(K.ring(94,-24,49,21,P),'lo')+L(ticks.minor,'lo')+L(ticks.major,'mid')+L(K.ring(94,-24,39,21,P),'faint')+`<g id="projective-direction">${directionMarkup(m)}</g>`);
  cyl('direction-hub',94,-24,1.3,21,.5);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=94+59*Math.cos(a),y=-24+59*Math.sin(a);cyl('direction-screw-'+i,x,y,1.3,10,.5,'mid',L(K.lineOnTop([x-1.3,y],[x+1.3,y],10.5,P),'lo'));}
  for(const[i,x]of[-137,-28].entries()){cyl('roller-seat-'+i,x,-101,5.5,8,1.5,'lo');cyl('roller-body-'+i,x,-101,4,9.5,9,'mid',L(K.knurl(x,-101,4,9.5,18.5,32,P,0),'faint'));cyl('roller-cap-'+i,x,-101,4.5,18.5,1);}
  for(const[key,x]of Object.entries(meters)){cyl(key+'-flange',x,85,27,8,2,'lo');cyl(key+'-body',x,85,24,10,7,'mid',L(K.knurl(x,85,24,10,17,64,P,0),'faint'));const t=K.radialTicks(x,85,16,21,5,20,[1.7,3.4],P,-.75*Math.PI,1.5*Math.PI);cyl(key+'-face',x,85,21,17,3,'mid',L(K.ring(x,85,16,20,P),'lo')+L(t.minor,'lo')+L(t.major,'mid')+`<g id="needle-${key}">${needle(key,m[key+'Fraction'])}</g>`);cyl(key+'-spindle',x,85,1.3,20,.5);for(const[i,dx]of[-25,25].entries())cyl(key+'-screw-'+i,x+dx,85,1.3,10,.5,'mid',L(K.lineOnTop([x+dx-1.3,85],[x+dx+1.3,85],10.5,P),'lo'));}
  for(const[key,x]of Object.entries(knobs)){cyl(key+'-seat',x,85,14,8,2,'lo');cyl(key+'-shaft',x,85,3.3,10,3);cyl(key+'-grip',x,85,11,13,11,'mid',L(K.knurl(x,85,11,13,24,56,P,0),'lo')+`<g id="pointer-${key}">${pointer(key,m[key+'Fraction'])}</g>`);}
  const tag={x:17,y:104,w:42,d:7,r:.7};slab('nameplate',tag,8,.7,'lo',L(K.planOutline(K.insetPlan(tag,.8),8.7,P),'faint')+K.faceTextSvg(K.topMatrix([38,107.5],8.7,P),'B / 80',{size:3,tone:'mid'}));for(const[i,x]of[21,55].entries())cyl('nameplate-screw-'+i,x,107.5,.8,8.7,.4);
  return{items,m};
}
export function figureMarkup(items,order){return K.figureSvg({width:WIDTH,height:HEIGHT,label:'A blow-up direction resolver: a square position window, a circular projective-direction register, signed radial and half-turn angle dials, and two knurled controls. The point contracts to the origin while its real projective line remains recorded. The circle is a schematic for real directions, not the complex exceptional surface.',body:[...items].sort((a,b)=>order[a.name]-order[b.name]).map(i=>`<g id="${i.name}" data-part="${i.name}">${i.svg}</g>`).join('')});}
