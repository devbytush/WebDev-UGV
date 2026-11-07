/* eslint-disable */

export default function research() {
  if (window.__eng_research) return;
  window.__eng_research = 1;
(function(){
const cards=[...document.querySelectorAll('.rs-card')];if(!cards.length)return;
const still=matchMedia('(prefers-reduced-motion:reduce)').matches,AC='#38bdf8',FG='rgba(241,243,248,.6)',DIM='rgba(241,243,248,.18)';
const dot=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
let sd=7;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
const scenes=[
 // SLAM: the scan radius reveals fixed points, so the map builds as you move
 (()=>{const P=Array.from({length:130},()=>({a:rnd()*6.283,k:.26+rnd()*.2,on:0}));
  return(c,w,h,t,p)=>{const x=p?p.x:w/2+Math.cos(t/900)*w*.3,y=p?p.y:h/2+Math.sin(t/700)*h*.3;
   P.forEach(q=>{const px=w/2+Math.cos(q.a)*w*q.k*1.7,py=h/2+Math.sin(q.a)*h*q.k*1.8;if(Math.hypot(px-x,py-y)<65)q.on=1;c.fillStyle=q.on?AC:DIM;c.fillRect(px-1.5,py-1.5,3,3)});
   c.strokeStyle=DIM;c.beginPath();c.arc(x,y,65,0,7);c.stroke();dot(c,x,y,4,'#fff')}})(),
 // EKF: three noisy sensors, fused by inverse variance
 (c,w,h,t,p)=>{const tx=p?p.x:w/2+Math.cos(t/1100)*w*.3,ty=p?p.y:h/2+Math.sin(t/800)*h*.28;
  const S=[9,16,5].map((s,i)=>[tx+Math.sin(t/130+i*2.1)*s*2.2,ty+Math.cos(t/110+i*3.3)*s*2.2,s]);
  let W=0,ex=0,ey=0;S.forEach(([x,y,s])=>{const k=1/(s*s);W+=k;ex+=x*k;ey+=y*k});ex/=W;ey/=W;
  S.forEach(([x,y])=>{c.strokeStyle=DIM;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();dot(c,x,y,3,FG)});
  c.strokeStyle=AC;c.lineWidth=2;c.beginPath();c.arc(ex,ey,9,0,7);c.stroke();c.lineWidth=1},
 // Perception: lanes scroll, obstacles get boxed once in range
 (()=>{const O=[[.3,0,30,22],[.62,-.45,36,26],[.45,-.9,26,26]];
  return(c,w,h,t,p)=>{c.strokeStyle=DIM;c.setLineDash([10,12]);c.lineDashOffset=-(t/25)%22;[.2,.5,.8].forEach(f=>{c.beginPath();c.moveTo(w*f,0);c.lineTo(w*f,h);c.stroke()});c.setLineDash([]);
   O.forEach(([f,o,bw,bh])=>{const y=(((t/5000+o)%1.3)+1.3)%1.3*h-bh,x=w*f-bw/2;c.fillStyle=DIM;c.fillRect(x,y,bw,bh);
    if(y>h*.2&&y<h*.85){c.strokeStyle=AC;c.lineWidth=1.5;c.strokeRect(x-4,y-4,bw+8,bh+8);c.lineWidth=1}});
   const ex=p?p.x:w/2+Math.sin(t/1500)*w*.25;c.fillStyle='#fff';c.beginPath();c.moveTo(ex,h-24);c.lineTo(ex+9,h-6);c.lineTo(ex-9,h-6);c.fill()}})(),
 // Nav2: path bends around cost-map obstacles toward the goal
 (()=>{const B=[[.35,.35,16],[.5,.64,20],[.68,.38,15]];
  return(c,w,h,t,p)=>{const g=p||{x:w*.88,y:h/2+Math.sin(t/900)*h*.3},st=w/80;let x=w*.1,y=h/2;
   B.forEach(([f,q,r])=>dot(c,w*f,h*q,r,DIM));c.strokeStyle=AC;c.lineWidth=2;c.beginPath();c.moveTo(x,y);
   for(let i=0;i<110;i++){let dx=g.x-x,dy=g.y-y;const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    B.forEach(([f,q,r])=>{const ox=x-w*f,oy=y-h*q,od=Math.hypot(ox,oy)||1,R=r+34;if(od<R){const k=(R-od)/R*2.4;dx+=ox/od*k;dy+=oy/od*k}});
    const m=Math.hypot(dx,dy)||1,s=Math.min(d,st);x+=dx/m*s;y+=dy/m*s;c.lineTo(x,y);if(d<6)break}
   c.stroke();c.lineWidth=1;dot(c,w*.1,h/2,4,'#fff');c.strokeStyle='#fff';c.beginPath();c.arc(g.x,g.y,7,0,7);c.stroke()}})()
];
cards.forEach((card,i)=>{const cv=card.querySelector('canvas'),c=cv.getContext('2d'),draw=scenes[i%scenes.length];let w=0,h=0,p=null,vis=false,raf=0;
 const size=()=>{const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;w=r.width;h=r.height;cv.width=w*d;cv.height=h*d;c.setTransform(d,0,0,d,0,0)};
 const tick=t=>{c.clearRect(0,0,w,h);draw(c,w,h,t,p);raf=vis&&!still?requestAnimationFrame(tick):0};
 const kick=()=>{if(!raf)raf=requestAnimationFrame(tick)};
 const aim=e=>{const r=cv.getBoundingClientRect();p={x:e.clientX-r.left,y:e.clientY-r.top};if(still)kick()};
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){size();kick()}}).observe(cv);
 cv.addEventListener('pointermove',aim);cv.addEventListener('pointerdown',aim);cv.addEventListener('pointerleave',()=>{p=null});
 addEventListener('resize',()=>{size();if(still)kick()});
 const b=card.querySelector('.rs-more');b.addEventListener('click',()=>{const o=card.classList.toggle('open');b.setAttribute('aria-expanded',o);b.querySelector('i').textContent=o?'−':'+'})});
})();
}
