import * as K from './kit/iso-kit.mjs';
import{DEFAULT,sample}from'./model.mjs';
export const WIDTH=736,HEIGHT=420,PLATE={x:-164,y:-72,w:328,d:156,r:8};
export const P=K.fitProjection(K.boxCorners(PLATE,-6,43),WIDTH,HEIGHT,{pad:25,azimuth:35,elevation:43});
const at=q=>K.iso(q,P),L=(d,tone='lo',free)=>K.lineSvg(d,{tone,free}),D=(ps,tone='mid',size=.5)=>K.dotsSvg(ps.map(at),{tone,size});
const meters={pressure:-92,flow:-30},knobs={pressure:67,viscosity:116};
export function needle(key,f){const x=meters[key],a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([x,46],[x+13*Math.sin(a),46-13*Math.cos(a)],17.1,P),key==='flow'?'hi':'mid','end')+D([[x,46,17.1]],'hi',1);}
export function pointer(key,f){const x=knobs[key],a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([x,48],[x+9*Math.sin(a),48-9*Math.cos(a)],24,P),'mid','end')+D([[x,48,24]],'mid',.7);}
const windowPlan={x:-115,y:-28,w:230,d:28,r:0};
const along=(x,y)=>at([-115+230*x,-28+28*y,15.05]);
export function tracerMarkup(m){let body='';for(const lane of m.lanes){const selected=Math.abs(lane.y-m.position)<.00001;const q=along(lane.x,lane.y);body+=`<circle cx="${q[0]}" cy="${q[1]}" r="${selected?2.1:1.5}" class="dye ${selected?'selected':''}"/>`;}
 const pts=Array.from({length:81},(_,i)=>{const y=i/80,x=m.max*(1-(2*y-1)**2)*m.time/.4;return along(x,y);});body+=`<path d="${K.pathOf(pts)}" class="dye-front"/>`;const q=along(m.front,m.position);body+=`<circle cx="${q[0]}" cy="${q[1]}" r="2.7" class="dye selected"/>`;return `<g clip-path="url(#flow-window)">${body}</g>`;}
function part(name,shape,tone='mid',inner=''){const q=shape,paths=q.type==='slab'?K.slabOf(q.plan,q.z,q.h,P,8):K.cylinder(q.x,q.y,q.r,q.z,q.h,P,64),centre=q.type==='slab'?[q.plan.x+q.plan.w/2,q.plan.y+q.plan.d/2,q.z+q.h/2]:[q.x,q.y,q.z+q.h/2];return{name,shape,at:centre,svg:K.solidSvg(paths,{tone,crease:'faint',inner})};}
export function scene(state=DEFAULT){const items=[],m=sample(state),slab=(name,plan,z,h,tone='mid',inner='')=>items.push(part(name,{type:'slab',plan,z,h},tone,inner)),cyl=(name,x,y,r,z,h,tone='mid',inner='',ground=false)=>items.push(part(name,{type:'cylinder',x,y,r,z,h,ground},tone,inner));
 for(const[i,[x,y]]of K.corners(PLATE,18).entries()){cyl('foot-pad-'+i,x,y,7,-6,2,'lo','',true);cyl('foot-post-'+i,x,y,5,-4,4);}
 slab('bench',PLATE,0,8,'mid',L(K.planOutline(K.insetPlan(PLATE,5),8,P),'faint'));
 for(const[i,[x,y]]of K.corners(PLATE,9).entries())cyl('bench-screw-'+i,x,y,2,8,.9,'mid',L(K.lineOnTop([x-2,y],[x+2,y],8.9,P),'lo'));
 for(const[i,x]of[-105,95].entries()){slab('cell-seat-'+i,{x,y:-37,w:10,d:42,r:1},8,6);for(const[j,y]of[-34,4].entries())cyl('seat-bolt-'+i+'-'+j,x+5,y,1.1,14,.8,'mid',L(K.lineOnTop([x+3.9,y],[x+6.1,y],14.8,P),'lo'));}
 const floor={x:-118,y:-30,w:236,d:30,r:.7};slab('observation-floor',floor,14,1,'lo',`<defs><clipPath id="flow-window"><path d="${K.planOutline(windowPlan,15.05,P)}"/></clipPath></defs><path d="${K.planOutline(windowPlan,15.05,P)}" class="flow-slice"/><g id="tracers">${tracerMarkup(m)}</g>`);
 for(const[i,y]of[-32,0].entries())slab('stationary-wall-'+i,{x:-118,y,w:236,d:2,r:.5},14,1,'mid',L(K.planOutline({x:-117,y:y+.5,w:234,d:1,r:.3},15,P),'lo'));
 for(const[i,x]of[-128,118].entries())slab('end-block-'+i,{x,y:-32,w:10,d:34,r:1},14,19,'mid',L(K.sideSeam({x,y:-32,w:10,d:34,r:1},24,P,8),'lo'));
 for(const[i,x]of[-105,95].entries()){slab('clamp-bar-'+i,{x,y:-34,w:10,d:38,r:.7},15,3,'mid',L(K.planOutline({x:x+1,y:-33,w:8,d:36,r:.5},18,P),'lo'));for(const[j,[dx,y]]of[[2.5,-31],[7.5,-31],[2.5,1],[7.5,1]].entries())cyl('clamp-screw-'+i+'-'+j,x+dx,y,1.1,18,.8,'mid',L(K.lineOnTop([x+dx-1.1,y],[x+dx+1.1,y],18.8,P),'lo'));}
 for(const[i,x]of[-144,137].entries()){slab('port-pedestal-'+i,{x:x-7,y:-26,w:14,d:20,r:1},8,13);cyl('port-flange-'+i,x,-16,6.5,21,2);cyl('port-plug-'+i,x,-16,4.5,23,5,'mid',L(K.knurl(x,-16,4.5,23,28,16,P,0),'lo'));}
 for(const[key,x]of Object.entries(meters)){cyl(key+'-flange',x,46,25,8,1,'lo');cyl(key+'-body',x,46,21,9,6,'mid',L(K.knurl(x,46,21,9,15,56,P,0),'faint'));const t=K.radialTicks(x,46,15,19,5,17,[1.6,3.2],P,-.75*Math.PI,1.5*Math.PI);cyl(key+'-face',x,46,18,15,2,'mid',L(K.ring(x,46,15,17,P),'lo')+L(t.minor,'lo')+L(t.major,'mid')+`<g id="needle-${key}">${needle(key,key==='flow'?m.flowFraction:m.pressureFraction)}</g>`);cyl(key+'-spindle',x,46,1.3,17,.5);for(const[i,dx]of[-23,23].entries())cyl(key+'-screw-'+i,x+dx,46,1.3,9,.5,'mid',L(K.lineOnTop([x+dx-1.3,46],[x+dx+1.3,46],9.5,P),'lo'));}
 for(const[key,x]of Object.entries(knobs)){cyl(key+'-knob-seat',x,48,14,8,2,'lo');cyl(key+'-knob-shaft',x,48,3.3,10,3);cyl(key+'-knob-grip',x,48,11,13,11,'mid',L(K.knurl(x,48,11,13,24,56,P,0),'lo')+`<g id="pointer-${key}">${pointer(key,key==='pressure'?m.pressureFraction:m.viscosityFraction)}</g>`);}
 const strip={x:-112,y:-55,w:224,d:6,r:.7},t=K.topTicks(-108,108,4,5,-54.3,8.7,[2,4],P);slab('observation-ruler',strip,8,.7,'lo',L(K.planOutline(K.insetPlan(strip,.7),8.7,P),'faint')+L(t.minor,'lo')+L(t.major,'mid'));for(const[i,x]of[-109,109].entries())cyl('ruler-screw-'+i,x,-52,1,8.7,.4);
 const tag={x:6,y:73,w:125,d:5,r:.6};slab('id-plate',tag,8,.7,'lo',L(K.planOutline(K.insetPlan(tag,.7),8.7,P),'faint')+K.faceTextSvg(K.topMatrix([68,76],8.7,P),'PF / 72',{size:2.7,tone:'mid'}));for(const[i,x]of[10,127].entries())cyl('id-screw-'+i,x,75.5,.8,8.7,.3);
 return{items,m};}
export function figureMarkup(items,order){return K.figureSvg({width:WIDTH,height:HEIGHT,label:'A cutaway pressure-driven flow cell. A dye pulse travels fastest midway between the stationary walls. Two dials show pressure gradient and mean speed; knobs set pressure and viscosity.',body:[...items].sort((a,b)=>order[a.name]-order[b.name]).map(i=>`<g id="${i.name}" data-part="${i.name}">${i.svg}</g>`).join('')});}
