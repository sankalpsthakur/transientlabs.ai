export const GAP=.002,DENSITY=1000,LENGTH=.4;
export const DEFAULT={gradient:80,viscosity:1,position:.5,time:6};
export const PRESETS=[{key:'quiet',label:'Quiet',gradient:20,viscosity:2},{key:'drive',label:'More drive',gradient:80,viscosity:2},{key:'thick',label:'Thicker',gradient:80,viscosity:4},{key:'caution',label:'High Re',gradient:200,viscosity:.2}];
export const LANES=[.05,.2,.35,.5,.65,.8,.95];
export function velocity(y,G,mu){return G*y*(GAP-y)/(2*mu);}
export function sample(input={}){const s={...DEFAULT,...input};for(const [k,lo,hi]of[['gradient',5,200],['viscosity',.2,5],['position',0,1],['time',0,8]])if(!Number.isFinite(s[k])||s[k]<lo||s[k]>hi)throw new RangeError(k);const mu=s.viscosity*.001,mean=s.gradient*GAP**2/(12*mu),max=1.5*mean,speed=velocity(s.position*GAP,s.gradient,mu),re=DENSITY*mean*2*GAP/mu;return{...s,mu,mean,max,speed,re,travel:speed*s.time,front:speed*s.time/LENGTH,wallShear:s.gradient*GAP/2,lanes:LANES.map(y=>({y,speed:velocity(y*GAP,s.gradient,mu),x:velocity(y*GAP,s.gradient,mu)*s.time/LENGTH})),pressureFraction:s.gradient/200,flowFraction:mean/.35,viscosityFraction:(s.viscosity-.2)/4.8,caution:re>=2000};}
