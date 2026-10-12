export const PIN_COUNT = 16;
export const DEFAULT = Object.freeze({mode:'both',time:0,velocity:0.12,diffusivity:0.006,selected:4});
export function effective(state) {
  return {v:state.mode === 'diffusion' ? 0 : state.velocity,
    kappa:state.mode === 'transport' ? 0 : state.diffusivity};
}
export function field(x, time, v, kappa) {
  const a=2*Math.PI, b=4*Math.PI;
  return .5+.30*Math.exp(-a*a*kappa*time)*Math.cos(a*(x-v*time))
    +.12*Math.exp(-b*b*kappa*time)*Math.cos(b*(x-v*time));
}
export function sample(state) {
  const {v,kappa}=effective(state);
  const values=Array.from({length:PIN_COUNT},(_,j)=>field((j+.5)/PIN_COUNT,state.time,v,kappa));
  const mean=values.reduce((a,b)=>a+b,0)/PIN_COUNT;
  const rms=Math.sqrt(values.reduce((a,b)=>a+(b-.5)**2,0)/PIN_COUNT);
  return {values,mean,rms,selectedValue:values[state.selected],x:(state.selected+.5)/PIN_COUNT,v,kappa};
}
export const pinLength = u => 8+60*u;
