export const RANGES=[32,64,128,256];
export const DEFAULT={limit:128,probe:64,beta:.5,ruler:.5};
export const PRESETS=[{key:'power',label:'Prime power',...DEFAULT},{key:'gap',label:'Between jumps',limit:128,probe:96,beta:.5,ruler:.5},{key:'wide',label:'Wider ruler',limit:256,probe:222,beta:.875,ruler:.25},{key:'tight',label:'Tight ruler',limit:256,probe:222,beta:.5,ruler:.25}];
const composite=new Uint8Array(257),primes=[];
for(let p=2;p<=256;p++){if(composite[p])continue;primes.push(p);for(let n=p*p;n<=256;n+=p)composite[n]=1;}
export const EVENTS=[];
for(const p of primes)for(let n=p,k=1;n<=256;n*=p,k++)EVENTS.push({n,p,k,weight:Math.log(p)});
EVENTS.sort((a,b)=>a.n-b.n);
const weights=new Map(EVENTS.map(e=>[e.n,e.weight]));
const totals=[0];for(let n=1;n<=256;n++)totals[n]=totals[n-1]+(weights.get(n)||0);
export const psi=x=>{if(!Number.isFinite(x)||x<0||x>256)throw new RangeError('Count outside supported interval');return totals[Math.floor(x)];};
export function sample(s={}){const v={...DEFAULT,...s};if(!RANGES.includes(v.limit)||!Number.isInteger(v.probe)||v.probe<16||v.probe>v.limit||!Number.isFinite(v.beta)||v.beta<.5||v.beta>1||!Number.isFinite(v.ruler)||v.ruler<.1||v.ruler>1)throw new RangeError('Controls outside supported bounds');
 const count=psi(v.probe),error=count-v.probe,ratio=Math.abs(error)/v.probe**v.beta;let maximum=-1,worst=16;
 for(let n=16;n<=v.limit;n++){const r=Math.abs(psi(n)-n)/n**v.beta;if(r>maximum){maximum=r;worst=n;}}
 const event=EVENTS.find(e=>e.n===v.probe);return{...v,count,error,ratio,maximum,worst,within:maximum<=v.ruler,eventPrime:event?.p||0,eventExponent:event?.k||0,jump:event?.weight||0,countFraction:count/(1.1*v.limit),maximumFraction:maximum,probeFraction:(v.probe-16)/(v.limit-16),betaFraction:(v.beta-.5)/.5};}
