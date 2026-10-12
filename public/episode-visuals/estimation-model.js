(()=>{
const M=window.DeepEndModels=window.DeepEndModels||{};
M[13]={title:'State estimation: how much should we trust the sensor?',controls:[{key:'measurement',label:'Measured level',min:10,max:90,step:1,value:35,unit:'%'},{key:'noise',label:'Sensor uncertainty (σ)',min:1,max:20,step:1,value:8,unit:'percentage points'}],sources:[{label:'Welch & Bishop · Kalman filter',url:'https://www.cs.unc.edu/~welch/media/pdf/kalman_intro.pdf'}],draw(c,s){
const {W,rect,line,text,path,circle}=c,prior=50,P=64,R=s.noise*s.noise,K=P/(P+R),estimate=prior+K*(s.measurement-prior),posterior=(1-K)*P;
const x0=W*.16,x1=W*.84,tw=x1-x0,y0=58,y1=203,map=v=>y1-v/100*(y1-y0);
let svg=rect(x0,y0,tw,y1-y0,'paper',{stroke:'line'})+rect(x0+2,map(estimate),tw-4,y1-map(estimate)-2,'secondary',{opacity:.16});
svg+=line(x0,map(prior),x1,map(prior),'accent',1.5,{dash:'5 4'})+line(x0,map(s.measurement),x1,map(s.measurement),'tertiary',1.5,{dash:'2 4'})+line(x0,map(estimate),x1,map(estimate),'secondary',2.5);
svg+=text(W/2,30,'One scalar Kalman measurement update','middle')+text(x0,227,'Prior: 50%')+text(x1,227,'Measured: '+s.measurement+'%','end');
const start=25,end=W-25,base=311,scale=55*Math.sqrt(2*Math.PI)*Math.min(8,s.noise,Math.sqrt(posterior));
svg+=line(start,base,end,base,'line');
function gaussian(mu,sigma,tone){let d='';for(let i=0;i<=120;i++){let v=i/120*100,x=start+i/120*(end-start),y=base-scale/(sigma*Math.sqrt(2*Math.PI))*Math.exp(-.5*((v-mu)/sigma)**2);d+=(i?'L':'M')+x+' '+y;}return path(d,tone,1.6);}
svg+=gaussian(prior,8,'accent')+gaussian(s.measurement,s.noise,'tertiary')+gaussian(estimate,Math.sqrt(posterior),'secondary')+text(W/2,333,'Level uncertainty → probability density','middle');
return {svg,readout:'Estimate '+estimate.toFixed(1)+'% · measurement weight '+(K*100).toFixed(0)+'%',summary:'A reliable sensor gets more weight; an uncertain one gets less. Prior level is 50% with σ = 8 percentage points. This is one linear-Gaussian update, not a complete controller.'};
}};
})();
