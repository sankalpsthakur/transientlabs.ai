export const DEFAULT={logZoom:0,dimension:3,metric:'critical'};
export const PRESETS=[.25,.5,1,2,4];
export const METRICS=['energy','l2','critical','h1'];
export function sample({logZoom=0,dimension=3,metric='critical'}={}){
 if(!Number.isFinite(logZoom)||logZoom<-2||logZoom>2)throw new RangeError('Logarithmic zoom must lie between -2 and2.');
 if(![2,3].includes(dimension))throw new RangeError('Dimension must be2 or3.');
 if(!METRICS.includes(metric))throw new RangeError('Unknown measurement.');
 const lambda=2**logZoom,criticalOrder=dimension/2-1;
 const order=metric==='h1'?1:metric==='critical'?criticalOrder:0;
 const exponent=metric==='energy'?2-dimension:1+order-dimension/2;
 const ratio=lambda**exponent;
 return{lambda,dimension,metric,criticalOrder,order,exponent,ratio,length:1/lambda,velocity:lambda,time:lambda**-2,volume:lambda**-dimension,energy:lambda**(2-dimension),gap:48/lambda,normFraction:ratio/4,velocityFraction:lambda/4,zoomFraction:(logZoom+2)/4};
}
export const zoomAt=seconds=>-2+4*Math.min(10,Math.max(0,seconds))/10;
