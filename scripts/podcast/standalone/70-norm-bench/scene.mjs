import * as K from './kit/iso-kit.mjs';
import {DEFAULT,sample,PRESETS} from './model.mjs';
export const WIDTH=736,HEIGHT=410;
export const PLATE={x:-150,y:-72,w:300,d:156,r:8};
export const P=K.fitProjection(K.boxCorners(PLATE,-6,36),WIDTH,HEIGHT,{pad:30,azimuth:42,elevation:36});
const at=q=>K.iso(q,P),L=(d,tone='lo',free)=>K.lineSvg(d,{tone,free});
const D=(qs,tone='mid',size=.5)=>K.dotsSvg(qs.map(at),{tone,size});
const meterX={1:-94,2:-42,inf:10};
export function needle(key,fraction){const x=meterX[key],a=(-.75+1.5*fraction)*Math.PI;return L(K.lineOnTop([x,61],[x+10*Math.sin(a),61-10*Math.cos(a)],15.1,P),'hi','end')+D([[x,61,15.1]],'hi',1);}
export function knobPointer(f){const a=(-.75+1.5*f)*Math.PI;return L(K.lineOnTop([106,61],[106+8*Math.sin(a),61-8*Math.cos(a)],22,P),'mid','end')+D([[106,61,22]],'mid',.8);}
const SCREEN={x:-112,y:-48,w:205,d:57,r:1};
const plot={x:-102,y:-39,w:183,d:36,z:31.05};
export function trace(n){const m=sample({n});const y=plot.y+plot.d,h=plot.d*m.height/8,w=plot.w*m.width;return K.onTop([[plot.x,y],[plot.x,y-h],[plot.x+w,y-h],[plot.x+w,y],[plot.x+plot.w,y]],plot.z,P);}
function part(name,shape,tone='mid',details='',lit=false){const centre=shape.type==='slab'?[shape.plan.x+shape.plan.w/2,shape.plan.y+shape.plan.d/2,shape.z+shape.h/2]:[shape.x,shape.y,shape.z+shape.h/2];const paths=shape.type==='slab'?K.slabOf(shape.plan,shape.z,shape.h,P,8):K.cylinder(shape.x,shape.y,shape.r,shape.z,shape.h,P,64);return{name,shape,at:centre,svg:K.solidSvg(paths,{tone,crease:'faint',lit,inner:details})};}
export function scene(state=DEFAULT){const items=[],m=sample(state);const slab=(name,plan,z,h,tone='mid',details='')=>items.push(part(name,{type:'slab',plan,z,h},tone,details));const cyl=(name,x,y,r,z,h,tone='mid',details='',ground=false)=>items.push(part(name,{type:'cylinder',x,y,r,z,h,ground},tone,details));
 for(const [i,[x,y]] of K.corners(PLATE,18).entries()){cyl('foot-pad-'+i,x,y,7,-6,2,'lo','',true);cyl('foot-post-'+i,x,y,5,-4,4);}
 slab('bench',PLATE,0,8,'mid',L(K.planOutline(K.insetPlan(PLATE,5),8,P),'faint'));
 for(const[i,[x,y]]of K.corners(PLATE,9).entries())cyl('bench-screw-'+i,x,y,2,8,.9,'mid',L(K.lineOnTop([x-2,y],[x+2,y],8.9,P),'lo'));
 const chassis={x:-121,y:-60,w:230,d:98,r:3};const panelPts=[[-108,38.05,12],[96,38.05,12],[96,38.05,26],[-108,38.05,26]].map(at);const panel='M '+panelPts.map(q=>q.join(' ')).join(' L ')+' Z';slab('scope-chassis',chassis,8,22,'mid',L(K.planOutline(K.insetPlan(chassis,1.6),30,P),'lo')+L(panel,'faint'));
 for(let j=0;j<10;j++){const x=-108+j*21;slab('cooling-fin-'+j,{x,y:-58,w:10,d:4,r:.5},30,5,'mid',L(K.lineOnTop([x+1,-56],[x+9,-56],35,P),'lo',true)+D([[x+1,-56,35],[x+9,-56,35]],'lo',.35));}
 const bezel=[{x:-116,y:-52,w:4,d:65,r:.6},{x:93,y:-52,w:4,d:65,r:.6},{x:-112,y:-52,w:205,d:4,r:.6},{x:-112,y:9,w:205,d:4,r:.6}];bezel.forEach((q,i)=>slab('bezel-'+i,q,30,3,'mid'));
 const border=K.planOutline({x:plot.x,y:plot.y,w:plot.w,d:plot.d,r:0},31.05,P);const grid=[1,2,3].map(j=>L(K.lineOnTop([plot.x,plot.y+plot.d*j/4],[plot.x+plot.w,plot.y+plot.d*j/4],31.05,P),'faint')).join('')+[1,2,3,4,5,6,7].map(j=>L(K.lineOnTop([plot.x+plot.w*j/8,plot.y],[plot.x+plot.w*j/8,plot.y+plot.d],31.05,P),'faint')).join('');
 slab('screen-glass',SCREEN,30,1,'lo',L(border,'faint')+grid+`<path id="signal-trace" class="iso-line" data-tone="hi" d="${trace(state.n)}"/>`+D([[plot.x,plot.y+plot.d,31.05],[plot.x+plot.w,plot.y+plot.d,31.05]],'hi',.6));
 for(const[i,[x,y]]of [[-114,-45],[95,-45],[-114,6],[95,6]].entries())cyl('bezel-screw-'+i,x,y,1.1,33,.5,'mid',L(K.lineOnTop([x-1.1,y],[x+1.1,y],33.5,P),'lo'));
 const badge={x:-110,y:20,w:205,d:8,r:.7};slab('service-badge',badge,30,.7,'lo',L(K.planOutline(K.insetPlan(badge,1),30.7,P),'faint')+K.faceTextSvg(K.topMatrix([-17,25.5],30.7,P),'LP / 70',{size:3,tone:'mid'}));
 for(const[key,x]of Object.entries(meterX)){cyl('meter-flange-'+key,x,61,20,8,1,'lo');cyl('meter-body-'+key,x,61,17,9,5,'mid',L(K.knurl(x,61,17,9,14,64,P,0),'faint'));const ticks=K.radialTicks(x,61,11,20,5,15,[1,2.4],P,-.75*Math.PI,1.5*Math.PI);cyl('meter-face-'+key,x,61,14,14,1,'mid',L(K.ring(x,61,11,15,P),'lo')+L(ticks.minor,'lo')+L(ticks.major,'mid')+`<g id="needle-${key}">${needle(key,m.dialFractions[key])}</g>`);cyl('meter-spindle-'+key,x,61,1.2,15,.5);for(const[i,dx]of [-18,18].entries())cyl('meter-screw-'+key+'-'+i,x+dx,61,1.4,9,.5,'mid',L(K.lineOnTop([x+dx-1.4,61],[x+dx+1.4,61],9.5,P),'lo'));}
 cyl('knob-seat',106,61,12,8,2,'lo');cyl('knob-shaft',106,61,3.2,10,3);cyl('knob-grip',106,61,10,13,9,'mid',L(K.knurl(106,61,10,13,22,48,P,0),'lo')+`<g id="knob-pointer">${knobPointer(m.knobFraction)}</g>`);
 PRESETS.forEach((n,i)=>{const x=44+15*(i%3),y=45+14*Math.floor(i/3);slab('key-base-'+n,{x,y,w:11,d:10,r:1},8,1.4,'lo');slab('key-cap-'+n,{x:x+1,y:y+1,w:9,d:8,r:.8},9.4,2,'mid',L(K.planOutline({x:x+2,y:y+2,w:7,d:6,r:.5},11.4,P),'faint'));});
 for(const[i,x]of [48,63,78].entries()){cyl('indicator-seat-'+i,x,77,2.4,8,1,'lo');cyl('indicator-lens-'+i,x,77,1.8,9,1.2,'mid');}
 slab('id-plate',{x:87,y:77,w:47,d:5,r:.6},8,.7,'lo',L(K.lineOnTop([94,79.5],[125,79.5],8.7,P),'faint',true)+D([[94,79.5,8.7],[125,79.5,8.7]],'lo',.35));for(const x of [90,131])cyl('id-screw-'+x,x,79.5,.8,8.7,.3);
 return {items,m,P};}
export function groupMarkup(items,order){return [...items].sort((a,b)=>order[a.name]-order[b.name]).map(i=>`<g id="${i.name}" data-part="${i.name}">${i.svg}</g>`).join('');}
export const figureMarkup=(items,order)=>K.figureSvg({width:WIDTH,height:HEIGHT,label:'A recessed signal screen and three calibrated mechanical rulers. The same narrowing pulse changes area and peak but keeps its squared integral constant.',body:groupMarkup(items,order)});
