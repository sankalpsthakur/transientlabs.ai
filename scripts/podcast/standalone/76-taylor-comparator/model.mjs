export const ORDERS=Object.freeze([0,1,2,4,6,10,14]);
export const DEFAULT=Object.freeze({order:4,probe:0});
export const PRESETS=Object.freeze([{key:'boundary',label:'At the boundary',order:4,probe:-1},{key:'near',label:'Just inside',order:4,probe:-.9},{key:'peak',label:'Bump peak',order:14,probe:0},{key:'coarse',label:'Coarse Taylor',order:1,probe:.5}]);
export const bump=x=>Math.abs(x)>=1?0:Math.exp(1-1/(1-x*x));
export const gaussian=x=>Math.exp(-((x+1)**2));
export function taylor(x,N){const q=(x+1)**2;let value=1;for(let j=N;j>=1;j--)value=1-q*value/j;return value;}
export function sample(input={}){const s={...DEFAULT,...input};if(!Number.isFinite(s.probe)||s.probe< -1.5||s.probe>.5)throw new RangeError('probe out of bounds');if(!ORDERS.includes(s.order))throw new RangeError('invalid Taylor order');const analytic=gaussian(s.probe),polynomial=taylor(s.probe,s.order),smooth=bump(s.probe),analyticError=Math.abs(analytic-polynomial),smoothError=smooth;return{...s,degree:2*s.order,analytic,polynomial,smooth,smoothTaylor:0,analyticError,smoothError,analyticFraction:analyticError/1.5,smoothFraction:smoothError/1.5,probeFraction:(s.probe+1.5)/2,orderFraction:s.order/14,underflow:Math.abs(s.probe)<1&&smooth===0};}
