export const DEFAULT={radius:.8,angle:30,chart:'x'};
export const PRESETS=[{key:'approach',label:'Approach',...DEFAULT},{key:'origin',label:'Origin · 30°',radius:0,angle:30,chart:'x'},{key:'different',label:'Origin · 120°',radius:0,angle:120,chart:'x'},{key:'vertical',label:'Vertical',radius:.8,angle:90,chart:'x'}];
export function sample(s={}){
  const v={...DEFAULT,...s};
  if(!Number.isFinite(v.radius)||v.radius < -1||v.radius>1||!Number.isFinite(v.angle)||v.angle<0||v.angle>180||!['x','y'].includes(v.chart))throw new RangeError('Outside bounded real slice');
  const a=v.angle*Math.PI/180,u=v.angle===90?0:v.angle===0?1:v.angle===180?-1:Math.cos(a),w=v.angle===0||v.angle===180?0:v.angle===90?1:Math.sin(a),x=v.radius*u,y=v.radius*w;
  const chartAvailable=v.chart==='x'?u!==0:w!==0,coordinate=chartAvailable?(v.chart==='x'?w/u:u/w):null,transverse=v.chart==='x'?x:y;
  return{...v,u,v:w,x,y,exceptional:v.radius===0,distance:Math.abs(v.radius),incidence:x*w-y*u,chartAvailable,coordinate,transverse,jacobian:chartAvailable?transverse:null,radiusFraction:(v.radius+1)/2,angleFraction:v.angle/180,directionX:Math.cos(2*a),directionY:Math.sin(2*a)};
}
