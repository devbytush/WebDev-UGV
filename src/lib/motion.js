/* eslint-disable */
// true while a programmatic scroll (nav link, route, skip button) is running, so scroll-driven
// scenes can hold still instead of spinning through everything the page flies past
export const glideState={on:false};
export const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
export const CALM=matchMedia('(prefers-reduced-motion:reduce)').matches,sst=x=>x*x*(3-2*x);
// eased anchor scrolling (replaces native smooth: capped duration, cancels on user input)
let gRaf=0,glideCancelInput;
let lenisInstance=null;
export const setLenisInstance=(instance)=>{lenisInstance=instance};
export const cancelGlide=()=>{
 cancelAnimationFrame(gRaf);
 gRaf=0;
 if(lenisInstance)lenisInstance.scrollTo(lenisInstance.scroll,{immediate:true,force:true});
 glideCancelInput?.();
 glideCancelInput=undefined;
 glideState.on=false;
};
export function glide(el,off){
 const y0=lenisInstance?lenisInstance.scroll:scrollY,max=document.documentElement.scrollHeight-innerHeight;
 const y1=Math.max(0,Math.min(max,typeof el==='number'?el:el.getBoundingClientRect().top+y0-(off==null?(el.id==='show'?84:76):off)));
 cancelGlide();
 if(CALM||Math.abs(y1-y0)<3){if(lenisInstance)lenisInstance.scrollTo(y1,{immediate:true});else scrollTo({top:y1,behavior:'instant'});return}
 const dur=Math.min(1500,Math.max(650,420+Math.abs(y1-y0)*.28)),t0=performance.now(),ev=['wheel','touchstart','keydown','pointerdown'];
 glideState.on=true;
 const stop=()=>{cancelAnimationFrame(gRaf);gRaf=0;glideState.on=false;ev.forEach(n=>removeEventListener(n,stopInput));if(glideCancelInput===stopInput)glideCancelInput=undefined};
 const stopInput=()=>stop();
 glideCancelInput=stopInput;
 ev.forEach(n=>addEventListener(n,stopInput,{passive:true}));
 if(lenisInstance){
  lenisInstance.scrollTo(y1,{duration:dur/1000,easing:k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,onComplete:()=>stop()});
  return;
 }
 (function step(now){const k=Math.min(1,(now-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo({top:y0+(y1-y0)*e,behavior:'instant'});if(k<1)gRaf=requestAnimationFrame(step);else stop()})(t0);
}
export function installAnchorGlide(){
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey)return;const h=a.getAttribute('href');if(h.length<2||h[1]==='/')return;const t=document.getElementById(h.slice(1));if(t){e.preventDefault();glide(t)}});
}
