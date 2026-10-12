/* Source-owned isometric apparatus, built with Anatomy (MIT, Ryan). */
(() => {
  const k=window.Anatomy;
  const height={electrolyser:76,ammonia:116,solar:45,distillation:160,turret:76,handover:78,layout:55,firewater:65,flare:166,slugcatcher:65,separator:88,dehydration:160,knockout:100,compressor:80,barriers:130,hydrocyclone:150,airreceiver:146,deaerator:146,intake:118,diesel:80,effluent:70,lng:160};
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  function scene(kind,W,s,projection=null){
    // Every corner matters: opposite corners alone miss the widest projected diagonal.
    const bounds=[];
    for(const x of [-140,140])for(const y of [-100,100])for(const z of [-14,height[kind]])bounds.push([x,y,z]);
    const P=projection??k.fitProjection(bounds,W,340,{pad:24,azimuth:42,elevation:32});
    const items=[];let count=0,solidCount=0,anchor=null;
    const put=(svg,at,shape,points=[at])=>{
      const material=shape&&!shape.fluid;
      const name=material?`${kind}.solid.${++solidCount}`:`${kind}.mark.${++count}`;
      const baseKey=k.depthOf(at,P);
      items.push({svg,at,shape,points,key:baseKey,baseKey,name,anchor});
      if(material)anchor=name;
    };
    function slab(x,y,w,d,z,h,tone='mid',lit=false,fluid=false){
      const plan={x,y,w,d,r:Math.min(1.5,w/5,d/5)};
      put(k.solidSvg(k.slabOf(plan,z,h,P,4,.45),{tone,lit}),[x+w/2,y+d/2,z+h/2],{type:'slab',plan,z,h,fluid});
    }
    function round(x,y,r,z,h,tone='mid',lit=false){
      put(k.solidSvg(k.cylinder(x,y,r,z,h,P,32,.35),{tone,lit}),[x,y,z+h/2],{type:'cylinder',x,y,r,z,h});
    }
    function stroke(points,tone='mid',free=false){
      const at=points.reduce((a,p)=>a.map((n,i)=>n+p[i]/points.length),[0,0,0]);
      put(k.lineSvg(k.pathOf(points.map(p=>k.iso(p,P))),{tone,free}),at,null,points);
    }
    function mark(x,y,z,r=1,tone='hi'){
      put(k.dotsSvg([k.iso([x,y,z],P)],{size:r,tone}),[x,y,z+.2],null);
    }
    function bolts(x,y,w,d,z){for(const [bx,by] of [[x+3,y+3],[x+w-3,y+3],[x+3,y+d-3],[x+w-3,y+d-3]])round(bx,by,1,z,.9,'hi');}
    function pad(x,y,w,d,h=4){slab(x,y,w,d,8,h,'lo');bolts(x,y,w,d,8+h);}
    function frame(x,y,w,d,z,h){
      slab(x,y,w,2,z,h);slab(x,y+d-2,w,2,z,h);slab(x,y+2,2,d-4,z,h);slab(x+w-2,y+2,2,d-4,z,h);
    }
    function gauge(x,y,z,value){
      round(x,y,10,z,3,'hi');round(x,y,8,z+3,.5,'mid');
      for(let i=0;i<20;i++){const a=i*Math.PI/10;stroke([[x+Math.cos(a)*6,y+Math.sin(a)*6,z+3.6],[x+Math.cos(a)*7.5,y+Math.sin(a)*7.5,z+3.6]],'lo',true);}
      const a=(-.75+clamp(value)*1.5)*Math.PI;
      stroke([[x,y,z+3.7],[x+Math.cos(a)*6,y+Math.sin(a)*6,z+3.7]],'lit','end');mark(x,y,z+3.7,.7);
    }
    function vessel(x,y,w,d,z,h,level=.4){
      // Open cutaway: the omitted front shell is explicitly described beside the figure.
      slab(x,y,w,d,z,3,'mid');slab(x,y,w,3,z+3,h-3,'mid');slab(x,y+3,3,d-3,z+3,h-3,'mid');slab(x+w-3,y+3,3,d-3,z+3,h-3,'mid');
      if(level>0){
        slab(x+3,y+3,w-6,d-6,z+3,Math.max(.5,(h-6)*clamp(level)),'hi',true,true);
        // Fluid inventory is a teaching layer, never a rigid support.
        items[items.length-1].fluid=true;
      }
      // The front rim is removed with the front shell in this cutaway.
      slab(x,y,w,2,z+h,1.5);slab(x,y+2,2,d-2,z+h,1.5);slab(x+w-2,y+2,2,d-2,z+h,1.5);
    }
    function tower(x,y,r,z,h,trays,litCount=0){
      pad(x-r-5,y-r-5,2*r+10,2*r+10,z-8);
      // Split shell: back support spine and exposed real trays on a central shaft.
      slab(x-r-5,y-r,4,r*2,z,h,'mid');
      for(let i=0;i<trays;i++){
        const tz=z+i*(h-6)/trays,next=i===trays-1?z+h-3:z+(i+1)*(h-6)/trays;
        round(x,y,r,tz,2,'hi',i<litCount);
        round(x,y,2,tz+2,next-tz-2,'mid');
        round(x-r+2,y,1.2,tz+2,next-tz-2,'mid');
      }
      round(x,y,r+1,z+h-3,3,'hi');
      for(let i=0;i<12;i++){const a=i*Math.PI/6;mark(x+(r-2)*Math.cos(a),y+(r-2)*Math.sin(a),z+h,.6);}
    }
    const activity=clamp(s.activity??.5);
    // Mounting feet, grounded bed, fasteners and a calibrated ruler belong to every bench apparatus.
    for(const [x,y]of[[-110,-50],[110,-50],[-110,50],[110,50]]){round(x,y,6,-12,3,'lo');round(x,y,4,-9,9,'mid');}
    slab(-125,-65,250,130,0,8,'lo');bolts(-125,-65,250,130,8);
    slab(-100,52,180,5,8,.8,'lo');
    for(let x=-96,i=0;x<=76;x+=4,i++)stroke([[x,52,8.8],[x,52+(i%5===0?4:2),8.8]],i%5===0?'mid':'lo','end');
    slab(101,48,18,12,8,2,'mid');bolts(101,48,18,12,10);round(110,54,4,10,3,'hi');
    put(k.lineSvg(k.knurl(110,54,4,10,13,16,P),{tone:'lo'}),[110,54,11.5],null);
    switch(kind){
      case 'electrolyser': {
        pad(-76,-35,138,66);slab(-72,-30,10,56,12,58,'hi');slab(47,-30,10,56,12,58,'hi');
        for(let i=0;i<16;i++){slab(-60+i*6.5,-25,3,46,12,52,i===8?'hi':'mid',i===8);for(let j=0;j<5;j++)mark(-58+i*6.5,-20+j*8,63,.5);}
        for(const y of [-28,24])for(const z of [19,63])slab(-62,y,109,2,z,2,'mid');
        for(let i=0;i<Math.round(activity*14);i++){mark(-75,-20+(i%7)*6,73+(i>6?6:0),1.5,'hi');mark(52,-20+(i%7)*6,73+(i>6?6:0),1,'mid');}break;
      }
      case 'ammonia': {
        tower(-45,-10,19,14,92,5,Math.ceil(activity*5));tower(43,-10,14,14,58,4,2);
        for(let i=0;i<8;i++)for(const y of [-40,25]){
          slab(-24+i*9,y,8,4,8,8,'lo');
          slab(-24+i*9,y,8,4,16,4,'mid',y<0?i<(s.passes??4):i>7-(s.passes??4));
        }
        gauge(85,-18,8,activity);break;
      }
      case 'solar': {
        pad(-95,-43,182,82);frame(-91,-39,174,74,12,6);
        for(let i=0;i<6;i++)for(let j=0;j<5;j++){const x=-86+i*27,y=-34+j*13;slab(x,y,25,11,12,2,'hi',activity>.2);for(let f=0;f<4;f++)stroke([[x+f*6+2,y,14],[x+f*6+2,y+11,14]],'lo');}
        for(let i=0;i<Math.round((s.loss??0)*12);i++)mark(-75+i*13,-3,17,1.8,'mid');break;
      }
      case 'distillation':tower(-10,-6,25,14,140,12,Math.round((s.trays??4)*1.5));gauge(64,-16,8,activity);break;
      case 'turret': {
        round(-20,-5,34,8,5);for(let i=0;i<24;i++){const a=i*Math.PI/12;round(-20+30*Math.cos(a),-5+30*Math.sin(a),1.6,13,2,'hi');}
        round(-20,-5,16,13,12,'hi');for(let i=0;i<5;i++)round(-20,-5,11,33+i*6,6,'mid',i===2);
        const a=(s.angle??0)*Math.PI/180,pts=[[-67,-20],[67,-20],[82,0],[67,20],[-67,20],[-82,0]].map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a)-20,x*Math.sin(a)+y*Math.cos(a)-5]);
        put(k.solidSvg(k.extrude(pts,25,8,P),{tone:'hi'}),[-20,-5,29],{type:'extruded',pts,z:25,h:8});
        for(let i=0;i<9;i++){const x=-65+i*11,y=15;const xx=x*Math.cos(a)-y*Math.sin(a)-20,yy=x*Math.sin(a)+y*Math.cos(a)-5;round(xx,yy,2,33,2,'mid');}break;
      }
      case 'handover': {
        pad(-84,-31,166,66);slab(-79,-26,156,56,12,4,'mid');
        for(let i=0;i<5;i++){const x=-71+i*30;slab(x,-19,24,42,16,3,'hi',i<(s.checked??3));for(let j=0;j<5;j++)stroke([[x+3,-13+j*6,19],[x+21,-13+j*6,19]],'lo',true);round(x+12,27,2,16,i<(s.checked??3)?18:28,'hi');}
        slab(-76,24,146,7,(s.checked??3)===5?34:44,4,'mid',(s.checked??3)===5);break;
      }
      case 'layout': {
        for(const [x,y,w,d,h] of [[-90,-35,45,30,18],[5,-35,48,34,32],[-30,10,26,28,22],[62,8,35,25,16]]){pad(x-5,y-5,w+10,d+10,2);slab(x,y,w,d,10,h);for(let i=0;i<4;i++)stroke([[x+3+i*(w-6)/4,y+d,14],[x+3+i*(w-6)/4,y+d,21]],'lo',true);}
        round(-8,-52,3,8,32);const a=(s.angle??0)*Math.PI/180;
        mark(-8,-52,40,1,'hi');stroke([[-8,-52,40],[-8+28*Math.cos(a),-52+28*Math.sin(a),40]],'lit');mark(-8+28*Math.cos(a),-52+28*Math.sin(a),40,2,'hi');
        for(let i=0;i<12;i++)mark(20+8*i*Math.cos(a),-12+8*i*Math.sin(a),10,1.4,'hi');break;
      }
      case 'firewater': {
        frame(-88,-41,160,78,8,5);for(let i=0;i<12;i++){slab(-82+i*12,-41,10,2,13,1,'hi',true);slab(-82+i*12,35,10,2,13,1,'hi',(s.branches??2)===2);}
        for(const x of [-104,100]){round(x,-4,8,8,6);round(x,-4,3,14,7,'hi');gauge(x,14,8,activity);}break;
      }
      case 'flare': {
        pad(-25,-25,50,50);
        for(let i=0;i<13;i++){round(0,0,8,12+i*10,1,'lo');round(0,0,7,13+i*10,i===12?15:9);}
        for(let i=0;i<12;i++){slab(9,-5,2,10,12+i*10,2,'mid');slab(11,-5,1,1,12+i*10,10,'mid');slab(11,4,1,1,12+i*10,10,'mid');}
        round(0,0,11,148,5,'hi',true);for(let i=0;i<(s.trains??2);i++){pad(-99+i*25,-15,19,26);round(-89+i*25,-2,5,12,14);stroke([[-89+i*25,3,25],[-89+i*25,28+i*3,25],[-7,28+i*3,25],[-7,0,25]],'lit',true);}
        for(let i=0;i<10;i++)mark(-4+(i%3)*4,-4+(i%2)*8,155+activity*(i+1)*1.2,1.2,'hi');break;
      }
      case 'slugcatcher': {
        for(let i=0;i<7;i++){const y=-44+i*12;pad(-96,y-1,180,10,2);vessel(-91,y,170,8,10,16,activity);}
        slab(-100,-44,4,80,8,12,'hi');slab(84,-44,4,80,8,12,'hi');gauge(104,-16,8,activity);break;
      }
      case 'separator': {
        pad(-89,-34,176,64);vessel(-84,-29,166,54,12,62,.35);slab(40,-26,3,47,15,24,'hi');
        for(let i=0;i<24;i++){const x=-68+(i%8)*13,y=-18+Math.floor(i/8)*12,z=60-activity*(18+Math.floor(i/8)*6);mark(x,y,z,1+(s.diameter??40)/60,'hi');}
        slab(74,-26,5,2,60,3,'mid');slab(74,-24,2,47,60,3,'mid');
        for(let i=0;i<9;i++)slab(58,-24+i*5,16,2,60,3,'mid');break;
      }
      case 'dehydration':tower(-8,-5,25,14,138,12,Math.round(activity*12));gauge(66,-13,8,activity);break;
      case 'knockout': {
        pad(-80,-30,126,64);vessel(-76,-26,118,56,12,70,activity);
        slab(-70,-23,96,3,70,3,'mid');for(let i=0;i<9;i++)slab(-70+i*11,-20,2,40,70,3,'mid');pad(63,-18,35,36);round(81,0,13,12,12,'hi',!!s.recovery);gauge(80,0,24,s.recovery?1:0);
        // Two separate, seated vapour routes make the selector visible in the apparatus.
        slab(42,-2,20,4,25,4,'hi',!!s.recovery);slab(62,-2,4,4,14,15,'hi',!!s.recovery);slab(66,-2,2,4,14,4,'hi',!!s.recovery);
        slab(42,15,56,4,25,4,'hi',!s.recovery);slab(98,15,4,4,8,21,'mid',!s.recovery);round(100,17,5,29,3,'hi',!s.recovery);break;
      }
      case 'compressor': {
        pad(-51,-40,106,80);round(0,0,34,12,12,'mid');round(0,0,29,24,2,'hi');round(0,0,7,26,15,'hi');
        for(let i=0;i<16;i++){const a=i*Math.PI/8,pts=[[9,-1],[27,-1],[27,2],[9,2]].map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]);put(k.solidSvg(k.extrude(pts,26,6,P),{tone:'hi',lit:i<Math.round(activity*16)}),[18*Math.cos(a),18*Math.sin(a),29],{type:'extruded',pts,z:26,h:6});}
        for(let i=0;i<16;i++){const a=i*Math.PI/8;round(32*Math.cos(a),32*Math.sin(a),1.3,24,2,'mid');}gauge(80,-8,8,activity);break;
      }
      case 'barriers': {
        for(let i=0;i<2;i++){
          for(const x of [-36,8])for(const y of [-24,20])slab(x,y,4,4,i===0?8:52,i===0?40:36,'mid');
          slab(-36,-24,48,48,48+i*40,4,'hi',i<(s.barriers??2));slab(12,-8,24,12,48+i*40,5,'mid');round(31,-2,6,53+i*40,4,'hi');
        }
        if(s.shared)slab(36,-5,5,6,48,45,'hi',true);gauge(79,-7,8,(s.barriers??2)/2);break;
      }
      case 'hydrocyclone': {
        pad(-39,-31,72,66,6);for(let i=0;i<8;i++)round(0,0,7+i*2,14+i*12,12,'mid',i<Math.round(activity*8));
        for(let i=0;i<6;i++)round(0,0,24,110+i*3,3,'hi');round(0,0,4,128,10,'hi',true);
        for(let i=0;i<24;i++){const a=i*Math.PI/3;mark((12+i/3)*Math.cos(a),(12+i/3)*Math.sin(a),25+i*4,1,'hi');}gauge(70,-10,8,activity);break;
      }
      case 'airreceiver': {
        tower(-22,0,23,14,112,10,Math.round(activity*10));for(let i=0;i<3;i++){pad(28+i*22,-13,18,27);round(37+i*22,0,6,12,28,'mid');round(37+i*22,0,7,40,2,'hi');}gauge(65,29,8,activity);break;
      }
      case 'deaerator': {
        tower(-10,-5,26,14,112,10,Math.round(activity*10));for(let i=0;i<18;i++){mark(-21+(i%3)*10,-10+(i%2)*10,25+i*5,1.2,i<activity*18?'lo':'hi');}gauge(75,-12,8,activity);break;
      }
      case 'intake': {
        pad(-89,-35,140,69);vessel(-86,-32,134,63,12,34,.65);
        slab(-42,-15,4,51,15,79,'hi');slab(38,-15,4,51,15,79,'hi');
        for(let i=0;i<10;i++){slab(-38,-10,76,2,24+i*6,1,'mid');for(let j=0;j<8;j++)mark(-35+j*10,-9,25+i*6,.8,(i*8+j)<activity*80?'hi':'lo');}slab(-38,-15,76,4,88,3,'mid');round(0,-9,10,91,6,'mid');gauge(80,0,8,activity);break;
      }
      case 'diesel': {
        pad(-91,-33,178,65);vessel(-87,-29,80,55,12,50,activity);vessel(27,-23,52,46,12,37,activity);
        for(let i=0;i<3;i++){round(2,-13+i*16,5,12,19,'mid');round(2,-13+i*16,6,31,2,'hi');}gauge(98,0,8,activity);break;
      }
      case 'effluent': {
        pad(-93,-40,172,80);vessel(-89,-36,164,72,12,36,.7);slab(-10,-33,3,65,15,25,'mid');
        for(let i=0;i<24;i++){const x=-76+(i%8)*17+(i%8>=4?12:0),y=-22+Math.floor(i/8)*18;round(x,y,2,15,1,'lo');mark(x,y,32,1.3,'hi');if(i>activity*24)mark(x+2,y-3,40,1.1,'mid');}gauge(98,0,8,activity);break;
      }
      case 'lng': {
        pad(-37,-30,68,64);round(0,0,21,12,3,'mid');slab(-28,-22,4,44,12,131.8,'mid');
        for(let i=0;i<24;i++){round(0,0,21,15+i*5.2,1.3,'mid',i<activity*24);round(0,0,17,16.3+i*5.2,3.9,'hi',i<activity*24);}
        round(0,0,24,139.8,4,'hi');for(let i=0;i<12;i++){const a=i*Math.PI/6;round(22*Math.cos(a),22*Math.sin(a),.9,143.8,1,'hi');}
        gauge(72,-12,8,activity);break;
      }
      default:throw Error('Unknown Anatomy mechanism '+kind);
    }
    if(!projection){
      const extremes=items.flatMap(item=>{
        const q=item.shape;
        if(!q)return item.points;
        const footprint=q.type==='slab'?[[q.plan.x,q.plan.y],[q.plan.x+q.plan.w,q.plan.y],[q.plan.x,q.plan.y+q.plan.d],[q.plan.x+q.plan.w,q.plan.y+q.plan.d]]:q.type==='cylinder'?[[q.x-q.r,q.y-q.r],[q.x+q.r,q.y-q.r],[q.x-q.r,q.y+q.r],[q.x+q.r,q.y+q.r]]:q.pts;
        return footprint.flatMap(([x,y])=>[[x,y,q.z],[x,y,q.z+q.h]]);
      });
      return scene(kind,W,s,k.fitProjection(extremes,W,340,{pad:24,azimuth:42,elevation:32}));
    }
    const variant=kind==='turret'?String(s.angle??0):kind==='handover'?String(s.checked??3):kind==='flare'?String(s.trains??2):'default';
    const order=window.DeepEndDepthOrder?.[kind]?.[variant]??window.DeepEndDepthOrder?.[kind]?.default;
    if(order){
      for(const item of items)if(item.shape&&!item.shape.fluid&&order[item.name]!==undefined)item.key=order[item.name];
      const solids=new Map(items.filter(i=>i.shape&&!i.shape.fluid).map(i=>[i.name,i]));
      for(const item of items)if(!item.shape||item.shape.fluid){const held=solids.get(item.anchor);if(held)item.key+=held.key-held.baseKey;}
    }
    items.sort((a,b)=>a.key-b.key);
    const svg=items.map(i=>i.svg).join('');
    return {svg,items,P,parts:items.filter(i=>i.shape).length};
  }
  window.DeepEndMachines={draw:(kind,c,s)=>scene(kind,c.W,s).svg,inspect:(kind,W,s)=>scene(kind,W,s)};
})();
