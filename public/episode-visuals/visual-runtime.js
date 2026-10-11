(() => {
  const root=document.getElementById('deep-end-model');
  const model=window.DeepEndModels[Number(root.dataset.episode)];
  if(!model)throw new Error('Missing episode visual: '+root.dataset.episode);
  const title=root.querySelector('[data-title]'),controls=root.querySelector('[data-controls]'),scene=root.querySelector('svg'),readout=root.querySelector('[data-readout]'),summary=root.querySelector('[data-summary]'),sources=root.querySelector('[data-sources]');
  title.textContent=model.title;
  const state={},outputs={};let timer=0,step=1,playing=false,announceTimer=0;
  const still=matchMedia('(prefers-reduced-motion: reduce)');
  const live=document.createElement('p');live.className='sr-only';live.setAttribute('aria-live','polite');root.append(live);
  const stop=()=>{clearTimeout(timer);playing=false;if(tour)tour.textContent='Play sequence';};
  let tour=null;
  for(const control of model.controls||[]){
    state[control.key]=control.value;
    const label=document.createElement('label');label.className='control';
    const heading=document.createElement('span');heading.className='control-heading';heading.append(document.createTextNode(control.label));
    let input;
    if(control.type==='select'){
      input=document.createElement('select');
      for(const choice of control.options){const option=document.createElement('option');option.value=choice.value;option.textContent=choice.label;input.append(option);}
      input.value=control.value;
    }else{
      const output=document.createElement('output');outputs[control.key]=output;heading.append(output);
      input=document.createElement('input');input.type='range';input.min=control.min;input.max=control.max;input.step=control.step??1;input.value=control.value;
    }
    input.setAttribute('aria-label',control.label);input.dataset.control=control.key;
    input.addEventListener('input',()=>{stop();state[control.key]=control.type==='select'?input.value:Number(input.value);draw();});
    label.append(heading,input);controls.append(label);
  }
  const first=(model.controls||[]).find(c=>c.type!=='select');
  if(first){
    tour=document.createElement('button');tour.type='button';tour.className='tour';tour.textContent='Play sequence';tour.disabled=still.matches;
    tour.title=still.matches?'Motion is disabled by your reduced-motion preference':'Step through the first control at a calm pace';
    tour.addEventListener('click',()=>{if(playing){stop();return;}playing=true;tour.textContent='Pause sequence';tick();});controls.append(tour);
    function tick(){if(!playing||document.hidden)return;const delta=(first.step??1)*Math.max(1,Math.round((first.max-first.min)/(first.step??1)/16));
      let next=Number(state[first.key])+delta*step;if(next>first.max||next<first.min){step*=-1;next=Math.max(first.min,Math.min(first.max,Number(state[first.key])+delta*step));}
      state[first.key]=Number(next.toFixed(6));root.querySelector(`[data-control="${first.key}"]`).value=state[first.key];draw();timer=setTimeout(tick,900);
    }
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(root);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    still.addEventListener('change',()=>{stop();tour.disabled=still.matches;});
  }
  for(const source of model.sources||[]){const link=document.createElement('a');link.href=source.url;link.textContent=source.label;link.target='_blank';link.rel='noopener noreferrer';sources.append(link);}
  function notify(){parent.postMessage({type:'deep-end-visual-height',episode:Number(root.dataset.episode),height:Math.ceil(document.body.getBoundingClientRect().height)},'*');}
  function draw(){
    const W=Math.max(280,Math.round(scene.getBoundingClientRect().width));
    const rendered=model.draw(window.DeepEndHelpers(W),state);
    scene.setAttribute('viewBox',`0 0 ${W} 340`);scene.innerHTML=rendered.svg;
    scene.setAttribute('aria-label',rendered.summary);readout.textContent=rendered.readout;summary.textContent=rendered.summary;
    clearTimeout(announceTimer);announceTimer=setTimeout(()=>{live.textContent=rendered.readout;},700);
    for(const control of model.controls||[]){if(outputs[control.key])outputs[control.key].textContent=String(state[control.key])+(control.unit?' '+control.unit:'');}
    root.dataset.state=JSON.stringify(state);notify();
  }
  new ResizeObserver(draw).observe(root);new ResizeObserver(notify).observe(document.body);draw();
  window.DeepEndVisual={state:()=>({...state}),draw,episode:Number(root.dataset.episode)};
})();
