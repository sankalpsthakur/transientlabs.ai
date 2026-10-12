(() => {
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const colors = {ink:'var(--foreground)',muted:'var(--muted-foreground)',line:'var(--border)',surface:'var(--muted)',paper:'var(--card)',accent:'var(--viz-series-1)',secondary:'var(--viz-series-2)',tertiary:'var(--viz-series-3)',danger:'var(--destructive)'};
  const color = tone => colors[tone] || tone;
  // Keep white labels readable on solid marks, while paths retain bright series colors.
  const solid = {accent:'#866024',secondary:'#246c60',tertiary:'#655388',danger:'#8e4a4a'};
  const fill = (tone,o={}) => solid[tone] && (o.opacity===undefined || o.opacity>=.6) ? solid[tone] : color(tone);
  const finite = value => {
    if (!Number.isFinite(+value)) throw new Error('Non-finite visual coordinate');
    return +value;
  };
  const options = value => {
    let attributes='';
    if(value.opacity!==undefined)attributes+=` opacity="${finite(value.opacity)}"`;
    if(value.stroke)attributes+=` stroke="${color(value.stroke)}" stroke-width="${finite(value.strokeWidth??1)}"`;
    if(value.dash)attributes+=` stroke-dasharray="${esc(value.dash)}"`;
    return attributes;
  };
  window.DeepEndHelpers = (W,H=340) => {
    const path=(d,tone='line',width=1,o={})=>`<path d="${esc(d)}" fill="${o.fill?color(o.fill):'none'}" stroke="${color(tone)}" stroke-width="${finite(width)}" stroke-linecap="round" stroke-linejoin="round"${options({...o,stroke:undefined})}/>`;
    const line=(x1,y1,x2,y2,tone='line',width=1,o={})=>path(`M${finite(x1)} ${finite(y1)}L${finite(x2)} ${finite(y2)}`,tone,width,o);
    const rect=(x,y,w,h,tone='surface',o={})=>`<rect x="${finite(x)}" y="${finite(y)}" width="${Math.max(0,finite(w))}" height="${Math.max(0,finite(h))}" rx="${finite(o.radius??3)}" fill="${fill(tone,o)}"${options(o)}/>`;
    const circle=(x,y,r,tone='ink',o={})=>`<circle cx="${finite(x)}" cy="${finite(y)}" r="${Math.max(0,finite(r))}" fill="${r>=10?fill(tone,o):color(tone)}"${options(o)}/>`;
    const poly=(points,tone='surface',o={})=>`<polygon points="${points.map(p=>p.map(finite).join(',')).join(' ')}" fill="${color(tone)}"${options(o)}/>`;
    const text=(x,y,label,anchor='start',o={})=>{
      const size=o.size===14?14:12;
      const available=anchor==='middle'?Math.min(x-12,W-x-12)*2:anchor==='end'?x-12:W-x-12;
      const limit=Math.max(35,Math.min(o.maxWidth??available,available));
      const maxChars=Math.max(5,Math.floor(limit/(size*.54)));
      const words=String(label).split(/\s+/),lines=[];let current='';
      for(const word of words){if(current&&(current+' '+word).length>maxChars){lines.push(current);current=word;}else current+=(current?' ':'')+word;}if(current)lines.push(current);
      const baseline=Math.max(size+3,Math.min(y,H-5-(lines.length-1)*16));
      return `<text x="${finite(x)}" y="${finite(baseline)}" text-anchor="${esc(anchor)}" fill="${color(o.muted?'muted':'ink')}" font-size="${size}"${options(o)}>${lines.map((l,i)=>`<tspan x="${finite(x)}" dy="${i?16:0}">${esc(l)}</tspan>`).join('')}</text>`;
    };
    const arrow=(x1,y1,x2,y2,tone='accent',width=1.5,o={})=>{
      const angle=Math.atan2(y2-y1,x2-x1),a=7;
      return line(x1,y1,x2,y2,tone,width,o)+path(`M${x2-a*Math.cos(angle-.45)} ${y2-a*Math.sin(angle-.45)}L${x2} ${y2}L${x2-a*Math.cos(angle+.45)} ${y2-a*Math.sin(angle+.45)}`,tone,width,o);
    };
    return {W,H,esc,color,path,line,rect,circle,poly,text,arrow,clamp:(v,min,max)=>Math.max(min,Math.min(max,v))};
  };
})();
