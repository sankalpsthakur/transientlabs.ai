import * as K from './kit/iso-kit.mjs';
import {DEFAULT,sample,pinLength} from './model.mjs';
export const WIDTH=736, HEIGHT=400;
export const PLATE={x:-140,y:-58,w:280,d:126,r:8};
export const P=K.fitProjection(K.boxCorners(PLATE,-6,87),WIDTH,HEIGHT,{pad:26,azimuth:42,elevation:32});
const at = q=>K.iso(q,P);
const L = (d,tone='lo',free)=>K.lineSvg(d,{tone,free});
const D = (q,tone='mid',size=.55)=>K.dotsSvg(q.map(at),{tone,size});
export const needle = value => {
  const angle=(-.75+1.5*value)*Math.PI;
  return L(K.lineOnTop([-85,46],[-85+10*Math.sin(angle),46-10*Math.cos(angle)],13.9,P),'hi','end')+D([[-85,46,13.9]],'hi',1);
};
export function knobPointer(x,value,max) {
  const angle=(-.75+1.5*value/max)*Math.PI;
  return L(K.lineOnTop([x,46],[x+8*Math.sin(angle),46-8*Math.cos(angle)],22,P),'mid','end')+D([[x,46,22]],'mid',.8);
}
export function pinParts(j,value,selected) {
  const x=-110+220*(j+.5)/16, top=20+pinLength(value);
  const stem={type:'cylinder',x,y:0,r:1.3,z:20,h:pinLength(value)};
  const cap={type:'slab',plan:{x:x-4.7,y:-11,w:9.4,d:22,r:1.4},z:top,h:2.5};
  return [
    part('stem-'+j,stem,'mid','none'),
    part('cap-'+j,cap,selected?'hi':'mid','faint',selected,
      L(K.lineOnTop([x,-11],[x,11],top+2.5,P),selected?'hi':'faint'))
  ];
}
function part(name,shape,tone='mid',crease='faint',lit=false,details='') {
  const centre=shape.type==='slab'?[shape.plan.x+shape.plan.w/2,shape.plan.y+shape.plan.d/2,shape.z+shape.h/2]:[shape.x,shape.y,shape.z+shape.h/2];
  const paths=shape.type==='slab'?K.slabOf(shape.plan,shape.z,shape.h,P,8):K.cylinder(shape.x,shape.y,shape.r,shape.z,shape.h,P,64);
  return {name,shape,at:centre,svg:K.solidSvg(paths,{tone,crease,lit,inner:details})};
}
export function scene(state=DEFAULT,forcedValues) {
  const items=[];
  const slab=(name,plan,z,h,tone,details='')=>items.push(part(name,{type:'slab',plan,z,h},tone,'faint',false,details));
  const cyl=(name,x,y,r,z,h,tone,details='',ground=false)=>items.push(part(name,{type:'cylinder',x,y,r,z,h,ground},tone,'faint',false,details));
  const values=forcedValues??sample(state).values;
  for (const [i,[x,y]] of K.corners(PLATE,18).entries()) {
    cyl('foot-pad-'+i,x,y,7,-6,2,'lo','',true);
    cyl('foot-post-'+i,x,y,5,-4,4,'mid');
  }
  slab('bench',PLATE,0,8,'mid',L(K.planOutline(K.insetPlan(PLATE,5),8,P),'faint'));
  for(let j=0;j<16;j++) {
    const x=-110+220*(j+.5)/16;
    const housing={x:x-5,y:-8,w:10,d:16,r:1.2};
    slab('housing-'+j,housing,8,12,'mid',L(K.planOutline(K.insetPlan(housing,1.1),20,P),'lo')+D([[x,5,20]],'lo',.45));
    items.push(...pinParts(j,values[j],j===state.selected));
  }
  for(const y of [-25,22]) slab('rail-'+y,{x:-119,y,w:238,d:4,r:.8},8,3,'lo',L(K.lineOnTop([-119,y+2],[119,y+2],11,P),'faint'));
  for(const x of [-125,121]) slab('stop-'+x,{x,y:-25,w:4,d:51,r:.8},8,5,'mid',D([[x+2,-21,13],[x+2,21,13]],'lo',.45));
  const ruler={x:-117,y:27,w:234,d:3,r:.6};
  const ticks=Array.from({length:33},(_,j)=>{
    const x=-110+220*j/32;
    return L(K.lineOnTop([x,30],[x,j%2?29:28],8.7,P),'lo');
  }).join('');
  slab('ruler',ruler,8,.7,'lo',ticks);
  cyl('dial-body',-85,46,15,8,5,'mid',L(K.knurl(-85,46,15,8,13,48,P,0),'faint'));
  const radial=K.radialTicks(-85,46,10.7,20,5,13.8,[1,2.4],P,-.75*Math.PI,1.5*Math.PI);
  cyl('dial-face',-85,46,12.2,13,.8,'mid',L(K.ring(-85,46,10.7,13.8,P),'lo')+L(radial.minor,'lo')+L(radial.major,'mid')+`<g id="dial-needle">${needle(values[state.selected])}</g>`);
  cyl('dial-spindle',-85,46,1.3,13.8,.5,'mid');
  for(const x of [66,108]) {
    cyl('knob-base-'+x,x,46,11,8,2,'lo');
    cyl('knob-stem-'+x,x,46,3.2,10,3,'mid');
    cyl('knob-grip-'+x,x,46,9,13,9,'mid',L(K.knurl(x,46,9,13,22,36,P,0),'lo')+`<g id="knob-pointer-${x}">${knobPointer(x,x===66?(state.velocity+.25):state.diffusivity,x===66?.5:.02)}</g>`);
  }
  const label={x:-44,y:43,w:68,d:17,r:1.5};
  slab('nameplate',label,8,.8,'lo',[-39,-35,-31].map(x=>L(K.lineOnTop([x,46],[x,57],8.8,P),'lo',true)).join('')+D([[-40,46,8.8],[20,55,8.8]],'lo',.4));
  for(const [i,[x,y]] of K.corners(PLATE,9).entries()) cyl('screw-'+i,x,y,2,8,.9,'mid',L(K.lineOnTop([x-2,y],[x+2,y],8.9,P),'lo'));
  return {items,values,P};
}
export function groupMarkup(items,order) {
  return [...items].sort((a,b)=>order[a.name]-order[b.name]).map(item=>`<g id="${item.name}" data-part="${item.name}">${item.svg}</g>`).join('');
}
export function figureMarkup(items,order) {
  return K.figureSvg({width:WIDTH,height:HEIGHT,label:'Sixteen pin heights display a periodic field. The highlighted cap is read by the front dial.',body:groupMarkup(items,order)});
}
