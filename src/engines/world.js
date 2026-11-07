/* eslint-disable */
import THREE from '../lib/threeLegacy';

export default function world() {
  if (window.__eng_world) return;
  window.__eng_world = 1;
(function(){
const T=THREE,cv=document.getElementById('bg'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
const rn=new T.WebGLRenderer({canvas:cv,antialias:true});rn.setPixelRatio(Math.min(devicePixelRatio,1.5));rn.setClearColor(0x06070a);
const sc=new T.Scene();sc.fog=new T.FogExp2(0x06070a,.026);
const cam=new T.PerspectiveCamera(48,1,.1,220);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),sm=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)};
// course path
const pp=[];for(let i=0;i<=16;i++)pp.push(new T.Vector3(Math.sin(i*.9)*15+Math.sin(i*.37)*8,0,-i*14));
const path=new T.CatmullRomCurve3(pp),LEN=path.getLength(),sp=path.getSpacedPoints(180);
// terrain: lidar point cloud + scan lines, with a flat corridor along the path
const noise=(x,z)=>Math.sin(x*.21)*Math.cos(z*.17)*2.4+Math.sin(x*.07+z*.11)*4.8+Math.sin(x*.55+z*.4)*.4;
const GX=150,GZ=320,X0=-75,Z0=-250,pos=new Float32Array((GX+1)*(GZ+1)*3),col=new Float32Array(pos.length),blend=new Float32Array(pos.length/3);
const lo=new T.Color(0x2d594d),hi=new T.Color(0x34d399),c=new T.Color(),terrainColor=new T.Color();let k=0;
for(let iz=0;iz<=GZ;iz++)for(let ix=0;ix<=GX;ix++){const x=X0+ix,z=Z0+iz;let d=1e9;
 for(let j=0;j<sp.length;j+=2){const dx=x-sp[j].x,dz=z-sp[j].z,q=dx*dx+dz*dz;if(q<d)d=q}
 d=Math.sqrt(d);const h=noise(x,z)*sm(3,17,d)+(d<3?Math.sin(x*3+z*2)*.04:0),mix=clamp(h/5,0,1)*.9+(d<3.4&&d>2.6?.5:0);
 pos[k]=x;pos[k+1]=h;pos[k+2]=z;blend[k/3]=mix;c.copy(lo).lerp(hi,mix);col[k]=c.r;col[k+1]=c.g;col[k+2]=c.b;k+=3}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));pg.setAttribute('color',new T.BufferAttribute(col,3));
sc.add(new T.Points(pg,new T.PointsMaterial({size:.16,vertexColors:true,transparent:true,opacity:.95})));
const lm=new T.LineBasicMaterial({color:0x3a4558,transparent:true,opacity:.75});
for(let iz=0;iz<=GZ;iz+=8){const a=new Float32Array((GX+1)*3);for(let ix=0;ix<=GX;ix++){const o=(iz*(GX+1)+ix)*3;a.set([pos[o],pos[o+1]+.01,pos[o+2]],ix*3)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));sc.add(new T.Line(g,lm))}
// light
sc.add(new T.AmbientLight(0xffffff,.5));const dl=new T.DirectionalLight(0xffffff,.9);dl.position.set(6,10,4);sc.add(dl);
// cones along the lane edges
const cm=new T.MeshStandardMaterial({color:0x34d399,emissive:0x063226,roughness:.5});
for(let i=6;i<sp.length-4;i+=7){const a=sp[i],b=sp[i+1],nx=-(b.z-a.z),nz=(b.x-a.x),l=Math.hypot(nx,nz),s=(i/7)%2?1:-1;
 const m=new T.Mesh(new T.ConeGeometry(.3,.75,10),cm);m.position.set(a.x+nx/l*s*3.4,.38,a.z+nz/l*s*3.4);sc.add(m)}
// waypoint gates
const gm=new T.MeshBasicMaterial({color:0xcfd8e8,transparent:true,opacity:.5});
[.22,.45,.68,.93].forEach(u=>{const p=path.getPointAt(u),t=path.getTangentAt(u),g=new T.Group();
 [[-3.4,2],[3.4,2]].forEach(([x,y])=>{const m=new T.Mesh(new T.BoxGeometry(.12,4,.12),gm);m.position.set(x,y,0);g.add(m)});
 const bar=new T.Mesh(new T.BoxGeometry(6.9,.12,.12),gm);bar.position.y=4;g.add(bar);g.position.copy(p);g.rotation.y=Math.atan2(-t.x,-t.z);sc.add(g)});
// the UGV
const rv=new T.Group(),wheels=[],body=new T.MeshStandardMaterial({color:0x2c323c,roughness:.45,metalness:.6}),alu=new T.MeshStandardMaterial({color:0xb9bcc0,roughness:.4,metalness:.7}),ed=new T.LineBasicMaterial({color:0x6ee7b7,transparent:true,opacity:.5});
function part(par,geo,x,y,z,m,rz){const o=new T.Mesh(geo,m);o.position.set(x,y,z);if(rz)o.rotation.z=rz;par.add(o);const e=new T.LineSegments(new T.EdgesGeometry(geo,30),ed);e.position.copy(o.position);e.rotation.copy(o.rotation);par.add(e);return o}
part(rv,new T.BoxGeometry(1.5,.42,2.5),0,.78,0,body);part(rv,new T.BoxGeometry(1.3,.08,2.1),0,1.03,0,alu);
part(rv,new T.BoxGeometry(.8,.4,.7),0,1.28,-.3,body);part(rv,new T.CylinderGeometry(.04,.04,1.3,8),0,1.7,.7,alu);
part(rv,new T.CylinderGeometry(.015,.015,1.1,6),.55,1.6,.9,alu);
[[-.95,-.9],[.95,-.9],[-.95,.9],[.95,.9]].forEach(([x,z])=>{const w=new T.Group();w.position.set(x,.42,z);part(w,new T.CylinderGeometry(.42,.42,.3,22),0,0,0,body,Math.PI/2);rv.add(w);wheels.push(w)});
const puck=new T.Group();puck.position.set(0,2.4,.7);part(puck,new T.CylinderGeometry(.22,.22,.18,20),0,0,0,alu);
const bm=new T.Mesh(new T.BoxGeometry(.05,.05,.3),new T.MeshBasicMaterial({color:0x34d399}));bm.position.set(0,0,-.2);puck.add(bm);rv.add(puck);
const hl=new T.MeshBasicMaterial({color:0xe5f4ff});[-.45,.45].forEach(x=>{const m=new T.Mesh(new T.BoxGeometry(.3,.1,.05),hl);m.position.set(x,.8,-1.26);rv.add(m)});
const lamp=new T.PointLight(0x34d399,1.2,14);lamp.position.set(0,1.5,-2.2);rv.add(lamp);sc.add(rv);
// lidar range rings on the ground
const rings=[0,.5].map(o=>{const m=new T.Mesh(new T.RingGeometry(.985,1,96),new T.MeshBasicMaterial({color:0x34d399,transparent:true,side:T.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.userData.o=o;sc.add(m);return m});
window.setWorldTheme=function(light){var c=light?0xe9edf3:0x06070a,accent=light?0x0f8060:0x34d399;rn.setClearColor(c);sc.fog.color.set(c);gm.color.set(light?0x7d8aa3:0xcfd8e8);gm.opacity=light?.6:.5;lm.color.set(light?0x6b7790:0x3a4558);lo.setHex(light?0x6f9184:0x2d594d);hi.setHex(accent);for(let i=0;i<blend.length;i++){terrainColor.copy(lo).lerp(hi,blend[i]);col[i*3]=terrainColor.r;col[i*3+1]=terrainColor.g;col[i*3+2]=terrainColor.b}pg.attributes.color.needsUpdate=true;cm.color.setHex(accent);cm.emissive.setHex(0x063226);ed.color.setHex(light?0x0f8060:0x6ee7b7);bm.material.color.setHex(accent);lamp.color.setHex(accent);rings.forEach(r=>r.material.color.setHex(accent));if(still)rn.render(sc,cam)};
window.setWorldTheme(document.documentElement.getAttribute('data-theme')==='light');
// ---- INTRO: the UGV charges in, handbrake-drifts in front of the screen, then parks as the live background rover
const INTRO=(function(){
 const root=document.documentElement,hh=location.hash,o={on:false,skip:false,step(){}};
 const unlock=()=>root.classList.remove('intro','introlock','hero-live');
 if(still||(hh&&hh!=='#'&&hh!=='#/')){unlock();return o}
 try{history.scrollRestoration='manual'}catch(e){}
 scrollTo(0,0);window.__introPending=1;o.on=true;root.classList.add('hero-live');
 const iv=rv.clone(true);iv.rotation.order='YXZ';sc.add(iv);
 const iw=iv.children.filter(c=>c.isGroup&&c.children.length===2);
 rv.visible=false;rings.forEach(r=>r.visible=false);
 const pt0=path.getPointAt(0),tn0=path.getTangentAt(0),r0=new T.Vector3(-tn0.z,0,tn0.x),upv=new T.Vector3(0,1,0);
 // soft round sprite for dust puffs and tyre marks
 const cvs=document.createElement('canvas');cvs.width=cvs.height=64;
 const c2=cvs.getContext('2d'),gr=c2.createRadialGradient(32,32,0,32,32,32);
 gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');c2.fillStyle=gr;c2.fillRect(0,0,64,64);
 const spr=new T.CanvasTexture(cvs);
 const NP=260,dpos=new Float32Array(NP*3),dcol=new Float32Array(NP*3),dvel=new Float32Array(NP*3),dage=new Float32Array(NP).fill(1),ddur=new Float32Array(NP).fill(1);
 for(let i=0;i<NP;i++)dpos[i*3+1]=-50;
 const dg=new T.BufferGeometry();dg.setAttribute('position',new T.BufferAttribute(dpos,3));dg.setAttribute('color',new T.BufferAttribute(dcol,3));
 const dust=new T.Points(dg,new T.PointsMaterial({size:1.3,map:spr,vertexColors:true,transparent:true,opacity:.9,depthWrite:false}));dust.frustumCulled=false;sc.add(dust);
 const NS=1800,spos=new Float32Array(NS*3),sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(spos,3));sg.setDrawRange(0,0);
 const skid=new T.Points(sg,new T.PointsMaterial({size:.22,map:spr,color:0x8a93a6,transparent:true,opacity:.5,depthWrite:false}));skid.frustumCulled=false;sc.add(skid);
 let ns=0,ni=0;
 function spawn(x,y,z){const k=ni++%NP;dpos[k*3]=x+(Math.random()-.5)*.5;dpos[k*3+1]=y+.1;dpos[k*3+2]=z+(Math.random()-.5)*.5;dvel[k*3]=(Math.random()-.5)*2.6;dvel[k*3+1]=.5+Math.random()*1.4;dvel[k*3+2]=(Math.random()-.5)*2.6;dage[k]=0;ddur[k]=.9+Math.random()*.8}
 function mark(x,z){if(ns<NS){spos[ns*3]=x;spos[ns*3+1]=.04;spos[ns*3+2]=z;ns++;sg.setDrawRange(0,ns);sg.attributes.position.needsUpdate=true}}
 // timeline (seconds): charge in -> handbrake flick -> slide settles -> park -> hand over to the live rover
 const ez=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eob=u=>1+3.2*Math.pow(u-1,3)+2.2*Math.pow(u-1,2);
 const TF=1.6,TD=3.0,TS=3.9,TR=1.4,TE=5.1,B0=46,BE=-2.2;
 const bAt=t=>t<TD?BE+(B0-BE)*Math.pow(1-t/TD,1.7):t<TS?BE*(1-ez((t-TD)/(TS-TD))):0;
 const psiAt=t=>t<TF?Math.PI:t<TD?Math.PI*(1-eob((t-TF)/(TD-TF))):.14*Math.exp(-4*(t-TD))*Math.sin(11*(t-TD));
 const aAt=t=>{const s=TF-.3;if(t<s||t>TS)return 0;const u=clamp((t-s)/(TS-s),0,1);return 2.4*Math.sin(Math.PI*u)*(1-u*.4)};
 const tP=new T.Vector3(),tT=new T.Vector3(),tR=new T.Vector3(),tW=new T.Vector3(),camI=new T.Vector3(),lkc=new T.Vector3(),lkB=new T.Vector3(),tgt=new T.Vector3();
 const bgc=[.024,.027,.04],dsc=[.42,.47,.58];
 const tele=document.getElementById('introTele'),sk=document.getElementById('skipIntro');
 if(sk)sk.onclick=()=>{o.skip=true};
 addEventListener('keydown',e=>{if(o.on&&e.key==='Escape')o.skip=true});addEventListener('scroll',()=>{if(o.on&&scrollY>80)o.skip=true},{passive:true});
 let t0=null,n=0,pT=0,pPsi=Math.PI,prevB=B0,revealed=false;
 o.step=function(ms,cp,lk){
  if(t0===null||n++<2)t0=ms;
  let t=(ms-t0)/1000;if(o.skip)t=Math.max(t,TE);
  const dt=Math.max(.001,Math.min(.05,t-pT));pT=t;
  const b=bAt(t),psi=psiAt(t),a=aAt(t);
  if(b>=0){const u=clamp(b/LEN,0,1);path.getPointAt(u,tP);path.getTangentAt(u,tT)}else{tP.copy(pt0).addScaledVector(tn0,b);tT.copy(tn0)}
  tR.set(-tT.z,0,tT.x);
  const drift=t>TF-.15&&t<TD+.3,env=Math.sin(Math.PI*clamp((t-TF)/(TD-TF),0,1)),rate=(psi-pPsi)/dt;pPsi=psi;
  iv.position.copy(tP).addScaledVector(tR,a);iv.position.y=.02+(t<TS?Math.abs(Math.sin(t*38))*.012:0);
  iv.rotation.y=Math.atan2(-tT.x,-tT.z)+psi;
  iv.rotation.z=t<TS+1?clamp(-.045*rate,-.28,.28):0;iv.rotation.x=-.07*env;
  const vb=(b-prevB)/dt;prevB=b;
  iw.forEach(w=>{w.rotation.x-=(vb*dt*Math.cos(psi))/.42+(drift?.35:0)});
  iv.updateMatrixWorld(true);
  if(drift){iw.forEach(w=>{tW.setFromMatrixPosition(w.matrixWorld);mark(tW.x,tW.z);if(w.position.z>0){spawn(tW.x,tW.y,tW.z);spawn(tW.x,tW.y,tW.z)}})}
  for(let i=0;i<NP;i++){if(dage[i]<1){dage[i]+=dt/ddur[i];const f=Math.max(0,1-dage[i])*.9;
    dpos[i*3]+=dvel[i*3]*dt;dpos[i*3+1]+=dvel[i*3+1]*dt;dpos[i*3+2]+=dvel[i*3+2]*dt;dvel[i*3]*=.97;dvel[i*3+2]*=.97;
    for(let c=0;c<3;c++)dcol[i*3+c]=bgc[c]+(dsc[c]-bgc[c])*f}else dpos[i*3+1]=-50}
  dg.attributes.position.needsUpdate=true;dg.attributes.color.needsUpdate=true;
  // camera: low trackside shot, shake + FOV punch in the slide, then pull back to the normal background shot
  tgt.copy(iv.position);tgt.y+=.7;if(t<.1)lkc.copy(tgt);else lkc.lerp(tgt,.16);
  const ac=5.4-.6*clamp(t/2.6,0,1),sh=env*.05;
  camI.copy(pt0).addScaledVector(r0,ac).addScaledVector(upv,1.25).addScaledVector(tn0,-5.2);
  camI.x+=Math.sin(t*61)*sh;camI.y+=Math.sin(t*47)*sh*.7;camI.z+=Math.sin(t*53)*sh;
  const B=ez(clamp((t-3)/2.1,0,1));
  cam.position.copy(camI).lerp(cp,B);lkB.copy(lkc).lerp(lk,B);cam.lookAt(lkB);
  cam.fov=48+7*env;cam.updateProjectionMatrix();
  if(tele)tele.textContent='SPD '+String(Math.round(Math.abs(vb)*3.2)).padStart(3,'0')+' KM/H · YAW '+String(Math.round(Math.abs(psi*57.3)%360)).padStart(3,'0')+'° · TRACTION '+(drift?'OFF':'ON');
  if(!revealed&&t>=TR){revealed=true;root.classList.remove('intro');window.__startBrand&&__startBrand()}
  if(t>=TE){o.on=false;iv.visible=false;dust.visible=false;rv.visible=true;rings.forEach(r=>r.visible=true);cam.fov=48;cam.updateProjectionMatrix();unlock();window.__startBrand&&__startBrand()}
 };
 return o;
})();
// camera shots in the rover's frame: [right, up, back]
const K=[[7,3.4,9.5],[-8,2.4,6],[0,15,2.5],[9,1.4,5.5],[-3.5,5.5,13],[0,2.8,7.5]];
const hud=document.createElement('div');hud.id='hud';hud.style.cssText='position:fixed;right:clamp(16px,3vw,40px);bottom:20px;z-index:40;font:500 11px var(--mono);letter-spacing:.12em;color:var(--t2);pointer-events:none;text-align:right';document.body.appendChild(hud);
let p=0,tp=0,ptr=[0,0],last=0,dist=0;const cp=new T.Vector3(),up=new T.Vector3(0,1,0);let first=1;
addEventListener('pointermove',e=>{ptr=[e.clientX/innerWidth-.5,e.clientY/innerHeight-.5]});
function rz(){rn.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}rz();addEventListener('resize',rz);
let maxS=1,mainS=1,lastRender=0;const subPg=()=>['t','b','pg'].some(c=>document.body.classList.contains(c));const rs=()=>{maxS=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(!subPg())mainS=maxS};rs();addEventListener('resize',rs);addEventListener('load',rs);if(window.ResizeObserver)new ResizeObserver(rs).observe(document.body);
function frame(ms){const dt=Math.min(.05,(ms-last)/1000||.016);last=ms;
 tp=clamp(scrollY/(subPg()?Math.max(mainS,maxS,innerHeight*5):maxS),0,1)*.985;const before=p;p+=(tp-p)*(still?1:1-Math.exp(-dt*(subPg()?1.4:3.7)));
 const pt=path.getPointAt(p),tn=path.getTangentAt(p);rv.position.copy(pt);rv.position.y=.02+Math.sin(ms*.004)*.01*(Math.abs(p-before)>1e-5);rv.rotation.y=Math.atan2(-tn.x,-tn.z);
 const d=(p-before)*LEN;dist+=Math.abs(d);wheels.forEach(w=>w.rotation.x-=d/.42);puck.rotation.y+=still?0:.25;
 rings.forEach(r=>{const f=((ms*.00035+r.userData.o)%1);r.position.set(pt.x,.06,pt.z);r.scale.setScalar(.5+f*16);r.material.opacity=.4*(1-f)*(1-f)});
 // camera: interpolate shots by scroll
 const s=p/.985*(K.length-1),i=Math.min(K.length-2,Math.floor(s)),f=sm(0,1,s-i),a=K[i],b=K[i+1];
 const ox=a[0]+(b[0]-a[0])*f+ptr[0]*2.5,oy=a[1]+(b[1]-a[1])*f-ptr[1]*1.5,oz=a[2]+(b[2]-a[2])*f;
 const r=new T.Vector3(-tn.z,0,tn.x);cp.copy(pt).addScaledVector(r,ox).addScaledVector(up,oy).addScaledVector(tn,-oz);
 if(first){cam.position.copy(cp);first=0}else cam.position.lerp(cp,still?1:1-Math.exp(-dt*4.4));
 {const lk=new T.Vector3(pt.x+tn.x*2.5,pt.y+1.1,pt.z+tn.z*2.5);if(INTRO.on)INTRO.step(ms,cp,lk);else cam.lookAt(lk)}
 hud.textContent='Odometer '+String(Math.round(p*LEN)).padStart(4,'0')+' m';
 if(!document.body.classList.contains('b')||ms-lastRender>=1000/30){rn.render(sc,cam);lastRender=ms}if(!still)requestAnimationFrame(frame)}
requestAnimationFrame(frame);if(still)addEventListener('scroll',()=>frame(performance.now()),{passive:true});
})();
}
