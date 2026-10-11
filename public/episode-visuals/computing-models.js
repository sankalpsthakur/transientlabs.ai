/* Deep End Era: bounded educational models. Each draw is pure. */
(()=>{
  'use strict';
  const M=window.DeepEndModels=window.DeepEndModels||{};
  const range=(key,label,min,max,value,unit='',step=1)=>({key,label,min,max,step,value,unit});
  const select=(key,label,value,options)=>({key,label,type:'select',value,options:options.map(([value,label])=>({value,label}))});
  const source=(label,url)=>({label,url});
  const num=(v,d=1)=>Number(v).toFixed(d);
  const row=(c,y,label)=>c.text(18,y,label,'start',{muted:true});
  const tile=(c,x,y,w,h,label,tone='surface')=>c.rect(x,y,w,h,tone,{stroke:'line'})+c.text(x+w/2,y+h/2+4,label,'middle');

  M[1]={title:'When a replicated write becomes committed',
    controls:[range('reachable','Replicas reachable from leader',1,5,3),select('read','Read policy','quorum',[['quorum','Quorum-confirmed'],['local','Local follower']])],
    sources:[source('Raft: replicated logs and majority commitment','https://raft.github.io/raft.pdf')],
    draw(c,s){
      const n=Number(s.reachable),committed=n>=3,local=s.read==='local',cw=(c.W-40)/5,entryW=Math.min(44,cw-8);let svg='';
      svg+=row(c,27,'One command, five logs');
      for(let i=0;i<5;i++){
        const x=20+i*cw+(cw-entryW)/2;
        svg+=c.text(x+entryW/2,57,i===0?'Leader':`R${i+1}`,'middle');
        for(let j=0;j<4;j++) svg+=tile(c,x,75+j*36,entryW,27,`${j+1}`,'surface');
        svg+=c.rect(x,222,entryW,31,i<n?(committed?'accent':'secondary'):'surface',{stroke:i<n?'ink':'line'});
        svg+=c.text(x+entryW/2,242,i<n?'5':'—','middle');
        svg+=c.text(x+entryW/2,279,i<n?'ACK':'cut','middle',{muted:true});
      }
      const rx=20+4*cw+cw/2;
      svg+=c.line(20,committed?260:217,c.W-20,committed?260:217,'secondary',1.5,{dash:'4 3'});
      if(local)svg+=c.circle(rx,303,6,n===5?'accent':'secondary');
      svg+=c.text(c.W/2,328,committed?'Entry 5 crosses the commit boundary':'Entry 5 remains uncommitted','middle',{maxWidth:c.W-32});
      return{svg,readout:`${n}/5 ACKs · ${committed?'majority committed':'need 3 to commit'} · ${local?`R5 returns ${n===5&&committed?'5':'4'}`:committed?'confirmed read: 5':'confirmed read waits'}`,summary:'Illustrative current-term write in a five-replica Raft log. A majority commits it; a local follower may still show the old value. Quorum-confirmed reads include the necessary leadership confirmation.'};
    }};

  M[3]={title:'A packet meets the OT boundary',
    controls:[select('packet','Packet direction','telemetry',[['telemetry','Telemetry outward'],['command','Command inward']]),select('gate','Boundary','diode',[['diode','Physical one-way link'],['firewall','Read-only firewall policy']])],
    sources:[source('NIST SP 800-82r3: OT segmentation and unidirectional gateways','https://csrc.nist.gov/pubs/sp/800/82/r3/final')],
    draw(c,s){
      const cx=c.W/2,y=173,out=s.packet==='telemetry',diode=s.gate==='diode',allowed=out;let svg='';
      svg+=c.rect(18,45,cx-31,233,'surface')+c.rect(cx+13,45,cx-31,233,'surface');
      svg+=c.text(cx/2,72,'Control zone','middle')+c.text(cx+cx/2,72,'Data zone','middle');
      const ly=out?127:223,from=out?36:c.W-36,to=out?c.W-36:36;
      svg+=c.line(from,ly,to,ly,'line',2,{dash:'4 4'});
      svg+=c.rect(cx-9,93,18,147,'paper',{stroke:'ink'});
      svg+=diode?c.poly([[cx-6,147],[cx-6,173],[cx+8,160]],'accent'):c.rect(cx-5,143,10,34,'accent');
      const packetX=allowed?(out?cx+26:cx-68):(out?cx-68:cx+26);
      svg+=c.rect(packetX,ly-12,40,24,allowed?'accent':'danger',{radius:2});
      for(let i=1;i<4;i++)svg+=c.line(packetX+i*10,ly-10,packetX+i*10,ly+10,'paper');
      svg+=allowed?c.arrow(cx+15,ly,c.W-35,ly,'accent',2):c.line(cx+14,ly-13,cx+14,ly+13,'danger',3);
      svg+=c.text(cx,307,allowed?'Telemetry crosses outward':diode?'No reverse physical channel':'Command rejected by configured policy','middle',{maxWidth:c.W-32});
      return{svg,readout:allowed?'Telemetry admitted':'Inbound command blocked',summary:diode?'Illustrative unidirectional gateway: the physical transfer channel carries data only outward. Real deployments use protocol proxies and defined source/destination services.':'Illustrative firewall rule admits outward telemetry and denies this inbound command. A firewall can support bidirectional traffic; its protection depends on policy and implementation.'};
    }};

  M[4]={title:'A warp turns addresses into memory transactions',
    controls:[select('stride','Address stride','1',[['1','Consecutive floats'],['2','Every other float'],['4','Every fourth float'],['8','Every eighth float']]),select('offset','Starting byte offset','0',[['0','Aligned: 0 B'],['4','Offset: 4 B'],['28','Offset: 28 B']])],
    sources:[source('NVIDIA: global memory coalescing','https://developer.nvidia.com/blog/unlock-gpu-performance-global-memory-access-in-cuda/'),source('CUDA programming model: 32-thread warps','https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html')],
    draw(c,s){
      const stride=Number(s.stride),offset=Number(s.offset),segments=new Set(Array.from({length:32},(_,i)=>Math.floor((offset+4*i*stride)/32))),cols=c.W<500?8:16,cw=(c.W-40)/cols;let svg=row(c,25,'32 lanes each request a 4-byte float');
      for(let i=0;i<32;i++){const x=20+(i%cols)*cw,y=43+Math.floor(i/cols)*31;svg+=c.rect(x,y,cw-3,24,'accent',{opacity:.8});if(cw>=28)svg+=c.text(x+(cw-3)/2,y+17,String(i),'middle');}
      const start=c.W<500?187:134,cell=(c.W-40)/8;
      svg+=row(c,start-13,'Touched 32-byte memory sectors');
      const count=segments.size;
      for(let i=0;i<32;i++)svg+=c.rect(20+(i%8)*cell,start+Math.floor(i/8)*24,cell-4,17,i<count?'secondary':'surface',{stroke:'line'});
      svg+=c.text(c.W/2,319,`${count} sectors · ${32*count} bytes transferred`,'middle');
      return{svg,readout:`128 useful bytes / ${32*count} transferred · ${num(128/(32*count)*100,0)}% useful`,summary:'One illustrative aligned 32-thread warp, 4-byte loads, and 32-byte sectors. Consecutive addresses coalesce; striding or misalignment touches more sectors. This is a transaction-count model, not a GPU timing prediction.'};
    }};

  M[9]={title:'Collisions make a hash table probe',
    controls:[range('keys','Keys inserted',4,14,8),select('hash','Hash distribution','spread',[['spread','Spread across slots'],['collision','Same initial slot']])],
    sources:[source('Thorup: Linear Probing with 5-Independent Hashing','https://arxiv.org/abs/1509.04549'),source('Sedgewick and Wayne: linear-probing implementation','https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/LinearProbingHashST.java.html')],
    draw(c,s){
      const count=Number(s.keys),slots=Array(16).fill(null),probes=[],steps=[];
      for(let k=0;k<count;k++){let j=s.hash==='spread'?(7*k+3)%16:3,p=1,visited=[j];while(slots[j]!==null){j=(j+1)%16;p++;visited.push(j);}slots[j]=k+1;probes.push(p);steps.push(visited);}
      const cw=(c.W-40)/4,last=steps.at(-1);let svg=row(c,25,`Last key starts at slot ${last[0]}`);
      for(let i=0;i<16;i++){const x=20+(i%4)*cw,y=55+Math.floor(i/4)*59;svg+=c.rect(x,y,cw-6,46,last.includes(i)?'secondary':slots[i]!==null?'accent':'surface',{opacity:last.includes(i)?1:.7,stroke:'line'});svg+=c.text(x+7,y+16,String(i),'start',{size:12});svg+=c.text(x+(cw-6)/2,y+36,slots[i]===null?'empty':`K${slots[i]}`,'middle');}
      svg+=c.text(c.W/2,323,`Slot ${last[0]} → slot ${last.at(-1)} · ${last.length} probes`,'middle');
      return{svg,readout:`${count}/16 slots full · last insert: ${probes.at(-1)} probes · mean: ${num(probes.reduce((a,b)=>a+b,0)/count)}`,summary:'Actual linear probing in a 16-slot toy table: try h(key), then successive slots, wrapping at the end. The yellow slots are the last insertion’s probe sequence. The simple hash examples are for lookup illustration, not cryptographic security.'};
    }};

  M[10]={title:'Column pruning avoids reading unused bytes',
    controls:[range('columns','Columns requested',1,3,1),select('filter','Block filter','one',[['all','Read all blocks'],['one','One matching block'],['two','Two matching blocks']])],
    sources:[source('BigQuery: column bytes and block pruning','https://cloud.google.com/bigquery/docs/clustered-tables')],
    draw(c,s){
      const cols=Number(s.columns),blocks=s.filter==='all'?6:s.filter==='two'?2:1,x0=61,cw=(c.W-81)/3;let svg='';
      ['Time','Asset','Value'].forEach((v,i)=>svg+=c.text(x0+i*cw+cw/2,32,v,'middle'));
      for(let r=0;r<6;r++){svg+=c.text(19,72+r*38,`B${r+1}`);for(let col=0;col<3;col++){const read=r<blocks&&col<cols;svg+=c.rect(x0+col*cw,51+r*38,cw-5,29,read?'accent':'surface',{stroke:'line',opacity:read?1:.7});if(cw>63)svg+=c.text(x0+col*cw+(cw-5)/2,70+r*38,read?'read':'skip','middle');}}
      svg+=c.text(c.W/2,316,`${cols*blocks} MB read · ${18-cols*blocks} MB skipped`,'middle');
      return{svg,readout:`${cols} columns × ${blocks} blocks × 1 MB = ${cols*blocks} MB scanned`,summary:'Illustrative table with six blocks and three equally sized 1 MB columns per block. A query reads referenced columns in matching blocks; block metadata can exclude the others. This measures bytes, not elapsed time or a provider bill.'};
    }};

  M[11]={title:'The transaction log chooses a table snapshot',
    controls:[range('head','Latest committed version',0,2,1),range('reader','Reader snapshot',0,2,0)],
    sources:[source('Delta Lake: time travel and table versions','https://docs.delta.io/latest/delta-batch.html')],
    draw(c,s){
      const head=Number(s.head),reader=Number(s.reader),valid=reader<=head,sets=[['A','B'],['A','C'],['C','D']],active=valid?sets[reader]:[],cw=(c.W-44)/2;let svg=row(c,25,'Objects outlive their table versions');
      ['A','B','C','D'].forEach((f,i)=>{const x=20+(i%2)*cw,y=44+Math.floor(i/2)*70,present=i<2||head>=1&&i===2||head>=2&&i===3;svg+=c.rect(x,y,cw-5,54,active.includes(f)?'accent':'surface',{stroke:'line',opacity:present?1:.35});svg+=c.text(x+(cw-5)/2,y+23,`File ${f}`,'middle')+c.text(x+(cw-5)/2,y+43,present?active.includes(f)?'in snapshot':'retained':'not written','middle',{muted:true});});
      const logs=['v0  +A +B','v1  −B +C','v2  −A +D'];
      logs.forEach((v,i)=>{svg+=c.rect(20,208+i*33,c.W-40,26,i===reader&&valid?'secondary':'surface',{opacity:i<=head?1:.3});svg+=c.text(29,226+i*33,v);});
      return{svg,readout:valid?`Reader v${reader}: files ${active.join(' + ')} · published head v${head}`:`v${reader} is not committed yet`,summary:'Illustrative add/remove transaction records build atomic table snapshots. Removing a file from the current table does not immediately erase the object; retention permits older reads until cleanup. A reader cannot open an unpublished version.'};
    }};

  M[12]={title:'Source time survives a delayed arrival',
    controls:[range('delay','First sample transport delay',0,10,5,'s'),select('order','Record ordering','source',[['source','By source timestamp'],['arrival','By server receipt']])],
    sources:[source('OPC UA DataValue: source and server timestamps','https://reference.opcfoundation.org/Core/Part4/v105/docs/7.11')],
    draw(c,s){
      const delay=Number(s.delay),events=[{id:'A',t:0,d:delay},{id:'B',t:2,d:1},{id:'C',t:4,d:2},{id:'D',t:6,d:0}],end=Math.max(10,delay),x=t=>45+t/end*(c.W-66);let svg='';
      svg+=row(c,24,'Event clock above; receipt clock below');
      svg+=c.line(45,68,c.W-21,68,'line')+c.line(45,199,c.W-21,199,'line');
      const receipts={};
      for(const e of events){const a=e.t+e.d;(receipts[a]??=[]).push(e.id);svg+=c.circle(x(e.t),68,7,'accent')+c.text(x(e.t),48,e.id,'middle')+c.arrow(x(e.t),83,x(a),185,'secondary',1.4);}
      for(const[a,ids]of Object.entries(receipts))svg+=c.circle(x(Number(a)),199,ids.length>1?9:7,'secondary')+c.text(x(Number(a)),223,ids.join('+'),'middle');
      svg+=c.text(20,73,'src')+c.text(20,204,'recv');
      const ordered=[...events].sort((a,b)=>s.order==='source'?a.t-b.t:(a.t+a.d)-(b.t+b.d)||a.t-b.t),cw=(c.W-40)/4;
      ordered.forEach((e,i)=>svg+=tile(c,20+i*cw,267,cw-4,38,e.id,e.id==='A'?'secondary':'surface'));
      svg+=c.text(c.W/2,327,s.order==='source'?'Recorded source order':'Arrival order can differ','middle');
      return{svg,readout:`A: source 0 s → received ${delay} s · displayed order ${ordered.map(e=>e.id).join(' ')}`,summary:'Illustrative four-sample timeline. OPC UA’s sourceTimestamp stays attached to the value; serverTimestamp records when a server received it or knew it was accurate. Source-time ordering assumes comparable synchronized clocks.'};
    }};

  M[27]={title:'Tokens fill the key and value memory pools',
    controls:[range('context','Context length',1,16,8,'Ki tokens'),select('heads','KV heads','8',[['8','8 KV heads'],['2','2 shared KV heads'],['1','1 shared KV head']])],
    sources:[source('Shazeer: multi-query attention and KV memory','https://arxiv.org/abs/1911.02150')],
    draw(c,s){
      const tokens=Number(s.context)*1024,h=Number(s.heads),bytes=2*16*tokens*h*64*2,mib=bytes/1048576,cols=4,cw=(c.W-54)/8;let svg=row(c,25,'Same tokens; fewer stored KV heads');
      for(let pool=0;pool<2;pool++){const ox=20+pool*(c.W-34)/2;svg+=c.text(ox+cw*2,54,pool===0?'Keys K':'Values V','middle');for(let i=0;i<16;i++){const x=ox+(i%cols)*cw,y=72+Math.floor(i/cols)*44,fill=Math.max(0,Math.min(1,mib/32-i));svg+=c.rect(x,y,cw-4,34,'surface',{stroke:'line'});if(fill>0)svg+=c.rect(x,y+34*(1-fill),cw-4,34*fill,pool===0?'accent':'secondary');}}
      svg+=c.text(c.W/2,286,`${num(mib,0)} MiB cached`,'middle',{size:14});svg+=c.text(c.W/2,314,'2 × layers × tokens × KV heads × dim × bytes','middle',{maxWidth:c.W-32});
      return{svg,readout:`${tokens.toLocaleString()} tokens · ${mib} MiB · ${Math.ceil(mib/16)} equivalent 16 MiB blocks`,summary:'Toy decoder: 16 layers, 8 query heads, head dimension 64, FP16 (2 bytes), batch 1. KV bytes = 2×L×T×Hkv×D×B. Blocks illustrate capacity, not an allocator. This compares generic multi-head/grouped/shared KV storage, not an asserted DeepSeek specification.'};
    }};

  M[28]={title:'A sparse router fills expert queues',
    controls:[range('balance','Spread of token choices',0,100,75,'%'),select('k','Experts per token','1',[['1','Top 1'],['2','Top 2']])],
    sources:[source('Switch Transformers: sparse routing and expert capacity','https://arxiv.org/abs/2101.03961')],
    draw(c,s){
      const k=Number(s.k),skew=Math.round(8*(1-Number(s.balance)/100)),loads=Array(6).fill(0),routes=[];for(let t=0;t<8;t++)for(let j=0;j<k;j++){const e=t<skew?j:(t+j)%6;loads[e]++;routes.push([t,e]);}
      const tw=(c.W-40)/8,ew=(c.W-40)/6;let svg=row(c,23,'8 tokens choose from 6 toy experts');
      for(let t=0;t<8;t++)svg+=c.circle(20+tw*(t+.5),58,7,'accent');
      for(const[t,e]of routes)svg+=c.path(`M${20+tw*(t+.5)} 69 Q${20+tw*(t+.5)} 107 ${20+ew*(e+.5)} 126`,'line',1,{opacity:.55});
      loads.forEach((n,e)=>{const x=20+e*ew;svg+=c.text(x+ew/2,145,`E${e+1}`,'middle');for(let i=0;i<4;i++)svg+=c.rect(x+5,161+i*26,ew-10,19,i<n?'secondary':'surface',{stroke:'line'});svg+=c.text(x+ew/2,283,String(n),'middle');if(n>4)svg+=c.circle(x+ew/2,301,6,'danger');});
      const overflow=loads.reduce((a,n)=>a+Math.max(0,n-4),0);
      return{svg,readout:`${8*k} assignments · busiest expert ${Math.max(...loads)} · ${overflow} over toy capacity`,summary:'Illustrative six-expert router with four assignment slots per expert. Spreading token choices reduces congestion; selecting more experts increases work. Red marks exceed this toy capacity; real systems may drop, reroute or queue. This is generic MoE, not a model’s published architecture.'};
    }};

  M[29]={title:'Training changes the weight; serving uses it',
    controls:[range('updates','Gradient updates',0,8,3),select('mode','Operation','training',[['training','Train on target'],['serving','Serve predictions']])],
    sources:[source('PyTorch: gradients and parameter updates','https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html')],
    draw(c,s){
      const steps=Number(s.updates),eta=.05,w=2-1.5*Math.pow(1-eta*28/3,steps),gradient=28/3*(w-2),loss=14/3*Math.pow(w-2,2),training=s.mode==='training',mid=c.W/2;let svg='';
      svg+=c.text(mid,28,`ŷ = w × x     w = ${num(w,3)}`,'middle');
      svg+=c.rect(mid-29,62,58,174,'surface',{stroke:'line'});
      for(let r=0;r<8;r++)for(let q=0;q<3;q++)svg+=c.rect(mid-21+q*15,72+r*19,11,12,'accent',{opacity:.2+.7*w/2});
      svg+=c.text(mid,256,'weight','middle');
      for(let i=1;i<=3;i++){const y=84+(i-1)*60;svg+=c.circle(39,y,10,'secondary')+c.text(39,y+4,String(i),'middle')+c.line(51,y,mid-32,y,'line')+c.line(mid+32,y,c.W-77,y,'line')+c.text(c.W-43,y+4,num(w*i,2),'middle');if(training)svg+=c.text(c.W-43,y+22,`target ${2*i}`,'middle',{muted:true});}
      if(training){svg+=c.arrow(c.W-36,277,mid+16,292,'secondary',1.5)+c.arrow(mid-16,292,33,277,'secondary',1.5);svg+=c.text(mid,319,`w ← w − 0.05 × ${num(gradient,3)}`,'middle');}else svg+=c.text(mid,314,'No gradient or weight update during this prediction','middle',{maxWidth:c.W-32});
      return{svg,readout:training?`Mean squared error ${num(loss,4)} · gradient ${num(gradient,4)}`:`Predictions: ${[1,2,3].map(x=>num(w*x,2)).join(', ')} · weight frozen`,summary:'Actual gradient descent for a scalar toy model trained on (1,2), (2,4), (3,6), initially w=0.5, learning rate 0.05. Training differentiates mean squared error and updates w; inference only evaluates the learned function. No large-model training or throughput claim is implied.'};
    }};

  M[31]={title:'Fusion keeps an intermediate out of global memory',
    controls:[range('elements','Array length',8,64,32,'floats',8),select('fusion','Kernels','fused',[['separate','Separate kernels'],['fused','Fused kernel']])],
    sources:[source('OpenXLA: operation fusion and buffer analysis','https://openxla.org/xla/architecture')],
    draw(c,s){
      const fused=s.fusion==='fused',n=Number(s.elements),cw=(c.W-75)/8,x0=57;let svg=row(c,25,'z = max(0, 2x + 1)');
      const names=['x','temp','z'],vals=[[-3,-2,-1,0,1,2,3,4],[-5,-3,-1,1,3,5,7,9],[0,0,0,1,3,5,7,9]];
      names.forEach((name,r)=>{const y=54+r*68;svg+=c.text(18,y+22,name);for(let i=0;i<8;i++){svg+=c.rect(x0+i*cw,y,cw-3,33,r===1&&fused?'surface':r===0?'secondary':'accent',{opacity:r===1&&fused?.35:1,stroke:'line'});svg+=c.text(x0+i*cw+(cw-3)/2,y+22,r===1&&fused?'—':String(vals[r][i]),'middle');}});
      svg+=c.rect(20,265,c.W-40,46,'surface',{stroke:'line'});svg+=c.text(c.W/2,284,fused?'read x → register arithmetic → write z':'read x → write temp → read temp → write z','middle',{maxWidth:c.W-52});
      const bytes=n*(fused?8:16);
      return{svg,readout:`${fused?1:2} kernel${fused?'':'s'} · ${bytes} B global array traffic · ${fused?'no':'one'} intermediate buffer`,summary:'Illustrative FP32 elementwise two-operation expression. Counting array reads and writes only: separate kernels move 16N bytes; a fused kernel moves 8N. Eight example values are shown. Cache effects, compiler decisions and launch overhead are excluded.'};
    }};

  M[32]={title:'A changing input waits for the next scan',
    controls:[range('scan','Scan interval',20,100,50,'ms',10),range('event','Input changes at',0,100,31,'ms')],
    sources:[source('CODESYS: task input reads and output writes','https://content.helpme-codesys.com/en/CODESYS%20Development%20System/_cds_buscycle_task.html')],
    draw(c,s){
      const period=Number(s.scan),event=Number(s.event),sample=Math.ceil(event/period)*period,execute=.6*period,output=sample+execute,end=220,x=t=>56+t/end*(c.W-78);let svg='';
      const rows=[['Field',event],['Image',sample],['Output',output]];
      for(let tick=0;tick<=220;tick+=period){svg+=c.line(x(tick),45,x(tick),277,'line',1,{dash:'3 4'});}
      rows.forEach(([label,t],r)=>{const y=80+r*77;svg+=c.text(18,y+4,label);svg+=c.path(`M56 ${y+18} H${x(t)} V${y-18} H${c.W-22}`,'accent',2);svg+=c.circle(x(t),y-18,5,r===0?'secondary':'accent');svg+=c.text(x(t),y-31,`${num(t,0)} ms`,'middle');});
      svg+=c.rect(x(sample),270,Math.max(1,x(output)-x(sample)),13,'secondary');svg+=c.text(c.W/2,319,`Input wait ${num(sample-event,0)} ms + execution ${num(execute,0)} ms`,'middle',{maxWidth:c.W-32});
      return{svg,readout:`Sample at ${sample} ms · output at ${num(output,0)} ms · total delay ${num(output-event,0)} ms`,summary:'Illustrative cyclic task reads inputs at the scan start and writes outputs after execution, assumed to take 60% of its interval. A change exactly at a scan start is included. Real I/O bus cycles, ADC conversion, actuator motion and controller scheduling add other delays.'};
    }};

  M[33]={title:'Two certificates need an honest overlap',
    controls:[range('votes','Votes for proposal A',3,6,5),range('faults','Nodes that double-vote',0,3,2)],
    sources:[source('HotStuff: BFT quorum certificates and safety','https://arxiv.org/abs/1803.05069')],
    draw(c,s){
      const a=Number(s.votes),f=Number(s.faults),overlap=Math.min(a,f),b=7-a+overlap,qa=a>=5,qb=b>=5,r=Math.min(82,(c.W-85)/2),cx=c.W/2,cy=133;let svg=row(c,24,'7 nodes · a certificate requires 5 votes');
      for(let i=0;i<7;i++){const angle=-Math.PI/2+i*2*Math.PI/7,x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle),voteA=i<a,voteB=i>=a||i<overlap;svg+=c.circle(x,y,15,voteA&&voteB?'danger':voteA?'accent':'secondary');svg+=c.text(x,y+4,String(i+1),'middle');if(voteA&&voteB)svg+=c.text(x,y+31,'A+B','middle');}
      svg+=c.text(cx,cy+4,'same view','middle');
      for(let proposal=0;proposal<2;proposal++){const count=proposal===0?a:b,y=257+proposal*39;svg+=c.text(20,y+18,proposal===0?'A':'B');const cw=(c.W-73)/7;for(let i=0;i<7;i++)svg+=c.rect(52+i*cw,y,cw-4,25,i<count?(proposal===0?'accent':'secondary'):'surface',{stroke:'line'});}
      return{svg,readout:`A: ${a}/5 · B: ${b}/5 · ${qa&&qb?'conflicting certificates possible':qa?'only A reaches quorum':qb?'only B reaches quorum':'neither reaches quorum'}${f>2?' · beyond f=2 bound':''}`,summary:'Illustrative same-view votes, with honest nodes voting once and red nodes voting twice. For n=7 and quorum=5, any two certificates overlap in at least 3 nodes, exceeding the allowed f=2 Byzantine nodes. Three double-voters break that bound. Full BFT protocols also require locks, phases and timing assumptions.'};
    }};

  M[34]={title:'A batch shares the weight-reading bill',
    controls:[range('batch','Tokens in a decode batch',1,16,4),range('utilization','Useful serving time',10,100,70,'%')],
    sources:[source('PagedAttention: batching and LLM serving efficiency','https://arxiv.org/abs/2309.06180')],
    draw(c,s){
      const b=Number(s.batch),u=Number(s.utilization)/100,mem=(16+b*.0625)/1024,compute=b/2000,step=Math.max(mem,compute),tps=b/step*u,cost=3*1e6/(3600*tps),cw=(c.W-40)/8;let svg=row(c,24,'Batch shares one weight read');
      svg+=c.rect(20,44,c.W-40,53,'surface',{stroke:'line'});for(let i=0;i<16;i++)svg+=c.rect(27+i*(c.W-54)/16,54,(c.W-54)/16-3,23,'secondary');svg+=c.text(c.W/2,87,'16 GiB of toy model weights','middle');
      for(let i=0;i<16;i++){const x=20+(i%8)*cw,y=128+Math.floor(i/8)*44;svg+=c.rect(x,y,cw-4,31,i<b?'accent':'surface',{stroke:'line'});if(i<b)svg+=c.text(x+(cw-4)/2,y+22,String(i+1),'middle');}
      svg+=c.text(c.W/2,227,`${b} tokens share the transfer`,'middle');
      const scale=(c.W-105)/.018;
      svg+=c.text(20,267,'Memory')+c.rect(83,253,mem*scale,17,'secondary');svg+=c.text(20,299,'Compute')+c.rect(83,285,compute*scale,17,'accent');
      return{svg,readout:`${num(tps,0)} tokens/s · $${num(cost,2)} / million tokens · ${num(step*1000,1)} ms busy step`,summary:'Toy assumptions: $3/device-hour, 16 GiB weights per step, 64 MiB KV reads per token, 1 TiB/s bandwidth, 2,000 token/s compute ceiling. Step time=max(memory bytes/bandwidth, batch/compute ceiling); throughput=batch/step×useful-time fraction. Excludes networking, prefill, overhead and latency constraints; this is not a price quote.'};
    }};

  M[36]={title:'The checker asks whether the proof term has its claimed type',
    controls:[select('term','Candidate proof','valid',[['valid','Pair the two projections'],['wrong','Use right projection twice'],['missing','Omit one projection']]),range('step','Checker step',0,3,3)],
    sources:[source('Lean: conjunction introduction and elimination','https://lean-lang.org/theorem_proving_in_lean4/propositions_and_proofs.html')],
    draw(c,s){
      const phase=Number(s.step),valid=s.term==='valid',missing=s.term==='missing',left='h.right',right=missing?'?':valid?'h.left':'h.right',rightType=missing?'unfilled':valid?'P':'Q',cx=c.W/2,col=(c.W-48)/2,checked=phase===3,accept=checked&&valid;let svg='';
      svg+=c.text(cx,28,'Given h : P ∧ Q, construct Q ∧ P','middle',{maxWidth:c.W-32});
      svg+=c.text(cx,72,'h : P ∧ Q','middle',{size:14});
      svg+=c.line(24,110,cx-10,110,'line',1.5)+c.line(cx+10,110,c.W-24,110,'line',1.5);
      svg+=c.text(24+col/2,141,left,'middle')+c.text(cx+12+col/2,141,right,'middle');
      svg+=c.text(24+col/2,168,phase>=1?'type Q':'type pending','middle',{muted:true})+c.text(cx+12+col/2,168,phase>=2?`type ${rightType}`:'type pending','middle',{muted:true});
      svg+=c.line(24,203,c.W-24,203,checked?(accept?'accent':'danger'):'line',2);
      svg+=c.text(cx,235,`⟨${left}, ${right}⟩`,'middle',{size:14});
      svg+=c.text(cx,266,checked?missing?'cannot synthesize incomplete term':`inferred type Q ∧ ${rightType}`:'build a pair term','middle',{maxWidth:c.W-32});
      svg+=c.rect(24,289,c.W-48,31,checked?(accept?'accent':'danger'):'surface',{opacity:.25});svg+=c.text(cx,310,checked?accept?'Accepted: Q ∧ P':'Rejected against goal Q ∧ P':'Checker has not finished','middle',{maxWidth:c.W-60});
      return{svg,readout:checked?accept?'The constructed term matches the proposition':missing?'Missing proof: the goal is not filled':'Type mismatch: Q ∧ Q is not Q ∧ P':`Step ${phase}/3 · ${['read assumption','check first projection','check second projection'][phase]}`,summary:'A small illustrative conjunction checker, not a running Lean kernel. h.right proves Q; h.left proves P; pairing them proves Q∧P. Swapping a projection or leaving a hole prevents this term from proving the requested proposition. Proof checking establishes the encoded claim, not that every real-world assumption is correct.'};
    }};
})();
