import {DEFAULT,sample} from './model.mjs';
import {pinParts,needle,knobPointer} from './scene.mjs';
const state={...DEFAULT};
const $=id=>document.getElementById(id);
const inputs=Object.fromEntries(['mode','time','velocity','diffusivity','selected'].map(key=>[key,$(key)]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let playing=false,raf=0,last=0,visible=true;
const pinPaths=new Map();
for(let j=0;j<16;j++)for(const name of ['stem-'+j,'cap-'+j])pinPaths.set(name,[...$(name).querySelectorAll('path')]);
function paintPin(part,lit) {
  const paths=pinPaths.get(part.name),data=[...part.svg.matchAll(/<path\b[^>]*\bd="([^"]*)"/g)].map(match=>match[1]);
  if(paths.length!==data.length)throw new Error('Pin topology changed');
  paths.forEach((path,i)=>path.setAttribute('d',data[i]));
  if(part.name.startsWith('cap-')){
    const solid=$(part.name).querySelector('.iso-solid');
    if(lit)solid.setAttribute('data-lit','');else solid.removeAttribute('data-lit');
    solid.querySelector('.iso-line:not(.iso-edge):not(.iso-crease)')?.setAttribute('data-tone',lit?'hi':'faint');
    solid.querySelector('.iso-edge').setAttribute('data-tone',lit?'hi':'mid');
  }
}
function render() {
  const m=sample(state);
  m.values.forEach((u,j)=>pinParts(j,u,j===state.selected).forEach(part=>paintPin(part,j===state.selected)));
  $('dial-needle').innerHTML=needle(m.selectedValue);
  $('knob-pointer-66').innerHTML=knobPointer(66,state.velocity+.25,.5);
  $('knob-pointer-108').innerHTML=knobPointer(108,state.diffusivity,.02);
  $('selected-value').textContent=m.selectedValue.toFixed(3);
  $('mean').textContent=m.mean.toFixed(3);$('rms').textContent=m.rms.toFixed(3);
  $('time-label').textContent=state.time.toFixed(2)+' s';
  $('velocity-label').textContent=state.mode==='diffusion'?'Inactive':(m.v>=0?'+':'')+m.v.toFixed(3)+' m/s';
  $('diffusivity-label').textContent=state.mode==='transport'?'Inactive':m.kappa.toFixed(4)+' m²/s';
  $('pin-label').textContent=String(state.selected+1).padStart(2,'0')+' / 16 · x = '+m.x.toFixed(3)+' m';
  $('takeaway').textContent=state.mode==='transport'?'The profile travels without losing its shape. Its mean and RMS variation stay constant.':state.mode==='diffusion'?'The profile smooths without travelling. Its mean stays constant while RMS variation falls.':'The profile travels while its peaks fade. Its mean stays constant.';
  inputs.velocity.disabled=state.mode==='diffusion';inputs.diffusivity.disabled=state.mode==='transport';
  $('apparatus').dataset.time=String(state.time);$('apparatus').dataset.selected=String(state.selected);
  $('apparatus').dataset.value=String(m.selectedValue);$('apparatus').dataset.rms=String(m.rms);
  $('apparatus').dataset.mode=state.mode;
  $('apparatus').querySelector('svg').setAttribute('aria-label',`Periodic field sampled by sixteen pins. Pin ${state.selected+1} reads ${m.selectedValue.toFixed(3)} at ${state.time.toFixed(2)} seconds.`);
}
function stop(message) {
  playing=false;cancelAnimationFrame(raf);raf=0;last=0;
  $('play').textContent='Play';$('phase').textContent=state.time>=8?'FINISHED':'PAUSED';
  if(message)$('status').textContent=message;
}
function tick(now) {
  if(!playing)return;
  if(document.hidden||!visible||reduced.matches){stop('Playback paused.');return;}
  const dt=last?Math.min(.08,(now-last)/1000):0;last=now;
  state.time=Math.min(8,state.time+dt);inputs.time.value=String(state.time);render();
  if(state.time>=8){stop('The eight-second demonstration is complete. Reset to replay.');return;}
  raf=requestAnimationFrame(tick);
}
for(const [key,input] of Object.entries(inputs)) input.addEventListener('input',()=>{
  stop();state[key]=key==='mode'?input.value:Number(input.value);render();$('phase').textContent=state.time>=8?'FINISHED':'PAUSED';
});
for(const input of Object.values(inputs))input.addEventListener('change',()=>{$('status').textContent=`${state.mode} at ${state.time.toFixed(2)} seconds. Selected pin ${state.selected+1} reads ${sample(state).selectedValue.toFixed(3)}.`;});
$('play').addEventListener('click',()=>{
  if(playing){stop('Playback paused.');return;}
  if(reduced.matches)return;
  if(state.time>=8){$('status').textContent='Reset or move the time slider to replay.';return;}
  playing=true;last=0;$('play').textContent='Pause';$('phase').textContent='RUNNING';$('status').textContent='Playback started.';raf=requestAnimationFrame(tick);
});
$('reset').addEventListener('click',()=>{stop();state.time=0;inputs.time.value='0';render();$('phase').textContent='READY';$('status').textContent='Time reset to zero.';});
$('theme').addEventListener('click',()=>{
  const light=document.body.dataset.theme!=='light';document.body.dataset.theme=light?'light':'dark';
  $('theme').textContent=light?'Dark':'Light';$('theme').setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');
});
function motionPreference(){if(reduced.matches)stop();$('play').disabled=reduced.matches;$('motion-note').hidden=!reduced.matches;}
reduced.addEventListener('change',motionPreference);motionPreference();
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop('Playback paused while this page is hidden.');});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&playing)stop('Playback paused while the instrument is offscreen.');},{threshold:.1});
observer.observe($('apparatus'));render();
