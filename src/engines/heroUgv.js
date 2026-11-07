/* eslint-disable */
import THREE from '../lib/threeLegacy';

export default function heroUgv() {
  if (window.__eng_heroUgv) return;
  window.__eng_heroUgv = 1;
(function(){
const root=document.getElementById('heroUgv'),cv=document.getElementById('ugvCv'),tagBox=document.getElementById('ugvTags');
if(!root)return;
const T=THREE,calm=matchMedia('(prefers-reduced-motion:reduce)').matches,cl=(v,a,b)=>Math.min(b,Math.max(a,v)),hero=root.closest('.hero');
const R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new T.Scene(),C=new T.PerspectiveCamera(32,1,.1,80);
S.add(new T.AmbientLight(0xffffff,.6));
const kl=new T.DirectionalLight(0xffffff,1.1);kl.position.set(4,8,5);S.add(kl);
const rl=new T.DirectionalLight(0x6ee7b7,.55);rl.position.set(-6,3,-5);S.add(rl);
const mat=(c,r,m,e)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,emissive:e||0});
const mB=mat(0x2c323c,.45,.6),mA=mat(0xb9bcc0,.35,.75),mT=mat(0x15171b,.9,.1),mAccent=mat(0x34d399,.4,.3,0x063226),mH=new T.MeshBasicMaterial({color:0xe5f4ff});
const ed=new T.LineBasicMaterial({color:0x6ee7b7,transparent:true,opacity:.5});
const car=new T.Group();S.add(car);const parts=[];
const bx=(w,h,d)=>new T.BoxGeometry(w,h,d),cy=(r,h,s)=>new T.CylinderGeometry(r,r,h,s||24);
function add(p,geo,x,y,z,m,o){o=o||{};const g=new T.Group(),me=new T.Mesh(geo,m);g.position.set(x,y,z);if(o.rz)me.rotation.z=o.rz;g.add(me);
 if(!o.n){const l=new T.LineSegments(new T.EdgesGeometry(geo,30),ed);l.rotation.copy(me.rotation);g.add(l)}
 p.add(g);if(o.x){g.userData.b=g.position.clone();g.userData.d=new T.Vector3(o.x[0],o.x[1],o.x[2]);parts.push(g)}return g}
// chassis, T-slot rails, deck
add(car,bx(1.5,.36,2.4),0,.68,0,mB,{x:[0,-.5,0]});
[-1,1].forEach(s=>{add(car,bx(.06,.06,2.5),s*.72,.93,0,mA,{x:[s*.3,.35,0]});add(car,bx(1.5,.06,.06),0,.93,s*1.1,mA,{x:[0,.35,s*.3]})});
add(car,bx(1.36,.05,2.12),0,.99,0,mA,{x:[0,.7,0]});
// electronics enclosure + accent, bumper, headlights
add(car,bx(.95,.42,.9),0,1.23,-.2,mB,{x:[0,1.3,0]});add(car,bx(.97,.07,.92),0,1.46,-.2,mAccent,{x:[0,1.55,0]});
add(car,bx(1.3,.16,.1),0,.62,1.27,mAccent,{x:[0,0,.7]});
[-.45,.45].forEach(x=>add(car,bx(.3,.08,.04),x,.8,1.22,mH,{n:1,x:[0,0,.7]}));
// LiDAR on a mast (head spins)
add(car,cy(.035,1.4,10),0,1.7,-.8,mA,{n:1,x:[0,1.9,0]});
const lidar=add(car,cy(.2,.2,28),0,2.5,-.8,mB,{x:[0,2.4,0]}),lHead=add(lidar,cy(.15,.09,24),0,.14,0,mA,{n:1});add(lHead,bx(.12,.05,.05),.17,0,0,mAccent,{n:1});
// depth camera on a front mast
add(car,cy(.025,.8,8),0,1.4,.85,mA,{n:1,x:[0,1.2,.5]});
const cam=add(car,bx(.55,.1,.12),0,1.85,.85,mB,{x:[0,1.4,.6]});[-.18,.18].forEach(x=>add(cam,bx(.07,.05,.02),x,0,.07,mAccent,{n:1}));
// RTK GPS puck + LoRa e-stop antenna
const gps=add(car,cy(.14,.07,24),-.5,1.07,-.85,mA,{x:[-.6,1.1,0]});
add(car,cy(.05,.1,12),.55,1.05,-.85,mB,{n:1,x:[.6,.7,0]});const ant=add(car,cy(.012,.9,8),.55,1.5,-.85,mA,{n:1,x:[.6,1.2,0]});
// wheels with tread lugs
const wheels=[];[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{const w=new T.Group();w.position.set(sx*.95,.42,sz*.85);
 add(w,cy(.42,.3,28),0,0,0,mT,{rz:Math.PI/2});add(w,cy(.27,.32,24),0,0,0,mB,{rz:Math.PI/2});add(w,cy(.1,.36,16),0,0,0,mAccent,{rz:Math.PI/2,n:1});
 for(let i=0;i<14;i++){const a=i/14*6.2832;add(w,bx(.3,.07,.13),0,Math.cos(a)*.44,Math.sin(a)*.44,mT,{n:1}).rotation.x=a}
 w.userData.b=w.position.clone();w.userData.d=new T.Vector3(sx*1.3,0,sz*.5);parts.push(w);car.add(w);wheels.push(w)});
// ground: grid (recoloured per theme) + platform ring
const gnd=new T.Group();S.add(gnd);const grid=new T.GridHelper(14,28);gnd.add(grid);
function applyTheme(){const light=document.documentElement.getAttribute('data-theme')==='light',accent=light?0x0f8060:0x34d399,bright=light?0x0f8060:0x6ee7b7,colors=grid.geometry.attributes.color,primary=new T.Color(accent),secondary=new T.Color(light?0x9aa3b5:0x2b323d);scanBase.copy(primary).multiplyScalar(.65);scanGlow.setHex(bright);for(let i=0;i<=28;i++){const color=i===14?primary:secondary;for(let j=i*4;j<i*4+4;j++)colors.setXYZ(j,color.r,color.g,color.b)}colors.needsUpdate=true;grid.material.transparent=true;grid.material.opacity=light?.75:.85;mAccent.color.setHex(accent);mAccent.emissive.setHex(light?0x063226:0x063226);ed.color.setHex(bright);plat.material.color.setHex(accent);rings.forEach(r=>r.material.color.setHex(accent));beam.material.color.setHex(bright);for(let i=0;i<NP;i++){const j=i*3,k=lit[i];pc[j]=scanBase.r+(scanGlow.r-scanBase.r)*k;pc[j+1]=scanBase.g+(scanGlow.g-scanBase.g)*k;pc[j+2]=scanBase.b+(scanGlow.b-scanBase.b)*k}pg.attributes.color.needsUpdate=true}
const plat=new T.Mesh(new T.RingGeometry(2.55,2.58,96),new T.MeshBasicMaterial({color:0x34d399,transparent:true,opacity:.55,side:T.DoubleSide}));plat.rotation.x=-Math.PI/2;plat.position.y=.01;S.add(plat);
// lidar scan: point cloud that lights up as range rings pass + sweeping laser
const scanG=new T.Group();S.add(scanG);
const NP=700,pp=new Float32Array(NP*3),pc=new Float32Array(NP*3),lit=new Float32Array(NP),scanBase=new T.Color(),scanGlow=new T.Color();
for(let i=0;i<NP;i++){const a=Math.random()*6.283,r=1.9+Math.sqrt(Math.random())*3.6;pp.set([Math.cos(a)*r,Math.random()<.1?Math.random()*.7:.03,Math.sin(a)*r],i*3)}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
scanG.add(new T.Points(pg,new T.PointsMaterial({size:.075,vertexColors:true,transparent:true,opacity:.95,depthWrite:false})));
const rings=[0,.5].map(()=>{const m=new T.Mesh(new T.RingGeometry(.985,1,96),new T.MeshBasicMaterial({color:0x34d399,transparent:true,side:T.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.03;scanG.add(m);return m});
const bg=new T.BufferGeometry();bg.setAttribute('position',new T.BufferAttribute(new Float32Array(6),3));
const beam=new T.Line(bg,new T.LineBasicMaterial({color:0x6ee7b7,transparent:true,opacity:.85}));beam.frustumCulled=false;scanG.add(beam);
applyTheme();
new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
// inspect tags
const TG=[['LiDAR',lidar,[0,.22,0]],['Depth camera',cam,[0,.08,.08]],['RTK GPS',gps,[0,.06,0]],['LoRa e-stop',ant,[0,.45,0]]].map(([n,o,off])=>{
 const b=document.createElement('button');b.type='button';b.className='ugv-tag';b.innerHTML='<i></i>'+n;tagBox.appendChild(b);return {n,o,off:new T.Vector3(...off),b,s:1,w:0}});
// state
const st={scan:!calm,drive:!calm,exp:false},V=new T.Vector3(),HOME=new T.Vector3(0,1.15,0);
let yaw=.62,pit=.34,rad=9.5,fit=1,tg=HOME.clone(),gT=HOME.clone(),gR=9.5,focus=null,e=1,spd=0,gz=0,vy=0,idle=0,t=0,W=1,H=1,drag=null,last=0,vis=true,raf=0;
const ctl=[...root.querySelectorAll('.ugv-ctl button')],sync=()=>ctl.forEach(b=>b.classList.toggle('on',!!st[b.dataset.m]));sync();
const used=()=>{root.classList.add('used');idle=0};
function setFocus(x){focus=x;TG.forEach(g=>g.b.classList.toggle('on',g===x));if(x){x.o.localToWorld(gT.set(0,0,0));gR=4.8}else{gT.copy(HOME);gR=9.5}}
ctl.forEach(b=>b.addEventListener('click',()=>{used();const m=b.dataset.m;if(m==='reset'){setFocus(null);yaw=.62;pit=.34;vy=0}else{st[m]=!st[m];sync()}}));
TG.forEach(g=>{g.b.addEventListener('click',()=>{used();setFocus(focus===g?null:g)});g.b.addEventListener('pointerenter',()=>g.h=1);g.b.addEventListener('pointerleave',()=>g.h=0)});
cv.addEventListener('pointerdown',ev=>{drag={x:ev.clientX,y:ev.clientY};vy=0;used();cv.setPointerCapture(ev.pointerId);root.classList.add('drag')});
cv.addEventListener('pointermove',ev=>{if(!drag)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag.x=ev.clientX;drag.y=ev.clientY;yaw-=dx*.008;pit=cl(pit+dy*.006,.1,1.25);vy=vy*.6-dx*.008*40*.4;idle=0});
const up=()=>{drag=null;root.classList.remove('drag')};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('keydown',ev=>{if(ev.key==='ArrowLeft'){yaw+=.15;used()}else if(ev.key==='ArrowRight'){yaw-=.15;used()}});
function size(){W=root.clientWidth||1;H=root.clientHeight||1;R.setSize(W,H,false);C.aspect=W/H;C.updateProjectionMatrix();fit=Math.max(1,1.05/C.aspect)}
size();new ResizeObserver(size).observe(root);
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(frame)},{rootMargin:'80px'}).observe(root);
function frame(ms){raf=0;if(!vis)return;const dt=Math.min(.05,(ms-last)/1000||.016);last=ms;t+=dt;idle+=dt;
 // assemble once the hero reveals, then follow the Explode toggle
 const eT=calm?(st.exp?1:0):(hero.classList.contains('go')?(st.exp?1:0):1);e+=(eT-e)*(1-Math.exp(-dt*3));if(Math.abs(eT-e)<.001)e=eT;
 const es=e*e*(3-2*e);
 parts.forEach(g=>g.position.copy(g.userData.b).addScaledVector(g.userData.d,es));
 // orbit: inertia, then a slow idle spin
 if(!drag){yaw+=vy*dt;vy*=Math.exp(-dt*3);if(!calm&&!focus&&idle>2.2)yaw+=dt*.2*cl((idle-2.2)/1.5,0,1)}
 tg.lerp(gT,1-Math.exp(-dt*5));rad+=(gR*fit-rad)*(1-Math.exp(-dt*5));
 C.position.set(tg.x+Math.sin(yaw)*Math.cos(pit)*rad,tg.y+Math.sin(pit)*rad,tg.z+Math.cos(yaw)*Math.cos(pit)*rad);C.lookAt(tg);
 // drive: wheels spin, ground scrolls
 spd+=((st.drive?6:0)-spd)*(1-Math.exp(-dt*2.5));wheels.forEach(w=>w.rotation.x+=spd*dt);
 gz=(gz-spd*.42*dt)%.5;grid.position.z=gz;lHead.rotation.y+=dt*(st.scan?9:1.5);
 // lidar scan
 scanG.visible=st.scan;if(st.scan){
  const f0=(t*.45)%1,f1=(t*.45+.5)%1,r0=1.2+f0*4.6,r1=1.2+f1*4.6;
  [[rings[0],f0],[rings[1],f1]].forEach(([m,f])=>{m.scale.setScalar(1.2+f*4.6);m.material.opacity=.55*(1-f)*(1-f)});
  const dz=spd*.42*dt;
  for(let i=0;i<NP;i++){const j=i*3;pp[j+2]-=dz;let x=pp[j],z=pp[j+2];const lim=Math.sqrt(Math.max(.5,31-x*x));if(z<-lim)pp[j+2]=z=lim;
   const r=Math.hypot(x,z);if(Math.abs(r-r0)<.14||Math.abs(r-r1)<.14)lit[i]=1;lit[i]=Math.max(0,lit[i]-dt*.7);const k=lit[i];
   pc[j]=scanBase.r+(scanGlow.r-scanBase.r)*k;pc[j+1]=scanBase.g+(scanGlow.g-scanBase.g)*k;pc[j+2]=scanBase.b+(scanGlow.b-scanBase.b)*k}
  pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;
  const a=t*2.2,bp=bg.attributes.position;lidar.getWorldPosition(V);bp.setXYZ(0,V.x,V.y,V.z);bp.setXYZ(1,Math.cos(a)*4.2,.02,Math.sin(a)*4.2);bp.needsUpdate=true}
 TG.forEach(g=>{const s=g.h||g===focus?1.14:1;g.s+=(s-g.s)*(1-Math.exp(-dt*10));g.o.scale.setScalar(g.s)});
 R.render(S,C);
 // tags follow their parts
 TG.forEach(g=>{g.o.localToWorld(V.copy(g.off));V.project(C);if(!g.w)g.w=g.b.offsetWidth||90;
  const x=cl((V.x*.5+.5)*W+12,2,W-g.w-2),y=cl((.5-V.y*.5)*H-14,2,H-34);g.b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'});
 raf=requestAnimationFrame(frame)}
raf=requestAnimationFrame(frame);
})();
}
