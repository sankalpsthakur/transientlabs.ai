export const DEFAULT={n:1,selected:'inf'};
export const PRESETS=[1,2,4,8,16,64];
export function checkedN(n){if(!Number.isFinite(n)||n<1||n>64)throw new RangeError('Concentration must be between1 and64.');return n;}
export function signalAt(x,n){checkedN(n);return x>=0&&x<1/n?Math.sqrt(n):0;}
export function lpNorm(n,p){checkedN(n);if(p===Infinity)return Math.sqrt(n);if(!Number.isFinite(p)||p<1)throw new RangeError('Norm exponent must be at least1.');return n**(.5-1/p);}
export function sample({n,selected='inf'}){checkedN(n);if(!['1','2','inf'].includes(selected))throw new RangeError('Unknown ruler');const norms={1:lpNorm(n,1),2:lpNorm(n,2),inf:lpNorm(n,Infinity)};return{n,width:1/n,height:Math.sqrt(n),norms,squaredIntegral:1,selectedValue:norms[selected],dialFractions:{1:norms[1],2:norms[2],inf:norms.inf/8},knobFraction:Math.log2(n)/6};}
export const sweepN=seconds=>2**(Math.min(12,Math.max(0,seconds))/2);
